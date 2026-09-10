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
    summary: "El perfil se convierte en slots: cuenta, hora, rol, pilar y formato.",
    details: `Respondés **qué contenido falta producir** con un generador determinístico.

**Perfil** (empezando por Mercantis oficial): plataformas, días, cantidad, horarios, mix de roles/pilares/formatos y variedad. Se configura con presets, no todos los días.

**Calendario**: el motor completa huecos sin tocar piezas manuales o publicadas. Cada **pieza** = un slot con \`platforms[]\` (TikTok + Instagram juntos si aplica).

Planificación decide: **Cuenta → Plataforma → Hora → Rol → Pilar → Formato**.

El usuario **no** vuelve a elegir esas variables al trabajar el slot.

Los \`roleTargets\` del perfil gobiernan el mix **semanal**.

Esta planificación es **orgánica**. Ads es una iteración futura distinta.

**Capas del contenido** (no mezclar):
- **Rol** = para qué publicamos (\`content-roles.ts\`)
- **Pilar** = de qué hablamos (\`planning-pillars.ts\`)
- **Ángulo** = cómo lo contamos (\`angles.ts\`) — lo propone Cursor en las Proposals
- **Formato** = cómo lo mostramos (\`formats.ts\`)

**Output:** slots listos para abrir en el SlotDetailSheet.`,
  },
  {
    id: "propuestas",
    title: "Propuestas",
    summary: "El Studio arma el SlotSpec. Cursor desarrolla. El usuario elige.",
    details: `El Studio **no genera** concepto, hook, storytelling ni copy.

Flujo:

1. Abrís un slot (sheet, calendario detrás).
2. El Studio recomienda inspiración compatible.
3. Elegís una referencia (\`Usar esta\`) o una dirección personalizada.
4. El Studio ensambla el **SlotSpec** (misión + Brain + historial + restricciones).
5. \`Preparar para Cursor\` deja el spec en \`ready-for-cursor\`.
6. Le pedís a Cursor: “Desarrollá propuestas para este slot.”
7. Cursor escribe Proposals completas (concepto, hook, narrativa, copy, CTA, caption).
8. Elegís una. Queda lista para ensamblar en Figma.

Mercantis Brain es contexto **obligatorio**, no una fuente de señal.

Una Proposal ya no es solo concepto + hook: puede traer todo el contenido textual de la pieza.

**Output:** propuesta seleccionada lista para ensamblaje.`,
  },
  {
    id: "produccion",
    title: "Producción",
    summary: "Copy de Cursor + visuales + criterio del usuario → creativo.",
    details: `Producción toma la propuesta seleccionada y arma la pieza.

Hoy la superficie implementada es **Imágenes**. Figma es el ensamblaje final: el usuario dirige composición.

**Imágenes:** visuales 9:16 sin texto quemado, listas para Figma.
- Prompts en \`src/content/image-prompts.ts\`.
- Galería del studio: hover → **Copiar prompt**.
- Naming: mercantis-slide-NN-descripcion.png.

Los assets pueden relacionarse más adelante con Slot/Proposal. No hay DAM.

**Output actual:** PNGs por slide y copy listo para Figma.`,
  },
  {
    id: "publicacion",
    title: "Publicación",
    summary: "Programás la pieza con fecha y hora del slot.",
    details: `Buffer es el calendario de publicación. **Nunca publicar al instante** salvo pedido explícito tuyo.

Creativo + caption + plataformas + fecha/hora del Slot = publicación programada.

- Default: **draft** o **scheduled** con fecha futura.
- No programar a “ahora” ni disparar un post live sin que lo pidas con claridad.

**Output:** post programado, no publicado todavía.`,
  },
  {
    id: "metricas",
    title: "Métricas",
    summary: "Después mirás resultados y decidís qué repetir.",
    details: `Recién cuando el post estuvo un tiempo live tiene sentido evaluar.

- Views, saves, shares, comentarios — lo que TikTok muestre para ese formato.
- ¿El hook agarró? ¿La gente llegó al CTA?

**Output:** decisión informada para el próximo ciclo.`,
  },
];

export const INSPIRATION_WORKFLOW_DETAILS = `Inspiración es una **biblioteca**, no un paso previo obligatorio.

Durante el trabajo diario el SlotDetailSheet trae referencias recomendadas. No hace falta ir a Inspiración, memorizar y volver.

Dos dimensiones distintas:

- **Origen**: de dónde viene (competidor, creador, marca, cliente, orgánico, pauta, tendencia, referencia visual, otro).
- **Tipo**: Sugerencia (alguien plantea algo para hacer) o Ejemplo (una pieza real ya publicada).

El matching slot → inspiración es determinístico: compatibilidad + afinidades − uso − recencia − repetición. El Studio aconseja; no bloquea reutilizar.

**Output:** referencias etiquetadas, listas para elegir en el slot.`;

export const BRAIN_WORKFLOW_DETAILS = `El **Mercantis Brain** (\`knowledge/mercantis/\`) es contexto real y **obligatorio**.

No es Inspiración. No es una fuente de señal. No es un paso del pipeline.

Toda ejecución creativa de Cursor consulta el Brain. El SlotSpec incluye \`brainRefs\` y restricciones editoriales.

Antes de desarrollar propuestas:
1. leer el SlotSpec (PlanningSlot + inspiración + historial);
2. consultar \`knowledge/mercantis/README.md\`;
3. abrir **sólo** los documentos citados en el spec;
4. usar \`MASTER.md\` si hay ambigüedad transversal;
5. recién ahí escribir candidatas.

Nunca inventar lo que no esté ahí.`;
