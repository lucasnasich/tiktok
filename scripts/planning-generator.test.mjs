/**
 * Smoke test del generador — lógica de mix semanal inline (sin alias @/).
 */
import assert from "node:assert/strict";

function pickWeeklyRole(targets, counts, capacity, lastRole, streak, maxStreak) {
  const entries = Object.entries(targets).filter(([, weight]) => weight > 0);
  const scored = entries.map(([id, target]) => {
    const expected = (capacity * target) / 100;
    const actual = counts[id] ?? 0;
    let deficit = expected - actual;
    if (id === lastRole && streak >= maxStreak && entries.length > 1) {
      deficit -= 1000;
    }
    return { id, deficit };
  });
  scored.sort((a, b) => b.deficit - a.deficit);
  return scored[0]?.id ?? null;
}

const official = {
  alcance: 35,
  valor: 25,
  prueba: 15,
  conversion: 5,
  marca: 10,
  comunidad: 10,
};

assert.equal(
  pickWeeklyRole(official, {}, 21, null, 0, 2),
  "alcance",
  "con la semana vacía gana el rol de mayor target",
);

assert.equal(
  pickWeeklyRole(official, { alcance: 8 }, 21, "alcance", 1, 2),
  "valor",
  "después de cubrir alcance, sigue el siguiente déficit",
);

const satellite = { alcance: 60, valor: 25, prueba: 15, conversion: 0 };
assert.equal(
  pickWeeklyRole(satellite, {}, 21, null, 0, 2),
  "alcance",
);
assert.notEqual(
  pickWeeklyRole(satellite, { alcance: 12, valor: 5, prueba: 4 }, 21, null, 0, 2),
  "conversion",
  "target 0 no se programa",
);

assert.equal(
  pickWeeklyRole({ alcance: 50, prueba: 50 }, { alcance: 3 }, 10, "alcance", 2, 2),
  "prueba",
  "respeta el tope de repetición seguida",
);

const times = ["11:00", "13:00", "16:00", "21:00"];
assert.equal(times.length >= 3, true, "hay horarios suficientes para 3 piezas/día");

function timeSlotRotationOffset(date, slotCount) {
  const dayNumber = Math.floor(new Date(`${date}T12:00:00`).getTime() / 86_400_000);
  return slotCount > 0 ? dayNumber % slotCount : 0;
}

function getPlannedTimesForDay(timeSlots, postsPerDay, date) {
  const sorted = [...timeSlots].sort((a, b) => a.localeCompare(b));
  if (sorted.length === 0 || postsPerDay <= 0) return [];
  if (postsPerDay >= sorted.length) return sorted;
  const offset = timeSlotRotationOffset(date, sorted.length);
  const rotated = [...sorted.slice(offset), ...sorted.slice(0, offset)];
  return rotated.slice(0, postsPerDay);
}

assert.deepEqual(
  getPlannedTimesForDay(times, 3, "2026-09-08"),
  ["11:00", "13:00", "16:00"],
  "día 0 del ciclo: omite el último horario",
);

const rotatedDay = getPlannedTimesForDay(times, 3, "2026-09-09");
assert.equal(
  rotatedDay.includes("21:00"),
  true,
  "otro día del ciclo incluye el horario nocturno",
);
assert.equal(rotatedDay.length, 3, "sigue habiendo 3 piezas por día");

assert.deepEqual(
  getPlannedTimesForDay(times, 4, "2026-09-08"),
  times,
  "si piezas/día = horarios, usa todos",
);

console.log("planning-generator.test.mjs OK");
