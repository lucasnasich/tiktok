import { normalizeRoleId, type ContentRoleId } from "../content/content-roles.ts";
import {
  getFormatCapabilities,
  isFormatCompatibleWithProduction,
  isFormatCompatibleWithPublicationType,
} from "../content/format-capabilities.ts";
import { formats } from "../content/formats.ts";
import type { PublicationTypeId } from "../content/publication-types.ts";
import { isFormatCompatibleWithRole } from "../content/slot-compatibility.ts";

export type CreativeFormatRecommendation = {
  id: string;
  label: string;
  summary: string;
  score: number;
  reasons: string[];
};

const ROLE_FORMAT_AFFINITY: Record<ContentRoleId, string[]> = {
  build_in_public: [
    "grabacion-pantalla",
    "nota-iphone",
    "captura-chat",
    "motion-graphics",
    "texto-cinetico",
    "video-ia",
    "ultima-hora",
  ],
  educacion: [
    "pizarra",
    "x-razones",
    "x-senales",
    "motion-graphics",
    "texto-cinetico",
    "mito-vs-realidad",
  ],
  producto: [
    "grabacion-pantalla",
    "problema-vs-solucion",
    "lo-nuevo-vs-lo-viejo",
    "motion-graphics",
    "transformacion",
    "video-ia",
  ],
  marca: [
    "mito-vs-realidad",
    "nosotros-vs-ellos",
    "texto-cinetico",
    "titular-con-dato",
    "advertencia",
  ],
  evidencia: [
    "testimonio-cliente",
    "resenas",
    "titular-con-dato",
    "transformacion",
    "captura-chat",
  ],
  comunidad: [
    "captura-chat",
    "estilo-reddit",
    "nota-iphone",
    "tier-list",
    "video-ia",
    "talking-head",
  ],
};

/**
 * Filtra primero los formatos imposibles de producir y recién después rankea.
 * Nunca sugiere talking head / green screen / piel en una cuenta faceless.
 */
export function recommendCreativeFormats(input: {
  roleId: string;
  publicationTypeId: PublicationTypeId;
  cameraMode?: string;
  limit?: number;
}): CreativeFormatRecommendation[] {
  const roleId = normalizeRoleId(input.roleId);
  const limit = input.limit ?? 4;
  const affinity = new Set(ROLE_FORMAT_AFFINITY[roleId] ?? []);
  const scored: CreativeFormatRecommendation[] = [];

  for (const format of formats) {
    if (!isFormatCompatibleWithProduction(format.id, input.cameraMode)) continue;
    if (
      !isFormatCompatibleWithPublicationType(format.id, input.publicationTypeId)
    ) {
      continue;
    }
    if (!isFormatCompatibleWithRole(roleId, format.id)) continue;

    const reasons: string[] = [];
    let score = 1;
    if (affinity.has(format.id)) {
      score += 3;
      reasons.push("Afín al rol");
    }
    const caps = getFormatCapabilities(format.id);
    if (
      input.publicationTypeId === "short_video" &&
      (caps.needsScreenRecording ||
        format.id === "motion-graphics" ||
        format.id === "video-ia" ||
        format.id === "texto-cinetico")
    ) {
      score += 1;
      reasons.push("Ejecución de video faceless");
    }
    if (caps.canGenerateWithAi) score += 0.25;
    if (reasons.length === 0) {
      reasons.push("Compatible con el tipo y la producción");
    }

    scored.push({
      id: format.id,
      label: format.label,
      summary: format.summary,
      score,
      reasons,
    });
  }

  scored.sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
  return scored.slice(0, limit);
}
