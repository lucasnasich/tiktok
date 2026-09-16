import type { CameraPresenceMode } from "@/content/camera-presence";
import {
  cameraModeFromPresence,
  presenceFromCameraMode,
} from "@/content/camera-presence";
import {
  normalizeRoleId,
  normalizeRoleTargets,
  type ContentRoleId,
} from "@/content/content-roles";
import type { PlanningAccount } from "@/content/planning-accounts";
import {
  resolveSlotProductionType,
  type PlanningSlot,
} from "@/content/planned-slots";
import {
  ROLE_TOPIC_FALLBACKS,
  resolveSlotTopicId,
  topicTargetsForRole,
} from "@/content/role-topics";
import { hasPositiveTargets } from "@/content/slot-compatibility";
import {
  enabledProductionTargets,
  normalizeProductionConfig,
  productionTargetsForRole,
  type ProductionOptionId,
} from "@/content/production-options";
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
  topicCounts: CountMap;
  publicationTypeCounts: CountMap;
  lastTopic: string | null;
  lastPublicationType: string | null;
  topicStreak: number;
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
    topicCounts: {},
    publicationTypeCounts: {},
    lastTopic: null,
    lastPublicationType: null,
    topicStreak: 0,
  };

  const ordered = [...slots].sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      a.time.localeCompare(b.time) ||
      a.id.localeCompare(b.id),
  );

  for (const slot of ordered) {
    const topicId = resolveSlotTopicId(slot);
    increment(context.topicCounts, topicId);
    const publicationTypeId = resolveSlotProductionType(slot);
    increment(context.publicationTypeCounts, publicationTypeId);

    if (topicId === context.lastTopic) {
      context.topicStreak += 1;
    } else {
      context.lastTopic = topicId;
      context.topicStreak = 1;
    }

    context.lastPublicationType = publicationTypeId;
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

    if (!hasPositiveTargets(topicTargetsForRole(account.roleTopicPreferences, id))) {
      deficit -= 2000;
    }

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
  kind: "topic" | "productionType",
  seed: string,
  limits: PlanningAccount["repetitionLimits"],
): string {
  const entries = Object.entries(targets).filter(([, weight]) => weight > 0);
  if (entries.length === 0) {
    if (kind === "productionType") {
      return "single_image";
    }
    return entries[0]?.[0] ?? "producto_en_construccion";
  }

  const maxSameType =
    limits.maxSameProductionTypeInPeriod ??
    limits.maxSamePublicationTypeInPeriod ??
    3;
  const maxSameTopic =
    limits.maxConsecutiveSameTopic ?? limits.maxConsecutiveSamePillar;

  const scored = entries
    .map(([id, target]) => {
      const actual = counts[id] ?? 0;
      let score = actual / target;

      if (kind === "topic") {
        if (id === context.lastTopic) {
          score += context.topicStreak >= maxSameTopic ? 2 : 0.35;
        }
      }

      if (kind === "productionType") {
        if (id === context.lastPublicationType) score += 0.25;
        if ((counts[id] ?? 0) >= maxSameType) score += 3;
      }

      return { id, score };
    })
    .sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      return stableHash(`${seed}:${a.id}`) - stableHash(`${seed}:${b.id}`);
    });

  return scored[0]?.id ?? entries[0][0];
}

function pickTopicForRole(
  account: PlanningAccount,
  roleId: ContentRoleId,
  context: GeneratorContext,
  seed: string,
): string {
  const targets = topicTargetsForRole(account.roleTopicPreferences, roleId);
  if (!hasPositiveTargets(targets)) {
    return ROLE_TOPIC_FALLBACKS[roleId];
  }
  return pickFromTargets(
    targets,
    context.topicCounts,
    context,
    "topic",
    seed,
    account.repetitionLimits,
  );
}

function resolveCompatibleProductionTargets(
  account: PlanningAccount,
  roleId: ContentRoleId,
): Partial<Record<ProductionOptionId, number>> {
  const config = normalizeProductionConfig({
    cameraMode: account.cameraMode,
    enabledIds: account.productionEnabledIds,
    targets: account.productionTypeTargets,
    publicationTypeTargets: account.publicationTypeTargets,
  });
  const withRole = productionTargetsForRole(config, roleId);
  if (hasPositiveTargets(withRole)) return withRole;
  const fallback = enabledProductionTargets(config);
  if (hasPositiveTargets(fallback)) return fallback;
  return { single_image: 100 };
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

        const topicId = pickTopicForRole(account, roleId, context, seed);
        const productionTypeId = pickFromTargets(
          resolveCompatibleProductionTargets(account, roleId) as Record<
            string,
            number
          >,
          context.publicationTypeCounts,
          context,
          "productionType",
          seed,
          account.repetitionLimits,
        ) as ProductionOptionId;

        const slot: PlanningSlot = {
          id: `gen-${account.id}-${date}-${time.replace(":", "")}`,
          date,
          time,
          accountId: account.id,
          platforms: [...account.platforms],
          roleId,
          topicId,
          productionTypeId,
          publicationTypeId: productionTypeId,
          status: "pendiente",
          distributionType: "organic",
          generated: true,
          cameraPresence: presenceFromCameraMode(
            account.cameraMode ?? cameraModeFromPresence(cameraPresence),
          ),
        };

        const key = slotKey(slot);
        if (existingKeys.has(key)) continue;

        existingKeys.add(key);
        generated.push(slot);
        workingSlots.push(slot);

        increment(context.topicCounts, topicId);
        increment(context.publicationTypeCounts, productionTypeId);

        if (topicId === context.lastTopic) {
          context.topicStreak += 1;
        } else {
          context.lastTopic = topicId;
          context.topicStreak = 1;
        }

        context.lastPublicationType = productionTypeId;
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
