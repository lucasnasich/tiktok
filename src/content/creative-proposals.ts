export const CREATIVE_PROPOSAL_COUNT = 5;

export type CreativeGenerationMode = "free" | "more_like_this" | "guided";

export type CreativeProposalGuidance = {
  creativeFormatIds?: string[];
  inspirationRefs?: string[];
  instruction?: string;
};

export type CreativeProposal = {
  id: string;
  slotId: string;
  batchId: string;
  title: string;
  idea: string;
  angle: string;
  message: string;
  visualConcept: string;
  structure: string[];
  requiredAssets?: string[];
  createdAt: string;
  parentProposalId?: string;
  generationMode: CreativeGenerationMode;
  guidance?: CreativeProposalGuidance;
  inspirationRefs?: string[];
};

export type CreativeProposalDraft = {
  title: string;
  idea: string;
  angle: string;
  message: string;
  visualConcept: string;
  structure: string[];
  requiredAssets?: string[];
};

export const CREATIVE_GENERATION_MODE_LABELS: Record<
  CreativeGenerationMode,
  string
> = {
  free: "Libre",
  more_like_this: "Más como esta",
  guided: "Orientada",
};

export function hasCreativeProposalEssentials(
  value: Partial<CreativeProposalDraft> | null | undefined,
): value is CreativeProposalDraft {
  if (!value) return false;
  return (
    Boolean(value.title?.trim()) &&
    Boolean(value.idea?.trim()) &&
    Boolean(value.angle?.trim()) &&
    Boolean(value.message?.trim()) &&
    Boolean(value.visualConcept?.trim()) &&
    Array.isArray(value.structure) &&
    value.structure.some((item) => Boolean(item?.trim()))
  );
}
