import type { ContentRoleId } from "@/content/content-roles";
import { getContentRoleLabel } from "@/content/content-roles";
import { getFormatLabel } from "@/content/formats";
import { INSPIRATION_ALL_SOURCE_ID } from "@/content/idea-sources";
import {
  buildInspirationFeed,
  hydrateInspirationFeed,
  type InspirationFeedItem,
} from "@/content/inspiration-feed";
import { INSPIRATION_MATCH_WEIGHTS } from "@/content/inspiration-match-config";
import { getPlanningPillarLabel } from "@/content/planning-pillars";
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
  alcance: ["hook", "viral", "scroll", "tendencia", "meme", "alcance", "parar"],
  valor: ["cómo", "guia", "guía", "tutorial", "tip", "método", "razones", "aprender"],
  prueba: ["demo", "caso", "testimonio", "antes", "después", "resultado", "prueba"],
  conversion: ["cta", "gratis", "probar", "registr", "oferta", "probar"],
  marca: ["marca", "posición", "filosof", "visión", "identidad"],
  comunidad: ["pregunta", "opin", "comentario", "comunidad"],
};

const PILLAR_KEYWORDS: Record<string, string[]> = {
  "ventas-atencion": ["whatsapp", "consulta", "venta", "atención", "chat", "cliente"],
  "inventario-stock": ["stock", "inventario", "faltante", "reposición"],
  "pedidos-logistica": ["pedido", "envío", "logística", "retiro"],
  "pagos-cobros": ["pago", "cobro", "cobrar", "plata"],
  "catalogo-ecommerce": ["catálogo", "tienda", "ecommerce", "producto"],
  "operacion-gestion": ["planilla", "excel", "caos", "operar", "desorden"],
  "marketing-crecimiento": ["clientes", "crecimiento", "ads", "campaña"],
  "automatizacion-ia": ["ia", "automat", "agente", "manual"],
  "equipo-sucursales": ["equipo", "empleado", "sucursal"],
  "clientes-fidelizacion": ["fidel", "recompra", "postventa"],
  "numeros-negocio": ["margen", "número", "ticket", "rentab"],
  "producto-mercantis": ["feature", "demo", "funcionalidad", "software"],
  emprendimiento: ["emprender", "negocio", "dueño"],
  "mercado-tendencias": ["tendencia", "mercado", "noticia"],
};

export type RankedInspiration = {
  item: InspirationFeedItem;
  score: number;
  compatibility: number;
  usage: InspirationUsage;
  reasons: string[];
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

  if (formatIds.has(slot.formatId)) {
    const fromAffinity = item.formatAffinities?.includes(slot.formatId);
    score += fromAffinity && !item.formatIds?.includes(slot.formatId)
      ? w.formatAffinity
      : w.sameFormat;
    reasons.push(`Mismo formato: ${getFormatLabel(slot.formatId)}`);
  } else if (item.formatAffinities?.length) {
    // afinidad declarada a otros formatos: no suma, no inventa match
  }

  if (item.pillarAffinities?.includes(slot.pillarId)) {
    score += w.pillarAffinity;
    reasons.push(`Afín a ${getPlanningPillarLabel(slot.pillarId)}`);
  } else {
    const pillarHits = keywordHits(text, PILLAR_KEYWORDS[slot.pillarId] ?? []);
    if (pillarHits > 0) {
      score += Math.min(w.pillarKeywordCap, pillarHits * w.pillarKeyword);
      reasons.push(`Afín a ${getPlanningPillarLabel(slot.pillarId)}`);
    }
  }

  if (item.roleAffinities?.includes(slot.roleId)) {
    score += w.roleAffinity;
    reasons.push(`Afín a ${getContentRoleLabel(slot.roleId)}`);
  } else {
    const roleHits = keywordHits(text, ROLE_KEYWORDS[slot.roleId] ?? []);
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
    (slot.roleId === "valor" || slot.roleId === "comunidad")
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
