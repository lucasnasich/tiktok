import { SlotPublicationLed } from "@/components/planning/SlotPublicationLed";
import { getContentRoleLabel, normalizeRoleId } from "@/content/content-roles";
import { getPlanningAccountLabel } from "@/content/planning-accounts";
import { getPlanningPillarLabel } from "@/content/planning-pillars";
import type { PlanningSlot } from "@/content/planned-slots";
import { useProposals } from "@/hooks/use-proposals";
import { deriveSlotPublicationLed } from "@/lib/slot-workflow";
import { cn } from "@/lib/utils";

const ROLE_CHIP_CLASS: Record<string, string> = {
  build_in_public: "bg-violet-500/15 text-violet-900 dark:text-violet-200",
  educacion: "bg-sky-500/15 text-sky-900 dark:text-sky-200",
  producto: "bg-indigo-500/15 text-indigo-900 dark:text-indigo-200",
  marca: "bg-rose-500/15 text-rose-900 dark:text-rose-200",
  evidencia: "bg-emerald-500/15 text-emerald-900 dark:text-emerald-200",
  comunidad: "bg-fuchsia-500/15 text-fuchsia-900 dark:text-fuchsia-200",
};

export function PlanningSlotChip({
  slot,
  showAccount = false,
  onOpen,
}: {
  slot: PlanningSlot;
  showAccount?: boolean;
  onOpen?: (slot: PlanningSlot) => void;
}) {
  const { proposals } = useProposals();
  const publicationLed = deriveSlotPublicationLed(slot, proposals);
  const label = `${getContentRoleLabel(slot.roleId)} · ${getPlanningPillarLabel(slot.pillarId)}`;
  const className = cn(
    "flex w-full min-w-0 items-center gap-1 px-2 py-1 text-left text-[10px] font-medium leading-tight",
    ROLE_CHIP_CLASS[normalizeRoleId(slot.roleId)],
    onOpen && "cursor-pointer hover:bg-muted/40",
  );
  const content = (
    <>
      <SlotPublicationLed status={publicationLed} />
      <span className="min-w-0 truncate">
        {showAccount
          ? `${getPlanningAccountLabel(slot.accountId).split(" ")[0]} · `
          : null}
        {getPlanningPillarLabel(slot.pillarId)}
      </span>
    </>
  );

  if (onOpen) {
    return (
      <button
        type="button"
        className={className}
        title={label}
        onClick={() => onOpen(slot)}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={className} title={label}>
      {content}
    </div>
  );
}
