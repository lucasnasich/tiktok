import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  loadBrainDocuments,
  sanitizeBrainRef,
  uniqueBrainRefs,
} from "./mercantis-brain-loader.mjs";
import {
  buildSlotDescriptionUserPrompt,
  normalizeSlotDescriptionPayload,
} from "./slot-description-schema.mjs";
import {
  EXAMPLES,
  getFormatProductionExamples,
  buildFormatProductionPromptSection,
} from "./format-production-examples.mjs";

assert.equal(sanitizeBrainRef("contenido-comunicacion.md"), "contenido-comunicacion.md");
assert.equal(sanitizeBrainRef("knowledge/mercantis/marca.md"), "marca.md");
assert.equal(sanitizeBrainRef("../claims.md"), "claims.md");
assert.equal(sanitizeBrainRef("/etc/passwd"), null);
assert.equal(sanitizeBrainRef("foo.txt"), null);
assert.equal(sanitizeBrainRef(".."), null);
assert.equal(sanitizeBrainRef(""), null);

assert.deepEqual(
  uniqueBrainRefs(["marca.md", "marca.md", "../filosofia.md", "nope.txt"]),
  ["marca.md", "filosofia.md"],
);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "brain-loader-"));
try {
  fs.writeFileSync(path.join(tmp, "marca.md"), "tono serio");
  fs.writeFileSync(path.join(path.dirname(tmp), "outside.md"), "fuera");
  const loaded = loadBrainDocuments(
    ["marca.md", "../outside.md", "missing.md", "/etc/passwd"],
    tmp,
  );
  assert.equal(loaded.documents.length, 1);
  assert.equal(loaded.documents[0].file, "marca.md");
  assert.equal(loaded.documents[0].content, "tono serio");
  assert.ok(loaded.missing.includes("missing.md"));
  assert.ok(loaded.missing.includes("outside.md"));
  assert.ok(!loaded.documents.some((doc) => doc.content.includes("fuera")));
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.rmSync(path.join(path.dirname(tmp), "outside.md"), { force: true });
}

const payload = normalizeSlotDescriptionPayload({
  editorialDescription: "  Enseñar postventa.  ",
  structuralSearchBrief: "Hook negativo y tres beats.",
  visualSearchBrief: "Placas tipográficas sin cámara.",
});
assert.equal(payload.editorialDescription, "Enseñar postventa.");
assert.throws(() =>
  normalizeSlotDescriptionPayload({
    editorialDescription: "ok",
    structuralSearchBrief: "",
    visualSearchBrief: "ok",
  }),
);

const prompt = buildSlotDescriptionUserPrompt({
  slotId: "slot-1",
  accountLabel: "Mercantis",
  roleLabel: "Valor",
  pillarLabel: "Clientes",
  formatLabel: "Tier list",
  cameraPresenceLabel: "Sin cámara",
  cameraPresenceConstraint: "Nadie sale a cámara.",
  editorialConstraints: ["No convertirlo en venta directa."],
  brainDocuments: [{ file: "marca.md", content: "Cuenta oficial seria." }],
  missingBrainRefs: ["no-existe.md"],
});
assert.ok(prompt.includes("Mercantis"));
assert.ok(prompt.includes("structuralSearchBrief"));
assert.ok(prompt.includes("### marca.md"));
assert.ok(prompt.includes("Cuenta oficial seria."));
assert.ok(prompt.includes("no-existe.md"));
assert.ok(prompt.includes("No convertirlo en venta directa."));

const testimonioOff = getFormatProductionExamples(
  "testimonio-cliente",
  "off-camera",
);
assert.equal(testimonioOff.camera, "off-camera");
assert.ok(testimonioOff.avoid.toLowerCase().includes("demo"));
assert.ok(
  testimonioOff.visual.some((item) => /estrella|quote|reseña|remotion/i.test(item)),
);
assert.ok(testimonioOff.avoid.toLowerCase().includes("backoffice"));

const testimonioGuest = getFormatProductionExamples(
  "testimonio-cliente",
  "needs-guest",
);
assert.ok(testimonioGuest.structural.some((item) => /cliente/i.test(item)));

const unknownCam = getFormatProductionExamples("tier-list", "whatever");
assert.equal(unknownCam.camera, "off-camera");

const formatIds = [
  "x-razones",
  "historia-instagram",
  "nosotros-vs-ellos",
  "diagrama-venn",
  "no-compres-esto",
  "nota-iphone",
  "captura-chat",
  "pizarra",
  "cupos-limitados",
  "pedimos-disculpas",
  "testimonio-cliente",
  "lo-nuevo-vs-lo-viejo",
  "ultima-hora",
  "transformacion",
  "estilo-reddit",
  "en-caso-de-emergencia",
  "busqueda-google",
  "problema-vs-solucion",
  "efecto-secundario",
  "oferta-combo",
  "titular-con-dato",
  "garabato",
  "captura-email",
  "no-seas-ese-que",
  "resenas",
  "texto-sobre-la-piel",
  "podcast-ia",
  "tier-list",
  "cero-estrellas",
  "green-screen",
  "x-senales",
  "mito-vs-realidad",
  "problemas-tachados",
  "lo-que-podes-evitar",
  "advertencia",
];
for (const formatId of formatIds) {
  const entry = EXAMPLES[formatId];
  assert.ok(entry, `falta menú de producción para ${formatId}`);
  for (const camera of ["off-camera", "on-camera", "needs-guest"]) {
    assert.ok(entry[camera]?.structural?.length, `${formatId} ${camera} estructural`);
    assert.ok(entry[camera]?.visual?.length, `${formatId} ${camera} visual`);
  }
}

const formatSection = buildFormatProductionPromptSection({
  formatId: "testimonio-cliente",
  formatLabel: "Testimonio de cliente",
  formatSummary: "Prueba social con quote, resultado o antes/después real.",
  cameraPresence: "off-camera",
  cameraPresenceLabel: "Sin cámara",
});
assert.ok(formatSection.includes("Formato (manda sobre el pilar)"));
assert.ok(formatSection.includes("Ejemplos visuales"));
assert.ok(/estrella|quote|Remotion/i.test(formatSection));

const promptWithFormat = buildSlotDescriptionUserPrompt({
  slotId: "slot-2",
  roleLabel: "Educación",
  pillarLabel: "Automatización e IA",
  formatLabel: "Testimonio de cliente",
  formatId: "testimonio-cliente",
  cameraPresenceLabel: "Sin cámara",
  formatProductionSection: formatSection,
  editorialConstraints: ["Prueba social: voz, quote, rating."],
  brainDocuments: [{ file: "inteligencia-artificial.md", content: "IA de catálogo." }],
});
assert.ok(promptWithFormat.includes("EL FORMATO MANDA SOBRE EL PILAR"));
assert.ok(promptWithFormat.includes("Testimonio de cliente"));
assert.ok(promptWithFormat.includes("Ejemplos estructurales"));
assert.ok(promptWithFormat.includes("inteligencia-artificial.md"));

const realBrain = loadBrainDocuments([
  "contenido-comunicacion.md",
  "../package.json",
  "no-existe.md",
]);
assert.ok(
  realBrain.documents.some((doc) => doc.file === "contenido-comunicacion.md"),
);
assert.ok(realBrain.documents[0].content.length > 100);
assert.ok(realBrain.missing.includes("no-existe.md"));
assert.ok(!realBrain.documents.some((doc) => doc.file === "package.json"));

console.log("slot-description tests ok");
