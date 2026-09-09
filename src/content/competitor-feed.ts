import type { CompetitorInspiration } from "@/content/competitor-inspirations";
import {
  getGlobalMarketRank,
  getGlobalSimilarityRank,
  GLOBAL_MARKET_ORDER,
  GLOBAL_SIMILARITY_ORDER,
} from "@/content/competitor-global-rankings";
import { MARKET_RANKINGS_BY_COUNTRY } from "@/content/competitor-rankings";
import {
  COMPETITOR_ALL_COUNTRIES,
  COMPETITOR_FILTER_COUNTRIES,
  type CompetitorSortId,
} from "@/content/competitor-view";

const UNRANKED_SORT = 9999;

/** Opciones del filtro: todos + los 16 mercados del ranking. */
export function getCompetitorCountryOptions(): { id: string; label: string }[] {
  return [
    { id: COMPETITOR_ALL_COUNTRIES.id, label: COMPETITOR_ALL_COUNTRIES.label },
    ...COMPETITOR_FILTER_COUNTRIES.map((country) => ({
      id: country,
      label: country,
    })),
  ];
}

function marketRankFor(item: CompetitorInspiration): number | undefined {
  return getGlobalMarketRank(item.id);
}

function similarityRankFor(item: CompetitorInspiration): number | undefined {
  return getGlobalSimilarityRank(item.id);
}

function orderByIds(
  items: CompetitorInspiration[],
  ids: readonly string[],
): CompetitorInspiration[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  return ids
    .map((id) => byId.get(id))
    .filter((item): item is CompetitorInspiration => item !== undefined);
}

/** Vista global: solo los del ranking global, en el orden exacto de la tabla. */
function filterGlobal(items: CompetitorInspiration[], sort: CompetitorSortId) {
  const order =
    sort === "market" ? GLOBAL_MARKET_ORDER : GLOBAL_SIMILARITY_ORDER;
  return orderByIds(items, order);
}

/** Vista por país: lista local de poder de mercado (orden fijo por mercado). */
function filterByCountryMarketList(
  items: CompetitorInspiration[],
  countryId: string,
) {
  const ranking = MARKET_RANKINGS_BY_COUNTRY[countryId];
  if (!ranking?.length) return [];
  return orderByIds(items, ranking);
}

/** Vista por país + similitud: mismos competidores del mercado, ordenados por similitud global. */
function sortCountryBySimilarity(items: CompetitorInspiration[]) {
  return [...items].sort((a, b) => {
    const aRank = similarityRankFor(a) ?? UNRANKED_SORT;
    const bRank = similarityRankFor(b) ?? UNRANKED_SORT;
    if (aRank !== bRank) return aRank - bRank;
    return a.name.localeCompare(b.name, "es");
  });
}

export function filterCompetitorsByCountry(
  items: CompetitorInspiration[],
  countryId: string,
  sort: CompetitorSortId = "market",
) {
  if (countryId === COMPETITOR_ALL_COUNTRIES.id) {
    return filterGlobal(items, sort);
  }
  if (sort === "market") {
    return filterByCountryMarketList(items, countryId);
  }
  return sortCountryBySimilarity(filterByCountryMarketList(items, countryId));
}

export function hasCompetitorRankingData(
  _items: CompetitorInspiration[],
  _sort: CompetitorSortId,
) {
  return true;
}

function countryMarketRankFor(
  item: CompetitorInspiration,
  countryId: string,
): number | undefined {
  const ranking = MARKET_RANKINGS_BY_COUNTRY[countryId];
  if (!ranking) return undefined;
  const index = ranking.indexOf(item.id);
  return index >= 0 ? index + 1 : undefined;
}

export function getCompetitorFeed(
  items: CompetitorInspiration[],
  countryId: string,
  sort: CompetitorSortId,
) {
  const isGlobal = countryId === COMPETITOR_ALL_COUNTRIES.id;
  const filtered = filterCompetitorsByCountry(items, countryId, sort);

  return filtered.map((item, index) => {
    const marketRank = marketRankFor(item);
    const similarityRank = similarityRankFor(item);
    const listPosition = index + 1;
    const countryMarketRank = isGlobal
      ? undefined
      : countryMarketRankFor(item, countryId);

    const badgeRank = isGlobal
      ? sort === "market"
        ? marketRank
        : similarityRank
      : listPosition;

    return {
      item,
      rank: badgeRank,
      marketRank,
      similarityRank,
      countryRank: isGlobal ? undefined : listPosition,
      countryMarketRank,
      isGlobal,
    };
  });
}
