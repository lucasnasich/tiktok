import {
  cameraModeFromPresence,
  DEFAULT_CAMERA_MODE,
  type CameraMode,
} from "@/content/camera-presence";
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
import { normalizePublicationTypeTargets } from "@/content/publication-types";
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
  return {
    roleTargets: { ...account.roleTargets },
    pillarTargets: { ...account.pillarTargets },
    publicationTypeTargets: { ...account.publicationTypeTargets },
    cameraMode: account.cameraMode,
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

function resolveProfileCameraMode(
  settings: PlanningAccountOverride,
  fallback: CameraMode,
): CameraMode {
  if (settings.cameraMode) return cameraModeFromPresence(settings.cameraMode);
  if (settings.cameraPresence) {
    return cameraModeFromPresence(settings.cameraPresence);
  }
  return fallback;
}

export function profileSettingsToAccount(
  baseAccount: PlanningAccount,
  settings: PlanningAccountOverride,
): PlanningAccount {
  return {
    ...baseAccount,
    roleTargets: normalizeRoleTargets({
      ...baseAccount.roleTargets,
      ...settings.roleTargets,
    }),
    pillarTargets: normalizePillarTargets({
      ...baseAccount.pillarTargets,
      ...settings.pillarTargets,
    }),
    formatTargets: normalizeFormatTargets({
      ...baseAccount.formatTargets,
      ...settings.formatTargets,
    }),
    publicationTypeTargets: normalizePublicationTypeTargets({
      ...baseAccount.publicationTypeTargets,
      ...settings.publicationTypeTargets,
    }),
    cameraMode: resolveProfileCameraMode(settings, baseAccount.cameraMode),
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

/** Plantilla vacía para un perfil nuevo — solo estructura de cuenta, sin mix editorial impuesto. */
export function createProfileDraft(
  label: string,
  accountType: PlanningAccountType,
  settings?: PlanningAccountOverride,
): PlanningProfile {
  const templateAccount = createPlanningAccountTemplate(accountType);
  return {
    id: `profile:${Date.now()}`,
    label,
    description: "",
    accountTypes: [...PROFILE_ACCOUNT_TYPES],
    settings:
      settings ??
      accountToSettings({
        ...templateAccount,
        roleTargets: {} as Partial<Record<ContentRoleId, number>>,
        pillarTargets: {},
        publicationTypeTargets: {},
        cameraMode: DEFAULT_CAMERA_MODE,
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
