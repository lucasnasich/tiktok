import type { PlanningAccountType } from "@/content/planning-accounts";

export type PlanningPillar = {
  id: string;
  label: string;
  summary: string;
};

/**
 * Mapeo de IDs legacy → taxonomía actual.
 * Mantiene compatibilidad con slots y perfiles guardados antes de la migración.
 */
export const PLANNING_PILLAR_MIGRATION: Record<string, string> = {
  whatsapp: "ventas-atencion",
  inventario: "inventario-stock",
  pagos: "pagos-cobros",
  producto: "producto-mercantis",
  operacion: "operacion-gestion",
  emprendimiento: "emprendimiento",
  tendencias: "mercado-tendencias",
};

/** Pilares editoriales globales de Mercantis — de qué hablamos. */
export const planningPillars: PlanningPillar[] = [
  {
    id: "ventas-atencion",
    label: "Ventas y atención",
    summary:
      "WhatsApp, consultas, seguimiento, cierre y atención comercial.",
  },
  {
    id: "inventario-stock",
    label: "Inventario y stock",
    summary:
      "Variantes, faltantes, reposición, control de stock y organización.",
  },
  {
    id: "pedidos-logistica",
    label: "Pedidos y logística",
    summary:
      "Toma de pedidos, preparación, envíos, retiro y coordinación.",
  },
  {
    id: "pagos-cobros",
    label: "Pagos y cobros",
    summary:
      "Medios de pago, links de pago, fricción al cobrar y cuentas pendientes.",
  },
  {
    id: "catalogo-ecommerce",
    label: "Catálogo y ecommerce",
    summary:
      "Productos, tienda online, catálogo, presentación y conversión.",
  },
  {
    id: "operacion-gestion",
    label: "Operación y gestión",
    summary:
      "Procesos, orden, errores operativos, productividad y sistema de trabajo.",
  },
  {
    id: "marketing-crecimiento",
    label: "Marketing y crecimiento",
    summary:
      "Conseguir clientes, promociones, campañas, adquisición y repetición de compra.",
  },
  {
    id: "automatizacion-ia",
    label: "Automatización e IA",
    summary:
      "Automatizar tareas, IA aplicada al negocio y reducción de trabajo manual.",
  },
  {
    id: "equipo-sucursales",
    label: "Equipo y sucursales",
    summary:
      "Empleados, roles, múltiples locales, control central y coordinación.",
  },
  {
    id: "clientes-fidelizacion",
    label: "Clientes y fidelización",
    summary:
      "Experiencia, recompra, postventa, servicio y relaciones con clientes.",
  },
  {
    id: "numeros-negocio",
    label: "Números del negocio",
    summary:
      "Margen, ticket promedio, rentabilidad, métricas y decisiones.",
  },
  {
    id: "producto-mercantis",
    label: "Producto Mercantis",
    summary:
      "Features, novedades, demos, casos de uso y forma de usar Mercantis.",
  },
  {
    id: "emprendimiento",
    label: "Emprendimiento",
    summary:
      "Mentalidad, primeros pasos, problemas del dueño, crecimiento y motivación.",
  },
  {
    id: "mercado-tendencias",
    label: "Mercado y tendencias",
    summary:
      "Noticias del sector, hábitos de compra, tendencias culturales y cambios del mercado.",
  },
];

/**
 * Pilares adicionales por cuenta — fuera de la taxonomía principal de Mercantis.
 * Ej.: `estudiantes` solo para Mercantis Study.
 */
export const accountPlanningPillars: PlanningPillar[] = [
  {
    id: "estudiantes",
    label: "Estudiantes / studytok",
    summary: "Studytok, side hustles, vender desde la facultad.",
  },
];

/** accountId → IDs de pilares extra (además de `planningPillars`). */
export const ACCOUNT_PLANNING_PILLAR_IDS: Record<string, string[]> = {
};

const pillarById = new Map(
  [...planningPillars, ...accountPlanningPillars].map((pillar) => [
    pillar.id,
    pillar,
  ]),
);

export function normalizePillarId(id: string): string {
  return PLANNING_PILLAR_MIGRATION[id] ?? id;
}

export function normalizePillarTargets(
  targets: Record<string, number>,
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const [key, value] of Object.entries(targets)) {
    const pillarId = normalizePillarId(key);
    result[pillarId] = (result[pillarId] ?? 0) + value;
  }
  return result;
}

export function getPlanningPillarLabel(id: string): string {
  return pillarById.get(normalizePillarId(id))?.label ?? id;
}

export function getPlanningPillarSummary(id: string): string {
  return pillarById.get(normalizePillarId(id))?.summary ?? "";
}

export function getPlanningPillarsForAccount(
  accountId: string,
  _accountType?: PlanningAccountType,
): PlanningPillar[] {
  const extraIds = ACCOUNT_PLANNING_PILLAR_IDS[accountId] ?? [];
  const extra = accountPlanningPillars.filter((pillar) =>
    extraIds.includes(pillar.id),
  );
  return [...planningPillars, ...extra];
}

export function getAllPlanningPillars(): PlanningPillar[] {
  return [...planningPillars, ...accountPlanningPillars];
}
