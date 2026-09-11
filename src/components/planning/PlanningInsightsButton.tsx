import { BellIcon } from "@phosphor-icons/react";

import {
  PlanningToolbarButton,
  PlanningToolbarIconButton,
} from "@/components/planning/PlanningToolbarButton";
export function PlanningInsightsButton({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  const label =
    count === 0
      ? "Sin avisos para este período"
      : `${count} aviso${count === 1 ? "" : "s"} para este período`;

  if (count > 0) {
    return (
      <PlanningToolbarButton
        type="button"
        aria-label={label}
        onClick={onClick}
        className="min-w-8 px-2"
      >
        <BellIcon weight="fill" />
        <span className="tabular-nums">{count > 9 ? "9+" : count}</span>
      </PlanningToolbarButton>
    );
  }

  return (
    <PlanningToolbarIconButton
      type="button"
      aria-label={label}
      onClick={onClick}
    >
      <BellIcon />
    </PlanningToolbarIconButton>
  );
}
