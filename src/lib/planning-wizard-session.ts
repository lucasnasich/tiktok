import type { PlanningAccount } from "@/content/planning-accounts";
import { profileSettingsToAccount } from "@/content/planning-profiles";
import { normalizeRoleTopicPreferences } from "@/content/role-topics";
import {
  accountToProfileOverride,
  type PlanningAccountOverride,
} from "@/lib/planning-config-store";

export type PlanningWizardSession = {
  accountId: string;
  profileId?: string;
  profileLabel: string;
  stepIndex: number;
  settings: PlanningAccountOverride;
  /** Legacy: el mix de pilares ya no se configura en el wizard. */
  pillarPriorities?: Record<string, "alta" | "media" | "baja" | "no">;
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

export function sessionToAccount(
  base: PlanningAccount,
  session: PlanningWizardSession,
): PlanningAccount {
  return profileSettingsToAccount(base, {
    ...session.settings,
    roleTopicPreferences: normalizeRoleTopicPreferences(
      session.settings.roleTopicPreferences,
      session.settings.pillarTargets,
    ),
  });
}

export function buildWizardSessionSnapshot({
  accountId,
  profileId,
  profileLabel,
  stepIndex,
  draft,
}: {
  accountId: string;
  profileId?: string;
  profileLabel: string;
  stepIndex: number;
  draft: PlanningAccount;
}): PlanningWizardSession {
  return {
    accountId,
    profileId: profileId ?? getWizardDraftProfileId(accountId),
    profileLabel,
    stepIndex,
    settings: accountToProfileOverride(draft),
    pillarPriorities: {},
    selectedFormatIds: [],
    updatedAt: Date.now(),
  };
}
