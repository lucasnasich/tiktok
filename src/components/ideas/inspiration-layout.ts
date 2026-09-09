/** Contenedor para que el grid responda al ancho del Playground, no solo al viewport. */
export const INSPIRATION_CONTAINER_CLASS = "@container";

/** Hasta 3 columnas cuando el área de contenido lo permite (~640px+). */
export const INSPIRATION_GRID_CLASS =
  "grid grid-cols-1 gap-3 @min-[28rem]:grid-cols-2 @min-[40rem]:grid-cols-3";
