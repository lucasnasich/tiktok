import { useCallback, useMemo, type ReactNode, createContext, createElement, useContext } from "react";

import { inspirationClassificationRecords } from "@/content/inspiration-classification-records";
import { usePersistedState } from "@/hooks/use-persisted-state";
import {
  parseInspirationOverrides,
  type InspirationMetaOverride,
} from "@/lib/inspiration-overrides-store";

const RECORD_OVERRIDES = Object.fromEntries(
  inspirationClassificationRecords.map((record) => [
    record.key,
    record.override,
  ]),
) as Record<string, InspirationMetaOverride>;

type InspirationOverridesApi = {
  overrides: Record<string, InspirationMetaOverride>;
  getOverride: (key: string) => InspirationMetaOverride | undefined;
  patchOverride: (key: string, patch: InspirationMetaOverride) => void;
};

const InspirationOverridesContext =
  createContext<InspirationOverridesApi | null>(null);

export function InspirationOverridesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [overrides, setOverrides] = usePersistedState<
    Record<string, InspirationMetaOverride>
  >("inspiration-overrides", {}, parseInspirationOverrides);

  const mergedOverrides = useMemo(
    () => ({ ...RECORD_OVERRIDES, ...overrides }),
    [overrides],
  );

  const getOverride = useCallback(
    (key: string) => mergedOverrides[key],
    [mergedOverrides],
  );

  const patchOverride = useCallback(
    (key: string, patch: InspirationMetaOverride) => {
      setOverrides((prev) => {
        const current = prev[key] ?? {};
        return { ...prev, [key]: { ...current, ...patch } };
      });
    },
    [setOverrides],
  );

  const value = useMemo(
    () => ({
      overrides: mergedOverrides,
      getOverride,
      patchOverride,
    }),
    [getOverride, mergedOverrides, patchOverride],
  );

  return createElement(InspirationOverridesContext.Provider, { value }, children);
}

export function useInspirationOverrides() {
  const context = useContext(InspirationOverridesContext);
  if (!context) {
    throw new Error(
      "useInspirationOverrides must be used within InspirationOverridesProvider",
    );
  }
  return context;
}
