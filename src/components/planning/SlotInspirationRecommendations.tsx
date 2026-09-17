import { useEffect, useMemo, useState } from "react";

import { InspirationThumb } from "@/components/inspiration/InspirationDetailBody";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { CreativeProposal } from "@/content/creative-proposals";
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
  associated,
  onOpen,
  onAssociate,
}: {
  ranked: RankedInspiration;
  associated: boolean;
  onOpen: () => void;
  onAssociate: () => void;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-border px-2.5 py-2.5">
      <button type="button" className="shrink-0" onClick={onOpen}>
        <InspirationThumb item={ranked.item} />
      </button>
      <div className="min-w-0 flex-1 space-y-1.5">
        <button type="button" className="min-w-0 text-left" onClick={onOpen}>
          <p className="line-clamp-2 text-[13px] font-medium leading-snug">
            {ranked.item.title}
          </p>
        </button>
        {ranked.badges?.length ? (
          <div className="flex flex-wrap gap-1">
            {ranked.badges.map((badge) => (
              <Badge key={badge} variant="secondary" className="font-normal">
                {badge}
              </Badge>
            ))}
          </div>
        ) : null}
        {ranked.reasons.slice(0, 2).map((reason) => (
          <p key={reason} className="text-[11px] text-muted-foreground">
            {reason}
          </p>
        ))}
        <p className="text-[11px] text-muted-foreground">
          {formatInspirationUsage(ranked.usage)}
        </p>
        <Button
          type="button"
          size="sm"
          variant={associated ? "default" : "outline"}
          className="h-6 px-2 text-[11px]"
          onClick={onAssociate}
        >
          {associated ? "Referencia asociada" : "Asociar a esta idea"}
        </Button>
      </div>
    </div>
  );
}

function associatedKeys(proposal?: CreativeProposal) {
  return new Set(proposal?.inspirationRefs ?? []);
}

function uniqueRanked(rows: RankedInspiration[]) {
  const seen = new Set<string>();
  const result: RankedInspiration[] = [];
  for (const row of rows) {
    if (seen.has(row.item.key)) continue;
    seen.add(row.item.key);
    result.push(row);
  }
  return result;
}

export function SlotInspirationRecommendations({
  slot,
  record,
  proposal,
  proposals,
  specs,
  slots,
  overrides,
  onOpenReference,
  onAssociate,
}: {
  slot: PlanningSlot;
  record?: SlotSpecRecord;
  proposal?: CreativeProposal;
  proposals: Proposal[];
  specs: SlotSpecRecord[];
  slots: PlanningSlot[];
  overrides: Record<string, InspirationMetaOverride>;
  onOpenReference: (key: string) => void;
  onAssociate: (key: string, attached: boolean) => void;
}) {
  const [ranked, setRanked] = useState<RankedInspiration[]>([]);
  const [degradedReason, setDegradedReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const structureQuery = useMemo(
    () => buildStructureQuery(slot, record, proposal),
    [
      slot.productionTypeId,
      slot.publicationTypeId,
      slot.cameraPresence,
      record?.structuralSearchBrief,
      record?.inspirationSearchBrief,
      proposal?.id,
      proposal?.idea,
      proposal?.visualConcept,
    ],
  );
  const visualQuery = useMemo(
    () => buildVisualQuery(slot, record, proposal),
    [
      slot.productionTypeId,
      slot.publicationTypeId,
      slot.cameraPresence,
      record?.visualSearchBrief,
      record?.inspirationSearchBrief,
      proposal?.id,
      proposal?.visualConcept,
    ],
  );

  const usageStamp = `${proposals.length}:${specs.length}:${slots.length}`;
  const associated = associatedKeys(proposal);

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
        setRanked([]);
        setLoading(false);
        return;
      }
      if (!status.configured) {
        setDegradedReason(
          "Sin GOOGLE_GENERATIVE_AI_API_KEY. Mostramos la biblioteca completa.",
        );
        setRanked([]);
        setLoading(false);
        return;
      }
      if (status.analyzed === 0) {
        setDegradedReason(
          "Todavía no hay análisis locales. Corré npm run inspiration:analyze -- --all.",
        );
        setRanked([]);
        setLoading(false);
        return;
      }

      const ctx = {
        slot,
        proposals,
        specs,
        slots,
        overrides,
        creativeProposal: proposal,
        limit: INSPIRATION_HYBRID_WEIGHTS.displayLimit,
      };
      const [structureMatch, visualMatch] = await Promise.all([
        fetchInspirationMatches({
          mode: "structure",
          query: structureQuery,
          roleId: slot.roleId,
          pillarId: slot.topicId ?? slot.pillarId,
          cameraPresence: slot.cameraPresence,
          signal: controller.signal,
        }),
        fetchInspirationMatches({
          mode: "visual",
          query: visualQuery,
          cameraPresence: slot.cameraPresence,
          signal: controller.signal,
        }),
      ]);
      if (cancelled) return;

      const merged = uniqueRanked([
        ...rankHybridCandidates(ctx, visualMatch.candidates, "visual"),
        ...rankHybridCandidates(ctx, structureMatch.candidates, "structure"),
      ]).sort(
        (a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title),
      );
      setRanked(merged);
      setDegradedReason(
        merged.length === 0
          ? "No encontramos referencias compatibles con esta producción. Usá la biblioteca completa."
          : null,
      );
      setLoading(false);
    }

    load().catch(() => {
      if (cancelled) return;
      setDegradedReason("No se pudo consultar el matching local. Usá la biblioteca.");
      setRanked([]);
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
    slot.productionTypeId,
    proposal?.id,
    usageStamp,
  ]);

  return (
    <div className="space-y-3">
      {loading ? (
        <div className="space-y-2" aria-live="polite">
          <p className="text-[12px] text-muted-foreground">
            Buscando referencias…
          </p>
          <Skeleton className="h-[4.5rem] w-full" />
          <Skeleton className="h-[4.5rem] w-full" />
          <Skeleton className="h-[4.5rem] w-full" />
        </div>
      ) : null}
      {degradedReason ? (
        <p className="text-[12px] text-muted-foreground">{degradedReason}</p>
      ) : null}
      {ranked.map((row) => (
        <RecommendationRow
          key={row.item.key}
          ranked={row}
          associated={associated.has(row.item.key)}
          onOpen={() => onOpenReference(row.item.key)}
          onAssociate={() =>
            onAssociate(row.item.key, !associated.has(row.item.key))
          }
        />
      ))}
    </div>
  );
}
