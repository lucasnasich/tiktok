/**
 * Formato creativo vs opción de producción y restricción sin cámara.
 */
import assert from "node:assert/strict";

import { formatRequiresCamera } from "../src/content/format-capabilities.ts";
import { DEFAULT_CAMERA_MODE } from "../src/content/camera-presence.ts";
import {
  DEFAULT_PRODUCTION_TARGETS,
  isProductionOptionCompatibleWithCamera,
} from "../src/content/production-options.ts";
import { recommendCreativeFormats } from "../src/lib/creative-format-recommendations.ts";

assert.equal(DEFAULT_CAMERA_MODE, "faceless");
assert.equal(DEFAULT_PRODUCTION_TARGETS.single_image, 100);
assert.equal(
  isProductionOptionCompatibleWithCamera("remotion_video", "faceless"),
  true,
  "sin cámara no prohíbe Remotion",
);
assert.equal(
  isProductionOptionCompatibleWithCamera("talking_camera", "faceless"),
  false,
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
  productionTypeId: "remotion_video",
  cameraMode: "faceless",
  limit: 8,
});
const facelessIds = facelessReel.map((item) => item.id);

assert.ok(facelessIds.length >= 1);
assert.ok(!facelessIds.includes("talking-head"));
assert.ok(!facelessIds.includes("vlog"));
assert.ok(!facelessIds.includes("entrevista"));
assert.ok(!facelessIds.includes("green-screen"));
assert.ok(!facelessIds.includes("texto-sobre-la-piel"));
assert.ok(
  facelessIds.some((id) =>
    ["motion-graphics", "texto-cinetico", "video-ia"].includes(id),
  ),
  "Remotion faceless debe poder ejecutarse sin cámara",
);

const demoFormats = recommendCreativeFormats({
  roleId: "producto",
  productionTypeId: "screen_demo",
  cameraMode: "faceless",
  limit: 8,
});
assert.ok(demoFormats.some((item) => item.id === "grabacion-pantalla"));

const cameraAllowed = recommendCreativeFormats({
  roleId: "comunidad",
  productionTypeId: "talking_camera",
  cameraMode: "camera_allowed",
  limit: 12,
});
assert.ok(
  cameraAllowed.some((item) => item.id === "talking-head"),
  "hablando a cámara puede incluir talking head",
);

console.log("publication-planning.test.mjs: ok");
