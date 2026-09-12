## Mercantis Brain

Toda ejecución creativa de contenido Mercantis debe consultar `knowledge/mercantis/README.md` y los documentos de dominio citados en el SlotSpec. `MASTER.md` sólo si hace falta contexto transversal.

No inventar features, pricing, clientes, métricas, historia ni roadmap. Si no está en el Brain: desconocido.

El Brain no es una fuente de señal. Es contexto obligatorio, aunque la señal parta de Inspiración o de una dirección manual.

## División de responsabilidades

- **Studio** = especificación. Perfil, slot, matching de inspiración, SlotSpec, estados derivados.
- **Cursor** = desarrollo creativo. Interpretar el spec, adaptar el mecanismo, proponer ángulos, escribir propuestas completas.
- **Usuario** = decisiones y dirección de arte. Elegir referencia, elegir propuesta, ensamblar en Figma.
- **Figma** = ensamblaje final.
- **Buffer** = programación. Nunca publicar al instante salvo pedido explícito.

Cursor **no** decide qué objetivo, pilar, formato, cuenta o frecuencia toca. Eso ya lo preparó el Studio.

## Cómo pedirle cosas al agente

Cuando el usuario dice “desarrollá este slot” o “desarrollá propuestas para este slot”:

1. Leer el SlotSpec (lo copia del sheet o te lo pega).
2. Consultar el Mercantis Brain citado en `brainRefs`.
3. Abrir las referencias si hay `structuralInspirationRef`, `visualInspirationRef` o el legacy `inspirationRef`.
4. Escribir 2–3 `Proposal` en `src/content/proposals.ts` con:
   - `planSlotId`
   - `status: "candidate"`
   - `angleId`, `concept`, `hook`
   - `narrative`, `contentBlocks` (copy por slide/escena), `cta`, `caption`, `visualDirection`
   - `structuralSourceRef` y `visualSourceRef` del spec (y `sourceRef` legacy)
   - `brainRefs` del spec
5. No cambiar rol, pilar, formato, cuenta ni plataformas.
6. No inventar claims.

Ejemplos útiles:

- “Desarrollá propuestas para este slot.”
- “Cambiá el hook de la propuesta seleccionada.”
- “Generá una variante con ángulo dolor.”
- “Generá una imagen 9:16 sin texto para slide 3.”
- “Armá el carrusel en Figma con estas fotos.”
- “Programá el post en Buffer para el martes 16:00.”

## Qué NO hacer

- No volver a decidir cuenta, rol, pilar, formato ni plataformas: eso ya lo fijó Planificación.
- No generar Proposal A/B/C desde la app. El Studio no llama IA ni Cursor.
- No tratar el Brain como fuente alternativa mutuamente excluyente de Inspiración.
- No comunicar roadmap / features no live como disponibles.
- No mezclar imágenes con texto quemado en `assets/` — ahí van solo visuales limpios.
