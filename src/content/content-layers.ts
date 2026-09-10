/**
 * Capas del contenido — no mezclar.
 * Source of truth de roles: content-roles.ts
 * Source of truth de pilares: planning-pillars.ts
 * Source of truth de ángulos: angles.ts
 * Source of truth de formatos: formats.ts
 */

export type ContentLayerId = "rol" | "pilar" | "angulo" | "formato";

export type ContentLayer = {
  id: ContentLayerId;
  label: string;
  question: string;
  sourceFile: string;
};

export const CONTENT_LAYERS: ContentLayer[] = [
  {
    id: "rol",
    label: "Rol",
    question: "¿Para qué publicamos?",
    sourceFile: "src/content/content-roles.ts",
  },
  {
    id: "pilar",
    label: "Pilar",
    question: "¿De qué hablamos?",
    sourceFile: "src/content/planning-pillars.ts",
  },
  {
    id: "angulo",
    label: "Ángulo",
    question: "¿Cómo lo contamos?",
    sourceFile: "src/content/angles.ts",
  },
  {
    id: "formato",
    label: "Formato",
    question: "¿Cómo lo mostramos?",
    sourceFile: "src/content/formats.ts",
  },
];

export const CONTENT_LAYER_EXAMPLES = [
  "Alcance → Ventas y atención → Dolor → Captura de chat",
  "Prueba → Automatización e IA → Storytelling → Demo",
] as const;
