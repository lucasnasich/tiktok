import { useCallback, useEffect, useRef, useState } from "react";

import seedPlanningStore from "@/content/planning-store.json";
import {
  EMPTY_PLANNING_CONFIG,
  normalizePlanningConfigStore,
  parsePlanningConfigStore,
  type PlanningConfigStore,
} from "@/lib/planning-config-store";
import {
  fetchPlanningStoreFile,
  pickRicherPlanningStore,
  readPlanningStoreFromLocalStorage,
  savePlanningStoreFile,
  writePlanningStoreToLocalStorage,
  type PlanningStoreFile,
} from "@/lib/planning-store-file";

const FILE_SYNC_DEBOUNCE_MS = 800;

function seedPlanningConfig(): PlanningConfigStore | null {
  const file = seedPlanningStore as PlanningStoreFile;
  if (!file?.planning) return null;
  return parsePlanningConfigStore(file.planning);
}

function initialPlanningStore(): PlanningConfigStore {
  const local = readPlanningStoreFromLocalStorage(
    parsePlanningConfigStore,
    EMPTY_PLANNING_CONFIG,
  );
  const seed = seedPlanningConfig();
  if (!seed) return normalizePlanningConfigStore(local);
  return normalizePlanningConfigStore(pickRicherPlanningStore(local, seed));
}

/** Estado de planificación: localStorage + archivo versionado (`planning-store.json`). */
export function usePlanningStoreState(): [
  PlanningConfigStore,
  (value: PlanningConfigStore | ((prev: PlanningConfigStore) => PlanningConfigStore)) => void,
] {
  const [store, setStore] = useState(initialPlanningStore);
  const fileSyncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydratedFromDevFile = useRef(false);

  const persist = useCallback((next: PlanningConfigStore) => {
    writePlanningStoreToLocalStorage(next);

    if (!import.meta.env.DEV) return;

    if (fileSyncTimer.current) clearTimeout(fileSyncTimer.current);
    fileSyncTimer.current = setTimeout(() => {
      void savePlanningStoreFile(next);
    }, FILE_SYNC_DEBOUNCE_MS);
  }, []);

  const setStoreNormalized = useCallback(
    (
      value:
        | PlanningConfigStore
        | ((prev: PlanningConfigStore) => PlanningConfigStore),
    ) => {
      setStore((prev) => {
        const next = normalizePlanningConfigStore(
          typeof value === "function" ? value(prev) : value,
        );
        persist(next);
        return next;
      });
    },
    [persist],
  );

  useEffect(() => {
    if (!import.meta.env.DEV || hydratedFromDevFile.current) return;

    void fetchPlanningStoreFile().then((file) => {
      hydratedFromDevFile.current = true;
      if (!file?.planning) return;

      const fromFile = parsePlanningConfigStore(file.planning);
      const fromLocal = readPlanningStoreFromLocalStorage(
        parsePlanningConfigStore,
        EMPTY_PLANNING_CONFIG,
      );
      const merged = normalizePlanningConfigStore(
        pickRicherPlanningStore(fromLocal, fromFile),
      );

      setStore((prev) => {
        const next = normalizePlanningConfigStore(
          pickRicherPlanningStore(prev, merged),
        );
        writePlanningStoreToLocalStorage(next);
        void savePlanningStoreFile(next);
        return next;
      });
    });
  }, []);

  useEffect(
    () => () => {
      if (fileSyncTimer.current) clearTimeout(fileSyncTimer.current);
    },
    [],
  );

  return [store, setStoreNormalized];
}
