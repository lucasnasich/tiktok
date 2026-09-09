/** Modos de vista en Inspiración. Renombrá `revisar` si elegís otro label en la UI. */
export const INSPIRATION_VIEW = {
  listado: {
    id: "listado",
    label: "Listado",
    description: "Galería de todas las referencias.",
  },
  revisar: {
    id: "revisar",
    label: "Revisar",
    description: "Una por una: me gusta o no.",
  },
} as const;

export type InspirationViewId =
  (typeof INSPIRATION_VIEW)[keyof typeof INSPIRATION_VIEW]["id"];
