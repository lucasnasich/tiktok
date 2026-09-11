import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import type { Proposal } from "@/content/proposals";
import { usePersistedState } from "@/hooks/use-persisted-state";
import {
  SEED_PROPOSALS,
  mergeSeedProposals,
  parseProposals,
  replaceProposalsForSlot,
  selectProposalInList,
} from "@/lib/proposals-store";

type ProposalsApi = {
  proposals: Proposal[];
  addProposal: (proposal: Proposal) => void;
  updateProposal: (proposalId: string, patch: Partial<Proposal>) => void;
  selectProposal: (proposalId: string) => void;
  replaceSlotProposals: (planSlotId: string, next: Proposal[]) => void;
};

const ProposalsContext = createContext<ProposalsApi | null>(null);

function initialProposals(): Proposal[] {
  return SEED_PROPOSALS;
}

export function ProposalsProvider({ children }: { children: ReactNode }) {
  const [persisted, setProposals] = usePersistedState<Proposal[]>(
    "proposals",
    initialProposals(),
    parseProposals,
  );
  const proposals = useMemo(
    () => mergeSeedProposals(persisted, SEED_PROPOSALS),
    [persisted],
  );

  const addProposal = useCallback(
    (proposal: Proposal) => {
      setProposals((prev) => [...prev, proposal]);
    },
    [setProposals],
  );

  const updateProposal = useCallback(
    (proposalId: string, patch: Partial<Proposal>) => {
      setProposals((prev) => {
        const merged = mergeSeedProposals(prev, SEED_PROPOSALS);
        return merged.map((proposal) =>
          proposal.id === proposalId ? { ...proposal, ...patch } : proposal,
        );
      });
    },
    [setProposals],
  );

  const selectProposal = useCallback(
    (proposalId: string) => {
      setProposals((prev) =>
        selectProposalInList(
          mergeSeedProposals(prev, SEED_PROPOSALS),
          proposalId,
        ),
      );
    },
    [setProposals],
  );

  const replaceSlotProposals = useCallback(
    (planSlotId: string, next: Proposal[]) => {
      setProposals((prev) => replaceProposalsForSlot(prev, planSlotId, next));
    },
    [setProposals],
  );

  const value = useMemo(
    () => ({
      proposals,
      addProposal,
      updateProposal,
      selectProposal,
      replaceSlotProposals,
    }),
    [
      addProposal,
      proposals,
      replaceSlotProposals,
      selectProposal,
      updateProposal,
    ],
  );

  return createElement(ProposalsContext.Provider, { value }, children);
}

export function useProposals() {
  const context = useContext(ProposalsContext);
  if (!context) {
    throw new Error("useProposals must be used within ProposalsProvider");
  }
  return context;
}
