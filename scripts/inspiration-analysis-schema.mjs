export const ANALYSIS_VERSION = 1;
export const PROMPT_VERSION = 1;
export const ANALYSIS_MODEL = "gemini-2.5-flash";
export const EMBEDDING_MODEL = "gemini-embedding-2";
export const EMBEDDING_DIMENSIONS = 768;

export const ANALYSIS_PROMPT = `Analizá esto como una referencia creativa reutilizable. No quiero solamente saber de qué habla. Necesito entender cómo está construida para poder encontrar slots futuros donde pueda adaptar su estructura o su lenguaje visual.

Reglas:
- No confundas el tema con el mecanismo creativo.
- El tema (de qué habla: cafeterías, un producto, una anécdota) va en content.
- El mecanismo (cómo está armada: hook negativo → demostración rápida → tres ejemplos → giro final) va en structure, aunque Mercantis nunca hable de ese tema.
- Lo visual (composición, sujeto, cámara, movimiento, setting, edición, overlays, ritmo, estética) va en visual, separado de la historia.
- Pensá en cómo un equipo de contenido podría reutilizar ESTA FORMA, no este mensaje.
- Si hay carrusel, respetá el orden de las láminas como una sola pieza.
- Si hay video, mirá imagen y escuchá audio juntos (habla, música, silencios).
- searchDocument debe ser prosa densa, en español, pensada para búsqueda semántica. No es un resumen para humanos: es un documento de retrieval.
- structure.searchDocument describe SOLO el mecanismo narrativo, beats, ritmo, payoff y CTA. Cero estética.
- visual.searchDocument describe SOLO composición, cámara, sujeto, setting, edición, overlays y estética. Cero tema de negocio salvo que sea inseparable de lo que se ve.
- content.semanticSearchDocument cubre tema, audiencia e intención, para no mezclarlo con las otras dos búsquedas.
- beats: secuencia corta y ordenada del desarrollo (3 a 8 ítems).
- reusableMechanism: una frase que se pueda adaptar a otro producto o marca.
- confidence: 0 a 1. Si no hay audio claro, audio baja. Si es una imagen estática, structure puede ser más baja que visual.
- production.cameraPresence: required si hay talking head / persona a cámara como eje; optional si aparece pero no es el mecanismo; none si no hace falta nadie a cámara.
- No inventes texto que no esté en la pieza. Si no hay CTA, decilo.
`;

/** Schema de structured output (sin embeddings ni metadata de pipeline). */
export function buildGeminiResponseSchema() {
  const stringField = () => ({ type: "STRING" });
  const numberField = () => ({ type: "NUMBER" });
  const boolField = () => ({ type: "BOOLEAN" });
  const stringArray = () => ({
    type: "ARRAY",
    items: { type: "STRING" },
  });

  return {
    type: "OBJECT",
    properties: {
      summary: stringField(),
      structure: {
        type: "OBJECT",
        properties: {
          hookType: stringField(),
          openingMechanism: stringField(),
          narrativePattern: stringField(),
          beats: stringArray(),
          pacing: { type: "STRING", enum: ["slow", "medium", "fast"] },
          payoffType: stringField(),
          ctaType: stringField(),
          reusableMechanism: stringField(),
          searchDocument: stringField(),
        },
        required: [
          "hookType",
          "openingMechanism",
          "narrativePattern",
          "beats",
          "pacing",
          "payoffType",
          "ctaType",
          "reusableMechanism",
          "searchDocument",
        ],
      },
      visual: {
        type: "OBJECT",
        properties: {
          mediaMode: stringField(),
          subject: stringField(),
          setting: stringField(),
          composition: stringField(),
          cameraStyle: stringField(),
          cameraMovement: stringField(),
          editingStyle: stringField(),
          textOverlay: stringField(),
          visualRhythm: stringField(),
          visualTone: stringField(),
          reusableMechanism: stringField(),
          searchDocument: stringField(),
        },
        required: [
          "mediaMode",
          "subject",
          "setting",
          "composition",
          "cameraStyle",
          "cameraMovement",
          "editingStyle",
          "textOverlay",
          "visualRhythm",
          "visualTone",
          "reusableMechanism",
          "searchDocument",
        ],
      },
      content: {
        type: "OBJECT",
        properties: {
          topicSummary: stringField(),
          audienceSummary: stringField(),
          intentSummary: stringField(),
          semanticSearchDocument: stringField(),
        },
        required: [
          "topicSummary",
          "audienceSummary",
          "intentSummary",
          "semanticSearchDocument",
        ],
      },
      production: {
        type: "OBJECT",
        properties: {
          cameraPresence: {
            type: "STRING",
            enum: ["required", "optional", "none"],
          },
          complexity: { type: "STRING", enum: ["low", "medium", "high"] },
        },
        required: ["cameraPresence", "complexity"],
      },
      audio: {
        type: "OBJECT",
        properties: {
          hasSpeech: boolField(),
          speechSummary: stringField(),
          musicRole: stringField(),
        },
        required: ["hasSpeech", "speechSummary", "musicRole"],
      },
      confidence: {
        type: "OBJECT",
        properties: {
          structure: numberField(),
          visual: numberField(),
          audio: numberField(),
          overall: numberField(),
        },
        required: ["structure", "visual", "audio", "overall"],
      },
    },
    required: [
      "summary",
      "structure",
      "visual",
      "content",
      "production",
      "audio",
      "confidence",
    ],
  };
}
