import { getAngleLabel } from "@/content/angles";
import { getContentRoleLabel } from "@/content/content-roles";
import { getFormatLabel } from "@/content/formats";
import { getInspirationByKey } from "@/content/inspiration-feed";
import {
  INSPIRATION_ORIGIN_LABELS,
  INSPIRATION_TYPE_LABELS,
  type InspirationOrigin,
} from "@/content/inspiration-taxonomy";
import { getPlanningAccount, getPlanningAccountLabel } from "@/content/planning-accounts";
import { getPlanningPillarLabel } from "@/content/planning-pillars";
import type { PlanningSlot } from "@/content/planned-slots";
import type { Proposal } from "@/content/proposals";
import { brainRefsForSlot, editorialConstraintsForSlot } from "@/content/slot-brain";
import type { SlotSpec, SlotSpecRecord } from "@/content/slot-specs";
import type { InspirationMetaOverride } from "@/lib/inspiration-overrides-store";
import { usageForInspiration } from "@/lib/inspiration-usage";

export function isSpecReadyForCursor(record: SlotSpecRecord | undefined) {
  if (!record) return false;
  if (record.status !== "ready-for-cursor") return false;
  if (record.directionKind === "inspiration") {
    return Boolean(record.inspirationRef);
  }
  return Boolean(record.signal?.trim());
}

export function assembleSlotSpec(
  slot: PlanningSlot,
  record: SlotSpecRecord | undefined,
  proposals: Proposal[],
  specs: SlotSpecRecord[],
  slots: PlanningSlot[],
  overrides: Record<string, InspirationMetaOverride> = {},
): SlotSpec {
  const account = getPlanningAccount(slot.accountId);
  const inspiration = record?.inspirationRef
    ? getInspirationByKey(record.inspirationRef, overrides)
    : undefined;
  const usage = record?.inspirationRef
    ? usageForInspiration(record.inspirationRef, proposals, specs, slots)
    : undefined;

  return {
    slotId: slot.id,
    accountId: slot.accountId,
    platforms: slot.platforms,
    date: slot.date,
    time: slot.time,
    roleId: slot.roleId,
    pillarId: slot.pillarId,
    formatId: slot.formatId,
    inspirationRef: record?.inspirationRef,
    inspirationType: inspiration?.materialType,
    origin: inspiration?.origin,
    signal: record?.signal ?? inspiration?.signal,
    creativeMechanism:
      record?.creativeMechanism ?? inspiration?.creativeMechanism,
    usageContext: usage
      ? {
          previousUses: usage.count,
          lastUsedAt: usage.lastUsedAt,
          usedAngles: usage.angleIds,
          relatedSlotIds: usage.slotIds,
          relatedProposalIds: usage.proposalIds,
          accountIds: usage.accountIds,
        }
      : undefined,
    brainRefs: brainRefsForSlot(slot),
    editorialConstraints: editorialConstraintsForSlot(slot, account?.type),
    notes: record?.notes,
    status: record?.status ?? "draft",
  };
}

const PLATFORM_LABELS: Record<string, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
};

export function formatSlotSpecMarkdown(spec: SlotSpec): string {
  const inspiration = spec.inspirationRef
    ? getInspirationByKey(spec.inspirationRef)
    : undefined;
  const usage = spec.usageContext;
  const usedAngles =
    usage?.usedAngles
      ?.map((id) => getAngleLabel(id))
      .filter(Boolean)
      .join(", ") ?? "";
  const originLabel = spec.origin
    ? (INSPIRATION_ORIGIN_LABELS[spec.origin as InspirationOrigin] ?? spec.origin)
    : "—";

  const historyLines = usage
    ? [
        `- ${usage.previousUses} uso${usage.previousUses === 1 ? "" : "s"}${
          usage.lastUsedAt ? ` · último ${usage.lastUsedAt.slice(0, 10)}` : ""
        }`,
        ...(usedAngles ? [`- Ángulos ya usados: ${usedAngles}`] : []),
      ]
    : ["- Sin usos previos"];

  const lines = [
    `# CONTENT SPEC`,
    "",
    "## Publicación",
    `- Cuenta: ${getPlanningAccountLabel(spec.accountId)}`,
    `- Fecha: ${spec.date} · ${spec.time}`,
    `- Plataformas: ${spec.platforms.map((p) => PLATFORM_LABELS[p] ?? p).join(" + ")}`,
    "",
    "## Misión",
    `- Rol: ${getContentRoleLabel(spec.roleId)}`,
    `- Pilar: ${getPlanningPillarLabel(spec.pillarId)}`,
    `- Formato: ${getFormatLabel(spec.formatId)}`,
    "",
    "## Inspiración",
    spec.inspirationRef
      ? `- Referencia: ${inspiration?.title ?? spec.inspirationRef}`
      : "- Referencia: dirección personalizada (sin pieza de biblioteca)",
    spec.inspirationType
      ? `- Tipo: ${INSPIRATION_TYPE_LABELS[spec.inspirationType]}`
      : "- Tipo: —",
    `- Origen: ${originLabel}`,
    `- Señal: ${spec.signal ?? "—"}`,
    `- Mecanismo: ${spec.creativeMechanism ?? "—"}`,
    "",
    "## Historial de la referencia",
    ...historyLines,
    "",
    "## Mercantis Brain (obligatorio)",
    ...spec.brainRefs.map((file) => `- ${file}`),
    "",
    "## Restricciones",
    ...spec.editorialConstraints.map((item) => `- ${item}`),
    ...(spec.notes?.length
      ? ["", "## Notas", ...spec.notes.map((note) => `- ${note}`)]
      : []),
    "",
    "## Estado",
    spec.status,
    "",
    "## Qué tiene que hacer Cursor",
    "Desarrollar propuestas completas para este slot: ángulo, concepto, hook, narrativa, copy por slide/escena, CTA, caption y dirección visual.",
    "No cambiar cuenta, plataformas, fecha, rol, pilar ni formato.",
    "No inventar claims. Consultar el Mercantis Brain citado arriba.",
    "Guardar las propuestas en `src/content/proposals.ts` como `candidate`.",
  ];

  return lines.join("\n");
}

export function cursorPromptForSpec(spec: SlotSpec) {
  return `Desarrollá propuestas para este slot.\n\n${formatSlotSpecMarkdown(spec)}`;
}
