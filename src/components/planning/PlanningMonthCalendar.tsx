import { PlanningSlotChip } from "@/components/planning/PlanningSlotChip";
import type { PlanningSlot } from "@/content/planned-slots";
import {
  WEEKDAY_LABELS,
  type MonthCalendarDay,
  groupSlotsByDate,
  parseIsoDate,
} from "@/lib/planning";
import { cn } from "@/lib/utils";

export function PlanningMonthCalendar({
  days,
  slots,
  todayIso,
}: {
  days: MonthCalendarDay[];
  slots: PlanningSlot[];
  todayIso: string;
}) {
  const dates = days.map((day) => day.iso);
  const grouped = groupSlotsByDate(slots, dates);

  return (
    <div className="flex min-h-[calc(100vh-14rem)] w-full flex-col">
      <div className="grid shrink-0 grid-cols-7 gap-px bg-border">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="bg-card px-2 py-2 text-center text-[11px] font-medium text-muted-foreground"
          >
            {label}
          </div>
        ))}
      </div>

      <div
        className="grid min-h-0 flex-1 auto-rows-fr grid-cols-7 gap-px bg-border"
        style={{ gridTemplateRows: `repeat(${Math.ceil(days.length / 7)}, minmax(6rem, 1fr))` }}
      >
        {days.map((day) => {
          const daySlots = grouped[day.iso] ?? [];
          const isToday = day.iso === todayIso;
          const dayNumber = parseIsoDate(day.iso).getDate();

          return (
            <section
              key={day.iso}
              className={cn(
                "flex min-h-[6rem] flex-col bg-card p-2",
                !day.inCurrentMonth && "bg-muted/20",
                isToday && "ring-1 ring-inset ring-foreground/20",
              )}
            >
              <header className="mb-1.5 flex items-center justify-between gap-1">
                <span
                  className={cn(
                    "text-[12px] font-medium tabular-nums",
                    isToday
                      ? "text-foreground"
                      : day.inCurrentMonth
                        ? "text-foreground/80"
                        : "text-muted-foreground",
                  )}
                >
                  {dayNumber}
                </span>
                {daySlots.length > 0 ? (
                  <span className="text-[10px] tabular-nums text-muted-foreground">
                    {daySlots.length}
                  </span>
                ) : null}
              </header>

              <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden">
                {daySlots.slice(0, 3).map((slot) => (
                  <PlanningSlotChip key={slot.id} slot={slot} showAccount />
                ))}
                {daySlots.length > 3 ? (
                  <span className="text-[10px] text-muted-foreground">
                    +{daySlots.length - 3} más
                  </span>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
