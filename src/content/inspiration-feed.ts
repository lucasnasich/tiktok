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
import { organicInspirations } from "@/content/organic-inspirations";

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
  typeLabel?: string;
};

const SWIPEABLE_SOURCE_IDS = ["cliente", "organico", "creativo"] as const;

export function isSwipeableSource(sourceId: string) {
  return (
    sourceId === INSPIRATION_ALL_SOURCE_ID ||
    SWIPEABLE_SOURCE_IDS.includes(sourceId as (typeof SWIPEABLE_SOURCE_IDS)[number])
  );
}

function feedKey(sourceId: string, id: string) {
  return `${sourceId}:${id}`;
}

function buildClienteFeed(): InspirationFeedItem[] {
  const sourceId = "cliente";
  const sourceLabel = getSourceLabel(sourceId);

  return clientInspirations.map((item) => ({
    key: feedKey(sourceId, item.id),
    sourceId,
    sourceLabel,
    kind: "cliente",
    title: CLIENTE_INSPIRATION_TYPE_LABELS[item.type],
    quote: item.text,
    note: item.context,
    typeLabel: CLIENTE_INSPIRATION_TYPE_LABELS[item.type],
  }));
}

function buildOrganicFeed(): InspirationFeedItem[] {
  const sourceId = "organico";
  const sourceLabel = getSourceLabel(sourceId);

  return organicInspirations.map((item) => {
    if (item.kind === "comment") {
      return {
        key: feedKey(sourceId, item.id),
        sourceId,
        sourceLabel,
        kind: "organico-comment",
        title: `Comentario · ${item.platform}`,
        quote: item.text,
        url: item.postUrl,
        platform: item.platform,
      };
    }

    return {
      key: feedKey(sourceId, item.id),
      sourceId,
      sourceLabel,
      kind: "organico-post",
      title: item.title,
      note: item.note,
      url: item.url,
      media: item.media,
      platform: item.platform,
    };
  });
}

function buildCreativeFeed(): InspirationFeedItem[] {
  const sourceId = "creativo";
  const sourceLabel = getSourceLabel(sourceId);

  return creativeInspirations.map((item) => ({
    key: feedKey(sourceId, item.id),
    sourceId,
    sourceLabel,
    kind: "creativo",
    title: item.title,
    note: item.note,
    url: item.url,
    media: item.media,
    platform: item.platform,
  }));
}

const FEED_BUILDERS: Record<string, () => InspirationFeedItem[]> = {
  cliente: buildClienteFeed,
  organico: buildOrganicFeed,
  creativo: buildCreativeFeed,
};

export function buildInspirationFeed(sourceId: string): InspirationFeedItem[] {
  if (sourceId === INSPIRATION_ALL_SOURCE_ID) {
    return SWIPEABLE_SOURCE_IDS.flatMap((id) => FEED_BUILDERS[id]?.() ?? []);
  }

  return FEED_BUILDERS[sourceId]?.() ?? [];
}

export function getInspirationSourceSummary(sourceId: string) {
  if (sourceId === INSPIRATION_ALL_SOURCE_ID) {
    return "Todas las referencias guardadas, de cualquier fuente.";
  }

  return IDEA_SOURCES.find((source) => source.id === sourceId)?.summary ?? "";
}
