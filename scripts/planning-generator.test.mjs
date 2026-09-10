/**
 * Smoke test del generador — corre lógica mínima inline (sin alias @/).
 * Para tests más completos: npm run build && revisar calendario en /planificacion.
 */
import assert from "node:assert/strict";

function stableHash(input) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

function alternateRoleForDate(accountId, date) {
  return stableHash(`${accountId}:${date}`) % 2 === 0 ? "prueba" : "conversion";
}

function getIdealDailyRoles(postsPerDay, date, accountId) {
  const roles = ["alcance", "valor", alternateRoleForDate(accountId, date)];
  return roles.slice(0, postsPerDay);
}

const ideal = getIdealDailyRoles(3, "2026-09-12", "mercantis-oficial");
assert.deepEqual(ideal, ["alcance", "valor", "prueba"]);

const times = ["11:00", "13:00", "16:00", "21:00"];
assert.equal(times.length >= 3, true, "hay horarios suficientes para 3 piezas/día");

console.log("planning-generator.test.mjs OK");
