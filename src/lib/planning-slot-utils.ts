import { PLANNING_ALL_ACCOUNTS_ID } from "@/content/planning-accounts";
import {
  getSlotAccountIds,
  slotMatchesAccount,
  type PlanningSlot,
} from "@/content/planned-slots";

function sharedSlotFingerprint(slot: PlanningSlot): string {
  return [
    slot.generationId ?? "",
    slot.date,
    slot.time,
    slot.roleId,
    slot.pillarId,
    slot.publicationTypeId ?? slot.formatId ?? "",
  ].join("|");
}

/** En vista "todas las cuentas", una pieza unificada no se lista dos veces. */
export function dedupeSlotsForAllAccountsView(
  slots: PlanningSlot[],
): PlanningSlot[] {
  const groups = new Map<string, PlanningSlot[]>();

  for (const slot of slots) {
    const key = sharedSlotFingerprint(slot);
    const group = groups.get(key) ?? [];
    group.push(slot);
    groups.set(key, group);
  }

  const merged = [...groups.values()].map((group) => {
    if (group.length === 1) return group[0];

    const unified = group.find(
      (slot) => slot.accountIds && slot.accountIds.length > 1,
    );
    const primary = unified ?? group[0];
    const accountIds = [
      ...new Set(group.flatMap((slot) => getSlotAccountIds(slot))),
    ];
    const platforms = [...new Set(group.flatMap((slot) => slot.platforms))];

    return {
      ...primary,
      accountIds,
      platforms,
    };
  });

  return merged.sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      a.time.localeCompare(b.time) ||
      a.accountId.localeCompare(b.accountId),
  );
}

export function filterSlotsByAccount(
  slots: PlanningSlot[],
  accountId: string,
): PlanningSlot[] {
  if (accountId === PLANNING_ALL_ACCOUNTS_ID) return slots;
  return slots.filter((slot) => slotMatchesAccount(slot, accountId));
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
