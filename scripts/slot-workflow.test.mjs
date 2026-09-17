import assert from "node:assert/strict";

import { deriveSlotWorkflowStatus } from "../src/lib/slot-workflow.ts";

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

const idea = { id: "p1" };

assert.equal(deriveSlotWorkflowStatus(undefined), "elegir-idea");
assert.equal(
  deriveSlotWorkflowStatus({
    slotId: "s",
    directionKind: "manual",
    status: "draft",
  }),
  "elegir-idea",
);
assert.equal(
  deriveSlotWorkflowStatus({
    slotId: "s",
    directionKind: "manual",
    status: "draft",
    selectedCreativeProposalId: "p1",
    creativeProposals: [idea],
  }),
  "elegir-inspiracion",
  "idea elegida sin confirmar inspiración",
);
assert.equal(
  deriveSlotWorkflowStatus({
    slotId: "s",
    directionKind: "manual",
    status: "draft",
    selectedCreativeProposalId: "p1",
    creativeProposals: [idea],
    inspirationConfirmed: false,
  }),
  "elegir-inspiracion",
  "0 refs sin confirmar no es listo",
);
assert.equal(
  deriveSlotWorkflowStatus({
    slotId: "s",
    directionKind: "manual",
    status: "ready-for-cursor",
    selectedCreativeProposalId: "p1",
    creativeProposals: [idea],
    inspirationConfirmed: true,
  }),
  "listo-para-producir",
  "confirmado sin refs también es listo",
);

function usageCount(specSlots, proposalSlots) {
  return new Set([...specSlots, ...proposalSlots]).size;
}

assert.equal(usageCount(["a"], ["a", "b"]), 2, "el uso se deriva de slots únicos");
assert.equal(usageCount([], []), 0, "nunca usada");

console.log("slot-workflow.test.mjs OK");
