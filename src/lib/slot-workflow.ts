import type { PlanningSlot } from "@/content/planned-slots";
import type { Proposal } from "@/content/proposals";
import type { SlotSpecRecord } from "@/content/slot-specs";
import type { SlotWorkflowStatus } from "@/content/slot-workflow";
import { proposalsForSlot } from "@/lib/proposals-store";
import {
  hasSelectedCreativeProposal,
  isInspirationConfirmed,
} from "@/lib/slot-spec";

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
  record: SlotSpecRecord | undefined,
): SlotWorkflowStatus {
  if (!hasSelectedCreativeProposal(record)) return "elegir-idea";
  if (!isInspirationConfirmed(record)) return "elegir-inspiracion";
  return "listo-para-producir";
}
