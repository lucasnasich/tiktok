import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { ASSET_PATHS } from "./asset-paths.mjs";
import {
  ANALYSIS_MODEL,
  ANALYSIS_VERSION,
  EMBEDDING_DIMENSIONS,
  EMBEDDING_MODEL,
  PROMPT_VERSION,
} from "./inspiration-analysis-schema.mjs";
import {
  hasLocalMedia,
  listLocalManifest,
} from "./inspiration-media-utils.mjs";
import { readPostMeta } from "./inspiration-source-meta.mjs";

export const HYBRID_WEIGHTS = {
  structure: { semantic: 0.7, affinity: 0.2, usage: 0.1 },
  visual: { semantic: 0.8, affinity: 0.1, usage: 0.1 },
};

export const LOW_CONFIDENCE_PENALTY = 0.12;
export const MATCH_CANDIDATE_LIMIT = 24;
export const MATCH_DISPLAY_LIMIT = 6;

const PACING = new Set(["slow", "medium", "fast"]);
const CAMERA = new Set(["required", "optional", "none"]);
const COMPLEXITY = new Set(["low", "medium", "high"]);

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function cosineSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length === 0 || a.length !== b.length) {
    return 0;
  }
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i += 1) {
    const av = Number(a[i]) || 0;
    const bv = Number(b[i]) || 0;
    dot += av * bv;
    na += av * av;
    nb += bv * bv;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export function hybridScore({
  similarity,
  affinity01,
  usage01,
  confidence,
  weights,
  lowConfidencePenalty = LOW_CONFIDENCE_PENALTY,
}) {
  const semantic = clamp(Number(similarity) || 0, 0, 1);
  const affinity = clamp(Number(affinity01) || 0, 0, 1);
  const usage = clamp(Number(usage01) || 0, 0, 1);
  let score =
    weights.semantic * semantic +
    weights.affinity * affinity +
    weights.usage * usage;
  const conf = clamp(confidence ?? 1, 0, 1);
  score *= 1 - lowConfidencePenalty * (1 - conf);
  return clamp(score, 0, 1);
}

export function compatibilityPercent(score01) {
  return Math.round(clamp(score01, 0, 1) * 100);
}

/** Normaliza el score de afinidad formato/rol/pilar (rango típico -12..80). */
export function normalizeAffinity(rawAffinity) {
  return clamp(((Number(rawAffinity) || 0) + 12) / 92, 0, 1);
}

export function normalizeUsage({ count = 0, recent = false } = {}) {
  if (!count) return 1;
  let value = 1 - Math.min(0.6, count * 0.12);
  if (recent) value -= 0.25;
  return clamp(value, 0, 1);
}

export function cameraVisualAffinity(slotCamera, productionCamera) {
  if (!slotCamera || !productionCamera) return 0.5;
  if (slotCamera === "off-camera" && productionCamera === "required") return 0;
  if (slotCamera === "off-camera" && productionCamera === "none") return 1;
  if (slotCamera === "off-camera" && productionCamera === "optional") return 0.7;
  if (
    (slotCamera === "on-camera" || slotCamera === "needs-guest") &&
    productionCamera === "required"
  ) {
    return 1;
  }
  if (
    (slotCamera === "on-camera" || slotCamera === "needs-guest") &&
    productionCamera === "none"
  ) {
    return 0.4;
  }
  return 0.65;
}

export function buildStructureQuery({
  structuralSearchBrief,
  inspirationSearchBrief,
  editorialDescription,
  formatLabel,
  roleLabel,
  pillarLabel,
  cameraPresenceLabel,
} = {}) {
  const brief = String(
    structuralSearchBrief || inspirationSearchBrief || "",
  ).trim();
  const parts = [];
  if (brief) {
    parts.push(brief, brief);
  }
  if (editorialDescription?.trim()) parts.push(editorialDescription.trim());
  if (formatLabel) parts.push(`Formato: ${formatLabel}`);
  if (roleLabel) parts.push(`Rol: ${roleLabel}`);
  if (pillarLabel) parts.push(`Tema: ${pillarLabel}`);
  if (cameraPresenceLabel) {
    parts.push(`Producción / cámara (si afecta la estructura): ${cameraPresenceLabel}`);
  }
  return parts.join("\n");
}

export function buildVisualQuery({
  visualSearchBrief,
  inspirationSearchBrief,
  formatLabel,
  cameraPresenceLabel,
  visualConstraints,
} = {}) {
  const brief = String(visualSearchBrief || inspirationSearchBrief || "").trim();
  const parts = [];
  if (brief) {
    parts.push(brief, brief);
  }
  if (formatLabel) parts.push(`Formato: ${formatLabel}`);
  if (cameraPresenceLabel) parts.push(`Cámara: ${cameraPresenceLabel}`);
  if (visualConstraints?.trim()) parts.push(visualConstraints.trim());
  return parts.join("\n");
}

export function hashQuery(mode, query) {
  return createHash("sha256")
    .update(String(mode || ""))
    .update("\n")
    .update(String(query || ""))
    .digest("hex");
}

export function shouldSkipAnalysis(existing, {
  mediaFingerprint,
  promptVersion = PROMPT_VERSION,
  model = ANALYSIS_MODEL,
} = {}) {
  if (!existing || typeof existing !== "object") return false;
  if (existing.mediaFingerprint !== mediaFingerprint) return false;
  if (Number(existing.promptVersion) !== Number(promptVersion)) return false;
  if (existing.model !== model) return false;
  const structure = existing.embeddings?.structure;
  return Array.isArray(structure) && structure.length === EMBEDDING_DIMENSIONS;
}

export function fingerprintMedia(dir, promptVersion = PROMPT_VERSION) {
  const hash = createHash("sha256");
  const files = listFingerprintFiles(dir);
  for (const file of files) {
    hash.update(file.name);
    hash.update("\0");
    hash.update(fs.readFileSync(file.abs));
  }
  const meta = readPostMeta(dir);
  if (meta) {
    hash.update("\nmeta:");
    hash.update(JSON.stringify(meta));
  }
  hash.update(`\nprompt:${promptVersion}`);
  return hash.digest("hex");
}

export function listFingerprintFiles(dir) {
  const manifest = listLocalManifest(dir);
  return manifest.map((entry) => ({
    name: path.basename(entry.file),
    abs: entry.file,
    kind: entry.kind,
  }));
}

export function localCaptionContext(dir) {
  const meta = readPostMeta(dir);
  if (!meta || typeof meta !== "object") return "";
  const parts = [
    meta.text,
    meta.caption,
    meta.title,
    meta.author,
    meta.authorName,
    meta.authorHandle ? `@${String(meta.authorHandle).replace(/^@/, "")}` : "",
  ]
    .map((value) => String(value || "").trim())
    .filter(Boolean);
  return parts.join("\n");
}

export function analysisFilePath(dir) {
  return path.join(dir, "analysis.json");
}

export function readAnalysis(dir) {
  const file = analysisFilePath(dir);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

export function writeAnalysis(dir, analysis) {
  fs.writeFileSync(
    analysisFilePath(dir),
    `${JSON.stringify(analysis, null, 2)}\n`,
  );
}

function asString(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asNumber01(value, fallback = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return clamp(number, 0, 1);
}

function asStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string");
}

export function normalizeGeminiPayload(raw) {
  if (!raw || typeof raw !== "object") {
    throw new Error("Gemini no devolvió un objeto estructurado");
  }
  const structure = raw.structure && typeof raw.structure === "object" ? raw.structure : {};
  const visual = raw.visual && typeof raw.visual === "object" ? raw.visual : {};
  const content = raw.content && typeof raw.content === "object" ? raw.content : {};
  const production = raw.production && typeof raw.production === "object" ? raw.production : {};
  const audio = raw.audio && typeof raw.audio === "object" ? raw.audio : {};
  const confidence = raw.confidence && typeof raw.confidence === "object" ? raw.confidence : {};

  const pacing = PACING.has(structure.pacing) ? structure.pacing : "medium";
  const cameraPresence = CAMERA.has(production.cameraPresence)
    ? production.cameraPresence
    : "optional";
  const complexity = COMPLEXITY.has(production.complexity)
    ? production.complexity
    : "medium";

  const normalized = {
    summary: asString(raw.summary),
    structure: {
      hookType: asString(structure.hookType),
      openingMechanism: asString(structure.openingMechanism),
      narrativePattern: asString(structure.narrativePattern),
      beats: asStringArray(structure.beats),
      pacing,
      payoffType: asString(structure.payoffType),
      ctaType: asString(structure.ctaType),
      reusableMechanism: asString(structure.reusableMechanism),
      searchDocument: asString(structure.searchDocument),
    },
    visual: {
      mediaMode: asString(visual.mediaMode),
      subject: asString(visual.subject),
      setting: asString(visual.setting),
      composition: asString(visual.composition),
      cameraStyle: asString(visual.cameraStyle),
      cameraMovement: asString(visual.cameraMovement),
      editingStyle: asString(visual.editingStyle),
      textOverlay: asString(visual.textOverlay),
      visualRhythm: asString(visual.visualRhythm),
      visualTone: asString(visual.visualTone),
      reusableMechanism: asString(visual.reusableMechanism),
      searchDocument: asString(visual.searchDocument),
    },
    content: {
      topicSummary: asString(content.topicSummary),
      audienceSummary: asString(content.audienceSummary),
      intentSummary: asString(content.intentSummary),
      semanticSearchDocument: asString(content.semanticSearchDocument),
    },
    production: {
      cameraPresence,
      complexity,
    },
    audio: {
      hasSpeech: Boolean(audio.hasSpeech),
      speechSummary: asString(audio.speechSummary),
      musicRole: asString(audio.musicRole),
    },
    confidence: {
      structure: asNumber01(confidence.structure, 0.5),
      visual: asNumber01(confidence.visual, 0.5),
      audio: asNumber01(confidence.audio, 0.5),
      overall: asNumber01(confidence.overall, 0.5),
    },
  };

  if (!normalized.structure.searchDocument || !normalized.visual.searchDocument) {
    throw new Error("Faltan searchDocument de structure o visual");
  }

  return normalized;
}

export function listLocalAssetIds(mediaRoot = ASSET_PATHS.inspirationMedia) {
  if (!fs.existsSync(mediaRoot)) return [];
  return fs
    .readdirSync(mediaRoot)
    .filter((name) => {
      if (name.startsWith(".")) return false;
      const dir = path.join(mediaRoot, name);
      return fs.statSync(dir).isDirectory() && hasLocalMedia(dir);
    })
    .sort((a, b) => a.localeCompare(b, "en"));
}

export function collectIntelligenceStatus({
  configured,
  mediaRoot = ASSET_PATHS.inspirationMedia,
} = {}) {
  const ids = listLocalAssetIds(mediaRoot);
  let analyzed = 0;
  for (const id of ids) {
    const analysis = readAnalysis(path.join(mediaRoot, id));
    if (Array.isArray(analysis?.embeddings?.structure)) analyzed += 1;
  }
  return {
    configured: Boolean(configured),
    analyzed,
    pending: Math.max(0, ids.length - analyzed),
  };
}

export function analysisToIndexEntry(assetId, analysis) {
  return {
    assetId,
    analysisVersion: Number(analysis.version) || ANALYSIS_VERSION,
    promptVersion: Number(analysis.promptVersion) || PROMPT_VERSION,
    model: analysis.model || ANALYSIS_MODEL,
    structureSearchDocument: analysis.structure?.searchDocument || "",
    visualSearchDocument: analysis.visual?.searchDocument || "",
    semanticSearchDocument: analysis.content?.semanticSearchDocument || "",
    production: {
      cameraPresence: analysis.production?.cameraPresence || "optional",
      complexity: analysis.production?.complexity || "medium",
    },
    confidence: {
      structure: analysis.confidence?.structure ?? 0.5,
      visual: analysis.confidence?.visual ?? 0.5,
      audio: analysis.confidence?.audio ?? 0.5,
      overall: analysis.confidence?.overall ?? 0.5,
    },
    embeddings: {
      structure: analysis.embeddings?.structure ?? [],
      visual: analysis.embeddings?.visual ?? [],
      semantic: analysis.embeddings?.semantic ?? [],
    },
  };
}

export function buildInspirationIndex(mediaRoot = ASSET_PATHS.inspirationMedia) {
  const entries = [];
  for (const assetId of listLocalAssetIds(mediaRoot)) {
    const analysis = readAnalysis(path.join(mediaRoot, assetId));
    if (!Array.isArray(analysis?.embeddings?.structure)) continue;
    entries.push(analysisToIndexEntry(assetId, analysis));
  }
  return {
    version: ANALYSIS_VERSION,
    generatedAt: new Date().toISOString(),
    embeddingModel: EMBEDDING_MODEL,
    embeddingDimensions: EMBEDDING_DIMENSIONS,
    entries,
  };
}

export function writeInspirationIndex(
  index,
  file = ASSET_PATHS.inspirationIndex,
) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(index)}\n`);
  return file;
}

export function readInspirationIndex(file = ASSET_PATHS.inspirationIndex) {
  if (!fs.existsSync(file)) return { version: ANALYSIS_VERSION, entries: [] };
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!parsed || !Array.isArray(parsed.entries)) {
      return { version: ANALYSIS_VERSION, entries: [] };
    }
    return parsed;
  } catch {
    return { version: ANALYSIS_VERSION, entries: [] };
  }
}

export function rankIndexByEmbedding(index, queryEmbedding, mode, limit = MATCH_CANDIDATE_LIMIT) {
  const key = mode === "visual" ? "visual" : "structure";
  const scored = [];
  for (const entry of index.entries ?? []) {
    const embedding = entry.embeddings?.[key];
    if (!Array.isArray(embedding) || embedding.length === 0) continue;
    scored.push({
      assetId: entry.assetId,
      similarity: cosineSimilarity(queryEmbedding, embedding),
      confidence:
        key === "visual"
          ? entry.confidence?.visual ?? entry.confidence?.overall ?? 0.5
          : entry.confidence?.structure ?? entry.confidence?.overall ?? 0.5,
      production: entry.production,
    });
  }
  scored.sort((a, b) => b.similarity - a.similarity || a.assetId.localeCompare(b.assetId));
  return scored.slice(0, limit);
}

export function selectedInspirationKeys(record) {
  if (!record) return [];
  const keys = [
    record.structuralInspirationRef,
    record.visualInspirationRef,
    record.inspirationRef,
  ].filter((key) => typeof key === "string" && key.length > 0);
  return [...new Set(keys)];
}

export function recordUsesInspiration(record, inspirationKey) {
  if (!record || !inspirationKey) return false;
  return (
    record.inspirationRef === inspirationKey ||
    record.structuralInspirationRef === inspirationKey ||
    record.visualInspirationRef === inspirationKey
  );
}

export function proposalUsesInspiration(proposal, inspirationKey) {
  if (!proposal || !inspirationKey) return false;
  return (
    proposal.sourceRef === inspirationKey ||
    proposal.structuralSourceRef === inspirationKey ||
    proposal.visualSourceRef === inspirationKey
  );
}

export function hasSelectedInspiration(record) {
  return selectedInspirationKeys(record).length > 0;
}

export { ANALYSIS_MODEL, ANALYSIS_VERSION, EMBEDDING_DIMENSIONS, EMBEDDING_MODEL, PROMPT_VERSION };
