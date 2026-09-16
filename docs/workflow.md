## Workflow

La documentación interactiva del pipeline vive en el tab **Workflow** del studio.

Pasos: `Planificación → Propuestas → Producción → Publicación → Métricas`

**Quién hace qué**

- **Studio** = prepara la especificación (perfil, slot, inspiración recomendada, SlotSpec).
- **Cursor** = desarrollo creativo (ángulo, concepto, hook, narrativa, copy, CTA, caption).
- **Usuario** = elige y dirige el ensamblaje visual.
- **Figma** = ensamblaje final del creativo.
- **Buffer** = publicación/programación.

En una frase: el Studio prepara, Cursor crea, el usuario decide y ensambla.

La navegación del sidebar no cambia:

`Inspiración → Planificación → Propuestas → Producción`

El detalle de entidades (slot, referencia, propuesta) abre en **Sheet** lateral, con el listado/calendario detrás.

Planificación decide: Cuenta → Plataforma → Hora → Rol → Pilar → Formato.  
El SlotSpec combina eso + inspiración elegida + Mercantis Brain.  
Cursor desarrolla las Proposals. El usuario selecciona una.

## Capas del contenido (no mezclar)

| Capa | Pregunta | Source of truth | Quién decide |
|------|----------|-----------------|--------------|
| Rol | ¿Qué mundo editorial cubre esta pieza? | `src/content/content-roles.ts` | Planificación |
| Pilar | ¿De qué hablamos? | `src/content/planning-pillars.ts` | Planificación |
| Formato | ¿Cómo lo mostramos? | `src/content/formats.ts` | Planificación |
| Ángulo | ¿Cómo lo contamos? | `src/content/angles.ts` | Cursor, en la Proposal |

Hechos sobre Mercantis (producto, marca, claims): `knowledge/mercantis/` — contexto obligatorio para Cursor, no una fuente de señal.

El detalle de cada paso está en `src/content/workflow-steps.ts`.

## Reglas de publicación

- **Nunca** publicar al instante por defecto.
- **Nunca** programar a “ahora” ni disparar un post live salvo pedido explícito.
- Default siempre: **draft** o **scheduled** con fecha futura.
