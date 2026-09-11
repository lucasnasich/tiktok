import { PlanningSlotCard } from "@/components/planning/PlanningSlotCard";
import type { PlanningStudioAccount } from "@/content/planning-studio-accounts";
import type { PlanningSlot } from "@/content/planned-slots";
import { formatDayLabel } from "@/lib/planning";
import { cn } from "@/lib/utils";

export function PlanningDayColumn({
  date,
  slots,
  todayIso,
  compact = false,
  dense = false,
  className,
  accountFilter,
  studioAccounts,
  onOpenSlot,
}: {
  date: string;
  slots: PlanningSlot[];
  todayIso: string;
  compact?: boolean;
  /** Vista rejilla (día / 4 días / semana): slots compactos, sin cajas. */
  dense?: boolean;
  className?: string;
  accountFilter?: string;
  studioAccounts?: PlanningStudioAccount[];
  onOpenSlot?: (slot: PlanningSlot) => void;
}) {
  const isToday = date === todayIso;

  return (
    <section
      className={cn(
        "flex min-h-0 min-w-0 flex-col border-l-[3px] border-l-transparent bg-secondary",
        isToday && "border-l-calendar-today",
        className,
      )}
    >
      <header
        className={cn(
          "shrink-0 border-b border-border",
          compact || dense ? "px-2 py-1.5" : "px-2 py-2",
          isToday && "bg-calendar-today-muted",
        )}
      >
        <h3
          className={cn(
            "flex items-center gap-1.5 font-medium tracking-tight",
            compact ? "text-[11px]" : "text-[13px]",
            isToday ? "text-calendar-today" : "text-muted-foreground",
          )}
        >
          {isToday ? (
            <span
              className="size-1.5 shrink-0 rounded-full bg-calendar-today"
              aria-hidden
            />
          ) : null}
          {formatDayLabel(date, todayIso)}
        </h3>
        {!compact && !dense ? (
          <p className="text-[11px] text-muted-foreground">
            {slots.length} slot{slots.length === 1 ? "" : "s"}
          </p>
        ) : null}
      </header>

      <div className="flex min-h-0 flex-1 flex-col divide-y divide-border overflow-y-auto">
        {slots.length === 0 ? (
          <p
            className={cn(
              "px-2 leading-relaxed text-muted-foreground",
              compact || dense ? "py-1.5 text-[10px]" : "py-2 text-[12px]",
            )}
          >
            {compact || dense ? "—" : "Sin slots planificados."}
          </p>
        ) : (
          slots.map((slot) => (
            <PlanningSlotCard
              key={slot.id}
              slot={slot}
              variant={dense ? "grid" : "default"}
              accountFilter={accountFilter}
              studioAccounts={studioAccounts}
              onOpen={onOpenSlot}
            />
          ))
        )}
      </div>
    </section>
  );
}
