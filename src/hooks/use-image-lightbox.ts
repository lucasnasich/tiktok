import { useCallback, useState } from "react";

import type { LightboxImage } from "@/components/ImageLightbox";

export function useImageLightbox() {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<LightboxImage[]>([]);
  const [index, setIndex] = useState(0);

  const openAt = useCallback((nextImages: LightboxImage[], nextIndex: number) => {
    if (nextImages.length === 0) return;
    setImages(nextImages);
    setIndex(nextIndex);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    open,
    images,
    index,
    openAt,
    close,
    setIndex,
  };
}
