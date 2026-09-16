import type { CameraPresenceMode } from "@/content/camera-presence";
import type { ContentRoleId } from "@/content/content-roles";
import {
  getPublicationTypeLabel,
  getPublicationTypeShortLabel,
} from "@/content/publication-types";
import {
  isProductionOptionId,
  migrateLegacyPublicationTypeId,
  type ProductionOptionId,
} from "@/content/production-options";
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
   * Opción exacta de producción (imagen única, Remotion, demo, etc.).
   * Source of truth en slots nuevos.
   */
  productionTypeId?: ProductionOptionId;
  /**
   * Legacy: tipo nativo abstracto (short_video, story).
   * Los slots nuevos guardan `productionTypeId`.
   */
  publicationTypeId?: ProductionOptionId | string;
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

export function resolveSlotProductionType(
  slot: Pick<PlanningSlot, "productionTypeId" | "publicationTypeId" | "formatId">,
): ProductionOptionId {
  if (slot.productionTypeId && isProductionOptionId(slot.productionTypeId)) {
    return slot.productionTypeId;
  }
  if (slot.publicationTypeId) {
    return migrateLegacyPublicationTypeId(slot.publicationTypeId);
  }
  return "single_image";
}

/** @deprecated Usar `resolveSlotProductionType`. */
export function resolveSlotPublicationType(
  slot: Pick<PlanningSlot, "productionTypeId" | "publicationTypeId" | "formatId">,
): ProductionOptionId {
  return resolveSlotProductionType(slot);
}

export function getSlotPublicationTypeLabel(
  slot: Pick<PlanningSlot, "productionTypeId" | "publicationTypeId" | "formatId">,
): string {
  return getPublicationTypeLabel(resolveSlotProductionType(slot));
}

export function getSlotPublicationTypeShortLabel(
  slot: Pick<PlanningSlot, "productionTypeId" | "publicationTypeId" | "formatId">,
): string {
  return getPublicationTypeShortLabel(resolveSlotProductionType(slot));
}
