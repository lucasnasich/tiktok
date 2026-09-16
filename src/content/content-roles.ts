export type ContentRoleId =
  | "educacion"
  | "producto"
  | "evidencia"
  | "build-in-public"
  | "marca"
  | "comunidad"
  | "conversion";

export type ContentRole = {
  id: ContentRoleId;
  label: string;
  summary: string;
};

/**
 * IDs legacy → taxonomía actual.
 * Alcance deja de ser un rol: se reparte a Educación (enseñar un dolor/tema
 * útil) porque el alcance es una cualidad transversal, no un mix editorial.
 * Prueba se parte: fallback automático a Producto / Demostración.
 */
export const CONTENT_ROLE_MIGRATION: Record<string, ContentRoleId> = {
  valor: "educacion",
  alcance: "educacion",
  prueba: "producto",
  "build_in_public": "build-in-public",
};

const CONTENT_ROLE_IDS = new Set<ContentRoleId>([
  "educacion",
  "producto",
  "evidencia",
  "build-in-public",
  "marca",
  "comunidad",
  "conversion",
]);

/** Rol estratégico del contenido — mundo editorial, no un objetivo genérico. */
export const contentRoles: ContentRole[] = [
  {
    id: "educacion",
    label: "Educación",
    summary:
      "Enseñar algo útil que el usuario pueda aplicar: tips, frameworks, errores, explicaciones.",
  },
  {
    id: "producto",
    label: "Producto / Demostración",
    summary:
      "Mostrar Mercantis funcionando: features, workflows, pantallas, antes/después del producto.",
  },
  {
    id: "evidencia",
    label: "Evidencia",
    summary:
      "Señales externas de que Mercantis funciona: clientes, testimonios, resultados, adopción.",
  },
  {
    id: "build-in-public",
    label: "Build in Public / Proceso",
    summary:
      "Detrás de escena de construir Mercantis: avances, decisiones, hitos, errores y aprendizajes.",
  },
  {
    id: "marca",
    label: "Marca / Posicionamiento",
    summary:
      "Instalar una visión, postura o filosofía. No necesariamente enseñar ni mostrar producto.",
  },
  {
    id: "comunidad",
    label: "Comunidad / Conversación",
    summary:
      "Generar identificación, participación o debate: preguntas, opiniones, experiencias.",
  },
  {
    id: "conversion",
    label: "Conversión",
    summary:
      "Pedir una acción concreta: registro, prueba, demo o visita a Mercantis. Con moderación.",
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

export function normalizeRoleTargets(
  targets: Partial<Record<string, number>> | undefined,
): Partial<Record<ContentRoleId, number>> {
  const result: Partial<Record<ContentRoleId, number>> = {};
  for (const [key, value] of Object.entries(targets ?? {})) {
    if (typeof value !== "number" || Number.isNaN(value) || value <= 0) continue;
    const roleId = normalizeRoleId(key);
    result[roleId] = (result[roleId] ?? 0) + value;
  }
  return result;
}

export function getContentRoleLabel(id: ContentRoleId | string): string {
  return roleById.get(normalizeRoleId(id))?.label ?? id;
}

export function getContentRoleSummary(id: ContentRoleId | string): string {
  return roleById.get(normalizeRoleId(id))?.summary ?? "";
}
