import { useEffect, useMemo, useState } from "react";
import { ArrowLeftIcon, CopyIcon } from "@phosphor-icons/react";

import { InspirationDetailBody } from "@/components/inspiration/InspirationDetailBody";
import { SlotBriefCards } from "@/components/planning/SlotBriefCards";
import { SlotCreativeProposals } from "@/components/planning/SlotCreativeProposals";
import { SlotInspirationBrowse } from "@/components/planning/SlotInspirationBrowse";
import { SlotInspirationRecommendations } from "@/components/planning/SlotInspirationRecommendations";
import { StudioSection, StudioSheet } from "@/components/studio/StudioSheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAngleLabel } from "@/content/angles";
import { getContentRoleLabel } from "@/content/content-roles";
import { getInspirationByKey } from "@/content/inspiration-feed";
import {
  getPlanningAccount,
  getSlotAccountLabel,
} from "@/content/planning-accounts";
import { getSlotTopicLabel } from "@/content/role-topics";
import { getPublicationTypeLabel } from "@/content/publication-types";
import {
  getSlotAccountIds,
  type PlanningSlot,
} from "@/content/planned-slots";
import type { PlanningStudioAccount } from "@/content/planning-studio-accounts";
import { PROPOSAL_STATUS_LABELS } from "@/content/proposals";
import { SLOT_SPEC_STATUS_LABELS } from "@/content/slot-specs";
import { SLOT_WORKFLOW_STATUS_LABELS } from "@/content/slot-workflow";
import { useInspirationOverrides } from "@/hooks/use-inspiration-overrides";
import { useProposals } from "@/hooks/use-proposals";
import { useSlotSpecs } from "@/hooks/use-slot-specs";
import { copyText } from "@/lib/clipboard";
import { selectedCreativeProposal } from "@/lib/creative-proposals";
import { usageForInspiration } from "@/lib/inspiration-usage";
import {
  proposalsForSlot,
  selectedProposalForSlot,
} from "@/lib/proposals-store";
import {
  applyGeneratedCreativeProposals,
  applyProposalInspirationRef,
  applySelectedCreativeProposal,
  assembleSlotSpec,
  canPrepareSlotSpec,
  cursorPromptForSpec,
  formatSlotSpecMarkdown,
} from "@/lib/slot-spec";
import { deriveSlotWorkflowStatus } from "@/lib/slot-workflow";
import { cn } from "@/lib/utils";

export function SlotDetailSheet({
  slot,
  slots,
  studioAccounts = [],
  open,
  onOpenChange,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
}: {
  slot: PlanningSlot | undefined;
  slots: PlanningSlot[];
  studioAccounts?: PlanningStudioAccount[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrev?: () => void;
  onNext?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
}) {
  const { proposals, selectProposal } = useProposals();
  const { records, getRecord, upsertRecord } = useSlotSpecs();
  const { overrides } = useInspirationOverrides();
  const [pane, setPane] = useState<"slot" | "inspiration">("slot");
  const [inspectingKey, setInspectingKey] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showInspirationSearch, setShowInspirationSearch] = useState(false);
  const [copied, setCopied] = useState<"spec" | "prompt" | null>(null);

  useEffect(() => {
    setPane("slot");
    setInspectingKey(null);
    setShowLibrary(false);
    setShowInspirationSearch(false);
    setCopied(null);
  }, [slot?.id]);

  const record = slot ? getRecord(slot.id) : undefined;
  const specRecords = useMemo(() => Object.values(records), [records]);
  const idea = selectedCreativeProposal(
    record?.creativeProposals,
    record?.selectedCreativeProposalId,
  );

  const selected = slot
    ? selectedProposalForSlot(proposals, slot.id)
    : undefined;
  const candidates = slot ? proposalsForSlot(proposals, slot.id) : [];
  const workflow = slot
    ? deriveSlotWorkflowStatus(slot.id, record, proposals)
    : "falta-definir";
  const spec = slot
    ? assembleSlotSpec(slot, record, proposals, specRecords, slots, overrides)
    : undefined;
  const inspecting = inspectingKey
    ? getInspirationByKey(inspectingKey, overrides)
    : undefined;

  function associateInspiration(key: string, attached = true) {
    if (!slot || !record?.selectedCreativeProposalId) return;
    upsertRecord(
      applyProposalInspirationRef(
        record,
        slot.id,
        record.selectedCreativeProposalId,
        key,
        attached,
      ),
    );
    setPane("slot");
    setInspectingKey(null);
  }

  async function copySpec() {
    if (!spec) return;
    const ok = await copyText(formatSlotSpecMarkdown(spec));
    if (ok) setCopied("spec");
  }

  async function copyPrompt() {
    if (!spec) return;
    const ok = await copyText(cursorPromptForSpec(spec));
    if (ok) setCopied("prompt");
  }

  function prepareForCursor() {
    if (!slot || !record) return;
    upsertRecord({
      ...record,
      status: "ready-for-cursor",
      preparedAt: new Date().toISOString(),
    });
  }

  const canPrepare = canPrepareSlotSpec(record);
  const associatedKeys = new Set(idea?.inspirationRefs ?? []);

  return (
    <StudioSheet
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setPane("slot");
          setInspectingKey(null);
        }
        onOpenChange(next);
      }}
      title={
        pane === "inspiration"
          ? inspecting?.title ?? "Referencia"
          : slot
            ? getSlotTopicLabel(slot)
            : "Slot"
      }
      onPrev={pane === "slot" ? onPrev : undefined}
      onNext={pane === "slot" ? onNext : undefined}
      prevDisabled={prevDisabled}
      nextDisabled={nextDisabled}
    >
      {slot && spec ? (
        pane === "inspiration" && inspecting ? (
          <div className="space-y-4">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="-ml-2"
              onClick={() => {
                setPane("slot");
                setInspectingKey(null);
              }}
            >
              <ArrowLeftIcon className="size-3.5" />
              Volver al slot
            </Button>
            <InspirationDetailBody
              item={inspecting}
              usage={usageForInspiration(
                inspecting.key,
                proposals,
                specRecords,
                slots,
              )}
              slots={slots}
              proposals={proposals}
              onUse={() =>
                associateInspiration(
                  inspecting.key,
                  !associatedKeys.has(inspecting.key),
                )
              }
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary">
                {SLOT_WORKFLOW_STATUS_LABELS[workflow]}
              </Badge>
              {SLOT_SPEC_STATUS_LABELS[spec.status] !==
              SLOT_WORKFLOW_STATUS_LABELS[workflow] ? (
                <Badge variant="outline">
                  {SLOT_SPEC_STATUS_LABELS[spec.status]}
                </Badge>
              ) : null}
            </div>

            <SlotBriefCards slot={slot} studioAccounts={studioAccounts} />

            <SlotCreativeProposals
              spec={spec}
              record={record}
              accountLabel={getSlotAccountLabel(slot, studioAccounts)}
              overrides={overrides}
              onGenerated={(next) => {
                upsertRecord(
                  applyGeneratedCreativeProposals(record, slot.id, next),
                );
              }}
              onSelect={(proposalId) => {
                upsertRecord(
                  applySelectedCreativeProposal(record, slot.id, proposalId),
                );
                setShowInspirationSearch(false);
              }}
            />

            {idea ? (
              <StudioSection
                title="Dirección seleccionada"
                description={idea.title}
              >
                <p className="text-[13px] leading-relaxed">{idea.idea}</p>
                <p className="text-[12px] text-muted-foreground">
                  {idea.message}
                </p>
              </StudioSection>
            ) : null}

            {idea ? (
              <StudioSection
                title="Inspiración"
                description="Después de elegir una idea. Primero filtro por tipo de pieza; después afinidad con el concepto visual."
              >
                <Button
                  type="button"
                  size="sm"
                  variant={showInspirationSearch ? "outline" : "default"}
                  onClick={() =>
                    setShowInspirationSearch((value) => !value)
                  }
                >
                  {showInspirationSearch
                    ? "Ocultar referencias"
                    : "Buscar inspiración para esta idea"}
                </Button>
                {showInspirationSearch ? (
                  <div className="space-y-3 pt-3">
                    <p className="text-[12px] font-medium">
                      Referencias sugeridas
                    </p>
                    <SlotInspirationRecommendations
                      slot={slot}
                      record={record}
                      proposal={idea}
                      proposals={proposals}
                      specs={specRecords}
                      slots={slots}
                      overrides={overrides}
                      onOpenReference={(key) => {
                        setInspectingKey(key);
                        setPane("inspiration");
                      }}
                      onAssociate={(key, attached) =>
                        associateInspiration(key, attached)
                      }
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-7 px-0 text-xs"
                      onClick={() => setShowLibrary((value) => !value)}
                    >
                      {showLibrary
                        ? "Ocultar biblioteca completa"
                        : "Explorar biblioteca completa"}
                    </Button>
                    {showLibrary ? (
                      <SlotInspirationBrowse
                        slotId={slot.id}
                        onOpenReference={(key) => {
                          setInspectingKey(key);
                          setPane("inspiration");
                        }}
                      />
                    ) : null}
                    {associatedKeys.size > 0 ? (
                      <div className="space-y-1 pt-2">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          Asociadas a esta idea
                        </p>
                        {[...associatedKeys].map((key) => (
                          <p key={key} className="text-[13px]">
                            {getInspirationByKey(key, overrides)?.title ?? key}
                          </p>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </StudioSection>
            ) : null}

            <StudioSection
              title="Slot spec"
              description="Misión para Cursor cuando ya hay una dirección elegida. El Studio no escribe copy final."
            >
              <div className="space-y-2 rounded-lg border border-border px-3 py-3 text-[13px] leading-relaxed">
                <p>
                  {getSlotAccountLabel(slot, studioAccounts)} · {spec.date}{" "}
                  {spec.time}
                </p>
                <p>
                  {getContentRoleLabel(spec.roleId)} · {getSlotTopicLabel(slot)}{" "}
                  · {getPublicationTypeLabel(spec.productionTypeId)}
                </p>
                {idea ? (
                  <p className="text-muted-foreground">Idea: {idea.title}</p>
                ) : (
                  <p className="text-muted-foreground">
                    Elegí una propuesta creativa antes de preparar el spec.
                  </p>
                )}
                <p className="text-muted-foreground">
                  Brain: {spec.brainRefs.join(", ")}
                </p>
                <ul className="list-disc space-y-1 pl-4 text-[12px] text-muted-foreground">
                  {spec.editorialConstraints.slice(0, 4).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {getSlotAccountIds(slot).some(
                  (id) =>
                    getPlanningAccount(id, studioAccounts)?.type === "official",
                ) ? (
                  <p className="text-[12px] text-muted-foreground">
                    Cuenta piloto: Mercantis oficial.
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  disabled={!canPrepare || spec.status === "ready-for-cursor"}
                  onClick={prepareForCursor}
                >
                  Preparar para Cursor
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={copySpec}>
                  <CopyIcon className="size-3.5" />
                  {copied === "spec" ? "Spec copiado" : "Copiar spec"}
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={copyPrompt}>
                  <CopyIcon className="size-3.5" />
                  {copied === "prompt" ? "Pedido copiado" : "Copiar pedido a Cursor"}
                </Button>
              </div>
            </StudioSection>

            <StudioSection
              title="Desarrollo creativo"
              description="Recién acá Cursor escribe copy, headline y prompts. Primero se elige la idea."
            >
              {candidates.length === 0 ? (
                <p className="text-[13px] text-muted-foreground">
                  Cuando haya una dirección elegida, pedile a Cursor: “Desarrollá
                  esta dirección creativa.”
                </p>
              ) : (
                <div className="space-y-2">
                  {candidates.map((proposal, index) => {
                    const isSelected = proposal.status === "selected";
                    return (
                      <div
                        key={proposal.id}
                        className={cn(
                          "rounded-lg border px-3 py-3",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border",
                        )}
                      >
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          Propuesta {String.fromCharCode(65 + index)}
                          {proposal.angleId
                            ? ` · ${getAngleLabel(proposal.angleId)}`
                            : ""}
                          {" · "}
                          {PROPOSAL_STATUS_LABELS[proposal.status]}
                        </p>
                        <p className="mt-1.5 text-[14px] font-medium leading-snug">
                          {proposal.hook}
                        </p>
                        <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                          {proposal.concept}
                        </p>
                        {isSelected ? (
                          <p className="mt-2 text-[12px] font-medium">
                            Seleccionada
                          </p>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            className="mt-2 h-7 text-xs"
                            onClick={() => selectProposal(proposal.id)}
                          >
                            Seleccionar
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {selected ? (
                <p className="text-[12px] text-muted-foreground">
                  Listo para ensamblar en Figma con el copy de Cursor.
                </p>
              ) : null}
            </StudioSection>
          </div>
        )
      ) : null}
    </StudioSheet>
  );
}
