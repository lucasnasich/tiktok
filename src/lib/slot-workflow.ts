import type { PlanningSlot } from "@/content/planned-slots";
import type { Proposal } from "@/content/proposals";
import type { SlotSpecRecord } from "@/content/slot-specs";
import type { SlotWorkflowStatus } from "@/content/slot-workflow";
import { proposalsForSlot, selectedProposalForSlot } from "@/lib/proposals-store";
import { isSpecReadyForCursor } from "@/lib/slot-spec";

export type SlotPublicationLed = "pending" | "scheduled" | "published";

export const SLOT_PUBLICATION_LED_LABELS: Record<SlotPublicationLed, string> = {
  pending: "Sin propuesta",
  scheduled: "Programado",
  published: "Publicado",
};

/** LED del calendario: rojo / azul / verde según propuesta y publicación. */
export function deriveSlotPublicationLed(
  slot: PlanningSlot,
  proposals: Proposal[],
): SlotPublicationLed {
  if (slot.status === "publicado") return "published";
  if (slot.status === "listo" || slot.postId) return "scheduled";
  if (proposalsForSlot(proposals, slot.id).length === 0) return "pending";
  return "scheduled";
}

export function deriveSlotWorkflowStatus(
  slotId: string,
  record: SlotSpecRecord | undefined,
  proposals: Proposal[],
): SlotWorkflowStatus {
  if (selectedProposalForSlot(proposals, slotId)) {
    return "listo-para-ensamblar";
  }
  if (proposalsForSlot(proposals, slotId).length > 0) {
    return "elegir-propuesta";
  }
  if (isSpecReadyForCursor(record)) {
    return "listo-para-cursor";
  }
  return "falta-definir";
}
