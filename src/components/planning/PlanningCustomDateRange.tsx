import { useState } from "react";
import { CalendarBlankIcon } from "@phosphor-icons/react";

import {
  formatPlanningDateLabel,
  PlanningCalendarPopover,
} from "@/components/planning/PlanningCalendarPopover";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function DateField({
  label,
  value,
  onChange,
  todayIso,
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (iso: string) => void;
  todayIso: string;
  min?: string;
  max?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-1">
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <div className="flex h-8 items-center gap-1 rounded-lg border border-border bg-background px-2.5">
        <span className="min-w-0 flex-1 truncate text-[13px] text-foreground">
          {formatPlanningDateLabel(value)}
        </span>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="shrink-0 text-muted-foreground hover:text-foreground"
              aria-label={`Elegir ${label.toLowerCase()}`}
            >
              <CalendarBlankIcon className="size-3.5" weight="bold" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0">
            <PlanningCalendarPopover
              value={value}
              todayIso={todayIso}
              min={min}
              max={max}
              onSelect={(iso) => {
                onChange(iso);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export function PlanningCustomDateRange({
  from,
  to,
  onChange,
  todayIso,
}: {
  from: string;
  to: string;
  onChange: (range: { from: string; to: string }) => void;
  todayIso: string;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <DateField
        label="Desde"
        value={from}
        todayIso={todayIso}
        max={to}
        onChange={(iso) =>
          onChange({
            from: iso,
            to: iso > to ? iso : to,
          })
        }
      />
      <DateField
        label="Hasta"
        value={to}
        todayIso={todayIso}
        min={from}
        onChange={(iso) =>
          onChange({
            from,
            to: iso,
          })
        }
      />
    </div>
  );
}
