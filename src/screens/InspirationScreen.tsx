import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TagIcon } from "@phosphor-icons/react";

import { Playground } from "@/components/AppShell";
import { ColumnSelector } from "@/components/ColumnSelector";
import { InspirationBrowseFilters } from "@/components/ideas/InspirationBrowseFilters";
import { InspirationPanel } from "@/components/ideas/InspirationPanel";
import { InspirationClassificationSheet } from "@/components/inspiration/InspirationClassificationSheet";
import { InspirationDetailSheet } from "@/components/inspiration/InspirationDetailSheet";
import { PlanningToolbarButton } from "@/components/planning/PlanningToolbarButton";
import { buildInspirationFeed, getInspirationByKey } from "@/content/inspiration-feed";
import { useInspirationOverrides } from "@/hooks/use-inspiration-overrides";
import { countUnclassifiedInspirations } from "@/lib/inspiration-classification";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { usePlanningConfig } from "@/hooks/use-planning-config";
import { useSheetSearchParam } from "@/hooks/use-sheet-search-param";
import { useSlotSpecs } from "@/hooks/use-slot-specs";
import {
  STUDIO_PREFERENCE_DEFAULTS,
  STUDIO_PREFERENCE_KEYS,
  parseGridColumns,
  parseInspirationMediaType,
  parseInspirationPlatform,
} from "@/lib/studio-preferences";

export function InspirationScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const slotPickId = searchParams.get("slot");
  const { allCalendarSlots: horizonSlotsFromGenerations } = usePlanningConfig();
  const { getRecord, upsertRecord } = useSlotSpecs();
  const { overrides } = useInspirationOverrides();
  const [classifyOpen, setClassifyOpen] = useState(false);
  const [referenceKey, setReferenceKey] = useSheetSearchParam("reference");
  const allFeedItems = useMemo(() => buildInspirationFeed(), []);
  const unclassifiedCount = useMemo(
    () => countUnclassifiedInspirations(allFeedItems, overrides),
    [allFeedItems, overrides],
  );
  const [platformFilter, setPlatformFilter] = usePersistedState(
    STUDIO_PREFERENCE_KEYS.inspirationPlatform,
    STUDIO_PREFERENCE_DEFAULTS.inspirationPlatform,
    parseInspirationPlatform,
  );
  const [mediaTypeFilter, setMediaTypeFilter] = usePersistedState(
    STUDIO_PREFERENCE_KEYS.inspirationMediaType,
    STUDIO_PREFERENCE_DEFAULTS.inspirationMediaType,
    parseInspirationMediaType,
  );
  const [columns, setColumns] = usePersistedState(
    STUDIO_PREFERENCE_KEYS.gridColumns,
    STUDIO_PREFERENCE_DEFAULTS.gridColumns,
    parseGridColumns,
  );
  const slots = horizonSlotsFromGenerations;

  function pickReferenceForSlot(key: string) {
    if (!slotPickId) return;
    const item = getInspirationByKey(key, overrides);
    const record = getRecord(slotPickId);
    upsertRecord({
      slotId: slotPickId,
      directionKind: "inspiration",
      inspirationRef: key,
      signal: item?.signal,
      creativeMechanism: item?.creativeMechanism,
      editorialDescription: record?.editorialDescription,
      inspirationSearchBrief: record?.inspirationSearchBrief,
      status: record?.status ?? "draft",
    });
    navigate(`/planificacion?slot=${encodeURIComponent(slotPickId)}`);
  }

  return (
    <Playground
      title="Referencias"
      meta={slotPickId ? "Elegí inspiración para el slot" : undefined}
      fullWidth
      actions={
        <div className="flex items-center gap-2">
          {unclassifiedCount > 0 ? (
            <PlanningToolbarButton onClick={() => setClassifyOpen(true)}>
              <TagIcon />
              Clasificar con Cursor ({unclassifiedCount})
            </PlanningToolbarButton>
          ) : null}
          <ColumnSelector value={columns} onChange={setColumns} />
          <InspirationBrowseFilters
            platform={platformFilter}
            mediaType={mediaTypeFilter}
            onPlatformChange={setPlatformFilter}
            onMediaTypeChange={setMediaTypeFilter}
          />
        </div>
      }
    >
      {slotPickId ? (
        <div className="border-b border-border bg-muted/30 px-5 py-3 text-[13px] leading-relaxed text-muted-foreground">
          Estás eligiendo inspiración para un slot de planificación. Abrí una
          referencia y tocá <span className="font-medium text-foreground">Usar esta</span>.
        </div>
      ) : null}
      <InspirationPanel
        platformFilter={platformFilter}
        mediaTypeFilter={mediaTypeFilter}
        columns={columns}
        overrides={overrides}
        onOpenReference={setReferenceKey}
      />
      <InspirationClassificationSheet
        open={classifyOpen}
        onOpenChange={setClassifyOpen}
        items={allFeedItems}
        overrides={overrides}
      />
      <InspirationDetailSheet
        referenceKey={referenceKey}
        slots={slots}
        open={Boolean(referenceKey)}
        onOpenChange={(open) => {
          if (!open) setReferenceKey(null);
        }}
        slotPickId={slotPickId}
        onPickForSlot={slotPickId ? pickReferenceForSlot : undefined}
      />
    </Playground>
  );
}
