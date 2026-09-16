import { getAngleLabel } from "@/content/angles";
import {
  cameraModeFromPresence,
  cameraPresenceConstraint,
  cameraPresenceShortLabel,
} from "@/content/camera-presence";
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

export function isSpecReadyForCursor(record: SlotSpecRecord | undefined) {
  if (!record) return false;
  if (record.status !== "ready-for-cursor") return false;
  if (record.directionKind === "inspiration") {
    return hasSelectedInspiration(record);
  }
  return Boolean(record.signal?.trim());
}

export function canPrepareSlotSpec(record: SlotSpecRecord | undefined) {
  if (!record) return false;
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
  const next: SlotSpecRecord = {
    slotId,
    directionKind: "inspiration",
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
    status: record?.status ?? "draft",
    preparedAt: record?.preparedAt,
  };

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
  return {
    slotId,
    directionKind: record?.directionKind ?? "inspiration",
    inspirationRef: record?.inspirationRef,
    structuralInspirationRef: record?.structuralInspirationRef,
    visualInspirationRef: record?.visualInspirationRef,
    signal: record?.signal,
    creativeMechanism: record?.creativeMechanism,
    notes: record?.notes,
    editorialDescription: payload.editorialDescription,
    inspirationSearchBrief: record?.inspirationSearchBrief,
    structuralSearchBrief: payload.structuralSearchBrief,
    visualSearchBrief: payload.visualSearchBrief,
    status: record?.status ?? "draft",
    preparedAt: record?.preparedAt,
  };
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
      ? `- Producción: ${cameraPresenceShortLabel(spec.cameraPresence)}`
      : "- Producción: —",
    "",
    "## Formatos creativos recomendados",
    "El formato creativo NO está programado en el calendario. Elegí uno de esta lista (ya filtrada por tipo de pieza y restricción de producción):",
    ...(spec.recommendedCreativeFormats.length
      ? spec.recommendedCreativeFormats.map(
          (format) =>
            `- ${format.label} (${format.id}): ${format.summary}`,
        )
      : ["- Sin formatos compatibles. Revisá la opción de producción."]),
    spec.formatId
      ? `- Legacy del slot: ${getFormatLabel(spec.formatId)} (no es obligatorio)`
      : "",
    ...(spec.editorialDescription
      ? ["", "## Descripción editorial", spec.editorialDescription]
      : []),
    "",
    ...referenceMarkdown(
      "Referencia estructural",
      structural,
      spec.structuralInspirationRef ||
        (!spec.visualInspirationRef ? spec.inspirationRef : undefined),
    ),
    "",
    ...referenceMarkdown(
      "Referencia visual",
      visual,
      spec.visualInspirationRef ||
        (!spec.structuralInspirationRef ? spec.inspirationRef : undefined),
    ),
    "",
    "## Cómo usarlas",
    "La referencia estructural define el mecanismo narrativo.",
    "La referencia visual define composición y lenguaje visual.",
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
    "Desarrollar propuestas completas para este slot: ángulo, concepto, hook, narrativa, 2 a 4 formatos creativos (usar la lista filtrada de arriba), estructura, copy por slide/escena, CTA, caption y dirección visual.",
    "No cambiar cuenta, plataformas, fecha, rol, tema ni opción de producción.",
    "No sugerir talking head, vlog, entrevista, selfie ni grabación física si la producción es sin cámara.",
    "Sí se puede hacer video: motion graphics, screen recording, animación, IA, texto cinético, capturas.",
    "No inventar claims. Consultar el Mercantis Brain citado arriba.",
    "Guardar las propuestas en `src/content/proposals.ts` como `candidate`.",
    "Setear `structuralSourceRef` y `visualSourceRef` (y `sourceRef` legacy) con las keys del spec.",
  ];

  return lines.join("\n");
}

export function cursorPromptForSpec(spec: SlotSpec) {
  return `Desarrollá propuestas para este slot.\n\n${formatSlotSpecMarkdown(spec)}`;
}

export function cursorPromptForSlotDescription(spec: SlotSpec) {
  const production = spec.cameraPresence
    ? cameraPresenceConstraint(spec.cameraPresence)
    : "Sin restricción de cámara declarada.";

  return [
    "Redactá la descripción editorial de este slot de contenido Mercantis.",
    "",
    "Requisitos:",
    "- Guardá TRES campos en el SlotSpecRecord del slot, en el planning store del Studio.",
    "",
    "### editorialDescription",
    "- 2 a 4 oraciones en español argentino, prosa continua y amigable.",
    "- Sin listas, viñetas, guiones largos (—) ni prefijos del tipo \"Rol:\", \"Pilar:\" o \"Formato:\".",
    "- Explicá qué hay que lograr con la pieza y cómo encajan rol, tema y opción de producción.",
    "",
    "### structuralSearchBrief",
    "- 1 a 3 oraciones EXCLUSIVAMENTE sobre: hook deseado, estructura narrativa, beats, ritmo, mecanismo, tipo de desarrollo, payoff / CTA.",
    "- No describir estética, cámara, composición ni paleta.",
    "",
    "### visualSearchBrief",
    "- 1 a 3 oraciones EXCLUSIVAMENTE sobre: persona/producto/pantalla, cámara, composición, movimiento, setting, overlays, edición, lenguaje visual, ritmo visual.",
    "- No describir el tema que debe tratar Mercantis salvo que sea imprescindible visualmente.",
    "",
    "- También podés dejar `inspirationSearchBrief` como fallback legacy (un párrafo corto), pero los dos briefs separados son la fuente principal.",
    "- No inventes features, pricing, clientes ni claims. Consultá el Mercantis Brain.",
    `- Producción: ${production}`,
    "",
    `Slot ID: ${spec.slotId}`,
    "",
    formatSlotSpecMarkdown(spec),
  ].join("\n");
}
