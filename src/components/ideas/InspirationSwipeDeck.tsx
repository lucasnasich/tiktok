import { useCallback, useEffect, useRef, useState } from "react";
import { Heart, RotateCcw, X } from "lucide-react";

import { InspirationLinkPreview } from "@/components/ideas/InspirationLinkPreview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InspirationFeedItem } from "@/content/inspiration-feed";
import { useInspirationSwipe } from "@/hooks/use-inspiration-swipe";
import { cn } from "@/lib/utils";

const SWIPE_THRESHOLD = 110;

type InspirationSwipeDeckProps = {
  items: InspirationFeedItem[];
};

function SwipeCardBody({ item }: { item: InspirationFeedItem }) {
  if (item.media?.length || item.url) {
    return (
      <InspirationLinkPreview
        url={item.url ?? ""}
        media={item.media}
        platform={item.platform ?? item.sourceLabel}
        title={item.title}
      />
    );
  }

  if (item.quote) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center bg-muted px-6">
        <blockquote className="text-center text-[18px] leading-relaxed font-medium text-foreground">
          “{item.quote}”
        </blockquote>
      </div>
    );
  }

  return (
    <div className="flex aspect-[4/5] w-full items-center justify-center bg-muted px-4 text-center">
      <span className="text-[13px] text-muted-foreground">{item.title}</span>
    </div>
  );
}

function SwipeCard({
  item,
  style,
  className,
}: {
  item: InspirationFeedItem;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <Card
      size="sm"
      className={cn(
        "absolute inset-0 gap-0 overflow-hidden p-0 ring-border/80 select-none",
        className,
      )}
      style={style}
    >
      <SwipeCardBody item={item} />
      <CardHeader className="gap-2 px-3 pt-3 pb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="text-[11px]">
            {item.sourceLabel}
          </Badge>
          {item.platform ? (
            <Badge variant="outline" className="text-[11px]">
              {item.platform}
            </Badge>
          ) : null}
          {item.typeLabel ? (
            <Badge variant="outline" className="text-[11px]">
              {item.typeLabel}
            </Badge>
          ) : null}
        </div>
        <CardTitle className="text-[15px] leading-snug tracking-tight">
          {item.title}
        </CardTitle>
      </CardHeader>
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

export function InspirationSwipeDeck({ items }: InspirationSwipeDeckProps) {
  const {
    current,
    next,
    vote,
    resetVotes,
    likedCount,
    dislikedCount,
    isComplete,
    progressLabel,
    totalCount,
  } = useInspirationSwipe(items);

  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const activePointerRef = useRef<number | null>(null);

  const commitVote = useCallback(
    (choice: "like" | "dislike") => {
      vote(choice);
      setDragX(0);
      setIsDragging(false);
    },
    [vote],
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!current) return;
    activePointerRef.current = event.pointerId;
    startXRef.current = event.clientX;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || activePointerRef.current !== event.pointerId) return;
    setDragX(event.clientX - startXRef.current);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || activePointerRef.current !== event.pointerId) return;

    if (dragX > SWIPE_THRESHOLD) {
      commitVote("like");
    } else if (dragX < -SWIPE_THRESHOLD) {
      commitVote("dislike");
    } else {
      setDragX(0);
    }

    setIsDragging(false);
    activePointerRef.current = null;
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!current) return;
      if (event.key === "ArrowRight") commitVote("like");
      if (event.key === "ArrowLeft") commitVote("dislike");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [commitVote, current]);

  if (totalCount === 0) {
    return (
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        No hay referencias para revisar en esta fuente.
      </p>
    );
  }

  if (isComplete) {
    return (
      <div className="mx-auto flex max-w-sm flex-col items-center gap-4 py-10 text-center">
        <p className="text-[15px] font-medium text-foreground">
          Revisaste todo el mazo
        </p>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          {likedCount} me gusta · {dislikedCount} no me gusta
        </p>
        <Button variant="outline" size="sm" onClick={resetVotes}>
          <RotateCcw className="size-4" strokeWidth={1.75} />
          Volver a revisar
        </Button>
      </div>
    );
  }

  const rotation = dragX / 20;
  const likeOpacity = Math.min(Math.max(dragX / SWIPE_THRESHOLD, 0), 1);
  const dislikeOpacity = Math.min(Math.max(-dragX / SWIPE_THRESHOLD, 0), 1);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center justify-between text-[12px] text-muted-foreground">
        <span>{progressLabel}</span>
        <span>
          {likedCount} ♥ · {dislikedCount} ✕
        </span>
      </div>

      <div className="relative mx-auto aspect-[3/4] w-full max-w-sm touch-none">
        {next ? (
          <SwipeCard
            item={next}
            className="scale-[0.96] opacity-70"
            style={{ zIndex: 0 }}
          />
        ) : null}

        {current ? (
          <div
            className="absolute inset-0 z-10"
            style={{
              transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
              transition: isDragging ? "none" : "transform 180ms ease-out",
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div
              className="pointer-events-none absolute top-6 left-4 rounded-md border-2 border-emerald-500 px-2 py-1 text-[12px] font-semibold text-emerald-600"
              style={{ opacity: likeOpacity }}
            >
              ME GUSTA
            </div>
            <div
              className="pointer-events-none absolute top-6 right-4 rounded-md border-2 border-rose-500 px-2 py-1 text-[12px] font-semibold text-rose-600"
              style={{ opacity: dislikeOpacity }}
            >
              NO
            </div>
            <SwipeCard item={current} />
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-12 rounded-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          aria-label="No me gusta"
          onClick={() => commitVote("dislike")}
        >
          <X className="size-5" strokeWidth={2} />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-12 rounded-full border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
          aria-label="Me gusta"
          onClick={() => commitVote("like")}
        >
          <Heart className="size-5" strokeWidth={2} />
        </Button>
      </div>

      <p className="text-center text-[12px] text-muted-foreground">
        Arrastrá o usá ← → · También podés tocar los botones
      </p>
    </div>
  );
}
