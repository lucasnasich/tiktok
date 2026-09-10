import type { PlanningSlot } from "@/content/planned-slots";
import type { Proposal } from "@/content/proposals";
import type { SlotSpecRecord } from "@/content/slot-specs";

export type InspirationUsage = {
  count: number;
  lastUsedAt?: string;
  proposalIds: string[];
  slotIds: string[];
  angleIds: string[];
  accountIds: string[];
};

function daysSince(iso?: string, now = Date.now()) {
  if (!iso) return Number.POSITIVE_INFINITY;
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return Number.POSITIVE_INFINITY;
  return (now - then) / (24 * 60 * 60 * 1000);
}

export function formatInspirationUsage(
  usage: InspirationUsage,
  now = Date.now(),
): string {
  if (usage.count === 0) return "Nunca usada";
  const last = daysSince(usage.lastUsedAt, now);
  const recency =
    last === Number.POSITIVE_INFINITY
      ? ""
      : last < 1
        ? " · última hoy"
        : last < 2
          ? " · última ayer"
          : ` · última hace ${Math.round(last)} días`;
  return `${usage.count} uso${usage.count === 1 ? "" : "s"}${recency}`;
}

/** Uso derivado: Inspiration → SlotSpec → Proposal. No se persiste un contador. */
export function usageForInspiration(
  inspirationKey: string,
  proposals: Proposal[],
  specs: SlotSpecRecord[] = [],
  slots: PlanningSlot[] = [],
): InspirationUsage {
  const slotById = new Map(slots.map((slot) => [slot.id, slot]));
  const slotIds = new Set<string>();
  const proposalIds: string[] = [];
  const angleIds = new Set<string>();
  const accountIds = new Set<string>();
  const timestamps: string[] = [];

  for (const spec of specs) {
    if (spec.inspirationRef !== inspirationKey) continue;
    slotIds.add(spec.slotId);
    const slot = slotById.get(spec.slotId);
    if (slot) accountIds.add(slot.accountId);
    if (spec.preparedAt) timestamps.push(spec.preparedAt);
  }

  for (const proposal of proposals) {
    if (proposal.sourceRef !== inspirationKey) continue;
    proposalIds.push(proposal.id);
    slotIds.add(proposal.planSlotId);
    if (proposal.angleId) angleIds.add(proposal.angleId);
    if (proposal.createdAt) timestamps.push(proposal.createdAt);
    const slot = slotById.get(proposal.planSlotId);
    if (slot) accountIds.add(slot.accountId);
  }

  timestamps.sort();

  return {
    count: slotIds.size,
    lastUsedAt: timestamps.at(-1),
    proposalIds,
    slotIds: [...slotIds],
    angleIds: [...angleIds],
    accountIds: [...accountIds],
  };
}
