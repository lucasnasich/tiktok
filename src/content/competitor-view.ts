/** Filtro de país: todos los mercados. */
export const COMPETITOR_ALL_COUNTRIES = {
  id: "todos",
  label: "Todos los países",
} as const;

/** Mercados con ranking cargado — única fuente para el filtro de país. */
export const COMPETITOR_FILTER_COUNTRIES = [
  "Argentina",
  "Bolivia",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Ecuador",
  "El Salvador",
  "Guatemala",
  "Honduras",
  "México",
  "Panamá",
  "Paraguay",
  "Perú",
  "Puerto Rico",
  "República Dominicana",
  "Uruguay",
] as const;

export const COMPETITOR_SORT = {
  market: {
    id: "market",
    label: "Poder de mercado",
    description: "Líderes, cuota y relevancia por país.",
  },
  similarity: {
    id: "similarity",
    label: "Similitud con Mercantis",
    description: "Qué tan cerca están de nuestro core.",
  },
} as const;

export type CompetitorSortId =
  (typeof COMPETITOR_SORT)[keyof typeof COMPETITOR_SORT]["id"];
