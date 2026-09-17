import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeftIcon,
  CheckIcon,
  CopyIcon,
  DotsThreeIcon,
} from "@phosphor-icons/react";

import { InspirationDetailBody } from "@/components/inspiration/InspirationDetailBody";
import { SlotBriefCards } from "@/components/planning/SlotBriefCards";
import { SlotCreativeProposalCard } from "@/components/planning/SlotCreativeProposalCard";
import { SlotCreativeProposals } from "@/components/planning/SlotCreativeProposals";
import { SlotInspirationBrowse } from "@/components/planning/SlotInspirationBrowse";
import { SlotInspirationRecommendations } from "@/components/planning/SlotInspirationRecommendations";
import {
  SlotWorkflowStepper,
  type SlotWorkflowStepId,
  type SlotWorkflowStepState,
} from "@/components/planning/SlotWorkflowStepper";
import { StudioSheet } from "@/components/studio/StudioSheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSlotTopicLabel } from "@/content/role-topics";
import { getInspirationByKey } from "@/content/inspiration-feed";
import { getSlotAccountLabel } from "@/content/planning-accounts";
import type { PlanningSlot } from "@/content/planned-slots";
import type { PlanningStudioAccount } from "@/content/planning-studio-accounts";
import type { CreativeProposal } from "@/content/creative-proposals";
import { useInspirationOverrides } from "@/hooks/use-inspiration-overrides";
import { useProposals } from "@/hooks/use-proposals";
import { useSlotSpecs } from "@/hooks/use-slot-specs";
import { copyText } from "@/lib/clipboard";
import { selectedCreativeProposal } from "@/lib/creative-proposals";
import { usageForInspiration } from "@/lib/inspiration-usage";
import {
  applyGeneratedCreativeProposals,
  applyInspirationConfirmation,
  applyProposalInspirationRef,
  applySelectedCreativeProposal,
  assembleSlotSpec,
  cursorPromptForSpec,
  formatSlotSpecMarkdown,
} from "@/lib/slot-spec";

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
  const { proposals } = useProposals();
  const { records, getRecord, upsertRecord } = useSlotSpecs();
  const { overrides } = useInspirationOverrides();
  const [pane, setPane] = useState<"slot" | "inspiration">("slot");
  const [inspectingKey, setInspectingKey] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [copied, setCopied] = useState<"spec" | "prompt" | null>(null);
  const [editingIdea, setEditingIdea] = useState(false);
  const [editingInspiration, setEditingInspiration] = useState(false);
  const [ideaDetailOpen, setIdeaDetailOpen] = useState(false);
  const [inspirationPreviewOpen, setInspirationPreviewOpen] = useState(false);

  useEffect(() => {
    setPane("slot");
    setInspectingKey(null);
    setShowLibrary(false);
    setCopied(null);
    setEditingIdea(false);
    setEditingInspiration(false);
    setIdeaDetailOpen(false);
    setInspirationPreviewOpen(false);
  }, [slot?.id]);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(null), 2500);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const record = slot ? getRecord(slot.id) : undefined;
  const specRecords = useMemo(() => Object.values(records), [records]);
  const idea = selectedCreativeProposal(
    record?.creativeProposals,
    record?.selectedCreativeProposalId,
  );
  const hasIdea = Boolean(idea);
  const inspirationDone = Boolean(record?.inspirationConfirmed);
  const associatedKeys = idea?.inspirationRefs ?? [];
  const refCount = associatedKeys.length;
  const spec = slot
    ? assembleSlotSpec(slot, record, proposals, specRecords, slots, overrides)
    : undefined;
  const inspecting = inspectingKey
    ? getInspirationByKey(inspectingKey, overrides)
    : undefined;

  const ideaOpen = !hasIdea || editingIdea;
  const inspirationOpen =
    hasIdea && !ideaOpen && (!inspirationDone || editingInspiration);
  const productionOpen =
    hasIdea && inspirationDone && !ideaOpen && !inspirationOpen;

  const stepperStates: Record<SlotWorkflowStepId, SlotWorkflowStepState> = {
    idea: ideaOpen ? "active" : hasIdea ? "complete" : "pending",
    inspiration: inspirationOpen
      ? "active"
      : inspirationDone
        ? "complete"
        : hasIdea
          ? "pending"
          : "pending",
    production: productionOpen
      ? "active"
      : inspirationDone && !ideaOpen && !inspirationOpen
        ? "complete"
        : "pending",
  };

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

  function selectIdea(proposalId: string) {
    if (!slot) return;
    upsertRecord(applySelectedCreativeProposal(record, slot.id, proposalId));
    setEditingIdea(false);
    setIdeaDetailOpen(false);
    setEditingInspiration(false);
    setInspirationPreviewOpen(false);
    setShowLibrary(false);
  }

  function confirmInspiration() {
    if (!slot) return;
    upsertRecord(applyInspirationConfirmation(record, slot.id, true));
    setEditingInspiration(false);
    setInspirationPreviewOpen(false);
  }

  function openStep(id: SlotWorkflowStepId) {
    if (id === "idea") {
      setEditingIdea(true);
      setEditingInspiration(false);
      setIdeaDetailOpen(false);
      return;
    }
    if (id === "inspiration" && hasIdea) {
      setEditingIdea(false);
      setEditingInspiration(true);
      setInspirationPreviewOpen(false);
      return;
    }
    if (id === "production" && inspirationDone) {
      setEditingIdea(false);
      setEditingInspiration(false);
    }
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
                  !associatedKeys.includes(inspecting.key),
                )
              }
            />
          </div>
        ) : (
          <div className="space-y-6">
            <SlotBriefCards slot={slot} studioAccounts={studioAccounts} />
            <SlotWorkflowStepper
              states={stepperStates}
              enabled={{
                idea: true,
                inspiration: hasIdea,
                production: inspirationDone,
              }}
              onSelect={openStep}
            />

            {ideaOpen ? (
              <StepFrame
                index={1}
                title="Idea"
                description="Gemini explora qué se puede hacer con este slot. Elegí una dirección."
              >
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
                  onSelect={selectIdea}
                />
              </StepFrame>
            ) : idea ? (
              <CompactIdeaStep
                idea={idea}
                detailOpen={ideaDetailOpen}
                onToggleDetail={() => setIdeaDetailOpen((value) => !value)}
                onChange={() => {
                  setEditingIdea(true);
                  setIdeaDetailOpen(false);
                }}
              />
            ) : null}

            {inspirationOpen && idea ? (
              <StepFrame
                index={2}
                title="Inspiración"
                description="Elegí referencias visuales o estructurales para desarrollar esta idea."
              >
                <div className="space-y-3">
                  <p className="text-[12px] font-medium">Referencias sugeridas</p>
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
                      ? "Ocultar biblioteca"
                      : "Explorar biblioteca"}
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
                  {refCount > 0 ? (
                    <AssociatedRefsList
                      keys={associatedKeys}
                      overrides={overrides}
                    />
                  ) : null}
                  <div className="pt-1">
                    <Button type="button" size="sm" onClick={confirmInspiration}>
                      {refCount > 0
                        ? "Continuar con estas referencias"
                        : "Continuar sin inspiración"}
                    </Button>
                  </div>
                </div>
              </StepFrame>
            ) : hasIdea && inspirationDone && !ideaOpen ? (
              <CompactInspirationStep
                refCount={refCount}
                keys={associatedKeys}
                overrides={overrides}
                previewOpen={inspirationPreviewOpen}
                onTogglePreview={() =>
                  setInspirationPreviewOpen((value) => !value)
                }
                onChange={() => {
                  setEditingInspiration(true);
                  setInspirationPreviewOpen(false);
                }}
              />
            ) : null}

            {productionOpen && idea ? (
              <StepFrame index={3} title="Producción">
                <div className="space-y-3 rounded-lg border border-border px-3 py-3">
                  <p className="flex items-center gap-1.5 text-[13px] font-medium">
                    <CheckIcon className="size-3.5" weight="bold" />
                    Spec listo para producir
                  </p>
                  <div className="space-y-1 text-[13px] leading-relaxed">
                    <p>
                      <span className="text-muted-foreground">Idea: </span>
                      {idea.title}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Inspiración: </span>
                      {refCount > 0
                        ? `${refCount} referencia${refCount === 1 ? "" : "s"}`
                        : "Sin referencias"}
                    </p>
                  </div>
                  <p className="text-[12px] leading-relaxed text-muted-foreground">
                    Copia al portapapeles el prompt completo con la idea,
                    estructura, referencias y contexto necesario para producir
                    esta pieza en Cursor.
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Button type="button" size="sm" onClick={copyPrompt}>
                      <CopyIcon className="size-3.5" />
                      {copied === "prompt"
                        ? "Pedido copiado ✓"
                        : "Copiar pedido para Cursor"}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Más acciones"
                        >
                          <DotsThreeIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={copySpec}>
                          {copied === "spec" ? "Spec copiado" : "Copiar spec"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </StepFrame>
            ) : null}
          </div>
        )
      ) : null}
    </StudioSheet>
  );
}

function StepFrame({
  index,
  title,
  description,
  children,
}: {
  index: number;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <p className="text-[13px] font-medium">
          {index}. {title}
        </p>
        {description ? (
          <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function CompactIdeaStep({
  idea,
  detailOpen,
  onToggleDetail,
  onChange,
}: {
  idea: CreativeProposal;
  detailOpen: boolean;
  onToggleDetail: () => void;
  onChange: () => void;
}) {
  return (
    <section className="space-y-2">
      <p className="text-[13px] font-medium">✓ 1. Idea</p>
      <div className="rounded-lg border border-border px-3 py-3">
        <p className="text-[14px] font-medium leading-snug">{idea.title}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
          {idea.idea}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onToggleDetail}
          >
            {detailOpen ? "Ocultar detalle" : "Ver detalle"}
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={onChange}>
            Cambiar idea
          </Button>
        </div>
      </div>
      {detailOpen ? (
        <SlotCreativeProposalCard
          proposal={idea}
          selected
          showActions={false}
        />
      ) : null}
    </section>
  );
}

function CompactInspirationStep({
  refCount,
  keys,
  overrides,
  previewOpen,
  onTogglePreview,
  onChange,
}: {
  refCount: number;
  keys: string[];
  overrides: Parameters<typeof getInspirationByKey>[1];
  previewOpen: boolean;
  onTogglePreview: () => void;
  onChange: () => void;
}) {
  return (
    <section className="space-y-2">
      <p className="text-[13px] font-medium">✓ 2. Inspiración</p>
      <div className="rounded-lg border border-border px-3 py-3">
        <p className="text-[13px] leading-relaxed">
          {refCount > 0
            ? `${refCount} referencia${refCount === 1 ? "" : "s"} seleccionada${refCount === 1 ? "" : "s"}`
            : "Sin referencias"}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {refCount > 0 ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onTogglePreview}
            >
              {previewOpen ? "Ocultar" : "Ver"}
            </Button>
          ) : null}
          <Button type="button" size="sm" variant="ghost" onClick={onChange}>
            Cambiar
          </Button>
        </div>
      </div>
      {previewOpen && refCount > 0 ? (
        <AssociatedRefsList keys={keys} overrides={overrides} />
      ) : null}
    </section>
  );
}

function AssociatedRefsList({
  keys,
  overrides,
}: {
  keys: string[];
  overrides: Parameters<typeof getInspirationByKey>[1];
}) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Asociadas a esta idea
      </p>
      {keys.map((key) => (
        <p key={key} className="text-[13px]">
          {getInspirationByKey(key, overrides)?.title ?? key}
        </p>
      ))}
    </div>
  );
}
