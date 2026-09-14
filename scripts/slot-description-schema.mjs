export const SLOT_DESCRIPTION_PROMPT = `Prepará este slot de contenido Mercantis. No escribas copy final, hooks literales para publicar, captions ni propuestas.

Regla madre: EL FORMATO MANDA SOBRE EL PILAR.
- El pilar dice de qué habla la pieza.
- El formato dice CÓMO está armada (mecanismo narrativo y lenguaje visual).
- La cámara dice con qué producción (sin cara, presentador, o invitado).
- El Mercantis Brain da hechos. No convierte el formato en un demo de producto.
- Los tres campos tienen que ser coherentes entre sí. Si la descripción es un testimonio, los briefs no pueden pedir un tour de la interfaz.

Tenés que devolver JSON con exactamente tres campos:

1. editorialDescription — 2 a 4 oraciones en español argentino, prosa continua y amigable.
   - Explicá qué pieza hay que crear y qué intención editorial tiene.
   - Encajá rol, pilar, formato, cuenta y producción.
   - Sin listas, viñetas, guiones largos (—) ni prefijos del tipo "Rol:", "Pilar:" o "Formato:".
   - No inventes features, pricing, clientes, métricas, historia, roadmap ni claims.
   - Si un dato no está en el Mercantis Brain citado: no lo completes.

2. structuralSearchBrief — 1 a 3 oraciones EXCLUSIVAMENTE sobre el mecanismo del FORMATO.
   - Hook, beats, ritmo, progresión, payoff y CTA si el formato lo pide.
   - Tiene que sonar a ese formato (testimonio = arco de prueba social; tier list = ranking; chat = diálogo; etc.).
   - PROHIBIDO describir paleta, composición, estética o un walkthrough de producto.
   - PROHIBIDO reemplazar el formato por “mostrar la IA / el backoffice / el catálogo” salvo que el formato sea precisamente una captura o un garabato sobre UNA imagen.

3. visualSearchBrief — 1 a 3 oraciones EXCLUSIVAMENTE sobre el lenguaje visual de ESTE formato × ESTA cámara.
   - Derivá el sujeto visual del formato, no del pilar.
   - Sin cámara: placas, motion (incluida animación tipo Remotion), layouts, quotes, ratings, UI del formato (chat, notas, reseñas, Google), B-roll. Nadie a cuadro.
   - En cámara: presentador + overlays del formato.
   - Con invitado: el invitado es el sujeto si el formato es testimonial/prueba social.
   - “Pantalla” no significa capturas de Mercantis. Significa el dispositivo visual del formato.
   - PROHIBIDO hablar del tema comercial salvo que sea visualmente imprescindible.

Usá el menú de ejemplos de producción como familia de caminos. Elegí uno y adaptalo. No copies literal.
No cambies cuenta, rol, pilar, formato ni restricciones de cámara.
No desaconsejes el formato asignado.
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
  pillarLabel,
  pillarId,
  pillarSummary,
  formatLabel,
  formatId,
  formatSummary,
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
    `- Pilar: ${pillarLabel || pillarId || "—"}${
      pillarSummary ? ` — ${pillarSummary}` : ""
    }`,
    `- Formato: ${formatLabel || formatId || "—"}${
      formatSummary ? ` — ${formatSummary}` : ""
    }`,
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
