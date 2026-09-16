import type { CameraPresenceMode } from "@/content/camera-presence";
import type { ContentRoleId } from "@/content/content-roles";
import {
  isPublicationTypeId,
  getPublicationTypeLabel,
  getPublicationTypeShortLabel,
  type PublicationTypeId,
} from "@/content/publication-types";
import { getFormatCapabilities } from "@/content/format-capabilities";
import {
  PLANNING_ALL_ACCOUNTS_ID,
  type PlanningPlatform,
} from "@/content/planning-accounts";
import type { PlanningStudioAccount } from "@/content/planning-studio-accounts";

const PLATFORM_ORDER: PlanningPlatform[] = ["tiktok", "instagram"];

export type DistributionType = "organic" | "paid" | "boosted";

export type PlanningSlotStatus =
  | "pendiente"
  | "en-produccion"
  | "listo"
  | "publicado";

export type PlanningSlot = {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm — horario editorial configurado */
  time: string;
  accountId: string;
  platforms: PlanningPlatform[];
  roleId: ContentRoleId;
  /** Área concreta dentro del rol. Source of truth editorial del slot. */
  topicId?: string;
  /** Legacy: pilar global. Los slots nuevos guardan el tema en `topicId`. */
  pillarId?: string;
  /**
   * Tipo de publicación nativo (imagen, carrusel, reel, story).
   * En slots nuevos es la capa que decide el calendario.
   */
  publicationTypeId?: PublicationTypeId;
  /**
   * Legacy: formato creativo rígido del calendario anterior.
   * Los slots nuevos no lo asignan; las propuestas lo recomiendan.
   */
  formatId?: string;
  /** ID de `angles.ts` — se asigna al pasar a Propuestas */
  angleId?: string;
  status: PlanningSlotStatus;
  /** Post asociado cuando ya existe en producción/publicación */
  postId?: string;
  distributionType?: DistributionType;
  /** true si lo creó el generador automático */
  generated?: boolean;
  /** Lote de calendario al que pertenece (snapshot al generar). */
  generationId?: string;
  /** Restricción de producción heredada de la generación. */
  cameraPresence?: CameraPresenceMode;
  /** Pieza unificada: aplica a varias cuentas sin duplicar el slot. */
  accountIds?: string[];
  notes?: string;
};

export function getSlotAccountIds(slot: PlanningSlot): string[] {
  return slot.accountIds?.length ? slot.accountIds : [slot.accountId];
}

export function slotMatchesAccount(
  slot: PlanningSlot,
  accountId: string,
): boolean {
  return getSlotAccountIds(slot).includes(accountId);
}

export function sortSlotPlatforms(
  platforms: PlanningPlatform[],
): PlanningPlatform[] {
  return [...new Set(platforms)].sort(
    (a, b) => PLATFORM_ORDER.indexOf(a) - PLATFORM_ORDER.indexOf(b),
  );
}

export function getSlotDisplayPlatforms(
  slot: PlanningSlot,
  accountFilter: string | undefined,
  studioAccounts: PlanningStudioAccount[] = [],
): PlanningPlatform[] {
  if (!accountFilter || accountFilter === PLANNING_ALL_ACCOUNTS_ID) {
    return sortSlotPlatforms(slot.platforms);
  }

  const account = studioAccounts.find((item) => item.id === accountFilter);
  if (account) return [account.platform];

  return sortSlotPlatforms(slot.platforms);
}

export const PLANNING_SLOT_STATUS_LABELS: Record<PlanningSlotStatus, string> = {
  pendiente: "Pendiente",
  "en-produccion": "En producción",
  listo: "Listo",
  publicado: "Publicado",
};

export const DISTRIBUTION_TYPE_LABELS: Record<DistributionType, string> = {
  organic: "Orgánico",
  paid: "Pago",
  boosted: "Boost",
};

/**
 * Slots manuales / en curso — el generador completa huecos sin tocarlos.
 * Una pieza = un slot con `platforms[]` (ej. TikTok + Instagram juntos).
 */
/** Slots manuales en curso. El generador completa huecos sin tocarlos. */
export const plannedSlots: PlanningSlot[] = [];

export function getSlotDistributionType(
  slot: PlanningSlot,
): DistributionType {
  return slot.distributionType ?? "organic";
}

export function resolveSlotPublicationType(
  slot: Pick<PlanningSlot, "publicationTypeId" | "formatId">,
): PublicationTypeId {
  if (slot.publicationTypeId && isPublicationTypeId(slot.publicationTypeId)) {
    return slot.publicationTypeId;
  }
  if (slot.formatId) {
    return getFormatCapabilities(slot.formatId).publicationTypes[0] ?? "short_video";
  }
  return "short_video";
}

export function getSlotPublicationTypeLabel(
  slot: Pick<PlanningSlot, "publicationTypeId" | "formatId">,
): string {
  return getPublicationTypeLabel(resolveSlotPublicationType(slot));
}

export function getSlotPublicationTypeShortLabel(
  slot: Pick<PlanningSlot, "publicationTypeId" | "formatId">,
): string {
  return getPublicationTypeShortLabel(resolveSlotPublicationType(slot));
}
