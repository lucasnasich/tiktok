import {
  CREATIVE_PROPOSAL_COUNT,
  hasCreativeProposalEssentials,
  type CreativeGenerationMode,
  type CreativeProposal,
  type CreativeProposalDraft,
  type CreativeProposalGuidance,
} from "@/content/creative-proposals";

const GENERATION_MODES: CreativeGenerationMode[] = [
  "free",
  "more_like_this",
  "guided",
];

export function createCreativeProposalId(): string {
  return `creative-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createCreativeBatchId(): string {
  return `batch-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function stringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
  return items.length > 0 ? items : undefined;
}

function parseGuidance(value: unknown): CreativeProposalGuidance | undefined {
  if (!value || typeof value !== "object") return undefined;
  const raw = value as Record<string, unknown>;
  const creativeFormatIds = stringArray(raw.creativeFormatIds);
  const inspirationRefs = stringArray(raw.inspirationRefs);
  const instruction =
    typeof raw.instruction === "string" && raw.instruction.trim()
      ? raw.instruction.trim()
      : undefined;
  if (!creativeFormatIds && !inspirationRefs && !instruction) return undefined;
  return { creativeFormatIds, inspirationRefs, instruction };
}

export function parseCreativeProposal(
  value: unknown,
): CreativeProposal | undefined {
  if (!value || typeof value !== "object") return undefined;
  const raw = value as Record<string, unknown>;
  const generationMode = GENERATION_MODES.includes(
    raw.generationMode as CreativeGenerationMode,
  )
    ? (raw.generationMode as CreativeGenerationMode)
    : undefined;
  const structure = stringArray(raw.structure);
  if (
    typeof raw.id !== "string" ||
    typeof raw.slotId !== "string" ||
    typeof raw.title !== "string" ||
    typeof raw.idea !== "string" ||
    typeof raw.angle !== "string" ||
    typeof raw.message !== "string" ||
    typeof raw.visualConcept !== "string" ||
    !structure ||
    !generationMode
  ) {
    return undefined;
  }

  return {
    id: raw.id,
    slotId: raw.slotId,
    batchId:
      typeof raw.batchId === "string" && raw.batchId.trim()
        ? raw.batchId
        : raw.id,
    title: raw.title.trim(),
    idea: raw.idea.trim(),
    angle: raw.angle.trim(),
    message: raw.message.trim(),
    visualConcept: raw.visualConcept.trim(),
    structure,
    requiredAssets: stringArray(raw.requiredAssets),
    createdAt:
      typeof raw.createdAt === "string" && raw.createdAt.trim()
        ? raw.createdAt
        : new Date().toISOString(),
    parentProposalId:
      typeof raw.parentProposalId === "string" && raw.parentProposalId.trim()
        ? raw.parentProposalId
        : undefined,
    generationMode,
    guidance: parseGuidance(raw.guidance),
    inspirationRefs: stringArray(raw.inspirationRefs),
  };
}

export function parseCreativeProposals(value: unknown): CreativeProposal[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(parseCreativeProposal)
    .filter((item): item is CreativeProposal => Boolean(item));
}

export function materializeCreativeProposals(input: {
  slotId: string;
  drafts: CreativeProposalDraft[];
  generationMode: CreativeGenerationMode;
  parentProposalId?: string;
  guidance?: CreativeProposalGuidance;
}): CreativeProposal[] {
  const createdAt = new Date().toISOString();
  const batchId = createCreativeBatchId();
  return input.drafts.map((draft) => ({
    id: createCreativeProposalId(),
    slotId: input.slotId,
    batchId,
    title: draft.title.trim(),
    idea: draft.idea.trim(),
    angle: draft.angle.trim(),
    message: draft.message.trim(),
    visualConcept: draft.visualConcept.trim(),
    structure: draft.structure.map((item) => item.trim()).filter(Boolean),
    requiredAssets: draft.requiredAssets
      ?.map((item) => item.trim())
      .filter(Boolean),
    createdAt,
    parentProposalId: input.parentProposalId,
    generationMode: input.generationMode,
    guidance: input.guidance,
  }));
}

export function selectedCreativeProposal(
  proposals: CreativeProposal[] | undefined,
  selectedId?: string,
): CreativeProposal | undefined {
  if (!selectedId || !proposals?.length) return undefined;
  return proposals.find((proposal) => proposal.id === selectedId);
}

export function latestCreativeBatch(
  proposals: CreativeProposal[] | undefined,
): CreativeProposal[] {
  if (!proposals?.length) return [];
  const newest = [...proposals].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )[0];
  return proposals.filter((proposal) => proposal.batchId === newest.batchId);
}

export function olderCreativeBatches(
  proposals: CreativeProposal[] | undefined,
): CreativeProposal[][] {
  if (!proposals?.length) return [];
  const latestId = latestCreativeBatch(proposals)[0]?.batchId;
  const order: string[] = [];
  const map = new Map<string, CreativeProposal[]>();
  for (const proposal of proposals) {
    if (proposal.batchId === latestId) continue;
    if (!map.has(proposal.batchId)) {
      map.set(proposal.batchId, []);
      order.push(proposal.batchId);
    }
    map.get(proposal.batchId)?.push(proposal);
  }
  return order
    .sort((a, b) => {
      const aAt = map.get(a)?.[0]?.createdAt ?? "";
      const bAt = map.get(b)?.[0]?.createdAt ?? "";
      return bAt.localeCompare(aAt);
    })
    .map((id) => map.get(id) ?? []);
}

export function associateInspirationRef(
  proposal: CreativeProposal,
  key: string,
): CreativeProposal {
  const refs = proposal.inspirationRefs ?? [];
  if (refs.includes(key)) return proposal;
  return { ...proposal, inspirationRefs: [...refs, key] };
}

export function detachInspirationRef(
  proposal: CreativeProposal,
  key: string,
): CreativeProposal {
  const refs = (proposal.inspirationRefs ?? []).filter((item) => item !== key);
  return {
    ...proposal,
    inspirationRefs: refs.length > 0 ? refs : undefined,
  };
}

export function isCompleteCreativeDraftBatch(
  drafts: CreativeProposalDraft[],
  expected = CREATIVE_PROPOSAL_COUNT,
): boolean {
  return (
    drafts.length === expected &&
    drafts.every((draft) => hasCreativeProposalEssentials(draft))
  );
}
