import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { InspirationMediaSlide } from "@/content/inspiration-links";
import { cn } from "@/lib/utils";

type MediaOnlyPreviewProps = {
  slides: InspirationMediaSlide[];
  className?: string;
};

function MediaSlide({ slide }: { slide: InspirationMediaSlide }) {
  if (slide.kind === "video") {
    return (
      <video
        className="size-full object-cover"
        src={slide.url}
        poster={slide.poster}
        controls
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    <img
      src={slide.url}
      alt=""
      className="size-full object-cover"
      loading="lazy"
      draggable={false}
    />
  );
}

export function MediaOnlyPreview({ slides, className }: MediaOnlyPreviewProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  if (slides.length === 1) {
    return (
      <div
        className={cn(
          "relative aspect-[4/5] w-full overflow-hidden bg-black",
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <MediaSlide slide={slides[0]} />
      </div>
    );
  }

  const canScrollPrev = selectedIndex > 0;
  const canScrollNext = selectedIndex < slides.length - 1;

  return (
    <div
      className={cn(
        "group/preview relative aspect-[4/5] w-full overflow-hidden bg-black",
        className,
      )}
      onClick={(event) => event.stopPropagation()}
    >
      <div ref={emblaRef} className="size-full overflow-hidden">
        <div className="flex size-full">
          {slides.map((slide, index) => (
            <div key={`${slide.url}-${index}`} className="min-w-0 shrink-0 grow-0 basis-full">
              <MediaSlide slide={slide} />
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
        <ChevronLeft className="size-4" strokeWidth={2} />
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
        <ChevronRight className="size-4" strokeWidth={2} />
      </button>

      <div className="absolute inset-x-0 bottom-2 z-10 flex justify-center gap-1.5">
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
  );
}
