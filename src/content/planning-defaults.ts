import type { DistributionType } from "@/content/planned-slots";

/** Horarios disponibles por defecto para asignar piezas. */
export const DEFAULT_TIME_SLOTS = ["11:00", "13:00", "16:00", "21:00"] as const;

/** 1 = lunes … 7 = domingo (ISO). */
export const DEFAULT_ACTIVE_DAYS = [1, 2, 3, 4, 5, 6, 7] as const;

export const DEFAULT_REPETITION_LIMITS = {
  maxConsecutiveSamePillar: 2,
  maxSameFormatInPeriod: 3,
  maxSameRoleInRow: 2,
};

export const DEFAULT_DISTRIBUTION_TYPE: DistributionType = "organic";

/** Pilares — cuenta oficial (suma 100). IDs migrados; porcentajes sin cambio. */
export const DEFAULT_PILLAR_TARGETS_OFFICIAL: Record<string, number> = {
  "ventas-atencion": 20,
  "inventario-stock": 15,
  "pagos-cobros": 12,
  "producto-mercantis": 18,
  "operacion-gestion": 15,
  emprendimiento: 12,
  "mercado-tendencias": 8,
};

/** Pilares — satélite general. */
export const DEFAULT_PILLAR_TARGETS_SATELLITE: Record<string, number> = {
  emprendimiento: 30,
  "mercado-tendencias": 25,
  "operacion-gestion": 20,
  "producto-mercantis": 15,
  "ventas-atencion": 10,
};

/** Pilares — Mercantis Study (incluye pilar extra `estudiantes`). */
export const DEFAULT_PILLAR_TARGETS_STUDY: Record<string, number> = {
  estudiantes: 55,
  emprendimiento: 20,
  "mercado-tendencias": 15,
  "operacion-gestion": 10,
};

/** Formatos con peso inicial razonable (suma ~100). */
export const DEFAULT_FORMAT_TARGETS: Record<string, number> = {
  "x-razones": 12,
  "nota-iphone": 10,
  "captura-chat": 8,
  pizarra: 8,
  "mito-vs-realidad": 8,
  "green-screen": 8,
  "x-senales": 7,
  "tier-list": 7,
  "testimonio-cliente": 7,
  advertencia: 6,
  transformacion: 6,
  "busqueda-google": 5,
  garabato: 5,
  "problema-vs-solucion": 5,
  "nosotros-vs-ellos": 4,
};
