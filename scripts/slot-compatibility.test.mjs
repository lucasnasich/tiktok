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
    roleId: "alcance",
    pillarId: "automatizacion-ia",
    formatId: "testimonio-cliente",
    cameraPresence: "off-camera",
  }),
  false,
  "alcance + testimonio es agua seca: no se llega a gente nueva con prueba de cliente",
);

assert.equal(
  isSlotComboCompatible({
    roleId: "alcance",
    pillarId: "automatizacion-ia",
    formatId: "x-razones",
    cameraPresence: "off-camera",
  }),
  true,
  "alcance + IA + lista sí es compatible",
);

assert.equal(
  isFormatCompatibleWithRole("alcance", "testimonio-cliente"),
  false,
);
assert.equal(isFormatCompatibleWithRole("alcance", "resenas"), false);
assert.equal(isFormatCompatibleWithRole("alcance", "oferta-combo"), false);
assert.equal(isFormatCompatibleWithRole("alcance", "cupos-limitados"), false);
assert.equal(isFormatCompatibleWithRole("prueba", "testimonio-cliente"), true);
assert.equal(isFormatCompatibleWithRole("valor", "pizarra"), true);
assert.equal(isFormatCompatibleWithRole("valor", "cupos-limitados"), false);
assert.equal(isFormatCompatibleWithRole("marca", "testimonio-cliente"), false);
assert.equal(isFormatCompatibleWithRole("conversion", "efecto-secundario"), false);
assert.equal(
  isFormatCompatibleWithRole("conversion", "problema-vs-solucion"),
  true,
);

assert.equal(isPillarCompatibleWithRole("alcance", "producto-mercantis"), false);
assert.equal(isPillarCompatibleWithRole("alcance", "automatizacion-ia"), true);
assert.equal(isPillarCompatibleWithRole("prueba", "mercado-tendencias"), false);
assert.equal(isPillarCompatibleWithRole("prueba", "producto-mercantis"), true);
assert.equal(isPillarCompatibleWithRole("conversion", "mercado-tendencias"), false);

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

const alcanceFormats = compatibleFormatTargets(officialFormatMix, {
  roleId: "alcance",
  pillarId: "automatizacion-ia",
  cameraPresence: "off-camera",
});
assert.equal(alcanceFormats["testimonio-cliente"], undefined);
assert.equal(alcanceFormats["green-screen"], undefined);
assert.ok(alcanceFormats["x-razones"] > 0);
assert.ok(alcanceFormats.pizarra > 0);

const alcancePillars = compatiblePillarTargets(
  { ...officialPillarMix, "automatizacion-ia": 10 },
  "alcance",
);
assert.equal(alcancePillars["producto-mercantis"], undefined);
assert.ok(alcancePillars.emprendimiento > 0);
assert.ok(alcancePillars["automatizacion-ia"] > 0);
assert.ok(alcancePillars["operacion-gestion"] > 0);

const pruebaFormats = compatibleFormatTargets(officialFormatMix, {
  roleId: "prueba",
  pillarId: "producto-mercantis",
  cameraPresence: "off-camera",
});
assert.ok(pruebaFormats["testimonio-cliente"] > 0);

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

assert.equal(ROLE_FORMAT_FALLBACKS.alcance, "x-razones");
assert.equal(ROLE_PILLAR_FALLBACKS.alcance, "emprendimiento");
assert.notEqual(ROLE_PILLAR_FALLBACKS.alcance, "producto-mercantis");

console.log("slot-compatibility.test.mjs: ok");
