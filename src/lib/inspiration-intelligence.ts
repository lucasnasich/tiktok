import { cameraPresenceConstraint, cameraPresenceShortLabel } from "@/content/camera-presence";
import { getContentRoleLabel } from "@/content/content-roles";
import { getFormatLabel } from "@/content/formats";
import type {
  InspirationIntelligenceStatus,
  InspirationMatchCandidate,
  InspirationMatchMode,
} from "@/content/inspiration-analysis";
import { INSPIRATION_HYBRID_WEIGHTS } from "@/content/inspiration-match-config";
import { getPlanningPillarLabel } from "@/content/planning-pillars";
import type { PlanningSlot } from "@/content/planned-slots";
import type { SlotSpecRecord } from "@/content/slot-specs";

export const INSPIRATION_INTELLIGENCE_STATUS_API =
  "/__studio/inspiration-intelligence/status";
export const INSPIRATION_MATCH_API = "/__studio/inspiration-match";

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
  parts.push(`Formato: ${getFormatLabel(slot.formatId)}`);
  parts.push(`Rol: ${getContentRoleLabel(slot.roleId)}`);
  parts.push(`Pilar: ${getPlanningPillarLabel(slot.pillarId)}`);
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
  parts.push(`Formato: ${getFormatLabel(slot.formatId)}`);
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

export { INSPIRATION_HYBRID_WEIGHTS };
