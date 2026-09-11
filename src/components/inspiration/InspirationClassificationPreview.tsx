import { ArrowSquareOutIcon } from "@phosphor-icons/react";

import {
  InspirationLinkPreview,
  TextPostPreview,
} from "@/components/ideas/InspirationLinkPreview";
import { MediaOnlyPreview } from "@/components/ideas/MediaOnlyPreview";
import { Badge } from "@/components/ui/badge";
import { resolveInspirationPlatform } from "@/content/inspiration-browse-filters";
import type { InspirationFeedItem } from "@/content/inspiration-feed";
import { PlatformIcon } from "@/components/icons/platform-icon";

export function InspirationClassificationPreview({
  item,
}: {
  item: InspirationFeedItem;
}) {
  const platform = resolveInspirationPlatform(item);
  const hasMedia = Boolean(item.media?.length);
  const hasPostText = Boolean(item.postText?.trim());
  const hasQuote = Boolean(item.quote?.trim());

  return (
    <div className="space-y-4">
      {hasMedia ? (
        <div className="overflow-hidden rounded-lg border border-border">
          <MediaOnlyPreview slides={item.media!} postUrl={item.url} />
        </div>
      ) : item.url && platform ? (
        <div className="overflow-hidden rounded-lg border border-border">
          <InspirationLinkPreview
            url={item.url}
            media={item.media}
            platform={platform}
            title={item.title}
            postText={item.postText}
            author={item.author}
          />
        </div>
      ) : hasQuote ? (
        <div className="overflow-hidden rounded-lg border border-border">
          <TextPostPreview
            postText={item.quote!}
            author={item.author}
            platform={platform ?? "Referencia"}
          />
        </div>
      ) : null}

      {hasMedia && hasPostText ? (
        <div className="rounded-lg border border-border bg-muted/20 p-3">
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Texto del post
          </p>
          <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-foreground">
            {item.postText}
          </p>
        </div>
      ) : null}

      <div className="space-y-2">
        {platform ? (
          <Badge variant="outline" className="gap-1">
            <PlatformIcon platform={platform} size={12} />
            {platform}
          </Badge>
        ) : null}
        <p className="text-[15px] font-medium leading-snug">{item.title}</p>
        {item.note ? (
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {item.note}
          </p>
        ) : null}
        {item.author ? (
          <p className="text-[12px] text-muted-foreground">{item.author}</p>
        ) : null}
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[13px] font-medium underline underline-offset-2"
          >
            Abrir original
            <ArrowSquareOutIcon className="size-3.5" />
          </a>
        ) : null}
      </div>
    </div>
  );
}
