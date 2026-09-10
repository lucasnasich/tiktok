export type ContentRoleId =
  | "alcance"
  | "valor"
  | "prueba"
  | "conversion"
  | "marca"
  | "comunidad";

export type ContentRole = {
  id: ContentRoleId;
  label: string;
  summary: string;
};

/** Rol estratégico del contenido — para qué publicamos (por encima del ángulo). */
export const contentRoles: ContentRole[] = [
  {
    id: "alcance",
    label: "Alcance",
    summary: "Captar atención y llegar a gente nueva.",
  },
  {
    id: "valor",
    label: "Valor",
    summary: "Enseñar, ayudar o generar autoridad.",
  },
  {
    id: "prueba",
    label: "Prueba",
    summary: "Demostrar producto, resultado, caso o evidencia.",
  },
  {
    id: "conversion",
    label: "Conversión",
    summary: "Llevar a Mercantis, registro o acción concreta.",
  },
  {
    id: "marca",
    label: "Marca / Posicionamiento",
    summary:
      "Instalar una forma de pensar, una visión de negocio o una identidad de marca.",
  },
  {
    id: "comunidad",
    label: "Comunidad / Conversación",
    summary: "Generar identificación, opinión, comentarios y participación.",
  },
];

const roleById = new Map(contentRoles.map((role) => [role.id, role]));

export function getContentRoleLabel(id: ContentRoleId | string): string {
  return roleById.get(id as ContentRoleId)?.label ?? id;
}

export function getContentRoleSummary(id: ContentRoleId | string): string {
  return roleById.get(id as ContentRoleId)?.summary ?? "";
}
