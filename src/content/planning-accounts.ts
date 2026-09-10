import type { ContentRoleId } from "@/content/content-roles";

export type PlanningPlatform = "tiktok" | "instagram";

export type PlanningAccountType = "official" | "satellite";

export type DailyRoleTarget = {
  roleId: ContentRoleId;
  count: number;
};

export type PlanningAccount = {
  id: string;
  label: string;
  type: PlanningAccountType;
  platforms: PlanningPlatform[];
  postsPerDay: number;
  dailyTargets: DailyRoleTarget[];
  /** Roles que comparten un slot diario y alternan (ej. prueba / conversión). */
  alternateRoles?: [ContentRoleId, ContentRoleId];
  /** En satélites: conversión directa solo excepcionalmente. */
  conversionExceptional?: boolean;
};

export const PLANNING_ALL_ACCOUNTS_ID = "all";

/** Targets editables — source of truth en src/content/. */
export const planningAccounts: PlanningAccount[] = [
  {
    id: "mercantis-oficial",
    label: "Mercantis oficial",
    type: "official",
    platforms: ["tiktok", "instagram"],
    postsPerDay: 3,
    dailyTargets: [
      { roleId: "alcance", count: 1 },
      { roleId: "valor", count: 1 },
      { roleId: "prueba", count: 1 },
    ],
    alternateRoles: ["prueba", "conversion"],
  },
  {
    id: "mercantis-latam",
    label: "Mercantis Latam",
    type: "satellite",
    platforms: ["tiktok", "instagram"],
    postsPerDay: 3,
    dailyTargets: [
      { roleId: "alcance", count: 2 },
      { roleId: "valor", count: 1 },
    ],
    conversionExceptional: true,
  },
  {
    id: "mercantis-study",
    label: "Mercantis Study",
    type: "satellite",
    platforms: ["tiktok"],
    postsPerDay: 3,
    dailyTargets: [
      { roleId: "alcance", count: 2 },
      { roleId: "valor", count: 1 },
    ],
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
