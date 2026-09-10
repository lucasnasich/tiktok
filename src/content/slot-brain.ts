import type { ContentRoleId } from "@/content/content-roles";
import type { PlanningAccountType } from "@/content/planning-accounts";
import { getContentRoleLabel } from "@/content/content-roles";
import { getFormatLabel } from "@/content/formats";
import { getPlanningPillarLabel } from "@/content/planning-pillars";
import type { PlanningSlot } from "@/content/planned-slots";

const ALWAYS_BRAIN_REFS = ["contenido-comunicacion.md"];

const PILLAR_BRAIN_REFS: Record<string, string[]> = {
  "ventas-atencion": ["dolores-jtbd.md", "funcionalidades.md"],
  "inventario-stock": ["dolores-jtbd.md", "funcionalidades.md"],
  "pedidos-logistica": ["dolores-jtbd.md", "funcionalidades.md"],
  "pagos-cobros": ["dolores-jtbd.md", "funcionalidades.md"],
  "catalogo-ecommerce": ["producto.md", "posicionamiento.md"],
  "operacion-gestion": ["dolores-jtbd.md", "filosofia.md"],
  "marketing-crecimiento": ["growth-distribucion.md", "posicionamiento.md"],
  "automatizacion-ia": ["inteligencia-artificial.md", "filosofia.md"],
  "equipo-sucursales": ["dolores-jtbd.md", "funcionalidades.md"],
  "clientes-fidelizacion": ["usuarios-clientes.md", "dolores-jtbd.md"],
  "numeros-negocio": ["posicionamiento.md", "pricing-modelo-negocio.md"],
  "producto-mercantis": ["producto.md", "funcionalidades.md", "claims.md"],
  emprendimiento: ["posicionamiento.md", "fundadores.md"],
  "mercado-tendencias": ["contenido-comunicacion.md", "posicionamiento.md"],
  estudiantes: ["contenido-comunicacion.md", "posicionamiento.md"],
};

const ROLE_BRAIN_REFS: Partial<Record<ContentRoleId, string[]>> = {
  marca: ["marca.md", "filosofia.md", "posicionamiento.md"],
  conversion: ["claims.md", "pricing-modelo-negocio.md"],
  prueba: ["clientes-casos.md", "producto.md"],
  comunidad: ["usuarios-clientes.md", "contenido-comunicacion.md"],
};

function unique(files: string[]): string[] {
  return [...new Set(files.filter(Boolean))];
}

export function brainRefsForSlot(slot: PlanningSlot): string[] {
  return unique([
    ...ALWAYS_BRAIN_REFS,
    ...(PILLAR_BRAIN_REFS[slot.pillarId] ?? [
      "dolores-jtbd.md",
      "posicionamiento.md",
    ]),
    ...(ROLE_BRAIN_REFS[slot.roleId] ?? []),
  ]);
}

export function editorialConstraintsForSlot(
  slot: PlanningSlot,
  accountType?: PlanningAccountType,
): string[] {
  const role = getContentRoleLabel(slot.roleId);
  const format = getFormatLabel(slot.formatId);
  const pillar = getPlanningPillarLabel(slot.pillarId);
  const constraints = [
    `Prioridad ${role}: no cambiar el rol del slot.`,
    `Hablar de ${pillar} sin cambiar de pilar.`,
    `Respetar el formato ${format}.`,
    "No inventar features, pricing, clientes, métricas, historia ni roadmap.",
    "Consultar el Mercantis Brain. Si algo no está: marcarlo como desconocido.",
  ];

  if (slot.roleId === "alcance") {
    constraints.push("No convertirlo en venta directa.");
  }
  if (slot.roleId === "valor") {
    constraints.push("Enseñar; el producto no es el protagonista.");
  }
  if (slot.roleId === "prueba") {
    constraints.push("Mostrar evidencia real. No inventar resultados.");
  }
  if (slot.roleId === "conversion") {
    constraints.push("CTA concreto, sin claims no respaldados.");
  }
  if (slot.roleId === "marca") {
    constraints.push("Instalar postura, no pitch de features.");
  }
  if (slot.roleId === "comunidad") {
    constraints.push("Invitar a opinar; no cerrar en venta.");
  }
  if (accountType === "official") {
    constraints.push("Cuenta oficial: seria, pulida, no memes.");
  }

  return constraints;
}
