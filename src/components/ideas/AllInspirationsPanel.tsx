import type { ColumnCount } from "@/components/ColumnSelector";
import {
  InspirationCommentCard,
  InspirationLinkCard,
  InspirationTextCard,
} from "@/components/ideas/InspirationLinkCard";
import { inspirationGridClass } from "@/components/ideas/inspiration-layout";
import { resolveInspirationPlatform } from "@/content/inspiration-browse-filters";
import type { InspirationFeedItem } from "@/content/inspiration-feed";
import type { InspirationMetaOverride } from "@/lib/inspiration-overrides-store";

export function AllInspirationsPanel({
  columns,
  items,
  overrides = {},
  onOpenReference,
}: {
  columns: ColumnCount;
  items: InspirationFeedItem[];
  overrides?: Record<string, InspirationMetaOverride>;
  onOpenReference?: (key: string) => void;
}) {
  if (items.length === 0) {
    return (
      <p className="px-5 text-[14px] leading-relaxed text-muted-foreground">
        Ninguna referencia con esos filtros.
      </p>
    );
  }

  return (
    <div className={inspirationGridClass(columns)}>
      {items.map((item) => {
        const platform = resolveInspirationPlatform(item);
        const open = onOpenReference
          ? () => onOpenReference(item.key)
          : undefined;

        const classificationOverride = overrides[item.key];

        if (item.kind === "organico-comment") {
          return (
            <InspirationCommentCard
              key={item.key}
              item={{
                id: item.key,
                platform,
                text: item.quote ?? item.postText ?? item.title,
                postUrl: item.url ?? "",
              }}
              onOpen={open}
              classificationOverride={classificationOverride}
            />
          );
        }

        if (item.kind === "cliente") {
          return (
            <InspirationTextCard
              key={item.key}
              platform=""
              text={item.quote ?? item.title}
              subtitle={item.note}
              onOpen={open}
              classificationOverride={classificationOverride}
            />
          );
        }

        return (
          <InspirationLinkCard
            key={item.key}
            item={{
              id: item.key,
              platform,
              url: item.url ?? "",
              title: item.title,
              media: item.media,
              postText: item.postText,
              author: item.author,
              note: item.note,
            }}
            onOpen={open}
            classificationOverride={classificationOverride}
          />
        );
      })}
    </div>
  );
}
