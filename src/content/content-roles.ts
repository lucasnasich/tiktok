export type ContentRoleId = "alcance" | "valor" | "prueba" | "conversion";

export type ContentRole = {
  id: ContentRoleId;
  label: string;
  summary: string;
};

/** Rol estratégico del contenido — por encima del ángulo narrativo. */
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
];

const roleById = new Map(contentRoles.map((role) => [role.id, role]));

export function getContentRoleLabel(id: ContentRoleId | string): string {
  return roleById.get(id as ContentRoleId)?.label ?? id;
}
