import { getAngleLabel } from "@/content/angles";
import { getContentRoleLabel } from "@/content/content-roles";
import { getFormatLabel } from "@/content/formats";
import { getPlanningAccountLabel } from "@/content/planning-accounts";
import { getPlanningPillarLabel } from "@/content/planning-pillars";
import {
  DISTRIBUTION_TYPE_LABELS,
  PLANNING_SLOT_STATUS_LABELS,
  getSlotDistributionType,
  type PlanningSlot,
} from "@/content/planned-slots";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SLOT_WORKFLOW_STATUS_LABELS } from "@/content/slot-workflow";
import { useProposals } from "@/hooks/use-proposals";
import { useSlotSpecs } from "@/hooks/use-slot-specs";
import { selectedProposalForSlot } from "@/lib/proposals-store";
import { deriveSlotWorkflowStatus } from "@/lib/slot-workflow";
import { cn } from "@/lib/utils";

const ROLE_BADGE_CLASS: Record<string, string> = {
  alcance: "bg-violet-500/15 text-violet-800 dark:text-violet-300",
  valor: "bg-sky-500/15 text-sky-800 dark:text-sky-300",
  prueba: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
  conversion: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  marca: "bg-rose-500/15 text-rose-800 dark:text-rose-300",
  comunidad: "bg-fuchsia-500/15 text-fuchsia-800 dark:text-fuchsia-300",
};

const PLATFORM_LABELS: Record<string, string> = {
  tiktok: "TikTok",
  instagram: "IG",
};

export function PlanningSlotCard({
  slot,
  onOpen,
}: {
  slot: PlanningSlot;
  onOpen?: (slot: PlanningSlot) => void;
}) {
  const { proposals } = useProposals();
  const { getRecord } = useSlotSpecs();
  const selected = selectedProposalForSlot(proposals, slot.id);
  const workflow = deriveSlotWorkflowStatus(slot.id, getRecord(slot.id), proposals);
  const distributionType = getSlotDistributionType(slot);

  return (
    <Card
      size="sm"
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen ? () => onOpen(slot) : undefined}
      onKeyDown={
        onOpen
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpen(slot);
              }
            }
          : undefined
      }
      className={cn(
        "ring-border/80",
        onOpen && "cursor-pointer transition-colors hover:bg-muted/40",
      )}
    >
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant="secondary"
            className={cn(
              "border-0 text-[11px] font-medium",
              ROLE_BADGE_CLASS[slot.roleId],
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
        <CardTitle className="text-[14px] leading-snug tracking-tight">
          {getPlanningPillarLabel(slot.pillarId)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
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
      </CardContent>
    </Card>
  );
}
