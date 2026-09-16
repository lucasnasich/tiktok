import type { CameraPresenceMode } from "@/content/camera-presence";
import {
  normalizeRoleId,
  normalizeRoleTargets,
  type ContentRoleId,
} from "@/content/content-roles";
import type { PlanningAccount } from "@/content/planning-accounts";
import {
  DEFAULT_FORMAT_TARGETS,
  DEFAULT_PILLAR_TARGETS_OFFICIAL,
} from "@/content/planning-defaults";
import type { PlanningSlot } from "@/content/planned-slots";
import { normalizePillarId } from "@/content/planning-pillars";
import {
  compatibleFormatTargets,
  compatiblePillarTargets,
  hasPositiveTargets,
  ROLE_FORMAT_FALLBACKS,
  ROLE_PILLAR_FALLBACKS,
} from "@/content/slot-compatibility";
import {
  addDays,
  getWeekDates,
  parseIsoDate,
  startOfWeek,
  toIsoDate,
} from "@/lib/planning-dates";

export type GenerateSlotsInput = {
  accounts?: PlanningAccount[];
  dateFrom: string;
  dateTo: string;
  existingSlots: PlanningSlot[];
  cameraPresence?: CameraPresenceMode;
};

type CountMap = Record<string, number>;

type GeneratorContext = {
  pillarCounts: CountMap;
  formatCounts: CountMap;
  lastPillar: string | null;
  lastFormat: string | null;
  pillarStreak: number;
};

function stableHash(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

export function isoWeekday(iso: string): number {
  const day = parseIsoDate(iso).getDay();
  return day === 0 ? 7 : day;
}

export function isActiveDay(account: PlanningAccount, iso: string): boolean {
  return account.activeDays.includes(isoWeekday(iso));
}

export function enumerateDates(dateFrom: string, dateTo: string): string[] {
  const dates: string[] = [];
  let current = parseIsoDate(dateFrom);
  const end = parseIsoDate(dateTo);

  while (current <= end) {
    dates.push(toIsoDate(current));
    current = addDays(current, 1);
  }

  return dates;
}

export function weekStartIso(iso: string): string {
  return toIsoDate(startOfWeek(parseIsoDate(iso)));
}

function slotKey(slot: Pick<PlanningSlot, "accountId" | "date" | "time">): string {
  return `${slot.accountId}:${slot.date}:${slot.time}`;
}

function increment(map: CountMap, key: string) {
  map[key] = (map[key] ?? 0) + 1;
}

function roleTargets(account: PlanningAccount): Array<[ContentRoleId, number]> {
  return Object.entries(normalizeRoleTargets(account.roleTargets)).filter(
    (entry): entry is [ContentRoleId, number] => (entry[1] ?? 0) > 0,
  );
}

export function weekCapacity(
  account: PlanningAccount,
  weekStart: string,
): number {
  return (
    getWeekDates(parseIsoDate(weekStart)).filter((date) =>
      isActiveDay(account, date),
    ).length * account.postsPerDay
  );
}

function countRolesForWeek(
  slots: PlanningSlot[],
  accountId: string,
  weekStart: string,
): CountMap {
  const dates = new Set(getWeekDates(parseIsoDate(weekStart)));
  const counts: CountMap = {};
  for (const slot of slots) {
    if (slot.accountId !== accountId || !dates.has(slot.date)) continue;
    increment(counts, normalizeRoleId(slot.roleId));
  }
  return counts;
}

function roleStreakForAccount(
  slots: PlanningSlot[],
  accountId: string,
): { lastRole: ContentRoleId | null; streak: number } {
  const ordered = slots
    .filter((slot) => slot.accountId === accountId)
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        a.time.localeCompare(b.time) ||
        a.id.localeCompare(b.id),
    );

  if (ordered.length === 0) return { lastRole: null, streak: 0 };

  const lastRole = normalizeRoleId(ordered[ordered.length - 1].roleId);
  let streak = 0;
  for (let index = ordered.length - 1; index >= 0; index -= 1) {
    if (normalizeRoleId(ordered[index].roleId) !== lastRole) break;
    streak += 1;
  }
  return { lastRole, streak };
}

function initContext(slots: PlanningSlot[]): GeneratorContext {
  const context: GeneratorContext = {
    pillarCounts: {},
    formatCounts: {},
    lastPillar: null,
    lastFormat: null,
    pillarStreak: 0,
  };

  const ordered = [...slots].sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      a.time.localeCompare(b.time) ||
      a.id.localeCompare(b.id),
  );

  for (const slot of ordered) {
    increment(context.pillarCounts, normalizePillarId(slot.pillarId));
    increment(context.formatCounts, slot.formatId);

    const pillarId = normalizePillarId(slot.pillarId);
    if (pillarId === context.lastPillar) {
      context.pillarStreak += 1;
    } else {
      context.lastPillar = pillarId;
      context.pillarStreak = 1;
    }

    context.lastFormat = slot.formatId;
  }

  return context;
}

/**
 * Elige el rol con mayor déficit relativo vs. `roleTargets` en la semana ISO.
 * Un target en 0 no se programa. Respeta el tope de repetición seguida.
 */
export function pickWeeklyRole(
  account: PlanningAccount,
  weekSlots: PlanningSlot[],
  weekStart: string,
  seed: string,
): ContentRoleId | null {
  const entries = roleTargets(account);
  if (entries.length === 0) return null;

  const capacity = Math.max(weekCapacity(account, weekStart), 1);
  const counts = countRolesForWeek(weekSlots, account.id, weekStart);
  const { lastRole, streak } = roleStreakForAccount(weekSlots, account.id);
  const maxStreak = account.repetitionLimits.maxSameRoleInRow;

  const scored = entries.map(([id, target]) => {
    const expected = (capacity * target) / 100;
    const actual = counts[id] ?? 0;
    let deficit = expected - actual;

    if (id === lastRole && streak >= maxStreak && entries.length > 1) {
      deficit -= 1000;
    }

    return { id, deficit };
  });

  scored.sort((a, b) => {
    if (a.deficit !== b.deficit) return b.deficit - a.deficit;
    return stableHash(`${seed}:${a.id}`) - stableHash(`${seed}:${b.id}`);
  });

  return scored[0]?.id ?? null;
}

function pickFromTargets(
  targets: Record<string, number>,
  counts: CountMap,
  context: GeneratorContext,
  kind: "pillar" | "format",
  seed: string,
  limits: PlanningAccount["repetitionLimits"],
): string {
  const entries = Object.entries(targets).filter(([, weight]) => weight > 0);
  if (entries.length === 0) {
    const fallback =
      kind === "format"
        ? DEFAULT_FORMAT_TARGETS
        : DEFAULT_PILLAR_TARGETS_OFFICIAL;
    if (targets === fallback) {
      return kind === "format" ? "x-razones" : "producto-mercantis";
    }
    return pickFromTargets(
      fallback,
      counts,
      context,
      kind,
      seed,
      limits,
    );
  }

  const scored = entries
    .map(([id, target]) => {
      const actual = counts[id] ?? 0;
      let score = actual / target;

      if (kind === "pillar") {
        if (id === context.lastPillar) {
          score += context.pillarStreak >= limits.maxConsecutiveSamePillar ? 2 : 0.35;
        }
      }

      if (kind === "format") {
        if (id === context.lastFormat) score += 0.25;
        if ((counts[id] ?? 0) >= limits.maxSameFormatInPeriod) score += 3;
      }

      return { id, score };
    })
    .sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      return stableHash(`${seed}:${a.id}`) - stableHash(`${seed}:${b.id}`);
    });

  return scored[0]?.id ?? entries[0][0];
}

function resolveCompatiblePillarTargets(
  targets: Record<string, number>,
  roleId: ContentRoleId,
): Record<string, number> {
  const filtered = compatiblePillarTargets(targets, roleId);
  if (hasPositiveTargets(filtered)) return filtered;

  const fromDefaults = compatiblePillarTargets(
    DEFAULT_PILLAR_TARGETS_OFFICIAL,
    roleId,
  );
  if (hasPositiveTargets(fromDefaults)) return fromDefaults;

  return { [ROLE_PILLAR_FALLBACKS[roleId]]: 1 };
}

function resolveCompatibleFormatTargets(
  targets: Record<string, number>,
  roleId: ContentRoleId,
  pillarId: string,
  cameraPresence?: CameraPresenceMode,
): Record<string, number> {
  const query = { roleId, pillarId, cameraPresence };
  const filtered = compatibleFormatTargets(targets, query);
  if (hasPositiveTargets(filtered)) return filtered;

  const fromDefaults = compatibleFormatTargets(DEFAULT_FORMAT_TARGETS, query);
  if (hasPositiveTargets(fromDefaults)) return fromDefaults;

  return { [ROLE_FORMAT_FALLBACKS[roleId]]: 1 };
}

function timeSlotRotationOffset(date: string, slotCount: number): number {
  if (slotCount <= 0) return 0;
  const dayNumber = Math.floor(parseIsoDate(date).getTime() / 86_400_000);
  return dayNumber % slotCount;
}

/**
 * Horarios del día según `postsPerDay` y la ventana rotativa.
 * Si hay más horarios que piezas/día, cada día omite uno distinto (ciclo).
 */
export function getPlannedTimesForDay(
  timeSlots: string[],
  postsPerDay: number,
  date: string,
): string[] {
  const sorted = [...timeSlots].sort((a, b) => a.localeCompare(b));
  if (sorted.length === 0 || postsPerDay <= 0) return [];
  if (postsPerDay >= sorted.length) return sorted;

  const offset = timeSlotRotationOffset(date, sorted.length);
  const rotated = [...sorted.slice(offset), ...sorted.slice(0, offset)];
  return rotated.slice(0, postsPerDay);
}

function timesForDay(
  account: PlanningAccount,
  date: string,
  daySlots: PlanningSlot[],
): string[] {
  const used = new Set(daySlots.map((slot) => slot.time));
  return getPlannedTimesForDay(
    account.timeSlots,
    account.postsPerDay,
    date,
  ).filter((time) => !used.has(time));
}

export function generateMissingSlots({
  accounts = [],
  dateFrom,
  dateTo,
  existingSlots,
  cameraPresence,
}: GenerateSlotsInput): PlanningSlot[] {
  const existingKeys = new Set(existingSlots.map(slotKey));
  const generated: PlanningSlot[] = [];
  const workingSlots = [...existingSlots];
  const context = initContext(existingSlots);
  const dates = enumerateDates(dateFrom, dateTo);

  for (const account of accounts) {
    if (roleTargets(account).length === 0) continue;

    for (const date of dates) {
      if (!isActiveDay(account, date)) continue;

      const daySlots = workingSlots
        .filter((slot) => slot.accountId === account.id && slot.date === date)
        .sort((a, b) => a.time.localeCompare(b.time));

      const missingCount = Math.max(account.postsPerDay - daySlots.length, 0);
      const times = timesForDay(account, date, daySlots);
      const weekStart = weekStartIso(date);

      for (let index = 0; index < missingCount; index += 1) {
        const time = times[index];
        if (!time) break;

        const seed = `${account.id}:${date}:${time}:${index}`;
        const roleId = pickWeeklyRole(account, workingSlots, weekStart, seed);
        if (!roleId) break;

        const pillarId = pickFromTargets(
          resolveCompatiblePillarTargets(account.pillarTargets, roleId),
          context.pillarCounts,
          context,
          "pillar",
          seed,
          account.repetitionLimits,
        );
        const formatId = pickFromTargets(
          resolveCompatibleFormatTargets(
            account.formatTargets,
            roleId,
            pillarId,
            cameraPresence,
          ),
          context.formatCounts,
          context,
          "format",
          seed,
          account.repetitionLimits,
        );

        const slot: PlanningSlot = {
          id: `gen-${account.id}-${date}-${time.replace(":", "")}`,
          date,
          time,
          accountId: account.id,
          platforms: [...account.platforms],
          roleId,
          pillarId,
          formatId,
          status: "pendiente",
          distributionType: "organic",
          generated: true,
        };

        const key = slotKey(slot);
        if (existingKeys.has(key)) continue;

        existingKeys.add(key);
        generated.push(slot);
        workingSlots.push(slot);

        increment(context.pillarCounts, pillarId);
        increment(context.formatCounts, formatId);

        if (pillarId === context.lastPillar) {
          context.pillarStreak += 1;
        } else {
          context.lastPillar = pillarId;
          context.pillarStreak = 1;
        }

        context.lastFormat = formatId;
      }
    }
  }

  return generated;
}

export function mergePlanningSlots(
  existingSlots: PlanningSlot[],
  generatedSlots: PlanningSlot[],
): PlanningSlot[] {
  const merged = new Map<string, PlanningSlot>();

  for (const slot of existingSlots) {
    merged.set(slotKey(slot), slot);
  }

  for (const slot of generatedSlots) {
    const key = slotKey(slot);
    if (!merged.has(key)) {
      merged.set(key, slot);
    }
  }

  return [...merged.values()].sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      a.time.localeCompare(b.time) ||
      a.accountId.localeCompare(b.accountId),
  );
}

export function snapshotPlanningHorizonSlots(
  accounts: PlanningAccount[],
  todayIso: string,
): PlanningSlot[] {
  const horizon = toIsoDate(addDays(parseIsoDate(todayIso), 28));
  return generateMissingSlots({
    accounts,
    dateFrom: todayIso,
    dateTo: horizon,
    existingSlots: [],
  });
}

export function getCalendarSlots(
  existingSlots: PlanningSlot[],
  dateFrom: string,
  dateTo: string,
  accounts: PlanningAccount[] = [],
): PlanningSlot[] {
  const generated = generateMissingSlots({
    accounts,
    dateFrom,
    dateTo,
    existingSlots,
  });
  return mergePlanningSlots(existingSlots, generated);
}

export function getPlanningHorizonSlots(
  existingSlots: PlanningSlot[],
  accounts: PlanningAccount[],
  todayIso: string,
): PlanningSlot[] {
  const dates = existingSlots.map((slot) => slot.date);
  const from = dates.length
    ? dates.reduce((earliest, date) => (date < earliest ? date : earliest))
    : todayIso;
  const lastExisting = dates.length
    ? dates.reduce((latest, date) => (date > latest ? date : latest))
    : todayIso;
  const horizon = toIsoDate(addDays(parseIsoDate(todayIso), 28));
  const to = horizon > lastExisting ? horizon : lastExisting;
  return getCalendarSlots(existingSlots, from, to, accounts);
}
