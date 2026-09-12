# Media de inspiración en local

## Estructura de `assets/`

```
assets/
  creativos/mercantis/     # slides propios (en el repo)
  inspiracion/media/       # posts descargados ig-*, tt-*, x-* (local, no repo)
  competidores/logos/      # logos (local, no repo)
  competidores/documentos/ # PDFs (local, no repo)
```

El índice `src/content/inspiration-media.ts` se **genera solo en tu compu** (`npm run inspiration:sync` o automático al hacer `dev`/`build`).

## Qué sí va en git

- Links, títulos y notas en `organic-inspirations.ts` y `creative-inspirations.ts`
- Código del studio y scripts de descarga
- Creativos Mercantis en `assets/creativos/mercantis/`

## Pasar la media a otra compu (pendrive, etc.)

1. Copiá `assets/inspiracion/media/`, `assets/competidores/logos/` y, si aplica, `assets/competidores/documentos/`.
2. En la otra compu: cloná el proyecto y corré `npm install`.
3. Pegá esas carpetas en el mismo path.
4. Corré `npm run inspiration:sync` (o `npm run dev`).

**No hace falta volver a descargar** si los archivos ya están en disco.

## Agregar inspiración nueva

```bash
npm run inspiration:ig -- <url-instagram>
npm run inspiration:tt -- <url-tiktok>
npm run inspiration:x -- <url-x>
```

En X se guardan las imágenes del post y el texto en `post.json` dentro de la carpeta `x-<id>/`.

Si la carpeta ya existe, el script omite la descarga. Para forzar: `--force`.

Después de guardar, el Studio intenta analizar la pieza con Gemini (una sola vez) y escribe en la misma carpeta:

- `analysis.json` — schema versionado + embeddings (lo usa el matching)

Si falta `GOOGLE_GENERATIVE_AI_API_KEY`, la referencia se guarda igual. Después:

```bash
npm run inspiration:analyze -- --id tt-123
npm run inspiration:analyze -- --all
```

El índice local `assets/inspiracion/inspiration-index.json` se regenera sin llamar a Gemini (`npm run inspiration:index` o `predev` / `prebuild`).

## Logos de competidores

```bash
npm run competitor:logo -- minificando-ai ~/Downloads/logo.webp
```

Guarda en `assets/competidores/logos/{id}.webp` (o jpg/png).

## PDFs de competidores

```bash
npm run competitor:pdf -- minificando-ai ~/Downloads/estrategia.pdf
```

Guarda en `assets/competidores/documentos/{id}/documento.pdf`.

En el Studio, competidores vive en **Inspiración → Competidores** (`/inspiracion/competidores`).

