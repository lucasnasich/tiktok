export const IDEA_SIGNAL_EXAMPLE =
  "Muchos comerciantes pierden tiempo respondiendo siempre lo mismo por WhatsApp.";

export { angles } from "@/content/angles";
export { formats } from "@/content/formats";

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

export const IDEA_FINAL_FORMULA =
  "Problema/señal + ángulo + público + formato creativo + hook";

export const IDEA_FINAL_EXAMPLE =
  "Comerciantes que pierden tiempo en WhatsApp + ángulo dolor + dueños de negocio + nota del iPhone + hook confesional.";

export const IDEA_CARD_FIELDS = [
  "Fuente",
  "Señal",
  "Ángulo",
  "Público",
  "Formato",
  "Idea/Hook",
] as const;

export const IDEA_SUBSTEPS = [
  { id: "senal", label: "Señal" },
  { id: "angulo", label: "Ángulo" },
  { id: "formato", label: "Formato" },
  { id: "idea", label: "Idea final" },
] as const;

export const IDEA_SCREEN_TABS = [
  { id: "senales", label: "Señales" },
  { id: "angulos", label: "Ángulos" },
  { id: "formatos", label: "Formatos" },
  { id: "idea", label: "Idea final" },
] as const;
