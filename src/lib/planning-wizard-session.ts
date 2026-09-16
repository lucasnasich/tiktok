import type { PlanningAccount } from "@/content/planning-accounts";
import { profileSettingsToAccount } from "@/content/planning-profiles";
import {
  PILLAR_PRIORITY_WEIGHT,
  type PillarPriority,
} from "@/content/planning-setup-guide";
import {
  accountToOverride,
  type PlanningAccountOverride,
} from "@/lib/planning-config-store";
import { normalizePercentTargets } from "@/lib/planning-percent";

export type PlanningWizardSession = {
  accountId: string;
  profileId?: string;
  profileLabel: string;
  stepIndex: number;
  settings: PlanningAccountOverride;
  pillarPriorities: Record<string, PillarPriority>;
  /** Legacy: el wizard ya no selecciona formatos creativos. */
  selectedFormatIds: string[];
  updatedAt: number;
};

export function getWizardDraftProfileId(accountId: string): string {
  return `draft:${accountId}`;
}

export function isWizardDraftProfileId(profileId: string): boolean {
  return profileId.startsWith("draft:");
}

export const WIZARD_DRAFT_SESSION_KEY = "wizard:draft";

export function wizardSessionKey(profileId?: string): string {
  if (profileId && !isWizardDraftProfileId(profileId)) return profileId;
  return WIZARD_DRAFT_SESSION_KEY;
}

export function buildMergedWizardAccount(
  draft: PlanningAccount,
  pillarPriorities: Record<string, PillarPriority>,
  relevantPillarIds: string[],
): PlanningAccount {
  const pillarWeights: Record<string, number> = {};
  for (const pillarId of relevantPillarIds) {
    const priority = pillarPriorities[pillarId] ?? "media";
    pillarWeights[pillarId] = PILLAR_PRIORITY_WEIGHT[priority];
  }

  return {
    ...draft,
    pillarTargets:
      relevantPillarIds.length > 0
        ? normalizePercentTargets(pillarWeights)
        : draft.pillarTargets,
  };
}

export function sessionToAccount(
  base: PlanningAccount,
  session: PlanningWizardSession,
): PlanningAccount {
  return profileSettingsToAccount(base, session.settings);
}

export function buildWizardSessionSnapshot({
  accountId,
  profileId,
  profileLabel,
  stepIndex,
  draft,
  pillarPriorities,
  relevantPillarIds,
}: {
  accountId: string;
  profileId?: string;
  profileLabel: string;
  stepIndex: number;
  draft: PlanningAccount;
  pillarPriorities: Record<string, PillarPriority>;
  relevantPillarIds: string[];
  selectedFormatIds?: string[];
}): PlanningWizardSession {
  const merged = buildMergedWizardAccount(
    draft,
    pillarPriorities,
    relevantPillarIds,
  );

  return {
    accountId,
    profileId: profileId ?? getWizardDraftProfileId(accountId),
    profileLabel,
    stepIndex,
    settings: accountToOverride(merged),
    pillarPriorities,
    selectedFormatIds: [],
    updatedAt: Date.now(),
  };
}

export function buildPillarPrioritiesFromTargets(
  account: PlanningAccount,
): Record<string, PillarPriority> {
  const result: Record<string, PillarPriority> = {};
  for (const [id, value] of Object.entries(account.pillarTargets)) {
    if (value >= 25) result[id] = "alta";
    else if (value >= 12) result[id] = "media";
    else if (value > 0) result[id] = "baja";
    else result[id] = "no";
  }
  return result;
}
