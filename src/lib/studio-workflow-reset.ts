/** Claves de localStorage que conserva el reset (Inspiración, Competidores, Imágenes). */
export const WORKFLOW_RESET_PRESERVED_KEYS = [
  "mercantis-studio:grid-columns",
  "mercantis-studio:inspiration-source",
  "mercantis-studio:inspiration-view",
  "mercantis-studio:inspiration-format",
  "mercantis-studio:inspiration-overrides",
  "mercantis-studio:competitors-country",
  "mercantis-studio:competitors-sort",
  "mercantis-studio:gallery-mode",
  "mercantis-inspiration-votes",
] as const;

/** Claves que borra el reset del workflow editorial. */
export const WORKFLOW_RESET_CLEARED_KEYS = [
  "mercantis-studio:planning-config",
  "mercantis-studio:proposals",
  "mercantis-studio:slot-specs",
  "mercantis-studio:planning-account",
  "mercantis-studio:planning-week-start",
  "mercantis-studio:planning-view",
  "mercantis-studio:planning-mode",
  "mercantis-studio:ideas",
  "mercantis-studio:ideas-tab",
] as const;

/** Borra el estado del workflow en el browser. No toca Inspiración, Competidores ni Imágenes. */
export function resetWorkflowLocalStorage(): string[] {
  const removed: string[] = [];
  for (const key of WORKFLOW_RESET_CLEARED_KEYS) {
    if (localStorage.getItem(key) !== null) {
      localStorage.removeItem(key);
      removed.push(key);
    }
  }
  return removed;
}
