import { getContentRoleLabel } from "@/content/content-roles";
import { getPlanningAccountLabel } from "@/content/planning-accounts";
import { getPlanningPillarLabel } from "@/content/planning-pillars";
import type { PlanningSlot } from "@/content/planned-slots";
import { cn } from "@/lib/utils";

const ROLE_CHIP_CLASS: Record<string, string> = {
  alcance: "bg-violet-500/15 text-violet-900 dark:text-violet-200",
  valor: "bg-sky-500/15 text-sky-900 dark:text-sky-200",
  prueba: "bg-emerald-500/15 text-emerald-900 dark:text-emerald-200",
  conversion: "bg-amber-500/15 text-amber-900 dark:text-amber-200",
  marca: "bg-rose-500/15 text-rose-900 dark:text-rose-200",
  comunidad: "bg-fuchsia-500/15 text-fuchsia-900 dark:text-fuchsia-200",
};

export function PlanningSlotChip({
  slot,
  showAccount = false,
}: {
  slot: PlanningSlot;
  showAccount?: boolean;
}) {
  return (
    <div
      className={cn(
        "truncate rounded px-1.5 py-0.5 text-[10px] font-medium leading-tight",
        ROLE_CHIP_CLASS[slot.roleId],
      )}
      title={`${getContentRoleLabel(slot.roleId)} · ${getPlanningPillarLabel(slot.pillarId)}`}
    >
      {showAccount
        ? `${getPlanningAccountLabel(slot.accountId).split(" ")[0]} · `
        : null}
      {getPlanningPillarLabel(slot.pillarId)}
    </div>
  );
}
