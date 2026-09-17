import type { SlotDirectionKind, SlotSpecRecord, SlotSpecStatus } from "@/content/slot-specs";
import { parseCreativeProposals } from "@/lib/creative-proposals";

const DIRECTIONS: SlotDirectionKind[] = ["inspiration", "manual"];
const STATUSES: SlotSpecStatus[] = ["draft", "ready-for-cursor"];

function stringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter((item): item is string => typeof item === "string");
  return items.length > 0 ? items : undefined;
}

export function parseSlotSpecRecord(raw: unknown): SlotSpecRecord | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const value = raw as Record<string, unknown>;
  if (typeof value.slotId !== "string") return undefined;
  const directionKind = DIRECTIONS.includes(value.directionKind as SlotDirectionKind)
    ? (value.directionKind as SlotDirectionKind)
    : undefined;
  const status = STATUSES.includes(value.status as SlotSpecStatus)
    ? (value.status as SlotSpecStatus)
    : undefined;
  if (!directionKind || !status) return undefined;

  return {
    slotId: value.slotId,
    directionKind,
    inspirationRef:
      typeof value.inspirationRef === "string" ? value.inspirationRef : undefined,
    signal: typeof value.signal === "string" ? value.signal : undefined,
    creativeMechanism:
      typeof value.creativeMechanism === "string"
        ? value.creativeMechanism
        : undefined,
    notes: stringArray(value.notes),
    editorialDescription:
      typeof value.editorialDescription === "string"
        ? value.editorialDescription
        : undefined,
    inspirationSearchBrief:
      typeof value.inspirationSearchBrief === "string"
        ? value.inspirationSearchBrief
        : undefined,
    structuralSearchBrief:
      typeof value.structuralSearchBrief === "string"
        ? value.structuralSearchBrief
        : undefined,
    visualSearchBrief:
      typeof value.visualSearchBrief === "string"
        ? value.visualSearchBrief
        : undefined,
    structuralInspirationRef:
      typeof value.structuralInspirationRef === "string"
        ? value.structuralInspirationRef
        : undefined,
    visualInspirationRef:
      typeof value.visualInspirationRef === "string"
        ? value.visualInspirationRef
        : undefined,
    creativeProposals: parseCreativeProposals(value.creativeProposals),
    selectedCreativeProposalId:
      typeof value.selectedCreativeProposalId === "string"
        ? value.selectedCreativeProposalId
        : undefined,
    inspirationConfirmed:
      value.inspirationConfirmed === true ? true : undefined,
    status,
    preparedAt: typeof value.preparedAt === "string" ? value.preparedAt : undefined,
  };
}

export function parseSlotSpecRecords(
  raw: unknown,
): Record<string, SlotSpecRecord> | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const result: Record<string, SlotSpecRecord> = {};
  for (const [key, value] of Object.entries(raw)) {
    const parsed = parseSlotSpecRecord(value);
    if (parsed) result[key] = parsed;
  }
  return result;
}

export function specForSlot(
  records: Record<string, SlotSpecRecord>,
  slotId: string,
): SlotSpecRecord | undefined {
  return records[slotId];
}
