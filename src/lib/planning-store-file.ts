import type { PlanningConfigStore } from "@/lib/planning-config-store";
import {
  mergeProfilesByRicherSettings,
  settingsRichness,
} from "@/lib/planning-settings-richness";

export type PlanningStoreFile = {
  meta: {
    updatedAt: string | null;
    source?: string;
    note?: string;
  };
  planning: PlanningConfigStore;
};

export const PLANNING_STORE_API = "/__studio/planning-store";

const STORAGE_PREFIX = "mercantis-studio:";

export function planningStoreRichness(store: PlanningConfigStore): number {
  let score = store.profiles.length * 1_000;
  score += store.calendarGenerations.length * 500;
  score += Object.keys(store.accountProfileIds).length * 100;
  score += (store.accounts?.length ?? 0) * 10;
  score += store.setupCompleted ? 5 : 0;
  for (const profile of store.profiles) {
    score += settingsRichness(profile.settings);
  }
  return score;
}

export function pickRicherPlanningStore(
  left: PlanningConfigStore,
  right: PlanningConfigStore,
): PlanningConfigStore {
  const leftScore = planningStoreRichness(left);
  const rightScore = planningStoreRichness(right);
  const base = rightScore > leftScore ? right : leftScore > rightScore ? left : right;
  const other = base === left ? right : left;

  return {
    ...base,
    profiles: mergeProfilesByRicherSettings(base.profiles, other.profiles),
    calendarGenerations:
      base.calendarGenerations.length >= other.calendarGenerations.length
        ? base.calendarGenerations
        : other.calendarGenerations,
    activeCalendarGenerationId:
      base.activeCalendarGenerationId ?? other.activeCalendarGenerationId,
    wizardSessions:
      Object.keys(base.wizardSessions).length >=
      Object.keys(other.wizardSessions).length
        ? base.wizardSessions
        : other.wizardSessions,
    setupCompleted: base.setupCompleted || other.setupCompleted,
  };
}

export function wrapPlanningStore(
  planning: PlanningConfigStore,
  source = "studio-app",
): PlanningStoreFile {
  return {
    meta: {
      updatedAt: new Date().toISOString(),
      source,
      note: "Sincronizado desde el Studio.",
    },
    planning,
  };
}

export async function fetchPlanningStoreFile(): Promise<PlanningStoreFile | null> {
  if (!import.meta.env.DEV) return null;

  try {
    const response = await fetch(PLANNING_STORE_API, {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = (await response.json()) as PlanningStoreFile | null;
    if (!data?.planning) return null;
    return data;
  } catch {
    return null;
  }
}

export async function savePlanningStoreFile(
  planning: PlanningConfigStore,
): Promise<boolean> {
  if (!import.meta.env.DEV) return false;

  try {
    const response = await fetch(PLANNING_STORE_API, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wrapPlanningStore(planning)),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export function readPlanningStoreFromLocalStorage(
  parse: (raw: unknown) => PlanningConfigStore,
  fallback: PlanningConfigStore,
): PlanningConfigStore {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}planning-config`);
    if (raw === null) return fallback;
    return parse(JSON.parse(raw));
  } catch {
    return fallback;
  }
}

export function writePlanningStoreToLocalStorage(
  planning: PlanningConfigStore,
): void {
  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}planning-config`,
      JSON.stringify(planning),
    );
  } catch {
    // quota / private mode
  }
}
