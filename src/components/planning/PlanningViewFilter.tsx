import { CalendarBlankIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PLANNING_VIEW,
  type PlanningViewId,
} from "@/content/planning-view";

function getViewLabel(viewId: PlanningViewId): string {
  return (
    Object.values(PLANNING_VIEW).find((view) => view.id === viewId)?.label ??
    viewId
  );
}

export function PlanningViewFilter({
  value,
  onChange,
}: {
  value: PlanningViewId;
  onChange: (viewId: PlanningViewId) => void;
}) {
  const activeLabel = getViewLabel(value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label={`Vista: ${activeLabel}`}
        >
          <CalendarBlankIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => onChange(next as PlanningViewId)}
        >
          {Object.values(PLANNING_VIEW).map((view) => (
            <DropdownMenuRadioItem key={view.id} value={view.id}>
              {view.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
