export const PROPOSAL_SIGNAL_EXAMPLE =
  "Dueños de locales calificando tareas que odian.";

export { angles } from "@/content/angles";

export const PROPOSAL_FINAL_FORMULA =
  "PlanningSlot + propuesta creativa elegida + Mercantis Brain → SlotSpec → Cursor desarrolla Proposals";

export const PROPOSAL_FINAL_EXAMPLE =
  "Slot Educación / Inventario / Imagen única + idea elegida + dolores/stock → Cursor entrega propuestas con copy completo → el usuario selecciona una.";

export const PROPOSAL_CARD_FIELDS = [
  "Slot",
  "Inspiración",
  "Ángulo",
  "Concepto",
  "Hook",
  "Narrativa",
  "Copy",
  "CTA",
  "Caption",
] as const;

export const PROPOSAL_SUBSTEPS = [
  { id: "slot", label: "Slot spec" },
  { id: "fuente", label: "Inspiración" },
  { id: "angulo", label: "Cursor" },
  { id: "propuesta", label: "Selección" },
] as const;
