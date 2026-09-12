import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { ASSET_PATHS } from "./asset-paths.mjs";
import {
  ANALYSIS_MODEL,
  ANALYSIS_PROMPT,
  ANALYSIS_VERSION,
  PROMPT_VERSION,
  buildGeminiResponseSchema,
} from "./inspiration-analysis-schema.mjs";
import {
  createGeminiClient,
  deleteGeminiFile,
  embedTexts,
  generateStructuredAnalysis,
  inlineImagePart,
  uploadGeminiFile,
  fileToGeneratePart,
} from "./inspiration-gemini.mjs";
import {
  fingerprintMedia,
  listFingerprintFiles,
  listLocalAssetIds,
  localCaptionContext,
  normalizeGeminiPayload,
  readAnalysis,
  shouldSkipAnalysis,
  writeAnalysis,
} from "./inspiration-intelligence-lib.mjs";
import {
  loadStudioEnv,
  missingGeminiKeyWarning,
  resolveGeminiApiKey,
} from "./load-studio-env.mjs";
import { rebuildInspirationIndex } from "./rebuild-inspiration-index.mjs";

const MAX_INLINE_IMAGE_BYTES = 4_000_000;
const MAX_CAROUSEL_SLIDES = 12;

function parseArgs(argv) {
  let id = "";
  let all = false;
  let force = false;

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--all") {
      all = true;
      continue;
    }
    if (arg === "--force") {
      force = true;
      continue;
    }
    if (arg === "--id" && argv[i + 1]) {
      id = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg.startsWith("--id=")) {
      id = arg.slice(5);
    }
  }

  return { id, all, force };
}

function assetDir(assetId) {
  return path.join(ASSET_PATHS.inspirationMedia, assetId);
}

function extraContextPart(dir, assetId) {
  const caption = localCaptionContext(dir);
  const lines = [
    `assetId: ${assetId}`,
    caption ? `Metadata / caption local:\n${caption}` : "",
  ].filter(Boolean);
  return lines.length > 1 ? { text: lines.join("\n\n") } : { text: `assetId: ${assetId}` };
}

async function mediaParts(ai, dir, assetId) {
  const files = listFingerprintFiles(dir);
  if (files.length === 0) {
    throw new Error("No hay media local para analizar");
  }

  const uploaded = [];
  const parts = [];
  const video = files.find((file) => file.kind === "video");
  const images = files.filter((file) => file.kind === "image");

  try {
    if (video) {
      console.log(`  subiendo video a Gemini Files API…`);
      const file = await uploadGeminiFile(
        ai,
        video.abs,
        `${assetId}-${video.name}`,
      );
      uploaded.push(file);
      parts.push(fileToGeneratePart(file));
    } else {
      const slides = images.slice(0, MAX_CAROUSEL_SLIDES);
      for (const [index, image] of slides.entries()) {
        const size = fs.statSync(image.abs).size;
        if (size > MAX_INLINE_IMAGE_BYTES) {
          const file = await uploadGeminiFile(
            ai,
            image.abs,
            `${assetId}-${image.name}`,
          );
          uploaded.push(file);
          parts.push(fileToGeneratePart(file));
        } else {
          parts.push(inlineImagePart(image.abs));
        }
        if (slides.length > 1) {
          parts.push({
            text: `Lámina ${index + 1} de ${slides.length} (respetar el orden del carrusel).`,
          });
        }
      }
    }

    parts.push(extraContextPart(dir, assetId));
    parts.push({ text: ANALYSIS_PROMPT });
    return { parts, uploaded };
  } catch (error) {
    await Promise.all(uploaded.map((file) => deleteGeminiFile(ai, file)));
    throw error;
  }
}

async function analyzeAsset(ai, assetId, { force = false } = {}) {
  const dir = assetDir(assetId);
  if (!fs.existsSync(dir)) {
    throw new Error(`No existe ${dir}`);
  }

  const mediaFingerprint = fingerprintMedia(dir, PROMPT_VERSION);
  const existing = readAnalysis(dir);
  if (!force && shouldSkipAnalysis(existing, { mediaFingerprint })) {
    return { status: "skipped", assetId };
  }

  const { parts, uploaded } = await mediaParts(ai, dir, assetId);
  try {
    const parsed = await generateStructuredAnalysis(ai, {
      contents: [{ role: "user", parts }],
      schema: buildGeminiResponseSchema(),
    });
    const payload = normalizeGeminiPayload(parsed);
    const [structureEmbedding, visualEmbedding, semanticEmbedding] = await embedTexts(
      ai,
      [
        payload.structure.searchDocument,
        payload.visual.searchDocument,
        payload.content.semanticSearchDocument || payload.summary,
      ],
      { taskType: "RETRIEVAL_DOCUMENT" },
    );

    const analysis = {
      version: ANALYSIS_VERSION,
      promptVersion: PROMPT_VERSION,
      analyzedAt: new Date().toISOString(),
      model: ANALYSIS_MODEL,
      mediaFingerprint,
      ...payload,
      embeddings: {
        structure: structureEmbedding,
        visual: visualEmbedding,
        semantic: semanticEmbedding,
      },
    };
    writeAnalysis(dir, analysis);
    return { status: "analyzed", assetId };
  } finally {
    await Promise.all(uploaded.map((file) => deleteGeminiFile(ai, file)));
  }
}

export async function tryAnalyzeAfterImport(assetId, { force = false } = {}) {
  loadStudioEnv();
  const apiKey = resolveGeminiApiKey();
  if (!apiKey) {
    console.warn(`\n${missingGeminiKeyWarning()}`);
    return { status: "skipped-no-key", assetId };
  }

  try {
    const ai = await createGeminiClient(apiKey);
    console.log(`\nAnalizando ${assetId} con Gemini…`);
    const result = await analyzeAsset(ai, assetId, { force });
    rebuildInspirationIndex();
    if (result.status === "skipped") {
      console.log(`Análisis vigente, no se volvió a gastar API (${assetId}).`);
    } else {
      console.log(`Análisis guardado: assets/inspiracion/media/${assetId}/analysis.json`);
    }
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      `\nReferencia guardada, pero el análisis falló (${assetId}): ${message}\nPodés reintentar con npm run inspiration:analyze -- --id ${assetId}`,
    );
    return { status: "failed", assetId, error: message };
  }
}

async function main() {
  const { id, all, force } = parseArgs(process.argv);
  if (!id && !all) {
    console.error(
      "Uso:\n  npm run inspiration:analyze -- --id tt-123\n  npm run inspiration:analyze -- --all\n  npm run inspiration:analyze -- --all --force",
    );
    process.exit(1);
  }

  loadStudioEnv();
  const apiKey = resolveGeminiApiKey();
  if (!apiKey) {
    if (all) {
      console.warn(
        "Falta GOOGLE_GENERATIVE_AI_API_KEY (o GEMINI_API_KEY) en .env / .env.local.\nNo se analizó nada. Las referencias locales siguen igual.",
      );
    } else {
      console.warn(missingGeminiKeyWarning());
    }
    process.exit(0);
  }

  const ids = all ? listLocalAssetIds() : [id];
  if (ids.length === 0) {
    console.log("No hay media local para analizar.");
    rebuildInspirationIndex();
    return;
  }

  const ai = await createGeminiClient(apiKey);
  let analyzed = 0;
  let skipped = 0;
  let failed = 0;

  for (let index = 0; index < ids.length; index += 1) {
    const assetId = ids[index];
    const prefix = `[${index + 1}/${ids.length}] ${assetId}`;
    try {
      const result = await analyzeAsset(ai, assetId, { force });
      if (result.status === "skipped") {
        skipped += 1;
        console.log(`${prefix} · skipped (fingerprint vigente)`);
      } else {
        analyzed += 1;
        console.log(`${prefix} · analyzed`);
      }
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`${prefix} · failed: ${message}`);
    }
  }

  const { file, count } = rebuildInspirationIndex();
  console.log(
    `\nListo. analyzed=${analyzed} skipped=${skipped} failed=${failed}\nÍndice: ${count} entradas → ${file}`,
  );
}

const invokedDirectly =
  process.argv[1] &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (invokedDirectly) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
