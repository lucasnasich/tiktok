import { PlanningGridCalendar } from "@/components/planning/PlanningGridCalendar";
import { PlanningMonthCalendar } from "@/components/planning/PlanningMonthCalendar";
import type { PlanningViewId } from "@/content/planning-view";
import { PLANNING_VIEW } from "@/content/planning-view";
import type { PlanningStudioAccount } from "@/content/planning-studio-accounts";
import type { PlanningSlot } from "@/content/planned-slots";
import type { MonthCalendarDay } from "@/lib/planning";

export function PlanningCalendar({
  view,
  dates,
  monthDays,
  slots,
  todayIso,
  accountFilter,
  studioAccounts,
  onOpenSlot,
}: {
  view: PlanningViewId;
  dates: string[];
  monthDays: MonthCalendarDay[];
  slots: PlanningSlot[];
  todayIso: string;
  accountFilter?: string;
  studioAccounts?: PlanningStudioAccount[];
  onOpenSlot?: (slot: PlanningSlot) => void;
}) {
  if (view === PLANNING_VIEW.month.id) {
    return (
      <div className="flex h-full min-h-0 flex-1 flex-col">
        <PlanningMonthCalendar
          days={monthDays}
          slots={slots}
          todayIso={todayIso}
          onOpenSlot={onOpenSlot}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <PlanningGridCalendar
        view={view}
        dates={dates}
        slots={slots}
        todayIso={todayIso}
        accountFilter={accountFilter}
        studioAccounts={studioAccounts}
        onOpenSlot={onOpenSlot}
      />
    </div>
  );
}
