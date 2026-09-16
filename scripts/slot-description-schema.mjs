export const SLOT_DESCRIPTION_PROMPT = `Prepará este slot de contenido Mercantis. No escribas copy final, hooks literales para publicar, captions ni propuestas.

Regla madre: LA OPCIÓN DE PRODUCCIÓN DEFINE LA PIEZA. EL FORMATO CREATIVO SE ELIGE DESPUÉS.
- El rol dice qué función editorial cumple la pieza.
- El tema dice de qué área concreta hablamos dentro de ese rol. No predefine el ángulo.
- La opción de producción dice qué pieza concreta hay que fabricar (imagen única, carrusel, Remotion, demo, etc.).
- El formato creativo NO está asignado en el calendario. Hay una lista recomendada ya filtrada por producción.
- La cámara es una restricción dura: sin cámara ≠ sin video. No pedir talking head ni grabación física si la producción es faceless.
- El Mercantis Brain da hechos. No convierte un Remotion faceless en un video a cámara.
- Los tres campos tienen que ser coherentes entre sí y con los formatos creativos permitidos.

Tenés que devolver JSON con exactamente tres campos:

1. editorialDescription — 2 a 4 oraciones en español argentino, prosa continua y amigable.
   - Explicá qué pieza hay que crear y qué intención editorial tiene.
   - Encajá rol, tema, opción de producción, cuenta y cámara.
   - Sin listas, viñetas, guiones largos (—) ni prefijos del tipo "Rol:", "Tema:" o "Formato:".
   - No inventes features, pricing, clientes, métricas, historia, roadmap ni claims.
   - Si un dato no está en el Mercantis Brain citado: no lo completes.

2. structuralSearchBrief — 1 a 3 oraciones EXCLUSIVAMENTE sobre el mecanismo de una ejecución compatible.
   - Hook, beats, ritmo, progresión, payoff y CTA si el tipo de pieza lo pide.
   - Tiene que sonar a un formato creativo de la lista recomendada (screen recording, motion, lista, chat, etc.).
   - PROHIBIDO describir paleta, composición, estética o un walkthrough de producto.
   - PROHIBIDO pedir una persona a cámara si la producción es sin cámara.

3. visualSearchBrief — 1 a 3 oraciones EXCLUSIVAMENTE sobre el lenguaje visual de ESTE tipo de publicación × ESTA producción.
   - Derivá el sujeto visual del tipo de pieza y de un formato creativo permitido, no del tema.
   - Sin cámara: placas, motion (incluida animación tipo Remotion), screen recording, layouts, quotes, ratings, UI (chat, notas, reseñas, Google), B-roll generado. Nadie a cuadro.
   - Cámara permitida: se puede un presentador, pero no es obligatorio.
   - “Pantalla” no significa capturas de Mercantis salvo que el formato sea screen recording.
   - PROHIBIDO hablar del tema comercial salvo que sea visualmente imprescindible.

Usá el menú de ejemplos de producción y la lista de formatos recomendados como familia de caminos. Elegí uno compatible y adaptalo. No copies literal.
No cambies cuenta, rol, tema, tipo de publicación ni restricciones de cámara.
No sugieras talking head, vlog, entrevista o selfie si la producción es sin cámara.
No generes propuestas, ángulos ni copy publicable.
`;

export function buildSlotDescriptionSchema() {
  const stringField = () => ({ type: "STRING" });
  return {
    type: "OBJECT",
    properties: {
      editorialDescription: stringField(),
      structuralSearchBrief: stringField(),
      visualSearchBrief: stringField(),
    },
    required: [
      "editorialDescription",
      "structuralSearchBrief",
      "visualSearchBrief",
    ],
  };
}

function asNonEmptyString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeSlotDescriptionPayload(raw) {
  const payload = {
    editorialDescription: asNonEmptyString(raw?.editorialDescription),
    structuralSearchBrief: asNonEmptyString(raw?.structuralSearchBrief),
    visualSearchBrief: asNonEmptyString(raw?.visualSearchBrief),
  };
  if (
    !payload.editorialDescription ||
    !payload.structuralSearchBrief ||
    !payload.visualSearchBrief
  ) {
    throw new Error("Gemini no devolvió los tres campos requeridos");
  }
  return payload;
}

export function buildSlotDescriptionUserPrompt({
  slotId,
  accountLabel,
  accountId,
  roleLabel,
  roleId,
  roleSummary,
  topicLabel,
  topicId,
  topicSummary,
  pillarLabel,
  pillarId,
  pillarSummary,
  formatLabel,
  formatId,
  formatSummary,
  publicationTypeLabel,
  recommendedCreativeFormats = [],
  formatProductionSection,
  cameraPresenceLabel,
  cameraPresenceConstraint,
  platforms,
  date,
  time,
  editorialConstraints = [],
  brainDocuments = [],
  missingBrainRefs = [],
}) {
  const constraintLines =
    editorialConstraints.length > 0
      ? editorialConstraints.map((item) => `- ${item}`).join("\n")
      : "- Sin restricciones extra.";

  const brainSections =
    brainDocuments.length > 0
      ? brainDocuments
          .map(
            (doc) =>
              `### ${doc.file}\n${String(doc.content || "").trim()}`,
          )
          .join("\n\n")
      : "No se pudieron cargar documentos del Mercantis Brain. No inventes hechos.";

  const missing =
    missingBrainRefs.length > 0
      ? `\nArchivos pedidos pero no encontrados: ${missingBrainRefs.join(", ")}. Tratalos como desconocidos.`
      : "";

  return [
    SLOT_DESCRIPTION_PROMPT.trim(),
    "",
    "## Slot",
    `- ID: ${slotId || "—"}`,
    `- Cuenta: ${accountLabel || accountId || "—"}`,
    `- Fecha: ${date || "—"} · ${time || "—"}`,
    `- Plataformas: ${
      Array.isArray(platforms) && platforms.length > 0
        ? platforms.join(" + ")
        : "—"
    }`,
    `- Rol: ${roleLabel || roleId || "—"}${roleSummary ? ` — ${roleSummary}` : ""}`,
    `- Tema: ${topicLabel || topicId || pillarLabel || pillarId || "—"}${
      topicSummary || pillarSummary ? ` — ${topicSummary || pillarSummary}` : ""
    }`,
    `- Tipo de publicación: ${publicationTypeLabel || "—"}`,
    `- Formatos creativos recomendados: ${
      Array.isArray(recommendedCreativeFormats) &&
      recommendedCreativeFormats.length > 0
        ? recommendedCreativeFormats
            .map((item) => item.label || item.id)
            .join(" · ")
        : formatLabel || formatId || "a definir al desarrollar"
    }${formatSummary ? ` — ${formatSummary}` : ""}`,
    `- Producción / cámara: ${cameraPresenceLabel || "Sin restricción declarada."}`,
    cameraPresenceConstraint ? `- ${cameraPresenceConstraint}` : "",
    "",
    formatProductionSection || "",
    "",
    "## Restricciones editoriales",
    constraintLines,
    "",
    "## Mercantis Brain (solo estos documentos)",
    "Usá únicamente lo que está acá. No asumas el resto del Brain.",
    missing,
    "",
    brainSections,
  ]
    .filter((line) => line !== "")
    .join("\n");
}
