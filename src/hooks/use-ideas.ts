import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import type { Idea } from "@/content/ideas";
import { usePersistedState } from "@/hooks/use-persisted-state";
import {
  SEED_IDEAS,
  parseIdeas,
  selectIdeaInList,
} from "@/lib/ideas-store";

type IdeasApi = {
  ideas: Idea[];
  addIdea: (idea: Idea) => void;
  updateIdea: (ideaId: string, patch: Partial<Idea>) => void;
  selectIdea: (ideaId: string) => void;
};

const IdeasContext = createContext<IdeasApi | null>(null);

export function IdeasProvider({ children }: { children: ReactNode }) {
  const [ideas, setIdeas] = usePersistedState<Idea[]>(
    "ideas",
    SEED_IDEAS,
    parseIdeas,
  );

  const addIdea = useCallback(
    (idea: Idea) => {
      setIdeas((prev) => [...prev, idea]);
    },
    [setIdeas],
  );

  const updateIdea = useCallback(
    (ideaId: string, patch: Partial<Idea>) => {
      setIdeas((prev) =>
        prev.map((idea) => (idea.id === ideaId ? { ...idea, ...patch } : idea)),
      );
    },
    [setIdeas],
  );

  const selectIdea = useCallback(
    (ideaId: string) => {
      setIdeas((prev) => selectIdeaInList(prev, ideaId));
    },
    [setIdeas],
  );

  const value = useMemo(
    () => ({ ideas, addIdea, updateIdea, selectIdea }),
    [addIdea, ideas, selectIdea, updateIdea],
  );

  return createElement(IdeasContext.Provider, { value }, children);
}

export function useIdeas() {
  const context = useContext(IdeasContext);
  if (!context) {
    throw new Error("useIdeas must be used within IdeasProvider");
  }
  return context;
}
