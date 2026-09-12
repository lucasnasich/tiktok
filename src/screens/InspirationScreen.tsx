import { useNavigate, useSearchParams } from "react-router-dom";

import { Playground } from "@/components/AppShell";
import { ColumnSelector } from "@/components/ColumnSelector";
import { InspirationBrowseFilters } from "@/components/ideas/InspirationBrowseFilters";
import { InspirationPanel } from "@/components/ideas/InspirationPanel";
import { InspirationDetailSheet } from "@/components/inspiration/InspirationDetailSheet";
import { getInspirationByKey } from "@/content/inspiration-feed";
import type {
  InspirationMediaTypeFilterId,
  InspirationPlatformFilterId,
} from "@/content/inspiration-browse-filters";
import type { InspirationUseRole } from "@/content/inspiration-analysis";
import { useInspirationOverrides } from "@/hooks/use-inspiration-overrides";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { usePlanningConfig } from "@/hooks/use-planning-config";
import { useSheetSearchParam } from "@/hooks/use-sheet-search-param";
import { useSlotSpecs } from "@/hooks/use-slot-specs";
import { applyInspirationSelection } from "@/lib/slot-spec";
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
  const [referenceKey, setReferenceKey] = useSheetSearchParam("reference");
  const [platformFilter, setPlatformFilter] = usePersistedState<InspirationPlatformFilterId>(
    STUDIO_PREFERENCE_KEYS.inspirationPlatform,
    STUDIO_PREFERENCE_DEFAULTS.inspirationPlatform as InspirationPlatformFilterId,
    parseInspirationPlatform,
  );
  const [mediaTypeFilter, setMediaTypeFilter] = usePersistedState<InspirationMediaTypeFilterId>(
    STUDIO_PREFERENCE_KEYS.inspirationMediaType,
    STUDIO_PREFERENCE_DEFAULTS.inspirationMediaType as InspirationMediaTypeFilterId,
    parseInspirationMediaType,
  );
  const [columns, setColumns] = usePersistedState(
    STUDIO_PREFERENCE_KEYS.gridColumns,
    STUDIO_PREFERENCE_DEFAULTS.gridColumns,
    parseGridColumns,
  );
  const slots = horizonSlotsFromGenerations;

  function pickReferenceForSlot(key: string, role: InspirationUseRole = "both") {
    if (!slotPickId) return;
    const item = getInspirationByKey(key, overrides);
    const record = getRecord(slotPickId);
    upsertRecord(applyInspirationSelection(record, slotPickId, key, role, item));
    navigate(`/planificacion?slot=${encodeURIComponent(slotPickId)}`);
  }

  return (
    <Playground
      title="Referencias"
      meta={slotPickId ? "Elegí inspiración para el slot" : undefined}
      fullWidth
      actions={
        <div className="flex items-center gap-2">
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
          referencia y elegí si usarla como estructura, visual o ambas.
        </div>
      ) : null}
      <InspirationPanel
        platformFilter={platformFilter}
        mediaTypeFilter={mediaTypeFilter}
        columns={columns}
        onOpenReference={setReferenceKey}
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
