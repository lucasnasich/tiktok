## Workflow

La documentación interactiva del pipeline vive en el tab **Workflow** del studio.

Pasos: `Planificación → Idea → Producción → Publicación → Métricas`

**Inspiración** y **Mercantis Brain** alimentan Idea en paralelo; no son pasos del pipeline.

La navegación del sidebar, en cambio, muestra primero Inspiración porque es una fuente permanente:

`Inspiración → Planificación → Ideas → Producción`

Planificación decide: Cuenta → Plataforma → Hora → Rol → Pilar → Formato.  
Idea decide: Fuente/señal → Ángulo → Concepto + Hook.

Producción convierte la idea seleccionada en una pieza. Hoy la superficie live es Imágenes.

## Capas del contenido (no mezclar)

| Capa | Pregunta | Source of truth | Quién decide |
|------|----------|-----------------|--------------|
| Rol | ¿Para qué publicamos? | `src/content/content-roles.ts` | Planificación |
| Pilar | ¿De qué hablamos? | `src/content/planning-pillars.ts` | Planificación |
| Formato | ¿Cómo lo mostramos? | `src/content/formats.ts` | Planificación |
| Ángulo | ¿Cómo lo contamos? | `src/content/angles.ts` | Idea |

Ejemplos:
- Alcance → Ventas y atención → Dolor → Captura de chat
- Prueba → Automatización e IA → Storytelling → Demo

Los pilares globales de Mercantis están en `planning-pillars.ts`. Pilares extra por cuenta (ej. `estudiantes` en Study) se definen aparte.

Hechos sobre Mercantis (producto, marca, claims): `knowledge/mercantis/` — no mezclar con taxonomías de `src/content/`.

El detalle de cada paso (qué hace, output, reglas) está en `src/content/workflow-steps.ts` y se muestra en acordeones en la app.

## Reglas de publicación

- **Nunca** publicar al instante por defecto.
- **Nunca** programar a “ahora” ni disparar un post live salvo pedido explícito.
- Default siempre: **draft** o **scheduled** con fecha futura.
