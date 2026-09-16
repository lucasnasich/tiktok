/**
 * Migración de roles editoriales.
 */
import assert from "node:assert/strict";

import {
  CONTENT_ROLE_CTA_GUIDELINE,
  contentRoles,
  DEFAULT_ROLE_TARGETS_OFFICIAL,
  normalizeRoleId,
  normalizeRoleTargets,
} from "../src/content/content-roles.ts";
import { sumPercentTargets } from "../src/lib/planning-percent.ts";

assert.equal(normalizeRoleId("valor"), "educacion");
assert.equal(normalizeRoleId("alcance"), "educacion");
assert.equal(normalizeRoleId("prueba"), "producto");
assert.equal(normalizeRoleId("conversion"), "producto");
assert.equal(normalizeRoleId("build-in-public"), "build_in_public");
assert.equal(normalizeRoleId("build_in_public"), "build_in_public");
assert.equal(normalizeRoleId("marca"), "marca");
assert.equal(normalizeRoleId("comunidad"), "comunidad");
assert.equal(normalizeRoleId("evidencia"), "evidencia");
assert.equal(normalizeRoleId("educacion"), "educacion");
assert.equal(normalizeRoleId("producto"), "producto");

const roleIds = contentRoles.map((role) => role.id);
assert.deepEqual(roleIds, [
  "build_in_public",
  "educacion",
  "producto",
  "marca",
  "evidencia",
  "comunidad",
]);

for (const legacyId of ["alcance", "valor", "prueba", "conversion"]) {
  assert.equal(
    contentRoles.some((role) => role.id === legacyId),
    false,
    `${legacyId} no es un rol activo`,
  );
}

assert.equal(sumPercentTargets(DEFAULT_ROLE_TARGETS_OFFICIAL), 100);
assert.deepEqual(DEFAULT_ROLE_TARGETS_OFFICIAL, {
  build_in_public: 35,
  educacion: 20,
  producto: 15,
  marca: 15,
  evidencia: 10,
  comunidad: 5,
});

const legacySixRoleMix = normalizeRoleTargets({
  alcance: 35,
  valor: 25,
  prueba: 15,
  conversion: 5,
  marca: 10,
  comunidad: 10,
});
assert.deepEqual(legacySixRoleMix, DEFAULT_ROLE_TARGETS_OFFICIAL);
assert.equal(legacySixRoleMix.alcance, undefined);
assert.equal(legacySixRoleMix.valor, undefined);
assert.equal(legacySixRoleMix.prueba, undefined);
assert.equal(legacySixRoleMix.conversion, undefined);

const sevenRoleMix = normalizeRoleTargets({
  educacion: 30,
  producto: 20,
  evidencia: 15,
  "build-in-public": 10,
  marca: 10,
  comunidad: 10,
  conversion: 5,
});
assert.equal(sumPercentTargets(sevenRoleMix), 100);
assert.equal(sevenRoleMix.conversion, undefined);
assert.equal(sevenRoleMix["build-in-public"], undefined);
assert.ok((sevenRoleMix.build_in_public ?? 0) > 0);
assert.ok((sevenRoleMix.educacion ?? 0) > 0);
assert.ok((sevenRoleMix.producto ?? 0) > 0);

const onlyConversion = normalizeRoleTargets({ conversion: 100 });
assert.deepEqual(onlyConversion, DEFAULT_ROLE_TARGETS_OFFICIAL);

const valorOnly = normalizeRoleTargets({ valor: 100 });
assert.equal(sumPercentTargets(valorOnly), 100);
assert.equal(valorOnly.educacion, 100);

assert.ok(CONTENT_ROLE_CTA_GUIDELINE.includes("CTA"));
assert.ok(CONTENT_ROLE_CTA_GUIDELINE.includes("no define el rol"));

console.log("content-roles.test.mjs: ok");
