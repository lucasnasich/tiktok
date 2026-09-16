import type { ContentRoleId } from "@/content/content-roles";
import type { CameraMode } from "@/content/camera-presence";
import type { ProductionOptionId } from "@/content/production-options";
import type { RoleTopicPreferences } from "@/content/role-topics";
import {
  getSlotAccountIds,
  type DistributionType,
  type PlanningSlot,
} from "@/content/planned-slots";
import {
  studioAccountSocialLabel,
  type PlanningStudioAccount,
} from "@/content/planning-studio-accounts";
import { studioAccountToPlanningBase } from "@/content/planning-studio-accounts";

export type PlanningPlatform = "tiktok" | "instagram";

export type PlanningAccountType = "official" | "satellite";

export type RepetitionLimits = {
  maxConsecutiveSamePillar: number;
  maxConsecutiveSameTopic?: number;
  /** Legacy: ya no se usa para programar formatos creativos. */
  maxSameFormatInPeriod: number;
  maxSameRoleInRow: number;
  maxSameProductionTypeInPeriod?: number;
  /** Legacy alias. */
  maxSamePublicationTypeInPeriod?: number;
};

export type PlanningAccount = {
  id: string;
  label: string;
  type: PlanningAccountType;
  /** Una pieza puede publicarse en varias plataformas a la vez. */
  platforms: PlanningPlatform[];
  postsPerDay: number;
  /** 1 = lunes … 7 = domingo. */
  activeDays: number[];
  timeSlots: string[];
  /** Porcentaje objetivo por rol (suma ~100). */
  roleTargets: Partial<Record<ContentRoleId, number>>;
  /** Preferencias de tema por rol. Source of truth editorial junto a roleTargets. */
  roleTopicPreferences: RoleTopicPreferences;
  /** Legacy: mix global de pilares. Ya no gobierna el calendario. */
  pillarTargets: Record<string, number>;
  /** Opciones de producción habilitadas. Lo no listado no se genera. */
  productionEnabledIds: ProductionOptionId[];
  /** Distribución entre las opciones habilitadas (suma ~100). */
  productionTypeTargets: Partial<Record<ProductionOptionId, number>>;
  cameraMode: CameraMode;
  /** Legacy: se migra a `productionTypeTargets`. */
  publicationTypeTargets?: Partial<Record<string, number>>;
  /** Legacy: mix rígido de formatos creativos. Ya no gobierna el calendario. */
  formatTargets: Record<string, number>;
  repetitionLimits: RepetitionLimits;
  /** Conservado en perfiles persistidos. El generador orgánico siempre emite `organic`. */
  defaultDistributionType: DistributionType;
  /**
   * Legacy: roles que alternaban un cupo diario.
   * El mix semanal de `roleTargets` es la source of truth.
   */
  alternateRoles?: [ContentRoleId, ContentRoleId];
  /** Legacy: se conserva si está persistido. Ya no hay rol de conversión. */
  conversionExceptional?: boolean;
};

export const PLANNING_ALL_ACCOUNTS_ID = "all";

/** Plantilla base para cuentas nuevas (sin mix editorial). */
export function createPlanningAccountTemplate(
  type: PlanningAccountType,
): PlanningAccount {
  const studio = studioAccountToPlanningBase({
    id: "template",
    displayName: "Plantilla",
    type,
    platform: "instagram",
    handle: "",
  });
  return studio;
}

export function getPlanningAccountLabel(
  id: string,
  studioAccounts: PlanningStudioAccount[] = [],
): string {
  if (id === PLANNING_ALL_ACCOUNTS_ID) return "Todas las cuentas";
  const account = studioAccounts.find((item) => item.id === id);
  return account?.displayName ?? id;
}

export function getPlanningAccount(
  id: string,
  studioAccounts: PlanningStudioAccount[] = [],
): PlanningStudioAccount | undefined {
  return studioAccounts.find((item) => item.id === id);
}

export function getSlotAccountLabel(
  slot: PlanningSlot,
  studioAccounts: PlanningStudioAccount[] = [],
): string {
  const ids = getSlotAccountIds(slot);
  const labels = [
    ...new Set(
      ids.map((id) => {
        const account = studioAccounts.find((item) => item.id === id);
        if (account) return studioAccountSocialLabel(account);
        return getPlanningAccountLabel(id, studioAccounts);
      }),
    ),
  ];
  return labels.join(" · ");
}
