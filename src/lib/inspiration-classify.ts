import type { InspirationFeedItem } from "@/content/inspiration-feed";
import type {
  InspirationMaterialType,
  InspirationOrigin,
} from "@/content/inspiration-taxonomy";

const SUGGESTION_PATTERN =
  /\b(idea|ideas|cta idea|generar contenido|qué publicar|podrías hacer|sugerencia|prompt)\b/i;

function haystack(item: Pick<InspirationFeedItem, "title" | "note" | "postText" | "quote">) {
  return [item.title, item.note, item.postText, item.quote].filter(Boolean).join(" ");
}

/**
 * Origen inferido solo desde la biblioteca de origen.
 * No inventa competitor/ad/trend sin evidencia en el item.
 */
export function inferInspirationOrigin(
  item: Pick<InspirationFeedItem, "sourceId" | "kind">,
): InspirationOrigin {
  if (item.sourceId === "cliente") return "client";
  if (item.sourceId === "creativo") return "visual-reference";
  if (item.sourceId === "organico") return "organic";
  return "unknown";
}

export function inferInspirationMaterialType(
  item: Pick<InspirationFeedItem, "kind" | "title" | "note" | "postText" | "quote">,
): InspirationMaterialType {
  if (item.kind === "organico-comment" || item.kind === "cliente") {
    return "suggestion";
  }
  if (SUGGESTION_PATTERN.test(haystack(item))) return "suggestion";
  return "example";
}

export function classifyInspiration(
  item: Pick<
    InspirationFeedItem,
    "sourceId" | "kind" | "title" | "note" | "postText" | "quote"
  > & {
    origin?: InspirationOrigin;
    materialType?: InspirationMaterialType;
  },
) {
  return {
    origin: item.origin ?? inferInspirationOrigin(item),
    materialType: item.materialType ?? inferInspirationMaterialType(item),
  };
}
