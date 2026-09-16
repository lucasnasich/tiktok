import { cameraPresenceConstraint, cameraPresenceShortLabel } from "@/content/camera-presence";
import { getContentRoleLabel, getContentRoleSummary } from "@/content/content-roles";
import { getFormatById, getFormatLabel } from "@/content/formats";
import { getPublicationTypeLabel } from "@/content/publication-types";
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
  SlotDescriptionPayload,
  SlotSpec,
  SlotSpecRecord,
} from "@/content/slot-specs";

export const INSPIRATION_INTELLIGENCE_STATUS_API =
  "/__studio/inspiration-intelligence/status";
export const INSPIRATION_MATCH_API = "/__studio/inspiration-match";
export const SLOT_DESCRIPTION_API = "/__studio/slot-description";

export function structuralBriefOf(record: SlotSpecRecord | undefined) {
  return record?.structuralSearchBrief || record?.inspirationSearchBrief || "";
}

export function visualBriefOf(record: SlotSpecRecord | undefined) {
  return record?.visualSearchBrief || record?.inspirationSearchBrief || "";
}

export function buildStructureQuery(slot: PlanningSlot, record?: SlotSpecRecord) {
  const brief = structuralBriefOf(record).trim();
  const parts: string[] = [];
  if (brief) {
    parts.push(brief, brief);
  }
  if (record?.editorialDescription?.trim()) {
    parts.push(record.editorialDescription.trim());
  }
  parts.push(
    `Pieza: ${getPublicationTypeLabel(resolveSlotPublicationType(slot))}`,
  );
  if (slot.formatId) {
    parts.push(`Formato creativo legacy: ${getFormatLabel(slot.formatId)}`);
  }
  parts.push(`Rol: ${getContentRoleLabel(slot.roleId)}`);
  parts.push(`Tema: ${getSlotTopicLabel(slot)}`);
  if (slot.cameraPresence) {
    parts.push(
      `Producción / cámara (si afecta la estructura): ${cameraPresenceShortLabel(slot.cameraPresence)}`,
    );
  }
  return parts.join("\n");
}

export function buildVisualQuery(slot: PlanningSlot, record?: SlotSpecRecord) {
  const brief = visualBriefOf(record).trim();
  const parts: string[] = [];
  if (brief) {
    parts.push(brief, brief);
  }
  parts.push(
    `Pieza: ${getPublicationTypeLabel(resolveSlotPublicationType(slot))}`,
  );
  if (slot.formatId) {
    parts.push(`Formato creativo legacy: ${getFormatLabel(slot.formatId)}`);
  }
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

export async function fetchSlotDescription(input: {
  spec: SlotSpec;
  accountLabel?: string;
  signal?: AbortSignal;
}): Promise<SlotDescriptionPayload> {
  if (!import.meta.env.DEV) {
    throw new Error("Generar con Gemini solo está disponible en el Studio local.");
  }

  const spec = input.spec;
  const response = await fetch(SLOT_DESCRIPTION_API, {
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
      pillarId: spec.topicId,
      pillarLabel: getSlotTopicLabel({
        roleId: spec.roleId,
        topicId: spec.topicId,
        pillarId: spec.pillarId,
      }),
      pillarSummary: getSlotTopicSummary({
        roleId: spec.roleId,
        topicId: spec.topicId,
        pillarId: spec.pillarId,
      }),
      publicationTypeId: spec.publicationTypeId,
      publicationTypeLabel: getPublicationTypeLabel(spec.publicationTypeId),
      formatId: spec.formatId,
      formatLabel: spec.formatId ? getFormatLabel(spec.formatId) : "",
      formatSummary: spec.formatId
        ? getFormatById(spec.formatId)?.summary ?? ""
        : "",
      recommendedCreativeFormats: spec.recommendedCreativeFormats,
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
    }),
    signal: input.signal,
  });

  const data = (await response.json().catch(() => null)) as
    | (Partial<SlotDescriptionPayload> & {
        configured?: boolean;
        error?: string;
      })
    | null;

  if (data?.configured === false) {
    throw new Error(
      data.error?.trim() ||
        "Falta GOOGLE_GENERATIVE_AI_API_KEY. Configurala en .env.local.",
    );
  }
  if (!response.ok) {
    throw new Error(
      data?.error?.trim() || "Gemini no pudo generar la descripción del slot.",
    );
  }
  const editorialDescription = data?.editorialDescription?.trim() ?? "";
  const structuralSearchBrief = data?.structuralSearchBrief?.trim() ?? "";
  const visualSearchBrief = data?.visualSearchBrief?.trim() ?? "";
  if (!editorialDescription || !structuralSearchBrief || !visualSearchBrief) {
    throw new Error("Gemini no devolvió los tres campos requeridos.");
  }
  return { editorialDescription, structuralSearchBrief, visualSearchBrief };
}

export { INSPIRATION_HYBRID_WEIGHTS };
