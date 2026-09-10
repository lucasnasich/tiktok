## Workflow

La documentación interactiva del pipeline vive en el tab **Workflow** del studio.

Pasos: `Planificación → Idea → Copy → Imágenes → Figma → Buffer → Métricas`

**Inspiración** corre en paralelo y aporta señales; **Planificación** genera el calendario según `src/content/planning-accounts.ts`. **Idea** define cómo convertir cada slot en contenido (ángulo, hook).

Planificación decide: Cuenta → Plataforma → Hora → Rol → Pilar → Formato.  
Idea decide: Fuente → Señal → Ángulo → Hook.

## Capas del contenido (no mezclar)

| Capa | Pregunta | Source of truth |
|------|----------|-----------------|
| Rol | ¿Para qué publicamos? | `src/content/content-roles.ts` |
| Pilar | ¿De qué hablamos? | `src/content/planning-pillars.ts` |
| Ángulo | ¿Cómo lo contamos? | `src/content/angles.ts` |
| Formato | ¿Cómo lo mostramos? | `src/content/formats.ts` |

Ejemplos:
- Alcance → Ventas y atención → Dolor → Captura de chat
- Prueba → Automatización e IA → Storytelling → Demo

Los pilares globales de Mercantis están en `planning-pillars.ts`. Pilares extra por cuenta (ej. `estudiantes` en Study) se definen aparte.

El detalle de cada paso (qué hace, output, reglas) está en `src/content/workflow-steps.ts` y se muestra en acordeones en la app.

## Reglas de publicación

- **Nunca** publicar al instante por defecto.
- **Nunca** programar a “ahora” ni disparar un post live salvo pedido explícito.
- Default siempre: **draft** o **scheduled** con fecha futura.
