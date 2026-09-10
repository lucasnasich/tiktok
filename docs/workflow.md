## Workflow

La documentación interactiva del pipeline vive en el tab **Workflow** del studio.

Pasos: `Planificación → Idea → Copy → Imágenes → Figma → Buffer → Métricas`

**Inspiración** corre en paralelo al pipeline y alimenta Ideas; no es un paso secuencial.

El detalle de cada paso (qué hace, output, reglas) está en `src/content/workflow-steps.ts` y se muestra en acordeones en la app.

## Reglas de publicación

- **Nunca** publicar al instante por defecto.
- **Nunca** programar a “ahora” ni disparar un post live salvo pedido explícito.
- Default siempre: **draft** o **scheduled** con fecha futura.
