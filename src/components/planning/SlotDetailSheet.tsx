import { useEffect, useMemo, useState } from "react";
import { ArrowLeftIcon, CopyIcon } from "@phosphor-icons/react";

import { InspirationDetailBody, InspirationThumb } from "@/components/inspiration/InspirationDetailBody";
import { SlotBriefCards } from "@/components/planning/SlotBriefCards";
import { SlotEditorialDescription } from "@/components/planning/SlotEditorialDescription";
import { StudioSection, StudioSheet } from "@/components/studio/StudioSheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAngleLabel } from "@/content/angles";
import { getContentRoleLabel } from "@/content/content-roles";
import { getFormatLabel } from "@/content/formats";
import { getInspirationByKey } from "@/content/inspiration-feed";
import {
  INSPIRATION_ORIGIN_LABELS,
  INSPIRATION_TYPE_LABELS,
} from "@/content/inspiration-taxonomy";
import {
  getPlanningAccount,
  getSlotAccountLabel,
} from "@/content/planning-accounts";
import { getPlanningPillarLabel } from "@/content/planning-pillars";
import {
  getSlotAccountIds,
  type PlanningSlot,
} from "@/content/planned-slots";
import type { PlanningStudioAccount } from "@/content/planning-studio-accounts";
import { PROPOSAL_STATUS_LABELS } from "@/content/proposals";
import { SLOT_SPEC_STATUS_LABELS } from "@/content/slot-specs";
import { signalPresetsForPillar } from "@/content/slot-signals";
import { SLOT_WORKFLOW_STATUS_LABELS } from "@/content/slot-workflow";
import { useInspirationOverrides } from "@/hooks/use-inspiration-overrides";
import { useProposals } from "@/hooks/use-proposals";
import { useSlotSpecs } from "@/hooks/use-slot-specs";
import { copyText } from "@/lib/clipboard";
import {
  formatInspirationUsage,
  rankInspirationsForSlot,
} from "@/lib/inspiration-match";
import {
  proposalsForSlot,
  selectedProposalForSlot,
} from "@/lib/proposals-store";
import {
  assembleSlotSpec,
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
  const [copied, setCopied] = useState<"spec" | "prompt" | null>(null);

  useEffect(() => {
    setPane("slot");
    setInspectingKey(null);
    setShowManual(false);
    setCopied(null);
  }, [slot?.id]);

  const record = slot ? getRecord(slot.id) : undefined;
  const specRecords = useMemo(() => Object.values(records), [records]);

  const ranked = useMemo(
    () =>
      slot
        ? rankInspirationsForSlot({
            slot,
            proposals,
            specs: specRecords,
            slots,
            overrides,
          })
        : [],
    [overrides, proposals, slot, slots, specRecords],
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
  const selectedInspiration = record?.inspirationRef
    ? getInspirationByKey(record.inspirationRef, overrides)
    : undefined;
  const inspecting = inspectingKey
    ? getInspirationByKey(inspectingKey, overrides)
    : undefined;

  function useInspiration(key: string) {
    if (!slot) return;
    const item = getInspirationByKey(key, overrides);
    upsertRecord({
      slotId: slot.id,
      directionKind: "inspiration",
      inspirationRef: key,
      signal: item?.signal,
      creativeMechanism: item?.creativeMechanism,
      status: "draft",
    });
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
      status: "draft",
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

  const canPrepare =
    Boolean(record) &&
    (record?.directionKind === "inspiration"
      ? Boolean(record.inspirationRef)
      : Boolean(record?.signal?.trim()));

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
            ? getPlanningPillarLabel(slot.pillarId)
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
              usage={
                ranked.find((entry) => entry.item.key === inspecting.key)?.usage ?? {
                  count: 0,
                  proposalIds: [],
                  slotIds: [],
                  angleIds: [],
                  accountIds: [],
                }
              }
              slots={slots}
              proposals={proposals}
              onUse={() => useInspiration(inspecting.key)}
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
              editorialDescription={record?.editorialDescription}
            />

            <StudioSection
              title="Recomendadas para este slot"
              description="Compatibilidad, afinidad e historial. Usar una no la prohíbe: baja prioridad si ya se adaptó mucho."
            >
              <div className="space-y-2">
                {ranked.map((rankedItem) => {
                  const active = record?.inspirationRef === rankedItem.item.key;
                  return (
                    <div
                      key={rankedItem.item.key}
                      className={cn(
                        "flex gap-3 rounded-lg border px-2.5 py-2.5",
                        active ? "border-primary bg-primary/5" : "border-border",
                      )}
                    >
                      <InspirationThumb item={rankedItem.item} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium leading-snug">
                          {rankedItem.item.title}
                        </p>
                        <p className="mt-1 flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-[10px]">
                            {INSPIRATION_TYPE_LABELS[rankedItem.item.materialType]}
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">
                            {INSPIRATION_ORIGIN_LABELS[rankedItem.item.origin]}
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">
                            {rankedItem.compatibility}%
                          </Badge>
                        </p>
                        {rankedItem.item.signal ? (
                          <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
                            {rankedItem.item.signal}
                          </p>
                        ) : null}
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {formatInspirationUsage(rankedItem.usage)}
                          {rankedItem.reasons[0] ? ` · ${rankedItem.reasons[0]}` : ""}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <Button
                            type="button"
                            size="sm"
                            variant={active ? "default" : "outline"}
                            className="h-7 text-xs"
                            onClick={() => useInspiration(rankedItem.item.key)}
                          >
                            Usar esta
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs"
                            onClick={() => {
                              setInspectingKey(rankedItem.item.key);
                              setPane("inspiration");
                            }}
                          >
                            Ver referencia
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="pt-1">
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
                      {signalPresetsForPillar(slot.pillarId).map((preset) => (
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
                <div className="rounded-lg border border-border px-3 py-3">
                  <p className="text-[13px] font-medium">
                    {selectedInspiration?.title ?? "Dirección personalizada"}
                  </p>
                  <p className="mt-1 text-[12px] text-muted-foreground">
                    {spec.signal ?? "Sin señal todavía"}
                  </p>
                  {spec.creativeMechanism ? (
                    <p className="mt-1 text-[12px] text-muted-foreground">
                      Mecanismo: {spec.creativeMechanism}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="text-[13px] text-muted-foreground">
                  Elegí una referencia. El Studio ya armó las mejores opciones.
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
                  {getContentRoleLabel(spec.roleId)} · {getPlanningPillarLabel(spec.pillarId)} ·{" "}
                  {getFormatLabel(spec.formatId)}
                </p>
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
