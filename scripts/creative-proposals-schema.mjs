export const CREATIVE_PROPOSAL_COUNT = 5;

export const CREATIVE_PROPOSALS_SYSTEM_PROMPT = `Generá exactamente cinco propuestas creativas para resolver este slot de contenido Mercantis.

Tu trabajo NO es explicar el slot. El rol, el tema y la opción de producción ya están decididos: son restricciones, no el contenido de la idea.

Pregunta que tenés que responder:
Con esta combinación concreta, ¿qué pieza podemos hacer?

## Libertad
No estás limitado a ninguna biblioteca de formatos creativos.
No uses como muleta: nota de iPhone, captura de chat, pizarra, titular con dato, última hora, tier list, green screen, Reddit, búsqueda de Google ni ningún otro formato de catálogo, salvo que el usuario te los haya pasado explícitamente como orientación.
Podés inventar un mecanismo visual o narrativo que no exista en nuestro catálogo.
Primero creatividad. Después orientación, y sólo si te la pasan.

## Diversidad obligatoria
Las cinco propuestas tienen que ser realmente distintas entre sí.
No sirven cinco variantes de wording del mismo concepto.
Variá ángulo, metáfora, mecanismo visual, estructura, tipo de evidencia, nivel de literalidad y el uso de producto / personas / objetos / texto.
Si las cinco son “una captura con texto distinto”, la generación falló.

## Creatividad
Índice alto. Sentite autorizado a usar metáforas, objetos inesperados, escenas generadas, composiciones editoriales, interfaces ficticias, comparaciones visuales, humor, contraste, exageración visual, recursos de publicidad o editorial y narrativa visual.
Creatividad visual ≠ inventar hechos.

## Hechos
No inventes features, pricing, clientes, métricas, historia, roadmap ni claims.
Si un dato no está en el Mercantis Brain citado, no lo completes: tratalo como desconocido.
Respetá estados live / in-development / planned / vision / internal. Nunca promociones información internal ni roadmap no lanzado.

## Producción
Todas las propuestas tienen que ser fabricables con la opción de producción indicada.
Imagen única = una sola imagen. Carrusel de imágenes = slides estáticos. Carrusel animado = piezas animadas. Remotion = video motion. Demo = pantalla. Video IA = generado. Hablando a cámara = persona física. Cámara + Remotion = persona + motion.
No propongas otra pieza.

## visualConcept
Este campo es el más importante.
Tiene que responder: ¿qué se ve en pantalla?
Describí objetos, personas, pantallas, textos visibles, posiciones, relaciones espaciales y acción.
PROHIBIDO rellenar con estándares globales: “diseño limpio”, “tipografía legible”, “estética moderna”, “composición atractiva”, “representación estilizada”, “paleta consistente con Mercantis”, “buena jerarquía visual”, “mobile first”, “claridad”, “calidad”, “identidad de marca”.
Esos estándares ya existen fuera de la propuesta. visualConcept describe únicamente lo específico de ESTA idea.

## No es copy final
Podés incluir idea de hook, concepto de headline y mensaje central.
NO escribas caption final, guion final, texto definitivo de todos los slides ni prompt final de imagen.

## Campos
title: nombre corto interno para identificar la idea. No tiene que ser el headline publicado.
idea: qué pieza concreta estás proponiendo. No repitas rol + tema + tipo de producción.
angle: el enfoque narrativo particular.
message: qué debería entender una persona al ver la pieza.
visualConcept: qué se ve, en concreto.
structure: cómo se organiza ESTA pieza según la producción (capas de una imagen, slides, beats, flujo de pantallas o beats hablados). Array de pasos, no vacío.
requiredAssets: qué hace falta fabricarla. Si se puede generar por completo, devolvê un array vacío. No inventes assets que no existan.
`;

const PRODUCTION_HARD_CONSTRAINTS = {
  single_image: `Debe resolverse como UNA sola imagen estática. Nada de carrusel, video, demo ni secuencia temporal. structure describe capas o zonas de la misma imagen.`,
  image_carousel: `Debe resolverse como carrusel de imágenes estáticas. Cada ítem de structure es un slide. No video.`,
  animated_carousel: `Debe resolverse como carrusel de piezas animadas o clips cortos. structure es el orden de las piezas.`,
  remotion_video: `Debe resolverse como un video de motion graphics / animación / UI / texto. structure es una secuencia de beats temporales. Nadie a cámara salvo que la producción lo pida.`,
  screen_demo: `Debe resolverse como demo o grabación de pantalla. structure es el flujo de pantallas o acciones.`,
  ai_generated_video: `Debe resolverse como video generado enteramente con IA. structure es beats temporales.`,
  talking_camera: `Debe resolverse con una persona hablando físicamente a cámara. structure es la estructura narrativa hablada.`,
  talking_camera_remotion: `Debe resolverse con persona a cámara combinada con motion, UI u overlays. structure mezcla beats hablados y beats visuales.`,
};

export function productionHardConstraint(productionTypeId) {
  return (
    PRODUCTION_HARD_CONSTRAINTS[productionTypeId] ||
    "Respetá exactamente la opción de producción indicada."
  );
}

export function buildCreativeProposalsSchema() {
  const stringField = () => ({ type: "STRING" });
  const stringArray = () => ({
    type: "ARRAY",
    items: { type: "STRING" },
  });
  return {
    type: "OBJECT",
    properties: {
      proposals: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            title: stringField(),
            idea: stringField(),
            angle: stringField(),
            message: stringField(),
            visualConcept: stringField(),
            structure: stringArray(),
            requiredAssets: stringArray(),
          },
          required: [
            "title",
            "idea",
            "angle",
            "message",
            "visualConcept",
            "structure",
          ],
        },
      },
    },
    required: ["proposals"],
  };
}

function asNonEmptyString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

export function normalizeCreativeProposalDrafts(raw) {
  const list = Array.isArray(raw?.proposals) ? raw.proposals : [];
  const drafts = list.map((item) => ({
    title: asNonEmptyString(item?.title),
    idea: asNonEmptyString(item?.idea),
    angle: asNonEmptyString(item?.angle),
    message: asNonEmptyString(item?.message),
    visualConcept: asNonEmptyString(item?.visualConcept),
    structure: asStringArray(item?.structure),
    requiredAssets: asStringArray(item?.requiredAssets),
  }));
  if (drafts.length !== CREATIVE_PROPOSAL_COUNT) {
    throw new Error(
      `Gemini tenía que devolver ${CREATIVE_PROPOSAL_COUNT} propuestas.`,
    );
  }
  for (const draft of drafts) {
    if (
      !draft.title ||
      !draft.idea ||
      !draft.angle ||
      !draft.message ||
      !draft.visualConcept ||
      draft.structure.length === 0
    ) {
      throw new Error("Gemini devolvió una propuesta incompleta.");
    }
  }
  return drafts;
}

function formatList(items, empty) {
  if (!Array.isArray(items) || items.length === 0) return empty;
  return items.map((item) => `- ${item}`).join("\n");
}

export function buildCreativeProposalsUserPrompt({
  slotId,
  accountLabel,
  accountId,
  roleLabel,
  roleId,
  roleSummary,
  topicLabel,
  topicId,
  topicSummary,
  productionTypeId,
  productionTypeLabel,
  productionTypeSummary,
  productionTypeExample,
  cameraPresenceLabel,
  cameraPresenceConstraint,
  platforms,
  date,
  time,
  editorialConstraints = [],
  brainDocuments = [],
  missingBrainRefs = [],
  generationMode = "free",
  parentProposal,
  guidance,
} = {}) {
  const constraintLines = formatList(
    editorialConstraints,
    "- Sin restricciones extra.",
  );
  const brainSections =
    brainDocuments.length > 0
      ? brainDocuments
          .map((doc) => `### ${doc.file}\n${String(doc.content || "").trim()}`)
          .join("\n\n")
      : "No se pudieron cargar documentos del Mercantis Brain. No inventes hechos.";
  const missing =
    missingBrainRefs.length > 0
      ? `\nArchivos pedidos pero no encontrados: ${missingBrainRefs.join(", ")}. Tratalos como desconocidos.`
      : "";

  const parentSection = parentProposal
    ? [
        "",
        "## Dirección de partida",
        "Esta dirección le interesa al usuario. Explorá cinco maneras diferentes de desarrollar el mismo territorio creativo.",
        "Mantené la idea central. Cambiá composición, ángulo, mecanismo o ejecución.",
        "NO hagas cinco copias cosméticas.",
        `- Título: ${parentProposal.title || "—"}`,
        `- Idea: ${parentProposal.idea || "—"}`,
        `- Ángulo: ${parentProposal.angle || "—"}`,
        `- Mensaje: ${parentProposal.message || "—"}`,
        `- Concepto visual: ${parentProposal.visualConcept || "—"}`,
        `- Estructura: ${
          Array.isArray(parentProposal.structure)
            ? parentProposal.structure.join(" → ")
            : "—"
        }`,
      ]
    : [];

  const formatGuidance =
    Array.isArray(guidance?.creativeFormats) && guidance.creativeFormats.length > 0
      ? guidance.creativeFormats
          .map(
            (item) =>
              `- ${item.label || item.id}${item.summary ? `: ${item.summary}` : ""}`,
          )
          .join("\n")
      : "";
  const inspirationGuidance =
    Array.isArray(guidance?.inspirationRefs) && guidance.inspirationRefs.length > 0
      ? guidance.inspirationRefs
          .map((item) => {
            const bits = [item.title || item.key];
            if (item.signal) bits.push(item.signal);
            if (item.creativeMechanism) bits.push(item.creativeMechanism);
            return `- ${bits.join(" — ")}`;
          })
          .join("\n")
      : "";
  const instruction = String(guidance?.instruction || "").trim();

  const guidanceSection =
    generationMode === "guided"
      ? [
          "",
          "## Orientación (guidance, no camisa de fuerza)",
          "Usá esto como dirección a explorar. No copies. No descartees una idea fuerte sólo porque no encaje en un formato de catálogo.",
          formatGuidance
            ? `Formatos creativos a explorar:\n${formatGuidance}`
            : "Sin formatos creativos elegidos. Seguí en libertad.",
          inspirationGuidance
            ? `Referencias de inspiración (dirección visual/estructural, NO contenido a copiar):\n${inspirationGuidance}`
            : "Sin referencias de inspiración elegidas.",
          instruction ? `Instrucción del usuario: ${instruction}` : "Sin instrucción extra.",
        ]
      : [];

  const modeLine =
    generationMode === "more_like_this"
      ? "Modo: profundizar una dirección. Cinco desarrollos distintos del mismo territorio."
      : generationMode === "guided"
        ? "Modo: generación orientada. La orientación es guía, no restricción dura salvo incompatibilidad productiva."
        : "Modo: generación libre. No uses nuestra biblioteca de formatos creativos.";

  return [
    CREATIVE_PROPOSALS_SYSTEM_PROMPT.trim(),
    "",
    modeLine,
    "",
    "## Slot (restricciones, no el contenido de la idea)",
    `- ID: ${slotId || "—"}`,
    `- Cuenta: ${accountLabel || accountId || "—"}`,
    `- Fecha: ${date || "—"} · ${time || "—"}`,
    `- Plataformas: ${
      Array.isArray(platforms) && platforms.length > 0
        ? platforms.join(" + ")
        : "—"
    }`,
    `- Rol: ${roleLabel || roleId || "—"}${roleSummary ? ` — ${roleSummary}` : ""}`,
    `- Tema: ${topicLabel || topicId || "—"}${topicSummary ? ` — ${topicSummary}` : ""}`,
    `- Producción: ${productionTypeLabel || productionTypeId || "—"}`,
    productionTypeSummary ? `- Qué es esa pieza: ${productionTypeSummary}` : "",
    productionTypeExample ? `- Ejemplo de pieza: ${productionTypeExample}` : "",
    `- Restricción dura de producción: ${productionHardConstraint(productionTypeId)}`,
    `- Cámara: ${cameraPresenceLabel || "Sin restricción declarada."}`,
    cameraPresenceConstraint ? `- ${cameraPresenceConstraint}` : "",
    ...parentSection,
    ...guidanceSection,
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
