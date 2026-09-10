import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

export function PlanningPeriodNav({
  periodLabel,
  onPrevious,
  onNext,
  onToday,
  previousLabel = "Período anterior",
  nextLabel = "Período siguiente",
}: {
  periodLabel: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  previousLabel?: string;
  nextLabel?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={previousLabel}
        onClick={onPrevious}
      >
        <CaretLeftIcon className="size-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 px-2.5 text-xs font-medium"
        onClick={onToday}
      >
        Hoy
      </Button>
      <span className="min-w-[9rem] text-center text-xs capitalize text-muted-foreground">
        {periodLabel}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={nextLabel}
        onClick={onNext}
      >
        <CaretRightIcon className="size-4" />
      </Button>
    </div>
  );
}
