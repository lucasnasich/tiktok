import { useMemo } from "react";
import { Link } from "react-router-dom";

import { PageStack } from "@/components/AppShell";
import { ProposalDetailSheet } from "@/components/proposals/ProposalDetailSheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAngleLabel } from "@/content/angles";
import { getContentRoleLabel } from "@/content/content-roles";
import { getPlanningAccountLabel } from "@/content/planning-accounts";
import { getSlotTopicLabel } from "@/content/role-topics";
import {
  getSlotPublicationTypeShortLabel,
  type PlanningSlot,
} from "@/content/planned-slots";
import {
  PROPOSAL_STATUS_LABELS,
  SIGNAL_SOURCE_TYPE_LABELS,
  type Proposal,
} from "@/content/proposals";
import { SLOT_WORKFLOW_STATUS_LABELS } from "@/content/slot-workflow";
import { useProposals } from "@/hooks/use-proposals";
import { useSheetSearchParam } from "@/hooks/use-sheet-search-param";
import { useSlotSpecs } from "@/hooks/use-slot-specs";
import { selectedProposalForSlot } from "@/lib/proposals-store";
import { deriveSlotWorkflowStatus } from "@/lib/slot-workflow";

function slotBrief(slot: PlanningSlot): string {
  return [
    getPlanningAccountLabel(slot.accountId),
    getContentRoleLabel(slot.roleId),
    getSlotTopicLabel(slot),
    getSlotPublicationTypeShortLabel(slot),
  ].join(" · ");
}

function ProposalCard({
  proposal,
  onOpen,
  onSelect,
}: {
  proposal: Proposal;
  onOpen: (id: string) => void;
  onSelect: (id: string) => void;
}) {
  const selected = proposal.status === "selected";

  return (
    <Card
      size="sm"
      className="cursor-pointer ring-border/80 transition-colors hover:bg-muted/40"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(proposal.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(proposal.id);
        }
      }}
    >
      <CardHeader>
        <CardTitle className="text-[15px] tracking-tight">{proposal.hook}</CardTitle>
        <CardAction>
          <Badge variant={selected ? "default" : "secondary"} className="text-[11px]">
            {PROPOSAL_STATUS_LABELS[proposal.status]}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <p className="text-[13px] leading-relaxed text-foreground">{proposal.concept}</p>
        <p className="text-[12px] text-muted-foreground">
          {SIGNAL_SOURCE_TYPE_LABELS[proposal.signalSourceType]}
          {proposal.signal ? ` · ${proposal.signal}` : ""}
          {proposal.angleId ? ` · ${getAngleLabel(proposal.angleId)}` : ""}
        </p>
        {selected ? null : (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={(event) => {
              event.stopPropagation();
              onSelect(proposal.id);
            }}
          >
            Seleccionar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function ProposalsBoard({
  slots,
  todayIso,
}: {
  slots: PlanningSlot[];
  todayIso: string;
}) {
  const [proposalId, setProposalId] = useSheetSearchParam("proposal");
  const { proposals, selectProposal } = useProposals();
  const { records } = useSlotSpecs();

  const slotById = useMemo(
    () => new Map(slots.map((slot) => [slot.id, slot])),
    [slots],
  );
  const activeProposal = proposalId
    ? proposals.find((proposal) => proposal.id === proposalId)
    : undefined;

  const grouped = useMemo(() => {
    const groups = new Map<string, Proposal[]>();
    for (const proposal of proposals) {
      const list = groups.get(proposal.planSlotId) ?? [];
      list.push(proposal);
      groups.set(proposal.planSlotId, list);
    }
    return [...groups.entries()].sort((a, b) => {
      const slotA = slotById.get(a[0]);
      const slotB = slotById.get(b[0]);
      if (!slotA || !slotB) return a[0].localeCompare(b[0]);
      return (
        slotA.date.localeCompare(slotB.date) ||
        slotA.time.localeCompare(slotB.time)
      );
    });
  }, [proposals, slotById]);

  const upcoming = useMemo(() => {
    return slots
      .filter((slot) => slot.date >= todayIso && slot.status !== "publicado")
      .filter((slot) => !selectedProposalForSlot(proposals, slot.id))
      .slice(0, 10);
  }, [proposals, slots, todayIso]);

  return (
    <PageStack className="gap-6">
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        Cursor desarrolla las propuestas a partir del SlotSpec. Acá comparás y
        elegís. El Studio no genera copy.
      </p>

      {grouped.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-[15px] font-medium tracking-tight">Propuestas por slot</h2>
          {grouped.map(([planSlotId, slotProposals]) => {
            const slot = slotById.get(planSlotId);
            const workflow = deriveSlotWorkflowStatus(
              planSlotId,
              records[planSlotId],
              proposals,
            );
            return (
              <div key={planSlotId} className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[13px] font-medium text-foreground">
                    {slot
                      ? `${slot.date} ${slot.time} · ${slotBrief(slot)}`
                      : planSlotId}
                  </p>
                  <Badge variant="outline" className="text-[11px]">
                    {SLOT_WORKFLOW_STATUS_LABELS[workflow]}
                  </Badge>
                </div>
                {slotProposals.map((proposal) => (
                  <ProposalCard
                    key={proposal.id}
                    proposal={proposal}
                    onOpen={setProposalId}
                    onSelect={selectProposal}
                  />
                ))}
              </div>
            );
          })}
        </section>
      ) : (
        <p className="text-[14px] leading-relaxed text-muted-foreground">
          Todavía no hay propuestas. Abrí un slot en Planificación, prepará el
          spec y pedile a Cursor que lo desarrolle.
        </p>
      )}

      {upcoming.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-[15px] font-medium tracking-tight">
            Slots sin propuesta seleccionada
          </h2>
          <div className="grid gap-2">
            {upcoming.map((slot) => (
              <Link
                key={slot.id}
                to={`/planificacion?slot=${encodeURIComponent(slot.id)}`}
                className="rounded-lg border border-border px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
              >
                <p className="text-[13px] font-medium">
                  {slot.date} · {slot.time} · {getContentRoleLabel(slot.roleId)}
                </p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  {slotBrief(slot)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <ProposalDetailSheet
        proposal={activeProposal}
        slot={
          activeProposal
            ? slotById.get(activeProposal.planSlotId)
            : undefined
        }
        open={Boolean(proposalId)}
        onOpenChange={(open) => {
          if (!open) setProposalId(null);
        }}
      />
    </PageStack>
  );
}
