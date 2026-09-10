import type { ContentRoleId } from "@/content/content-roles";
import type { PlanningPlatform } from "@/content/planning-accounts";

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
  accountId: string;
  platforms: PlanningPlatform[];
  roleId: ContentRoleId;
  pillarId: string;
  /** ID de `formats.ts` */
  formatId: string;
  /** ID de `angles.ts` — se asigna al pasar a Idea */
  angleId?: string;
  status: PlanningSlotStatus;
  /** Post asociado cuando ya existe en producción/publicación */
  postId?: string;
  distributionType?: DistributionType;
  notes?: string;
};

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

/** Slots del calendario editorial — editar acá o vía agente. */
export const plannedSlots: PlanningSlot[] = [
  // Lunes 2026-09-08 — Mercantis oficial
  {
    id: "slot-2026-09-08-oficial-1",
    date: "2026-09-08",
    accountId: "mercantis-oficial",
    platforms: ["tiktok", "instagram"],
    roleId: "alcance",
    pillarId: "whatsapp",
    formatId: "x-razones",
    angleId: "dolor",
    status: "publicado",
    postId: "post-001",
    distributionType: "organic",
  },
  {
    id: "slot-2026-09-08-oficial-2",
    date: "2026-09-08",
    accountId: "mercantis-oficial",
    platforms: ["tiktok", "instagram"],
    roleId: "valor",
    pillarId: "operacion",
    formatId: "nota-iphone",
    angleId: "educativo",
    status: "publicado",
    postId: "post-002",
  },
  {
    id: "slot-2026-09-08-oficial-3",
    date: "2026-09-08",
    accountId: "mercantis-oficial",
    platforms: ["tiktok"],
    roleId: "prueba",
    pillarId: "producto",
    formatId: "testimonio-cliente",
    angleId: "storytelling",
    status: "publicado",
    postId: "post-003",
  },
  // Martes
  {
    id: "slot-2026-09-09-oficial-1",
    date: "2026-09-09",
    accountId: "mercantis-oficial",
    platforms: ["tiktok", "instagram"],
    roleId: "alcance",
    pillarId: "emprendimiento",
    formatId: "mito-vs-realidad",
    angleId: "polemico",
    status: "listo",
    postId: "post-004",
  },
  {
    id: "slot-2026-09-09-oficial-2",
    date: "2026-09-09",
    accountId: "mercantis-oficial",
    platforms: ["instagram"],
    roleId: "valor",
    pillarId: "inventario",
    formatId: "pizarra",
    angleId: "educativo",
    status: "en-produccion",
  },
  {
    id: "slot-2026-09-09-oficial-3",
    date: "2026-09-09",
    accountId: "mercantis-oficial",
    platforms: ["tiktok"],
    roleId: "conversion",
    pillarId: "producto",
    formatId: "advertencia",
    angleId: "oportunidad",
    status: "pendiente",
  },
  // Miércoles
  {
    id: "slot-2026-09-10-oficial-1",
    date: "2026-09-10",
    accountId: "mercantis-oficial",
    platforms: ["tiktok"],
    roleId: "alcance",
    pillarId: "whatsapp",
    formatId: "captura-chat",
    angleId: "dolor",
    status: "en-produccion",
  },
  // Jueves 2026-09-10 — hoy: faltan 2 posts oficial
  {
    id: "slot-2026-09-10-latam-1",
    date: "2026-09-10",
    accountId: "mercantis-latam",
    platforms: ["tiktok", "instagram"],
    roleId: "alcance",
    pillarId: "tendencias",
    formatId: "tier-list",
    angleId: "comparacion",
    status: "pendiente",
  },
  {
    id: "slot-2026-09-10-latam-2",
    date: "2026-09-10",
    accountId: "mercantis-latam",
    platforms: ["tiktok"],
    roleId: "alcance",
    pillarId: "emprendimiento",
    formatId: "green-screen",
    status: "pendiente",
  },
  // Viernes
  {
    id: "slot-2026-09-11-oficial-1",
    date: "2026-09-11",
    accountId: "mercantis-oficial",
    platforms: ["tiktok", "instagram"],
    roleId: "alcance",
    pillarId: "pagos",
    formatId: "busqueda-google",
    status: "pendiente",
  },
  {
    id: "slot-2026-09-11-oficial-2",
    date: "2026-09-11",
    accountId: "mercantis-oficial",
    platforms: ["tiktok"],
    roleId: "valor",
    pillarId: "whatsapp",
    formatId: "x-señales",
    status: "pendiente",
  },
  {
    id: "slot-2026-09-11-oficial-3",
    date: "2026-09-11",
    accountId: "mercantis-oficial",
    platforms: ["instagram"],
    roleId: "prueba",
    pillarId: "producto",
    formatId: "transformacion",
    status: "pendiente",
  },
  // Satélite study — semana
  {
    id: "slot-2026-09-08-study-1",
    date: "2026-09-08",
    accountId: "mercantis-study",
    platforms: ["tiktok"],
    roleId: "alcance",
    pillarId: "estudiantes",
    formatId: "x-razones",
    angleId: "aspiracional",
    status: "publicado",
    postId: "post-study-01",
  },
  {
    id: "slot-2026-09-09-study-1",
    date: "2026-09-09",
    accountId: "mercantis-study",
    platforms: ["tiktok"],
    roleId: "alcance",
    pillarId: "estudiantes",
    formatId: "nota-iphone",
    status: "listo",
  },
  {
    id: "slot-2026-09-09-study-2",
    date: "2026-09-09",
    accountId: "mercantis-study",
    platforms: ["tiktok"],
    roleId: "valor",
    pillarId: "estudiantes",
    formatId: "pizarra",
    angleId: "educativo",
    status: "pendiente",
  },
  {
    id: "slot-2026-09-12-study-1",
    date: "2026-09-12",
    accountId: "mercantis-study",
    platforms: ["tiktok"],
    roleId: "alcance",
    pillarId: "estudiantes",
    formatId: "garabato",
    status: "pendiente",
  },
];

export function getSlotDistributionType(
  slot: PlanningSlot,
): DistributionType {
  return slot.distributionType ?? "organic";
}
