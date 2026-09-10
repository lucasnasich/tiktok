import { useCallback, useEffect } from "react";
import {
  ArrowSquareOutIcon,
  CaretLeftIcon,
  CaretRightIcon,
  XIcon,
} from "@phosphor-icons/react";

import { InspirationVideoPlayer } from "@/components/ideas/InspirationVideoPlayer";
import { Button } from "@/components/ui/button";
import type { VideoPlaybackHandoff } from "@/lib/exclusive-video-playback";
import { cn } from "@/lib/utils";

export type LightboxImage = {
  src: string;
  alt?: string;
  kind?: "image" | "video";
  poster?: string;
  videoPlayback?: VideoPlaybackHandoff;
  sourceUrl?: string;
  groupLabel?: string;
  slideIndex?: number;
  slideCount?: number;
};

type ImageLightboxProps = {
  images: LightboxImage[];
  index: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export function ImageLightbox({
  images,
  index,
  open,
  onClose,
  onIndexChange,
}: ImageLightboxProps) {
  const current = images[index];
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) onIndexChange(index - 1);
  }, [hasPrev, index, onIndexChange]);

  const goNext = useCallback(() => {
    if (hasNext) onIndexChange(index + 1);
  }, [hasNext, index, onIndexChange]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, goPrev, goNext]);

  if (!open || !current) return null;

  const positionLabel =
    current.slideIndex && current.slideCount
      ? `${current.slideIndex} / ${current.slideCount}`
      : images.length > 1
        ? `${index + 1} / ${images.length}`
        : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Visor de media"
      onClick={onClose}
    >
      <div className="pointer-events-none absolute top-4 left-4 z-10 flex max-w-[min(24rem,calc(100%-4rem))] flex-col items-start gap-1.5">
        {current.groupLabel ? (
          <p
            className={cn(
              "w-fit max-w-full rounded-md bg-black/55 px-2.5 py-1 text-[14px] font-medium leading-snug text-white backdrop-blur-[2px]",
              "line-clamp-2",
            )}
          >
            {current.groupLabel}
          </p>
        ) : null}
        {positionLabel ? (
          <p className="w-fit rounded-md bg-black/55 px-2.5 py-1 text-[12px] text-white/80 backdrop-blur-[2px]">
            {positionLabel}
          </p>
        ) : null}
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-1">
        {current.sourceUrl ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Abrir origen"
            className="text-white hover:bg-white/10 hover:text-white"
            asChild
          >
            <a
              href={current.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              <ArrowSquareOutIcon className="size-4" />
            </a>
          </Button>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Cerrar visor"
          className="text-white hover:bg-white/10 hover:text-white"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
        >
          <XIcon className="size-5" />
        </Button>
      </div>

      {images.length > 1 ? (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Imagen anterior"
            disabled={!hasPrev}
            className={cn(
              "absolute top-1/2 left-3 z-10 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white",
              !hasPrev && "opacity-0",
            )}
            onClick={(event) => {
              event.stopPropagation();
              goPrev();
            }}
          >
            <CaretLeftIcon className="size-6" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Imagen siguiente"
            disabled={!hasNext}
            className={cn(
              "absolute top-1/2 right-3 z-10 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white",
              !hasNext && "opacity-0",
            )}
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
          >
            <CaretRightIcon className="size-6" />
          </Button>
        </>
      ) : null}

      {current.kind === "video" ? (
        <div
          className="relative h-[min(calc(100vh-2rem),calc((100vw-6rem)*1.25))] w-[min(calc(100vw-6rem),calc((100vh-2rem)*0.8))] max-h-[calc(100vh-2rem)] max-w-[calc(100vw-6rem)]"
          onClick={(event) => event.stopPropagation()}
        >
          <InspirationVideoPlayer
            key={current.src}
            src={current.src}
            poster={current.poster}
            fit="contain"
            initialPlayback={current.videoPlayback}
            className="size-full"
          />
        </div>
      ) : (
        <img
          src={current.src}
          alt={current.alt ?? ""}
          className="max-h-[calc(100vh-2rem)] max-w-[calc(100vw-6rem)] object-contain"
          draggable={false}
          onClick={(event) => event.stopPropagation()}
        />
      )}
    </div>
  );
}
