import { creativeInspirations } from "@/content/creative-inspirations";
import { imagePrompts } from "@/content/image-prompts";
import { inspirationMedia } from "@/content/inspiration-media";
import { organicInspirations } from "@/content/organic-inspirations";

export type GalleryAsset = {
  src: string;
  name: string;
  prompt: string | null;
  sourceUrl?: string;
  /** Relación futura con Slot/Proposal. No es un DAM. */
  slotId?: string;
  proposalId?: string;
};

export type GalleryGroup = {
  id: string;
  label: string;
  assets: GalleryAsset[];
};

export type GalleryItem =
  | {
      kind: "group";
      id: string;
      label: string;
      assets: GalleryAsset[];
    }
  | {
      kind: "single";
      id: string;
      asset: GalleryAsset;
    };

export const GALLERY_MODE = {
  creativos: { id: "creativos", label: "Creativos" },
  inspiracion: { id: "inspiracion", label: "Inspiración" },
} as const;

export type GalleryModeId =
  (typeof GALLERY_MODE)[keyof typeof GALLERY_MODE]["id"];

const mercantisModules = import.meta.glob(
  "../../assets/creativos/mercantis/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
) as Record<string, string>;

function slideOrder(path: string): number {
  const match = path.match(/slide-(\d+)/i) ?? path.match(/(\d+)\./);
  return match ? Number(match[1]) : 0;
}

function assetFromPath(path: string, src: string): GalleryAsset {
  const name = path.split("/").at(-1) ?? path;
  return {
    src,
    name,
    prompt: imagePrompts[name] ?? null,
  };
}

function mercantisGroup(): GalleryGroup {
  const assets = Object.entries(mercantisModules)
    .sort(([a], [b]) => slideOrder(a) - slideOrder(b))
    .map(([path, src]) => assetFromPath(path, src));

  return {
    id: "mercantis-carrusel",
    label: "Mercantis — carrusel base",
    assets,
  };
}

function inspirationTitle(id: string): string {
  const creative = creativeInspirations.find((item) => item.id === id);
  if (creative) return creative.title;

  const organic = organicInspirations.find(
    (item) => item.kind === "post" && item.id === id,
  );
  if (organic && organic.kind === "post") return organic.title;

  return id;
}

function inspirationItems(): GalleryItem[] {
  const items: GalleryItem[] = [];

  for (const [id, slides] of Object.entries(inspirationMedia)) {
    const images = slides.filter((slide) => slide.kind === "image");
    if (images.length === 0) continue;

    if (images.length === 1) {
      items.push({
        kind: "single",
        id,
        asset: {
          src: images[0].url,
          name: id,
          prompt: null,
          sourceUrl: images[0].sourceUrl,
        },
      });
      continue;
    }

    items.push({
      kind: "group",
      id,
      label: inspirationTitle(id),
      assets: images.map((slide, index) => ({
        src: slide.url,
        name: `${id}-${String(index + 1).padStart(2, "0")}`,
        prompt: null,
        sourceUrl: slide.sourceUrl,
      })),
    });
  }

  return items;
}

function creativosItems(): GalleryItem[] {
  return [
    {
      kind: "group",
      ...mercantisGroup(),
    },
  ];
}

export function galleryItemsForMode(mode: GalleryModeId): GalleryItem[] {
  return mode === GALLERY_MODE.creativos.id
    ? creativosItems()
    : inspirationItems();
}

export type GalleryRow =
  | { kind: "group"; item: Extract<GalleryItem, { kind: "group" }> }
  | { kind: "singles"; items: Extract<GalleryItem, { kind: "single" }>[] };

/** Agrupa singles consecutivos para mostrarlos en grilla entre carruseles. */
export function galleryRowsForItems(items: GalleryItem[]): GalleryRow[] {
  const rows: GalleryRow[] = [];
  let pendingSingles: Extract<GalleryItem, { kind: "single" }>[] = [];

  function flushSingles() {
    if (pendingSingles.length === 0) return;
    rows.push({ kind: "singles", items: pendingSingles });
    pendingSingles = [];
  }

  for (const item of items) {
    if (item.kind === "single") {
      pendingSingles.push(item);
      continue;
    }

    flushSingles();
    rows.push({ kind: "group", item });
  }

  flushSingles();
  return rows;
}

export function galleryImageCountForItems(items: GalleryItem[]): number {
  return items.reduce(
    (total, item) =>
      total + (item.kind === "group" ? item.assets.length : 1),
    0,
  );
}

export function galleryGroupCountForItems(items: GalleryItem[]): number {
  return items.filter((item) => item.kind === "group").length;
}

export type GalleryLightboxImage = {
  src: string;
  alt?: string;
  sourceUrl?: string;
  groupLabel: string;
  slideIndex: number;
  slideCount: number;
};

export function galleryItemLabel(item: GalleryItem): string {
  return item.kind === "group" ? item.label : inspirationTitle(item.id);
}

export function buildGalleryLightboxCatalog(items: GalleryItem[]) {
  const images: GalleryLightboxImage[] = [];
  const startIndexByItemId: Record<string, number> = {};

  for (const item of items) {
    startIndexByItemId[item.id] = images.length;
    const assets = item.kind === "group" ? item.assets : [item.asset];
    const label = galleryItemLabel(item);

    assets.forEach((asset, assetIndex) => {
      images.push({
        src: asset.src,
        alt: asset.name,
        sourceUrl: asset.sourceUrl,
        groupLabel: label,
        slideIndex: assetIndex + 1,
        slideCount: assets.length,
      });
    });
  }

  return { images, startIndexByItemId };
}
