import { useCallback, useMemo } from "react";

import type { CalendarGenerationRequest } from "@/content/calendar-generations";
import { cameraModeFromPresence } from "@/content/camera-presence";
import type { PlanningAccount } from "@/content/planning-accounts";
import {
  createProfileDraft,
  getProfilesForAccountType,
  profileSettingsToAccount,
  resolveProfile,
  type PlanningProfile,
} from "@/content/planning-profiles";
import {
  getStudioAccountById,
  studioAccountToPlanningBase,
  type PlanningStudioAccount,
} from "@/content/planning-studio-accounts";
import { usePlanningStoreState } from "@/hooks/use-planning-store-state";
import {
  EMPTY_PLANNING_CONFIG,
  accountToOverride,
  buildPlanningAccountsForGeneration,
  getAssignedPlanningAccounts,
  getEffectivePlanningAccounts,
  getProfileForAccount,
  getProfileIdForAccount,
  getStudioAccounts,
  isCalendarActive,
} from "@/lib/planning-config-store";
import {
  createCalendarGeneration,
  getActiveCalendarGeneration,
  getActiveCalendarGenerationSlots,
  getAllCalendarGenerationSlots,
} from "@/lib/calendar-generation";
import {
  preferRicherSettings,
  preferRicherWizardSession,
} from "@/lib/planning-settings-richness";
import { isWizardDraftProfileId } from "@/lib/planning-wizard-session";
import type { PlanningWizardSession } from "@/lib/planning-wizard-session";

function resolvePlanningBase(
  store: ReturnType<typeof usePlanningStoreState>[0],
  accountId: string,
): PlanningAccount | undefined {
  const studioAccount = getStudioAccountById(store.accounts, accountId);
  if (!studioAccount) return undefined;
  return studioAccountToPlanningBase(studioAccount);
}

export function usePlanningConfig() {
  const [store, setStore] = usePlanningStoreState();

  const studioAccounts = useMemo(() => getStudioAccounts(store), [store]);

  const accounts = useMemo(
    () => getEffectivePlanningAccounts(store),
    [store],
  );

  const calendarAccounts = useMemo(
    () => getAssignedPlanningAccounts(store),
    [store],
  );

  const calendarActive = useMemo(() => isCalendarActive(store), [store]);

  const calendarGenerations = useMemo(
    () => store.calendarGenerations,
    [store.calendarGenerations],
  );

  const activeCalendarGeneration = useMemo(
    () => getActiveCalendarGeneration(store),
    [store],
  );

  const activeCalendarSlots = useMemo(
    () => getActiveCalendarGenerationSlots(store),
    [store],
  );

  const allCalendarSlots = useMemo(
    () => getAllCalendarGenerationSlots(store),
    [store],
  );

  const activeCalendarAccounts = useMemo(() => {
    const active = getActiveCalendarGeneration(store);
    if (!active) return [];
    return buildPlanningAccountsForGeneration(
      store,
      active.profileId,
      active.accountIds,
      active.rhythm,
      {
        cameraMode:
          active.cameraMode ?? cameraModeFromPresence(active.cameraPresence),
        publicationTypeTargets: active.publicationTypeTargets,
      },
    );
  }, [store]);

  const profiles = useMemo(
    () => store.profiles.filter((profile) => !isWizardDraftProfileId(profile.id)),
    [store.profiles],
  );

  const createStudioAccount = useCallback(
    (account: PlanningStudioAccount) => {
      setStore((prev) => ({
        ...prev,
        accounts: [...prev.accounts, account],
        lastAccountId: account.id,
      }));
    },
    [setStore],
  );

  const updateStudioAccount = useCallback(
    (accountId: string, patch: PlanningStudioAccount) => {
      setStore((prev) => ({
        ...prev,
        accounts: prev.accounts.map((account) =>
          account.id === accountId ? patch : account,
        ),
      }));
    },
    [setStore],
  );

  const deleteStudioAccount = useCallback(
    (accountId: string) => {
      setStore((prev) => {
        const nextAssignments = { ...prev.accountProfileIds };
        const nextSessions = { ...prev.wizardSessions };
        delete nextAssignments[accountId];
        delete nextSessions[accountId];

        return {
          ...prev,
          accounts: prev.accounts.filter((account) => account.id !== accountId),
          accountProfileIds: nextAssignments,
          wizardSessions: nextSessions,
          lastAccountId:
            prev.lastAccountId === accountId ? undefined : prev.lastAccountId,
        };
      });
    },
    [setStore],
  );

  const assignProfileToAccount = useCallback(
    (accountId: string, profileId: string) => {
      setStore((prev) => ({
        ...prev,
        accountProfileIds: {
          ...prev.accountProfileIds,
          [accountId]: profileId,
        },
      }));
    },
    [setStore],
  );

  const generateCalendar = useCallback(
    (input: CalendarGenerationRequest) => {
      setStore((prev) => {
        const generation = createCalendarGeneration(prev, input);
        if (!generation) return prev;

        return {
          ...prev,
          calendarGenerations: [...prev.calendarGenerations, generation],
          activeCalendarGenerationId: generation.id,
          setupCompleted: true,
        };
      });
    },
    [setStore],
  );

  const setActiveCalendarGeneration = useCallback(
    (generationId: string) => {
      setStore((prev) => {
        if (
          !prev.calendarGenerations.some(
            (generation) => generation.id === generationId,
          )
        ) {
          return prev;
        }
        return { ...prev, activeCalendarGenerationId: generationId };
      });
    },
    [setStore],
  );

  const deleteCalendarGeneration = useCallback(
    (generationId: string) => {
      setStore((prev) => {
        const calendarGenerations = prev.calendarGenerations.filter(
          (generation) => generation.id !== generationId,
        );
        const activeCalendarGenerationId =
          prev.activeCalendarGenerationId === generationId
            ? calendarGenerations[0]?.id
            : prev.activeCalendarGenerationId;

        return {
          ...prev,
          calendarGenerations,
          activeCalendarGenerationId,
        };
      });
    },
    [setStore],
  );

  const saveProfile = useCallback(
    (profile: PlanningProfile) => {
      setStore((prev) => {
        const exists = prev.profiles.some((p) => p.id === profile.id);
        return {
          ...prev,
          profiles: exists
            ? prev.profiles.map((p) => (p.id === profile.id ? profile : p))
            : [...prev.profiles, profile],
        };
      });
    },
    [setStore],
  );

  const updateProfile = useCallback(
    (
      profileId: string,
      patch: Partial<Pick<PlanningProfile, "label" | "description">>,
    ) => {
      setStore((prev) => {
        const profiles = prev.profiles.map((profile) =>
          profile.id === profileId ? { ...profile, ...patch } : profile,
        );
        const wizardSessions = { ...prev.wizardSessions };

        if (patch.label) {
          for (const [accountId, assignedId] of Object.entries(
            prev.accountProfileIds,
          )) {
            if (assignedId !== profileId || !wizardSessions[accountId]) continue;
            wizardSessions[accountId] = {
              ...wizardSessions[accountId],
              profileLabel: patch.label,
            };
          }
        }

        return { ...prev, profiles, wizardSessions };
      });
    },
    [setStore],
  );

  const deleteProfile = useCallback(
    (profileId: string) => {
      setStore((prev) => {
        const nextAssignments = { ...prev.accountProfileIds };
        const nextSessions = { ...prev.wizardSessions };
        for (const [accountId, assignedId] of Object.entries(nextAssignments)) {
          if (assignedId === profileId) {
            delete nextAssignments[accountId];
            delete nextSessions[accountId];
          }
        }
        return {
          ...prev,
          profiles: prev.profiles.filter((p) => p.id !== profileId),
          accountProfileIds: nextAssignments,
          wizardSessions: nextSessions,
        };
      });
    },
    [setStore],
  );

  const duplicateProfile = useCallback(
    (profileId: string, label?: string) => {
      const source = resolveProfile(profileId, store.profiles);
      if (!source) return undefined;
      const copy = createProfileDraft(
        label ?? `${source.label} (copia)`,
        source.accountTypes[0],
        { ...source.settings },
      );
      copy.description = source.description;
      setStore((prev) => ({
        ...prev,
        profiles: [...prev.profiles, copy],
      }));
      return copy;
    },
    [setStore, store.profiles],
  );

  const saveAccountAsProfile = useCallback(
    (
      account: PlanningAccount,
      profileLabel: string,
      profileDescription?: string,
      existingProfileId?: string,
    ) => {
      const incomingSettings = accountToOverride(account);

      if (
        existingProfileId &&
        store.profiles.some((p) => p.id === existingProfileId)
      ) {
        const existing = store.profiles.find(
          (p) => p.id === existingProfileId,
        )!;
        const settings = preferRicherSettings(
          existing.settings,
          incomingSettings,
        );
        const updated: PlanningProfile = {
          ...existing,
          label: profileLabel,
          description: profileDescription ?? existing.description,
          settings,
        };
        saveProfile(updated);
        return updated;
      }

      const profile = createProfileDraft(
        profileLabel,
        "official",
        incomingSettings,
      );
      profile.description = profileDescription ?? "";
      saveProfile(profile);
      return profile;
    },
    [saveProfile, store.accounts, store.profiles],
  );

  const markSetupCompleted = useCallback(() => {
    setStore((prev) => ({ ...prev, setupCompleted: true }));
  }, [setStore]);

  const resetSetup = useCallback(() => {
    setStore(EMPTY_PLANNING_CONFIG);
  }, [setStore]);

  const getWizardSession = useCallback(
    (accountId: string): PlanningWizardSession | undefined =>
      store.wizardSessions[accountId],
    [store.wizardSessions],
  );

  const clearWizardSession = useCallback(
    (accountId: string) => {
      setStore((prev) => {
        if (!prev.wizardSessions[accountId]) return prev;
        const nextSessions = { ...prev.wizardSessions };
        delete nextSessions[accountId];
        return { ...prev, wizardSessions: nextSessions };
      });
    },
    [setStore],
  );

  const persistWizardDraft = useCallback(
    (session: PlanningWizardSession) => {
      setStore((prev) => {
        const existing = prev.wizardSessions[session.accountId];
        const merged = preferRicherWizardSession(existing, session);

        return {
          ...prev,
          lastAccountId: session.accountId,
          wizardSessions: {
            ...prev.wizardSessions,
            [session.accountId]: merged,
          },
        };
      });
    },
    [setStore],
  );

  const getAccountDraft = useCallback(
    (accountId: string): PlanningAccount => {
      const base = resolvePlanningBase(store, accountId);
      if (!base) {
        return studioAccountToPlanningBase({
          id: accountId,
          displayName: accountId,
          type: "official",
          platform: "instagram",
          handle: "",
        });
      }
      const profile = getProfileForAccount(store, accountId);
      if (profile) {
        return profileSettingsToAccount(base, profile.settings);
      }
      return base;
    },
    [store],
  );

  const getAccountDraftFromProfile = useCallback(
    (accountId: string, profileId: string): PlanningAccount => {
      const base = resolvePlanningBase(store, accountId);
      if (!base) return getAccountDraft(accountId);
      const profile = resolveProfile(profileId, store.profiles);
      if (!profile) return getAccountDraft(accountId);
      return profileSettingsToAccount(base, profile.settings);
    },
    [getAccountDraft, store],
  );

  const getProfilesForAccount = useCallback(
    (accountId: string) => {
      const studioAccount = getStudioAccountById(store.accounts, accountId);
      if (!studioAccount) return [];
      return getProfilesForAccountType(studioAccount.type, store.profiles);
    },
    [store.accounts, store.profiles],
  );

  const getAssignedProfileId = useCallback(
    (accountId: string) => {
      const active = getActiveCalendarGeneration(store);
      if (active?.accountIds.includes(accountId)) return active.profileId;
      return getProfileIdForAccount(store, accountId);
    },
    [store],
  );

  const getAssignedProfile = useCallback(
    (accountId: string) => getProfileForAccount(store, accountId),
    [store],
  );

  return {
    store,
    studioAccounts,
    accounts,
    calendarAccounts,
    calendarActive,
    calendarGenerations,
    activeCalendarGeneration,
    activeCalendarSlots,
    allCalendarSlots,
    activeCalendarAccounts,
    profiles,
    setupCompleted: store.setupCompleted,
    createStudioAccount,
    updateStudioAccount,
    deleteStudioAccount,
    assignProfileToAccount,
    generateCalendar,
    setActiveCalendarGeneration,
    deleteCalendarGeneration,
    saveProfile,
    updateProfile,
    deleteProfile,
    duplicateProfile,
    saveAccountAsProfile,
    markSetupCompleted,
    resetSetup,
    getWizardSession,
    persistWizardDraft,
    clearWizardSession,
    getAccountDraft,
    getAccountDraftFromProfile,
    getProfilesForAccount,
    getAssignedProfileId,
    getAssignedProfile,
  };
}

export type PlanningConfigApi = ReturnType<typeof usePlanningConfig>;
