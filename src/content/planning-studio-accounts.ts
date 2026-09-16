import {
  DEFAULT_ACTIVE_DAYS,
  DEFAULT_CAMERA_MODE,
  DEFAULT_DISTRIBUTION_TYPE,
  DEFAULT_REPETITION_LIMITS,
  DEFAULT_TIME_SLOTS,
} from "@/content/planning-defaults";
import { cloneDefaultRoleTopicPreferences } from "@/content/role-topics";
import type {
  PlanningAccount,
  PlanningAccountType,
  PlanningPlatform,
} from "@/content/planning-accounts";

export type PlanningPlatformPresence = {
  platform: PlanningPlatform;
  /** Usuario en la red, sin @ */
  handle: string;
};

/** Cuenta del estudio: una red + @ por instancia. */
export type PlanningStudioAccount = {
  id: string;
  /** Nombre público de la cuenta (ej. Mercantis). */
  displayName: string;
  type: PlanningAccountType;
  platform: PlanningPlatform;
  handle: string;
};

type LegacyPlanningStudioAccount = {
  id: string;
  displayName: string;
  type: PlanningAccountType;
  platform?: PlanningPlatform;
  handle?: string;
  platforms?: PlanningPlatformPresence[];
};

export function normalizeSocialHandle(value: string): string {
  return value.trim().replace(/^@+/, "");
}

export function studioAccountSocialLabel(account: PlanningStudioAccount): string {
  const handle = normalizeSocialHandle(account.handle);
  return handle || account.displayName;
}

export function normalizeStudioAccount(
  account: LegacyPlanningStudioAccount,
): PlanningStudioAccount {
  if (account.platform && account.handle) {
    return {
      id: account.id,
      displayName: account.displayName,
      type: account.type,
      platform: account.platform,
      handle: normalizeSocialHandle(account.handle),
    };
  }

  const first =
    account.platforms?.find((presence) => presence.handle) ??
    account.platforms?.[0];

  return {
    id: account.id,
    displayName: account.displayName,
    type: account.type,
    platform: first?.platform ?? "instagram",
    handle: normalizeSocialHandle(first?.handle ?? ""),
  };
}

/** Separa cuentas legacy con varias redes en una instancia por red. */
export function splitStudioAccountsByPlatform(
  accounts: LegacyPlanningStudioAccount[],
): PlanningStudioAccount[] {
  const result: PlanningStudioAccount[] = [];

  for (const account of accounts) {
    const legacyPlatforms =
      account.platforms?.filter((presence) => presence.handle) ?? [];

    if (legacyPlatforms.length > 1) {
      for (const presence of legacyPlatforms) {
        result.push({
          id: `${account.id}--${presence.platform}`,
          displayName: account.displayName,
          type: account.type,
          platform: presence.platform,
          handle: normalizeSocialHandle(presence.handle),
        });
      }
      continue;
    }

    result.push(normalizeStudioAccount(account));
  }

  return result;
}

export function remapAssignmentsAfterAccountSplit(
  assignments: Record<string, string>,
  previousAccounts: LegacyPlanningStudioAccount[],
  nextAccounts: PlanningStudioAccount[],
): Record<string, string> {
  const next: Record<string, string> = {};

  for (const [accountId, profileId] of Object.entries(assignments)) {
    const legacy = previousAccounts.find((account) => account.id === accountId);
    const splitTargets = nextAccounts.filter(
      (account) =>
        account.id === accountId || account.id.startsWith(`${accountId}--`),
    );

    if (splitTargets.length > 0) {
      for (const account of splitTargets) {
        next[account.id] = profileId;
      }
      continue;
    }

    if (legacy && (legacy.platforms?.length ?? 0) > 1) {
      continue;
    }

    if (nextAccounts.some((account) => account.id === accountId)) {
      next[accountId] = profileId;
    }
  }

  return next;
}

export function createPlanningStudioAccount(input: {
  displayName: string;
  type: PlanningAccountType;
  platform: PlanningPlatform;
  handle: string;
}): PlanningStudioAccount {
  return {
    id: `account:${Date.now()}`,
    displayName: input.displayName.trim(),
    type: input.type,
    platform: input.platform,
    handle: normalizeSocialHandle(input.handle),
  };
}

export function studioAccountPlatforms(
  account: PlanningStudioAccount,
): PlanningPlatform[] {
  return [account.platform];
}

/** Base operativa para calendario/generador (el mix editorial viene del perfil). */
export function studioAccountToPlanningBase(
  account: PlanningStudioAccount,
): PlanningAccount {
  return {
    id: account.id,
    label: account.displayName,
    type: account.type,
    platforms: studioAccountPlatforms(account),
    postsPerDay: 3,
    activeDays: [...DEFAULT_ACTIVE_DAYS],
    timeSlots: [...DEFAULT_TIME_SLOTS],
    roleTargets: {},
    roleTopicPreferences: cloneDefaultRoleTopicPreferences(),
    pillarTargets: {},
    publicationTypeTargets: {},
    cameraMode: DEFAULT_CAMERA_MODE,
    formatTargets: {},
    repetitionLimits: { ...DEFAULT_REPETITION_LIMITS },
    defaultDistributionType: DEFAULT_DISTRIBUTION_TYPE,
  };
}

export function formatStudioAccountSubtitle(
  account: PlanningStudioAccount,
): string | undefined {
  const handle = normalizeSocialHandle(account.handle);
  if (!handle) return undefined;
  const network = account.platform === "tiktok" ? "TikTok" : "Instagram";
  return `@${handle} · ${network}`;
}

export function formatStudioAccountLabel(account: PlanningStudioAccount): string {
  return account.displayName;
}

export function getStudioAccountById(
  accounts: PlanningStudioAccount[],
  accountId: string,
): PlanningStudioAccount | undefined {
  return accounts.find((account) => account.id === accountId);
}
