import { Check, Copy, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

import { Playground } from "@/components/AppShell";
import {
  ColumnSelector,
  type ColumnCount,
} from "@/components/ColumnSelector";
import { GalleryModeFilter } from "@/components/gallery/GalleryModeFilter";
import { Button } from "@/components/ui/button";
import { usePersistedState } from "@/hooks/use-persisted-state";
import {
  galleryGroupCountForItems,
  galleryImageCountForItems,
  galleryItemsForMode,
  type GalleryAsset,
  type GalleryItem,
} from "@/lib/gallery";
import { copyImageToClipboard } from "@/lib/copy-image-to-clipboard";
import {
  STUDIO_PREFERENCE_DEFAULTS,
  STUDIO_PREFERENCE_KEYS,
  parseGalleryMode,
  parseGridColumns,
} from "@/lib/studio-preferences";
import { cn } from "@/lib/utils";

function gallerySlideWidth(columns: ColumnCount): string {
  return `max(15rem, calc((100vw - var(--sidebar-width, 200px)) / ${columns}))`;
}

function GalleryTile({ asset }: { asset: GalleryAsset }) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [copyImageError, setCopyImageError] = useState(false);

  async function copyPrompt() {
    if (!asset.prompt) return;
    await navigator.clipboard.writeText(asset.prompt);
    setCopiedPrompt(true);
    window.setTimeout(() => setCopiedPrompt(false), 1500);
  }

  async function copyImage() {
    try {
      await copyImageToClipboard(asset.src);
      setCopyImageError(false);
      setCopiedImage(true);
      window.setTimeout(() => setCopiedImage(false), 1500);
    } catch {
      setCopiedImage(false);
      setCopyImageError(true);
      window.setTimeout(() => setCopyImageError(false), 2000);
    }
  }

  const showActions = copiedPrompt || copiedImage || copyImageError;

  return (
    <div className="group relative w-full">
      <img
        src={asset.src}
        alt=""
        className="block w-full h-auto"
        draggable={false}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black/25 opacity-0 transition-opacity group-hover:opacity-100"
      />

      <div
        className={cn(
          "absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-1.5",
          "opacity-0 group-hover:opacity-100 focus-within:opacity-100",
          showActions && "opacity-100",
        )}
      >
        {asset.prompt ? (
          <Button
            type="button"
            variant="secondary"
            size="xs"
            onClick={copyPrompt}
            aria-label="Copiar prompt"
            className="gap-1.5 border-0 bg-black/55 p-1.5 text-[10px] text-white shadow-none hover:bg-black/70"
          >
            {copiedPrompt ? (
              <Check className="size-3 shrink-0" strokeWidth={2} />
            ) : (
              <Copy className="size-3 shrink-0" strokeWidth={2} />
            )}
            <span className="leading-none">
              {copiedPrompt ? "Copiado" : "Copiar prompt"}
            </span>
          </Button>
        ) : null}
        <Button
          type="button"
          variant="secondary"
          size="xs"
          onClick={copyImage}
          aria-label="Copiar imagen"
          className="gap-1.5 border-0 bg-black/55 p-1.5 text-[10px] text-white shadow-none hover:bg-black/70"
        >
          {copiedImage ? (
            <Check className="size-3 shrink-0" strokeWidth={2} />
          ) : (
            <ImageIcon className="size-3 shrink-0" strokeWidth={2} />
          )}
          <span className="leading-none">
            {copyImageError
              ? "No se pudo copiar"
              : copiedImage
                ? "Copiado"
                : "Copiar imagen"}
          </span>
        </Button>
      </div>
    </div>
  );
}

function GallerySlide({
  asset,
  slideWidth,
}: {
  asset: GalleryAsset;
  slideWidth: string;
}) {
  return (
    <div className="shrink-0" style={{ width: slideWidth }}>
      <GalleryTile asset={asset} />
    </div>
  );
}

function GalleryCarouselRow({
  assets,
  slideWidth,
}: {
  assets: GalleryAsset[];
  slideWidth: string;
}) {
  return (
    <div className="overflow-x-auto overscroll-x-contain">
      <div className="flex w-max items-start">
        {assets.map((asset) => (
          <GallerySlide key={asset.src} asset={asset} slideWidth={slideWidth} />
        ))}
      </div>
    </div>
  );
}

function GalleryGroupRow({
  item,
  columns,
}: {
  item: Extract<GalleryItem, { kind: "group" }>;
  columns: ColumnCount;
}) {
  const slideWidth = gallerySlideWidth(columns);

  return (
    <section className="bg-background">
      <p className="border-b border-border bg-muted/40 px-4 py-2 text-[12px] font-medium text-foreground/80">
        {item.label}
        <span className="ml-2 font-normal text-muted-foreground">
          {item.assets.length} slides
        </span>
      </p>
      <GalleryCarouselRow assets={item.assets} slideWidth={slideWidth} />
    </section>
  );
}

function GallerySingleRow({
  item,
  columns,
}: {
  item: Extract<GalleryItem, { kind: "single" }>;
  columns: ColumnCount;
}) {
  const slideWidth = gallerySlideWidth(columns);

  return (
    <section className="bg-background">
      <GalleryCarouselRow assets={[item.asset]} slideWidth={slideWidth} />
    </section>
  );
}

function GalleryItemRow({
  item,
  columns,
}: {
  item: GalleryItem;
  columns: ColumnCount;
}) {
  if (item.kind === "single") {
    return <GallerySingleRow item={item} columns={columns} />;
  }

  return <GalleryGroupRow item={item} columns={columns} />;
}

export function GalleryScreen() {
  const [mode, setMode] = usePersistedState(
    STUDIO_PREFERENCE_KEYS.galleryMode,
    STUDIO_PREFERENCE_DEFAULTS.galleryMode,
    parseGalleryMode,
  );
  const [columns, setColumns] = usePersistedState(
    STUDIO_PREFERENCE_KEYS.gridColumns,
    STUDIO_PREFERENCE_DEFAULTS.gridColumns,
    parseGridColumns,
  );
  const items = galleryItemsForMode(mode);
  const imageCount = galleryImageCountForItems(items);
  const groupCount = galleryGroupCountForItems(items);

  const meta =
    groupCount > 0
      ? `${imageCount} · ${groupCount} series`
      : `${imageCount}`;

  return (
    <Playground
      title="Imágenes"
      meta={meta}
      fullWidth
      actions={
        <div className="flex items-center gap-2">
          <GalleryModeFilter value={mode} onChange={setMode} />
          <ColumnSelector value={columns} onChange={setColumns} />
        </div>
      }
    >
      {items.length === 0 ? (
        <p className="px-5 py-8 text-[14px] text-muted-foreground">
          No hay imágenes en este modo todavía.
        </p>
      ) : (
        <div className="flex flex-col gap-px bg-border">
          {items.map((item) => (
            <GalleryItemRow key={item.id} item={item} columns={columns} />
          ))}
        </div>
      )}
    </Playground>
  );
}
