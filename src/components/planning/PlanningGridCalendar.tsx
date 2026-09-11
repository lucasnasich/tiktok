import { PlanningDayColumn } from "@/components/planning/PlanningDayColumn";
import type { PlanningViewId } from "@/content/planning-view";
import { PLANNING_VIEW } from "@/content/planning-view";
import type { PlanningStudioAccount } from "@/content/planning-studio-accounts";
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
  accountFilter,
  studioAccounts,
  onOpenSlot,
}: {
  view: PlanningViewId;
  dates: string[];
  slots: PlanningSlot[];
  todayIso: string;
  accountFilter?: string;
  studioAccounts?: PlanningStudioAccount[];
  onOpenSlot?: (slot: PlanningSlot) => void;
}) {
  const grouped = groupSlotsByDate(slots, dates);

  return (
    <div
      className={cn(
        "grid h-full min-h-0 w-full flex-1 auto-rows-fr gap-px bg-border",
        GRID_CLASS[view],
      )}
    >
      {dates.map((date) => (
        <PlanningDayColumn
          key={date}
          date={date}
          slots={grouped[date] ?? []}
          todayIso={todayIso}
          accountFilter={accountFilter}
          studioAccounts={studioAccounts}
          onOpenSlot={onOpenSlot}
          dense
          className="h-full min-h-0"
        />
      ))}
    </div>
  );
}
