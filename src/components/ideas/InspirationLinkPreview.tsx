import { UserIcon } from "@phosphor-icons/react";

import { PlatformIcon } from "@/components/icons/platform-icon";
import { InspirationMediaHoverTarget } from "@/components/ideas/InspirationMediaHoverTarget";
import { MediaOnlyPreview } from "@/components/ideas/MediaOnlyPreview";
import { ImageLightbox } from "@/components/ImageLightbox";
import type { InspirationMediaSlide } from "@/content/inspiration-links";
import { useImageLightbox } from "@/hooks/use-image-lightbox";

type InspirationLinkPreviewProps = {
  url: string;
  previewImage?: string;
  media?: InspirationMediaSlide[];
  platform: string;
  title: string;
  postText?: string;
  author?: string;
};

function MissingMediaFallback({ platform }: { platform: string }) {
  return (
    <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 bg-muted px-4 text-center">
      <span className="text-[12px] font-medium text-muted-foreground">
        {platform}
      </span>
      <span className="text-[12px] leading-relaxed text-muted-foreground">
        Sin media local. Descargá el post con{" "}
        <code className="text-[11px]">npm run inspiration:ig</code>,{" "}
        <code className="text-[11px]">npm run inspiration:tt</code> o{" "}
        <code className="text-[11px]">npm run inspiration:x</code>.
      </span>
    </div>
  );
}

function TextPostPreview({
  postText,
  author,
  platform,
}: {
  postText: string;
  author?: string;
  platform: string;
}) {
  return (
    <div className="flex aspect-[4/5] w-full flex-col bg-muted p-3">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border/70 bg-card">
        <div className="flex items-center gap-1.5 border-b border-border/60 px-3 py-2">
          <PlatformIcon
            platform={platform}
            size={13}
            className="shrink-0 text-muted-foreground"
          />
          <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            Post
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          <blockquote className="border-l-2 border-foreground/15 py-0.5 pl-3">
            <p className="whitespace-pre-wrap text-[13px] leading-[1.65] text-foreground">
              {postText}
            </p>
          </blockquote>
        </div>

        {author ? (
          <footer className="border-t border-border/60 px-3 py-2">
            <div className="flex items-center gap-1.5">
              <UserIcon
                className="size-3 shrink-0 text-muted-foreground"
                weight="duotone"
                aria-hidden
              />
              <p className="truncate text-[11px] font-medium text-muted-foreground">
                {author}
              </p>
            </div>
          </footer>
        ) : null}
      </div>
    </div>
  );
}

export function InspirationLinkPreview({
  url,
  previewImage,
  media,
  platform,
  postText,
  author,
}: InspirationLinkPreviewProps) {
  const lightbox = useImageLightbox();

  if (media?.length) {
    return <MediaOnlyPreview slides={media} postUrl={url} />;
  }

  if (previewImage) {
    return (
      <>
        <div className="flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-muted">
          <InspirationMediaHoverTarget
            onClick={() => lightbox.openAt([{ src: previewImage, kind: "image" }], 0)}
            ariaLabel="Ver imagen en grande"
          >
            <img
              src={previewImage}
              alt=""
              className="size-full object-cover"
            />
          </InspirationMediaHoverTarget>
        </div>
        <ImageLightbox
          open={lightbox.open}
          images={lightbox.images}
          index={lightbox.index}
          onClose={lightbox.close}
          onIndexChange={lightbox.setIndex}
        />
      </>
    );
  }

  if (postText) {
    return (
      <TextPostPreview
        postText={postText}
        author={author}
        platform={platform}
      />
    );
  }

  return <MissingMediaFallback platform={platform} />;
}
