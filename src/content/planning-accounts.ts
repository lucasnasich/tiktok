import type { ContentRoleId } from "@/content/content-roles";
import {
  DEFAULT_ACTIVE_DAYS,
  DEFAULT_DISTRIBUTION_TYPE,
  DEFAULT_REPETITION_LIMITS,
  DEFAULT_TIME_SLOTS,
} from "@/content/planning-defaults";
import type { DistributionType } from "@/content/planned-slots";

export type PlanningPlatform = "tiktok" | "instagram";

export type PlanningAccountType = "official" | "satellite";

export type RepetitionLimits = {
  maxConsecutiveSamePillar: number;
  maxSameFormatInPeriod: number;
  maxSameRoleInRow: number;
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
  pillarTargets: Record<string, number>;
  formatTargets: Record<string, number>;
  repetitionLimits: RepetitionLimits;
  /** Conservado en perfiles persistidos. El generador orgánico siempre emite `organic`. */
  defaultDistributionType: DistributionType;
  /**
   * Legacy: roles que alternaban un cupo diario.
   * El mix semanal de `roleTargets` es la source of truth.
   */
  alternateRoles?: [ContentRoleId, ContentRoleId];
  /** Conservado en perfiles. Conversión con target 0 no se programa. */
  conversionExceptional?: boolean;
};

export const PLANNING_ALL_ACCOUNTS_ID = "all";

/** Cuentas del estudio — estructura técnica. El mix editorial vive en perfiles del usuario. */
export const planningAccounts: PlanningAccount[] = [
  {
    id: "mercantis-oficial",
    label: "Mercantis oficial",
    type: "official",
    platforms: ["tiktok", "instagram"],
    postsPerDay: 3,
    activeDays: [...DEFAULT_ACTIVE_DAYS],
    timeSlots: [...DEFAULT_TIME_SLOTS],
    roleTargets: {},
    pillarTargets: {},
    formatTargets: {},
    repetitionLimits: { ...DEFAULT_REPETITION_LIMITS },
    defaultDistributionType: DEFAULT_DISTRIBUTION_TYPE,
  },
  {
    id: "mercantis-latam",
    label: "Mercantis Latam",
    type: "satellite",
    platforms: ["tiktok", "instagram"],
    postsPerDay: 3,
    activeDays: [...DEFAULT_ACTIVE_DAYS],
    timeSlots: [...DEFAULT_TIME_SLOTS],
    roleTargets: {},
    pillarTargets: {},
    formatTargets: {},
    repetitionLimits: { ...DEFAULT_REPETITION_LIMITS },
    defaultDistributionType: DEFAULT_DISTRIBUTION_TYPE,
    conversionExceptional: true,
  },
  {
    id: "mercantis-study",
    label: "Mercantis Study",
    type: "satellite",
    platforms: ["tiktok"],
    postsPerDay: 3,
    activeDays: [...DEFAULT_ACTIVE_DAYS],
    timeSlots: [...DEFAULT_TIME_SLOTS],
    roleTargets: {},
    pillarTargets: {},
    formatTargets: {},
    repetitionLimits: { ...DEFAULT_REPETITION_LIMITS },
    defaultDistributionType: DEFAULT_DISTRIBUTION_TYPE,
    conversionExceptional: true,
  },
];

const accountById = new Map(
  planningAccounts.map((account) => [account.id, account]),
);

export function getPlanningAccountLabel(id: string): string {
  if (id === PLANNING_ALL_ACCOUNTS_ID) return "Todas las cuentas";
  return accountById.get(id)?.label ?? id;
}

export function getPlanningAccount(id: string): PlanningAccount | undefined {
  return accountById.get(id);
}
