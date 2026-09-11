import type { ColumnCount } from "@/components/ColumnSelector";
import { GALLERY_MODE, type GalleryModeId } from "@/lib/gallery";
import {
  INSPIRATION_ALL_MEDIA_TYPES_ID,
  INSPIRATION_ALL_PLATFORMS_ID,
  INSPIRATION_MEDIA_TYPE_FILTERS,
  INSPIRATION_PLATFORM_FILTERS,
} from "@/content/inspiration-browse-filters";
import {
  PLANNING_MODE,
  type PlanningModeId,
} from "@/content/planning-mode";
import {
  PLANNING_VIEW,
  PLANNING_VIEW_IDS,
  type PlanningViewId,
} from "@/content/planning-view";
import {
  COMPETITOR_ALL_COUNTRIES,
  COMPETITOR_SORT,
  type CompetitorSortId,
} from "@/content/competitor-view";

export const STUDIO_PREFERENCE_KEYS = {
  gridColumns: "grid-columns",
  competitorsCountry: "competitors-country",
  competitorsSort: "competitors-sort",
  inspirationPlatform: "inspiration-platform",
  inspirationMediaType: "inspiration-media-type",
  ideasTab: "ideas-tab",
  planningAccount: "planning-account",
  planningWeekStart: "planning-week-start",
  planningView: "planning-view",
  planningMode: "planning-mode",
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

export function parseInspirationPlatform(raw: unknown): string | undefined {
  const ids = INSPIRATION_PLATFORM_FILTERS.map((entry) => entry.id);
  return typeof raw === "string" && ids.includes(raw) ? raw : undefined;
}

export function parseInspirationMediaType(raw: unknown): string | undefined {
  const ids = INSPIRATION_MEDIA_TYPE_FILTERS.map((entry) => entry.id);
  return typeof raw === "string" && ids.includes(raw) ? raw : undefined;
}

export function parseIdeasTab(raw: unknown): string | undefined {
  const ids = ["senales", "angulos", "formatos", "idea"];
  return typeof raw === "string" && ids.includes(raw) ? raw : undefined;
}

export function parsePlanningAccount(raw: unknown): string | undefined {
  return typeof raw === "string" && raw.length > 0 ? raw : undefined;
}

export function parsePlanningWeekStart(raw: unknown): string | undefined {
  return typeof raw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw)
    ? raw
    : undefined;
}

export function parsePlanningMode(raw: unknown): PlanningModeId | undefined {
  const ids = Object.values(PLANNING_MODE).map((mode) => mode.id);
  return typeof raw === "string" && ids.includes(raw as PlanningModeId)
    ? (raw as PlanningModeId)
    : undefined;
}

export function parsePlanningView(raw: unknown): PlanningViewId | undefined {
  return typeof raw === "string" &&
    PLANNING_VIEW_IDS.includes(raw as PlanningViewId)
    ? (raw as PlanningViewId)
    : undefined;
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
  inspirationPlatform: INSPIRATION_ALL_PLATFORMS_ID,
  inspirationMediaType: INSPIRATION_ALL_MEDIA_TYPES_ID,
  ideasTab: "idea",
  planningAccount: "all",
  planningView: PLANNING_VIEW.week.id,
  planningMode: PLANNING_MODE.calendar.id,
  galleryMode: GALLERY_MODE.creativos.id,
};
