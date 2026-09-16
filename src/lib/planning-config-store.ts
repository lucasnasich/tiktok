import {
  cameraModeFromPresence,
  DEFAULT_CAMERA_MODE,
  type CameraMode,
  type CameraPresenceMode,
} from "@/content/camera-presence";
import {
  normalizeRoleId,
  normalizeRoleTargets,
  type ContentRoleId,
} from "@/content/content-roles";
import {
  getPlanningAccountLabel,
  type PlanningAccount,
  type PlanningPlatform,
} from "@/content/planning-accounts";
import {
  getStudioAccountById,
  remapAssignmentsAfterAccountSplit,
  splitStudioAccountsByPlatform,
  studioAccountToPlanningBase,
  type PlanningStudioAccount,
} from "@/content/planning-studio-accounts";
import {
  normalizeRoleTopicPreferences,
  type RoleTopicPreferences,
} from "@/content/role-topics";
import { normalizePillarTargets } from "@/content/planning-pillars";
import {
  normalizePublicationTypeTargets,
  type PublicationTypeId,
} from "@/content/publication-types";
import {
  createProfileDraft,
  PROFILE_ACCOUNT_TYPES,
  resolveProfile,
  profileSettingsToAccount,
  type PlanningProfile,
} from "@/content/planning-profiles";
import {
  normalizeCalendarGeneration,
  type CalendarGeneration,
} from "@/content/calendar-generations";
import type { DistributionType } from "@/content/planned-slots";
import type { RepetitionLimits } from "@/content/planning-accounts";
import {
  buildMercantisOfficialCuratedSettings,
  fillOfficialEditorialGaps,
  MERCANTIS_OFICIAL_CURATED_FORMAT_IDS,
} from "@/content/planning-presets";
import {
  preferRicherSettings,
  settingsRichness,
} from "@/lib/planning-settings-richness";
import { normalizeFormatTargets } from "@/content/formats";
import {
  isWizardDraftProfileId,
  WIZARD_DRAFT_SESSION_KEY,
  type PlanningWizardSession,
} from "@/lib/planning-wizard-session";
import {
  applyRhythmToPlanningAccount,
  type PlanningRhythm,
} from "@/content/planning-rhythm";
type LegacyAccountMeta = {
  tiktokHandle?: string;
  instagramHandle?: string;
};

export type { PlanningStudioAccount };

export type PlanningAccountOverride = {
  platforms?: PlanningPlatform[];
  postsPerDay?: number;
  activeDays?: number[];
  timeSlots?: string[];
  roleTargets?: Partial<Record<ContentRoleId, number>>;
  roleTopicPreferences?: RoleTopicPreferences;
  pillarTargets?: Record<string, number>;
  formatTargets?: Record<string, number>;
  publicationTypeTargets?: Partial<Record<PublicationTypeId, number>>;
  cameraMode?: CameraMode;
  /** Legacy: presencia de cámara de generaciones anteriores. */
  cameraPresence?: CameraPresenceMode;
  repetitionLimits?: RepetitionLimits;
  defaultDistributionType?: DistributionType;
  alternateRoles?: [ContentRoleId, ContentRoleId];
  conversionExceptional?: boolean;
};

export type PlanningConfigStore = {
  version: 6;
  setupCompleted: boolean;
  lastAccountId?: string;
  profiles: PlanningProfile[];
  /** Cuentas creadas por el usuario (dónde publicás). */
  accounts: PlanningStudioAccount[];
  /** Legacy — el calendario usa `calendarGenerations`. */
  accountProfileIds: Record<string, string>;
  /** Lotes de slots generados explícitamente desde el calendario. */
  calendarGenerations: CalendarGeneration[];
  activeCalendarGenerationId?: string;
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
  accountMeta?: Record<string, LegacyAccountMeta>;
};

export const PLANNING_CONFIG_STORAGE_KEY = "planning-config";

export const EMPTY_PLANNING_CONFIG: PlanningConfigStore = {
  version: 6,
  setupCompleted: false,
  profiles: [],
  accounts: [],
  accountProfileIds: {},
  calendarGenerations: [],
  wizardSessions: {},
};

function isUserProfile(profile: PlanningProfile): boolean {
  return !profile.id.startsWith("builtin:");
}

function migrateAccountOverride(
  settings: PlanningAccountOverride,
): PlanningAccountOverride {
  return {
    ...settings,
    roleTargets: settings.roleTargets
      ? normalizeRoleTargets(settings.roleTargets)
      : settings.roleTargets,
    publicationTypeTargets: settings.publicationTypeTargets
      ? normalizePublicationTypeTargets(settings.publicationTypeTargets)
      : settings.publicationTypeTargets,
    cameraMode: cameraModeFromPresence(
      settings.cameraMode ?? settings.cameraPresence ?? DEFAULT_CAMERA_MODE,
    ),
    roleTopicPreferences: normalizeRoleTopicPreferences(
      settings.roleTopicPreferences,
      settings.pillarTargets,
    ),
    alternateRoles: settings.alternateRoles
      ? [
          normalizeRoleId(settings.alternateRoles[0]),
          normalizeRoleId(settings.alternateRoles[1]),
        ]
      : settings.alternateRoles,
  };
}

function sanitizeProfiles(profiles: PlanningProfile[]): PlanningProfile[] {
  return profiles.filter(isUserProfile).map((profile) => ({
    ...profile,
    builtIn: undefined,
    settings: migrateAccountOverride(profile.settings),
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
  if (!profileId || isWizardDraftProfileId(profileId)) return undefined;
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

function migrateLegacyAccountMeta(
  accountMeta: Record<string, LegacyAccountMeta> | undefined,
  accountProfileIds: Record<string, string>,
): PlanningStudioAccount[] {
  const accounts: PlanningStudioAccount[] = [];
  const seen = new Set<string>();

  const displayNameFor = (accountId: string) =>
    accountId === "mercantis-oficial" ? "Mercantis oficial" : accountId;

  for (const [accountId, meta] of Object.entries(accountMeta ?? {})) {
    if (meta.tiktokHandle) {
      accounts.push({
        id: `${accountId}--tiktok`,
        displayName: displayNameFor(accountId),
        type: "official",
        platform: "tiktok",
        handle: meta.tiktokHandle,
      });
    }
    if (meta.instagramHandle) {
      accounts.push({
        id: `${accountId}--instagram`,
        displayName: displayNameFor(accountId),
        type: "official",
        platform: "instagram",
        handle: meta.instagramHandle,
      });
    }
    seen.add(accountId);
  }

  for (const accountId of Object.keys(accountProfileIds)) {
    if (seen.has(accountId)) continue;
    accounts.push({
      id: accountId,
      displayName: displayNameFor(accountId),
      type: "official",
      platform: "instagram",
      handle: "",
    });
  }

  return splitStudioAccountsByPlatform(accounts);
}

function prepareStudioAccounts(
  accounts: PlanningStudioAccount[],
  accountProfileIds: Record<string, string>,
): {
  accounts: PlanningStudioAccount[];
  accountProfileIds: Record<string, string>;
} {
  const splitAccounts = splitStudioAccountsByPlatform(accounts);
  return {
    accounts: splitAccounts,
    accountProfileIds: remapAssignmentsAfterAccountSplit(
      accountProfileIds,
      accounts,
      splitAccounts,
    ),
  };
}

function normalizeStudioAccounts(store: PlanningConfigStore): PlanningStudioAccount[] {
  return Array.isArray(store.accounts) ? store.accounts : [];
}

export function buildPlanningAccountsForGeneration(
  store: PlanningConfigStore,
  profileId: string,
  accountIds: string[],
  rhythm?: PlanningRhythm,
): PlanningAccount[] {
  const profile = resolveProfile(profileId, store.profiles);
  if (!profile) return [];

  return accountIds
    .map((accountId) => getStudioAccountById(store.accounts, accountId))
    .filter((account): account is PlanningStudioAccount => Boolean(account))
    .map((studioAccount) => {
      const base = studioAccountToPlanningBase(studioAccount);
      const merged = mergePlanningAccount(base, profile.settings);
      const filled = fillOfficialEditorialGaps(merged);
      return rhythm ? applyRhythmToPlanningAccount(filled, rhythm) : filled;
    });
}

export function getEffectivePlanningAccounts(
  store: PlanningConfigStore = EMPTY_PLANNING_CONFIG,
): PlanningAccount[] {
  const studioAccounts = normalizeStudioAccounts(store);
  return studioAccounts.map((studioAccount) => {
    const account = studioAccountToPlanningBase(studioAccount);
    const profile = getProfileForAccount(store, studioAccount.id);
    const resolved = profile
      ? mergePlanningAccount(account, profile.settings)
      : account;
    return fillOfficialEditorialGaps(resolved);
  });
}

export function isCalendarActive(
  store: PlanningConfigStore = EMPTY_PLANNING_CONFIG,
): boolean {
  return store.calendarGenerations.length > 0;
}

export function getAssignedPlanningAccounts(
  store: PlanningConfigStore = EMPTY_PLANNING_CONFIG,
): PlanningAccount[] {
  const seen = new Set<string>();
  const result: PlanningAccount[] = [];

  for (const generation of store.calendarGenerations) {
    for (const account of buildPlanningAccountsForGeneration(
      store,
      generation.profileId,
      generation.accountIds,
      generation.rhythm,
    )) {
      if (seen.has(account.id)) continue;
      seen.add(account.id);
      result.push(account);
    }
  }

  return result;
}

export function getStudioAccounts(
  store: PlanningConfigStore = EMPTY_PLANNING_CONFIG,
): PlanningStudioAccount[] {
  return normalizeStudioAccounts(store);
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
          roleTopicPreferences: normalizeRoleTopicPreferences(
            profile.settings.roleTopicPreferences,
            profile.settings.pillarTargets,
          ),
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
      const profile = createProfileDraft(
        getPlanningAccountLabel(accountId),
        "official",
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

  return normalizePlanningConfigStore({
    version: 6,
    setupCompleted: Boolean(data.setupCompleted),
    lastAccountId: data.lastAccountId,
    profiles: sanitizeProfiles(profiles),
    accounts: migrateLegacyAccountMeta(data.accountMeta, accountProfileIds),
    accountProfileIds: sanitizeAssignments(accountProfileIds, profiles),
    calendarGenerations: [],
    wizardSessions: {},
  });
}

function hasEditorialSettings(settings: PlanningAccountOverride): boolean {
  return settingsRichness(settings) > 0;
}

function syncAssignedProfileFromSession(
  profiles: PlanningProfile[],
  accountProfileIds: Record<string, string>,
  wizardSessions: Record<string, PlanningWizardSession>,
): PlanningProfile[] {
  return profiles.map((profile) => {
    const accountId = Object.entries(accountProfileIds).find(
      ([, profileId]) => profileId === profile.id,
    )?.[0];
    if (!accountId) return profile;

    const session = wizardSessions[accountId];
    if (!session) return profile;

    const settings = preferRicherSettings(profile.settings, session.settings);
    if (settingsRichness(settings) <= settingsRichness(profile.settings)) {
      return profile;
    }

    return { ...profile, settings };
  });
}

function finalizePlanningStore(
  profiles: PlanningProfile[],
  accountProfileIds: Record<string, string>,
  wizardSessions: Record<string, PlanningWizardSession>,
): {
  profiles: PlanningProfile[];
  accountProfileIds: Record<string, string>;
} {
  const withoutDrafts = profiles.filter(
    (profile) => !isWizardDraftProfileId(profile.id),
  );
  const nextAssignments = { ...accountProfileIds };

  for (const [accountId, profileId] of Object.entries(nextAssignments)) {
    if (!isWizardDraftProfileId(profileId)) continue;
    const recovered = withoutDrafts.find(
      (profile) => profile.id === `profile:recovered-${accountId}`,
    );
    if (recovered) {
      nextAssignments[accountId] = recovered.id;
    } else {
      delete nextAssignments[accountId];
    }
  }

  const syncedProfiles = syncAssignedProfileFromSession(
    withoutDrafts,
    nextAssignments,
    wizardSessions,
  );

  return {
    profiles: syncedProfiles,
    accountProfileIds: nextAssignments,
  };
}

/** Recupera perfiles perdidos desde borradores del wizard o sesiones guardadas. */
function recoverPlanningProfiles(
  profiles: PlanningProfile[],
  accountProfileIds: Record<string, string>,
  wizardSessions: Record<string, PlanningWizardSession>,
): { profiles: PlanningProfile[]; accountProfileIds: Record<string, string> } {
  const nextProfiles = [...profiles];
  const nextAssignments = { ...accountProfileIds };
  const idReplacements = new Map<string, string>();

  for (const profile of profiles) {
    if (!isWizardDraftProfileId(profile.id)) continue;
    const accountId = profile.id.slice("draft:".length);
    const stableId = `profile:recovered-${accountId}`;
    const existing = nextProfiles.find((item) => item.id === stableId);
    const recovered =
      existing ??
      {
        ...createProfileDraft(
          profile.label.replace(/^Borrador · /, "Perfil · "),
          profile.accountTypes[0] ?? "official",
          profile.settings,
        ),
        id: stableId,
      };
    if (!existing) nextProfiles.push(recovered);
    idReplacements.set(profile.id, stableId);
    if (
      !nextAssignments[accountId] ||
      nextAssignments[accountId] === profile.id
    ) {
      nextAssignments[accountId] = stableId;
    }
  }

  for (const [accountId, profileId] of Object.entries(nextAssignments)) {
    const replacement = idReplacements.get(profileId);
    if (replacement) nextAssignments[accountId] = replacement;
  }

  for (const [accountId, session] of Object.entries(wizardSessions)) {
    const assignedId = nextAssignments[accountId];
    // Sin asignación activa: no recrear perfil (p. ej. el usuario lo eliminó).
    if (!assignedId) continue;

    const assignedExists = nextProfiles.some(
      (profile) =>
        profile.id === assignedId && !isWizardDraftProfileId(profile.id),
    );
    if (assignedExists) continue;
    if (!hasEditorialSettings(session.settings)) continue;

    const stableId = `profile:recovered-${accountId}`;
    const existing = nextProfiles.find((item) => item.id === stableId);
    const recovered =
      existing ??
      {
        ...createProfileDraft(
          session.profileLabel.trim() || `Perfil · ${accountId}`,
          "official",
          session.settings,
        ),
        id: stableId,
      };
    if (!existing) nextProfiles.push(recovered);
    nextAssignments[accountId] = stableId;
  }

  return {
    profiles: nextProfiles.filter((profile) => !isWizardDraftProfileId(profile.id)),
    accountProfileIds: nextAssignments,
  };
}

function normalizeProfileSettingsList(
  profiles: PlanningProfile[],
): PlanningProfile[] {
  return sanitizeProfiles(
    profiles.map((profile) => ({
      ...profile,
      accountTypes: [...PROFILE_ACCOUNT_TYPES],
        settings: {
          ...profile.settings,
          roleTopicPreferences: normalizeRoleTopicPreferences(
            profile.settings.roleTopicPreferences,
            profile.settings.pillarTargets,
          ),
          pillarTargets: profile.settings.pillarTargets
            ? normalizePillarTargets(profile.settings.pillarTargets)
            : undefined,
          formatTargets: profile.settings.formatTargets
            ? normalizeFormatTargets(profile.settings.formatTargets)
            : undefined,
          roleTargets: profile.settings.roleTargets
            ? normalizeRoleTargets(profile.settings.roleTargets)
            : undefined,
        },
    })),
  );
}

function dropRedundantRecoveredProfiles(
  profiles: PlanningProfile[],
  accountProfileIds: Record<string, string>,
  studioAccounts: PlanningStudioAccount[],
): { profiles: PlanningProfile[]; accountProfileIds: Record<string, string> } {
  const nextAssignments = { ...accountProfileIds };
  const removeIds = new Set<string>();

  for (const profile of profiles) {
    if (isWizardDraftProfileId(profile.id)) removeIds.add(profile.id);
  }

  for (const account of studioAccounts) {
    const recoveredId = `profile:recovered-${account.id}`;
    const assignedId = nextAssignments[account.id];

    if (assignedId && isWizardDraftProfileId(assignedId)) {
      const fallback = profiles.find(
        (profile) =>
          !removeIds.has(profile.id) &&
          !isWizardDraftProfileId(profile.id) &&
          profile.accountTypes.includes(account.type),
      )?.id;
      if (fallback) nextAssignments[account.id] = fallback;
      else delete nextAssignments[account.id];
    }

    const finalAssigned = nextAssignments[account.id];
    if (finalAssigned && finalAssigned !== recoveredId) {
      removeIds.add(recoveredId);
    }
  }

  return {
    profiles: profiles.filter((profile) => !removeIds.has(profile.id)),
    accountProfileIds: nextAssignments,
  };
}

function profileNeedsOfficialRestore(settings: PlanningAccountOverride): boolean {
  const hasRoles =
    Object.values(settings.roleTargets ?? {}).some((value) => (value ?? 0) > 0);
  const hasFormats =
    Object.values(settings.formatTargets ?? {}).some((value) => (value ?? 0) > 0);
  return !hasRoles || !hasFormats;
}

function restoreEmptyOfficialProfile(
  store: PlanningConfigStore,
): PlanningConfigStore {
  let nextStore = store;

  for (const studioAccount of store.accounts) {
    if (studioAccount.type !== "official") continue;

    const accountId = studioAccount.id;
    const profileId = nextStore.accountProfileIds[accountId];
    if (!profileId) continue;

    const profile = nextStore.profiles.find((item) => item.id === profileId);
    if (!profile || !profileNeedsOfficialRestore(profile.settings)) continue;

    nextStore = restoreOfficialProfileForAccount(nextStore, accountId, profile);
  }

  return nextStore;
}

function restoreOfficialProfileForAccount(
  store: PlanningConfigStore,
  accountId: string,
  profile: PlanningProfile,
): PlanningConfigStore {
  const profileId = profile.id;

  const curated = buildMercantisOfficialCuratedSettings();
  const restoredSettings = preferRicherSettings(profile.settings, {
    ...curated,
    roleTopicPreferences:
      profile.settings.roleTopicPreferences ?? curated.roleTopicPreferences,
    pillarTargets:
      Object.keys(profile.settings.pillarTargets ?? {}).length > 0
        ? profile.settings.pillarTargets
        : curated.pillarTargets,
    repetitionLimits:
      profile.settings.repetitionLimits ?? curated.repetitionLimits,
  });

  const session = store.wizardSessions[accountId];

  const profiles = store.profiles.map((item) =>
    item.id === profileId ? { ...item, settings: restoredSettings } : item,
  );

  const wizardSessions = session
    ? {
        ...store.wizardSessions,
        [accountId]: {
          ...session,
          settings: restoredSettings,
          pillarPriorities: session.pillarPriorities ?? {},
          selectedFormatIds: [...MERCANTIS_OFICIAL_CURATED_FORMAT_IDS],
          stepIndex: Math.min(session.stepIndex, 2),
        },
      }
    : store.wizardSessions;

  return {
    ...store,
    setupCompleted: true,
    profiles,
    wizardSessions,
  };
}

export function normalizePlanningConfigStore(
  store: PlanningConfigStore,
): PlanningConfigStore {
  const studioAccountIds = new Set(
    normalizeStudioAccounts(store).map((account) => account.id),
  );
  const profileIds = new Set(
    normalizeProfileSettingsList(store.profiles).map((profile) => profile.id),
  );
  const wizardSessions = sanitizeWizardSessions(
    store.wizardSessions,
    studioAccountIds,
    profileIds,
  );
  const recovered = recoverPlanningProfiles(
    normalizeProfileSettingsList(store.profiles),
    store.accountProfileIds,
    wizardSessions,
  );
  const finalized = finalizePlanningStore(
    sanitizeProfiles(recovered.profiles),
    recovered.accountProfileIds,
    wizardSessions,
  );
  const prepared = prepareStudioAccounts(
    normalizeStudioAccounts(store),
    finalized.accountProfileIds,
  );
  const deduped = dropRedundantRecoveredProfiles(
    finalized.profiles,
    prepared.accountProfileIds,
    prepared.accounts,
  );

  const protectedProfiles = protectProfileSettings(
    deduped.profiles,
    wizardSessions,
  );

  return restoreEmptyOfficialProfile({
    version: 6,
    setupCompleted: store.setupCompleted,
    lastAccountId: store.lastAccountId,
    profiles: protectedProfiles,
    accounts: prepared.accounts,
    accountProfileIds: sanitizeAssignments(
      deduped.accountProfileIds,
      deduped.profiles,
    ),
    calendarGenerations: sanitizeCalendarGenerations(store.calendarGenerations),
    activeCalendarGenerationId: sanitizeActiveCalendarGenerationId(
      store.activeCalendarGenerationId,
      store.calendarGenerations,
    ),
    wizardSessions,
  });
}

function sanitizeCalendarGenerations(
  generations: CalendarGeneration[] | undefined,
): CalendarGeneration[] {
  if (!Array.isArray(generations)) return [];
  return generations
    .filter(
      (generation) =>
        generation &&
        typeof generation.id === "string" &&
        typeof generation.label === "string" &&
        Array.isArray(generation.slots) &&
        Array.isArray(generation.accountIds),
    )
    .map((generation) => normalizeCalendarGeneration(generation));
}

function sanitizeActiveCalendarGenerationId(
  activeId: string | undefined,
  generations: CalendarGeneration[] | undefined,
): string | undefined {
  if (!activeId) return undefined;
  const list = sanitizeCalendarGenerations(generations);
  return list.some((generation) => generation.id === activeId)
    ? activeId
    : list[0]?.id;
}

function isProfileWizardSessionKey(
  sessionKey: string,
  profileIds: Set<string>,
): boolean {
  return (
    sessionKey === WIZARD_DRAFT_SESSION_KEY ||
    (sessionKey.startsWith("profile:") && profileIds.has(sessionKey))
  );
}

function sanitizeWizardSessions(
  sessions: Record<string, PlanningWizardSession> | undefined,
  studioAccountIds?: Set<string>,
  profileIds?: Set<string>,
): Record<string, PlanningWizardSession> {
  if (!sessions || typeof sessions !== "object") return {};
  const result: Record<string, PlanningWizardSession> = {};
  for (const [sessionKey, session] of Object.entries(sessions)) {
    if (!session || typeof session !== "object") continue;
    if (session.accountId !== sessionKey) continue;
    if (
      studioAccountIds &&
      !studioAccountIds.has(sessionKey) &&
      !(profileIds && isProfileWizardSessionKey(sessionKey, profileIds))
    ) {
      continue;
    }
    result[sessionKey] = {
      ...session,
      settings: migrateAccountOverride(session.settings),
    };
  }
  return result;
}

/** Nunca dejar que un borrador del wizard vacíe roles/formatos ya guardados. */
function protectProfileSettings(
  profiles: PlanningProfile[],
  wizardSessions: Record<string, PlanningWizardSession>,
): PlanningProfile[] {
  return profiles.map((profile) => {
    let settings = profile.settings;

    for (const session of Object.values(wizardSessions)) {
      if (session.profileId !== profile.id) continue;
      settings = preferRicherSettings(settings, session.settings);
    }

    if (settings === profile.settings) return profile;
    return { ...profile, settings };
  });
}

export function parsePlanningConfigStore(raw: unknown): PlanningConfigStore {
  if (!raw || typeof raw !== "object") return EMPTY_PLANNING_CONFIG;
  const data = raw as LegacyPlanningConfigStore & {
    wizardSessions?: Record<string, PlanningWizardSession>;
    profiles?: PlanningProfile[];
    accounts?: PlanningStudioAccount[];
  };

  if (!data.version || data.version < 3) {
    return migrateLegacyStore(data);
  }

  const accountProfileIds = data.accountProfileIds ?? {};
  const accounts =
    Array.isArray(data.accounts) && data.accounts.length > 0
      ? data.accounts
      : migrateLegacyAccountMeta(data.accountMeta, accountProfileIds);

  const legacyStore = data as LegacyPlanningConfigStore & {
    calendarGenerations?: CalendarGeneration[];
    activeCalendarGenerationId?: string;
  };

  return normalizePlanningConfigStore({
    version: 6,
    setupCompleted: Boolean(data.setupCompleted),
    lastAccountId:
      typeof data.lastAccountId === "string" ? data.lastAccountId : undefined,
    profiles: Array.isArray(data.profiles) ? data.profiles : [],
    accounts,
    accountProfileIds: data.version && data.version >= 6 ? accountProfileIds : {},
    calendarGenerations: legacyStore.calendarGenerations ?? [],
    activeCalendarGenerationId: legacyStore.activeCalendarGenerationId,
    wizardSessions: sanitizeWizardSessions(data.wizardSessions),
  });
}

export function accountToOverride(account: PlanningAccount): PlanningAccountOverride {
  return {
    roleTargets: normalizeRoleTargets(account.roleTargets),
    roleTopicPreferences: normalizeRoleTopicPreferences(
      account.roleTopicPreferences,
      account.pillarTargets,
    ),
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
