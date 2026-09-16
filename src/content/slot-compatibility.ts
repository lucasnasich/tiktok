import {
  isFacelessProduction,
  type CameraPresenceMode,
} from "./camera-presence.ts";
import { formatRequiresCamera } from "./format-capabilities.ts";
import { normalizeRoleId, type ContentRoleId } from "./content-roles.ts";
import {
  isTopicCompatibleWithRole,
  mapLegacyPillarToTopic,
  ROLE_TOPIC_FALLBACKS,
} from "./role-topics.ts";

/**
 * Compatibilidad entre rol, tema, formato y producción.
 *
 * El tema tiene que pertenecer al rol. El formato no puede contradecir
 * el trabajo del rol ni la restricción de cámara.
 */

export type SlotCompatibilityInput = {
  roleId: ContentRoleId;
  topicId?: string;
  /** Legacy: pilar global. Se resuelve a topic si hace falta. */
  pillarId?: string;
  formatId: string;
  cameraPresence?: CameraPresenceMode;
};

const OFFER_FORMATS = ["oferta-combo", "cupos-limitados"] as const;
const SOCIAL_PROOF_FORMATS = [
  "testimonio-cliente",
  "resenas",
  "captura-email",
] as const;

/** Formatos que no pueden cumplir el trabajo del rol. */
export const BLOCKED_FORMATS_BY_ROLE: Record<
  ContentRoleId,
  readonly string[]
> = {
  educacion: [...OFFER_FORMATS],
  producto: [...OFFER_FORMATS, "efecto-secundario", "pedimos-disculpas"],
  evidencia: [
    ...OFFER_FORMATS,
    "efecto-secundario",
    "pedimos-disculpas",
    "texto-sobre-la-piel",
  ],
  build_in_public: [
    ...OFFER_FORMATS,
    "testimonio-cliente",
    "resenas",
    "captura-email",
  ],
  marca: [...SOCIAL_PROOF_FORMATS, ...OFFER_FORMATS],
  comunidad: [
    ...OFFER_FORMATS,
    "texto-sobre-la-piel",
    "captura-email",
  ],
};

/** Pilares cuyo contenido nativo contradice el trabajo del rol. */
export const BLOCKED_PILLARS_BY_ROLE: Partial<
  Record<ContentRoleId, readonly string[]>
> = {
  educacion: ["producto-mercantis"],
  evidencia: ["mercado-tendencias"],
  build_in_public: ["mercado-tendencias"],
};

/**
 * El vehículo del formato no puede cargar el tema.
 * Un testimonio no es una noticia de mercado; una oferta no es una tendencia.
 */
export const BLOCKED_PILLARS_BY_FORMAT: Record<string, readonly string[]> = {
  "testimonio-cliente": ["mercado-tendencias"],
  resenas: ["mercado-tendencias"],
  "cero-estrellas": ["mercado-tendencias"],
  "oferta-combo": ["mercado-tendencias"],
  "cupos-limitados": ["mercado-tendencias"],
  "captura-email": ["mercado-tendencias"],
};

/** Si el filtro deja la bolsa vacía, el generador cae a estos IDs. */
export const ROLE_FORMAT_FALLBACKS: Record<ContentRoleId, string> = {
  educacion: "pizarra",
  producto: "problema-vs-solucion",
  evidencia: "testimonio-cliente",
  build_in_public: "nota-iphone",
  marca: "mito-vs-realidad",
  comunidad: "tier-list",
};

export const ROLE_PILLAR_FALLBACKS: Record<ContentRoleId, string> =
  ROLE_TOPIC_FALLBACKS;

export function isPillarCompatibleWithRole(
  roleId: ContentRoleId | string,
  pillarId: string,
): boolean {
  if (isTopicCompatibleWithRole(roleId, pillarId)) return true;
  return Boolean(mapLegacyPillarToTopic(roleId, pillarId));
}

function blockedSet(ids: readonly string[] | undefined): Set<string> {
  return new Set(ids ?? []);
}

export function hasPositiveTargets(
  targets: Record<string, number>,
): boolean {
  return Object.values(targets).some((value) => (value ?? 0) > 0);
}

export function omitBlockedTargets(
  targets: Record<string, number>,
  blocked: ReadonlySet<string>,
): Record<string, number> {
  return Object.fromEntries(
    Object.entries(targets).filter(
      ([id, weight]) => (weight ?? 0) > 0 && !blocked.has(id),
    ),
  );
}

export function isFormatCompatibleWithRole(
  roleId: ContentRoleId | string,
  formatId: string,
): boolean {
  return !blockedSet(BLOCKED_FORMATS_BY_ROLE[normalizeRoleId(roleId)]).has(
    formatId,
  );
}

export function isFormatCompatibleWithPillar(
  formatId: string,
  pillarId: string,
): boolean {
  return !blockedSet(BLOCKED_PILLARS_BY_FORMAT[formatId]).has(pillarId);
}

export function isFormatCompatibleWithCamera(
  formatId: string,
  cameraPresence?: CameraPresenceMode | string,
): boolean {
  if (!isFacelessProduction(cameraPresence)) return true;
  return !formatRequiresCamera(formatId);
}

export function isSlotComboCompatible(
  input: SlotCompatibilityInput,
): boolean {
  const topicOrPillar = input.topicId ?? input.pillarId ?? "";
  return (
    isFormatCompatibleWithRole(input.roleId, input.formatId) &&
    isPillarCompatibleWithRole(input.roleId, topicOrPillar) &&
    isFormatCompatibleWithPillar(input.formatId, topicOrPillar) &&
    isFormatCompatibleWithCamera(input.formatId, input.cameraPresence)
  );
}

export function compatiblePillarTargets(
  targets: Record<string, number>,
  roleId: ContentRoleId | string,
): Record<string, number> {
  return Object.fromEntries(
    Object.entries(targets).filter(
      ([id, weight]) =>
        (weight ?? 0) > 0 && isPillarCompatibleWithRole(roleId, id),
    ),
  );
}

export function compatibleFormatTargets(
  targets: Record<string, number>,
  input: {
    roleId: ContentRoleId | string;
    pillarId?: string;
    cameraPresence?: CameraPresenceMode;
  },
): Record<string, number> {
  const roleId = normalizeRoleId(input.roleId);
  const blocked = new Set<string>(BLOCKED_FORMATS_BY_ROLE[roleId] ?? []);

  if (isFacelessProduction(input.cameraPresence)) {
    for (const format of Object.keys(targets)) {
      if (formatRequiresCamera(format)) blocked.add(format);
    }
  }

  if (input.pillarId) {
    for (const [formatId, pillars] of Object.entries(BLOCKED_PILLARS_BY_FORMAT)) {
      if (pillars.includes(input.pillarId)) blocked.add(formatId);
    }
  }

  return omitBlockedTargets(targets, blocked);
}
