/**
 * Compatibilidad rol × pilar × formato × producción.
 * Importa el módulo TS con strip-types (Node 23).
 */
import assert from "node:assert/strict";

import {
  BLOCKED_FORMATS_BY_ROLE,
  BLOCKED_PILLARS_BY_FORMAT,
  BLOCKED_PILLARS_BY_ROLE,
  compatibleFormatTargets,
  compatiblePillarTargets,
  isFormatCompatibleWithCamera,
  isFormatCompatibleWithPillar,
  isFormatCompatibleWithRole,
  isPillarCompatibleWithRole,
  isSlotComboCompatible,
  ROLE_FORMAT_FALLBACKS,
  ROLE_PILLAR_FALLBACKS,
} from "../src/content/slot-compatibility.ts";

const officialFormatMix = {
  "x-razones": 12,
  "nota-iphone": 10,
  "captura-chat": 8,
  pizarra: 8,
  "mito-vs-realidad": 8,
  "green-screen": 8,
  "x-senales": 7,
  "tier-list": 7,
  "testimonio-cliente": 7,
  advertencia: 6,
  transformacion: 6,
  "busqueda-google": 5,
  garabato: 5,
  "problema-vs-solucion": 5,
  "nosotros-vs-ellos": 4,
};

const officialPillarMix = {
  "ventas-atencion": 20,
  "inventario-stock": 15,
  "pagos-cobros": 12,
  "producto-mercantis": 18,
  "operacion-gestion": 15,
  emprendimiento: 12,
  "mercado-tendencias": 8,
};

assert.equal(
  isSlotComboCompatible({
    roleId: "educacion",
    pillarId: "automatizacion-ia",
    formatId: "oferta-combo",
    cameraPresence: "off-camera",
  }),
  false,
  "educación + oferta es agua seca: no se enseña con escasez",
);

assert.equal(
  isSlotComboCompatible({
    roleId: "educacion",
    pillarId: "automatizacion-ia",
    formatId: "x-razones",
    cameraPresence: "off-camera",
  }),
  true,
  "educación + IA + lista sí es compatible",
);

assert.equal(isFormatCompatibleWithRole("educacion", "oferta-combo"), false);
assert.equal(isFormatCompatibleWithRole("educacion", "pizarra"), true);
assert.equal(isFormatCompatibleWithRole("producto", "testimonio-cliente"), true);
assert.equal(isFormatCompatibleWithRole("producto", "oferta-combo"), false);
assert.equal(isFormatCompatibleWithRole("evidencia", "testimonio-cliente"), true);
assert.equal(isFormatCompatibleWithRole("evidencia", "cupos-limitados"), false);
assert.equal(isFormatCompatibleWithRole("marca", "testimonio-cliente"), false);
assert.equal(isFormatCompatibleWithRole("producto", "efecto-secundario"), false);
assert.equal(
  isFormatCompatibleWithRole("producto", "problema-vs-solucion"),
  true,
);
assert.equal(
  isFormatCompatibleWithRole("build_in_public", "testimonio-cliente"),
  false,
);
assert.equal(
  isFormatCompatibleWithRole("conversion", "problema-vs-solucion"),
  true,
  "conversion legacy cae a producto",
);

assert.equal(isPillarCompatibleWithRole("educacion", "producto-mercantis"), false);
assert.equal(isPillarCompatibleWithRole("educacion", "automatizacion-ia"), true);
assert.equal(isPillarCompatibleWithRole("evidencia", "mercado-tendencias"), false);
assert.equal(isPillarCompatibleWithRole("producto", "producto-mercantis"), true);
assert.equal(isPillarCompatibleWithRole("build_in_public", "mercado-tendencias"), false);

assert.equal(
  isFormatCompatibleWithPillar("testimonio-cliente", "mercado-tendencias"),
  false,
);
assert.equal(
  isFormatCompatibleWithPillar("testimonio-cliente", "producto-mercantis"),
  true,
);

assert.equal(isFormatCompatibleWithCamera("green-screen", "off-camera"), false);
assert.equal(isFormatCompatibleWithCamera("green-screen", "on-camera"), true);
assert.equal(
  isFormatCompatibleWithCamera("testimonio-cliente", "off-camera"),
  true,
  "testimonio off-camera es válido (quote, estrellas, overlay)",
);

const educacionFormats = compatibleFormatTargets(officialFormatMix, {
  roleId: "educacion",
  pillarId: "automatizacion-ia",
  cameraPresence: "off-camera",
});
assert.equal(educacionFormats["oferta-combo"], undefined);
assert.equal(educacionFormats["green-screen"], undefined);
assert.ok(educacionFormats["x-razones"] > 0);
assert.ok(educacionFormats.pizarra > 0);

const educacionPillars = compatiblePillarTargets(
  { ...officialPillarMix, "automatizacion-ia": 10 },
  "educacion",
);
assert.equal(educacionPillars["producto-mercantis"], undefined);
assert.ok(educacionPillars.emprendimiento > 0);
assert.ok(educacionPillars["automatizacion-ia"] > 0);
assert.ok(educacionPillars["operacion-gestion"] > 0);

const evidenciaFormats = compatibleFormatTargets(officialFormatMix, {
  roleId: "evidencia",
  pillarId: "clientes-fidelizacion",
  cameraPresence: "off-camera",
});
assert.ok(evidenciaFormats["testimonio-cliente"] > 0);

const productoFormats = compatibleFormatTargets(officialFormatMix, {
  roleId: "producto",
  pillarId: "producto-mercantis",
  cameraPresence: "off-camera",
});
assert.ok(productoFormats["problema-vs-solucion"] > 0);

for (const [roleId, formats] of Object.entries(BLOCKED_FORMATS_BY_ROLE)) {
  for (const formatId of formats) {
    assert.equal(
      isFormatCompatibleWithRole(roleId, formatId),
      false,
      `${roleId} no admite ${formatId}`,
    );
  }
}

for (const [roleId, pillars] of Object.entries(BLOCKED_PILLARS_BY_ROLE)) {
  for (const pillarId of pillars) {
    assert.equal(isPillarCompatibleWithRole(roleId, pillarId), false);
  }
}

for (const [formatId, pillars] of Object.entries(BLOCKED_PILLARS_BY_FORMAT)) {
  for (const pillarId of pillars) {
    assert.equal(isFormatCompatibleWithPillar(formatId, pillarId), false);
  }
}

assert.equal(ROLE_FORMAT_FALLBACKS.educacion, "pizarra");
assert.equal(ROLE_PILLAR_FALLBACKS.educacion, "operacion-gestion");
assert.equal(ROLE_FORMAT_FALLBACKS.evidencia, "testimonio-cliente");
assert.notEqual(ROLE_PILLAR_FALLBACKS.educacion, "producto-mercantis");

console.log("slot-compatibility.test.mjs: ok");
