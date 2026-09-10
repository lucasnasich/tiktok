import type { ContentRoleId } from "@/content/content-roles";
import {
  getPlanningAccountLabel,
  planningAccounts,
  type PlanningAccount,
} from "@/content/planning-accounts";
import { normalizeFormatTargets } from "@/content/formats";
import { normalizePillarTargets } from "@/content/planning-pillars";
import {
  createProfileDraft,
  resolveProfile,
  profileSettingsToAccount,
  type PlanningProfile,
} from "@/content/planning-profiles";
import type { DistributionType } from "@/content/planned-slots";
import type { RepetitionLimits } from "@/content/planning-accounts";
import type { PlanningWizardSession } from "@/lib/planning-wizard-session";

export type PlanningAccountOverride = {
  postsPerDay?: number;
  activeDays?: number[];
  timeSlots?: string[];
  roleTargets?: Partial<Record<ContentRoleId, number>>;
  pillarTargets?: Record<string, number>;
  formatTargets?: Record<string, number>;
  repetitionLimits?: RepetitionLimits;
  defaultDistributionType?: DistributionType;
  alternateRoles?: [ContentRoleId, ContentRoleId];
  conversionExceptional?: boolean;
};

export type PlanningConfigStore = {
  version: 4;
  setupCompleted: boolean;
  lastAccountId?: string;
  profiles: PlanningProfile[];
  accountProfileIds: Record<string, string>;
  /** Borrador del asistente por cuenta (persiste aunque no termines el wizard). */
  wizardSessions: Record<string, PlanningWizardSession>;
};

type LegacyPlanningConfigStore = {
  version?: number;
  setupCompleted?: boolean;
  lastAccountId?: string;
  accounts?: Record<string, PlanningAccountOverride>;
  customProfiles?: PlanningProfile[];
  accountProfileIds?: Record<string, string>;
};

export const PLANNING_CONFIG_STORAGE_KEY = "planning-config";

export const EMPTY_PLANNING_CONFIG: PlanningConfigStore = {
  version: 4,
  setupCompleted: false,
  profiles: [],
  accountProfileIds: {},
  wizardSessions: {},
};

function isUserProfile(profile: PlanningProfile): boolean {
  return !profile.id.startsWith("builtin:");
}

function sanitizeProfiles(profiles: PlanningProfile[]): PlanningProfile[] {
  return profiles.filter(isUserProfile).map((profile) => ({
    ...profile,
    builtIn: undefined,
  })) as PlanningProfile[];
}

function sanitizeAssignments(
  assignments: Record<string, string>,
  profiles: PlanningProfile[],
): Record<string, string> {
  const validIds = new Set(profiles.map((profile) => profile.id));
  const result: Record<string, string> = {};
  for (const [accountId, profileId] of Object.entries(assignments)) {
    if (!profileId.startsWith("builtin:") && validIds.has(profileId)) {
      result[accountId] = profileId;
    }
  }
  return result;
}

export function mergePlanningAccount(
  base: PlanningAccount,
  override?: PlanningAccountOverride,
): PlanningAccount {
  if (!override) return base;
  return profileSettingsToAccount(base, override);
}

export function getProfileIdForAccount(
  store: PlanningConfigStore,
  accountId: string,
): string | undefined {
  const profileId = store.accountProfileIds[accountId];
  if (!profileId) return undefined;
  return resolveProfile(profileId, store.profiles) ? profileId : undefined;
}

export function getProfileForAccount(
  store: PlanningConfigStore,
  accountId: string,
): PlanningProfile | undefined {
  const profileId = getProfileIdForAccount(store, accountId);
  if (!profileId) return undefined;
  return resolveProfile(profileId, store.profiles);
}

export function getEffectivePlanningAccounts(
  store: PlanningConfigStore = EMPTY_PLANNING_CONFIG,
): PlanningAccount[] {
  return planningAccounts.map((account) => {
    const profile = getProfileForAccount(store, account.id);
    if (!profile) return account;
    return mergePlanningAccount(account, profile.settings);
  });
}

function migrateLegacyStore(data: LegacyPlanningConfigStore): PlanningConfigStore {
  const profiles: PlanningProfile[] = [];
  const accountProfileIds: Record<string, string> = {};

  const legacyProfiles = [
    ...(data.customProfiles ?? []),
    ...((data as { profiles?: PlanningProfile[] }).profiles ?? []),
  ];

  for (const profile of legacyProfiles) {
    if (isUserProfile(profile)) {
      profiles.push({
        ...profile,
        settings: {
          ...profile.settings,
          pillarTargets: profile.settings.pillarTargets
            ? normalizePillarTargets(profile.settings.pillarTargets)
            : undefined,
          formatTargets: profile.settings.formatTargets
            ? normalizeFormatTargets(profile.settings.formatTargets)
            : undefined,
        },
      });
    }
  }

  if (data.accounts) {
    for (const [accountId, override] of Object.entries(data.accounts)) {
      const base = planningAccounts.find((a) => a.id === accountId);
      if (!base) continue;
      const profile = createProfileDraft(
        getPlanningAccountLabel(accountId),
        base.type,
        {
          ...override,
          pillarTargets: override.pillarTargets
            ? normalizePillarTargets(override.pillarTargets)
            : undefined,
          formatTargets: override.formatTargets
            ? normalizeFormatTargets(override.formatTargets)
            : undefined,
        },
      );
      profiles.push(profile);
      accountProfileIds[accountId] = profile.id;
    }
  }

  if (data.accountProfileIds) {
    for (const [accountId, profileId] of Object.entries(data.accountProfileIds)) {
      if (profileId.startsWith("builtin:")) continue;
      const existing = profiles.find((p) => p.id === profileId);
      if (existing) accountProfileIds[accountId] = profileId;
    }
  }

  return {
    version: 4,
    setupCompleted: Boolean(data.setupCompleted),
    lastAccountId: data.lastAccountId,
    profiles: sanitizeProfiles(profiles),
    accountProfileIds: sanitizeAssignments(accountProfileIds, profiles),
    wizardSessions: {},
  };
}

function sanitizeWizardSessions(
  sessions: Record<string, PlanningWizardSession> | undefined,
): Record<string, PlanningWizardSession> {
  if (!sessions || typeof sessions !== "object") return {};
  const result: Record<string, PlanningWizardSession> = {};
  for (const [accountId, session] of Object.entries(sessions)) {
    if (!session || typeof session !== "object") continue;
    if (session.accountId !== accountId) continue;
    result[accountId] = session;
  }
  return result;
}

export function parsePlanningConfigStore(raw: unknown): PlanningConfigStore {
  if (!raw || typeof raw !== "object") return EMPTY_PLANNING_CONFIG;
  const data = raw as LegacyPlanningConfigStore & {
    wizardSessions?: Record<string, PlanningWizardSession>;
  };

  if (!data.version || data.version < 3) {
    return migrateLegacyStore(data);
  }

  const profiles = sanitizeProfiles(
    (Array.isArray(data.profiles) ? data.profiles : []).map((profile) => ({
      ...profile,
      settings: {
        ...profile.settings,
        pillarTargets: profile.settings.pillarTargets
          ? normalizePillarTargets(profile.settings.pillarTargets)
          : undefined,
        formatTargets: profile.settings.formatTargets
          ? normalizeFormatTargets(profile.settings.formatTargets)
          : undefined,
      },
    })),
  );

  return {
    version: 4,
    setupCompleted: Boolean(data.setupCompleted),
    lastAccountId:
      typeof data.lastAccountId === "string" ? data.lastAccountId : undefined,
    profiles,
    accountProfileIds: sanitizeAssignments(
      data.accountProfileIds ?? {},
      profiles,
    ),
    wizardSessions: sanitizeWizardSessions(data.wizardSessions),
  };
}

export function accountToOverride(account: PlanningAccount): PlanningAccountOverride {
  return {
    postsPerDay: account.postsPerDay,
    activeDays: [...account.activeDays],
    timeSlots: [...account.timeSlots],
    roleTargets: { ...account.roleTargets },
    pillarTargets: { ...account.pillarTargets },
    formatTargets: { ...account.formatTargets },
    repetitionLimits: { ...account.repetitionLimits },
    defaultDistributionType: account.defaultDistributionType,
    alternateRoles: account.alternateRoles,
    conversionExceptional: account.conversionExceptional,
  };
}
