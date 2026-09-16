/**
 * Temas por rol: compatibilidad, migración de pilares y defaults.
 */
import assert from "node:assert/strict";

import {
  activeRolesHaveTopics,
  cloneDefaultRoleTopicPreferences,
  getTopicsForRole,
  isTopicCompatibleWithRole,
  mapLegacyPillarToTopic,
  normalizeRoleTopicPreferences,
  resolveSlotTopicId,
  ROLE_TOPIC_FALLBACKS,
  topicTargetsForRole,
} from "../src/content/role-topics.ts";

assert.ok(getTopicsForRole("build_in_public").length >= 10);
assert.ok(getTopicsForRole("educacion").length >= 10);
assert.ok(getTopicsForRole("producto").length >= 10);
assert.ok(getTopicsForRole("marca").length >= 10);
assert.ok(getTopicsForRole("evidencia").length >= 8);
assert.ok(getTopicsForRole("comunidad").length >= 8);

assert.equal(isTopicCompatibleWithRole("educacion", "inventario_stock"), true);
assert.equal(isTopicCompatibleWithRole("producto", "inventario_stock"), false);
assert.equal(isTopicCompatibleWithRole("producto", "stock_variantes"), true);
assert.equal(isTopicCompatibleWithRole("educacion", "onboarding_tienda"), false);
assert.equal(isTopicCompatibleWithRole("producto", "producto-mercantis"), false);

assert.equal(
  mapLegacyPillarToTopic("educacion", "inventario-stock"),
  "inventario_stock",
);
assert.equal(mapLegacyPillarToTopic("educacion", "producto-mercantis"), undefined);
assert.equal(
  mapLegacyPillarToTopic("producto", "producto-mercantis"),
  "onboarding_tienda",
);

const defaults = cloneDefaultRoleTopicPreferences();
assert.ok(topicTargetsForRole(defaults, "educacion").inventario_stock > 0);
assert.equal(topicTargetsForRole(defaults, "educacion").pagos_cobros, 15);
assert.equal(defaults.marca.identidad_latam, "no");
assert.equal(defaults.evidencia.uso_real, "no");
assert.equal(defaults.build_in_public.producto_en_construccion, "alta");

const fromPillars = normalizeRoleTopicPreferences(undefined, {
  "inventario-stock": 40,
  "producto-mercantis": 18,
});
assert.equal(fromPillars.educacion.inventario_stock, "alta");
assert.equal(fromPillars.producto.stock_variantes, "media");

assert.equal(
  resolveSlotTopicId({ roleId: "educacion", pillarId: "inventario-stock" }),
  "inventario_stock",
);
assert.equal(
  resolveSlotTopicId({
    roleId: "producto",
    topicId: "ia_catalogo",
    pillarId: "producto-mercantis",
  }),
  "ia_catalogo",
);
assert.equal(
  resolveSlotTopicId({ roleId: "marca", pillarId: "unknown" }),
  ROLE_TOPIC_FALLBACKS.marca,
);

assert.equal(
  activeRolesHaveTopics({ educacion: 20, producto: 0 }, defaults),
  true,
);

const allNo = normalizeRoleTopicPreferences({
  educacion: Object.fromEntries(
    getTopicsForRole("educacion").map((topic) => [topic.id, "no"]),
  ),
});
assert.equal(
  activeRolesHaveTopics({ educacion: 20 }, allNo),
  false,
  "un rol activo sin temas habilitados no valida",
);

console.log("role-topics.test.mjs: ok");
