import { Link } from "react-router-dom";

import { StudioBriefRow, StudioSection, StudioSheet } from "@/components/studio/StudioSheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAngleLabel } from "@/content/angles";
import { getContentRoleLabel } from "@/content/content-roles";
import { getFormatLabel } from "@/content/formats";
import { getInspirationByKey } from "@/content/inspiration-feed";
import { getPlanningAccountLabel } from "@/content/planning-accounts";
import { getPlanningPillarLabel } from "@/content/planning-pillars";
import type { PlanningSlot } from "@/content/planned-slots";
import {
  PROPOSAL_STATUS_LABELS,
  SIGNAL_SOURCE_TYPE_LABELS,
  type Proposal,
} from "@/content/proposals";
import { useInspirationOverrides } from "@/hooks/use-inspiration-overrides";
import { useProposals } from "@/hooks/use-proposals";

export function ProposalDetailSheet({
  proposal,
  slot,
  open,
  onOpenChange,
}: {
  proposal: Proposal | undefined;
  slot: PlanningSlot | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { selectProposal } = useProposals();
  const { overrides } = useInspirationOverrides();
  const inspiration = proposal?.sourceRef
    ? getInspirationByKey(proposal.sourceRef, overrides)
    : undefined;
  const selected = proposal?.status === "selected";
  const blocks = [...(proposal?.contentBlocks ?? [])].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <StudioSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Propuesta"
      description="Copy de Cursor listo para ensamblar. El Studio no lo genera."
    >
      {proposal ? (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant={selected ? "default" : "secondary"}>
              {PROPOSAL_STATUS_LABELS[proposal.status]}
            </Badge>
            {proposal.angleId ? (
              <Badge variant="outline">{getAngleLabel(proposal.angleId)}</Badge>
            ) : null}
          </div>

          {slot ? (
            <StudioSection title="Slot original">
              <div className="grid grid-cols-2 gap-3">
                <StudioBriefRow
                  label="Cuenta"
                  value={getPlanningAccountLabel(slot.accountId)}
                />
                <StudioBriefRow
                  label="Publicación"
                  value={`${slot.date} · ${slot.time}`}
                />
                <StudioBriefRow
                  label="Rol"
                  value={getContentRoleLabel(slot.roleId)}
                />
                <StudioBriefRow
                  label="Pilar"
                  value={getPlanningPillarLabel(slot.pillarId)}
                />
                <StudioBriefRow
                  label="Formato"
                  value={getFormatLabel(slot.formatId)}
                />
              </div>
              <Link
                to={`/planificacion?slot=${encodeURIComponent(slot.id)}`}
                className="text-[13px] font-medium underline underline-offset-2"
              >
                Abrir slot
              </Link>
            </StudioSection>
          ) : null}

          <StudioSection title="Inspiración">
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              {SIGNAL_SOURCE_TYPE_LABELS[proposal.signalSourceType]}
              {inspiration ? ` · ${inspiration.title}` : ""}
              {proposal.signal ? ` · ${proposal.signal}` : ""}
            </p>
          </StudioSection>

          <StudioSection title="Concepto y hook">
            <p className="text-[15px] font-medium leading-snug">{proposal.hook}</p>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              {proposal.concept}
            </p>
          </StudioSection>

          {proposal.narrative ? (
            <StudioSection title="Narrativa">
              <p className="text-[13px] leading-relaxed">{proposal.narrative}</p>
            </StudioSection>
          ) : null}

          {blocks.length > 0 ? (
            <StudioSection title="Slides / escenas">
              <ol className="space-y-3">
                {blocks.map((block) => (
                  <li
                    key={`${block.order}-${block.copy.slice(0, 12)}`}
                    className="rounded-lg border border-border px-3 py-3"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      {block.type ?? "Bloque"} {block.order}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed">{block.copy}</p>
                    {block.visualDirection ? (
                      <p className="mt-1 text-[12px] text-muted-foreground">
                        Visual: {block.visualDirection}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ol>
            </StudioSection>
          ) : null}

          {proposal.cta ? (
            <StudioSection title="CTA">
              <p className="text-[13px]">{proposal.cta}</p>
            </StudioSection>
          ) : null}

          {proposal.caption ? (
            <StudioSection title="Caption">
              <p className="whitespace-pre-wrap text-[13px] leading-relaxed">
                {proposal.caption}
              </p>
            </StudioSection>
          ) : null}

          {proposal.visualDirection ? (
            <StudioSection title="Dirección visual">
              <p className="text-[13px] leading-relaxed">{proposal.visualDirection}</p>
            </StudioSection>
          ) : null}

          {selected ? (
            <p className="text-[13px] text-muted-foreground">
              Listo para ensamblar: copy de Cursor + imágenes/video + sistema visual
              Mercantis en Figma.
            </p>
          ) : (
            <Button type="button" onClick={() => selectProposal(proposal.id)}>
              Seleccionar
            </Button>
          )}
        </div>
      ) : (
        <p className="text-[13px] text-muted-foreground">
          No encontramos esa propuesta.
        </p>
      )}
    </StudioSheet>
  );
}
