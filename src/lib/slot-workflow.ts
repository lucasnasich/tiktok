import type { Proposal } from "@/content/proposals";
import type { SlotSpecRecord } from "@/content/slot-specs";
import type { SlotWorkflowStatus } from "@/content/slot-workflow";
import { proposalsForSlot, selectedProposalForSlot } from "@/lib/proposals-store";
import { isSpecReadyForCursor } from "@/lib/slot-spec";

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
