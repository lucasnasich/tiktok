import { PlanningDayColumn } from "@/components/planning/PlanningDayColumn";
import type { PlanningViewId } from "@/content/planning-view";
import { PLANNING_VIEW } from "@/content/planning-view";
import type { PlanningSlot } from "@/content/planned-slots";
import { groupSlotsByDate } from "@/lib/planning";
import { cn } from "@/lib/utils";

const GRID_CLASS: Record<PlanningViewId, string> = {
  [PLANNING_VIEW.day.id]: "grid-cols-1",
  [PLANNING_VIEW.fourDay.id]: "grid-cols-2 md:grid-cols-4",
  [PLANNING_VIEW.week.id]: "grid-cols-2 sm:grid-cols-4 md:grid-cols-7",
  [PLANNING_VIEW.month.id]: "grid-cols-7",
};

export function PlanningGridCalendar({
  view,
  dates,
  slots,
  todayIso,
}: {
  view: PlanningViewId;
  dates: string[];
  slots: PlanningSlot[];
  todayIso: string;
}) {
  const grouped = groupSlotsByDate(slots, dates);
  const isDayView = view === PLANNING_VIEW.day.id;

  return (
    <div
      className={cn(
        "grid w-full min-h-[calc(100vh-14rem)] gap-px bg-border",
        GRID_CLASS[view],
        isDayView && "grid-cols-1",
      )}
    >
      {dates.map((date) => (
        <PlanningDayColumn
          key={date}
          date={date}
          slots={grouped[date] ?? []}
          todayIso={todayIso}
          className={cn(
            "min-h-[calc(100vh-14rem)]",
            !isDayView && "min-h-[12rem] lg:min-h-[calc(100vh-14rem)]",
          )}
        />
      ))}
    </div>
  );
}
