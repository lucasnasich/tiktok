import type { ContentRoleId } from "@/content/content-roles";
import type { PlanningAccount } from "@/content/planning-accounts";
import { planningAccounts } from "@/content/planning-accounts";
import type { PlanningSlot } from "@/content/planned-slots";
import { normalizePillarId } from "@/content/planning-pillars";
import { addDays, parseIsoDate, toIsoDate } from "@/lib/planning-dates";

export type GenerateSlotsInput = {
  accounts?: PlanningAccount[];
  dateFrom: string;
  dateTo: string;
  existingSlots: PlanningSlot[];
};

type CountMap = Record<string, number>;

type GeneratorContext = {
  pillarCounts: CountMap;
  formatCounts: CountMap;
  roleCounts: CountMap;
  lastPillar: string | null;
  lastRole: ContentRoleId | null;
  lastFormat: string | null;
  roleStreak: number;
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

function slotKey(slot: Pick<PlanningSlot, "accountId" | "date" | "time">): string {
  return `${slot.accountId}:${slot.date}:${slot.time}`;
}

function increment(map: CountMap, key: string) {
  map[key] = (map[key] ?? 0) + 1;
}

function initContext(slots: PlanningSlot[]): GeneratorContext {
  const context: GeneratorContext = {
    pillarCounts: {},
    formatCounts: {},
    roleCounts: {},
    lastPillar: null,
    lastRole: null,
    lastFormat: null,
    roleStreak: 0,
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
    increment(context.roleCounts, slot.roleId);

    const pillarId = normalizePillarId(slot.pillarId);
    if (pillarId === context.lastPillar) {
      context.pillarStreak += 1;
    } else {
      context.lastPillar = pillarId;
      context.pillarStreak = 1;
    }

    if (slot.roleId === context.lastRole) {
      context.roleStreak += 1;
    } else {
      context.lastRole = slot.roleId;
      context.roleStreak = 1;
    }

    context.lastFormat = slot.formatId;
  }

  return context;
}

function alternateRoleForDate(
  account: PlanningAccount,
  date: string,
): ContentRoleId {
  const [roleA, roleB] = account.alternateRoles ?? ["prueba", "conversion"];
  return stableHash(`${account.id}:${date}`) % 2 === 0 ? roleA : roleB;
}

export function getIdealDailyRoles(
  account: PlanningAccount,
  date: string,
): ContentRoleId[] {
  const roles: ContentRoleId[] = [];

  if (account.type === "official") {
    roles.push("alcance", "valor");
    roles.push(alternateRoleForDate(account, date));
    return roles.slice(0, account.postsPerDay);
  }

  const alcanceCount = Math.round(
    (account.postsPerDay * (account.roleTargets.alcance ?? 67)) / 100,
  );
  const valorCount = account.postsPerDay - alcanceCount;

  for (let index = 0; index < alcanceCount; index += 1) roles.push("alcance");
  for (let index = 0; index < valorCount; index += 1) roles.push("valor");

  return roles.slice(0, account.postsPerDay);
}

function missingRolesForDay(
  account: PlanningAccount,
  date: string,
  daySlots: PlanningSlot[],
): ContentRoleId[] {
  const ideal = getIdealDailyRoles(account, date);
  const remaining = [...ideal];

  for (const slot of daySlots) {
    const index = remaining.indexOf(slot.roleId);
    if (index >= 0) remaining.splice(index, 1);
  }

  return remaining;
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
    return Object.keys(targets)[0] ?? "producto-mercantis";
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

function pickRole(
  account: PlanningAccount,
  role: ContentRoleId,
  context: GeneratorContext,
): ContentRoleId {
  if (
    context.lastRole === role &&
    context.roleStreak >= account.repetitionLimits.maxSameRoleInRow
  ) {
    const alternatives = Object.entries(account.roleTargets)
      .filter(([roleId, weight]) => weight && roleId !== role)
      .map(([roleId]) => roleId as ContentRoleId);

    if (alternatives.length > 0) {
      return alternatives[stableHash(role) % alternatives.length];
    }
  }

  return role;
}

function availableTimes(account: PlanningAccount, daySlots: PlanningSlot[]): string[] {
  const used = new Set(daySlots.map((slot) => slot.time));
  return account.timeSlots.filter((time) => !used.has(time));
}

export function generateMissingSlots({
  accounts = planningAccounts,
  dateFrom,
  dateTo,
  existingSlots,
}: GenerateSlotsInput): PlanningSlot[] {
  const existingKeys = new Set(existingSlots.map(slotKey));
  const generated: PlanningSlot[] = [];
  const context = initContext(existingSlots);
  const dates = enumerateDates(dateFrom, dateTo);

  for (const account of accounts) {
    for (const date of dates) {
      if (!isActiveDay(account, date)) continue;

      const daySlots = existingSlots
        .filter((slot) => slot.accountId === account.id && slot.date === date)
        .sort((a, b) => a.time.localeCompare(b.time));

      const missingRoles = missingRolesForDay(account, date, daySlots);
      const times = availableTimes(account, daySlots);

      missingRoles.forEach((roleNeeded, index) => {
        const time = times[index];
        if (!time) return;

        const seed = `${account.id}:${date}:${time}:${index}`;
        const roleId = pickRole(account, roleNeeded, context);
        const pillarId = pickFromTargets(
          account.pillarTargets,
          context.pillarCounts,
          context,
          "pillar",
          seed,
          account.repetitionLimits,
        );
        const formatId = pickFromTargets(
          account.formatTargets,
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
          distributionType: account.defaultDistributionType,
          generated: true,
        };

        const key = slotKey(slot);
        if (existingKeys.has(key)) return;

        existingKeys.add(key);
        generated.push(slot);

        increment(context.pillarCounts, pillarId);
        increment(context.formatCounts, formatId);
        increment(context.roleCounts, roleId);

        if (pillarId === context.lastPillar) {
          context.pillarStreak += 1;
        } else {
          context.lastPillar = pillarId;
          context.pillarStreak = 1;
        }

        if (roleId === context.lastRole) {
          context.roleStreak += 1;
        } else {
          context.lastRole = roleId;
          context.roleStreak = 1;
        }

        context.lastFormat = formatId;
      });
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

export function getCalendarSlots(
  existingSlots: PlanningSlot[],
  dateFrom: string,
  dateTo: string,
  accounts = planningAccounts,
): PlanningSlot[] {
  const generated = generateMissingSlots({
    accounts,
    dateFrom,
    dateTo,
    existingSlots,
  });
  return mergePlanningSlots(existingSlots, generated);
}
