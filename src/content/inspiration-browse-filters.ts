import type { InspirationFeedItem } from "@/content/inspiration-feed";

export const INSPIRATION_ALL_PLATFORMS_ID = "all";
export const INSPIRATION_ALL_MEDIA_TYPES_ID = "all";

export type InspirationPlatformFilterId =
  | typeof INSPIRATION_ALL_PLATFORMS_ID
  | "instagram"
  | "tiktok"
  | "x"
  | "cosmos";

export type InspirationMediaTypeFilterId =
  | typeof INSPIRATION_ALL_MEDIA_TYPES_ID
  | "reel"
  | "carousel"
  | "image"
  | "written";

export const INSPIRATION_PLATFORM_FILTERS: {
  id: InspirationPlatformFilterId;
  label: string;
}[] = [
  { id: INSPIRATION_ALL_PLATFORMS_ID, label: "Todas las redes" },
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "x", label: "X" },
  { id: "cosmos", label: "Cosmos" },
];

export const INSPIRATION_MEDIA_TYPE_FILTERS: {
  id: InspirationMediaTypeFilterId;
  label: string;
}[] = [
  { id: INSPIRATION_ALL_MEDIA_TYPES_ID, label: "Todos los tipos" },
  { id: "reel", label: "Reels" },
  { id: "carousel", label: "Carruseles" },
  { id: "image", label: "Imágenes" },
  { id: "written", label: "Posts escritos" },
];

function normalizePlatform(platform: string | undefined): string {
  return (platform ?? "").trim().toLowerCase();
}

/** Red visible en la biblioteca. Referencias visuales de Cosmos quedan agrupadas ahí. */
export function resolveInspirationPlatform(
  item: Pick<InspirationFeedItem, "kind" | "platform" | "url" | "sourceId">,
): string {
  if (
    item.kind === "creativo" ||
    item.sourceId === "creativo" ||
    normalizePlatform(item.platform) === "cosmos" ||
    (item.url ?? "").includes("cosmos.so")
  ) {
    return "Cosmos";
  }

  return item.platform ?? "";
}

export function matchesInspirationPlatformFilter(
  item: Pick<InspirationFeedItem, "kind" | "platform" | "url" | "sourceId">,
  filterId: InspirationPlatformFilterId,
): boolean {
  if (filterId === INSPIRATION_ALL_PLATFORMS_ID) return true;
  const value = normalizePlatform(resolveInspirationPlatform(item));
  if (filterId === "instagram") return value === "instagram";
  if (filterId === "tiktok") return value === "tiktok";
  if (filterId === "x") return value === "x" || value === "twitter";
  if (filterId === "cosmos") return value === "cosmos";
  return true;
}

export function inferInspirationMediaType(
  item: Pick<
    InspirationFeedItem,
    "kind" | "url" | "media" | "postText" | "previewImage" | "quote"
  >,
): Exclude<InspirationMediaTypeFilterId, typeof INSPIRATION_ALL_MEDIA_TYPES_ID> {
  if (item.kind === "organico-comment" || item.quote) return "written";

  const media = item.media ?? [];
  if (media.length > 1) return "carousel";
  if (media.length === 1) {
    return media[0].kind === "video" ? "reel" : "image";
  }

  const url = item.url ?? "";
  if (/\/photo\//i.test(url)) return "carousel";
  if (/\/video\//i.test(url) || /\/reel\//i.test(url)) return "reel";

  if (item.postText && !item.previewImage) return "written";
  if (item.previewImage) return "image";

  return "image";
}

export function matchesInspirationMediaTypeFilter(
  item: InspirationFeedItem,
  filterId: InspirationMediaTypeFilterId,
): boolean {
  if (filterId === INSPIRATION_ALL_MEDIA_TYPES_ID) return true;
  return inferInspirationMediaType(item) === filterId;
}

export function filterInspirationFeed(
  items: InspirationFeedItem[],
  platformFilter: InspirationPlatformFilterId,
  mediaTypeFilter: InspirationMediaTypeFilterId,
): InspirationFeedItem[] {
  return items.filter(
    (item) =>
      matchesInspirationPlatformFilter(item, platformFilter) &&
      matchesInspirationMediaTypeFilter(item, mediaTypeFilter),
  );
}
