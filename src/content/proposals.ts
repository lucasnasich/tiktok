export type SignalSourceType = "inspiration" | "mercantis" | "manual";

export type ProposalStatus = "candidate" | "selected";

export type ProposalContentBlock = {
  order: number;
  type?: string;
  copy: string;
  visualDirection?: string;
};

export type Proposal = {
  id: string;
  planSlotId: string;
  signalSourceType: SignalSourceType;
  sourceRef?: string;
  structuralSourceRef?: string;
  visualSourceRef?: string;
  signal?: string;
  angleId?: string;
  concept: string;
  hook: string;
  narrative?: string;
  contentBlocks?: ProposalContentBlock[];
  cta?: string;
  caption?: string;
  visualDirection?: string;
  /** Relación liviana a assets de galería; no es un DAM. */
  assetIds?: string[];
  brainRefs?: string[];
  status: ProposalStatus;
  createdAt?: string;
};

export const SIGNAL_SOURCE_TYPE_LABELS: Record<SignalSourceType, string> = {
  inspiration: "Inspiración",
  mercantis: "Mercantis",
  manual: "Manual",
};

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  candidate: "Candidata",
  selected: "Seleccionada",
};

export const proposals: Proposal[] = [];
