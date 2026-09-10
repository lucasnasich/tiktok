import { useCallback, useMemo, type ReactNode, createContext, createElement, useContext } from "react";

import type { SlotSpecRecord } from "@/content/slot-specs";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { parseSlotSpecRecords } from "@/lib/slot-specs-store";

type SlotSpecsApi = {
  records: Record<string, SlotSpecRecord>;
  getRecord: (slotId: string) => SlotSpecRecord | undefined;
  upsertRecord: (record: SlotSpecRecord) => void;
  patchRecord: (slotId: string, patch: Partial<SlotSpecRecord>) => void;
  clearRecord: (slotId: string) => void;
};

const SlotSpecsContext = createContext<SlotSpecsApi | null>(null);

export function SlotSpecsProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = usePersistedState<Record<string, SlotSpecRecord>>(
    "slot-specs",
    {},
    parseSlotSpecRecords,
  );

  const getRecord = useCallback(
    (slotId: string) => records[slotId],
    [records],
  );

  const upsertRecord = useCallback(
    (record: SlotSpecRecord) => {
      setRecords((prev) => ({ ...prev, [record.slotId]: record }));
    },
    [setRecords],
  );

  const patchRecord = useCallback(
    (slotId: string, patch: Partial<SlotSpecRecord>) => {
      setRecords((prev) => {
        const current = prev[slotId];
        if (!current) return prev;
        return { ...prev, [slotId]: { ...current, ...patch, slotId } };
      });
    },
    [setRecords],
  );

  const clearRecord = useCallback(
    (slotId: string) => {
      setRecords((prev) => {
        if (!prev[slotId]) return prev;
        const next = { ...prev };
        delete next[slotId];
        return next;
      });
    },
    [setRecords],
  );

  const value = useMemo(
    () => ({ records, getRecord, upsertRecord, patchRecord, clearRecord }),
    [clearRecord, getRecord, patchRecord, records, upsertRecord],
  );

  return createElement(SlotSpecsContext.Provider, { value }, children);
}

export function useSlotSpecs() {
  const context = useContext(SlotSpecsContext);
  if (!context) {
    throw new Error("useSlotSpecs must be used within SlotSpecsProvider");
  }
  return context;
}
