import assert from "node:assert/strict";

import { listCompatibleCreativeFormats } from "../src/lib/creative-format-recommendations.ts";
import {
  buildCreativeProposalsUserPrompt,
  normalizeCreativeProposalDrafts,
  productionHardConstraint,
} from "./creative-proposals-schema.mjs";

function draft(index) {
  return {
    title: `Idea ${index}`,
    idea: `Pieza concreta ${index} sobre distribución, no un resumen del slot.`,
    angle: `Ángulo ${index}`,
    message: `Mensaje ${index}`,
    visualConcept: `Una escena concreta ${index} con objetos, texto y posiciones.`,
    structure: [`Paso 1 de ${index}`, `Paso 2 de ${index}`],
    requiredAssets: index === 1 ? ["captura del dashboard"] : [],
  };
}

const payload = normalizeCreativeProposalDrafts({
  proposals: [1, 2, 3, 4, 5].map(draft),
});
assert.equal(payload.length, 5);
assert.equal(payload[0].title, "Idea 1");
assert.deepEqual(payload[1].requiredAssets, []);

assert.throws(() =>
  normalizeCreativeProposalDrafts({
    proposals: [1, 2, 3, 4].map(draft),
  }),
);
assert.throws(() =>
  normalizeCreativeProposalDrafts({
    proposals: [1, 2, 3, 4, 5].map((index) => ({
      ...draft(index),
      visualConcept: "   ",
    })),
  }),
);
assert.throws(() =>
  normalizeCreativeProposalDrafts({
    proposals: [1, 2, 3, 4, 5].map((index) => ({
      ...draft(index),
      structure: [],
    })),
  }),
);

const freePrompt = buildCreativeProposalsUserPrompt({
  slotId: "slot-1",
  accountLabel: "Mercantis oficial",
  roleLabel: "Build in Public",
  roleSummary: "Mostrar el proceso.",
  topicLabel: "Crecimiento y distribución",
  productionTypeId: "single_image",
  productionTypeLabel: "Imagen única",
  productionTypeSummary: "Una pieza estática.",
  cameraPresenceLabel: "Sin cámara",
  cameraPresenceConstraint: "Nadie se graba.",
  editorialConstraints: ["No inventar métricas."],
  brainDocuments: [{ file: "historia.md", content: "Mercantis nació en Córdoba." }],
  generationMode: "free",
});

assert.ok(freePrompt.includes("cinco propuestas"));
assert.ok(freePrompt.includes("Imagen única"));
assert.ok(freePrompt.includes("generación libre"));
assert.ok(freePrompt.includes("historia.md"));
assert.ok(freePrompt.includes("No inventar métricas."));
assert.ok(freePrompt.includes(productionHardConstraint("single_image")));
assert.equal(freePrompt.includes("nota-iphone"), false);
assert.equal(freePrompt.includes("Nota de iPhone"), false);
assert.equal(freePrompt.includes("Pizarra"), false);
assert.equal(freePrompt.includes("formatos creativos recomendados"), false);
assert.equal(freePrompt.includes("ROLE_FORMAT"), false);
assert.equal(freePrompt.includes("Tier list"), false);

const parentPrompt = buildCreativeProposalsUserPrompt({
  generationMode: "more_like_this",
  productionTypeId: "image_carousel",
  productionTypeLabel: "Carrusel de imágenes",
  parentProposal: {
    title: "Construir no alcanza",
    idea: "Mostrar el gap entre producto y distribución.",
    angle: "Contraste esfuerzo vs atención.",
    message: "Un buen producto no alcanza si nadie lo conoce.",
    visualConcept: "Un embudo gigante con features arriba y tres personas abajo.",
    structure: ["Hook", "Contraste", "Cierre"],
  },
});
assert.ok(parentPrompt.includes("Construir no alcanza"));
assert.ok(parentPrompt.includes("mismo territorio creativo"));
assert.ok(parentPrompt.includes("profundizar una dirección"));
assert.equal(parentPrompt.includes("Nota de iPhone"), false);

const guidedPrompt = buildCreativeProposalsUserPrompt({
  generationMode: "guided",
  productionTypeId: "single_image",
  productionTypeLabel: "Imagen única",
  guidance: {
    creativeFormats: [
      {
        id: "nota-iphone",
        label: "Nota del iPhone",
        summary: "Screenshot de notas.",
      },
    ],
    inspirationRefs: [
      {
        key: "creativo:1",
        title: "Split editorial",
        signal: "Dos mitades y un titular al centro.",
      },
    ],
    instruction: "Menos texto, más metáfora visual.",
  },
});
assert.ok(guidedPrompt.includes("Nota del iPhone"));
assert.ok(guidedPrompt.includes("Split editorial"));
assert.ok(guidedPrompt.includes("Menos texto, más metáfora visual."));
assert.ok(guidedPrompt.includes("no camisa de fuerza"));

const stillFormats = listCompatibleCreativeFormats({
  productionTypeId: "single_image",
  cameraMode: "faceless",
});
assert.ok(stillFormats.some((item) => item.id === "nota-iphone"));
assert.equal(
  stillFormats.some((item) => item.id === "talking-head"),
  false,
);

const talkingFormats = listCompatibleCreativeFormats({
  productionTypeId: "talking_camera",
  cameraMode: "camera_allowed",
});
assert.ok(talkingFormats.some((item) => item.id === "talking-head"));
assert.equal(
  talkingFormats.some((item) => item.id === "nota-iphone"),
  false,
);

console.log("creative-proposals tests ok");
