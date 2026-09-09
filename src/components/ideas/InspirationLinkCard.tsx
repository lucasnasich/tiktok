import { ExternalLink } from "lucide-react";

import { InspirationLinkPreview } from "@/components/ideas/InspirationLinkPreview";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  InspirationCommentItem,
  InspirationLinkItem,
} from "@/content/inspiration-links";

function platformHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function InspirationLinkCard({ item }: { item: InspirationLinkItem }) {
  return (
    <Card
      size="sm"
      className="group/card gap-0 overflow-visible p-0 ring-border/80 transition-colors hover:ring-foreground/20"
    >
      <InspirationLinkPreview
        url={item.url}
        previewImage={item.previewImage}
        media={item.media}
        platform={item.platform}
        title={item.title}
      />
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block px-3 pt-3"
      >
        <CardHeader className="gap-2 px-0">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary" className="text-[11px]">
              {item.platform}
            </Badge>
            <ExternalLink
              className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/card:opacity-100"
              strokeWidth={1.75}
            />
          </div>
          <CardTitle className="text-[15px] leading-snug tracking-tight">
            {item.title}
          </CardTitle>
          <p className="truncate text-[12px] text-muted-foreground">
            {platformHost(item.url)}
          </p>
        </CardHeader>
      </a>
      {item.note ? (
        <CardContent className="px-3 pt-0 pb-3">
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {item.note}
          </p>
        </CardContent>
      ) : null}
    </Card>
  );
}

export function InspirationCommentCard({ item }: { item: InspirationCommentItem }) {
  return (
    <Card size="sm" className="h-full ring-border/80">
      <CardHeader className="gap-2">
        <Badge variant="secondary" className="w-fit text-[11px]">
          Comentario · {item.platform}
        </Badge>
        <blockquote className="border-l-2 border-border py-0.5 pl-3 text-[14px] leading-relaxed text-foreground">
          “{item.text}”
        </blockquote>
      </CardHeader>
      <CardContent className="pt-0">
        <a
          href={item.postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground underline underline-offset-3 hover:text-foreground/80"
        >
          Ver post
          <ExternalLink className="size-3" strokeWidth={1.75} />
        </a>
      </CardContent>
    </Card>
  );
}
