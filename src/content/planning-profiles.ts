import {
  getContentRoleLabel,
  normalizeRoleId,
  normalizeRoleTargets,
  type ContentRoleId,
} from "@/content/content-roles";
import {
  createPlanningAccountTemplate,
  type PlanningAccount,
  type PlanningAccountType,
} from "@/content/planning-accounts";
import {
  DEFAULT_REPETITION_LIMITS,
  DEFAULT_DISTRIBUTION_TYPE,
} from "@/content/planning-defaults";
import { normalizeFormatTargets } from "@/content/formats";
import { normalizePillarTargets } from "@/content/planning-pillars";
import { normalizeProductionConfig } from "@/content/production-options";
import { buildOfficialBalancedEditorialDefaults } from "@/content/planning-presets";
import { normalizeRoleTopicPreferences } from "@/content/role-topics";
import type { PlanningAccountOverride } from "@/lib/planning-config-store";
import { isWizardDraftProfileId } from "@/lib/planning-wizard-session";

/** Perfiles aplican a cualquier cuenta; el tipo vive en la cuenta, no en el perfil. */
export const PROFILE_ACCOUNT_TYPES: PlanningAccountType[] = [
  "official",
  "satellite",
];

export type PlanningProfile = {
  id: string;
  label: string;
  description: string;
  accountTypes: PlanningAccountType[];
  settings: PlanningAccountOverride;
};

function accountToSettings(account: PlanningAccount): PlanningAccountOverride {
  const production = normalizeProductionConfig({
    cameraMode: account.cameraMode,
    enabledIds: account.productionEnabledIds,
    targets: account.productionTypeTargets,
    publicationTypeTargets: account.publicationTypeTargets,
  });
  return {
    roleTargets: { ...account.roleTargets },
    roleTopicPreferences: account.roleTopicPreferences,
    pillarTargets: { ...account.pillarTargets },
    formatTargets: { ...account.formatTargets },
    cameraMode: production.cameraMode,
    productionEnabledIds: production.enabledIds,
    productionTypeTargets: production.targets,
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
  return profiles.filter(
    (profile) =>
      profile.accountTypes.includes(accountType) &&
      !isWizardDraftProfileId(profile.id),
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
  const production = normalizeProductionConfig({
    cameraMode:
      settings.cameraMode ??
      settings.cameraPresence ??
      baseAccount.cameraMode,
    enabledIds: settings.productionEnabledIds ?? baseAccount.productionEnabledIds,
    targets: settings.productionTypeTargets ?? baseAccount.productionTypeTargets,
    publicationTypeTargets:
      settings.publicationTypeTargets ?? baseAccount.publicationTypeTargets,
  });
  return {
    ...baseAccount,
    roleTargets: normalizeRoleTargets({
      ...baseAccount.roleTargets,
      ...settings.roleTargets,
    }),
    roleTopicPreferences: normalizeRoleTopicPreferences(
      settings.roleTopicPreferences ?? baseAccount.roleTopicPreferences,
      settings.pillarTargets ?? baseAccount.pillarTargets,
    ),
    pillarTargets: normalizePillarTargets({
      ...baseAccount.pillarTargets,
      ...settings.pillarTargets,
    }),
    formatTargets: normalizeFormatTargets({
      ...baseAccount.formatTargets,
      ...settings.formatTargets,
    }),
    cameraMode: production.cameraMode,
    productionEnabledIds: production.enabledIds,
    productionTypeTargets: production.targets,
    publicationTypeTargets: production.targets,
    repetitionLimits: {
      ...baseAccount.repetitionLimits,
      ...settings.repetitionLimits,
    },
    defaultDistributionType:
      settings.defaultDistributionType ?? baseAccount.defaultDistributionType,
    alternateRoles: settings.alternateRoles
      ? ([
          normalizeRoleId(settings.alternateRoles[0]),
          normalizeRoleId(settings.alternateRoles[1]),
        ] as [ContentRoleId, ContentRoleId])
      : baseAccount.alternateRoles,
    conversionExceptional:
      settings.conversionExceptional ?? baseAccount.conversionExceptional,
  };
}

export function accountToProfileSettings(
  account: PlanningAccount,
): PlanningAccountOverride {
  return accountToSettings(account);
}

/** Plantilla para un perfil nuevo — arranca con el mix oficial equilibrado. */
export function createProfileDraft(
  label: string,
  accountType: PlanningAccountType,
  settings?: PlanningAccountOverride,
): PlanningProfile {
  const templateAccount = createPlanningAccountTemplate(accountType);
  const officialEditorial = buildOfficialBalancedEditorialDefaults();
  return {
    id: `profile:${Date.now()}`,
    label,
    description: "",
    accountTypes: [...PROFILE_ACCOUNT_TYPES],
    settings:
      settings ??
      accountToSettings({
        ...templateAccount,
        ...officialEditorial,
        pillarTargets: {},
        formatTargets: {},
        repetitionLimits: { ...DEFAULT_REPETITION_LIMITS },
        defaultDistributionType: DEFAULT_DISTRIBUTION_TYPE,
        alternateRoles: undefined,
      }),
  };
}

export function formatProfileRoleSummary(
  settings: PlanningAccountOverride,
): string {
  const targets = normalizeRoleTargets(settings.roleTargets);
  const parts = Object.entries(targets)
    .filter(([, value]) => value && value > 0)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));
  if (parts.length === 0) return "Sin roles definidos";
  return parts
    .map(([id, value]) => `${getContentRoleLabel(id)} ${value}%`)
    .join(" · ");
}
