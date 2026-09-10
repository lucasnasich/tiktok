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
    summary: "El motor genera qué falta producir según el perfil orgánico.",
    details: `Respondés **qué contenido falta producir** con un generador determinístico.

**Configuración**: por cuenta definís plataformas, posts/día, días activos, horarios y % por rol/pilar/formato. Los límites de repetición son internos del motor.

**Calendario**: el motor completa huecos sin tocar piezas manuales o publicadas. Cada **pieza** = un slot con \`platforms[]\` (TikTok + Instagram juntos si aplica).

Planificación decide: **Cuenta → Plataforma → Hora → Rol → Pilar → Formato**.

Los \`roleTargets\` del perfil gobiernan el mix **semanal**. No hay composición fija por día ni alternancia prueba/conversión en un tercer slot.

Esta planificación es **orgánica**. Ads es una iteración futura distinta.

**Capas del contenido** (no mezclar):
- **Rol** = para qué publicamos (\`content-roles.ts\`)
- **Pilar** = de qué hablamos (\`planning-pillars.ts\`)
- **Ángulo** = cómo lo contamos (\`angles.ts\`) — se asigna en Idea
- **Formato** = cómo lo mostramos (\`formats.ts\`)

Ejemplos: Alcance → Ventas y atención → Dolor → Captura de chat · Prueba → Automatización e IA → Storytelling → Demo

- Bloque **Qué falta**: brechas vs. mix semanal del perfil.

**Inspiración** y **Mercantis Brain** alimentan Idea en paralelo; no reemplazan Planificación.

**Output:** slots listos para convertirse en ideas.`,
  },
  {
    id: "idea",
    title: "Idea",
    summary: "Fuente + ángulo → concepto y hook, anclados al slot.",
    details: `Tomás un PlanningSlot y decidís **qué contar**. No volvés a elegir cuenta, público, plataformas, rol, pilar ni formato.

Flujo: Calendario → slot → Crear idea.

Tres fuentes:
- **Inspiración**: una referencia del Studio.
- **Mercantis Brain**: materia prima propia (producto, dolor, historia, founder…).
- **Manual**: una señal o instrucción escrita.

Aunque la fuente inicial sea Inspiración o Manual, el agente consulta el Brain cuando hay que adaptar la idea a hechos reales de Mercantis.

Un slot puede tener varias **candidatas** y una **seleccionada**. El ángulo, el concepto y el hook viven en la idea.

**Output:** idea seleccionada lista para Producción.`,
  },
  {
    id: "produccion",
    title: "Producción",
    summary: "Convierte la idea seleccionada en una pieza.",
    details: `Producción toma la idea seleccionada y arma la pieza. Hoy la superficie implementada es **Imágenes**.

**Imágenes:** visuales 9:16 sin texto quemado, listas para Figma.
- Prompts en \`src/content/image-prompts.ts\`.
- Galería del studio: hover → **Copiar prompt**.
- Naming: mercantis-slide-NN-descripcion.png.

Más adelante esta etapa va a contener Copy, Figma y el armado hacia Buffer. No hay pantallas vacías para esas superficies todavía.

**Output actual:** PNGs por slide, mismo ratio, estilo coherente.`,
  },
  {
    id: "publicacion",
    title: "Publicación",
    summary: "Programás la pieza con fecha y hora acordada.",
    details: `Buffer es el calendario de publicación. **Nunca publicar al instante** salvo pedido explícito tuyo.

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

export const INSPIRATION_WORKFLOW_DETAILS = `Inspiración corre **en paralelo** al pipeline. No es un paso previo obligatorio: alimenta Idea.

En el Studio vive como sección propia, primera del sidebar, con dos subsecciones:

- **Referencias**: biblioteca de posts/ads/links (\`src/content/\`). Listado / Revisar, filtro por fuente y formato, columnas. Media en \`assets/inspiracion/media/\` (local).
- **Competidores**: marcas del mapa competitivo. Filtro país, orden, columnas. Datos en \`competitor-inspirations.ts\`.

**Output:** señales y referencias etiquetadas, listas para una idea.`;

export const BRAIN_WORKFLOW_DETAILS = `El **Mercantis Brain** (\`knowledge/mercantis/\`) es contexto real de la empresa, no un paso del workflow.

Alimenta Idea (y más adelante Copy) con producto, dolores, historia, claims y límites. Consultar \`README.md\` y sólo los documentos de dominio relevantes. Nunca inventar lo que no esté ahí.

Opcionalmente una idea puede guardar \`brainRefs\` (archivos usados como respaldo).`;
