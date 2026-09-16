import { normalizePercentTargets } from "../lib/planning-percent.ts";

export type ContentRoleId =
  | "build_in_public"
  | "educacion"
  | "producto"
  | "marca"
  | "evidencia"
  | "comunidad";

export type ContentRole = {
  id: ContentRoleId;
  label: string;
  summary: string;
};

const CONTENT_ROLE_IDS = new Set<ContentRoleId>([
  "build_in_public",
  "educacion",
  "producto",
  "marca",
  "evidencia",
  "comunidad",
]);

/** IDs que se descartan del mix y se redistribuyen. */
const DROPPED_ROLE_IDS = new Set(["alcance", "conversion"]);

const CURRENT_CORE_IDS = new Set([
  "build_in_public",
  "build-in-public",
  "educacion",
  "producto",
  "evidencia",
]);

/**
 * IDs legacy → taxonomía actual (para slots y afinidades).
 * Alcance y conversión no son roles: el mix los descarta y redistribuye.
 * En un slot suelto hace falta un fallback válido.
 */
export const CONTENT_ROLE_MIGRATION: Record<string, ContentRoleId> = {
  valor: "educacion",
  alcance: "educacion",
  prueba: "producto",
  conversion: "producto",
  "build-in-public": "build_in_public",
};

/** Mix oficial por defecto (suma 100). */
export const DEFAULT_ROLE_TARGETS_OFFICIAL: Record<ContentRoleId, number> = {
  build_in_public: 35,
  educacion: 20,
  producto: 15,
  marca: 15,
  evidencia: 10,
  comunidad: 5,
};

/** Rol = mundo editorial. Alcance, valor y conversión no son roles. */
export const contentRoles: ContentRole[] = [
  {
    id: "build_in_public",
    label: "Build in Public / Proceso",
    summary:
      "Detrás de escena de construir Mercantis: avances, decisiones, hitos, errores y aprendizajes.",
  },
  {
    id: "educacion",
    label: "Educación",
    summary:
      "Enseñar algo útil y aplicable para dueños de negocio en LATAM: stock, ventas, catálogo, procesos.",
  },
  {
    id: "producto",
    label: "Producto / Demostración",
    summary:
      "Mostrar Mercantis funcionando: features, workflows, pantallas, demos y antes/después.",
  },
  {
    id: "marca",
    label: "Marca / Posicionamiento",
    summary:
      "Instalar una postura o filosofía clara. Mercantis no suena neutral ni tibio.",
  },
  {
    id: "evidencia",
    label: "Evidencia",
    summary:
      "Señales externas de que Mercantis funciona: clientes, citas, resultados, historias y feedback.",
  },
  {
    id: "comunidad",
    label: "Comunidad / Conversación",
    summary:
      "Generar identificación y participación: preguntas, opiniones, situaciones reconocibles o respuestas en video a preguntas sobre la empresa.",
  },
];

const roleById = new Map(contentRoles.map((role) => [role.id, role]));

export function isContentRoleId(id: string): id is ContentRoleId {
  return CONTENT_ROLE_IDS.has(id as ContentRoleId);
}

export function normalizeRoleId(id: string): ContentRoleId {
  if (isContentRoleId(id)) return id;
  return CONTENT_ROLE_MIGRATION[id] ?? "educacion";
}

function looksLikeLegacyRoleMix(keys: string[]): boolean {
  const hasOldSixShape =
    keys.includes("alcance") && keys.includes("valor") && keys.includes("prueba");
  const hasCurrentCore = keys.some((key) => CURRENT_CORE_IDS.has(key));
  return hasOldSixShape && !hasCurrentCore;
}

/**
 * Migra un mix persistido a la taxonomía actual y deja los porcentajes en 100.
 * Alcance y conversión se descartan y su peso se reparte entre los roles válidos.
 */
export function normalizeRoleTargets(
  targets: Partial<Record<string, number>> | undefined,
): Record<ContentRoleId, number> {
  const keys = Object.keys(targets ?? {});
  if (keys.length === 0 || looksLikeLegacyRoleMix(keys)) {
    return { ...DEFAULT_ROLE_TARGETS_OFFICIAL };
  }

  const mapped: Partial<Record<ContentRoleId, number>> = {};
  let droppedWeight = 0;

  for (const [key, value] of Object.entries(targets ?? {})) {
    if (typeof value !== "number" || Number.isNaN(value) || value <= 0) continue;
    if (DROPPED_ROLE_IDS.has(key)) {
      droppedWeight += value;
      continue;
    }
    if (!isContentRoleId(key) && !(key in CONTENT_ROLE_MIGRATION)) {
      droppedWeight += value;
      continue;
    }
    const roleId = normalizeRoleId(key);
    mapped[roleId] = (mapped[roleId] ?? 0) + value;
  }

  const mappedEntries = Object.entries(mapped).filter(
    (entry): entry is [ContentRoleId, number] => (entry[1] ?? 0) > 0,
  );
  if (mappedEntries.length === 0) {
    return { ...DEFAULT_ROLE_TARGETS_OFFICIAL };
  }

  if (droppedWeight > 0) {
    const mappedTotal = mappedEntries.reduce((sum, [, value]) => sum + value, 0);
    for (const [roleId, value] of mappedEntries) {
      mapped[roleId] = value + (droppedWeight * value) / mappedTotal;
    }
  }

  return normalizePercentTargets(mapped as Record<ContentRoleId, number>);
}

export function getContentRoleLabel(id: ContentRoleId | string): string {
  return roleById.get(normalizeRoleId(id))?.label ?? id;
}

export function getContentRoleSummary(id: ContentRoleId | string): string {
  return roleById.get(normalizeRoleId(id))?.summary ?? "";
}

/** CTA transversal: no define el rol. */
export const CONTENT_ROLE_CTA_GUIDELINE =
  "Todas las piezas pueden incluir un CTA. El CTA no define el rol y debe adaptarse a la pieza. Evitar publicaciones cuyo único propósito sea promocional, salvo campañas creadas a mano.";
