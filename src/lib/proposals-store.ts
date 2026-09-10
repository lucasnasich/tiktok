import {
  proposals as seedProposals,
  type Proposal,
  type ProposalContentBlock,
  type ProposalStatus,
  type SignalSourceType,
} from "@/content/proposals";

const SIGNAL_SOURCE_TYPES: SignalSourceType[] = [
  "inspiration",
  "mercantis",
  "manual",
];
const STATUSES: ProposalStatus[] = ["candidate", "selected"];

function migrateSignalSourceType(value: unknown): SignalSourceType | undefined {
  if (value === "brain") return "mercantis";
  if (typeof value === "string" && SIGNAL_SOURCE_TYPES.includes(value as SignalSourceType)) {
    return value as SignalSourceType;
  }
  return undefined;
}

function migrateStatus(value: unknown): ProposalStatus | undefined {
  if (value === "in-copy") return "selected";
  if (typeof value === "string" && STATUSES.includes(value as ProposalStatus)) {
    return value as ProposalStatus;
  }
  return undefined;
}

function stringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter((item): item is string => typeof item === "string");
  return items.length > 0 ? items : undefined;
}

function parseContentBlocks(value: unknown): ProposalContentBlock[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const blocks: ProposalContentBlock[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const raw = entry as Record<string, unknown>;
    if (typeof raw.copy !== "string") continue;
    const order = typeof raw.order === "number" ? raw.order : blocks.length + 1;
    blocks.push({
      order,
      type: typeof raw.type === "string" ? raw.type : undefined,
      copy: raw.copy,
      visualDirection:
        typeof raw.visualDirection === "string" ? raw.visualDirection : undefined,
    });
  }
  return blocks.length > 0 ? blocks : undefined;
}

function isProposal(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object") return false;
  const raw = value as Record<string, unknown>;
  const signalSourceType = migrateSignalSourceType(
    raw.signalSourceType ?? raw.sourceType,
  );
  const status = migrateStatus(raw.status);
  return (
    typeof raw.id === "string" &&
    typeof raw.planSlotId === "string" &&
    signalSourceType !== undefined &&
    typeof raw.concept === "string" &&
    typeof raw.hook === "string" &&
    status !== undefined
  );
}

function normalizeProposal(value: unknown): Proposal | undefined {
  if (!isProposal(value)) return undefined;
  const raw = value as Record<string, unknown>;
  const signalSourceType = migrateSignalSourceType(
    raw.signalSourceType ?? raw.sourceType,
  );
  const status = migrateStatus(raw.status);
  if (!signalSourceType || !status) return undefined;

  const brainRefs = stringArray(raw.brainRefs);
  const contentBlocks = parseContentBlocks(raw.contentBlocks);
  const assetIds = stringArray(raw.assetIds);
  const angleId = typeof raw.angleId === "string" ? raw.angleId : undefined;

  return {
    id: String(raw.id),
    planSlotId: String(raw.planSlotId),
    signalSourceType,
    sourceRef: typeof raw.sourceRef === "string" ? raw.sourceRef : undefined,
    signal: typeof raw.signal === "string" ? raw.signal : undefined,
    angleId,
    concept: String(raw.concept),
    hook: String(raw.hook),
    narrative: typeof raw.narrative === "string" ? raw.narrative : undefined,
    contentBlocks,
    cta: typeof raw.cta === "string" ? raw.cta : undefined,
    caption: typeof raw.caption === "string" ? raw.caption : undefined,
    visualDirection:
      typeof raw.visualDirection === "string" ? raw.visualDirection : undefined,
    assetIds,
    brainRefs,
    status,
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : undefined,
  };
}

export function parseProposals(raw: unknown): Proposal[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const parsed = raw
    .map(normalizeProposal)
    .filter((item): item is Proposal => item !== undefined);
  return parsed;
}

export function createProposalId(): string {
  return `proposal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const SEED_PROPOSALS: Proposal[] = seedProposals;

export function mergeSeedProposals(
  persisted: Proposal[],
  seed: Proposal[] = SEED_PROPOSALS,
): Proposal[] {
  const persistedIds = new Set(persisted.map((proposal) => proposal.id));
  return [...persisted, ...seed.filter((proposal) => !persistedIds.has(proposal.id))];
}

export function proposalsForSlot(
  proposals: Proposal[],
  planSlotId: string,
): Proposal[] {
  return proposals.filter((proposal) => proposal.planSlotId === planSlotId);
}

export function selectedProposalForSlot(
  proposals: Proposal[],
  planSlotId: string,
): Proposal | undefined {
  return proposals.find(
    (proposal) =>
      proposal.planSlotId === planSlotId && proposal.status === "selected",
  );
}

export function replaceProposalsForSlot(
  proposals: Proposal[],
  planSlotId: string,
  nextForSlot: Proposal[],
): Proposal[] {
  return [
    ...proposals.filter((proposal) => proposal.planSlotId !== planSlotId),
    ...nextForSlot,
  ];
}

export function selectProposalInList(
  proposals: Proposal[],
  proposalId: string,
): Proposal[] {
  const target = proposals.find((proposal) => proposal.id === proposalId);
  if (!target) return proposals;
  return proposals.map((proposal) => {
    if (proposal.id === proposalId) {
      return { ...proposal, status: "selected" as const };
    }
    if (
      proposal.planSlotId === target.planSlotId &&
      proposal.status === "selected"
    ) {
      return { ...proposal, status: "candidate" as const };
    }
    return proposal;
  });
}

export function readLegacyIdeasFromStorage(): Proposal[] | undefined {
  try {
    const raw = localStorage.getItem("mercantis-studio:ideas");
    if (raw === null) return undefined;
    return parseProposals(JSON.parse(raw) as unknown);
  } catch {
    return undefined;
  }
}
