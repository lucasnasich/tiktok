import { useEffect, useMemo, useState } from "react";

import { InspirationThumb } from "@/components/inspiration/InspirationDetailBody";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { InspirationUseRole } from "@/content/inspiration-analysis";
import type { InspirationFeedItem } from "@/content/inspiration-feed";
import { INSPIRATION_HYBRID_WEIGHTS } from "@/content/inspiration-match-config";
import type { PlanningSlot } from "@/content/planned-slots";
import type { Proposal } from "@/content/proposals";
import type { SlotSpecRecord } from "@/content/slot-specs";
import type { InspirationMetaOverride } from "@/lib/inspiration-overrides-store";
import {
  rankHybridCandidates,
  type RankedInspiration,
} from "@/lib/inspiration-match";
import {
  buildStructureQuery,
  buildVisualQuery,
  fetchInspirationIntelligenceStatus,
  fetchInspirationMatches,
} from "@/lib/inspiration-intelligence";
import { formatInspirationUsage } from "@/lib/inspiration-usage";

function RecommendationRow({
  ranked,
  selected,
  onOpen,
  onSelect,
}: {
  ranked: RankedInspiration;
  selected?: "structure" | "visual" | "both";
  onOpen: () => void;
  onSelect: (role: InspirationUseRole) => void;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-border px-2.5 py-2.5">
      <button type="button" className="shrink-0" onClick={onOpen}>
        <InspirationThumb item={ranked.item} />
      </button>
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <button
            type="button"
            className="min-w-0 text-left"
            onClick={onOpen}
          >
            <p className="line-clamp-2 text-[13px] font-medium leading-snug">
              {ranked.item.title}
            </p>
          </button>
          <Badge variant="secondary" className="shrink-0">
            {ranked.confidence !== undefined && ranked.confidence < 0.45 ? "~" : ""}
            {ranked.compatibility}%
          </Badge>
        </div>
        {ranked.reasons.slice(0, 2).map((reason) => (
          <p key={reason} className="text-[11px] text-muted-foreground">
            {reason}
          </p>
        ))}
        <p className="text-[11px] text-muted-foreground">
          {formatInspirationUsage(ranked.usage)}
        </p>
        <div className="flex flex-wrap gap-1">
          <Button
            type="button"
            size="sm"
            variant={selected === "structure" || selected === "both" ? "default" : "outline"}
            className="h-6 px-2 text-[11px]"
            onClick={() => onSelect("structure")}
          >
            Usar estructura
          </Button>
          <Button
            type="button"
            size="sm"
            variant={selected === "visual" || selected === "both" ? "default" : "outline"}
            className="h-6 px-2 text-[11px]"
            onClick={() => onSelect("visual")}
          >
            Usar visual
          </Button>
          <Button
            type="button"
            size="sm"
            variant={selected === "both" ? "default" : "ghost"}
            className="h-6 px-2 text-[11px]"
            onClick={() => onSelect("both")}
          >
            Usar en ambas
          </Button>
        </div>
      </div>
    </div>
  );
}

function selectedRoleFor(
  item: InspirationFeedItem,
  record?: SlotSpecRecord,
): "structure" | "visual" | "both" | undefined {
  const structural =
    record?.structuralInspirationRef === item.key ||
    (!record?.structuralInspirationRef && record?.inspirationRef === item.key);
  const visual =
    record?.visualInspirationRef === item.key ||
    (!record?.visualInspirationRef && record?.inspirationRef === item.key);
  if (structural && visual) return "both";
  if (structural) return "structure";
  if (visual) return "visual";
  return undefined;
}

export function SlotInspirationRecommendations({
  slot,
  record,
  proposals,
  specs,
  slots,
  overrides,
  onOpenReference,
  onSelect,
}: {
  slot: PlanningSlot;
  record?: SlotSpecRecord;
  proposals: Proposal[];
  specs: SlotSpecRecord[];
  slots: PlanningSlot[];
  overrides: Record<string, InspirationMetaOverride>;
  onOpenReference: (key: string) => void;
  onSelect: (key: string, role: InspirationUseRole) => void;
}) {
  const [structure, setStructure] = useState<RankedInspiration[]>([]);
  const [visual, setVisual] = useState<RankedInspiration[]>([]);
  const [degradedReason, setDegradedReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const structureQuery = useMemo(
    () => buildStructureQuery(slot, record),
    [
      slot.formatId,
      slot.roleId,
      slot.pillarId,
      slot.cameraPresence,
      record?.structuralSearchBrief,
      record?.inspirationSearchBrief,
      record?.editorialDescription,
    ],
  );
  const visualQuery = useMemo(
    () => buildVisualQuery(slot, record),
    [
      slot.formatId,
      slot.cameraPresence,
      record?.visualSearchBrief,
      record?.inspirationSearchBrief,
    ],
  );

  const usageStamp = `${proposals.length}:${specs.length}:${slots.length}`;

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function load() {
      setLoading(true);
      const status = await fetchInspirationIntelligenceStatus();
      if (cancelled) return;
      if (!status) {
        setDegradedReason(
          "No se pudo consultar el matching local. Usá la biblioteca completa.",
        );
        setStructure([]);
        setVisual([]);
        setLoading(false);
        return;
      }
      if (!status.configured) {
        setDegradedReason(
          "Sin GOOGLE_GENERATIVE_AI_API_KEY. Mostramos la biblioteca completa.",
        );
        setStructure([]);
        setVisual([]);
        setLoading(false);
        return;
      }
      if (status.analyzed === 0) {
        setDegradedReason(
          "Todavía no hay análisis locales. Corré npm run inspiration:analyze -- --all.",
        );
        setStructure([]);
        setVisual([]);
        setLoading(false);
        return;
      }

      const ctx = {
        slot,
        proposals,
        specs,
        slots,
        overrides,
        limit: INSPIRATION_HYBRID_WEIGHTS.displayLimit,
      };
      const [structureMatch, visualMatch] = await Promise.all([
        fetchInspirationMatches({
          mode: "structure",
          query: structureQuery,
          formatId: slot.formatId,
          roleId: slot.roleId,
          pillarId: slot.pillarId,
          cameraPresence: slot.cameraPresence,
          signal: controller.signal,
        }),
        fetchInspirationMatches({
          mode: "visual",
          query: visualQuery,
          formatId: slot.formatId,
          cameraPresence: slot.cameraPresence,
          signal: controller.signal,
        }),
      ]);
      if (cancelled) return;

      const structureRanked = rankHybridCandidates(
        ctx,
        structureMatch.candidates,
        "structure",
      );
      const visualRanked = rankHybridCandidates(ctx, visualMatch.candidates, "visual");
      setStructure(structureRanked);
      setVisual(visualRanked);
      setDegradedReason(
        structureRanked.length === 0 && visualRanked.length === 0
          ? "No encontramos matches semánticos. Usá la biblioteca completa."
          : null,
      );
      setLoading(false);
    }

    load().catch(() => {
      if (cancelled) return;
      setDegradedReason("No se pudo consultar el matching local. Usá la biblioteca.");
      setStructure([]);
      setVisual([]);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [
    structureQuery,
    visualQuery,
    slot.id,
    slot.formatId,
    slot.roleId,
    slot.pillarId,
    slot.cameraPresence,
    usageStamp,
  ]);

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-[12px] text-muted-foreground">Buscando referencias…</p>
      ) : null}
      {degradedReason ? (
        <p className="text-[12px] text-muted-foreground">{degradedReason}</p>
      ) : null}

      {structure.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Estructura recomendada
          </p>
          {structure.map((ranked) => (
            <RecommendationRow
              key={`structure-${ranked.item.key}`}
              ranked={ranked}
              selected={selectedRoleFor(ranked.item, record)}
              onOpen={() => onOpenReference(ranked.item.key)}
              onSelect={(role) => onSelect(ranked.item.key, role)}
            />
          ))}
        </div>
      ) : null}

      {visual.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Visual recomendado
          </p>
          {visual.map((ranked) => (
            <RecommendationRow
              key={`visual-${ranked.item.key}`}
              ranked={ranked}
              selected={selectedRoleFor(ranked.item, record)}
              onOpen={() => onOpenReference(ranked.item.key)}
              onSelect={(role) => onSelect(ranked.item.key, role)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
