import type { ContentRoleId } from "@/content/content-roles";
import { getContentRoleLabel, normalizeRoleId } from "@/content/content-roles";
import { getFormatLabel } from "@/content/formats";
import { INSPIRATION_ALL_SOURCE_ID } from "@/content/idea-sources";
import type { InspirationMatchCandidate, InspirationMatchMode } from "@/content/inspiration-analysis";
import {
  buildInspirationFeed,
  getInspirationsByAssetId,
  hydrateInspirationFeed,
  type InspirationFeedItem,
} from "@/content/inspiration-feed";
import { INSPIRATION_HYBRID_WEIGHTS, INSPIRATION_MATCH_WEIGHTS } from "@/content/inspiration-match-config";
import { getSlotTopicLabel, resolveSlotTopicId } from "@/content/role-topics";
import type { PlanningSlot } from "@/content/planned-slots";
import type { Proposal } from "@/content/proposals";
import type { SlotSpecRecord } from "@/content/slot-specs";
import type { InspirationMetaOverride } from "@/lib/inspiration-overrides-store";
import {
  usageForInspiration,
  type InspirationUsage,
} from "@/lib/inspiration-usage";

export type { InspirationUsage } from "@/lib/inspiration-usage";
export { formatInspirationUsage, usageForInspiration } from "@/lib/inspiration-usage";

const ROLE_KEYWORDS: Record<ContentRoleId, string[]> = {
  build_in_public: ["hoy", "esta semana", "feature", "lanzamos", "reunión", "aprendimos", "error", "proceso"],
  educacion: ["cómo", "guia", "guía", "tutorial", "tip", "método", "razones", "aprender", "error"],
  producto: ["demo", "feature", "pantalla", "workflow", "software", "funciona", "descuenta"],
  marca: ["marca", "posición", "filosof", "visión", "identidad", "sistema"],
  evidencia: ["testimonio", "cliente", "caso", "resultado", "reseña", "adopción", "métrica"],
  comunidad: ["pregunta", "opin", "comentario", "comunidad", "te consume", "me pregunt", "respond"],
};

const TOPIC_KEYWORDS: Record<string, string[]> = {
  ventas_atencion: ["whatsapp", "consulta", "venta", "atención", "chat"],
  inventario_stock: ["stock", "inventario", "faltante", "reposición"],
  pedidos_logistica: ["pedido", "envío", "logística", "retiro"],
  pagos_cobros: ["pago", "cobro", "cobrar", "plata"],
  catalogo_ecommerce: ["catálogo", "tienda", "ecommerce", "ficha"],
  operacion_gestion: ["planilla", "excel", "caos", "operar", "desorden"],
  conversion_trafico: ["conversión", "tráfico", "clientes", "campaña"],
  automatizacion_ia: ["ia", "automat", "agente", "manual"],
  equipo_delegacion: ["equipo", "empleado", "deleg"],
  clientes_fidelizacion: ["fidel", "recompra", "postventa"],
  numeros_negocio: ["margen", "número", "ticket", "métrica"],
  digitalizacion_sistemas: ["excel", "whatsapp", "planilla", "fragment"],
  stock_variantes: ["stock", "variante", "sku"],
  ia_catalogo: ["ia", "catálogo", "import", "título"],
  whatsapp: ["whatsapp", "chat", "consulta"],
  casos_clientes: ["cliente", "caso", "testimonio"],
  dolores_operativos: ["stock", "pedido", "whatsapp", "caos"],
  sistema_operativo_negocio: ["sistema", "operar", "negocio"],
  simplicidad_vs_complejidad: ["simple", "complej", "erp"],
  producto_en_construccion: ["feature", "lanzamos", "constru"],
  crecimiento_distribucion: ["tiktok", "contenido", "distrib"],
};

export type RankedInspiration = {
  item: InspirationFeedItem;
  score: number;
  compatibility: number;
  usage: InspirationUsage;
  reasons: string[];
  similarity?: number;
  confidence?: number;
  mode?: InspirationMatchMode;
};

export type InspirationMatchContext = {
  slot: PlanningSlot;
  proposals: Proposal[];
  specs?: SlotSpecRecord[];
  slots?: PlanningSlot[];
  overrides?: Record<string, InspirationMetaOverride>;
  now?: number;
  limit?: number;
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const GENERIC_VISUAL_NOTE = /referencia visual de cosmos/i;

function haystack(item: InspirationFeedItem) {
  return normalize(
    [
      item.title,
      item.note,
      item.postText,
      item.quote,
      item.author,
      item.signal,
      item.creativeMechanism,
      ...(item.notes ?? []),
    ]
      .filter((part): part is string => Boolean(part))
      .filter((part) => !GENERIC_VISUAL_NOTE.test(part))
      .join(" "),
  );
}

function keywordHits(text: string, keywords: string[]) {
  return keywords.filter((keyword) => text.includes(normalize(keyword))).length;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function compatibilityPercent(score: number) {
  return clamp(Math.round(score), 0, 100);
}

function scoreItem(
  item: InspirationFeedItem,
  slot: PlanningSlot,
  usage: InspirationUsage,
  now: number,
): { score: number; reasons: string[] } {
  const w = INSPIRATION_MATCH_WEIGHTS;
  let score = w.base;
  const reasons: string[] = [];
  const text = haystack(item);
  const formatIds = new Set([
    ...(item.formatIds ?? []),
    ...(item.formatAffinities ?? []),
  ]);

  if (slot.formatId && formatIds.has(slot.formatId)) {
    const fromAffinity = item.formatAffinities?.includes(slot.formatId);
    score += fromAffinity && !item.formatIds?.includes(slot.formatId)
      ? w.formatAffinity
      : w.sameFormat;
    reasons.push(`Mismo formato: ${getFormatLabel(slot.formatId)}`);
  } else if (item.formatAffinities?.length) {
    // afinidad declarada a otros formatos: no suma, no inventa match
  }

  const topicId = resolveSlotTopicId(slot);
  const topicLabel = getSlotTopicLabel(slot);
  if (
    item.pillarAffinities?.includes(topicId) ||
    (slot.pillarId && item.pillarAffinities?.includes(slot.pillarId))
  ) {
    score += w.pillarAffinity;
    reasons.push(`Afín a ${topicLabel}`);
  } else {
    const topicHits = keywordHits(text, TOPIC_KEYWORDS[topicId] ?? []);
    if (topicHits > 0) {
      score += Math.min(w.pillarKeywordCap, topicHits * w.pillarKeyword);
      reasons.push(`Afín a ${topicLabel}`);
    }
  }

  if (item.roleAffinities?.includes(normalizeRoleId(slot.roleId))) {
    score += w.roleAffinity;
    reasons.push(`Afín a ${getContentRoleLabel(slot.roleId)}`);
  } else {
    const roleHits = keywordHits(text, ROLE_KEYWORDS[normalizeRoleId(slot.roleId)] ?? []);
    if (roleHits > 0) {
      score += Math.min(w.roleKeywordCap, roleHits * w.roleKeyword);
      reasons.push(`Afín a ${getContentRoleLabel(slot.roleId)}`);
    }
  }

  if (item.angleAffinities?.length) {
    score += w.angleAffinity;
  }

  if (
    item.materialType === "example" &&
    slot.formatId &&
    formatIds.has(slot.formatId)
  ) {
    score += w.exampleWithFormat;
  }
  const hasDeclaredAffinity =
    Boolean(item.pillarAffinities?.length) ||
    Boolean(item.roleAffinities?.length) ||
    Boolean(item.formatAffinities?.length) ||
    Boolean(item.formatIds?.length);
  if (item.origin === "visual-reference" && !hasDeclaredAffinity) {
    score -= w.unclassifiedVisualPenalty;
  }
  if (
    item.materialType === "suggestion" &&
    (normalizeRoleId(slot.roleId) === "educacion" ||
      normalizeRoleId(slot.roleId) === "comunidad")
  ) {
    score += w.suggestionForValueCommunity;
    reasons.push("Sugerencia de contenido");
  }

  if (usage.count === 0) {
    score += w.unusedBonus;
    reasons.push("Todavía no se usó");
  } else {
    score -= Math.min(w.perUsePenaltyCap, usage.count * w.perUsePenalty);
    const recentMs = w.recentUseDays * 24 * 60 * 60 * 1000;
    if (usage.lastUsedAt && now - Date.parse(usage.lastUsedAt) < recentMs) {
      score -= w.recentUsePenalty;
      reasons.push("Usada hace poco");
    } else {
      reasons.push("Ya se adaptó antes");
    }
    if (usage.angleIds.length > 0) {
      score -= Math.min(w.repeatedAnglePenalty * 2, usage.angleIds.length * 3);
      reasons.push("Cuidado con repetir el mismo ángulo");
    }
  }

  return { score, reasons: reasons.slice(0, 4) };
}

function affinityAndUsage(item: InspirationFeedItem, slot: PlanningSlot, usage: InspirationUsage, now: number) {
  const w = INSPIRATION_MATCH_WEIGHTS;
  const { score, reasons } = scoreItem(item, slot, usage, now);
  let usageDelta = 0;
  if (usage.count === 0) usageDelta += w.unusedBonus;
  else {
    usageDelta -= Math.min(w.perUsePenaltyCap, usage.count * w.perUsePenalty);
    const recentMs = w.recentUseDays * 24 * 60 * 60 * 1000;
    if (usage.lastUsedAt && now - Date.parse(usage.lastUsedAt) < recentMs) {
      usageDelta -= w.recentUsePenalty;
    }
    if (usage.angleIds.length > 0) {
      usageDelta -= Math.min(w.repeatedAnglePenalty * 2, usage.angleIds.length * 3);
    }
  }
  return {
    affinity: score - w.base - usageDelta,
    usageDelta,
    total: score,
    reasons,
  };
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function normalizeAffinity(raw: number) {
  return clamp01((raw + 12) / 92);
}

function normalizeUsage(usage: InspirationUsage, now: number) {
  if (usage.count === 0) return 1;
  let value = 1 - Math.min(0.6, usage.count * 0.12);
  const recentMs = INSPIRATION_MATCH_WEIGHTS.recentUseDays * 24 * 60 * 60 * 1000;
  if (usage.lastUsedAt && now - Date.parse(usage.lastUsedAt) < recentMs) {
    value -= 0.25;
  }
  return clamp01(value);
}

function cameraVisualAffinity(
  slotCamera: PlanningSlot["cameraPresence"],
  productionCamera?: string,
) {
  if (!slotCamera || !productionCamera) return 0.5;
  if (slotCamera === "off-camera" && productionCamera === "required") return 0;
  if (slotCamera === "off-camera" && productionCamera === "none") return 1;
  if (slotCamera === "off-camera" && productionCamera === "optional") return 0.7;
  if (
    (slotCamera === "on-camera" || slotCamera === "needs-guest") &&
    productionCamera === "required"
  ) {
    return 1;
  }
  if (
    (slotCamera === "on-camera" || slotCamera === "needs-guest") &&
    productionCamera === "none"
  ) {
    return 0.4;
  }
  return 0.65;
}

export function rankHybridCandidates(
  context: InspirationMatchContext,
  candidates: InspirationMatchCandidate[],
  mode: InspirationMatchMode,
): RankedInspiration[] {
  const now = context.now ?? Date.now();
  const specs = context.specs ?? [];
  const slots = context.slots ?? [context.slot];
  const weights = INSPIRATION_HYBRID_WEIGHTS[mode];
  const cap = context.limit ?? INSPIRATION_HYBRID_WEIGHTS.displayLimit;
  const ranked: RankedInspiration[] = [];
  const seen = new Set<string>();

  for (const candidate of candidates) {
      const items = getInspirationsByAssetId(
        candidate.assetId,
        context.overrides ?? {},
      );
    for (const item of items) {
      if (seen.has(item.key)) continue;
      seen.add(item.key);
      const usage = usageForInspiration(item.key, context.proposals, specs, slots);
      const parts = affinityAndUsage(item, context.slot, usage, now);
      const formatRoleAffinity = normalizeAffinity(parts.affinity);
      const camera = cameraVisualAffinity(
        context.slot.cameraPresence,
        candidate.production?.cameraPresence,
      );
      const affinity01 =
        mode === "visual"
          ? formatRoleAffinity * 0.7 + camera * 0.3
          : formatRoleAffinity;
      const usage01 = normalizeUsage(usage, now);
      const similarity = clamp01(candidate.similarity);
      const confidence = clamp01(candidate.confidence ?? 1);
      let score01 =
        weights.semantic * similarity +
        weights.affinity * affinity01 +
        weights.usage * usage01;
      score01 *= 1 - INSPIRATION_HYBRID_WEIGHTS.lowConfidencePenalty * (1 - confidence);

      const reasons = [...parts.reasons];
      if (confidence < 0.45) reasons.unshift("Certeza baja del análisis");
      else if (similarity >= 0.72) {
        reasons.unshift(mode === "visual" ? "Lenguaje visual similar" : "Mecanismo similar");
      }

      ranked.push({
        item,
        score: score01 * 100,
        compatibility: Math.round(clamp01(score01) * 100),
        usage,
        reasons: reasons.slice(0, 2),
        similarity,
        confidence,
        mode,
      });
    }
  }

  return ranked
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, cap);
}

export function rankInspirationsForSlot(
  context: InspirationMatchContext | PlanningSlot,
  proposals?: Proposal[],
  limit = 6,
): RankedInspiration[] {
  const ctx: InspirationMatchContext =
    "id" in context && "roleId" in context && !("slot" in context)
      ? { slot: context, proposals: proposals ?? [], limit }
      : (context as InspirationMatchContext);

  const now = ctx.now ?? Date.now();
  const specs = ctx.specs ?? [];
  const slots = ctx.slots ?? [ctx.slot];
  const items = hydrateInspirationFeed(
    buildInspirationFeed(INSPIRATION_ALL_SOURCE_ID),
    ctx.overrides ?? {},
  );
  const cap = ctx.limit ?? limit;

  return items
    .map((item) => {
      const usage = usageForInspiration(item.key, ctx.proposals, specs, slots);
      const { score, reasons } = scoreItem(item, ctx.slot, usage, now);
      return {
        item,
        score,
        compatibility: compatibilityPercent(score),
        usage,
        reasons,
      };
    })
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, cap);
}
