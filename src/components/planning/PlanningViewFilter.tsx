import { CalendarBlankIcon } from "@phosphor-icons/react";

import { PlanningToolbarIconButton } from "@/components/planning/PlanningToolbarButton";
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
        <PlanningToolbarIconButton aria-label={`Vista: ${activeLabel}`}>
          <CalendarBlankIcon />
        </PlanningToolbarIconButton>
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
