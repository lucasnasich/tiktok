import { useMemo, useState } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  getMonthCalendarDays,
  parseIsoDate,
  WEEKDAY_LABELS,
} from "@/lib/planning-dates";
import { cn } from "@/lib/utils";

type PlanningCalendarPopoverProps = {
  value: string;
  onSelect: (iso: string) => void;
  todayIso: string;
  min?: string;
  max?: string;
};

function formatMonthTitle(date: Date): string {
  const label = date.toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function PlanningCalendarPopover({
  value,
  onSelect,
  todayIso,
  min,
  max,
}: PlanningCalendarPopoverProps) {
  const [viewMonth, setViewMonth] = useState(() => parseIsoDate(value || todayIso));
  const days = useMemo(() => getMonthCalendarDays(viewMonth), [viewMonth]);

  const isDisabled = (iso: string) => {
    if (min && iso < min) return true;
    if (max && iso > max) return true;
    return false;
  };

  return (
    <div className="w-[280px] p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Mes anterior"
          onClick={() =>
            setViewMonth((current) => {
              const next = new Date(current);
              next.setMonth(next.getMonth() - 1);
              return next;
            })
          }
        >
          <CaretLeftIcon className="size-4" />
        </Button>
        <p className="text-[13px] font-medium capitalize">
          {formatMonthTitle(viewMonth)}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Mes siguiente"
          onClick={() =>
            setViewMonth((current) => {
              const next = new Date(current);
              next.setMonth(next.getMonth() + 1);
              return next;
            })
          }
        >
          <CaretRightIcon className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="py-1 text-center text-[10px] font-medium text-muted-foreground"
          >
            {label}
          </div>
        ))}

        {days.map((day) => {
          const selected = day.iso === value;
          const today = day.iso === todayIso;
          const disabled = isDisabled(day.iso);

          return (
            <button
              key={day.iso}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(day.iso)}
              className={cn(
                "flex size-8 items-center justify-center rounded-lg text-[12px] tabular-nums transition-colors",
                !day.inCurrentMonth && "text-muted-foreground/45",
                day.inCurrentMonth && !selected && "text-foreground",
                selected && "bg-primary text-primary-foreground shadow-sm",
                !selected && !disabled && "hover:bg-muted",
                disabled && "cursor-not-allowed opacity-35",
                today && !selected && "ring-1 ring-calendar-today ring-inset",
              )}
            >
              {parseIsoDate(day.iso).getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="text-[11px]"
          onClick={() => onSelect(todayIso)}
          disabled={isDisabled(todayIso)}
        >
          Hoy
        </Button>
      </div>
    </div>
  );
}

export function formatPlanningDateLabel(iso: string): string {
  return parseIsoDate(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
