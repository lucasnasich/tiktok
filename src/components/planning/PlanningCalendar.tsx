import { PlanningGridCalendar } from "@/components/planning/PlanningGridCalendar";
import { PlanningMonthCalendar } from "@/components/planning/PlanningMonthCalendar";
import type { PlanningViewId } from "@/content/planning-view";
import { PLANNING_VIEW } from "@/content/planning-view";
import type { PlanningSlot } from "@/content/planned-slots";
import type { MonthCalendarDay } from "@/lib/planning";

export function PlanningCalendar({
  view,
  dates,
  monthDays,
  slots,
  todayIso,
  onOpenSlot,
}: {
  view: PlanningViewId;
  dates: string[];
  monthDays: MonthCalendarDay[];
  slots: PlanningSlot[];
  todayIso: string;
  onOpenSlot?: (slot: PlanningSlot) => void;
}) {
  if (view === PLANNING_VIEW.month.id) {
    return (
      <PlanningMonthCalendar
        days={monthDays}
        slots={slots}
        todayIso={todayIso}
        onOpenSlot={onOpenSlot}
      />
    );
  }

  return (
    <PlanningGridCalendar
      view={view}
      dates={dates}
      slots={slots}
      todayIso={todayIso}
      onOpenSlot={onOpenSlot}
    />
  );
}
