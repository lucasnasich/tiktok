import type { ContentRoleId } from "@/content/content-roles";
import type { PlanningAccount } from "@/content/planning-accounts";
import type { PlanningAccountOverride } from "@/lib/planning-config-store";
import type { RepetitionLimits } from "@/content/planning-accounts";
import {
  DEFAULT_ACTIVE_DAYS,
  DEFAULT_DISTRIBUTION_TYPE,
  DEFAULT_FORMAT_TARGETS,
  DEFAULT_OFFICIAL_PLATFORMS,
  DEFAULT_PILLAR_TARGETS_OFFICIAL,
  DEFAULT_REPETITION_LIMITS,
  DEFAULT_ROLE_TARGETS_OFFICIAL,
  DEFAULT_TIME_SLOTS,
} from "@/content/planning-defaults";
import type { PillarPriority } from "@/content/planning-setup-guide";

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
    hint: "Alcance + valor + prueba, con conversión baja.",
    roleTargets: { ...DEFAULT_ROLE_TARGETS_OFFICIAL },
  },
  {
    id: "oficial-autoridad",
    label: "Más autoridad",
    hint: "Sube valor y prueba; mantiene alcance.",
    roleTargets: {
      alcance: 25,
      valor: 30,
      prueba: 20,
      conversion: 5,
      marca: 12,
      comunidad: 8,
    },
  },
  {
    id: "oficial-descubrimiento",
    label: "Más descubrimiento",
    hint: "Prioriza alcance sin vaciar valor.",
    roleTargets: {
      alcance: 45,
      valor: 20,
      prueba: 12,
      conversion: 5,
      marca: 10,
      comunidad: 8,
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
    hint: "Cambia de rol, pilar y formato más seguido.",
    limits: {
      maxConsecutiveSamePillar: 1,
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

export function hasEditorialMix(account: Pick<PlanningAccount, "roleTargets">) {
  return Object.values(account.roleTargets).some((value) => (value ?? 0) > 0);
}

function hasPositiveTargets(targets: Record<string, number> | undefined) {
  return Object.values(targets ?? {}).some((value) => (value ?? 0) > 0);
}

/** Completa pilares/formatos vacíos del piloto oficial si el mix de roles ya existe. */
export function fillOfficialEditorialGaps(
  account: PlanningAccount,
): PlanningAccount {
  if (account.id !== "mercantis-oficial") return account;
  if (!hasEditorialMix(account)) return account;
  return {
    ...account,
    pillarTargets: hasPositiveTargets(account.pillarTargets)
      ? account.pillarTargets
      : { ...DEFAULT_PILLAR_TARGETS_OFFICIAL },
    formatTargets: hasPositiveTargets(account.formatTargets)
      ? account.formatTargets
      : { ...DEFAULT_FORMAT_TARGETS },
  };
}

export function officialPillarPriorities(): Record<string, PillarPriority> {
  const result: Record<string, PillarPriority> = {};
  for (const [id, value] of Object.entries(DEFAULT_PILLAR_TARGETS_OFFICIAL)) {
    if (value >= 18) result[id] = "alta";
    else if (value >= 10) result[id] = "media";
    else if (value > 0) result[id] = "baja";
    else result[id] = "no";
  }
  return result;
}

export function officialFormatIds(): string[] {
  return Object.keys(DEFAULT_FORMAT_TARGETS);
}

export function buildOfficialRecommendedSettings(): PlanningAccountOverride {
  return {
    platforms: [...DEFAULT_OFFICIAL_PLATFORMS],
    postsPerDay: 3,
    activeDays: [...DEFAULT_ACTIVE_DAYS],
    timeSlots: [...DEFAULT_TIME_SLOTS],
    roleTargets: { ...DEFAULT_ROLE_TARGETS_OFFICIAL },
    pillarTargets: { ...DEFAULT_PILLAR_TARGETS_OFFICIAL },
    formatTargets: { ...DEFAULT_FORMAT_TARGETS },
    repetitionLimits: { ...DEFAULT_REPETITION_LIMITS },
    defaultDistributionType: DEFAULT_DISTRIBUTION_TYPE,
  };
}
