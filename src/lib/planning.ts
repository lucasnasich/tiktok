import {
  PLANNING_ALL_ACCOUNTS_ID,
  getPlanningAccountLabel,
  planningAccounts,
  type PlanningAccount,
} from "@/content/planning-accounts";
import type { PlanningSlot } from "@/content/planned-slots";
import { filterSlotsByDates } from "@/lib/planning-slot-utils";

export {
  computePlanningInsights,
  type PlanningInsight,
  type PlanningInsightKind,
} from "@/lib/planning-insights";

export {
  WEEKDAY_LABELS,
  addDays,
  formatDayLabel,
  formatPeriodLabel,
  formatWeekRangeLabel,
  getDatesForView,
  getFourDayDates,
  getMonthCalendarDays,
  getWeekDates,
  navigateFocusDate,
  parseIsoDate,
  startOfWeek,
  toIsoDate,
  type MonthCalendarDay,
} from "@/lib/planning-dates";

export {
  filterSlotsByAccount,
  filterSlotsByDates,
  groupSlotsByDate,
} from "@/lib/planning-slot-utils";

/** @deprecated Usar filterSlotsByDates */
export function filterSlotsByWeek(
  slots: PlanningSlot[],
  weekDates: string[],
) {
  return filterSlotsByDates(slots, weekDates);
}

export function getPlanningAccountOptions(
  accounts: PlanningAccount[] = planningAccounts,
) {
  return [
    {
      id: PLANNING_ALL_ACCOUNTS_ID,
      label: getPlanningAccountLabel(PLANNING_ALL_ACCOUNTS_ID),
    },
    ...accounts.map((account) => ({
      id: account.id,
      label: account.label,
    })),
  ];
}
