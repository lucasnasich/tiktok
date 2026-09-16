/**
 * Opciones de producción concretas vs modelo legacy de publicación.
 */
import assert from "node:assert/strict";

import {
  applyCameraModeToProduction,
  cloneDefaultProductionConfig,
  enabledProductionTargets,
  getProductionOptionsForCamera,
  isProductionOptionCompatibleWithCamera,
  migrateLegacyPublicationTypeId,
  migrateLegacyPublicationTypeTargets,
  normalizeProductionConfig,
  productionOptions,
  toggleProductionOption,
} from "../src/content/production-options.ts";
import { recommendCreativeFormats } from "../src/lib/creative-format-recommendations.ts";
import { formatRequiresCamera } from "../src/content/format-capabilities.ts";

assert.equal(productionOptions.length, 8);
assert.equal(
  productionOptions.some((item) => item.id === "short_video"),
  false,
);
assert.equal(
  productionOptions.some((item) => item.id === "story"),
  false,
);
assert.equal(
  productionOptions.filter((item) => item.requiresCamera).map((item) => item.id).join(","),
  "talking_camera,talking_camera_remotion",
);

const facelessOptions = getProductionOptionsForCamera("faceless");
assert.equal(facelessOptions.length, 6);
assert.equal(
  facelessOptions.some((item) => item.requiresCamera),
  false,
);
assert.equal(getProductionOptionsForCamera("camera_allowed").length, 8);

assert.equal(
  isProductionOptionCompatibleWithCamera("talking_camera", "faceless"),
  false,
);
assert.equal(
  isProductionOptionCompatibleWithCamera("remotion_video", "faceless"),
  true,
);

const defaults = cloneDefaultProductionConfig();
assert.deepEqual(defaults.enabledIds, ["single_image"]);
assert.equal(defaults.targets.single_image, 100);
assert.equal(defaults.cameraMode, "faceless");

const onlyImage = normalizeProductionConfig({
  cameraMode: "faceless",
  enabledIds: ["single_image"],
});
assert.equal(onlyImage.enabledIds.length, 1);
assert.equal(enabledProductionTargets(onlyImage).single_image, 100);
assert.equal("image_carousel" in enabledProductionTargets(onlyImage), false);

const two = toggleProductionOption(onlyImage, "image_carousel", true);
assert.ok(two.enabledIds.includes("single_image"));
assert.ok(two.enabledIds.includes("image_carousel"));
assert.equal(two.enabledIds.includes("remotion_video"), false);
const twoTargets = enabledProductionTargets(two);
assert.equal((twoTargets.single_image ?? 0) + (twoTargets.image_carousel ?? 0), 100);
assert.equal(twoTargets.remotion_video, undefined);

const cameraOn = normalizeProductionConfig({
  cameraMode: "camera_allowed",
  enabledIds: ["single_image", "talking_camera", "talking_camera_remotion"],
});
const stripped = applyCameraModeToProduction(cameraOn, "faceless");
assert.deepEqual(stripped.strippedIds.sort(), [
  "talking_camera",
  "talking_camera_remotion",
]);
assert.deepEqual(stripped.config.enabledIds, ["single_image"]);
assert.equal(stripped.config.targets.single_image, 100);

const legacyFaceless = migrateLegacyPublicationTypeTargets(
  { single_image: 10, image_carousel: 30, short_video: 45, story: 15 },
  "faceless",
);
assert.equal(legacyFaceless.single_image, 10);
assert.equal(legacyFaceless.image_carousel, 30);
assert.equal(legacyFaceless.remotion_video, 45);
assert.equal(legacyFaceless.talking_camera, undefined);

const migratedConfig = normalizeProductionConfig({
  cameraMode: "faceless",
  publicationTypeTargets: {
    single_image: 10,
    image_carousel: 30,
    short_video: 45,
    story: 15,
  },
});
assert.ok(migratedConfig.enabledIds.includes("single_image"));
assert.ok(migratedConfig.enabledIds.includes("image_carousel"));
assert.ok(migratedConfig.enabledIds.includes("remotion_video"));
assert.equal(migratedConfig.enabledIds.includes("talking_camera"), false);
assert.equal(
  Object.values(enabledProductionTargets(migratedConfig)).reduce(
    (sum, value) => sum + value,
    0,
  ),
  100,
);

assert.equal(migrateLegacyPublicationTypeId("short_video"), "remotion_video");
assert.equal(migrateLegacyPublicationTypeId("story"), "single_image");

const emptyFallback = normalizeProductionConfig({
  cameraMode: "faceless",
  publicationTypeTargets: { story: 100 },
});
assert.deepEqual(emptyFallback.enabledIds, ["single_image"]);
assert.equal(emptyFallback.targets.single_image, 100);

assert.equal(formatRequiresCamera("talking-head"), true);
assert.equal(formatRequiresCamera("grabacion-pantalla"), false);

const remotionFormats = recommendCreativeFormats({
  roleId: "producto",
  productionTypeId: "remotion_video",
  cameraMode: "faceless",
  limit: 8,
});
assert.ok(remotionFormats.length >= 1);
assert.ok(!remotionFormats.some((item) => item.id === "talking-head"));

const talkingFormats = recommendCreativeFormats({
  roleId: "comunidad",
  productionTypeId: "talking_camera",
  cameraMode: "camera_allowed",
  limit: 8,
});
assert.ok(talkingFormats.some((item) => item.id === "talking-head"));

const imageFormats = recommendCreativeFormats({
  roleId: "marca",
  productionTypeId: "single_image",
  cameraMode: "faceless",
  limit: 8,
});
assert.ok(!imageFormats.some((item) => item.id === "grabacion-pantalla"));
assert.ok(!imageFormats.some((item) => item.id === "talking-head"));

console.log("production-options.test.mjs: ok");
