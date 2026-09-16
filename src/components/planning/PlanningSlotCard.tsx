import type { KeyboardEvent } from "react";

import { PlatformIcon } from "@/components/icons/platform-icon";
import { getAngleLabel } from "@/content/angles";
import { getContentRoleLabel, normalizeRoleId } from "@/content/content-roles";
import { getFormatLabel } from "@/content/formats";
import { getPlanningAccountLabel } from "@/content/planning-accounts";
import { getPlanningPillarLabel } from "@/content/planning-pillars";
import type { PlanningStudioAccount } from "@/content/planning-studio-accounts";
import {
  DISTRIBUTION_TYPE_LABELS,
  PLANNING_SLOT_STATUS_LABELS,
  getSlotDisplayPlatforms,
  getSlotDistributionType,
  sortSlotPlatforms,
  type PlanningSlot,
} from "@/content/planned-slots";
import { SlotPublicationLed } from "@/components/planning/SlotPublicationLed";
import { Badge } from "@/components/ui/badge";
import { SLOT_WORKFLOW_STATUS_LABELS } from "@/content/slot-workflow";
import { useProposals } from "@/hooks/use-proposals";
import { useSlotSpecs } from "@/hooks/use-slot-specs";
import { selectedProposalForSlot } from "@/lib/proposals-store";
import {
  deriveSlotPublicationLed,
  deriveSlotWorkflowStatus,
} from "@/lib/slot-workflow";
import { cn } from "@/lib/utils";

const ROLE_BADGE_CLASS: Record<string, string> = {
  build_in_public: "bg-violet-500/15 text-violet-800 dark:text-violet-300",
  educacion: "bg-sky-500/15 text-sky-800 dark:text-sky-300",
  producto: "bg-indigo-500/15 text-indigo-800 dark:text-indigo-300",
  marca: "bg-rose-500/15 text-rose-800 dark:text-rose-300",
  evidencia: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
  comunidad: "bg-fuchsia-500/15 text-fuchsia-800 dark:text-fuchsia-300",
};

const PLATFORM_LABELS: Record<string, string> = {
  tiktok: "TikTok",
  instagram: "IG",
};

function SlotPlatformIcons({
  platforms,
}: {
  platforms: ReturnType<typeof sortSlotPlatforms>;
}) {
  const ordered = sortSlotPlatforms(platforms);

  if (ordered.length === 0) return null;

  return (
    <span className="inline-flex shrink-0 items-center gap-0.5" aria-hidden>
      {ordered.map((platform) => (
        <PlatformIcon
          key={platform}
          platform={platform}
          size={12}
          className="text-muted-foreground"
        />
      ))}
    </span>
  );
}

export function PlanningSlotCard({
  slot,
  variant = "default",
  accountFilter,
  studioAccounts = [],
  onOpen,
}: {
  slot: PlanningSlot;
  variant?: "default" | "grid";
  accountFilter?: string;
  studioAccounts?: PlanningStudioAccount[];
  onOpen?: (slot: PlanningSlot) => void;
}) {
  const { proposals } = useProposals();
  const { getRecord } = useSlotSpecs();
  const selected = selectedProposalForSlot(proposals, slot.id);
  const workflow = deriveSlotWorkflowStatus(slot.id, getRecord(slot.id), proposals);
  const publicationLed = deriveSlotPublicationLed(slot, proposals);
  const distributionType = getSlotDistributionType(slot);
  const displayPlatforms = getSlotDisplayPlatforms(
    slot,
    accountFilter,
    studioAccounts,
  );

  const interactiveProps = onOpen
    ? {
        role: "button" as const,
        tabIndex: 0,
        onClick: () => onOpen(slot),
        onKeyDown: (event: KeyboardEvent) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen(slot);
          }
        },
      }
    : {};

  if (variant === "grid") {
    return (
      <div
        {...interactiveProps}
        className={cn(
          "w-full px-2 py-2 text-left",
          onOpen &&
            "cursor-pointer bg-secondary transition-colors duration-150 hover:bg-card",
        )}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <SlotPublicationLed status={publicationLed} />
          <SlotPlatformIcons platforms={displayPlatforms} />
          <p className="min-w-0 truncate text-[12px] font-medium leading-snug text-foreground">
            {getPlanningPillarLabel(slot.pillarId)}
          </p>
        </div>
        <p className="mt-0.5 truncate text-[11px] leading-snug text-muted-foreground">
          {slot.time} · {getContentRoleLabel(slot.roleId)} ·{" "}
          {getFormatLabel(slot.formatId)}
        </p>
      </div>
    );
  }

  return (
    <div
      {...interactiveProps}
      className={cn(
        "w-full px-2 py-2.5 text-left",
        onOpen && "cursor-pointer transition-colors hover:bg-muted/40",
      )}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge
          variant="secondary"
          className={cn(
            "border-0 text-[11px] font-medium",
            ROLE_BADGE_CLASS[normalizeRoleId(slot.roleId)],
          )}
        >
          {getContentRoleLabel(slot.roleId)}
        </Badge>
        <Badge variant="outline" className="text-[11px]">
          {SLOT_WORKFLOW_STATUS_LABELS[workflow]}
        </Badge>
        <Badge variant="outline" className="text-[11px]">
          {PLANNING_SLOT_STATUS_LABELS[slot.status]}
        </Badge>
        {distributionType !== "organic" ? (
          <Badge variant="outline" className="text-[11px]">
            {DISTRIBUTION_TYPE_LABELS[distributionType]}
          </Badge>
        ) : null}
      </div>

      <div className="mt-1.5 flex min-w-0 items-center gap-1.5">
        <SlotPublicationLed status={publicationLed} />
        <SlotPlatformIcons platforms={displayPlatforms} />
        <p className="min-w-0 text-[14px] font-medium leading-snug tracking-tight text-foreground">
          {getPlanningPillarLabel(slot.pillarId)}
        </p>
      </div>

      <div className="mt-1.5 space-y-1">
        <p className="text-[12px] text-muted-foreground">
          {slot.time} · {getPlanningAccountLabel(slot.accountId)} ·{" "}
          {slot.platforms.map((p) => PLATFORM_LABELS[p] ?? p).join(" + ")}
          {slot.generated ? " · auto" : ""}
        </p>
        <p className="text-[13px] leading-relaxed text-foreground">
          {getFormatLabel(slot.formatId)}
          {slot.angleId ? ` · ${getAngleLabel(slot.angleId)}` : ""}
        </p>
        {selected ? (
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            Propuesta: {selected.hook}
          </p>
        ) : (
          <p className="text-[12px] text-muted-foreground">
            {SLOT_WORKFLOW_STATUS_LABELS[workflow]}
          </p>
        )}
        {slot.postId ? (
          <p className="text-[11px] font-medium text-muted-foreground">
            Post: {slot.postId}
          </p>
        ) : null}
        {slot.notes ? (
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            {slot.notes}
          </p>
        ) : null}
      </div>
    </div>
  );
}
