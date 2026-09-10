import { ArrowSquareOutIcon } from "@phosphor-icons/react";

import { InspirationLinkPreview } from "@/components/ideas/InspirationLinkPreview";
import { InspirationFormatBadges } from "@/components/ideas/InspirationFormatBadges";
import { InspirationMediaBadges } from "@/components/ideas/InspirationMediaBadges";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type {
  InspirationCommentItem,
  InspirationLinkItem,
} from "@/content/inspiration-links";

export function InspirationLinkCard({ item }: { item: InspirationLinkItem }) {
  return (
    <Card
      size="sm"
      className="group/card gap-0 overflow-hidden rounded-none p-0 ring-0"
    >
      <div className="relative overflow-hidden group/preview">
        <InspirationLinkPreview
          url={item.url}
          previewImage={item.previewImage}
          media={item.media}
          platform={item.platform}
          title={item.title}
          postText={item.postText}
          author={item.author}
        />
      </div>
      <div className="px-3 py-2.5">
        <InspirationMediaBadges
          platform={item.platform}
          sourceLabel={item.sourceLabel}
        />
        {item.formatIds?.length ? (
          <div className="pt-1.5">
            <InspirationFormatBadges formatIds={item.formatIds} />
          </div>
        ) : null}
        <p className="line-clamp-2 pt-1.5 text-[14px] font-medium leading-snug tracking-tight text-foreground">
          {item.title}
        </p>
      </div>
    </Card>
  );
}

export function InspirationCommentCard({ item }: { item: InspirationCommentItem }) {
  return (
    <Card size="sm" className="h-full rounded-none p-3 ring-0">
      <CardHeader className="gap-2 p-0">
        <Badge variant="secondary" className="w-fit text-[11px]">
          Comentario · {item.platform}
        </Badge>
        <blockquote className="border-l-2 border-border py-0.5 pl-3 text-[14px] leading-relaxed text-foreground">
          “{item.text}”
        </blockquote>
      </CardHeader>
      <CardContent className="p-0 pt-2">
        <a
          href={item.postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground underline underline-offset-3 hover:text-foreground/80"
        >
          Ver post
          <ArrowSquareOutIcon className="size-3" />
        </a>
      </CardContent>
    </Card>
  );
}
