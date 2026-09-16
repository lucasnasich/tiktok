import type { ContentRoleId } from "@/content/content-roles";
import type { PlanningAccountType } from "@/content/planning-accounts";
import {
  CONTENT_ROLE_CTA_GUIDELINE,
  getContentRoleLabel,
  normalizeRoleId,
} from "@/content/content-roles";
import { cameraPresenceConstraint } from "@/content/camera-presence";
import { getPublicationTypeLabel } from "@/content/publication-types";
import { resolveSlotProductionType } from "@/content/planned-slots";
import {
  brainRefsForTopic,
  getRoleTopic,
  getSlotTopicLabel,
  resolveSlotTopicId,
} from "@/content/role-topics";
import type { PlanningSlot } from "@/content/planned-slots";

const ROLE_BRAIN_REFS: Partial<Record<ContentRoleId, string[]>> = {
  marca: ["marca.md", "filosofia.md", "posicionamiento.md"],
  producto: ["producto.md", "funcionalidades.md", "claims.md"],
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
  const topicId = resolveSlotTopicId(slot);
  return unique([
    ...brainRefsForTopic(slot.roleId, topicId),
    ...(ROLE_BRAIN_REFS[normalizeRoleId(slot.roleId)] ?? []),
    ...(FORMAT_BRAIN_REFS[slot.formatId ?? ""] ?? []),
  ]);
}

export function editorialConstraintsForSlot(
  slot: PlanningSlot,
  accountType?: PlanningAccountType,
): string[] {
  const role = getContentRoleLabel(slot.roleId);
  const topicId = resolveSlotTopicId(slot);
  const topic = getRoleTopic(slot.roleId, topicId);
  const topicLabel = getSlotTopicLabel(slot);
  const publicationType = getPublicationTypeLabel(
    resolveSlotProductionType(slot),
  );
  const constraints = [
    `Prioridad ${role}: no cambiar el rol del slot.`,
    `Hablar de ${topicLabel} sin cambiar de tema. El tema orienta el área; el ángulo lo definís al desarrollar.`,
    `Respetar la pieza ${publicationType}: esa es la opción de producción asignada al slot. El formato creativo se elige al desarrollar, sin cambiar el tipo de pieza.`,
    "No inventar features, pricing, clientes, métricas, historia ni roadmap.",
    "Consultar el Mercantis Brain. Si algo no está: marcarlo como desconocido.",
    "Respetar estados live / in-development / planned / vision / internal. Nunca promover información internal, métricas no verificadas, deuda técnica ni roadmap no lanzado a copy público.",
    CONTENT_ROLE_CTA_GUIDELINE,
  ];

  if (topic?.constraint) {
    constraints.push(topic.constraint);
  }

  const roleId = normalizeRoleId(slot.roleId);

  if (roleId === "educacion") {
    constraints.push(
      "Enseñar algo aplicable y universal para LATAM. El producto no es el protagonista. Evitar impuestos, facturación local o medios de pago de un solo país.",
    );
  }
  if (roleId === "producto") {
    constraints.push(
      "Mostrar Mercantis funcionando. Sólo funcionalidades live. No reemplazarlo por un consejo genérico ni por un testimonio.",
    );
  }
  if (roleId === "evidencia") {
    constraints.push(
      "Mostrar evidencia real de clientes o resultados. No inventar métricas ni casos. Puede ser cita, captura o historia contada por Mercantis.",
    );
  }
  if (roleId === "build_in_public") {
    constraints.push(
      "Mostrar el proceso real de construir Mercantis: avance, tensión, decisión o aprendizaje. No inventar hitos ni convertirlo en lifestyle vacío.",
    );
  }
  if (roleId === "marca") {
    constraints.push(
      "Instalar una postura clara, no un pitch de features ni un tono tibio.",
    );
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
