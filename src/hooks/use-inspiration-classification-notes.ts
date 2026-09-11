import { useCallback, useMemo, type ReactNode, createContext, createElement, useContext } from "react";

import { usePersistedState } from "@/hooks/use-persisted-state";
import type { InspirationClassificationNote } from "@/lib/inspiration-classification-prompt";

type NotesMap = Record<string, InspirationClassificationNote>;

function parseNotes(raw: unknown): NotesMap | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const result: NotesMap = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!value || typeof value !== "object") continue;
    const entry = value as Record<string, unknown>;
    const note: InspirationClassificationNote = {
      contextText:
        typeof entry.contextText === "string" ? entry.contextText : undefined,
      hasAudio: entry.hasAudio === true,
      recordedAt:
        typeof entry.recordedAt === "string" ? entry.recordedAt : undefined,
    };
    if (note.contextText || note.hasAudio) result[key] = note;
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

type Api = {
  getNote: (key: string) => InspirationClassificationNote | undefined;
  patchNote: (key: string, patch: InspirationClassificationNote) => void;
  clearNote: (key: string) => void;
};

const Context = createContext<Api | null>(null);

export function InspirationClassificationNotesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [notes, setNotes] = usePersistedState<NotesMap>(
    "inspiration-classification-notes",
    {},
    parseNotes,
  );

  const getNote = useCallback((key: string) => notes[key], [notes]);

  const patchNote = useCallback(
    (key: string, patch: InspirationClassificationNote) => {
      setNotes((prev) => ({
        ...prev,
        [key]: { ...prev[key], ...patch },
      }));
    },
    [setNotes],
  );

  const clearNote = useCallback(
    (key: string) => {
      setNotes((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [setNotes],
  );

  const value = useMemo(
    () => ({ getNote, patchNote, clearNote }),
    [clearNote, getNote, patchNote],
  );

  return createElement(Context.Provider, { value }, children);
}

export function useInspirationClassificationNotes() {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "useInspirationClassificationNotes must be used within InspirationClassificationNotesProvider",
    );
  }
  return context;
}
