/**
 * Tipo de publicación vs formato creativo vs restricción sin cámara.
 */
import assert from "node:assert/strict";

import { formatRequiresCamera } from "../src/content/format-capabilities.ts";
import { DEFAULT_CAMERA_MODE } from "../src/content/camera-presence.ts";
import {
  DEFAULT_PUBLICATION_TYPE_TARGETS,
  isPublicationTypeAllowedForProduction,
} from "../src/content/publication-types.ts";
import { recommendCreativeFormats } from "../src/lib/creative-format-recommendations.ts";

assert.equal(DEFAULT_CAMERA_MODE, "faceless");
assert.ok(DEFAULT_PUBLICATION_TYPE_TARGETS.short_video > 0);
assert.equal(
  isPublicationTypeAllowedForProduction("short_video", "faceless"),
  true,
  "sin cámara no prohíbe video corto / reel",
);
assert.equal(formatRequiresCamera("talking-head"), true);
assert.equal(formatRequiresCamera("vlog"), true);
assert.equal(formatRequiresCamera("entrevista"), true);
assert.equal(formatRequiresCamera("green-screen"), true);
assert.equal(formatRequiresCamera("grabacion-pantalla"), false);
assert.equal(formatRequiresCamera("motion-graphics"), false);
assert.equal(formatRequiresCamera("video-ia"), false);

const facelessReel = recommendCreativeFormats({
  roleId: "build_in_public",
  publicationTypeId: "short_video",
  cameraMode: "faceless",
  limit: 8,
});
const facelessIds = facelessReel.map((item) => item.id);

assert.ok(facelessIds.length >= 2);
assert.ok(!facelessIds.includes("talking-head"));
assert.ok(!facelessIds.includes("vlog"));
assert.ok(!facelessIds.includes("entrevista"));
assert.ok(!facelessIds.includes("green-screen"));
assert.ok(!facelessIds.includes("texto-sobre-la-piel"));
assert.ok(
  facelessIds.some((id) =>
    [
      "grabacion-pantalla",
      "motion-graphics",
      "video-ia",
      "texto-cinetico",
    ].includes(id),
  ),
  "un reel faceless debe poder ejecutarse sin cámara",
);

const cameraAllowed = recommendCreativeFormats({
  roleId: "comunidad",
  publicationTypeId: "short_video",
  cameraMode: "camera_allowed",
  limit: 12,
});
assert.ok(
  cameraAllowed.some((item) => item.id === "talking-head"),
  "con cámara permitida talking head puede entrar a la biblioteca rankeada",
);

console.log("publication-planning.test.mjs: ok");
