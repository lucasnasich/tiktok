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
    summary: "El motor genera qué falta producir según configuración.",
    details: `Respondés **qué contenido falta producir** con un generador determinístico.

**Configuración** (\`src/content/planning-accounts.ts\`): por cuenta definís plataformas, posts/día, días activos, horarios, % por rol/pilar/formato, límites de repetición y \`distributionType\` default.

**Calendario**: el motor completa huecos sin tocar piezas manuales o publicadas. Cada **pieza** = un slot con \`platforms[]\` (TikTok + Instagram juntos si aplica).

Planificación decide: **Cuenta → Plataforma → Hora → Rol → Pilar → Formato** (sin ángulo).

**Capas del contenido** (no mezclar):
- **Rol** = para qué publicamos (\`content-roles.ts\`)
- **Pilar** = de qué hablamos (\`planning-pillars.ts\`)
- **Ángulo** = cómo lo contamos (\`angles.ts\`) — se asigna en Idea
- **Formato** = cómo lo mostramos (\`formats.ts\`)

Ejemplos: Alcance → Ventas y atención → Dolor → Captura de chat · Prueba → Automatización e IA → Storytelling → Demo

- Bloque **Qué falta**: brechas vs. configuración real y alertas de variedad.
- \`distributionType\`: \`organic\` (default), \`paid\` o \`boosted\` — preparado para ads.

**Inspiración** corre en paralelo y aporta señales; no reemplaza Planificación.

**Output:** slots listos para convertirse en ideas en la etapa Idea.`,
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
