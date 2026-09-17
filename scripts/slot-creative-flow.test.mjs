/**
 * Persistencia y source of truth de propuestas creativas en el slot.
 */
import assert from "node:assert/strict";

import { parseSlotSpecRecord } from "../src/lib/slot-specs-store.ts";
import {
  applyGeneratedCreativeProposals,
  applyInspirationConfirmation,
  applyProposalInspirationRef,
  applySelectedCreativeProposal,
  canPrepareSlotSpec,
  hasSelectedCreativeProposal,
  isInspirationConfirmed,
  isSpecReadyForCursor,
} from "../src/lib/slot-spec.ts";
import { materializeCreativeProposals } from "../src/lib/creative-proposals.ts";
import { inspirationMatchesProduction } from "../src/lib/inspiration-production.ts";

const drafts = [1, 2, 3, 4, 5].map((index) => ({
  title: `Título ${index}`,
  idea: `Idea ${index}`,
  angle: `Ángulo ${index}`,
  message: `Mensaje ${index}`,
  visualConcept: `Visual ${index}`,
  structure: [`Beat ${index}`],
}));

const generated = materializeCreativeProposals({
  slotId: "slot-1",
  drafts,
  generationMode: "free",
});
assert.equal(generated.length, 5);
assert.equal(new Set(generated.map((item) => item.batchId)).size, 1);
assert.equal(
  generated.every((item) => item.generationMode === "free"),
  true,
);

const record = applyGeneratedCreativeProposals(undefined, "slot-1", generated);
assert.equal(canPrepareSlotSpec(record), false);
assert.equal(hasSelectedCreativeProposal(record), false);

const selected = applySelectedCreativeProposal(
  record,
  "slot-1",
  generated[0].id,
);
assert.equal(canPrepareSlotSpec(selected), true);
assert.equal(hasSelectedCreativeProposal(selected), true);
assert.equal(isInspirationConfirmed(selected), false);
assert.equal(isSpecReadyForCursor(selected), false);

const confirmedEmpty = applyInspirationConfirmation(selected, "slot-1", true);
assert.equal(isInspirationConfirmed(confirmedEmpty), true);
assert.equal(isSpecReadyForCursor(confirmedEmpty), true);
assert.equal(
  confirmedEmpty.creativeProposals?.[0]?.inspirationRefs?.length ?? 0,
  0,
  "se puede confirmar sin referencias",
);

const withRef = applyProposalInspirationRef(
  confirmedEmpty,
  "slot-1",
  generated[0].id,
  "ref-a",
  true,
);
assert.equal(isInspirationConfirmed(withRef), false, "agregar refs exige reconfirmar");
assert.deepEqual(withRef.creativeProposals?.[0]?.inspirationRefs, ["ref-a"]);

const reconfirmed = applyInspirationConfirmation(withRef, "slot-1", true);
assert.equal(isSpecReadyForCursor(reconfirmed), true);

const switched = applySelectedCreativeProposal(
  reconfirmed,
  "slot-1",
  generated[1].id,
);
assert.equal(switched.selectedCreativeProposalId, generated[1].id);
assert.equal(
  isInspirationConfirmed(switched),
  false,
  "cambiar idea resetea la confirmación",
);
assert.deepEqual(
  switched.creativeProposals?.find((item) => item.id === generated[0].id)
    ?.inspirationRefs,
  ["ref-a"],
  "las refs de la idea anterior se conservan",
);
assert.equal(
  switched.creativeProposals?.find((item) => item.id === generated[1].id)
    ?.inspirationRefs,
  undefined,
);

const sameIdea = applySelectedCreativeProposal(
  reconfirmed,
  "slot-1",
  generated[0].id,
);
assert.equal(
  isInspirationConfirmed(sameIdea),
  true,
  "re-elegir la misma idea no resetea la confirmación",
);

const parsedConfirmed = parseSlotSpecRecord(reconfirmed);
assert.equal(parsedConfirmed?.inspirationConfirmed, true);
assert.equal(parsedConfirmed?.creativeProposals?.length, 5);

const parsed = parseSlotSpecRecord({
  ...selected,
  creativeProposals: selected.creativeProposals,
});
assert.equal(parsed?.selectedCreativeProposalId, generated[0].id);
assert.equal(parsed?.creativeProposals?.length, 5);
assert.equal(parsed?.creativeProposals?.[0].title, "Título 1");

const legacy = parseSlotSpecRecord({
  slotId: "legacy-slot",
  directionKind: "manual",
  status: "draft",
  editorialDescription: "Texto viejo",
  structuralSearchBrief: "Brief estructural",
  visualSearchBrief: "Brief visual",
});
assert.ok(legacy);
assert.equal(legacy.editorialDescription, "Texto viejo");
assert.equal(canPrepareSlotSpec(legacy), false);

const image = {
  key: "img",
  sourceId: "creativo",
  sourceLabel: "Creativo",
  kind: "creativo",
  title: "Placa",
  origin: "visual-reference",
  materialType: "example",
  media: [{ kind: "image", url: "/x.jpg" }],
};
const carousel = {
  ...image,
  key: "car",
  title: "Carrusel",
  media: [
    { kind: "image", url: "/1.jpg" },
    { kind: "image", url: "/2.jpg" },
  ],
};
const reel = {
  ...image,
  key: "reel",
  title: "Reel",
  url: "https://www.instagram.com/reel/abc/",
  media: [{ kind: "video", url: "/v.mp4" }],
};
const talking = {
  ...reel,
  key: "talk",
  formatIds: ["talking-head"],
};

assert.equal(inspirationMatchesProduction(image, "single_image"), true);
assert.equal(inspirationMatchesProduction(image, "image_carousel"), false);
assert.equal(inspirationMatchesProduction(carousel, "image_carousel"), true);
assert.equal(inspirationMatchesProduction(carousel, "single_image"), false);
assert.equal(inspirationMatchesProduction(reel, "remotion_video"), true);
assert.equal(inspirationMatchesProduction(reel, "single_image"), false);
assert.equal(inspirationMatchesProduction(talking, "talking_camera"), true);
assert.equal(inspirationMatchesProduction(talking, "single_image"), false);

console.log("slot-creative-flow tests ok");
