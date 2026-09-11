import type { InspirationMetaOverride } from "@/lib/inspiration-overrides-store";

export type InspirationClassificationRecord = {
  key: string;
  /** Contexto que dio el usuario al clasificar (texto o resumen del audio). */
  classificationContext?: string;
  override: InspirationMetaOverride;
};

/**
 * Clasificaciones persistidas en repo. Cursor las escribe al procesar cada referencia.
 * Se fusionan con localStorage en `useInspirationOverrides`.
 */
export const inspirationClassificationRecords: InspirationClassificationRecord[] =
  [];
