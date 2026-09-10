export type WorkflowStep = {
  id: string;
  title: string;
  summary: string;
  details: string;
};

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "planificacion",
    title: "Planificación",
    summary: "Definís qué falta publicar antes de producir.",
    details: `Respondés **qué contenido falta producir** según targets por cuenta.

- Calendario semanal por cuenta (oficial y satélites).
- Cada slot: fecha, plataformas, **rol** (alcance / valor / prueba / conversión), pilar, formato y estado.
- Bloque **Qué falta**: brechas vs. targets y alertas de variedad (rol, pilar, ángulo, formato).
- \`distributionType\`: \`organic\` (default), \`paid\` o \`boosted\` — preparado para ads, sin integración aún.

**Inspiración** corre en paralelo y alimenta Ideas; no es paso secuencial.

**Output:** slots planificados listos para convertirse en ideas concretas en la etapa Idea.`,
  },
  {
    id: "idea",
    title: "Idea",
    summary: "Señal → ángulo → formato → ficha de la idea.",
    details: `Tomás un slot de planificación (o una señal suelta) y definís **cómo** se convierte en pieza.

- La planificación dice *qué* necesitás; Idea decide el hook, público y ángulo concreto.
- Ficha en \`src/content/ideas.ts\` cuando corresponda.
- Podés vincular \`postId\` en el slot cuando el post ya existe.

**Output:** idea capturada con señal, ángulo, formato creativo y hook.`,
  },
  {
    id: "copy",
    title: "Copy",
    summary: "Hook, slides y CTA — el guion del carrusel o video.",
    details: `Acá se escribe **qué dice cada slide** y en qué orden. TikTok carrusel = secuencia emocional, no feature dump.

- **Hook** (slide 1): tensión o pregunta que frena el scroll.
- **Slides medias:** problema → consecuencia → giro (sin listar features).
- **CTA** (última slide): acción concreta, seca, sin “seguinos para más”.

Editás pidiéndole al agente en Cursor. El copy vive en src/content/ junto a la idea, no hardcodeado solo en Figma.

**Output:** texto por slide listo para maquetar. Sin imágenes todavía.`,
  },
  {
    id: "imagenes",
    title: "Imágenes",
    summary: "Visuales 9:16 sin texto quemado, listas para Figma.",
    details: `Generás o reusás fotos en assets/creativos/mercantis/. **Sin texto en la imagen** — el copy va encima en Figma.

- Prompts en src/content/image-prompts.ts (source of truth).
- Generación con **Cursor GenerateImage** (Nano Banana Pro) o assets ya aprobados.
- Galería del studio: hover → **Copiar prompt** para iterar o regenerar.
- Naming: mercantis-slide-NN-descripcion.png.

**Output:** 1 PNG por slide, mismo ratio, estilo coherente con el carrusel.`,
  },
  {
    id: "figma",
    title: "Figma",
    summary: "Armás el creativo final: layout, tipografía y export.",
    details: `Juntás imágenes + copy en el diseño publicable. Figma es el paso de **maquetación**, no de ideación.

- Importás assets desde assets/.
- Tipografía, overlays, jerarquía y safe zones para TikTok.
- Carrusel = frames ordenados, uno por slide.
- Export final (PNG/JPG o lo que pida la plataforma).

Usá el MCP de Figma antes de pedir trabajo manual. Si hay file o componentes del brand, reusarlos.

**Output:** creativo exportado, pixel-perfect, listo para subir a Buffer.`,
  },
  {
    id: "buffer",
    title: "Buffer",
    summary: "Programás la publicación con fecha y hora acordada.",
    details: `Buffer es el calendario. **Nunca publicar al instante** salvo pedido explícito tuyo.

- Default: **draft** o **scheduled** con fecha futura.
- No programar a “ahora” ni disparar un post live sin que lo pidas con claridad.
- Caption, hashtags y assets desde el export de Figma.
- Canal: TikTok (y otros si aplica).

Usá el MCP de Buffer cuando esté conectado. Si no, dejá el post en draft y programá manual.

**Output:** post programado, no publicado todavía.`,
  },
  {
    id: "metricas",
    title: "Métricas",
    summary: "Después mirás resultados y decidís qué repetir.",
    details: `Recién cuando el post estuvo un tiempo live tiene sentido evaluar.

- Views, saves, shares, comentarios — lo que TikTok muestre para ese formato.
- ¿El hook agarró? ¿La gente llegó al CTA?
- Anotá aprendizajes en la idea o en una nota para el próximo ciclo.

No optimices en caliente el mismo día del lanzamiento salvo que algo esté claramente roto.

**Output:** decisión informada para la siguiente idea (repetir ángulo, cambiar hook, otro CTA).`,
  },
];

export const INSPIRATION_WORKFLOW_DETAILS = `Inspiración corre **en paralelo** al pipeline. No es un paso posterior a Métricas: vas recopilando input mientras producís.

**Qué es:** señales reales que pueden convertirse en ideas — dolores de clientes, posts orgánicos, referencias creativas, ads de competidores, tendencias, datos propios.

**Cómo se usa:** filtrás por fuente, revisás referencias y las llevás a Ideas cuando aparece un ángulo. No hace falta “cerrar” inspiración antes de escribir copy.

**Dónde vive:** pantalla **Inspiración** del studio y archivos en \`src/content/\`. La media descargada queda en \`assets/inspiracion/media/\` (local).

**Output:** biblioteca de referencias etiquetadas por fuente, lista para alimentar la etapa de Idea.`;
