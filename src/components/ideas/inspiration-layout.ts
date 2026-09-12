import type { ColumnCount } from "@/components/ColumnSelector";
import { cn } from "@/lib/utils";

export function inspirationGridClass(columns: ColumnCount) {
  return cn("grid gap-px bg-border", columns === 3 ? "grid-cols-3" : "grid-cols-4");
}

/** Masonry en columnas para imágenes sueltas (rellena huecos como collage). */
export function galleryCollageClass(columns: ColumnCount) {
  return cn(
    "bg-border [column-gap:1px]",
    columns === 3 ? "columns-3" : "columns-4",
  );
}

export const galleryCollageItemClass = "mb-px break-inside-avoid";

export const inspirationMediaOverlayButtonClass =
  "absolute z-30 flex size-7 items-center justify-center rounded-md bg-black/60 text-white backdrop-blur-[2px] transition-opacity hover:bg-black/75";

export const inspirationMediaOverlayButtonHiddenClass =
  "pointer-events-none opacity-0";
