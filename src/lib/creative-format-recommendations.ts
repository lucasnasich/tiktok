import { normalizeRoleId, type ContentRoleId } from "../content/content-roles.ts";
import {
  getFormatCapabilities,
  isFormatCompatibleWithProduction,
  isFormatCompatibleWithProductionOption,
} from "../content/format-capabilities.ts";
import { formats } from "../content/formats.ts";
import type { ProductionOptionId } from "../content/production-options.ts";
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

const MOTION_FORMATS = new Set([
  "motion-graphics",
  "texto-cinetico",
  "video-ia",
  "grabacion-pantalla",
]);

/**
 * Filtra primero los formatos imposibles de producir y recién después rankea.
 * El formato creativo no puede contradecir la opción de producción del slot.
 */
export function recommendCreativeFormats(input: {
  roleId: string;
  productionTypeId: ProductionOptionId;
  /** @deprecated Usar `productionTypeId`. */
  publicationTypeId?: ProductionOptionId | string;
  cameraMode?: string;
  limit?: number;
}): CreativeFormatRecommendation[] {
  const roleId = normalizeRoleId(input.roleId);
  const limit = input.limit ?? 4;
  const productionTypeId = (input.productionTypeId ??
    input.publicationTypeId) as ProductionOptionId;
  const affinity = new Set(ROLE_FORMAT_AFFINITY[roleId] ?? []);
  const scored: CreativeFormatRecommendation[] = [];

  for (const format of formats) {
    if (!isFormatCompatibleWithProduction(format.id, input.cameraMode)) continue;
    if (!isFormatCompatibleWithProductionOption(format.id, productionTypeId)) {
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
      (productionTypeId === "remotion_video" ||
        productionTypeId === "animated_carousel") &&
      MOTION_FORMATS.has(format.id)
    ) {
      score += 1;
      reasons.push("Ejecución apta para motion");
    }
    if (productionTypeId === "screen_demo" && caps.needsScreenRecording) {
      score += 1;
      reasons.push("Demo de pantalla");
    }
    if (productionTypeId === "ai_generated_video" && caps.canGenerateWithAi) {
      score += 1;
      reasons.push("Generable con IA");
    }
    if (caps.canGenerateWithAi) score += 0.25;
    if (reasons.length === 0) {
      reasons.push("Compatible con la pieza y la producción");
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
