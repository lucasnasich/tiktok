import { TikTokEmbed, YouTubeEmbed } from "react-social-media-embed";

import { MediaOnlyPreview } from "@/components/ideas/MediaOnlyPreview";
import { Skeleton } from "@/components/ui/skeleton";
import { useContainerWidth } from "@/hooks/use-container-width";
import type { InspirationMediaSlide } from "@/content/inspiration-links";
import {
  getSocialEmbedKind,
  normalizeSocialEmbedUrl,
} from "@/lib/social-embed";

type InspirationLinkPreviewProps = {
  url: string;
  previewImage?: string;
  media?: InspirationMediaSlide[];
  platform: string;
  title: string;
};

const embedStyle = { overflow: "visible", height: "auto" } as const;

export function InspirationLinkPreview({
  url,
  previewImage,
  media,
  platform,
}: InspirationLinkPreviewProps) {
  const embedUrl = normalizeSocialEmbedUrl(url);
  const { ref, width } = useContainerWidth<HTMLDivElement>();
  const embedKind = previewImage || media?.length ? null : getSocialEmbedKind(embedUrl);

  if (media?.length) {
    return <MediaOnlyPreview slides={media} />;
  }

  if (previewImage) {
    return (
      <div
        ref={ref}
        className="flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-muted"
      >
        <img
          src={previewImage}
          alt=""
          className="size-full object-cover"
        />
      </div>
    );
  }

  if (!embedKind) {
    return (
      <div
        ref={ref}
        className="flex aspect-[4/5] w-full items-center justify-center bg-muted"
      >
        <span className="text-[12px] font-medium text-muted-foreground">
          {platform}
        </span>
      </div>
    );
  }

  if (width === 0) {
    return (
      <div ref={ref} className="w-full">
        <Skeleton className="aspect-[4/5] w-full rounded-none" />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="inspiration-social-embed flex w-full justify-center bg-muted"
      onClick={(event) => event.stopPropagation()}
    >
      {embedKind === "tiktok" ? (
        <TikTokEmbed url={embedUrl} width={width} style={embedStyle} />
      ) : null}
      {embedKind === "youtube" ? (
        <YouTubeEmbed
          url={embedUrl}
          width={width}
          height={Math.round(width * 9 / 16)}
          style={embedStyle}
        />
      ) : null}
      {embedKind === "instagram" ? (
        <div className="flex aspect-[4/5] w-full items-center justify-center px-4 text-center">
          <span className="text-[12px] text-muted-foreground">
            Sin media local. Corré{" "}
            <code className="text-[11px]">npm run inspiration:ig -- {"<url>"}</code>
          </span>
        </div>
      ) : null}
    </div>
  );
}
