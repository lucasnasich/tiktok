import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  ANALYSIS_MODEL,
  PROMPT_VERSION,
} from "./inspiration-analysis-schema.mjs";
import {
  buildStructureQuery,
  buildVisualQuery,
  cameraVisualAffinity,
  collectIntelligenceStatus,
  compatibilityPercent,
  cosineSimilarity,
  fingerprintMedia,
  hasSelectedInspiration,
  hybridScore,
  HYBRID_WEIGHTS,
  normalizeAffinity,
  normalizeUsage,
  proposalUsesInspiration,
  rankIndexByEmbedding,
  recordUsesInspiration,
  selectedInspirationKeys,
  shouldSkipAnalysis,
} from "./inspiration-intelligence-lib.mjs";
import { missingGeminiKeyWarning, resolveGeminiApiKey } from "./load-studio-env.mjs";

function isSpecReadyForCursor(record) {
  if (!record) return false;
  if (record.status !== "ready-for-cursor") return false;
  if (record.directionKind === "inspiration") {
    return hasSelectedInspiration(record);
  }
  return Boolean(record.signal?.trim());
}

// --- cosine ---
assert.equal(cosineSimilarity([1, 0], [1, 0]), 1);
assert.equal(cosineSimilarity([1, 0], [0, 1]), 0);
assert.ok(cosineSimilarity([1, 1], [1, 0]) > 0.7);
assert.equal(cosineSimilarity([], [1]), 0);
assert.equal(cosineSimilarity([1, 0], [1]), 0);

// --- hybrid ranking ---
const structureGood = hybridScore({
  similarity: 0.9,
  affinity01: 0.5,
  usage01: 1,
  confidence: 1,
  weights: HYBRID_WEIGHTS.structure,
});
const structureWeakSemantic = hybridScore({
  similarity: 0.2,
  affinity01: 1,
  usage01: 1,
  confidence: 1,
  weights: HYBRID_WEIGHTS.structure,
});
assert.ok(
  structureGood > structureWeakSemantic,
  "la similitud semántica tiene que dominar el ranking estructural",
);

const visualGood = hybridScore({
  similarity: 0.85,
  affinity01: 0.2,
  usage01: 0.2,
  confidence: 1,
  weights: HYBRID_WEIGHTS.visual,
});
const visualKeywordHeavy = hybridScore({
  similarity: 0.2,
  affinity01: 1,
  usage01: 1,
  confidence: 1,
  weights: HYBRID_WEIGHTS.visual,
});
assert.ok(visualGood > visualKeywordHeavy, "visual: embedding > afinidad/uso");

const lowConfidence = hybridScore({
  similarity: 0.9,
  affinity01: 0.5,
  usage01: 1,
  confidence: 0.2,
  weights: HYBRID_WEIGHTS.structure,
});
assert.ok(lowConfidence < structureGood, "baja confidence penaliza el match");
assert.equal(compatibilityPercent(1), 100);
assert.equal(compatibilityPercent(0.724), 72);

assert.ok(normalizeAffinity(80) > normalizeAffinity(0));
assert.equal(normalizeUsage({ count: 0 }), 1);
assert.ok(normalizeUsage({ count: 3, recent: true }) < normalizeUsage({ count: 1, recent: false }));
assert.equal(cameraVisualAffinity("off-camera", "required"), 0);
assert.equal(cameraVisualAffinity("off-camera", "none"), 1);

// --- queries structure vs visual ---
const structureQuery = buildStructureQuery({
  structuralSearchBrief: "Hook negativo y tres beats con payoff de giro.",
  inspirationSearchBrief: "fallback legacy de búsqueda",
  editorialDescription: "Enseñar postventa sin vender el producto.",
  formatLabel: "X razones",
  roleLabel: "Educación",
  pillarLabel: "Clientes",
  cameraPresenceLabel: "Sin cámara",
});
const visualQuery = buildVisualQuery({
  visualSearchBrief: "Placas tipográficas, sin talking head, ritmo de corte rápido.",
  inspirationSearchBrief: "fallback legacy de búsqueda",
  formatLabel: "X razones",
  cameraPresenceLabel: "Sin cámara",
  visualConstraints: "Nadie sale a cámara.",
});

assert.ok(structureQuery.includes("Hook negativo"));
assert.ok(
  structureQuery.indexOf("Hook negativo") !== structureQuery.lastIndexOf("Hook negativo"),
  "el brief estructural se pondera repitiéndolo",
);
assert.ok(structureQuery.includes("Enseñar postventa"));
assert.ok(structureQuery.includes("Rol: Educación"));
assert.ok(structureQuery.includes("Tema: Clientes"));
assert.ok(!visualQuery.includes("Enseñar postventa"), "visual no mete el tema editorial");
assert.ok(!visualQuery.includes("Rol: Educación"), "visual no mete el rol");
assert.ok(visualQuery.includes("Placas tipográficas"));
assert.ok(visualQuery.includes("Cámara: Sin cámara"));

const legacyStructure = buildStructureQuery({
  inspirationSearchBrief: "Buscá tier lists sin cámara.",
  formatLabel: "Tier list",
});
assert.ok(legacyStructure.includes("tier lists"), "fallback legacy al brief único");

// --- API key fallback ---
assert.equal(resolveGeminiApiKey({}), "");
assert.equal(
  resolveGeminiApiKey({ GOOGLE_GENERATIVE_AI_API_KEY: "abc" }),
  "abc",
);
assert.equal(
  resolveGeminiApiKey({ GEMINI_API_KEY: "xyz" }),
  "xyz",
);
assert.equal(
  resolveGeminiApiKey({
    GOOGLE_GENERATIVE_AI_API_KEY: "first",
    GEMINI_API_KEY: "second",
  }),
  "first",
);
assert.equal(resolveGeminiApiKey({ VITE_GOOGLE_GENERATIVE_AI_API_KEY: "no" }), "");
assert.match(missingGeminiKeyWarning(), /GOOGLE_GENERATIVE_AI_API_KEY/);

// --- fingerprint / skip ---
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "insp-intel-"));
const assetDir = path.join(tmp, "tt-1");
fs.mkdirSync(assetDir);
fs.writeFileSync(path.join(assetDir, "01.jpg"), Buffer.from([0xff, 0xd8, 0xff, 0x00, 0x01]));
const fp1 = fingerprintMedia(assetDir, PROMPT_VERSION);
const fp2 = fingerprintMedia(assetDir, PROMPT_VERSION);
assert.equal(fp1, fp2);
const fpPrompt = fingerprintMedia(assetDir, PROMPT_VERSION + 1);
assert.notEqual(fp1, fpPrompt);

const existing = {
  mediaFingerprint: fp1,
  promptVersion: PROMPT_VERSION,
  model: ANALYSIS_MODEL,
  embeddings: { structure: Array.from({ length: 768 }, () => 0.1) },
};
assert.equal(shouldSkipAnalysis(existing, { mediaFingerprint: fp1 }), true);
assert.equal(
  shouldSkipAnalysis(existing, { mediaFingerprint: fp1, force: false, promptVersion: 99 }),
  false,
);
fs.writeFileSync(path.join(assetDir, "01.jpg"), Buffer.from([0xff, 0xd8, 0xff, 0x00, 0x02]));
const fpChanged = fingerprintMedia(assetDir, PROMPT_VERSION);
assert.notEqual(fp1, fpChanged);
assert.equal(shouldSkipAnalysis(existing, { mediaFingerprint: fpChanged }), false);
assert.equal(shouldSkipAnalysis(null, { mediaFingerprint: fp1 }), false);

const statusEmpty = collectIntelligenceStatus({
  configured: false,
  mediaRoot: tmp,
});
assert.equal(statusEmpty.configured, false);
assert.equal(statusEmpty.analyzed, 0);
assert.equal(statusEmpty.pending, 1);

// --- index fallback without analysis ---
const rankedEmpty = rankIndexByEmbedding({ entries: [] }, [0.1, 0.2], "structure", 6);
assert.deepEqual(rankedEmpty, []);

const ranked = rankIndexByEmbedding(
  {
    entries: [
      {
        assetId: "tt-a",
        embeddings: { structure: [1, 0], visual: [0, 1] },
        confidence: { structure: 0.9, visual: 0.4 },
        production: { cameraPresence: "none" },
      },
      {
        assetId: "tt-b",
        embeddings: { structure: [0, 1], visual: [1, 0] },
        confidence: { structure: 0.5, visual: 0.9 },
        production: { cameraPresence: "required" },
      },
    ],
  },
  [1, 0],
  "structure",
  6,
);
assert.equal(ranked[0].assetId, "tt-a");
const rankedVisual = rankIndexByEmbedding(
  {
    entries: [
      {
        assetId: "tt-a",
        embeddings: { structure: [1, 0], visual: [0, 1] },
        confidence: { structure: 0.9, visual: 0.4 },
      },
      {
        assetId: "tt-b",
        embeddings: { structure: [0, 1], visual: [1, 0] },
        confidence: { structure: 0.5, visual: 0.9 },
      },
    ],
  },
  [1, 0],
  "visual",
  6,
);
assert.equal(rankedVisual[0].assetId, "tt-b", "mode visual usa el embedding visual");

// --- legacy inspirationRef + dual refs + usage ---
const legacyRecord = {
  slotId: "s1",
  directionKind: "inspiration",
  inspirationRef: "creativo:ig-1",
  status: "ready-for-cursor",
};
assert.deepEqual(selectedInspirationKeys(legacyRecord), ["creativo:ig-1"]);
assert.equal(hasSelectedInspiration(legacyRecord), true);
assert.equal(isSpecReadyForCursor(legacyRecord), true);
assert.equal(recordUsesInspiration(legacyRecord, "creativo:ig-1"), true);

const dualRecord = {
  slotId: "s2",
  directionKind: "inspiration",
  structuralInspirationRef: "organico:tt-1",
  visualInspirationRef: "creativo:ig-2",
  status: "ready-for-cursor",
};
assert.equal(hasSelectedInspiration(dualRecord), true);
assert.equal(recordUsesInspiration(dualRecord, "organico:tt-1"), true);
assert.equal(recordUsesInspiration(dualRecord, "creativo:ig-2"), true);
assert.equal(recordUsesInspiration(dualRecord, "creativo:ig-1"), false);
assert.equal(
  isSpecReadyForCursor({
    directionKind: "inspiration",
    structuralInspirationRef: "organico:tt-1",
    status: "ready-for-cursor",
  }),
  true,
  "una sola referencia alcanza para Cursor",
);
assert.equal(
  isSpecReadyForCursor({
    directionKind: "inspiration",
    status: "ready-for-cursor",
  }),
  false,
);
assert.equal(
  isSpecReadyForCursor({
    directionKind: "manual",
    signal: "mostrar el caos del stock",
    status: "ready-for-cursor",
  }),
  true,
);

const proposal = {
  sourceRef: "creativo:ig-old",
  structuralSourceRef: "organico:tt-1",
  visualSourceRef: "creativo:ig-2",
};
assert.equal(proposalUsesInspiration(proposal, "organico:tt-1"), true);
assert.equal(proposalUsesInspiration(proposal, "creativo:ig-2"), true);
assert.equal(proposalUsesInspiration(proposal, "creativo:ig-old"), true);
assert.equal(proposalUsesInspiration(proposal, "creativo:missing"), false);

function usageCount(specs, proposals, key) {
  const slotIds = new Set();
  for (const spec of specs) {
    if (recordUsesInspiration(spec, key)) slotIds.add(spec.slotId);
  }
  for (const item of proposals) {
    if (proposalUsesInspiration(item, key)) slotIds.add(item.planSlotId);
  }
  return slotIds.size;
}

assert.equal(
  usageCount(
    [legacyRecord, dualRecord],
    [{ ...proposal, planSlotId: "s3" }],
    "organico:tt-1",
  ),
  2,
);
assert.equal(usageCount([legacyRecord], [], "creativo:ig-1"), 1);

fs.rmSync(tmp, { recursive: true, force: true });

console.log("inspiration-intelligence.test.mjs OK");
