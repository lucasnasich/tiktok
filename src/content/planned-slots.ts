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
  /** HH:mm — horario editorial configurado */
  time: string;
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
  /** true si lo creó el generador automático */
  generated?: boolean;
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

/**
 * Slots manuales / en curso — el generador completa huecos sin tocarlos.
 * Una pieza = un slot con `platforms[]` (ej. TikTok + Instagram juntos).
 */
export const plannedSlots: PlanningSlot[] = [
  {
    id: "slot-2026-09-08-oficial-1",
    date: "2026-09-08",
    time: "11:00",
    accountId: "mercantis-oficial",
    platforms: ["tiktok", "instagram"],
    roleId: "alcance",
    pillarId: "ventas-atencion",
    formatId: "x-razones",
    angleId: "dolor",
    status: "publicado",
    postId: "post-001",
    distributionType: "organic",
  },
  {
    id: "slot-2026-09-08-oficial-2",
    date: "2026-09-08",
    time: "13:00",
    accountId: "mercantis-oficial",
    platforms: ["tiktok", "instagram"],
    roleId: "valor",
    pillarId: "operacion-gestion",
    formatId: "nota-iphone",
    angleId: "educativo",
    status: "publicado",
    postId: "post-002",
  },
  {
    id: "slot-2026-09-08-oficial-3",
    date: "2026-09-08",
    time: "16:00",
    accountId: "mercantis-oficial",
    platforms: ["tiktok", "instagram"],
    roleId: "prueba",
    pillarId: "producto-mercantis",
    formatId: "testimonio-cliente",
    angleId: "storytelling",
    status: "publicado",
    postId: "post-003",
  },
  {
    id: "slot-2026-09-09-oficial-1",
    date: "2026-09-09",
    time: "11:00",
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
    time: "13:00",
    accountId: "mercantis-oficial",
    platforms: ["tiktok", "instagram"],
    roleId: "valor",
    pillarId: "inventario-stock",
    formatId: "pizarra",
    angleId: "educativo",
    status: "en-produccion",
  },
  {
    id: "slot-2026-09-09-oficial-3",
    date: "2026-09-09",
    time: "16:00",
    accountId: "mercantis-oficial",
    platforms: ["tiktok", "instagram"],
    roleId: "conversion",
    pillarId: "producto-mercantis",
    formatId: "advertencia",
    angleId: "oportunidad",
    status: "pendiente",
  },
  {
    id: "slot-2026-09-10-oficial-1",
    date: "2026-09-10",
    time: "11:00",
    accountId: "mercantis-oficial",
    platforms: ["tiktok", "instagram"],
    roleId: "alcance",
    pillarId: "ventas-atencion",
    formatId: "captura-chat",
    angleId: "dolor",
    status: "en-produccion",
  },
  {
    id: "slot-2026-09-10-latam-1",
    date: "2026-09-10",
    time: "11:00",
    accountId: "mercantis-latam",
    platforms: ["tiktok", "instagram"],
    roleId: "alcance",
    pillarId: "mercado-tendencias",
    formatId: "tier-list",
    angleId: "comparacion",
    status: "pendiente",
  },
  {
    id: "slot-2026-09-10-latam-2",
    date: "2026-09-10",
    time: "13:00",
    accountId: "mercantis-latam",
    platforms: ["tiktok", "instagram"],
    roleId: "alcance",
    pillarId: "emprendimiento",
    formatId: "green-screen",
    status: "pendiente",
  },
  {
    id: "slot-2026-09-11-oficial-1",
    date: "2026-09-11",
    time: "11:00",
    accountId: "mercantis-oficial",
    platforms: ["tiktok", "instagram"],
    roleId: "alcance",
    pillarId: "pagos-cobros",
    formatId: "busqueda-google",
    status: "pendiente",
  },
  {
    id: "slot-2026-09-11-oficial-2",
    date: "2026-09-11",
    time: "13:00",
    accountId: "mercantis-oficial",
    platforms: ["tiktok", "instagram"],
    roleId: "valor",
    pillarId: "ventas-atencion",
    formatId: "x-senales",
    status: "pendiente",
  },
  {
    id: "slot-2026-09-11-oficial-3",
    date: "2026-09-11",
    time: "16:00",
    accountId: "mercantis-oficial",
    platforms: ["tiktok", "instagram"],
    roleId: "prueba",
    pillarId: "producto-mercantis",
    formatId: "transformacion",
    status: "pendiente",
  },
  {
    id: "slot-2026-09-08-study-1",
    date: "2026-09-08",
    time: "11:00",
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
    time: "11:00",
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
    time: "13:00",
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
    time: "11:00",
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
