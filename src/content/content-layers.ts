/**
 * Capas del contenido — no mezclar.
 * Source of truth de roles: content-roles.ts
 * Source of truth de temas por rol: role-topics.ts
 * Source of truth de opciones de producción: production-options.ts
 * Source of truth de ángulos: angles.ts
 * Source of truth de formatos creativos: formats.ts
 */

export type ContentLayerId =
  | "rol"
  | "tema"
  | "tipo_publicacion"
  | "angulo"
  | "formato";

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
    question: "¿Qué función editorial cumple esta pieza?",
    sourceFile: "src/content/content-roles.ts",
  },
  {
    id: "tema",
    label: "Tema",
    question: "¿De qué área concreta hablamos dentro de ese rol?",
    sourceFile: "src/content/role-topics.ts",
  },
  {
    id: "tipo_publicacion",
    label: "Producción",
    question: "¿Qué pieza concreta vamos a fabricar?",
    sourceFile: "src/content/production-options.ts",
  },
  {
    id: "angulo",
    label: "Ángulo",
    question: "¿Cómo lo contamos?",
    sourceFile: "src/content/angles.ts",
  },
  {
    id: "formato",
    label: "Formato creativo",
    question: "¿Cómo ejecutamos la pieza?",
    sourceFile: "src/content/formats.ts",
  },
];

export const CONTENT_LAYER_EXAMPLES = [
  "Educación → Inventario y stock → Imagen única → Dolor → Captura de chat",
  "Producto / Demostración → Stock y variantes → Demo → Storytelling → Screen recording",
] as const;
