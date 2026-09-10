import { PLANNING_ALL_ACCOUNTS_ID } from "@/content/planning-accounts";
import type { PlanningSlot } from "@/content/planned-slots";

export function filterSlotsByAccount(
  slots: PlanningSlot[],
  accountId: string,
): PlanningSlot[] {
  if (accountId === PLANNING_ALL_ACCOUNTS_ID) return slots;
  return slots.filter((slot) => slot.accountId === accountId);
}

export function filterSlotsByDates(
  slots: PlanningSlot[],
  dates: string[],
): PlanningSlot[] {
  const dateSet = new Set(dates);
  return slots.filter((slot) => dateSet.has(slot.date));
}

export function groupSlotsByDate(
  slots: PlanningSlot[],
  dates: string[],
): Record<string, PlanningSlot[]> {
  const grouped: Record<string, PlanningSlot[]> = {};
  for (const date of dates) {
    grouped[date] = slots
      .filter((slot) => slot.date === date)
      .sort(
        (a, b) =>
          a.time.localeCompare(b.time) || a.accountId.localeCompare(b.accountId),
      );
  }
  return grouped;
}
