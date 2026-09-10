import {
  ArrowSquareOutIcon,
  CheckIcon,
  CopyIcon,
  ImageIcon,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import { Playground } from "@/components/AppShell";
import { ImageLightbox } from "@/components/ImageLightbox";
import {
  ColumnSelector,
  type ColumnCount,
} from "@/components/ColumnSelector";
import { GalleryModeFilter } from "@/components/gallery/GalleryModeFilter";
import { Button } from "@/components/ui/button";
import { useImageLightbox } from "@/hooks/use-image-lightbox";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { inspirationGridClass } from "@/components/ideas/inspiration-layout";
import {
  buildGalleryLightboxCatalog,
  galleryGroupCountForItems,
  galleryImageCountForItems,
  galleryItemsForMode,
  galleryRowsForItems,
  type GalleryAsset,
  type GalleryItem,
  type GalleryRow,
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
  return `max(15rem, calc((100vw - var(--sidebar-width, 180px)) / ${columns}))`;
}

function GalleryTile({
  asset,
  onOpen,
}: {
  asset: GalleryAsset;
  onOpen: () => void;
}) {
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
      <button
        type="button"
        onClick={onOpen}
        className="block w-full cursor-pointer"
        aria-label="Ver imagen en grande"
      >
        <img
          src={asset.src}
          alt=""
          className="block w-full h-auto"
          draggable={false}
        />
      </button>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black/25 opacity-0 transition-opacity group-hover:opacity-100"
      />

      <div
        className={cn(
          "absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-1.5",
          "opacity-0 group-hover:opacity-100 focus-within:opacity-100",
          showActions && "opacity-100",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {asset.sourceUrl ? (
          <Button
            type="button"
            variant="secondary"
            size="xs"
            aria-label="Abrir origen"
            className="gap-1.5 border-0 bg-black/55 p-1.5 text-[10px] text-white shadow-none hover:bg-black/70"
            asChild
          >
            <a
              href={asset.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ArrowSquareOutIcon className="size-3 shrink-0" />
              <span className="leading-none">Ver origen</span>
            </a>
          </Button>
        ) : null}
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
              <CheckIcon className="size-3 shrink-0" />
            ) : (
              <CopyIcon className="size-3 shrink-0" />
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
            <CheckIcon className="size-3 shrink-0" />
          ) : (
            <ImageIcon className="size-3 shrink-0" />
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
  onOpen,
}: {
  asset: GalleryAsset;
  slideWidth: string;
  onOpen: () => void;
}) {
  return (
    <div className="shrink-0" style={{ width: slideWidth }}>
      <GalleryTile asset={asset} onOpen={onOpen} />
    </div>
  );
}

function GalleryCarouselRow({
  assets,
  slideWidth,
  onOpenImage,
}: {
  assets: GalleryAsset[];
  slideWidth: string;
  onOpenImage: (index: number) => void;
}) {
  return (
    <div className="overflow-x-auto overscroll-x-contain">
      <div className="flex w-max items-start">
        {assets.map((asset, index) => (
          <GallerySlide
            key={asset.src}
            asset={asset}
            slideWidth={slideWidth}
            onOpen={() => onOpenImage(index)}
          />
        ))}
      </div>
    </div>
  );
}

function GalleryGroupRow({
  item,
  columns,
  onOpenImage,
}: {
  item: Extract<GalleryItem, { kind: "group" }>;
  columns: ColumnCount;
  onOpenImage: (itemId: string, index: number) => void;
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
      <GalleryCarouselRow
        assets={item.assets}
        slideWidth={slideWidth}
        onOpenImage={(index) => onOpenImage(item.id, index)}
      />
    </section>
  );
}

function GallerySinglesGrid({
  items,
  columns,
  onOpenImage,
}: {
  items: Extract<GalleryItem, { kind: "single" }>[];
  columns: ColumnCount;
  onOpenImage: (itemId: string, index: number) => void;
}) {
  return (
    <section className="bg-background">
      <div className={cn(inspirationGridClass(columns), "bg-border")}>
        {items.map((item) => (
          <GalleryTile
            key={item.id}
            asset={item.asset}
            onOpen={() => onOpenImage(item.id, 0)}
          />
        ))}
      </div>
    </section>
  );
}

function GalleryRowSection({
  row,
  columns,
  onOpenImage,
}: {
  row: GalleryRow;
  columns: ColumnCount;
  onOpenImage: (itemId: string, index: number) => void;
}) {
  if (row.kind === "singles") {
    return (
      <GallerySinglesGrid
        items={row.items}
        columns={columns}
        onOpenImage={onOpenImage}
      />
    );
  }

  return (
    <GalleryGroupRow
      item={row.item}
      columns={columns}
      onOpenImage={onOpenImage}
    />
  );
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
  const lightbox = useImageLightbox();
  const items = galleryItemsForMode(mode);
  const rows = useMemo(() => galleryRowsForItems(items), [items]);
  const lightboxCatalog = useMemo(
    () => buildGalleryLightboxCatalog(items),
    [items],
  );
  const imageCount = galleryImageCountForItems(items);
  const groupCount = galleryGroupCountForItems(items);

  function openGalleryImage(itemId: string, localIndex: number) {
    const startIndex = lightboxCatalog.startIndexByItemId[itemId];
    if (startIndex === undefined) return;
    lightbox.openAt(lightboxCatalog.images, startIndex + localIndex);
  }

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
          {rows.map((row) => (
            <GalleryRowSection
              key={
                row.kind === "group"
                  ? row.item.id
                  : `singles-${row.items.map((item) => item.id).join("-")}`
              }
              row={row}
              columns={columns}
              onOpenImage={openGalleryImage}
            />
          ))}
        </div>
      )}

      <ImageLightbox
        open={lightbox.open}
        images={lightbox.images}
        index={lightbox.index}
        onClose={lightbox.close}
        onIndexChange={lightbox.setIndex}
      />
    </Playground>
  );
}
