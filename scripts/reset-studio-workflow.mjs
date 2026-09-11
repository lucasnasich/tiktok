/**
 * Imprime un snippet para pegar en la consola del browser (con el Studio abierto).
 * No toca Inspiración, Competidores ni Imágenes.
 */

const CLEARED = [
  "mercantis-studio:planning-config",
  "mercantis-studio:proposals",
  "mercantis-studio:slot-specs",
  "mercantis-studio:planning-account",
  "mercantis-studio:planning-week-start",
  "mercantis-studio:planning-view",
  "mercantis-studio:planning-mode",
  "mercantis-studio:ideas",
  "mercantis-studio:ideas-tab",
];

const PRESERVED = [
  "mercantis-studio:grid-columns",
  "mercantis-studio:inspiration-source",
  "mercantis-studio:inspiration-view",
  "mercantis-studio:inspiration-format",
  "mercantis-studio:inspiration-overrides",
  "mercantis-studio:competitors-country",
  "mercantis-studio:competitors-sort",
  "mercantis-studio:gallery-mode",
  "mercantis-inspiration-votes",
];

console.log(`Reset del workflow del Studio (browser)

Conserva: ${PRESERVED.join(", ")}

Borrará: ${CLEARED.join(", ")}

Pegá esto en la consola con el Studio abierto y recargá:

${CLEARED.map((key) => `localStorage.removeItem("${key}");`).join("\n")}
location.reload();
`);
