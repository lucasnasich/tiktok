/**
 * Migración de roles editoriales.
 */
import assert from "node:assert/strict";

import {
  contentRoles,
  normalizeRoleId,
  normalizeRoleTargets,
} from "../src/content/content-roles.ts";
import { DEFAULT_ROLE_TARGETS_OFFICIAL } from "../src/content/planning-defaults.ts";
import { sumPercentTargets } from "../src/lib/planning-percent.ts";

assert.equal(normalizeRoleId("valor"), "educacion");
assert.equal(normalizeRoleId("alcance"), "educacion");
assert.equal(normalizeRoleId("prueba"), "producto");
assert.equal(normalizeRoleId("build_in_public"), "build-in-public");
assert.equal(normalizeRoleId("conversion"), "conversion");
assert.equal(normalizeRoleId("marca"), "marca");
assert.equal(normalizeRoleId("comunidad"), "comunidad");
assert.equal(normalizeRoleId("evidencia"), "evidencia");

const migrated = normalizeRoleTargets({
  alcance: 35,
  valor: 25,
  prueba: 15,
  conversion: 5,
  marca: 10,
  comunidad: 10,
});

assert.equal(migrated.educacion, 60);
assert.equal(migrated.producto, 15);
assert.equal(migrated.conversion, 5);
assert.equal(migrated.marca, 10);
assert.equal(migrated.comunidad, 10);
assert.equal(migrated.alcance, undefined);
assert.equal(migrated.valor, undefined);
assert.equal(migrated.prueba, undefined);

assert.equal(
  contentRoles.some((role) => role.id === "alcance"),
  false,
  "Alcance no es un rol",
);
assert.equal(
  contentRoles.some((role) => role.id === "valor"),
  false,
  "Valor no es un rol",
);

const roleIds = contentRoles.map((role) => role.id);
assert.deepEqual(roleIds, [
  "educacion",
  "producto",
  "evidencia",
  "build-in-public",
  "marca",
  "comunidad",
  "conversion",
]);

assert.equal(sumPercentTargets(DEFAULT_ROLE_TARGETS_OFFICIAL), 100);

console.log("content-roles.test.mjs: ok");
