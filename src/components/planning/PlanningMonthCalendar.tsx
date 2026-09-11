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
  onOpenSlot,
}: {
  days: MonthCalendarDay[];
  slots: PlanningSlot[];
  todayIso: string;
  onOpenSlot?: (slot: PlanningSlot) => void;
}) {
  const dates = days.map((day) => day.iso);
  const grouped = groupSlotsByDate(slots, dates);

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <div className="grid shrink-0 grid-cols-7 gap-px bg-border">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="bg-secondary px-2 py-2 text-center text-[11px] font-medium text-muted-foreground"
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
                "flex min-h-[6rem] min-w-0 flex-col border-l-[3px] border-l-transparent bg-secondary",
                isToday && "border-l-calendar-today",
              )}
            >
              <header
                className={cn(
                  "flex items-center justify-between gap-1 border-b border-border px-2 py-1.5",
                  isToday && "bg-calendar-today-muted",
                )}
              >
                <span
                  className={cn(
                    "text-[12px] font-medium tabular-nums",
                    isToday
                      ? "text-calendar-today"
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

              <div className="flex min-h-0 flex-1 flex-col divide-y divide-border overflow-hidden">
                {daySlots.slice(0, 3).map((slot) => (
                  <PlanningSlotChip
                    key={slot.id}
                    slot={slot}
                    showAccount
                    onOpen={onOpenSlot}
                  />
                ))}
                {daySlots.length > 3 ? (
                  <span className="px-2 py-1 text-[10px] text-muted-foreground">
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
