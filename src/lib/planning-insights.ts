import { getAngleLabel } from "@/content/angles";
import type { ContentRoleId } from "@/content/content-roles";
import { getContentRoleLabel, normalizeRoleId } from "@/content/content-roles";
import { getFormatById } from "@/content/formats";
import type { PlanningAccount } from "@/content/planning-accounts";
import {
  PLANNING_ALL_ACCOUNTS_ID,
  getPlanningAccountLabel,
} from "@/content/planning-accounts";
import {
  getPlanningPillarLabel,
  normalizePillarId,
  normalizePillarTargets,
} from "@/content/planning-pillars";
import { slotMatchesAccount, type PlanningSlot } from "@/content/planned-slots";
import { isActiveDay } from "@/lib/planning-generator";
import { filterSlotsByDates } from "@/lib/planning-slot-utils";

export type PlanningInsightKind = "gap" | "variety" | "warning";

export type PlanningInsight = {
  id: string;
  kind: PlanningInsightKind;
  message: string;
  accountId?: string;
};

function slotsForDate(
  slots: PlanningSlot[],
  accountId: string,
  date: string,
): PlanningSlot[] {
  return slots.filter(
    (slot) => slot.accountId === accountId && slot.date === date,
  );
}

function countBy<T extends string>(
  slots: PlanningSlot[],
  pick: (slot: PlanningSlot) => T,
): Map<T, number> {
  const counts = new Map<T, number>();
  for (const slot of slots) {
    const key = pick(slot);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function computeDailyGaps(
  account: PlanningAccount,
  slots: PlanningSlot[],
  date: string,
): PlanningInsight[] {
  if (!isActiveDay(account, date)) return [];

  const insights: PlanningInsight[] = [];
  const daySlots = slotsForDate(slots, account.id, date);
  const missingPieces = account.postsPerDay - daySlots.length;

  if (missingPieces > 0) {
    insights.push({
      id: `${account.id}-${date}-pieces`,
      kind: "gap",
      accountId: account.id,
      message: `${account.label} · faltan ${missingPieces} pieza${missingPieces > 1 ? "s" : ""} hoy`,
    });
  }

  return insights;
}

function detectTargetDrift(
  account: PlanningAccount,
  periodSlots: PlanningSlot[],
): PlanningInsight[] {
  const insights: PlanningInsight[] = [];
  const total = periodSlots.length;
  if (total < 4) return insights;

  const roleCounts = countBy(periodSlots, (slot) =>
    normalizeRoleId(slot.roleId),
  );
  for (const [roleId, targetPercent] of Object.entries(account.roleTargets)) {
    if (!targetPercent) continue;
    const actual = ((roleCounts.get(roleId as ContentRoleId) ?? 0) / total) * 100;
    const drift = actual - targetPercent;
    if (drift < -15) {
      insights.push({
        id: `${account.id}-role-drift-${roleId}`,
        kind: "gap",
        accountId: account.id,
        message: `Poco ${getContentRoleLabel(roleId as ContentRoleId)} en el período (${Math.round(actual)}% vs ${targetPercent}% objetivo)`,
      });
    }
    if (drift > 20) {
      insights.push({
        id: `${account.id}-role-heavy-${roleId}`,
        kind: "variety",
        accountId: account.id,
        message: `Demasiado ${getContentRoleLabel(roleId as ContentRoleId)} en el período (${Math.round(actual)}% vs ${targetPercent}% objetivo)`,
      });
    }
  }

  const pillarCounts = countBy(periodSlots, (slot) =>
    normalizePillarId(slot.pillarId),
  );
  for (const [pillarId, targetPercent] of Object.entries(
    normalizePillarTargets(account.pillarTargets),
  )) {
    const actual = ((pillarCounts.get(pillarId) ?? 0) / total) * 100;
    if (targetPercent > 0 && actual === 0 && total >= 7) {
      insights.push({
        id: `${account.id}-pillar-missing-${pillarId}`,
        kind: "gap",
        accountId: account.id,
        message: `Falta pilar ${getPlanningPillarLabel(pillarId)} en el período (${account.label})`,
      });
    }
  }

  const formatCounts = countBy(periodSlots, (slot) => slot.formatId);
  const dominantFormat = [...formatCounts.entries()].sort(
    (a, b) => b[1] - a[1],
  )[0];
  const dominantFormatDef = dominantFormat
    ? getFormatById(dominantFormat[0])
    : undefined;
  if (
    dominantFormat &&
    dominantFormatDef &&
    dominantFormat[1] >= account.repetitionLimits.maxSameFormatInPeriod
  ) {
    insights.push({
      id: `${account.id}-format-${dominantFormat[0]}`,
      kind: "warning",
      accountId: account.id,
      message: `Repetimos mucho el formato ${dominantFormatDef.label} (${account.label})`,
    });
  }

  return insights;
}

function detectPillarStreaks(
  periodSlots: PlanningSlot[],
  account: PlanningAccount,
): PlanningInsight[] {
  const ordered = [...periodSlots]
    .filter((slot) => slot.accountId === account.id)
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        a.time.localeCompare(b.time) ||
        a.id.localeCompare(b.id),
    );

  let streakPillar: string | null = null;
  let streakLength = 0;

  for (const slot of ordered) {
    const pillarId = normalizePillarId(slot.pillarId);
    if (pillarId === streakPillar) {
      streakLength += 1;
    } else {
      streakPillar = pillarId;
      streakLength = 1;
    }

    if (streakLength > account.repetitionLimits.maxConsecutiveSamePillar) {
      return [
        {
          id: `${account.id}-pillar-streak-${pillarId}`,
          kind: "warning",
          accountId: account.id,
          message: `Demasiados posts seguidos sobre ${getPlanningPillarLabel(pillarId)} (${account.label})`,
        },
      ];
    }
  }

  return [];
}

function detectAngleVariety(
  periodSlots: PlanningSlot[],
  account: PlanningAccount,
): PlanningInsight[] {
  const angles = periodSlots
    .filter((slot) => slot.accountId === account.id && slot.angleId)
    .map((slot) => slot.angleId!);

  if (angles.length < 4) return [];

  const angleCounts = countBy(
    periodSlots.filter((slot) => slot.angleId),
    (slot) => slot.angleId!,
  );

  const comparacionCount = angleCounts.get("comparacion") ?? 0;
  if (comparacionCount === 0) {
    return [
      {
        id: `${account.id}-angle-comparacion`,
        kind: "variety",
        accountId: account.id,
        message: `En este período casi no usamos ${getAngleLabel("comparacion")} en ideas ya asignadas (${account.label})`,
      },
    ];
  }

  return [];
}

export function computePlanningInsights({
  slots,
  accounts = [],
  rangeDates,
  todayIso,
  accountFilter = PLANNING_ALL_ACCOUNTS_ID,
}: {
  slots: PlanningSlot[];
  accounts?: PlanningAccount[];
  rangeDates: string[];
  todayIso: string;
  accountFilter?: string;
}): PlanningInsight[] {
  const visibleAccounts =
    accountFilter === PLANNING_ALL_ACCOUNTS_ID
      ? accounts
      : accounts.filter((account) => account.id === accountFilter);

  const periodSlots = filterSlotsByDates(slots, rangeDates);
  const insights: PlanningInsight[] = [];

  for (const account of visibleAccounts) {
    insights.push(...computeDailyGaps(account, periodSlots, todayIso));
    insights.push(
      ...detectTargetDrift(
        account,
        periodSlots.filter((slot) => slotMatchesAccount(slot, account.id)),
      ),
    );
    insights.push(...detectPillarStreaks(periodSlots, account));
    insights.push(...detectAngleVariety(periodSlots, account));

    const expectedPieces = rangeDates.filter((date) =>
      isActiveDay(account, date),
    ).length * account.postsPerDay;
    const actualPieces = periodSlots.filter((slot) =>
      slotMatchesAccount(slot, account.id),
    ).length;
    const missingInPeriod = expectedPieces - actualPieces;

    if (missingInPeriod > 0 && rangeDates.length > 1) {
      insights.push({
        id: `${account.id}-period-pieces`,
        kind: "gap",
        accountId: account.id,
        message: `${getPlanningAccountLabel(account.id)} · faltan ${missingInPeriod} piezas en el período visible`,
      });
    }
  }

  const seen = new Set<string>();
  return insights.filter((insight) => {
    if (seen.has(insight.message)) return false;
    seen.add(insight.message);
    return true;
  });
}
