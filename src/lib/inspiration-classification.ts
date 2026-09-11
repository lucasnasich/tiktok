import type { ContentRoleId } from "@/content/content-roles";
import {
  getInspirationCreativeMechanismLabel,
  getInspirationSignalTagLabel,
  labelsFromIds,
} from "@/content/inspiration-classification-options";
import type { InspirationFeedItem } from "@/content/inspiration-feed";
import type {
  InspirationMaterialType,
  InspirationOrigin,
} from "@/content/inspiration-taxonomy";
import type { InspirationMetaOverride } from "@/lib/inspiration-overrides-store";

export type InspirationClassificationStepId =
  | "materialType"
  | "origin"
  | "angle"
  | "role"
  | "pillar"
  | "format"
  | "signal"
  | "mechanism";

export type InspirationClassificationDraft = {
  materialType?: InspirationMaterialType;
  origin?: InspirationOrigin;
  angleAffinities?: string[];
  roleAffinities?: ContentRoleId[];
  pillarAffinities?: string[];
  formatAffinities?: string[];
  signalTagIds?: string[];
  creativeMechanismIds?: string[];
};

export const INSPIRATION_CLASSIFICATION_STEPS: {
  id: InspirationClassificationStepId;
  title: string;
  description: string;
  multi: boolean;
}[] = [
  {
    id: "materialType",
    title: "Tipo",
    description:
      "¿Es una pieza ya publicada que querés tomar de referencia, o una idea/sugerencia para adaptar?",
    multi: false,
  },
  {
    id: "origin",
    title: "Origen",
    description: "¿De dónde sale esta referencia?",
    multi: false,
  },
  {
    id: "angle",
    title: "Ángulo",
    description: "¿Cómo cuenta o encara el tema? Podés elegir más de uno.",
    multi: true,
  },
  {
    id: "role",
    title: "Rol",
    description:
      "¿Para qué te serviría adaptar algo así en Mercantis? Podés elegir más de uno.",
    multi: true,
  },
  {
    id: "pillar",
    title: "Pilar",
    description: "¿De qué tema de negocio habla? Podés elegir más de uno.",
    multi: true,
  },
  {
    id: "format",
    title: "Formato",
    description:
      "¿Qué plantilla creativa encaja mejor? Podés elegir más de una.",
    multi: true,
  },
  {
    id: "signal",
    title: "Señal",
    description:
      "¿Qué transmite o enseña esta referencia? Elegí todas las que apliquen.",
    multi: true,
  },
  {
    id: "mechanism",
    title: "Mecanismo",
    description:
      "¿Qué recursos creativos usa la pieza? Elegí todos los que veas.",
    multi: true,
  },
];

export function isInspirationClassified(
  override?: InspirationMetaOverride,
): boolean {
  if (!override) return false;
  if (!override.materialType) return false;
  if (!override.origin || override.origin === "unknown") return false;
  if (!override.angleAffinities?.length) return false;
  if (!override.roleAffinities?.length) return false;
  if (!override.pillarAffinities?.length) return false;
  if (!override.formatAffinities?.length) return false;
  if (!override.signalTagIds?.length) return false;
  if (!override.creativeMechanismIds?.length) return false;
  return true;
}

export function countUnclassifiedInspirations(
  items: InspirationFeedItem[],
  overrides: Record<string, InspirationMetaOverride>,
): number {
  return items.filter((item) => !isInspirationClassified(overrides[item.key]))
    .length;
}

export function unclassifiedInspirationKeys(
  items: InspirationFeedItem[],
  overrides: Record<string, InspirationMetaOverride>,
): string[] {
  return items
    .filter((item) => !isInspirationClassified(overrides[item.key]))
    .map((item) => item.key);
}

export function initialClassificationDraft(
  item: InspirationFeedItem,
  override?: InspirationMetaOverride,
): InspirationClassificationDraft {
  const fromOverride = overrideToDraft(override);
  return {
    materialType: fromOverride.materialType ?? item.materialType,
    origin:
      fromOverride.origin && fromOverride.origin !== "unknown"
        ? fromOverride.origin
        : item.origin !== "unknown"
          ? item.origin
          : undefined,
    angleAffinities: fromOverride.angleAffinities?.length
      ? fromOverride.angleAffinities
      : [...(item.angleAffinities ?? [])],
    roleAffinities: fromOverride.roleAffinities?.length
      ? fromOverride.roleAffinities
      : [...(item.roleAffinities ?? [])],
    pillarAffinities: fromOverride.pillarAffinities?.length
      ? fromOverride.pillarAffinities
      : [...(item.pillarAffinities ?? [])],
    formatAffinities: fromOverride.formatAffinities?.length
      ? fromOverride.formatAffinities
      : [...(item.formatIds ?? []), ...(item.formatAffinities ?? [])].filter(
          (id, index, list) => list.indexOf(id) === index,
        ),
    signalTagIds: fromOverride.signalTagIds ?? [],
    creativeMechanismIds: fromOverride.creativeMechanismIds ?? [],
  };
}

export function overrideToDraft(
  override?: InspirationMetaOverride,
): InspirationClassificationDraft {
  return {
    materialType: override?.materialType,
    origin: override?.origin,
    angleAffinities: override?.angleAffinities ?? [],
    roleAffinities: override?.roleAffinities ?? [],
    pillarAffinities: override?.pillarAffinities ?? [],
    formatAffinities: override?.formatAffinities ?? [],
    signalTagIds: override?.signalTagIds ?? [],
    creativeMechanismIds: override?.creativeMechanismIds ?? [],
  };
}

export function draftToOverride(
  draft: InspirationClassificationDraft,
): InspirationMetaOverride {
  const signalTagIds = draft.signalTagIds?.length
    ? draft.signalTagIds
    : undefined;
  const creativeMechanismIds = draft.creativeMechanismIds?.length
    ? draft.creativeMechanismIds
    : undefined;

  return {
    materialType: draft.materialType,
    origin: draft.origin,
    angleAffinities: draft.angleAffinities?.length
      ? draft.angleAffinities
      : undefined,
    roleAffinities: draft.roleAffinities?.length
      ? draft.roleAffinities
      : undefined,
    pillarAffinities: draft.pillarAffinities?.length
      ? draft.pillarAffinities
      : undefined,
    formatAffinities: draft.formatAffinities?.length
      ? draft.formatAffinities
      : undefined,
    signalTagIds,
    creativeMechanismIds,
    signal: labelsFromIds(signalTagIds, getInspirationSignalTagLabel) || undefined,
    creativeMechanism:
      labelsFromIds(creativeMechanismIds, getInspirationCreativeMechanismLabel) ||
      undefined,
    classifiedAt: new Date().toISOString(),
  };
}

export function isClassificationDraftComplete(
  draft: InspirationClassificationDraft,
): boolean {
  return INSPIRATION_CLASSIFICATION_STEPS.every((step) =>
    canAdvanceClassificationStep(step.id, draft),
  );
}

export function classificationDraftMissingLabels(
  draft: InspirationClassificationDraft,
): string[] {
  return INSPIRATION_CLASSIFICATION_STEPS.filter(
    (step) => !canAdvanceClassificationStep(step.id, draft),
  ).map((step) => step.title);
}

export function canAdvanceClassificationStep(
  stepId: InspirationClassificationStepId,
  draft: InspirationClassificationDraft,
): boolean {
  switch (stepId) {
    case "materialType":
      return Boolean(draft.materialType);
    case "origin":
      return Boolean(draft.origin && draft.origin !== "unknown");
    case "angle":
      return Boolean(draft.angleAffinities?.length);
    case "role":
      return Boolean(draft.roleAffinities?.length);
    case "pillar":
      return Boolean(draft.pillarAffinities?.length);
    case "format":
      return Boolean(draft.formatAffinities?.length);
    case "signal":
      return Boolean(draft.signalTagIds?.length);
    case "mechanism":
      return Boolean(draft.creativeMechanismIds?.length);
    default:
      return false;
  }
}

export function toggleListValue<T extends string>(
  current: T[] | undefined,
  value: T,
): T[] {
  const list = current ?? [];
  return list.includes(value)
    ? list.filter((entry) => entry !== value)
    : [...list, value];
}
