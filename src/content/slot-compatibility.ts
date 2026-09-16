import {
  isFacelessProduction,
  type CameraPresenceMode,
} from "./camera-presence.ts";
import { formatRequiresCamera } from "./format-capabilities.ts";
import { normalizeRoleId, type ContentRoleId } from "./content-roles.ts";

/**
 * Compatibilidad entre rol, pilar, formato y producción.
 *
 * Solo se bloquea lo que los expertos tratan como mismatch de etapa
 * (el equivalente a pedir agua seca): el formato o el pilar no pueden
 * cumplir el trabajo del rol. Lo suboptimal se deja pasar.
 *
 * Fuentes:
 * - Eugene Schwartz, *Breakthrough Advertising* (5 stages of awareness):
 *   unaware = interrupt/educar, sin producto; testimonials y case studies
 *   = product-aware; offers/scarcity = most-aware.
 *   Aplicación moderna: https://adquisition.ai/blog/strategy/awareness-levels-ad-creative
 *   https://hawky.ai/blog/customer-awareness-stages
 * - Funnel TOFU / MOFU / BOFU: awareness = explainers y video corto;
 *   case studies en consideración; testimonials, demos y ofertas al cerrar.
 *   https://funnel.io/blog/tofu-mofu-bofu
 *   https://www.bulldozer-collective.com/articles/tofu-mofu-bofu
 *   https://hive19.co.uk/blog/marketing/tofu-mofu-bofu-marketing-conversion-funnel/
 * - TikTok cold vs warm: hook de problema o demo para audiencia fría;
 *   testimonial flash para retargeting, no como substituto de alcance.
 *   https://www.mbadv.agency/tiktok-ads/creative-best-practices
 *   https://joinflare.app/blog/tiktok-ugc-hook-examples
 * - Escasez en discovery se lee como spam; social proof de cliente nombra
 *   producto y pide familiaridad de marca.
 *   https://www.digitalapplied.com/blog/social-proof-trust-signals-2026-conversion-placement-framework
 *   https://www.growthsuite.net/blog/perfect-timing-when-to-introduce-urgency-in-customer-journey
 * - Pilares = temas (Sprout). El mismo tema puede vivir en varias etapas,
 *   pero el pilar `producto-mercantis` de este studio es features/demos.
 *   https://sproutsocial.com/insights/social-media-content-pillars/
 *   https://www.tenspeed.io/blog/content-marketing-framework
 *
 * Mapeo de roles del studio:
 *   educacion        → enseñar (TOFU–MOFU); el alcance es transversal
 *   producto         → demo / product-aware
 *   evidencia        → prueba social / MOFU–BOFU
 *   build_in_public  → proceso interno; no es oferta ni testimonio de cliente
 *   marca            → posicionamiento (no prueba ni oferta)
 *   comunidad        → conversación (el CTA no define el rol)
 */

export type SlotCompatibilityInput = {
  roleId: ContentRoleId;
  pillarId: string;
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

export const ROLE_PILLAR_FALLBACKS: Record<ContentRoleId, string> = {
  educacion: "operacion-gestion",
  producto: "producto-mercantis",
  evidencia: "clientes-fidelizacion",
  build_in_public: "emprendimiento",
  marca: "emprendimiento",
  comunidad: "emprendimiento",
};

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

export function isPillarCompatibleWithRole(
  roleId: ContentRoleId | string,
  pillarId: string,
): boolean {
  return !blockedSet(BLOCKED_PILLARS_BY_ROLE[normalizeRoleId(roleId)]).has(
    pillarId,
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
  return (
    isFormatCompatibleWithRole(input.roleId, input.formatId) &&
    isPillarCompatibleWithRole(input.roleId, input.pillarId) &&
    isFormatCompatibleWithPillar(input.formatId, input.pillarId) &&
    isFormatCompatibleWithCamera(input.formatId, input.cameraPresence)
  );
}

export function compatiblePillarTargets(
  targets: Record<string, number>,
  roleId: ContentRoleId | string,
): Record<string, number> {
  return omitBlockedTargets(
    targets,
    blockedSet(BLOCKED_PILLARS_BY_ROLE[normalizeRoleId(roleId)]),
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
