import { getAngleLabel } from "@/content/angles";
import type { ContentRoleId } from "@/content/content-roles";
import { getContentRoleLabel, normalizeRoleId, normalizeRoleTargets } from "@/content/content-roles";
import {
  PLANNING_ALL_ACCOUNTS_ID,
  getPlanningAccountLabel,
  type PlanningAccount,
} from "@/content/planning-accounts";
import { getPublicationTypeLabel } from "@/content/publication-types";
import {
  getSlotTopicLabel,
  resolveSlotTopicId,
  topicTargetsForRole,
} from "@/content/role-topics";
import {
  resolveSlotPublicationType,
  slotMatchesAccount,
  type PlanningSlot,
} from "@/content/planned-slots";
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
  for (const [roleId, targetPercent] of Object.entries(
    normalizeRoleTargets(account.roleTargets),
  )) {
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

  const topicCounts = countBy(periodSlots, (slot) => resolveSlotTopicId(slot));
  for (const [roleId, targetPercent] of Object.entries(
    normalizeRoleTargets(account.roleTargets),
  )) {
    if (!targetPercent) continue;
    const topicWeights = topicTargetsForRole(
      account.roleTopicPreferences,
      roleId,
    );
    const altaTopics = Object.entries(topicWeights)
      .filter(([, weight]) => weight >= 30)
      .map(([topicId]) => topicId);
    if (altaTopics.length === 0 || total < 10) continue;
    const missingAlta = altaTopics.find(
      (topicId) => (topicCounts.get(topicId) ?? 0) === 0,
    );
    if (missingAlta) {
      insights.push({
        id: `${account.id}-topic-missing-${roleId}-${missingAlta}`,
        kind: "gap",
        accountId: account.id,
        message: `Poco ${getSlotTopicLabel({ roleId, topicId: missingAlta })} en el período (${account.label})`,
      });
    }
  }

  const typeCounts = countBy(periodSlots, (slot) =>
    resolveSlotPublicationType(slot),
  );
  const dominantType = [...typeCounts.entries()].sort(
    (a, b) => b[1] - a[1],
  )[0];
  const maxSameType =
    account.repetitionLimits.maxSamePublicationTypeInPeriod ??
    account.repetitionLimits.maxSameFormatInPeriod;
  if (dominantType && dominantType[1] >= maxSameType) {
    insights.push({
      id: `${account.id}-publication-${dominantType[0]}`,
      kind: "warning",
      accountId: account.id,
      message: `Repetimos mucho el tipo ${getPublicationTypeLabel(dominantType[0])} (${account.label})`,
    });
  }

  return insights;
}

function detectTopicStreaks(
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

  let streakTopic: string | null = null;
  let streakLength = 0;
  const maxStreak =
    account.repetitionLimits.maxConsecutiveSameTopic ??
    account.repetitionLimits.maxConsecutiveSamePillar;

  for (const slot of ordered) {
    const topicId = resolveSlotTopicId(slot);
    if (topicId === streakTopic) {
      streakLength += 1;
    } else {
      streakTopic = topicId;
      streakLength = 1;
    }

    if (streakLength > maxStreak) {
      return [
        {
          id: `${account.id}-topic-streak-${topicId}`,
          kind: "warning",
          accountId: account.id,
          message: `Demasiados posts seguidos sobre ${getSlotTopicLabel(slot)} (${account.label})`,
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
    insights.push(...detectTopicStreaks(periodSlots, account));
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
