export type InspirationOrigin =
  | "competitor"
  | "creator"
  | "brand"
  | "client"
  | "organic"
  | "ad"
  | "trend"
  | "visual-reference"
  | "other"
  | "unknown";

/** Tipo de inspiración: sugerencia explícita vs pieza ya publicada. */
export type InspirationMaterialType = "suggestion" | "example";
export type InspirationType = InspirationMaterialType;

export const INSPIRATION_ORIGIN_LABELS: Record<InspirationOrigin, string> = {
  competitor: "Competidor",
  creator: "Creador",
  brand: "Marca",
  client: "Cliente",
  organic: "Orgánico",
  ad: "Pauta",
  trend: "Tendencia",
  "visual-reference": "Referencia visual",
  other: "Otro",
  unknown: "Sin clasificar",
};

export const INSPIRATION_ORIGINS = Object.keys(
  INSPIRATION_ORIGIN_LABELS,
) as InspirationOrigin[];

export const INSPIRATION_MATERIAL_TYPE_LABELS: Record<
  InspirationMaterialType,
  string
> = {
  suggestion: "Sugerencia",
  example: "Ejemplo",
};

export const INSPIRATION_TYPE_LABELS = INSPIRATION_MATERIAL_TYPE_LABELS;
