export type SlotWorkflowStatus =
  | "elegir-idea"
  | "elegir-inspiracion"
  | "listo-para-producir";

export const SLOT_WORKFLOW_STATUS_LABELS: Record<SlotWorkflowStatus, string> = {
  "elegir-idea": "Elegir idea",
  "elegir-inspiracion": "Elegir inspiración",
  "listo-para-producir": "Listo para producir",
};
