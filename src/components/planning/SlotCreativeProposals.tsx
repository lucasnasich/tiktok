import { useEffect, useMemo, useRef, useState } from "react";
import { SparkleIcon } from "@phosphor-icons/react";

import { SlotCreativeGuidancePanel } from "@/components/planning/SlotCreativeGuidancePanel";
import { SlotCreativeProposalCard } from "@/components/planning/SlotCreativeProposalCard";
import { Button } from "@/components/ui/button";
import {
  CREATIVE_PROPOSAL_COUNT,
  type CreativeGenerationMode,
  type CreativeProposal,
  type CreativeProposalGuidance,
} from "@/content/creative-proposals";
import {
  buildInspirationFeed,
  hydrateInspirationFeed,
} from "@/content/inspiration-feed";
import type { SlotSpec, SlotSpecRecord } from "@/content/slot-specs";
import { cameraModeFromPresence } from "@/content/camera-presence";
import { listCompatibleCreativeFormats } from "@/lib/creative-format-recommendations";
import {
  latestCreativeBatch,
  materializeCreativeProposals,
  olderCreativeBatches,
} from "@/lib/creative-proposals";
import { fetchCreativeProposals } from "@/lib/inspiration-intelligence";
import { filterInspirationsByProduction } from "@/lib/inspiration-production";
import type { InspirationMetaOverride } from "@/lib/inspiration-overrides-store";

export function SlotCreativeProposals({
  spec,
  record,
  accountLabel,
  overrides,
  onGenerated,
  onSelect,
}: {
  spec: SlotSpec;
  record?: SlotSpecRecord;
  accountLabel?: string;
  overrides: Record<string, InspirationMetaOverride>;
  onGenerated: (proposals: CreativeProposal[]) => void;
  onSelect: (proposalId: string) => void;
}) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGuidance, setShowGuidance] = useState(false);
  const [showOlder, setShowOlder] = useState(false);
  const [guidance, setGuidance] = useState<CreativeProposalGuidance>({});
  const slotIdRef = useRef(spec.slotId);
  slotIdRef.current = spec.slotId;

  useEffect(() => {
    setError(null);
    setGenerating(false);
    setShowGuidance(false);
    setShowOlder(false);
    setGuidance({});
  }, [spec.slotId]);

  const proposals = record?.creativeProposals ?? [];
  const latest = latestCreativeBatch(proposals);
  const older = olderCreativeBatches(proposals);
  const hasProposals = proposals.length > 0;
  const compatibleFormats = useMemo(
    () =>
      listCompatibleCreativeFormats({
        productionTypeId: spec.productionTypeId,
        cameraMode: spec.cameraMode ?? cameraModeFromPresence(spec.cameraPresence),
      }),
    [spec.productionTypeId, spec.cameraMode, spec.cameraPresence],
  );
  const guidanceFeedKeys = useMemo(
    () =>
      filterInspirationsByProduction(
        hydrateInspirationFeed(buildInspirationFeed(), overrides),
        spec.productionTypeId,
      )
        .slice(0, 16)
        .map((item) => item.key),
    [overrides, spec.productionTypeId],
  );

  async function generate(input: {
    generationMode: CreativeGenerationMode;
    parent?: CreativeProposal;
    guidance?: CreativeProposalGuidance;
  }) {
    if (generating) return;
    const requestedId = spec.slotId;
    setGenerating(true);
    setError(null);
    try {
      const drafts = await fetchCreativeProposals({
        spec,
        accountLabel,
        generationMode: input.generationMode,
        parentProposal: input.parent,
        guidance: input.guidance,
      });
      if (requestedId !== slotIdRef.current) return;
      onGenerated(
        materializeCreativeProposals({
          slotId: spec.slotId,
          drafts,
          generationMode: input.generationMode,
          parentProposalId: input.parent?.id,
          guidance: input.guidance,
        }),
      );
      setShowGuidance(false);
    } catch (caught) {
      if (requestedId !== slotIdRef.current) return;
      const message =
        caught instanceof Error && caught.message.trim()
          ? caught.message.trim()
          : "No se pudieron generar las propuestas.";
      setError(message);
    } finally {
      if (requestedId === slotIdRef.current) setGenerating(false);
    }
  }

  return (
    <div className="space-y-3">
      {hasProposals ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={generating}
              onClick={() => generate({ generationMode: "free" })}
            >
              <SparkleIcon className="size-3.5" />
              {generating ? "Generando…" : "Generar 5 nuevas"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={generating}
              onClick={() => setShowGuidance((value) => !value)}
            >
              Orientar nuevas ideas
            </Button>
          </div>
          {showGuidance ? (
            <SlotCreativeGuidancePanel
              formats={compatibleFormats}
              feedKeys={guidanceFeedKeys}
              value={guidance}
              onChange={setGuidance}
              busy={generating}
              onCancel={() => setShowGuidance(false)}
              onGenerate={() =>
                generate({
                  generationMode: "guided",
                  guidance: {
                    creativeFormatIds: guidance.creativeFormatIds,
                    inspirationRefs: guidance.inspirationRefs,
                    instruction: guidance.instruction?.trim() || undefined,
                  },
                })
              }
            />
          ) : null}
          {error ? (
            <p className="text-[12px] text-destructive">{error}</p>
          ) : null}
          <div className="space-y-3">
            {latest.map((proposal) => (
              <SlotCreativeProposalCard
                key={proposal.id}
                proposal={proposal}
                selected={proposal.id === record?.selectedCreativeProposalId}
                busy={generating}
                onSelect={() => onSelect(proposal.id)}
                onMoreLikeThis={() =>
                  generate({
                    generationMode: "more_like_this",
                    parent: proposal,
                  })
                }
              />
            ))}
          </div>
          {older.length > 0 ? (
            <div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 px-0 text-xs"
                onClick={() => setShowOlder((value) => !value)}
              >
                {showOlder
                  ? "Ocultar generaciones anteriores"
                  : `Ver generaciones anteriores (${older.reduce((sum, batch) => sum + batch.length, 0)})`}
              </Button>
              {showOlder ? (
                <div className="mt-3 space-y-3">
                  {older.flat().map((proposal) => (
                    <SlotCreativeProposalCard
                      key={proposal.id}
                      proposal={proposal}
                      selected={
                        proposal.id === record?.selectedCreativeProposalId
                      }
                      busy={generating}
                      onSelect={() => onSelect(proposal.id)}
                      onMoreLikeThis={() =>
                        generate({
                          generationMode: "more_like_this",
                          parent: proposal,
                        })
                      }
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-8 text-center">
          <p className="text-[13px] font-medium">Todavía no hay ideas</p>
          <p className="max-w-sm text-[12px] leading-relaxed text-muted-foreground">
            Gemini va a devolver {CREATIVE_PROPOSAL_COUNT} propuestas distintas
            para este rol, tema y producción. Sin formatos creativos impuestos.
          </p>
          <Button
            type="button"
            size="sm"
            disabled={generating}
            onClick={() => generate({ generationMode: "free" })}
          >
            <SparkleIcon className="size-3.5" />
            {generating ? "Generando…" : "Generar ideas con Gemini"}
          </Button>
          {error ? (
            <p className="text-[12px] text-destructive">{error}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
