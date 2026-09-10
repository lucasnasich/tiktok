import { getAngleLabel } from "@/content/angles";
import type { ContentRoleId } from "@/content/content-roles";
import { getContentRoleLabel } from "@/content/content-roles";
import { getFormatLabel } from "@/content/formats";
import type { PlanningAccount } from "@/content/planning-accounts";
import {
  PLANNING_ALL_ACCOUNTS_ID,
  getPlanningAccountLabel,
  planningAccounts,
} from "@/content/planning-accounts";
import { getPlanningPillarLabel } from "@/content/planning-pillars";
import type { PlanningViewId } from "@/content/planning-view";
import { PLANNING_VIEW } from "@/content/planning-view";
import type { PlanningSlot } from "@/content/planned-slots";

export type PlanningInsightKind = "gap" | "variety" | "warning";

export type PlanningInsight = {
  id: string;
  kind: PlanningInsightKind;
  message: string;
  accountId?: string;
};

export const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function startOfWeek(date: Date): Date {
  const result = new Date(date);
  const weekday = result.getDay();
  const diff = weekday === 0 ? -6 : 1 - weekday;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getWeekDates(weekStart: Date): string[] {
  return Array.from({ length: 7 }, (_, index) =>
    toIsoDate(addDays(weekStart, index)),
  );
}

export function getFourDayDates(focusDate: Date): string[] {
  return Array.from({ length: 4 }, (_, index) =>
    toIsoDate(addDays(focusDate, index)),
  );
}

export type MonthCalendarDay = {
  iso: string;
  inCurrentMonth: boolean;
};

export function getMonthCalendarDays(focusDate: Date): MonthCalendarDay[] {
  const year = focusDate.getFullYear();
  const month = focusDate.getMonth();
  const lastOfMonth = new Date(year, month + 1, 0);
  let current = startOfWeek(new Date(year, month, 1));
  const days: MonthCalendarDay[] = [];

  while (current <= lastOfMonth || days.length % 7 !== 0) {
    days.push({
      iso: toIsoDate(current),
      inCurrentMonth: current.getMonth() === month,
    });
    current = addDays(current, 1);
  }

  return days;
}

export function getDatesForView(
  view: PlanningViewId,
  focusDate: Date,
): string[] {
  switch (view) {
    case PLANNING_VIEW.day.id:
      return [toIsoDate(focusDate)];
    case PLANNING_VIEW.fourDay.id:
      return getFourDayDates(focusDate);
    case PLANNING_VIEW.week.id:
      return getWeekDates(startOfWeek(focusDate));
    case PLANNING_VIEW.month.id:
      return getMonthCalendarDays(focusDate).map((day) => day.iso);
    default:
      return getWeekDates(startOfWeek(focusDate));
  }
}

export function navigateFocusDate(
  view: PlanningViewId,
  focusDate: Date,
  direction: -1 | 1,
): Date {
  switch (view) {
    case PLANNING_VIEW.day.id:
      return addDays(focusDate, direction);
    case PLANNING_VIEW.fourDay.id:
      return addDays(focusDate, direction * 4);
    case PLANNING_VIEW.week.id:
      return addDays(focusDate, direction * 7);
    case PLANNING_VIEW.month.id: {
      const next = new Date(focusDate);
      next.setMonth(next.getMonth() + direction);
      return next;
    }
    default:
      return addDays(focusDate, direction * 7);
  }
}

export function formatPeriodLabel(view: PlanningViewId, focusDate: Date): string {
  switch (view) {
    case PLANNING_VIEW.day.id:
      return focusDate.toLocaleDateString("es-AR", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    case PLANNING_VIEW.fourDay.id: {
      const end = addDays(focusDate, 3);
      const sameMonth = focusDate.getMonth() === end.getMonth();
      if (sameMonth) {
        return `${focusDate.getDate()}–${end.getDate()} ${focusDate.toLocaleDateString("es-AR", { month: "short" })}`;
      }
      return `${focusDate.toLocaleDateString("es-AR", { day: "numeric", month: "short" })} – ${end.toLocaleDateString("es-AR", { day: "numeric", month: "short" })}`;
    }
    case PLANNING_VIEW.week.id:
      return formatWeekRangeLabel(startOfWeek(focusDate));
    case PLANNING_VIEW.month.id:
      return focusDate.toLocaleDateString("es-AR", {
        month: "long",
        year: "numeric",
      });
    default:
      return formatWeekRangeLabel(startOfWeek(focusDate));
  }
}

export function formatWeekRangeLabel(weekStart: Date): string {
  const weekEnd = addDays(weekStart, 6);
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const month = weekStart.toLocaleDateString("es-AR", { month: "short" });
  return `Semana ${startDay}–${endDay} ${month}`;
}

export function formatDayLabel(iso: string, todayIso: string): string {
  const date = parseIsoDate(iso);
  const weekday = WEEKDAY_LABELS[(date.getDay() + 6) % 7];
  const day = date.getDate();
  const isToday = iso === todayIso;
  return isToday ? `${weekday} ${day} · hoy` : `${weekday} ${day}`;
}

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

/** @deprecated Usar filterSlotsByDates */
export function filterSlotsByWeek(
  slots: PlanningSlot[],
  weekDates: string[],
): PlanningSlot[] {
  return filterSlotsByDates(slots, weekDates);
}

function slotsForDate(
  slots: PlanningSlot[],
  accountId: string,
  date: string,
): PlanningSlot[] {
  return slots.filter(
    (slot) => slot.accountId === accountId && slot.date === date,
  );
}

function countRoles(
  slots: PlanningSlot[],
  roleId: ContentRoleId,
): number {
  return slots.filter((slot) => slot.roleId === roleId).length;
}

function satisfiesAlternateTarget(
  daySlots: PlanningSlot[],
  alternateRoles: [ContentRoleId, ContentRoleId],
): boolean {
  return alternateRoles.some((roleId) =>
    daySlots.some((slot) => slot.roleId === roleId),
  );
}

function computeDailyGapsForAccount(
  account: PlanningAccount,
  slots: PlanningSlot[],
  date: string,
): PlanningInsight[] {
  const insights: PlanningInsight[] = [];
  const daySlots = slotsForDate(slots, account.id, date);
  const missingPosts = account.postsPerDay - daySlots.length;

  if (missingPosts > 0) {
    insights.push({
      id: `${account.id}-${date}-count`,
      kind: "gap",
      accountId: account.id,
      message: `${account.label} · faltan ${missingPosts} post${missingPosts > 1 ? "s" : ""} hoy`,
    });
  }

  for (const target of account.dailyTargets) {
    if (
      account.alternateRoles?.includes(target.roleId) &&
      target.roleId !== account.alternateRoles[0]
    ) {
      continue;
    }

    if (account.alternateRoles?.includes(target.roleId)) {
      if (!satisfiesAlternateTarget(daySlots, account.alternateRoles)) {
        const [roleA, roleB] = account.alternateRoles;
        insights.push({
          id: `${account.id}-${date}-alternate`,
          kind: "gap",
          accountId: account.id,
          message: `Falta 1 contenido de ${getContentRoleLabel(roleA)} o ${getContentRoleLabel(roleB)} (${account.label})`,
        });
      }
      continue;
    }

    const have = countRoles(daySlots, target.roleId);
    const missing = target.count - have;
    if (missing > 0) {
      insights.push({
        id: `${account.id}-${date}-${target.roleId}`,
        kind: "gap",
        accountId: account.id,
        message: `Falta ${missing} contenido de ${getContentRoleLabel(target.roleId)} (${account.label})`,
      });
    }
  }

  return insights;
}

function detectAngleVariety(
  weekSlots: PlanningSlot[],
  account: PlanningAccount,
): PlanningInsight[] {
  const insights: PlanningInsight[] = [];
  const angles = weekSlots
    .filter((slot) => slot.accountId === account.id && slot.angleId)
    .map((slot) => slot.angleId!);

  if (angles.length < 4) return insights;

  const angleCounts = new Map<string, number>();
  for (const angleId of angles) {
    angleCounts.set(angleId, (angleCounts.get(angleId) ?? 0) + 1);
  }

  const comparacionCount = angleCounts.get("comparacion") ?? 0;
  if (comparacionCount === 0) {
    insights.push({
      id: `${account.id}-angle-comparacion`,
      kind: "variety",
      accountId: account.id,
      message: `En este período casi no usamos ${getAngleLabel("comparacion")} (${account.label})`,
    });
  }

  const dominant = [...angleCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  if (dominant && dominant[1] >= 4) {
    insights.push({
      id: `${account.id}-angle-${dominant[0]}`,
      kind: "variety",
      accountId: account.id,
      message: `Mucho ${getAngleLabel(dominant[0])} en el período — probá otro ángulo (${account.label})`,
    });
  }

  return insights;
}

function detectFormatVariety(
  weekSlots: PlanningSlot[],
  account: PlanningAccount,
): PlanningInsight[] {
  const insights: PlanningInsight[] = [];
  const formats = weekSlots
    .filter((slot) => slot.accountId === account.id)
    .map((slot) => slot.formatId);

  if (formats.length < 4) return insights;

  const formatCounts = new Map<string, number>();
  for (const formatId of formats) {
    formatCounts.set(formatId, (formatCounts.get(formatId) ?? 0) + 1);
  }

  const dominant = [...formatCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  if (dominant && dominant[1] >= 3) {
    insights.push({
      id: `${account.id}-format-${dominant[0]}`,
      kind: "variety",
      accountId: account.id,
      message: `Repetimos mucho el formato ${getFormatLabel(dominant[0])} (${account.label})`,
    });
  }

  return insights;
}

function detectPillarStreaks(
  weekSlots: PlanningSlot[],
  account: PlanningAccount,
): PlanningInsight[] {
  const insights: PlanningInsight[] = [];
  const ordered = weekSlots
    .filter((slot) => slot.accountId === account.id)
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

  let streakPillar: string | null = null;
  let streakLength = 0;

  for (const slot of ordered) {
    if (slot.pillarId === streakPillar) {
      streakLength += 1;
    } else {
      streakPillar = slot.pillarId;
      streakLength = 1;
    }

    if (streakLength >= 3) {
      insights.push({
        id: `${account.id}-pillar-${slot.pillarId}-${slot.date}`,
        kind: "warning",
        accountId: account.id,
        message: `Demasiados posts seguidos sobre ${getPlanningPillarLabel(slot.pillarId)} (${account.label})`,
      });
      break;
    }
  }

  return insights;
}

function detectRoleImbalance(
  weekSlots: PlanningSlot[],
  account: PlanningAccount,
): PlanningInsight[] {
  const insights: PlanningInsight[] = [];
  const accountSlots = weekSlots.filter((slot) => slot.accountId === account.id);
  if (accountSlots.length < 5) return insights;

  const roleCounts = new Map<ContentRoleId, number>();
  for (const slot of accountSlots) {
    roleCounts.set(slot.roleId, (roleCounts.get(slot.roleId) ?? 0) + 1);
  }

  const alcance = roleCounts.get("alcance") ?? 0;
  const valor = roleCounts.get("valor") ?? 0;
  const total = accountSlots.length;

  if (alcance / total > 0.7) {
    insights.push({
      id: `${account.id}-role-alcance-heavy`,
      kind: "variety",
      accountId: account.id,
      message: `El período está muy cargado a Alcance — sumá Valor o Prueba (${account.label})`,
    });
  }

  if (valor === 0 && total >= 5) {
    insights.push({
      id: `${account.id}-role-no-valor`,
      kind: "gap",
      accountId: account.id,
      message: `No hay contenido de Valor planificado en el período (${account.label})`,
    });
  }

  return insights;
}

export function computePlanningInsights({
  slots,
  accounts = planningAccounts,
  rangeDates,
  todayIso,
  accountFilter = PLANNING_ALL_ACCOUNTS_ID,
}: {
  slots: PlanningSlot[];
  accounts?: PlanningAccount[];
  rangeDates: string[];
  todayIso: string;
  accountFilter?: string;
}): PlanningInsight[] {
  const visibleAccounts =
    accountFilter === PLANNING_ALL_ACCOUNTS_ID
      ? accounts
      : accounts.filter((account) => account.id === accountFilter);

  const weekSlots = filterSlotsByDates(slots, rangeDates);
  const insights: PlanningInsight[] = [];

  for (const account of visibleAccounts) {
    insights.push(
      ...computeDailyGapsForAccount(account, weekSlots, todayIso),
    );
    insights.push(...detectAngleVariety(weekSlots, account));
    insights.push(...detectFormatVariety(weekSlots, account));
    insights.push(...detectPillarStreaks(weekSlots, account));
    insights.push(...detectRoleImbalance(weekSlots, account));
  }

  const seen = new Set<string>();
  return insights.filter((insight) => {
    if (seen.has(insight.message)) return false;
    seen.add(insight.message);
    return true;
  });
}

export function groupSlotsByDate(
  slots: PlanningSlot[],
  dates: string[],
): Record<string, PlanningSlot[]> {
  const grouped: Record<string, PlanningSlot[]> = {};
  for (const date of dates) {
    grouped[date] = slots
      .filter((slot) => slot.date === date)
      .sort((a, b) => a.accountId.localeCompare(b.accountId));
  }
  return grouped;
}

export function getPlanningAccountOptions() {
  return [
    { id: PLANNING_ALL_ACCOUNTS_ID, label: getPlanningAccountLabel(PLANNING_ALL_ACCOUNTS_ID) },
    ...planningAccounts.map((account) => ({
      id: account.id,
      label: account.label,
    })),
  ];
}
