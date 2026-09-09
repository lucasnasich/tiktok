import { useMemo } from "react";

import { Playground } from "@/components/AppShell";
import { ColumnSelector } from "@/components/ColumnSelector";
import { CompetitorCountryFilter } from "@/components/competitors/CompetitorCountryFilter";
import { CompetitorsPanel } from "@/components/competitors/CompetitorsPanel";
import { CompetitorSortFilter } from "@/components/competitors/CompetitorSortFilter";
import {
  filterCompetitorsByCountry,
  getCompetitorCountryOptions,
} from "@/content/competitor-feed";
import { competitorInspirations } from "@/content/competitor-inspirations";
import { COMPETITOR_ALL_COUNTRIES } from "@/content/competitor-view";
import { usePersistedState } from "@/hooks/use-persisted-state";
import {
  STUDIO_PREFERENCE_DEFAULTS,
  STUDIO_PREFERENCE_KEYS,
  parseCompetitorCountry,
  parseCompetitorSort,
  parseGridColumns,
} from "@/lib/studio-preferences";

export function CompetitorsScreen() {
  const [countryId, setCountryId] = usePersistedState(
    STUDIO_PREFERENCE_KEYS.competitorsCountry,
    STUDIO_PREFERENCE_DEFAULTS.competitorsCountry,
    parseCompetitorCountry,
  );
  const [sort, setSort] = usePersistedState(
    STUDIO_PREFERENCE_KEYS.competitorsSort,
    STUDIO_PREFERENCE_DEFAULTS.competitorsSort,
    parseCompetitorSort,
  );
  const [columns, setColumns] = usePersistedState(
    STUDIO_PREFERENCE_KEYS.gridColumns,
    STUDIO_PREFERENCE_DEFAULTS.gridColumns,
    parseGridColumns,
  );

  const countryOptions = useMemo(() => getCompetitorCountryOptions(), []);

  const visibleCount = useMemo(
    () =>
      filterCompetitorsByCountry(competitorInspirations, countryId, sort)
        .length,
    [countryId, sort],
  );

  const countryLabel =
    countryOptions.find((option) => option.id === countryId)?.label ??
    COMPETITOR_ALL_COUNTRIES.label;

  const meta =
    countryId === COMPETITOR_ALL_COUNTRIES.id
      ? `${visibleCount} marcas`
      : `${visibleCount} en ${countryLabel}`;

  return (
    <Playground
      title="Competidores"
      meta={meta}
      fullWidth
      actions={
        <div className="flex items-center gap-2">
          <CompetitorSortFilter value={sort} onChange={setSort} />
          <CompetitorCountryFilter
            value={countryId}
            options={countryOptions}
            onChange={setCountryId}
          />
          <ColumnSelector value={columns} onChange={setColumns} />
        </div>
      }
    >
      <div className="p-5">
        <CompetitorsPanel
          countryId={countryId}
          countryLabel={countryLabel}
          sort={sort}
          columns={columns}
        />
      </div>
    </Playground>
  );
}
