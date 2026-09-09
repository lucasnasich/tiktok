import type { ColumnCount } from "@/components/ColumnSelector";
import { CompetitorCard } from "@/components/competitors/CompetitorCard";
import { cn } from "@/lib/utils";
import { getCompetitorFeed } from "@/content/competitor-feed";
import { competitorInspirations } from "@/content/competitor-inspirations";
import {
  COMPETITOR_ALL_COUNTRIES,
  type CompetitorSortId,
} from "@/content/competitor-view";

type CompetitorsPanelProps = {
  countryId: string;
  countryLabel: string;
  sort: CompetitorSortId;
  columns: ColumnCount;
};

export function CompetitorsPanel({
  countryId,
  countryLabel,
  sort,
  columns,
}: CompetitorsPanelProps) {
  if (competitorInspirations.length === 0) {
    return (
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        Todavía no hay competidores guardados. Agregalos en{" "}
        <code className="text-[12px]">src/content/competitor-inspirations.ts</code>.
      </p>
    );
  }

  const feed = getCompetitorFeed(competitorInspirations, countryId, sort);

  if (feed.length === 0) {
    return (
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        No hay competidores para este país con los filtros actuales.
      </p>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3",
        columns === 3 && "sm:grid-cols-3",
        columns === 4 && "sm:grid-cols-4",
      )}
    >
      {feed.map(({ item, rank, marketRank, similarityRank, countryMarketRank, isGlobal }) => (
        <CompetitorCard
          key={item.id}
          item={item}
          rank={rank}
          marketRank={marketRank}
          similarityRank={similarityRank}
          countryMarketRank={countryMarketRank}
          countryLabel={
            countryId === COMPETITOR_ALL_COUNTRIES.id ? undefined : countryLabel
          }
          isGlobal={isGlobal}
          highlightSort={sort}
        />
      ))}
    </div>
  );
}
