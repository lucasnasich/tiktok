import type { ContentRoleId } from "@/content/content-roles";
import type { PlanningAccountType } from "@/content/planning-accounts";
import {
  CONTENT_ROLE_CTA_GUIDELINE,
  getContentRoleLabel,
  normalizeRoleId,
} from "@/content/content-roles";
import { cameraPresenceConstraint } from "@/content/camera-presence";
import { getPublicationTypeLabel } from "@/content/publication-types";
import { resolveSlotPublicationType } from "@/content/planned-slots";
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
  producto: ["producto.md", "funcionalidades.md"],
  evidencia: ["clientes-casos.md"],
  build_in_public: ["historia.md", "fundadores.md", "filosofia.md"],
  educacion: ["dolores-jtbd.md", "contenido-comunicacion.md"],
  comunidad: ["usuarios-clientes.md", "contenido-comunicacion.md"],
};

const FORMAT_BRAIN_REFS: Record<string, string[]> = {
  "testimonio-cliente": ["clientes-casos.md"],
  resenas: ["clientes-casos.md"],
  "cero-estrellas": ["clientes-casos.md"],
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
    ...(ROLE_BRAIN_REFS[normalizeRoleId(slot.roleId)] ?? []),
    ...(FORMAT_BRAIN_REFS[slot.formatId ?? ""] ?? []),
  ]);
}

export function editorialConstraintsForSlot(
  slot: PlanningSlot,
  accountType?: PlanningAccountType,
): string[] {
  const role = getContentRoleLabel(slot.roleId);
  const pillar = getPlanningPillarLabel(slot.pillarId);
  const publicationType = getPublicationTypeLabel(
    resolveSlotPublicationType(slot),
  );
  const constraints = [
    `Prioridad ${role}: no cambiar el rol del slot.`,
    `Hablar de ${pillar} sin cambiar de pilar.`,
    `Respetar el tipo de publicación ${publicationType}: esa es la pieza a producir. El formato creativo se elige al desarrollar, no está rígido en el calendario.`,
    "No inventar features, pricing, clientes, métricas, historia ni roadmap.",
    "Consultar el Mercantis Brain. Si algo no está: marcarlo como desconocido.",
    CONTENT_ROLE_CTA_GUIDELINE,
  ];

  const roleId = normalizeRoleId(slot.roleId);

  if (roleId === "educacion") {
    constraints.push(
      "Enseñar algo aplicable y universal para LATAM. El producto no es el protagonista. Evitar impuestos, facturación local o medios de pago de un solo país.",
    );
  }
  if (roleId === "producto") {
    constraints.push("Mostrar Mercantis funcionando. No reemplazarlo por un consejo genérico ni por un testimonio.");
  }
  if (roleId === "evidencia") {
    constraints.push("Mostrar evidencia real de clientes o resultados. No inventar métricas ni casos. Puede ser cita, captura o historia contada por Mercantis.");
  }
  if (roleId === "build_in_public") {
    constraints.push("Mostrar el proceso real de construir Mercantis: avance, tensión, decisión o aprendizaje. No inventar hitos ni convertirlo en lifestyle vacío.");
  }
  if (roleId === "marca") {
    constraints.push("Instalar una postura clara, no un pitch de features ni un tono tibio.");
  }
  if (roleId === "comunidad") {
    constraints.push(
      "Invitar a opinar e identificarse. Si respondés una pregunta sobre la empresa, que abra conversación — no un pitch. Un CTA puede existir, pero no cerrar en aviso promocional.",
    );
  }
  if (
    slot.formatId === "testimonio-cliente" ||
    slot.formatId === "resenas" ||
    slot.formatId === "cero-estrellas"
  ) {
    constraints.push(
      "Prueba social: voz, quote, rating o evidencia de cliente. No un tour de la interfaz ni de la IA.",
    );
  }
  if (accountType === "official") {
    constraints.push("Cuenta oficial: seria, pulida, no memes.");
  }
  if (slot.cameraPresence) {
    constraints.push(cameraPresenceConstraint(slot.cameraPresence));
  }

  return constraints;
}
