import type { ContentRoleId } from "@/content/content-roles";
import {
  planningAccounts,
  type PlanningAccount,
  type PlanningAccountType,
} from "@/content/planning-accounts";
import {
  DEFAULT_REPETITION_LIMITS,
  DEFAULT_DISTRIBUTION_TYPE,
} from "@/content/planning-defaults";
import { normalizeFormatTargets } from "@/content/formats";
import { normalizePillarTargets } from "@/content/planning-pillars";
import type { PlanningAccountOverride } from "@/lib/planning-config-store";

export type PlanningProfile = {
  id: string;
  label: string;
  description: string;
  accountTypes: PlanningAccountType[];
  settings: PlanningAccountOverride;
};

function accountToSettings(account: PlanningAccount): PlanningAccountOverride {
  return {
    platforms: [...account.platforms],
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

export function getProfilesForAccountType(
  accountType: PlanningAccountType,
  profiles: PlanningProfile[] = [],
): PlanningProfile[] {
  return profiles.filter((profile) =>
    profile.accountTypes.includes(accountType),
  );
}

export function resolveProfile(
  profileId: string,
  profiles: PlanningProfile[],
): PlanningProfile | undefined {
  return profiles.find((profile) => profile.id === profileId);
}

export function profileSettingsToAccount(
  baseAccount: PlanningAccount,
  settings: PlanningAccountOverride,
): PlanningAccount {
  return {
    ...baseAccount,
    platforms: settings.platforms ?? baseAccount.platforms,
    postsPerDay: settings.postsPerDay ?? baseAccount.postsPerDay,
    activeDays: settings.activeDays ?? baseAccount.activeDays,
    timeSlots: settings.timeSlots ?? baseAccount.timeSlots,
    roleTargets: { ...baseAccount.roleTargets, ...settings.roleTargets },
    pillarTargets: normalizePillarTargets({
      ...baseAccount.pillarTargets,
      ...settings.pillarTargets,
    }),
    formatTargets: normalizeFormatTargets({
      ...baseAccount.formatTargets,
      ...settings.formatTargets,
    }),
    repetitionLimits: {
      ...baseAccount.repetitionLimits,
      ...settings.repetitionLimits,
    },
    defaultDistributionType:
      settings.defaultDistributionType ?? baseAccount.defaultDistributionType,
    alternateRoles: settings.alternateRoles ?? baseAccount.alternateRoles,
    conversionExceptional:
      settings.conversionExceptional ?? baseAccount.conversionExceptional,
  };
}

export function accountToProfileSettings(
  account: PlanningAccount,
): PlanningAccountOverride {
  return accountToSettings(account);
}

/** Plantilla vacía para un perfil nuevo — solo estructura de cuenta, sin mix editorial impuesto. */
export function createProfileDraft(
  label: string,
  accountType: PlanningAccountType,
  settings?: PlanningAccountOverride,
): PlanningProfile {
  const templateAccount = planningAccounts.find((a) => a.type === accountType)!;
  return {
    id: `profile:${Date.now()}`,
    label,
    description: "",
    accountTypes: [accountType],
    settings:
      settings ??
      accountToSettings({
        ...templateAccount,
        roleTargets: {} as Partial<Record<ContentRoleId, number>>,
        pillarTargets: {},
        formatTargets: {},
        repetitionLimits: { ...DEFAULT_REPETITION_LIMITS },
        defaultDistributionType: DEFAULT_DISTRIBUTION_TYPE,
        alternateRoles: undefined,
        conversionExceptional: accountType === "satellite",
      }),
  };
}

export function formatProfileRoleSummary(
  settings: PlanningAccountOverride,
): string {
  const targets = settings.roleTargets ?? {};
  const parts = Object.entries(targets).filter(([, value]) => value && value > 0);
  if (parts.length === 0) return "Sin roles definidos";
  return parts.map(([id, value]) => `${id} ${value}%`).join(" · ");
}
