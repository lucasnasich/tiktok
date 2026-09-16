/**
 * La producción de una generación sale del request, no del perfil.
 */
import assert from "node:assert/strict";

import { createCalendarGeneration } from "../src/lib/calendar-generation.ts";
import { EMPTY_PLANNING_CONFIG } from "../src/lib/planning-config-store.ts";
import {
  accountToProfileSettings,
  createProfileDraft,
} from "../src/content/planning-profiles.ts";
import { createPlanningAccountTemplate } from "../src/content/planning-accounts.ts";
import { DEFAULT_PLANNING_RHYTHM } from "../src/content/planning-rhythm.ts";
import { DEFAULT_ROLE_TARGETS_OFFICIAL } from "../src/content/planning-defaults.ts";
import { cloneDefaultRoleTopicPreferences } from "../src/content/role-topics.ts";
import { cloneDefaultProductionConfig } from "../src/content/production-options.ts";

const profile = createProfileDraft("Institucional", "official", {
  roleTargets: { ...DEFAULT_ROLE_TARGETS_OFFICIAL },
  roleTopicPreferences: cloneDefaultRoleTopicPreferences(),
  cameraMode: "camera_allowed",
  productionEnabledIds: ["talking_camera"],
  productionTypeTargets: { talking_camera: 100 },
});

assert.equal(profile.settings.cameraMode, undefined);
assert.equal(profile.settings.productionEnabledIds, undefined);
assert.equal(profile.settings.productionTypeTargets, undefined);

const template = createPlanningAccountTemplate("official");
template.cameraMode = "camera_allowed";
template.productionEnabledIds = ["talking_camera"];
template.productionTypeTargets = { talking_camera: 100 };
const stripped = accountToProfileSettings(template);
assert.equal(stripped.cameraMode, undefined);
assert.equal(stripped.productionEnabledIds, undefined);

const leftoverProfile = {
  ...profile,
  settings: {
    ...profile.settings,
    cameraMode: "camera_allowed",
    productionEnabledIds: ["talking_camera"],
    productionTypeTargets: { talking_camera: 100 },
  },
};

const store = {
  ...EMPTY_PLANNING_CONFIG,
  profiles: [leftoverProfile],
  accounts: [
    {
      id: "account:test",
      displayName: "Mercantis",
      type: "official",
      platform: "instagram",
      handle: "mercantis",
    },
  ],
};

const imageOnly = cloneDefaultProductionConfig();
const generationA = createCalendarGeneration(store, {
  profileId: leftoverProfile.id,
  accountIds: ["account:test"],
  dateFrom: "2026-09-16",
  dateTo: "2026-09-16",
  publishingMode: "independent",
  rhythm: { ...DEFAULT_PLANNING_RHYTHM, postsPerDay: 1, timeSlots: ["11:00"] },
  production: imageOnly,
});

assert.ok(generationA, "genera con producción del request");
assert.equal(generationA.cameraMode, "faceless");
assert.deepEqual(generationA.productionEnabledIds, ["single_image"]);
assert.equal(generationA.productionTypeTargets.single_image, 100);
assert.ok(generationA.slots.length >= 1);
assert.ok(
  generationA.slots.every((slot) => slot.productionTypeId === "single_image"),
  "la generación A sólo usa imagen única",
);
assert.ok(
  generationA.slots.every((slot) => slot.cameraPresence === "off-camera"),
);

const carousel = {
  cameraMode: "faceless",
  enabledIds: ["image_carousel"],
  targets: { image_carousel: 100 },
};
const generationB = createCalendarGeneration(store, {
  profileId: leftoverProfile.id,
  accountIds: ["account:test"],
  dateFrom: "2026-09-16",
  dateTo: "2026-09-16",
  publishingMode: "independent",
  rhythm: { ...DEFAULT_PLANNING_RHYTHM, postsPerDay: 1, timeSlots: ["11:00"] },
  production: carousel,
});

assert.ok(generationB);
assert.deepEqual(generationB.productionEnabledIds, ["image_carousel"]);
assert.ok(
  generationB.slots.every((slot) => slot.productionTypeId === "image_carousel"),
  "la misma perfil puede generar carrusel en otra generación",
);
assert.deepEqual(leftoverProfile.settings.productionEnabledIds, [
  "talking_camera",
]);
assert.equal(leftoverProfile.settings.cameraMode, "camera_allowed");

console.log("calendar-generation.test.mjs: ok");
