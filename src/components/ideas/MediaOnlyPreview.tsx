import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowSquareOutIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";

import { InspirationMediaHoverTarget } from "@/components/ideas/InspirationMediaHoverTarget";
import { InspirationVideoPlayer } from "@/components/ideas/InspirationVideoPlayer";
import { ImageLightbox } from "@/components/ImageLightbox";
import type { InspirationMediaSlide } from "@/content/inspiration-links";
import { useImageLightbox } from "@/hooks/use-image-lightbox";
import {
  inspirationMediaOverlayButtonClass,
  inspirationMediaOverlayButtonHiddenClass,
} from "@/components/ideas/inspiration-layout";
import type { VideoPlaybackHandoff } from "@/lib/exclusive-video-playback";
import { cn } from "@/lib/utils";

type MediaOnlyPreviewProps = {
  slides: InspirationMediaSlide[];
  className?: string;
  postUrl?: string;
  coverImage?: string;
};

function slideSourceUrl(
  slide: InspirationMediaSlide,
  postUrl?: string,
) {
  return slide.sourceUrl ?? postUrl;
}

function MediaSlide({
  slide,
  coverImage,
  onOpen,
}: {
  slide: InspirationMediaSlide;
  coverImage?: string;
  onOpen?: (playback?: VideoPlaybackHandoff) => void;
}) {
  if (slide.kind === "video") {
    return (
      <InspirationVideoPlayer
        src={slide.url}
        poster={slide.poster ?? coverImage}
        onExpand={(playback) => onOpen?.(playback)}
      />
    );
  }

  return (
    <InspirationMediaHoverTarget onClick={onOpen} ariaLabel="Ver imagen en grande">
      <img
        src={slide.url}
        alt=""
        className="size-full object-cover"
        loading="lazy"
        draggable={false}
      />
    </InspirationMediaHoverTarget>
  );
}

export function MediaOnlyPreview({
  slides,
  className,
  postUrl,
  coverImage,
}: MediaOnlyPreviewProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const lightbox = useImageLightbox();

  function openLightboxAt(
    slideIndex: number,
    playback?: VideoPlaybackHandoff,
  ) {
    const items = slides.map((slide, index) => ({
      src: slide.url,
      kind: slide.kind,
      poster: slide.poster,
      sourceUrl: slideSourceUrl(slide, postUrl),
      ...(index === slideIndex && slide.kind === "video" && playback
        ? { videoPlayback: playback }
        : {}),
    }));
    lightbox.openAt(items, slideIndex);
  }

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (slides.length === 0) return null;

  const currentSourceUrl = slideSourceUrl(slides[selectedIndex], postUrl);

  if (slides.length === 1) {
    const slide = slides[0];
    const sourceUrl = slideSourceUrl(slide, postUrl);

    return (
      <>
        <div
          className={cn(
            "group/preview relative aspect-[4/5] w-full overflow-hidden bg-black",
            className,
          )}
          onClick={(event) => event.stopPropagation()}
        >
          {sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir origen"
              className={cn(
                inspirationMediaOverlayButtonClass,
                inspirationMediaOverlayButtonHiddenClass,
                "top-2.5 right-2.5 group-hover/preview:pointer-events-auto group-hover/preview:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100",
              )}
              onClick={(event) => event.stopPropagation()}
            >
              <ArrowSquareOutIcon className="size-3.5" />
            </a>
          ) : null}
          <MediaSlide
            slide={slide}
            coverImage={coverImage}
            onOpen={(playback) => openLightboxAt(0, playback)}
          />
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

  const canScrollPrev = selectedIndex > 0;
  const canScrollNext = selectedIndex < slides.length - 1;

  return (
    <>
      <div
        className={cn(
          "group/preview relative aspect-[4/5] w-full overflow-hidden bg-black",
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {currentSourceUrl ? (
          <a
            href={currentSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir origen"
            className={cn(
              inspirationMediaOverlayButtonClass,
              inspirationMediaOverlayButtonHiddenClass,
              "top-2.5 right-2.5 group-hover/preview:pointer-events-auto group-hover/preview:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100",
            )}
            onClick={(event) => event.stopPropagation()}
          >
            <ArrowSquareOutIcon className="size-3.5" />
          </a>
        ) : null}
        <div ref={emblaRef} className="size-full overflow-hidden">
          <div className="flex size-full">
            {slides.map((slide, index) => (
              <div
                key={`${slide.url}-${index}`}
                className="min-w-0 shrink-0 grow-0 basis-full"
              >
                <MediaSlide
                  slide={slide}
                  coverImage={coverImage}
                  onOpen={(playback) => openLightboxAt(index, playback)}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="Slide anterior"
          onClick={(event) => {
            event.stopPropagation();
            scrollPrev();
          }}
          disabled={!canScrollPrev}
          className="absolute top-1/2 left-2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity group-hover/preview:opacity-100 disabled:pointer-events-none disabled:opacity-0"
        >
          <CaretLeftIcon className="size-4" />
        </button>

        <button
          type="button"
          aria-label="Slide siguiente"
          onClick={(event) => {
            event.stopPropagation();
            scrollNext();
          }}
          disabled={!canScrollNext}
          className="absolute top-1/2 right-2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity group-hover/preview:opacity-100 disabled:pointer-events-none disabled:opacity-0"
        >
          <CaretRightIcon className="size-4" />
        </button>

        <div className="pointer-events-none absolute inset-x-0 bottom-2 z-10 flex justify-center gap-1.5">
          {slides.map((_, index) => (
            <span
              key={index}
              className={cn(
                "size-1.5 rounded-full bg-white/40 transition-colors",
                index === selectedIndex && "bg-white",
              )}
            />
          ))}
        </div>
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
