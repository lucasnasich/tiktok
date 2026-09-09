import type { ColumnCount } from "@/components/ColumnSelector";
import { GALLERY_MODE, type GalleryModeId } from "@/lib/gallery";
import { INSPIRATION_ALL_SOURCE } from "@/content/idea-sources";
import { INSPIRATION_VIEW } from "@/content/inspiration-view";
import {
  COMPETITOR_ALL_COUNTRIES,
  COMPETITOR_SORT,
  type CompetitorSortId,
} from "@/content/competitor-view";

export const STUDIO_PREFERENCE_KEYS = {
  gridColumns: "grid-columns",
  competitorsCountry: "competitors-country",
  competitorsSort: "competitors-sort",
  inspirationSource: "inspiration-source",
  inspirationView: "inspiration-view",
  ideasTab: "ideas-tab",
  galleryMode: "gallery-mode",
} as const;

export function parseGridColumns(raw: unknown): ColumnCount | undefined {
  return raw === 3 || raw === 4 ? raw : undefined;
}

export function parseCompetitorSort(raw: unknown): CompetitorSortId | undefined {
  const ids = Object.values(COMPETITOR_SORT).map((s) => s.id);
  return typeof raw === "string" && ids.includes(raw as CompetitorSortId)
    ? (raw as CompetitorSortId)
    : undefined;
}

export function parseCompetitorCountry(raw: unknown): string | undefined {
  return typeof raw === "string" && raw.length > 0 ? raw : undefined;
}

export function parseInspirationView(raw: unknown): string | undefined {
  const ids = Object.values(INSPIRATION_VIEW).map((v) => v.id);
  return typeof raw === "string" && ids.includes(raw) ? raw : undefined;
}

export function parseInspirationSource(raw: unknown): string | undefined {
  return typeof raw === "string" && raw.length > 0 ? raw : undefined;
}

export function parseIdeasTab(raw: unknown): string | undefined {
  const ids = ["senales", "angulos", "idea"];
  return typeof raw === "string" && ids.includes(raw) ? raw : undefined;
}

export function parseGalleryMode(raw: unknown): GalleryModeId | undefined {
  const ids = Object.values(GALLERY_MODE).map((mode) => mode.id);
  return typeof raw === "string" && ids.includes(raw as GalleryModeId)
    ? (raw as GalleryModeId)
    : undefined;
}

export const STUDIO_PREFERENCE_DEFAULTS = {
  gridColumns: 3 as ColumnCount,
  competitorsCountry: COMPETITOR_ALL_COUNTRIES.id,
  competitorsSort: COMPETITOR_SORT.market.id as CompetitorSortId,
  inspirationSource: INSPIRATION_ALL_SOURCE.id,
  inspirationView: INSPIRATION_VIEW.revisar.id,
  ideasTab: "idea",
  galleryMode: GALLERY_MODE.creativos.id,
};
