import type { ColumnCount } from "@/components/ColumnSelector";
import { GALLERY_MODE, type GalleryModeId } from "@/lib/gallery";
import { INSPIRATION_ALL_SOURCE } from "@/content/idea-sources";
import { INSPIRATION_ALL_FORMATS_ID } from "@/content/formats";
import { PLANNING_ALL_ACCOUNTS_ID } from "@/content/planning-accounts";
import {
  PLANNING_MODE,
  type PlanningModeId,
} from "@/content/planning-mode";
import {
  PLANNING_VIEW,
  PLANNING_VIEW_IDS,
  type PlanningViewId,
} from "@/content/planning-view";
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
  inspirationFormat: "inspiration-format",
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

export function parseInspirationView(raw: unknown): string | undefined {
  const ids = Object.values(INSPIRATION_VIEW).map((v) => v.id);
  return typeof raw === "string" && ids.includes(raw) ? raw : undefined;
}

export function parseInspirationSource(raw: unknown): string | undefined {
  return typeof raw === "string" && raw.length > 0 ? raw : undefined;
}

export function parseInspirationFormat(raw: unknown): string | undefined {
  return typeof raw === "string" && raw.length > 0 ? raw : undefined;
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
  inspirationSource: INSPIRATION_ALL_SOURCE.id,
  inspirationView: INSPIRATION_VIEW.revisar.id,
  inspirationFormat: INSPIRATION_ALL_FORMATS_ID,
  ideasTab: "idea",
  planningAccount: PLANNING_ALL_ACCOUNTS_ID,
  planningView: PLANNING_VIEW.week.id,
  planningMode: PLANNING_MODE.calendar.id,
  galleryMode: GALLERY_MODE.creativos.id,
};
