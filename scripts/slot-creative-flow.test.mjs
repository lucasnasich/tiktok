/**
 * Persistencia y source of truth de propuestas creativas en el slot.
 */
import assert from "node:assert/strict";

import { parseSlotSpecRecord } from "../src/lib/slot-specs-store.ts";
import {
  applyGeneratedCreativeProposals,
  applySelectedCreativeProposal,
  canPrepareSlotSpec,
  hasSelectedCreativeProposal,
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
