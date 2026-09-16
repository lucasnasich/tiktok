import { ON_CAMERA_FORMAT_IDS } from "./camera-presence.ts";
import type { PublicationTypeId } from "./publication-types.ts";
import { isFacelessProduction } from "./camera-presence.ts";

export type CreativeFormatCapabilities = {
  requiresCamera: boolean;
  publicationTypes: PublicationTypeId[];
  canGenerateWithAi?: boolean;
  needsScreenRecording?: boolean;
  needsProductAssets?: boolean;
};

const ALL_FEED: PublicationTypeId[] = [
  "single_image",
  "image_carousel",
  "short_video",
];
const GRAPHIC: PublicationTypeId[] = [
  "single_image",
  "image_carousel",
  "short_video",
  "story",
];
const VIDEO: PublicationTypeId[] = ["short_video"];

const FACELESS: CreativeFormatCapabilities = {
  requiresCamera: false,
  publicationTypes: ALL_FEED,
  canGenerateWithAi: true,
};

const CAPABILITIES: Record<string, CreativeFormatCapabilities> = {
  "x-razones": { ...FACELESS, publicationTypes: GRAPHIC },
  "historia-instagram": {
    requiresCamera: false,
    publicationTypes: ["story", "single_image"],
    canGenerateWithAi: true,
  },
  "nosotros-vs-ellos": { ...FACELESS, publicationTypes: GRAPHIC },
  "diagrama-venn": { ...FACELESS, publicationTypes: GRAPHIC },
  "no-compres-esto": { ...FACELESS, publicationTypes: GRAPHIC },
  "nota-iphone": { ...FACELESS, publicationTypes: GRAPHIC },
  "captura-chat": { ...FACELESS, publicationTypes: GRAPHIC },
  pizarra: { ...FACELESS, publicationTypes: GRAPHIC },
  "cupos-limitados": { ...FACELESS, publicationTypes: GRAPHIC },
  "pedimos-disculpas": { ...FACELESS, publicationTypes: GRAPHIC },
  "testimonio-cliente": {
    requiresCamera: false,
    publicationTypes: GRAPHIC,
    canGenerateWithAi: false,
  },
  "lo-nuevo-vs-lo-viejo": { ...FACELESS, publicationTypes: GRAPHIC },
  "ultima-hora": { ...FACELESS, publicationTypes: GRAPHIC },
  transformacion: { ...FACELESS, publicationTypes: GRAPHIC },
  "estilo-reddit": { ...FACELESS, publicationTypes: GRAPHIC },
  "en-caso-de-emergencia": { ...FACELESS, publicationTypes: GRAPHIC },
  "busqueda-google": { ...FACELESS, publicationTypes: GRAPHIC },
  "problema-vs-solucion": {
    ...FACELESS,
    publicationTypes: GRAPHIC,
    needsProductAssets: true,
  },
  "efecto-secundario": { ...FACELESS, publicationTypes: GRAPHIC },
  "oferta-combo": { ...FACELESS, publicationTypes: GRAPHIC },
  "titular-con-dato": { ...FACELESS, publicationTypes: GRAPHIC },
  garabato: { ...FACELESS, publicationTypes: GRAPHIC },
  "captura-email": { ...FACELESS, publicationTypes: GRAPHIC },
  "no-seas-ese-que": { ...FACELESS, publicationTypes: GRAPHIC },
  resenas: { ...FACELESS, publicationTypes: GRAPHIC },
  "texto-sobre-la-piel": {
    requiresCamera: true,
    publicationTypes: VIDEO,
  },
  "podcast-ia": {
    requiresCamera: false,
    publicationTypes: VIDEO,
    canGenerateWithAi: true,
  },
  "tier-list": { ...FACELESS, publicationTypes: GRAPHIC },
  "cero-estrellas": { ...FACELESS, publicationTypes: GRAPHIC },
  "green-screen": {
    requiresCamera: true,
    publicationTypes: VIDEO,
  },
  "x-senales": { ...FACELESS, publicationTypes: GRAPHIC },
  "mito-vs-realidad": { ...FACELESS, publicationTypes: GRAPHIC },
  "problemas-tachados": { ...FACELESS, publicationTypes: GRAPHIC },
  "lo-que-podes-evitar": { ...FACELESS, publicationTypes: GRAPHIC },
  advertencia: { ...FACELESS, publicationTypes: GRAPHIC },
  "grabacion-pantalla": {
    requiresCamera: false,
    publicationTypes: VIDEO,
    canGenerateWithAi: false,
    needsScreenRecording: true,
    needsProductAssets: true,
  },
  "motion-graphics": {
    requiresCamera: false,
    publicationTypes: [...VIDEO, "story"],
    canGenerateWithAi: true,
  },
  "video-ia": {
    requiresCamera: false,
    publicationTypes: VIDEO,
    canGenerateWithAi: true,
  },
  "texto-cinetico": {
    requiresCamera: false,
    publicationTypes: [...VIDEO, "story"],
    canGenerateWithAi: true,
  },
  "talking-head": {
    requiresCamera: true,
    publicationTypes: VIDEO,
  },
  entrevista: {
    requiresCamera: true,
    publicationTypes: VIDEO,
  },
  vlog: {
    requiresCamera: true,
    publicationTypes: VIDEO,
  },
};

export function getFormatCapabilities(
  formatId: string,
): CreativeFormatCapabilities {
  return (
    CAPABILITIES[formatId] ?? {
      requiresCamera: ON_CAMERA_FORMAT_IDS.has(formatId),
      publicationTypes: ALL_FEED,
      canGenerateWithAi: true,
    }
  );
}

export function formatRequiresCamera(formatId: string): boolean {
  return getFormatCapabilities(formatId).requiresCamera;
}

export function isFormatCompatibleWithPublicationType(
  formatId: string,
  publicationTypeId: PublicationTypeId,
): boolean {
  return getFormatCapabilities(formatId).publicationTypes.includes(
    publicationTypeId,
  );
}

export function isFormatCompatibleWithProduction(
  formatId: string,
  cameraMode?: string,
): boolean {
  if (!isFacelessProduction(cameraMode)) return true;
  return !formatRequiresCamera(formatId);
}
