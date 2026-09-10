import { PlanningSlotCard } from "@/components/planning/PlanningSlotCard";
import type { PlanningSlot } from "@/content/planned-slots";
import { formatDayLabel } from "@/lib/planning";
import { cn } from "@/lib/utils";

export function PlanningDayColumn({
  date,
  slots,
  todayIso,
  compact = false,
  className,
}: {
  date: string;
  slots: PlanningSlot[];
  todayIso: string;
  compact?: boolean;
  className?: string;
}) {
  const isToday = date === todayIso;

  return (
    <section
      className={cn(
        "flex min-h-0 flex-col bg-card",
        compact ? "p-2" : "rounded-xl border border-border p-3",
        isToday && !compact && "ring-1 ring-foreground/15",
        isToday && compact && "bg-muted/30",
        className,
      )}
    >
      <header
        className={cn(
          "shrink-0",
          compact ? "mb-1.5" : "mb-3 border-b border-border pb-2",
        )}
      >
        <h3
          className={cn(
            "font-medium tracking-tight",
            compact ? "text-[11px]" : "text-[13px]",
            isToday ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {formatDayLabel(date, todayIso)}
        </h3>
        {!compact ? (
          <p className="text-[11px] text-muted-foreground">
            {slots.length} slot{slots.length === 1 ? "" : "s"}
          </p>
        ) : null}
      </header>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto",
          compact && "gap-1",
        )}
      >
        {slots.length === 0 ? (
          <p
            className={cn(
              "leading-relaxed text-muted-foreground",
              compact ? "text-[10px]" : "text-[12px]",
            )}
          >
            {compact ? "—" : "Sin slots planificados."}
          </p>
        ) : (
          slots.map((slot) => <PlanningSlotCard key={slot.id} slot={slot} />)
        )}
      </div>
    </section>
  );
}
