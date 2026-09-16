import { useEffect, useMemo, useState } from "react";
import { ArrowLeftIcon, CopyIcon } from "@phosphor-icons/react";

import { InspirationDetailBody } from "@/components/inspiration/InspirationDetailBody";
import { SlotBriefCards } from "@/components/planning/SlotBriefCards";
import { SlotEditorialDescription } from "@/components/planning/SlotEditorialDescription";
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
import { signalPresetsForTopic } from "@/content/slot-signals";
import { SLOT_WORKFLOW_STATUS_LABELS } from "@/content/slot-workflow";
import type { InspirationUseRole } from "@/content/inspiration-analysis";
import { useInspirationOverrides } from "@/hooks/use-inspiration-overrides";
import { useProposals } from "@/hooks/use-proposals";
import { useSlotSpecs } from "@/hooks/use-slot-specs";
import { copyText } from "@/lib/clipboard";
import { usageForInspiration } from "@/lib/inspiration-usage";
import {
  proposalsForSlot,
  selectedProposalForSlot,
} from "@/lib/proposals-store";
import {
  applyGeneratedSlotDescription,
  applyInspirationSelection,
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
  const [showManual, setShowManual] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [copied, setCopied] = useState<"spec" | "prompt" | null>(null);

  useEffect(() => {
    setPane("slot");
    setInspectingKey(null);
    setShowManual(false);
    setShowLibrary(false);
    setCopied(null);
  }, [slot?.id]);

  const record = slot ? getRecord(slot.id) : undefined;
  const specRecords = useMemo(() => Object.values(records), [records]);

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
  const selectedStructural = record?.structuralInspirationRef
    ? getInspirationByKey(record.structuralInspirationRef, overrides)
    : !record?.visualInspirationRef && record?.inspirationRef
      ? getInspirationByKey(record.inspirationRef, overrides)
      : undefined;
  const selectedVisual = record?.visualInspirationRef
    ? getInspirationByKey(record.visualInspirationRef, overrides)
    : !record?.structuralInspirationRef && record?.inspirationRef
      ? getInspirationByKey(record.inspirationRef, overrides)
      : undefined;
  const selectedInspiration = selectedStructural || selectedVisual;
  const inspecting = inspectingKey
    ? getInspirationByKey(inspectingKey, overrides)
    : undefined;

  function useInspiration(key: string, role: InspirationUseRole = "both") {
    if (!slot) return;
    const item = getInspirationByKey(key, overrides);
    upsertRecord(applyInspirationSelection(record, slot.id, key, role, item));
    setPane("slot");
    setInspectingKey(null);
    setShowManual(false);
  }

  function useManualSignal(signal: string) {
    if (!slot) return;
    upsertRecord({
      slotId: slot.id,
      directionKind: "manual",
      signal,
      editorialDescription: record?.editorialDescription,
      inspirationSearchBrief: record?.inspirationSearchBrief,
      structuralSearchBrief: record?.structuralSearchBrief,
      visualSearchBrief: record?.visualSearchBrief,
      status: record?.status ?? "draft",
    });
    setShowManual(false);
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
              onUseRole={(role) => useInspiration(inspecting.key, role)}
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

            <SlotEditorialDescription
              spec={spec}
              accountLabel={getSlotAccountLabel(slot, studioAccounts)}
              editorialDescription={record?.editorialDescription}
              inspirationSearchBrief={record?.inspirationSearchBrief}
              structuralSearchBrief={record?.structuralSearchBrief}
              visualSearchBrief={record?.visualSearchBrief}
              onGenerated={(payload) => {
                upsertRecord(
                  applyGeneratedSlotDescription(record, slot.id, payload),
                );
              }}
            />

            <StudioSection
              title="Inspiración"
              description="Recomendaciones automáticas según estructura y visual. La biblioteca completa sigue disponible."
            >
              <SlotInspirationRecommendations
                slot={slot}
                record={record}
                proposals={proposals}
                specs={specRecords}
                slots={slots}
                overrides={overrides}
                onOpenReference={(key) => {
                  setInspectingKey(key);
                  setPane("inspiration");
                }}
                onSelect={(key, role) => useInspiration(key, role)}
              />
              <div className="pt-3">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 px-0 text-xs"
                  onClick={() => setShowLibrary((value) => !value)}
                >
                  {showLibrary ? "Ocultar biblioteca completa" : "Explorar biblioteca completa"}
                </Button>
                {showLibrary ? (
                  <div className="mt-3">
                    <SlotInspirationBrowse
                      slotId={slot.id}
                      onOpenReference={(key) => {
                        setInspectingKey(key);
                        setPane("inspiration");
                      }}
                    />
                  </div>
                ) : null}
              </div>
              <div className="pt-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 px-0 text-xs"
                  onClick={() => setShowManual((value) => !value)}
                >
                  {showManual ? "Ocultar dirección personalizada" : "Dirección personalizada"}
                </Button>
                {showManual ? (
                  <div className="mt-2 space-y-2 rounded-lg border border-dashed border-border px-3 py-3">
                    <p className="text-[12px] text-muted-foreground">
                      Escape hatch. El camino principal es elegir una referencia.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {signalPresetsForTopic(slot).map((preset) => (
                        <Button
                          key={preset.id}
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => useManualSignal(preset.signal)}
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </StudioSection>

            <StudioSection title="Dirección seleccionada">
              {selectedInspiration || record?.directionKind === "manual" ? (
                <div className="space-y-2">
                  {record?.directionKind === "manual" ? (
                    <div className="rounded-lg border border-border px-3 py-3">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Dirección personalizada
                      </p>
                      <p className="mt-1 text-[13px] font-medium">
                        {spec.signal ?? "Sin señal todavía"}
                      </p>
                    </div>
                  ) : null}
                  {selectedStructural ? (
                    <div className="rounded-lg border border-border px-3 py-3">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Estructura
                      </p>
                      <p className="mt-1 text-[13px] font-medium">
                        {selectedStructural.title}
                      </p>
                      {spec.structuralInspiration?.creativeMechanism || spec.creativeMechanism ? (
                        <p className="mt-1 text-[12px] text-muted-foreground">
                          Mecanismo:{" "}
                          {spec.structuralInspiration?.creativeMechanism ?? spec.creativeMechanism}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                  {selectedVisual && selectedVisual.key !== selectedStructural?.key ? (
                    <div className="rounded-lg border border-border px-3 py-3">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Visual
                      </p>
                      <p className="mt-1 text-[13px] font-medium">{selectedVisual.title}</p>
                    </div>
                  ) : selectedVisual && selectedVisual.key === selectedStructural?.key ? (
                    <p className="text-[12px] text-muted-foreground">
                      La misma referencia cubre estructura y visual.
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="text-[13px] text-muted-foreground">
                  Todavía no elegiste una referencia para este slot.
                </p>
              )}
            </StudioSection>

            <StudioSection
              title="Slot spec"
              description="Misión para Cursor. El Studio no genera copy."
            >
              <div className="space-y-2 rounded-lg border border-border px-3 py-3 text-[13px] leading-relaxed">
                <p>
                  {getSlotAccountLabel(slot, studioAccounts)} · {spec.date} {spec.time}
                </p>
                <p>
                  {getContentRoleLabel(spec.roleId)} · {getSlotTopicLabel(slot)} ·{" "}
                  {getPublicationTypeLabel(spec.publicationTypeId)}
                </p>
                {spec.recommendedCreativeFormats.length > 0 ? (
                  <p className="text-muted-foreground">
                    Formatos creativos:{" "}
                    {spec.recommendedCreativeFormats
                      .map((format) => format.label)
                      .join(" · ")}
                  </p>
                ) : null}
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
              description="Cursor escribe las propuestas. Acá solo se elige."
            >
              {candidates.length === 0 ? (
                <p className="text-[13px] text-muted-foreground">
                  Cuando el spec esté listo, pedile a Cursor: “Desarrollá propuestas para este slot.”
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
                          <p className="mt-2 text-[12px] font-medium">Seleccionada</p>
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
