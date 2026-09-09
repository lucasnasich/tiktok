export const IDEA_INSPIRATION_SOURCES = [
  "problemas/dolores reales",
  "competidores",
  "anuncios de competidores",
  "tendencias",
  "Cosmos/Pinterest/diseño",
  "métricas de posts anteriores",
  "ideas propias",
] as const;

export const IDEA_SIGNAL_EXAMPLE =
  "Muchos comerciantes pierden tiempo respondiendo siempre lo mismo por WhatsApp.";

export { angles } from "@/content/angles";

export const IDEA_ANGLES = [
  "dolor",
  "error",
  "oportunidad",
  "comparación",
  "polémico",
  "storytelling",
  "educativo",
  "aspiracional",
] as const;

export const IDEA_FINAL_FORMULA = "Problema/señal + ángulo + público + formato";

export const IDEA_FINAL_EXAMPLE =
  "Comerciantes que pierden tiempo en WhatsApp + ángulo dolor + dueños de negocio + carrusel.";

export const IDEA_CARD_FIELDS = [
  "Fuente",
  "Señal",
  "Ángulo",
  "Público",
  "Formato",
  "Idea/Hook",
] as const;

export const IDEA_SUBSTEPS = [
  { id: "inspiracion", label: "Inspiración" },
  { id: "senal", label: "Señal" },
  { id: "angulo", label: "Ángulo" },
  { id: "idea", label: "Idea final" },
] as const;

export const IDEA_SCREEN_TABS = [
  { id: "inspiracion", label: "Inspiración" },
  { id: "senales", label: "Señales" },
  { id: "angulos", label: "Ángulos" },
  { id: "idea", label: "Idea final" },
] as const;
