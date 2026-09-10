import assert from "node:assert/strict";

const W = {
  base: 10,
  sameFormat: 28,
  unusedBonus: 8,
  perUsePenalty: 5,
  perUsePenaltyCap: 20,
  recentUsePenalty: 14,
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function score({ formatMatch, uses, recent }) {
  let score = W.base;
  if (formatMatch) score += W.sameFormat;
  if (uses === 0) score += W.unusedBonus;
  else {
    score -= Math.min(W.perUsePenaltyCap, uses * W.perUsePenalty);
    if (recent) score -= W.recentUsePenalty;
  }
  return score;
}

const unusedMatch = score({ formatMatch: true, uses: 0, recent: false });
const usedRecent = score({ formatMatch: true, uses: 3, recent: true });

assert.equal(unusedMatch > usedRecent, true, "el uso reciente baja prioridad");
assert.equal(clamp(unusedMatch, 0, 100) >= 40, true, "un match de formato unused es compatible");

function deriveWorkflow({ specReady, candidates, selected }) {
  if (selected) return "listo-para-ensamblar";
  if (candidates > 0) return "elegir-propuesta";
  if (specReady) return "listo-para-cursor";
  return "falta-definir";
}

assert.equal(deriveWorkflow({ specReady: false, candidates: 0, selected: false }), "falta-definir");
assert.equal(deriveWorkflow({ specReady: true, candidates: 0, selected: false }), "listo-para-cursor");
assert.equal(deriveWorkflow({ specReady: true, candidates: 3, selected: false }), "elegir-propuesta");
assert.equal(deriveWorkflow({ specReady: true, candidates: 3, selected: true }), "listo-para-ensamblar");

function usageCount(specSlots, proposalSlots) {
  return new Set([...specSlots, ...proposalSlots]).size;
}

assert.equal(usageCount(["a"], ["a", "b"]), 2, "el uso se deriva de slots únicos");
assert.equal(usageCount([], []), 0, "nunca usada");

console.log("slot-workflow.test.mjs OK");
