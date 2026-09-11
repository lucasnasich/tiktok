import type { ContentRoleId } from "@/content/content-roles";
import {
  CLIENTE_INSPIRATION_TYPE_LABELS,
  clientInspirations,
} from "@/content/client-inspirations";
import { creativeInspirations } from "@/content/creative-inspirations";
import {
  getSourceLabel,
  IDEA_SOURCES,
  INSPIRATION_ALL_SOURCE_ID,
} from "@/content/idea-sources";
import type { InspirationMediaSlide } from "@/content/inspiration-links";
import type {
  InspirationMaterialType,
  InspirationOrigin,
} from "@/content/inspiration-taxonomy";
import { organicInspirations } from "@/content/organic-inspirations";
import { classifyInspiration } from "@/lib/inspiration-classify";
import { decodeHtmlEntities } from "@/lib/html-entities";
import type { InspirationMetaOverride } from "@/lib/inspiration-overrides-store";

export type InspirationFeedKind =
  | "cliente"
  | "organico-post"
  | "organico-comment"
  | "creativo";

export type InspirationFeedItem = {
  key: string;
  sourceId: string;
  sourceLabel: string;
  kind: InspirationFeedKind;
  title: string;
  subtitle?: string;
  note?: string;
  url?: string;
  media?: InspirationMediaSlide[];
  platform?: string;
  quote?: string;
  postText?: string;
  author?: string;
  typeLabel?: string;
  formatIds?: string[];
  origin: InspirationOrigin;
  materialType: InspirationMaterialType;
  signal?: string;
  pillarAffinities?: string[];
  roleAffinities?: ContentRoleId[];
  formatAffinities?: string[];
  angleAffinities?: string[];
  creativeMechanism?: string;
  sourceAccount?: string;
  notes?: string[];
};

const SWIPEABLE_SOURCE_IDS = ["cliente", "organico", "creativo"] as const;

export function isSwipeableSource(sourceId: string) {
  return (
    sourceId === INSPIRATION_ALL_SOURCE_ID ||
    SWIPEABLE_SOURCE_IDS.includes(sourceId as (typeof SWIPEABLE_SOURCE_IDS)[number])
  );
}

export function isInspirationFeedSource(sourceId: string) {
  return isSwipeableSource(sourceId);
}

export function inspirationTypeOf(
  item: Pick<InspirationFeedItem, "materialType">,
): InspirationMaterialType {
  return item.materialType;
}

function feedKey(sourceId: string, id: string) {
  return `${sourceId}:${id}`;
}

function summarizeSignal(
  item: Pick<InspirationFeedItem, "quote" | "postText" | "note" | "title">,
) {
  const text = (item.quote || item.postText || item.note || item.title || "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= 180) return text || undefined;
  return `${text.slice(0, 179).trim()}…`;
}

function withClassification(
  item: Omit<InspirationFeedItem, "origin" | "materialType">,
): InspirationFeedItem {
  const classified = { ...item, ...classifyInspiration(item) };
  return {
    ...classified,
    signal: item.signal ?? summarizeSignal(classified),
    sourceAccount: item.sourceAccount ?? item.author,
  };
}

export function applyInspirationOverride(
  item: InspirationFeedItem,
  override?: InspirationMetaOverride,
): InspirationFeedItem {
  if (!override) return item;
  return {
    ...item,
    origin: override.origin ?? item.origin,
    materialType: override.materialType ?? item.materialType,
    signal: override.signal ?? item.signal,
    pillarAffinities: override.pillarAffinities ?? item.pillarAffinities,
    roleAffinities: override.roleAffinities ?? item.roleAffinities,
    formatAffinities: override.formatAffinities ?? item.formatAffinities,
    angleAffinities: override.angleAffinities ?? item.angleAffinities,
    creativeMechanism: override.creativeMechanism ?? item.creativeMechanism,
    sourceAccount: override.sourceAccount ?? item.sourceAccount,
    notes: override.notes ?? item.notes,
  };
}

export function hydrateInspirationFeed(
  items: InspirationFeedItem[],
  overrides: Record<string, InspirationMetaOverride> = {},
): InspirationFeedItem[] {
  return items.map((item) => applyInspirationOverride(item, overrides[item.key]));
}

function buildClienteFeed(): InspirationFeedItem[] {
  const sourceId = "cliente";
  const sourceLabel = getSourceLabel(sourceId);

  return clientInspirations.map((item) =>
    withClassification({
      key: feedKey(sourceId, item.id),
      sourceId,
      sourceLabel,
      kind: "cliente",
      title: CLIENTE_INSPIRATION_TYPE_LABELS[item.type],
      quote: item.text,
      note: item.context,
      typeLabel: CLIENTE_INSPIRATION_TYPE_LABELS[item.type],
    }),
  );
}

function buildOrganicFeed(): InspirationFeedItem[] {
  const sourceId = "organico";
  const sourceLabel = getSourceLabel(sourceId);

  return organicInspirations.map((item) => {
    if (item.kind === "comment") {
      return withClassification({
        key: feedKey(sourceId, item.id),
        sourceId,
        sourceLabel,
        kind: "organico-comment",
        title: `Comentario · ${item.platform}`,
        quote: item.text,
        url: item.postUrl,
        platform: item.platform,
      });
    }

    return withClassification({
      key: feedKey(sourceId, item.id),
      sourceId,
      sourceLabel,
      kind: "organico-post",
      title: decodeHtmlEntities(item.title),
      note: item.note,
      url: item.url,
      media: item.media,
      platform: item.platform,
      postText: item.postText,
      author: item.author,
      formatIds: item.formatIds,
    });
  });
}

function buildCreativeFeed(): InspirationFeedItem[] {
  const sourceId = "creativo";
  const sourceLabel = getSourceLabel(sourceId);

  return creativeInspirations.map((item) =>
    withClassification({
      key: feedKey(sourceId, item.id),
      sourceId,
      sourceLabel,
      kind: "creativo",
      title: decodeHtmlEntities(item.title),
      note: item.note,
      url: item.url,
      media: item.media,
      platform: item.platform,
      postText: item.postText,
      author: item.author,
      formatIds: item.formatIds,
    }),
  );
}

const FEED_BUILDERS: Record<string, () => InspirationFeedItem[]> = {
  cliente: buildClienteFeed,
  organico: buildOrganicFeed,
  creativo: buildCreativeFeed,
};

export function buildInspirationFeed(sourceId?: string): InspirationFeedItem[] {
  const resolvedSourceId = sourceId ?? INSPIRATION_ALL_SOURCE_ID;
  return resolvedSourceId === INSPIRATION_ALL_SOURCE_ID
    ? SWIPEABLE_SOURCE_IDS.flatMap((id) => FEED_BUILDERS[id]?.() ?? [])
    : FEED_BUILDERS[resolvedSourceId]?.() ?? [];
}

export function getInspirationSourceSummary(sourceId: string) {
  if (sourceId === INSPIRATION_ALL_SOURCE_ID) {
    return "Todas las referencias guardadas, de cualquier fuente.";
  }

  return IDEA_SOURCES.find((source) => source.id === sourceId)?.summary ?? "";
}

export function getInspirationByKey(
  key: string,
  overrides: Record<string, InspirationMetaOverride> = {},
): InspirationFeedItem | undefined {
  const item = buildInspirationFeed(INSPIRATION_ALL_SOURCE_ID).find(
    (entry) => entry.key === key,
  );
  if (!item) return undefined;
  return applyInspirationOverride(item, overrides[key]);
}
