import type { ContentRoleId } from "@/content/content-roles";
import type { PlanningAccount } from "@/content/planning-accounts";
import type { PlanningAccountOverride } from "@/lib/planning-config-store";
import type { RepetitionLimits } from "@/content/planning-accounts";
import {
  DEFAULT_ACTIVE_DAYS,
  DEFAULT_CAMERA_MODE,
  DEFAULT_DISTRIBUTION_TYPE,
  DEFAULT_FORMAT_TARGETS,
  DEFAULT_OFFICIAL_PLATFORMS,
  DEFAULT_PILLAR_TARGETS_OFFICIAL,
  DEFAULT_PUBLICATION_TYPE_TARGETS,
  DEFAULT_REPETITION_LIMITS,
  DEFAULT_ROLE_TARGETS_OFFICIAL,
  DEFAULT_TIME_SLOTS,
} from "@/content/planning-defaults";
import {
  cloneDefaultRoleTopicPreferences,
  normalizeRoleTopicPreferences,
} from "@/content/role-topics";
import { normalizePercentTargets } from "@/lib/planning-percent";

export type RoleMixPreset = {
  id: string;
  label: string;
  hint: string;
  roleTargets: Partial<Record<ContentRoleId, number>>;
};

export const OFFICIAL_ROLE_MIX_PRESETS: RoleMixPreset[] = [
  {
    id: "oficial-equilibrado",
    label: "Oficial equilibrado",
    hint: "El mix oficial: proceso primero, después educación y producto.",
    roleTargets: { ...DEFAULT_ROLE_TARGETS_OFFICIAL },
  },
  {
    id: "oficial-autoridad",
    label: "Más autoridad",
    hint: "Sube educación, producto y evidencia; el proceso sigue liderando.",
    roleTargets: {
      build_in_public: 25,
      educacion: 22,
      producto: 18,
      evidencia: 15,
      marca: 15,
      comunidad: 5,
    },
  },
  {
    id: "oficial-descubrimiento",
    label: "Más proceso",
    hint: "Prioriza build in public sin vaciar educación ni marca.",
    roleTargets: {
      build_in_public: 45,
      educacion: 20,
      producto: 10,
      marca: 15,
      evidencia: 5,
      comunidad: 5,
    },
  },
];

export type VarietyPreset = {
  id: string;
  label: string;
  hint: string;
  limits: RepetitionLimits;
};

export const VARIETY_PRESETS: VarietyPreset[] = [
  {
    id: "standard",
    label: "Estándar",
    hint: "Evita rachas largas sin bloquear repetición útil.",
    limits: { ...DEFAULT_REPETITION_LIMITS },
  },
  {
    id: "strict",
    label: "Más variedad",
    hint: "Cambia de rol y pilar más seguido.",
    limits: {
      maxConsecutiveSamePillar: 1,
      maxConsecutiveSameTopic: 1,
      maxSameFormatInPeriod: 2,
      maxSameRoleInRow: 1,
    },
  },
  {
    id: "flexible",
    label: "Más repetición",
    hint: "Deja repetir lo que funciona un poco más.",
    limits: {
      maxConsecutiveSamePillar: 3,
      maxConsecutiveSameTopic: 3,
      maxSameFormatInPeriod: 5,
      maxSameRoleInRow: 3,
    },
  },
];

export function varietyPresetIdFor(
  limits: RepetitionLimits,
): string | undefined {
  return VARIETY_PRESETS.find(
    (preset) =>
      preset.limits.maxConsecutiveSamePillar ===
        limits.maxConsecutiveSamePillar &&
      preset.limits.maxSameFormatInPeriod === limits.maxSameFormatInPeriod &&
      preset.limits.maxSameRoleInRow === limits.maxSameRoleInRow,
  )?.id;
}

/** Cuánto puede repetirse el mismo formato en el período del calendario. */
export type FormatRotationPreset = {
  id: string;
  label: string;
  hint: string;
  maxSameFormatInPeriod: number;
};

export const FORMAT_ROTATION_PRESETS: FormatRotationPreset[] = [
  {
    id: "varied",
    label: "Más variedad",
    hint: "Rota formatos más seguido. El mismo formato aparece menos en la semana.",
    maxSameFormatInPeriod: 2,
  },
  {
    id: "standard",
    label: "Estándar",
    hint: "Equilibrio: respeta el mix sin saturar un solo formato.",
    maxSameFormatInPeriod: 3,
  },
  {
    id: "flexible",
    label: "Más repetición",
    hint: "Deja repetir un formato que funciona antes de forzar cambio.",
    maxSameFormatInPeriod: 5,
  },
];

export function formatRotationPresetIdFor(limits: RepetitionLimits): string {
  return (
    FORMAT_ROTATION_PRESETS.find(
      (preset) => preset.maxSameFormatInPeriod === limits.maxSameFormatInPeriod,
    )?.id ?? "standard"
  );
}

/** Roles y pilares usan defaults del perfil; solo el usuario ajusta rotación de formatos. */
export function repetitionLimitsWithFormatRotation(
  maxSameFormatInPeriod: number,
): RepetitionLimits {
  return {
    ...DEFAULT_REPETITION_LIMITS,
    maxSameFormatInPeriod,
  };
}

export function hasEditorialMix(account: Pick<PlanningAccount, "roleTargets">) {
  return Object.values(account.roleTargets).some((value) => (value ?? 0) > 0);
}

function hasPositiveTargets(targets: Record<string, number> | undefined) {
  return Object.values(targets ?? {}).some((value) => (value ?? 0) > 0);
}

/** Completa temas y tipos de publicación vacíos del piloto oficial si el mix de roles ya existe. */
export function fillOfficialEditorialGaps(
  account: PlanningAccount,
): PlanningAccount {
  if (account.type !== "official") return account;
  if (!hasEditorialMix(account)) return account;
  return {
    ...account,
    roleTopicPreferences: normalizeRoleTopicPreferences(
      account.roleTopicPreferences,
      account.pillarTargets,
    ),
    pillarTargets: hasPositiveTargets(account.pillarTargets)
      ? account.pillarTargets
      : { ...DEFAULT_PILLAR_TARGETS_OFFICIAL },
    publicationTypeTargets: hasPositiveTargets(
      account.publicationTypeTargets as Record<string, number>,
    )
      ? account.publicationTypeTargets
      : { ...DEFAULT_PUBLICATION_TYPE_TARGETS },
    cameraMode: account.cameraMode ?? DEFAULT_CAMERA_MODE,
    formatTargets: account.formatTargets,
  };
}

export function officialFormatIds(): string[] {
  return Object.keys(DEFAULT_FORMAT_TARGETS);
}

/**
 * Formatos curados para Mercantis oficial (institucional).
 * Recuperados del chat del 2026-09-11 — orden del wizard.
 */
export const MERCANTIS_OFICIAL_CURATED_FORMAT_IDS = [
  "x-razones",
  "nosotros-vs-ellos",
  "diagrama-venn",
  "nota-iphone",
  "captura-chat",
  "pizarra",
  "testimonio-cliente",
  "lo-nuevo-vs-lo-viejo",
  "transformacion",
  "busqueda-google",
  "problema-vs-solucion",
  "titular-con-dato",
  "garabato",
  "captura-email",
  "resenas",
  "tier-list",
  "green-screen",
  "x-senales",
  "mito-vs-realidad",
  "problemas-tachados",
  "lo-que-podes-evitar",
  "advertencia",
] as const;

export function buildMercantisOfficialCuratedSettings(): PlanningAccountOverride {
  const formatWeights: Record<string, number> = {};
  for (const id of MERCANTIS_OFICIAL_CURATED_FORMAT_IDS) {
    formatWeights[id] = 1;
  }

  return {
    platforms: [...DEFAULT_OFFICIAL_PLATFORMS],
    postsPerDay: 3,
    activeDays: [...DEFAULT_ACTIVE_DAYS],
    timeSlots: [...DEFAULT_TIME_SLOTS],
    roleTargets: { ...DEFAULT_ROLE_TARGETS_OFFICIAL },
    roleTopicPreferences: cloneDefaultRoleTopicPreferences(),
    pillarTargets: { ...DEFAULT_PILLAR_TARGETS_OFFICIAL },
    publicationTypeTargets: { ...DEFAULT_PUBLICATION_TYPE_TARGETS },
    cameraMode: DEFAULT_CAMERA_MODE,
    formatTargets: normalizePercentTargets(formatWeights),
    repetitionLimits: repetitionLimitsWithFormatRotation(3),
    defaultDistributionType: DEFAULT_DISTRIBUTION_TYPE,
  };
}

export function buildOfficialRecommendedSettings(): PlanningAccountOverride {
  return {
    platforms: [...DEFAULT_OFFICIAL_PLATFORMS],
    postsPerDay: 3,
    activeDays: [...DEFAULT_ACTIVE_DAYS],
    timeSlots: [...DEFAULT_TIME_SLOTS],
    roleTargets: { ...DEFAULT_ROLE_TARGETS_OFFICIAL },
    roleTopicPreferences: cloneDefaultRoleTopicPreferences(),
    pillarTargets: { ...DEFAULT_PILLAR_TARGETS_OFFICIAL },
    publicationTypeTargets: { ...DEFAULT_PUBLICATION_TYPE_TARGETS },
    cameraMode: DEFAULT_CAMERA_MODE,
    formatTargets: { ...DEFAULT_FORMAT_TARGETS },
    repetitionLimits: { ...DEFAULT_REPETITION_LIMITS },
    defaultDistributionType: DEFAULT_DISTRIBUTION_TYPE,
  };
}
