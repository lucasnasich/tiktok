import { angles } from "@/content/angles";
import { contentRoles } from "@/content/content-roles";
import { formats } from "@/content/formats";
import {
  inspirationCreativeMechanisms,
  inspirationSignalTags,
} from "@/content/inspiration-classification-options";
import type { InspirationFeedItem } from "@/content/inspiration-feed";
import { resolveInspirationPlatform } from "@/content/inspiration-browse-filters";
import {
  INSPIRATION_MATERIAL_TYPE_LABELS,
  INSPIRATION_ORIGIN_LABELS,
  INSPIRATION_ORIGINS,
} from "@/content/inspiration-taxonomy";
import { getAllPlanningPillars } from "@/content/planning-pillars";

export type InspirationClassificationNote = {
  contextText?: string;
  hasAudio?: boolean;
  recordedAt?: string;
};

function taxonomyBlock() {
  const pillars = getAllPlanningPillars();
  const lines = [
    "### Tipo (uno)",
    ...(["suggestion", "example"] as const).map(
      (id) => `- \`${id}\`: ${INSPIRATION_MATERIAL_TYPE_LABELS[id]}`,
    ),
    "",
    "### Origen (uno)",
    ...INSPIRATION_ORIGINS.filter((id) => id !== "unknown").map(
      (id) => `- \`${id}\`: ${INSPIRATION_ORIGIN_LABELS[id]}`,
    ),
    "",
    "### Ángulo (uno o más, ids de angles.ts)",
    ...angles.map((a) => `- \`${a.id}\`: ${a.label}`),
    "",
    "### Rol (uno o más)",
    ...contentRoles.map((r) => `- \`${r.id}\`: ${r.label}`),
    "",
    "### Pilar (uno o más)",
    ...pillars.map((p) => `- \`${p.id}\`: ${p.label}`),
    "",
    "### Formato (uno o más, ids de formats.ts)",
    ...formats.map((f) => `- \`${f.id}\`: ${f.label}`),
    "",
    "### Señal (uno o más, signalTagIds)",
    ...inspirationSignalTags.map((t) => `- \`${t.id}\`: ${t.label}`),
    "",
    "### Mecanismo (uno o más, creativeMechanismIds)",
    ...inspirationCreativeMechanisms.map((m) => `- \`${m.id}\`: ${m.label}`),
  ];
  return lines.join("\n");
}

export function formatInspirationReferenceBlock(item: InspirationFeedItem) {
  const platform = resolveInspirationPlatform(item);
  const lines = [
    `- **Key:** \`${item.key}\``,
    `- **Fuente:** ${item.sourceLabel}`,
    `- **Título:** ${item.title}`,
  ];
  if (platform) lines.push(`- **Red:** ${platform}`);
  if (item.url) lines.push(`- **URL:** ${item.url}`);
  if (item.author) lines.push(`- **Autor:** ${item.author}`);
  if (item.note) lines.push(`- **Nota editorial:** ${item.note}`);
  if (item.postText) lines.push(`- **Texto del post:**\n\n${item.postText}`);
  if (item.quote) lines.push(`- **Cita:** ${item.quote}`);
  if (item.media?.length) {
    lines.push(
      `- **Media local:** ${item.media.length} slide(s) (${item.media.map((s) => s.kind).join(", ")})`,
    );
  }
  return lines.join("\n");
}

export function cursorPromptForInspirationClassification(
  item: InspirationFeedItem,
  note?: InspirationClassificationNote,
) {
  const contextParts: string[] = [];
  if (note?.contextText?.trim()) {
    contextParts.push(note.contextText.trim());
  }
  if (note?.hasAudio) {
    contextParts.push(
      "(El usuario grabó un audio con más contexto — adjuntalo en el chat si no está ya. Usalo como fuente principal junto con la referencia.)",
    );
  }

  return [
    "Clasificá esta referencia de inspiración del Content Studio Mercantis.",
    "",
    "Revisá la referencia (preview en el Studio o media local en `assets/inspiracion/media/`).",
    "Usá el contexto del usuario y, si hay audio adjunto, priorizalo.",
    "",
    "Guardá el resultado en `src/content/inspiration-classification-records.ts`:",
    "- Agregá o actualizá la entrada con `key` y `override` completo.",
    "- Incluí `classificationContext` con un resumen corto de lo que dijo el usuario.",
    "- En `override` usá solo ids de la taxonomía de abajo.",
    "- Completá: materialType, origin, angleAffinities, roleAffinities, pillarAffinities, formatAffinities, signalTagIds, creativeMechanismIds.",
    "- También seteá `signal` y `creativeMechanism` como labels unidos con ` · ` (se derivan de los ids).",
    "- Seteá `classifiedAt` en ISO.",
    "",
    "## Referencia",
    formatInspirationReferenceBlock(item),
    "",
    "## Contexto del usuario",
    contextParts.length > 0 ? contextParts.join("\n\n") : "(Sin notas de texto — revisá audio si lo adjuntó.)",
    "",
    "## Taxonomía (solo estos valores)",
    taxonomyBlock(),
  ].join("\n");
}
