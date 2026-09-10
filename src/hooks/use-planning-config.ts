import { useCallback, useMemo } from "react";

import {
  planningAccounts,
  type PlanningAccount,
} from "@/content/planning-accounts";
import {
  createProfileDraft,
  getProfilesForAccountType,
  profileSettingsToAccount,
  resolveProfile,
  type PlanningProfile,
} from "@/content/planning-profiles";
import { usePersistedState } from "@/hooks/use-persisted-state";
import {
  EMPTY_PLANNING_CONFIG,
  accountToOverride,
  getEffectivePlanningAccounts,
  getProfileForAccount,
  getProfileIdForAccount,
  parsePlanningConfigStore,
  type PlanningConfigStore,
} from "@/lib/planning-config-store";
import {
  getWizardDraftProfileId,
  type PlanningWizardSession,
} from "@/lib/planning-wizard-session";

const STORAGE_KEY = "planning-config";

export function usePlanningConfig() {
  const [store, setStore] = usePersistedState<PlanningConfigStore>(
    STORAGE_KEY,
    EMPTY_PLANNING_CONFIG,
    parsePlanningConfigStore,
  );

  const accounts = useMemo(
    () => getEffectivePlanningAccounts(store),
    [store],
  );

  const profiles = store.profiles;

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

  const deleteProfile = useCallback(
    (profileId: string) => {
      setStore((prev) => {
        const nextAssignments = { ...prev.accountProfileIds };
        for (const [accountId, assignedId] of Object.entries(nextAssignments)) {
          if (assignedId === profileId) {
            delete nextAssignments[accountId];
          }
        }
        return {
          ...prev,
          profiles: prev.profiles.filter((p) => p.id !== profileId),
          accountProfileIds: nextAssignments,
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
      const base = planningAccounts.find((a) => a.id === account.id)!;
      const settings = accountToOverride(account);

      if (
        existingProfileId &&
        store.profiles.some((p) => p.id === existingProfileId)
      ) {
        const existing = store.profiles.find(
          (p) => p.id === existingProfileId,
        )!;
        const updated: PlanningProfile = {
          ...existing,
          label: profileLabel,
          description: profileDescription ?? existing.description,
          settings,
        };
        saveProfile(updated);
        assignProfileToAccount(account.id, updated.id);
        setStore((prev) => ({ ...prev, lastAccountId: account.id }));
        return updated;
      }

      const profile = createProfileDraft(profileLabel, base.type, settings);
      profile.description = profileDescription ?? "";
      saveProfile(profile);
      assignProfileToAccount(account.id, profile.id);
      setStore((prev) => ({ ...prev, lastAccountId: account.id }));
      return profile;
    },
    [assignProfileToAccount, saveProfile, setStore, store.profiles],
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
      const base = planningAccounts.find((a) => a.id === session.accountId);
      if (!base) return;

      const settings = session.settings;
      const label = session.profileLabel.trim() || `Borrador · ${base.label}`;

      setStore((prev) => {
        const profileId =
          session.profileId && prev.profiles.some((p) => p.id === session.profileId)
            ? session.profileId
            : getWizardDraftProfileId(session.accountId);

        const existing = prev.profiles.find((p) => p.id === profileId);
        const profile: PlanningProfile = existing
          ? { ...existing, label, settings }
          : {
              id: profileId,
              label,
              description: "",
              accountTypes: [base.type],
              settings,
            };

        const profiles = existing
          ? prev.profiles.map((p) => (p.id === profileId ? profile : p))
          : [...prev.profiles, profile];

        return {
          ...prev,
          lastAccountId: session.accountId,
          profiles,
          accountProfileIds: {
            ...prev.accountProfileIds,
            [session.accountId]: profileId,
          },
          wizardSessions: {
            ...prev.wizardSessions,
            [session.accountId]: session,
          },
        };
      });
    },
    [setStore],
  );

  const getAccountDraft = useCallback(
    (accountId: string): PlanningAccount => {
      const base = planningAccounts.find((a) => a.id === accountId)!;
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
      const base = planningAccounts.find((a) => a.id === accountId)!;
      const profile = resolveProfile(profileId, store.profiles);
      if (!profile) return getAccountDraft(accountId);
      return profileSettingsToAccount(base, profile.settings);
    },
    [getAccountDraft, store.profiles],
  );

  const getProfilesForAccount = useCallback(
    (accountId: string) => {
      const account = planningAccounts.find((a) => a.id === accountId);
      if (!account) return [];
      return getProfilesForAccountType(account.type, store.profiles);
    },
    [store.profiles],
  );

  const getAssignedProfileId = useCallback(
    (accountId: string) => getProfileIdForAccount(store, accountId),
    [store],
  );

  const getAssignedProfile = useCallback(
    (accountId: string) => getProfileForAccount(store, accountId),
    [store],
  );

  return {
    store,
    accounts,
    profiles,
    setupCompleted: store.setupCompleted,
    assignProfileToAccount,
    saveProfile,
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
