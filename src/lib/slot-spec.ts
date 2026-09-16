import { getAngleLabel } from "@/content/angles";
import {
  cameraModeFromPresence,
  cameraPresenceShortLabel,
} from "@/content/camera-presence";
import type { CreativeProposal } from "@/content/creative-proposals";
import { getContentRoleLabel } from "@/content/content-roles";
import { getFormatLabel } from "@/content/formats";
import type { InspirationUseRole } from "@/content/inspiration-analysis";
import { getInspirationByKey, type InspirationFeedItem } from "@/content/inspiration-feed";
import {
  INSPIRATION_ORIGIN_LABELS,
  INSPIRATION_TYPE_LABELS,
  type InspirationOrigin,
} from "@/content/inspiration-taxonomy";
import { getPlanningAccount, getPlanningAccountLabel } from "@/content/planning-accounts";
import { getSlotTopicLabel, resolveSlotTopicId } from "@/content/role-topics";
import {
  resolveSlotProductionType,
  type PlanningSlot,
} from "@/content/planned-slots";
import { getPublicationTypeLabel } from "@/content/publication-types";
import type { Proposal } from "@/content/proposals";
import { brainRefsForSlot, editorialConstraintsForSlot } from "@/content/slot-brain";
import type {
  SlotDescriptionPayload,
  SlotSpec,
  SlotSpecInspirationSlice,
  SlotSpecRecord,
} from "@/content/slot-specs";
import {
  associateInspirationRef,
  detachInspirationRef,
  selectedCreativeProposal,
} from "@/lib/creative-proposals";
import type { InspirationMetaOverride } from "@/lib/inspiration-overrides-store";
import { usageForInspiration } from "@/lib/inspiration-usage";
import { recommendCreativeFormats } from "@/lib/creative-format-recommendations";

export function selectedInspirationKeys(record: SlotSpecRecord | undefined) {
  if (!record) return [];
  return [
    ...new Set(
      [
        record.structuralInspirationRef,
        record.visualInspirationRef,
        record.inspirationRef,
      ].filter((key): key is string => Boolean(key)),
    ),
  ];
}

export function hasSelectedInspiration(record: SlotSpecRecord | undefined) {
  return selectedInspirationKeys(record).length > 0;
}

export function hasSelectedCreativeProposal(
  record: SlotSpecRecord | undefined,
) {
  return Boolean(
    selectedCreativeProposal(
      record?.creativeProposals,
      record?.selectedCreativeProposalId,
    ),
  );
}

export function cloneSlotSpecRecord(
  record: SlotSpecRecord | undefined,
  slotId: string,
  patch: Partial<SlotSpecRecord> = {},
): SlotSpecRecord {
  return {
    directionKind: record?.directionKind ?? "manual",
    inspirationRef: record?.inspirationRef,
    structuralInspirationRef: record?.structuralInspirationRef,
    visualInspirationRef: record?.visualInspirationRef,
    signal: record?.signal,
    creativeMechanism: record?.creativeMechanism,
    notes: record?.notes,
    editorialDescription: record?.editorialDescription,
    inspirationSearchBrief: record?.inspirationSearchBrief,
    structuralSearchBrief: record?.structuralSearchBrief,
    visualSearchBrief: record?.visualSearchBrief,
    creativeProposals: record?.creativeProposals,
    selectedCreativeProposalId: record?.selectedCreativeProposalId,
    status: record?.status ?? "draft",
    preparedAt: record?.preparedAt,
    ...patch,
    slotId,
  };
}

export function isSpecReadyForCursor(record: SlotSpecRecord | undefined) {
  if (!record) return false;
  if (record.status !== "ready-for-cursor") return false;
  return canPrepareSlotSpec(record);
}

export function canPrepareSlotSpec(record: SlotSpecRecord | undefined) {
  if (!record) return false;
  if (hasSelectedCreativeProposal(record)) return true;
  if (record.directionKind === "inspiration") {
    return hasSelectedInspiration(record);
  }
  return Boolean(record.signal?.trim());
}

function usageSlice(
  key: string | undefined,
  proposals: Proposal[],
  specs: SlotSpecRecord[],
  slots: PlanningSlot[],
) {
  if (!key) return undefined;
  const usage = usageForInspiration(key, proposals, specs, slots);
  return {
    previousUses: usage.count,
    lastUsedAt: usage.lastUsedAt,
    usedAngles: usage.angleIds,
    relatedSlotIds: usage.slotIds,
    relatedProposalIds: usage.proposalIds,
    accountIds: usage.accountIds,
  };
}

function inspirationSlice(
  key: string | undefined,
  overrides: Record<string, InspirationMetaOverride>,
  proposals: Proposal[],
  specs: SlotSpecRecord[],
  slots: PlanningSlot[],
): SlotSpecInspirationSlice | undefined {
  if (!key) return undefined;
  const item = getInspirationByKey(key, overrides);
  return {
    ref: key,
    title: item?.title,
    type: item?.materialType,
    origin: item?.origin,
    signal: item?.signal,
    creativeMechanism: item?.creativeMechanism,
    usageContext: usageSlice(key, proposals, specs, slots),
  };
}

function fallbackInspirationRef(record: SlotSpecRecord | undefined) {
  return (
    record?.structuralInspirationRef ||
    record?.visualInspirationRef ||
    record?.inspirationRef
  );
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
  const hasExplicitStructural = Boolean(record?.structuralInspirationRef);
  const hasExplicitVisual = Boolean(record?.visualInspirationRef);
  const structuralKey =
    record?.structuralInspirationRef ||
    (!hasExplicitVisual ? record?.inspirationRef : undefined);
  const visualKey =
    record?.visualInspirationRef ||
    (!hasExplicitStructural ? record?.inspirationRef : undefined);
  const primaryKey = fallbackInspirationRef(record);
  const inspiration = primaryKey
    ? getInspirationByKey(primaryKey, overrides)
    : undefined;
  const usage = primaryKey
    ? usageForInspiration(primaryKey, proposals, specs, slots)
    : undefined;

  const cameraMode = cameraModeFromPresence(slot.cameraPresence);
  const productionTypeId = resolveSlotProductionType(slot);

  return {
    slotId: slot.id,
    accountId: slot.accountId,
    platforms: slot.platforms,
    date: slot.date,
    time: slot.time,
    roleId: slot.roleId,
    topicId: resolveSlotTopicId(slot),
    pillarId: slot.pillarId,
    productionTypeId,
    publicationTypeId: productionTypeId,
    formatId: slot.formatId,
    recommendedCreativeFormats: recommendCreativeFormats({
      roleId: slot.roleId,
      productionTypeId,
      cameraMode,
      limit: 4,
    }),
    cameraMode,
    inspirationRef: record?.inspirationRef,
    structuralInspirationRef: record?.structuralInspirationRef,
    visualInspirationRef: record?.visualInspirationRef,
    inspirationType: inspiration?.materialType,
    origin: inspiration?.origin,
    signal: record?.signal ?? inspiration?.signal,
    creativeMechanism:
      record?.creativeMechanism ?? inspiration?.creativeMechanism,
    structuralInspiration: inspirationSlice(
      structuralKey,
      overrides,
      proposals,
      specs,
      slots,
    ),
    visualInspiration: inspirationSlice(
      visualKey,
      overrides,
      proposals,
      specs,
      slots,
    ),
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
    cameraPresence: slot.cameraPresence,
    notes: record?.notes,
    editorialDescription: record?.editorialDescription,
    selectedCreativeProposal: selectedCreativeProposal(
      record?.creativeProposals,
      record?.selectedCreativeProposalId,
    ),
    status: record?.status ?? "draft",
  };
}

export function applyInspirationSelection(
  record: SlotSpecRecord | undefined,
  slotId: string,
  key: string,
  role: InspirationUseRole,
  item?: InspirationFeedItem,
): SlotSpecRecord {
  const next: SlotSpecRecord = cloneSlotSpecRecord(record, slotId, {
    directionKind: "inspiration",
  });

  if (role === "structure" || role === "both") {
    next.structuralInspirationRef = key;
    next.signal = item?.signal ?? next.signal;
    next.creativeMechanism = item?.creativeMechanism ?? next.creativeMechanism;
  }
  if (role === "visual" || role === "both") {
    next.visualInspirationRef = key;
  }
  if (role === "both" || !next.inspirationRef) {
    next.inspirationRef = key;
  }
  return next;
}

export function applyGeneratedSlotDescription(
  record: SlotSpecRecord | undefined,
  slotId: string,
  payload: SlotDescriptionPayload,
): SlotSpecRecord {
  return cloneSlotSpecRecord(record, slotId, {
    editorialDescription: payload.editorialDescription,
    structuralSearchBrief: payload.structuralSearchBrief,
    visualSearchBrief: payload.visualSearchBrief,
  });
}

export function applyGeneratedCreativeProposals(
  record: SlotSpecRecord | undefined,
  slotId: string,
  proposals: CreativeProposal[],
): SlotSpecRecord {
  return cloneSlotSpecRecord(record, slotId, {
    creativeProposals: [...(record?.creativeProposals ?? []), ...proposals],
  });
}

export function applySelectedCreativeProposal(
  record: SlotSpecRecord | undefined,
  slotId: string,
  proposalId: string,
): SlotSpecRecord {
  return cloneSlotSpecRecord(record, slotId, {
    selectedCreativeProposalId: proposalId,
  });
}

export function applyProposalInspirationRef(
  record: SlotSpecRecord | undefined,
  slotId: string,
  proposalId: string,
  key: string,
  attached: boolean,
): SlotSpecRecord {
  const proposals = (record?.creativeProposals ?? []).map((proposal) => {
    if (proposal.id !== proposalId) return proposal;
    return attached
      ? associateInspirationRef(proposal, key)
      : detachInspirationRef(proposal, key);
  });
  return cloneSlotSpecRecord(record, slotId, { creativeProposals: proposals });
}

const PLATFORM_LABELS: Record<string, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
};

function originLabelOf(origin?: string) {
  if (!origin) return "—";
  return INSPIRATION_ORIGIN_LABELS[origin as InspirationOrigin] ?? origin;
}

function historyLines(usage: SlotSpec["usageContext"]) {
  if (!usage) return ["- Sin usos previos"];
  const usedAngles =
    usage.usedAngles
      ?.map((id) => getAngleLabel(id))
      .filter(Boolean)
      .join(", ") ?? "";
  return [
    `- ${usage.previousUses} uso${usage.previousUses === 1 ? "" : "s"}${
      usage.lastUsedAt ? ` · último ${usage.lastUsedAt.slice(0, 10)}` : ""
    }`,
    ...(usedAngles ? [`- Ángulos ya usados: ${usedAngles}`] : []),
  ];
}

function referenceMarkdown(
  title: string,
  slice: SlotSpecInspirationSlice | undefined,
  fallbackRef?: string,
) {
  if (!slice && !fallbackRef) {
    return [
      `## ${title}`,
      "- Referencia: no seleccionada",
    ];
  }
  return [
    `## ${title}`,
    `- Referencia: ${slice?.title ?? slice?.ref ?? fallbackRef}`,
    slice?.type ? `- Tipo: ${INSPIRATION_TYPE_LABELS[slice.type]}` : "- Tipo: —",
    `- Origen: ${originLabelOf(slice?.origin)}`,
    `- Señal: ${slice?.signal ?? "—"}`,
    `- Mecanismo: ${slice?.creativeMechanism ?? "—"}`,
    ...historyLines(slice?.usageContext),
  ];
}

export function formatSlotSpecMarkdown(spec: SlotSpec): string {
  const structural =
    spec.structuralInspiration ??
    (spec.inspirationRef
      ? {
          ref: spec.inspirationRef,
          title: getInspirationByKey(spec.inspirationRef)?.title,
          type: spec.inspirationType,
          origin: spec.origin,
          signal: spec.signal,
          creativeMechanism: spec.creativeMechanism,
          usageContext: spec.usageContext,
        }
      : undefined);
  const visual =
    spec.visualInspiration ??
    (spec.inspirationRef
      ? {
          ref: spec.inspirationRef,
          title: getInspirationByKey(spec.inspirationRef)?.title,
          type: spec.inspirationType,
          origin: spec.origin,
          signal: spec.signal,
          creativeMechanism: spec.creativeMechanism,
          usageContext: spec.usageContext,
        }
      : undefined);

  const idea = spec.selectedCreativeProposal;
  const proposalInspirationKeys = idea?.inspirationRefs ?? [];
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
    `- Tema: ${getSlotTopicLabel({ roleId: spec.roleId, topicId: spec.topicId, pillarId: spec.pillarId })}`,
    `- Pieza: ${getPublicationTypeLabel(spec.productionTypeId)}`,
    spec.cameraPresence
      ? `- Cámara: ${cameraPresenceShortLabel(spec.cameraPresence)}`
      : "- Cámara: —",
    "",
    ...(idea
      ? [
          "## Dirección creativa seleccionada",
          `- Título: ${idea.title}`,
          `- Idea: ${idea.idea}`,
          `- Ángulo: ${idea.angle}`,
          `- Mensaje: ${idea.message}`,
          `- Concepto visual: ${idea.visualConcept}`,
          "- Estructura:",
          ...idea.structure.map((step, index) => `  ${index + 1}. ${step}`),
          ...(idea.requiredAssets?.length
            ? [
                "- Assets:",
                ...idea.requiredAssets.map((asset) => `  - ${asset}`),
              ]
            : ["- Assets: se puede generar por completo"]),
          ...(proposalInspirationKeys.length
            ? [
                "- Referencias asociadas:",
                ...proposalInspirationKeys.map(
                  (key) =>
                    `  - ${getInspirationByKey(key)?.title ?? key} (${key})`,
                ),
              ]
            : []),
        ]
      : [
          "## Dirección creativa",
          "- Todavía no hay una propuesta creativa seleccionada.",
        ]),
    spec.formatId
      ? `- Formato creativo legacy del slot: ${getFormatLabel(spec.formatId)} (no es obligatorio)`
      : "",
    ...(spec.editorialDescription
      ? ["", "## Descripción editorial (legacy)", spec.editorialDescription]
      : []),
    "",
    ...referenceMarkdown(
      "Referencia estructural (legacy)",
      structural,
      spec.structuralInspirationRef ||
        (!spec.visualInspirationRef ? spec.inspirationRef : undefined),
    ),
    "",
    ...referenceMarkdown(
      "Referencia visual (legacy)",
      visual,
      spec.visualInspirationRef ||
        (!spec.structuralInspirationRef ? spec.inspirationRef : undefined),
    ),
    "",
    "## Cómo usar las referencias",
    "Las referencias asociadas a la propuesta son dirección visual o estructural.",
    "No copiar literalmente el contenido, marca, claims ni texto de las referencias.",
    "Adaptarlas al slot y al Mercantis Brain.",
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
    "Desarrollar la dirección creativa seleccionada: copy, headline, estructura definitiva, guion si aplica, CTA, caption y dirección visual de producción.",
    "No cambiar cuenta, plataformas, fecha, rol, tema ni opción de producción.",
    "No reinventar la idea salvo que el spec lo pida. Profundizá esa propuesta.",
    "No sugerir talking head, vlog, entrevista, selfie ni grabación física si la producción es sin cámara.",
    "Sí se puede hacer video: motion graphics, screen recording, animación, IA, texto cinético, capturas.",
    "No inventar claims. Consultar el Mercantis Brain citado arriba.",
    "Guardar las propuestas en `src/content/proposals.ts` como `candidate`.",
  ];

  return lines.join("\n");
}

export function cursorPromptForSpec(spec: SlotSpec) {
  return `Desarrollá esta dirección creativa.\n\n${formatSlotSpecMarkdown(spec)}`;
}
