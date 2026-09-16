import { getFormatCapabilities } from "@/content/format-capabilities";
import {
  inferInspirationMediaType,
  type InspirationMediaTypeFilterId,
} from "@/content/inspiration-browse-filters";
import type { InspirationFeedItem } from "@/content/inspiration-feed";
import type { ProductionOptionId } from "@/content/production-options";

const MEDIA_FOR_PRODUCTION: Record<
  ProductionOptionId,
  Array<Exclude<InspirationMediaTypeFilterId, "all">>
> = {
  single_image: ["image"],
  image_carousel: ["carousel"],
  animated_carousel: ["carousel", "reel"],
  remotion_video: ["reel"],
  screen_demo: ["reel"],
  ai_generated_video: ["reel"],
  talking_camera: ["reel"],
  talking_camera_remotion: ["reel"],
};

export function inferredInspirationProductionOptions(
  item: InspirationFeedItem,
): ProductionOptionId[] {
  const formatIds = [
    ...(item.formatIds ?? []),
    ...(item.formatAffinities ?? []),
  ];
  const fromFormats = new Set<ProductionOptionId>();
  for (const formatId of formatIds) {
    for (const option of getFormatCapabilities(formatId).productionOptions) {
      fromFormats.add(option);
    }
  }
  if (fromFormats.size > 0) return [...fromFormats];

  const media = inferInspirationMediaType(item);
  if (media === "image") return ["single_image"];
  if (media === "carousel") return ["image_carousel", "animated_carousel"];
  if (media === "reel") {
    return [
      "animated_carousel",
      "remotion_video",
      "screen_demo",
      "ai_generated_video",
      "talking_camera",
      "talking_camera_remotion",
    ];
  }
  return [];
}

export function inspirationMatchesProduction(
  item: InspirationFeedItem,
  productionTypeId: ProductionOptionId,
): boolean {
  const formatIds = [
    ...(item.formatIds ?? []),
    ...(item.formatAffinities ?? []),
  ];
  if (formatIds.length > 0) {
    return formatIds.some((formatId) =>
      getFormatCapabilities(formatId).productionOptions.includes(
        productionTypeId,
      ),
    );
  }

  const media = inferInspirationMediaType(item);
  return (MEDIA_FOR_PRODUCTION[productionTypeId] ?? []).includes(media);
}

export function filterInspirationsByProduction(
  items: InspirationFeedItem[],
  productionTypeId: ProductionOptionId,
): InspirationFeedItem[] {
  return items.filter((item) =>
    inspirationMatchesProduction(item, productionTypeId),
  );
}

export function qualitativeInspirationBadges(input: {
  productionMatch?: boolean;
  formatRelated?: boolean;
  visualSimilar?: boolean;
  structureSimilar?: boolean;
  unused?: boolean;
}): string[] {
  const badges: string[] = [];
  if (input.productionMatch) badges.push("Mismo tipo de pieza");
  if (input.visualSimilar) badges.push("Visual similar");
  if (input.structureSimilar) badges.push("Estructura parecida");
  if (input.formatRelated) badges.push("Formato relacionado");
  if (input.unused) badges.push("Todavía no se usó");
  return badges;
}
