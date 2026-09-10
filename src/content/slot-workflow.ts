export type SlotWorkflowStatus =
  | "falta-definir"
  | "listo-para-cursor"
  | "elegir-propuesta"
  | "listo-para-ensamblar";

export const SLOT_WORKFLOW_STATUS_LABELS: Record<SlotWorkflowStatus, string> = {
  "falta-definir": "Falta definir",
  "listo-para-cursor": "Listo para Cursor",
  "elegir-propuesta": "Elegir propuesta",
  "listo-para-ensamblar": "Listo para ensamblar",
};
