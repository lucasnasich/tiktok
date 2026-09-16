import { ON_CAMERA_FORMAT_IDS } from "./camera-presence.ts";
import { isFacelessProduction } from "./camera-presence.ts";
import type { ProductionOptionId } from "./production-options.ts";

export type CreativeFormatCapabilities = {
  requiresCamera: boolean;
  productionOptions: ProductionOptionId[];
  canGenerateWithAi?: boolean;
  needsScreenRecording?: boolean;
  needsProductAssets?: boolean;
};

const STILL: ProductionOptionId[] = ["single_image", "image_carousel"];
const MOTION: ProductionOptionId[] = ["animated_carousel", "remotion_video"];
const DEMO: ProductionOptionId[] = ["screen_demo"];
const AI_VIDEO: ProductionOptionId[] = ["ai_generated_video"];
const TALKING: ProductionOptionId[] = ["talking_camera"];
const TALKING_REMOTION: ProductionOptionId[] = ["talking_camera_remotion"];

const FACELESS: CreativeFormatCapabilities = {
  requiresCamera: false,
  productionOptions: STILL,
  canGenerateWithAi: true,
};

const CAPABILITIES: Record<string, CreativeFormatCapabilities> = {
  "x-razones": { ...FACELESS },
  "historia-instagram": { ...FACELESS, productionOptions: ["single_image"] },
  "nosotros-vs-ellos": { ...FACELESS },
  "diagrama-venn": { ...FACELESS },
  "no-compres-esto": { ...FACELESS },
  "nota-iphone": { ...FACELESS },
  "captura-chat": { ...FACELESS },
  pizarra: { ...FACELESS },
  "cupos-limitados": { ...FACELESS },
  "pedimos-disculpas": { ...FACELESS },
  "testimonio-cliente": {
    requiresCamera: false,
    productionOptions: STILL,
    canGenerateWithAi: false,
  },
  "lo-nuevo-vs-lo-viejo": { ...FACELESS },
  "ultima-hora": { ...FACELESS },
  transformacion: { ...FACELESS },
  "estilo-reddit": { ...FACELESS },
  "en-caso-de-emergencia": { ...FACELESS },
  "busqueda-google": { ...FACELESS },
  "problema-vs-solucion": {
    ...FACELESS,
    needsProductAssets: true,
  },
  "efecto-secundario": { ...FACELESS },
  "oferta-combo": { ...FACELESS },
  "titular-con-dato": { ...FACELESS },
  garabato: { ...FACELESS },
  "captura-email": { ...FACELESS },
  "no-seas-ese-que": { ...FACELESS },
  resenas: { ...FACELESS },
  "texto-sobre-la-piel": {
    requiresCamera: true,
    productionOptions: TALKING,
  },
  "podcast-ia": {
    requiresCamera: false,
    productionOptions: AI_VIDEO,
    canGenerateWithAi: true,
  },
  "tier-list": { ...FACELESS },
  "cero-estrellas": { ...FACELESS },
  "green-screen": {
    requiresCamera: true,
    productionOptions: TALKING_REMOTION,
  },
  "x-senales": { ...FACELESS },
  "mito-vs-realidad": { ...FACELESS },
  "problemas-tachados": { ...FACELESS },
  "lo-que-podes-evitar": { ...FACELESS },
  advertencia: { ...FACELESS },
  "grabacion-pantalla": {
    requiresCamera: false,
    productionOptions: DEMO,
    canGenerateWithAi: false,
    needsScreenRecording: true,
    needsProductAssets: true,
  },
  "motion-graphics": {
    requiresCamera: false,
    productionOptions: MOTION,
    canGenerateWithAi: true,
  },
  "video-ia": {
    requiresCamera: false,
    productionOptions: AI_VIDEO,
    canGenerateWithAi: true,
  },
  "texto-cinetico": {
    requiresCamera: false,
    productionOptions: MOTION,
    canGenerateWithAi: true,
  },
  "talking-head": {
    requiresCamera: true,
    productionOptions: TALKING,
  },
  entrevista: {
    requiresCamera: true,
    productionOptions: TALKING,
  },
  vlog: {
    requiresCamera: true,
    productionOptions: TALKING,
  },
};

export function getFormatCapabilities(
  formatId: string,
): CreativeFormatCapabilities {
  return (
    CAPABILITIES[formatId] ?? {
      requiresCamera: ON_CAMERA_FORMAT_IDS.has(formatId),
      productionOptions: STILL,
      canGenerateWithAi: true,
    }
  );
}

export function formatRequiresCamera(formatId: string): boolean {
  return getFormatCapabilities(formatId).requiresCamera;
}

export function isFormatCompatibleWithProductionOption(
  formatId: string,
  productionTypeId: ProductionOptionId,
): boolean {
  return getFormatCapabilities(formatId).productionOptions.includes(
    productionTypeId,
  );
}

/** @deprecated Usar `isFormatCompatibleWithProductionOption`. */
export function isFormatCompatibleWithPublicationType(
  formatId: string,
  publicationTypeId: string,
): boolean {
  return isFormatCompatibleWithProductionOption(
    formatId,
    publicationTypeId as ProductionOptionId,
  );
}

export function isFormatCompatibleWithProduction(
  formatId: string,
  cameraMode?: string,
): boolean {
  if (!isFacelessProduction(cameraMode)) return true;
  return !formatRequiresCamera(formatId);
}
