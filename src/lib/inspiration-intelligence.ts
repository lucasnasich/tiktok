import { cameraPresenceConstraint, cameraPresenceShortLabel } from "@/content/camera-presence";
import { getContentRoleLabel, getContentRoleSummary } from "@/content/content-roles";
import type { CreativeGenerationMode, CreativeProposal, CreativeProposalDraft, CreativeProposalGuidance } from "@/content/creative-proposals";
import { getFormatById, getFormatLabel } from "@/content/formats";
import { getPublicationTypeLabel } from "@/content/publication-types";
import { getProductionOption } from "@/content/production-options";
import {
  resolveSlotPublicationType,
  type PlanningSlot,
} from "@/content/planned-slots";
import type {
  InspirationIntelligenceStatus,
  InspirationMatchCandidate,
  InspirationMatchMode,
} from "@/content/inspiration-analysis";
import { INSPIRATION_HYBRID_WEIGHTS } from "@/content/inspiration-match-config";
import { getSlotTopicLabel, getSlotTopicSummary } from "@/content/role-topics";
import type {
  SlotSpec,
  SlotSpecRecord,
} from "@/content/slot-specs";
import { getInspirationByKey } from "@/content/inspiration-feed";

export const INSPIRATION_INTELLIGENCE_STATUS_API =
  "/__studio/inspiration-intelligence/status";
export const INSPIRATION_MATCH_API = "/__studio/inspiration-match";
export const CREATIVE_PROPOSALS_API = "/__studio/creative-proposals";

export function structuralBriefOf(record: SlotSpecRecord | undefined) {
  return record?.structuralSearchBrief || record?.inspirationSearchBrief || "";
}

export function visualBriefOf(record: SlotSpecRecord | undefined) {
  return record?.visualSearchBrief || record?.inspirationSearchBrief || "";
}

export function buildStructureQuery(
  slot: PlanningSlot,
  record?: SlotSpecRecord,
  proposal?: CreativeProposal,
) {
  const brief = structuralBriefOf(record).trim();
  const parts: string[] = [];
  if (proposal) {
    parts.push(proposal.idea, proposal.angle, proposal.structure.join("\n"));
  } else if (brief) {
    parts.push(brief, brief);
    if (record?.editorialDescription?.trim()) {
      parts.push(record.editorialDescription.trim());
    }
  }
  parts.push(
    `Pieza: ${getPublicationTypeLabel(resolveSlotPublicationType(slot))}`,
  );
  return parts.join("\n");
}

export function buildVisualQuery(
  slot: PlanningSlot,
  record?: SlotSpecRecord,
  proposal?: CreativeProposal,
) {
  const brief = visualBriefOf(record).trim();
  const parts: string[] = [];
  if (proposal) {
    parts.push(proposal.visualConcept, proposal.idea);
  } else if (brief) {
    parts.push(brief, brief);
  }
  parts.push(
    `Pieza: ${getPublicationTypeLabel(resolveSlotPublicationType(slot))}`,
  );
  if (slot.cameraPresence) {
    parts.push(`Cámara: ${cameraPresenceShortLabel(slot.cameraPresence)}`);
    parts.push(cameraPresenceConstraint(slot.cameraPresence));
  }
  return parts.join("\n");
}

export async function fetchInspirationIntelligenceStatus(): Promise<InspirationIntelligenceStatus | null> {
  if (!import.meta.env.DEV) return null;
  try {
    const response = await fetch(INSPIRATION_INTELLIGENCE_STATUS_API, {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = (await response.json()) as InspirationIntelligenceStatus;
    if (typeof data?.configured !== "boolean") return null;
    return data;
  } catch {
    return null;
  }
}

export async function fetchInspirationMatches(input: {
  mode: InspirationMatchMode;
  query: string;
  formatId?: string;
  roleId?: string;
  pillarId?: string;
  topicId?: string;
  cameraPresence?: string;
  signal?: AbortSignal;
}): Promise<{ configured: boolean; candidates: InspirationMatchCandidate[] }> {
  if (!import.meta.env.DEV || !input.query.trim()) {
    return { configured: false, candidates: [] };
  }

  try {
    const response = await fetch(INSPIRATION_MATCH_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: input.mode,
        query: input.query,
        formatId: input.formatId,
        roleId: input.roleId,
        pillarId: input.pillarId,
        topicId: input.topicId,
        cameraPresence: input.cameraPresence,
      }),
      signal: input.signal,
    });
    if (!response.ok) {
      return { configured: false, candidates: [] };
    }
    const data = (await response.json()) as {
      configured?: boolean;
      candidates?: InspirationMatchCandidate[];
    };
    return {
      configured: Boolean(data.configured),
      candidates: Array.isArray(data.candidates) ? data.candidates : [],
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { configured: false, candidates: [] };
    }
    return { configured: false, candidates: [] };
  }
}

export async function fetchCreativeProposals(input: {
  spec: SlotSpec;
  accountLabel?: string;
  generationMode?: CreativeGenerationMode;
  parentProposal?: CreativeProposal;
  guidance?: CreativeProposalGuidance;
  signal?: AbortSignal;
}): Promise<CreativeProposalDraft[]> {
  if (!import.meta.env.DEV) {
    throw new Error("Generar con Gemini solo está disponible en el Studio local.");
  }

  const spec = input.spec;
  const production = getProductionOption(spec.productionTypeId);
  const generationMode = input.generationMode ?? "free";
  const parent = input.parentProposal;
  const guidance = input.guidance;
  const guidedFormats =
    generationMode === "guided"
      ? (guidance?.creativeFormatIds ?? []).map((id) => ({
          id,
          label: getFormatLabel(id),
          summary: getFormatById(id)?.summary ?? "",
        }))
      : [];
  const guidedInspiration =
    generationMode === "guided"
      ? (guidance?.inspirationRefs ?? []).map((key) => {
          const item = getInspirationByKey(key);
          return {
            key,
            title: item?.title ?? key,
            signal: item?.signal,
            creativeMechanism: item?.creativeMechanism,
          };
        })
      : [];

  const response = await fetch(CREATIVE_PROPOSALS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slotId: spec.slotId,
      accountId: spec.accountId,
      accountLabel: input.accountLabel || spec.accountId,
      roleId: spec.roleId,
      roleLabel: getContentRoleLabel(spec.roleId),
      roleSummary: getContentRoleSummary(spec.roleId),
      topicId: spec.topicId,
      topicLabel: getSlotTopicLabel({
        roleId: spec.roleId,
        topicId: spec.topicId,
        pillarId: spec.pillarId,
      }),
      topicSummary: getSlotTopicSummary({
        roleId: spec.roleId,
        topicId: spec.topicId,
        pillarId: spec.pillarId,
      }),
      productionTypeId: spec.productionTypeId,
      productionTypeLabel: production?.label ?? spec.productionTypeId,
      productionTypeSummary: production?.summary ?? "",
      productionTypeExample: production?.example ?? "",
      cameraPresence: spec.cameraPresence,
      cameraPresenceLabel: spec.cameraPresence
        ? cameraPresenceShortLabel(spec.cameraPresence)
        : "",
      cameraPresenceConstraint: spec.cameraPresence
        ? cameraPresenceConstraint(spec.cameraPresence)
        : "",
      platforms: spec.platforms,
      date: spec.date,
      time: spec.time,
      brainRefs: spec.brainRefs,
      editorialConstraints: spec.editorialConstraints,
      generationMode,
      parentProposal: parent
        ? {
            title: parent.title,
            idea: parent.idea,
            angle: parent.angle,
            message: parent.message,
            visualConcept: parent.visualConcept,
            structure: parent.structure,
          }
        : undefined,
      guidance:
        generationMode === "guided"
          ? {
              creativeFormats: guidedFormats,
              inspirationRefs: guidedInspiration,
              instruction: guidance?.instruction,
            }
          : undefined,
    }),
    signal: input.signal,
  });

  const data = (await response.json().catch(() => null)) as
    | {
        configured?: boolean;
        error?: string;
        proposals?: CreativeProposalDraft[];
      }
    | null;

  if (data?.configured === false) {
    throw new Error(
      data.error?.trim() ||
        "Falta GOOGLE_GENERATIVE_AI_API_KEY. Configurala en .env.local.",
    );
  }
  if (!response.ok) {
    throw new Error(
      data?.error?.trim() || "Gemini no pudo generar las propuestas creativas.",
    );
  }
  if (!Array.isArray(data?.proposals) || data.proposals.length !== 5) {
    throw new Error("Gemini no devolvió cinco propuestas.");
  }
  return data.proposals;
}

export { INSPIRATION_HYBRID_WEIGHTS };
