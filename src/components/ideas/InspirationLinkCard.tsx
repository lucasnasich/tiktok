import type { ReactNode } from "react";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";

import {
  InspirationLinkPreview,
  TextPostPreview,
} from "@/components/ideas/InspirationLinkPreview";
import { InspirationMediaBadges } from "@/components/ideas/InspirationMediaBadges";
import { Card } from "@/components/ui/card";
import type {
  InspirationCommentItem,
  InspirationLinkItem,
} from "@/content/inspiration-links";
import { cn } from "@/lib/utils";

const inspirationCardClass = (interactive: boolean) =>
  cn(
    "group/card gap-0 overflow-hidden rounded-none p-0 ring-0",
    interactive && "cursor-pointer transition-colors hover:bg-muted/40",
  );

function inspirationCardHandlers(onOpen?: () => void) {
  return {
    role: onOpen ? ("button" as const) : undefined,
    tabIndex: onOpen ? 0 : undefined,
    onClick: onOpen,
    onKeyDown: onOpen
      ? (event: React.KeyboardEvent) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen();
          }
        }
      : undefined,
  };
}

export function InspirationTextCard({
  platform,
  text,
  author,
  subtitle,
  footer,
  onOpen,
}: {
  platform: string;
  text: string;
  author?: string;
  subtitle?: string;
  footer?: ReactNode;
  onOpen?: () => void;
}) {
  return (
    <Card size="sm" className={inspirationCardClass(Boolean(onOpen))} {...inspirationCardHandlers(onOpen)}>
      <div className="relative overflow-hidden">
        <TextPostPreview postText={text} author={author} platform={platform} />
      </div>
      <div className="px-3 py-2.5">
        {platform ? <InspirationMediaBadges platform={platform} /> : null}
        {subtitle ? (
          <p className="line-clamp-2 pt-1.5 text-[14px] font-medium leading-snug tracking-tight text-foreground">
            {subtitle}
          </p>
        ) : null}
        {footer}
      </div>
    </Card>
  );
}

export function InspirationLinkCard({
  item,
  onOpen,
}: {
  item: InspirationLinkItem;
  onOpen?: () => void;
}) {
  return (
    <Card
      size="sm"
      className={inspirationCardClass(Boolean(onOpen))}
      {...inspirationCardHandlers(onOpen)}
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
        <InspirationMediaBadges platform={item.platform} />
        <p className="line-clamp-2 pt-1.5 text-[14px] font-medium leading-snug tracking-tight text-foreground">
          {item.title}
        </p>
      </div>
    </Card>
  );
}

export function InspirationCommentCard({
  item,
  onOpen,
}: {
  item: InspirationCommentItem;
  onOpen?: () => void;
}) {
  return (
    <InspirationTextCard
      platform={item.platform}
      text={item.text}
      onOpen={onOpen}
      footer={
        <a
          href={item.postUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground underline underline-offset-3 hover:text-foreground/80"
        >
          Ver post
          <ArrowSquareOutIcon className="size-3" />
        </a>
      }
    />
  );
}
