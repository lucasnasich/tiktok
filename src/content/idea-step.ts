export const IDEA_SIGNAL_EXAMPLE =
  "Dueños de locales calificando tareas que odian.";

export { angles } from "@/content/angles";

export const IDEA_FINAL_FORMULA =
  "PlanningSlot + fuente/señal + Mercantis Brain + ángulo → concepto + hook";

export const IDEA_FINAL_EXAMPLE =
  "Slot Alcance / Inventario / Tier list + señal “tareas que odian” + dolores/stock + ángulo dolor → “Tier list de las tareas más rompehuevos de tener un local”.";

export const IDEA_CARD_FIELDS = [
  "Slot",
  "Fuente",
  "Señal",
  "Ángulo",
  "Concepto",
  "Hook",
] as const;

export const IDEA_SUBSTEPS = [
  { id: "slot", label: "Slot" },
  { id: "fuente", label: "Fuente" },
  { id: "angulo", label: "Ángulo" },
  { id: "idea", label: "Concepto y hook" },
] as const;
