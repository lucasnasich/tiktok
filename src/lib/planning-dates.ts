import type { PlanningViewId } from "@/content/planning-view";
import { PLANNING_VIEW } from "@/content/planning-view";

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

export function formatWeekRangeLabel(weekStart: Date): string {
  const weekEnd = addDays(weekStart, 6);
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const month = weekStart.toLocaleDateString("es-AR", { month: "short" });
  return `Semana ${startDay}–${endDay} ${month}`;
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

export function formatDayLabel(iso: string, todayIso: string): string {
  const date = parseIsoDate(iso);
  const weekday = WEEKDAY_LABELS[(date.getDay() + 6) % 7];
  const day = date.getDate();
  const isToday = iso === todayIso;
  return isToday ? `${weekday} ${day} · hoy` : `${weekday} ${day}`;
}
