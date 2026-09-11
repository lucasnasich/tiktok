import type { PlanningProfile } from "@/content/planning-profiles";
import type { PlanningAccountOverride } from "@/lib/planning-config-store";
import type { PlanningWizardSession } from "@/lib/planning-wizard-session";

function countPositiveTargets(targets?: Record<string, number>): number {
  return Object.values(targets ?? {}).filter((value) => (value ?? 0) > 0).length;
}

export function settingsRichness(settings: PlanningAccountOverride): number {
  return (
    countPositiveTargets(settings.roleTargets as Record<string, number>) *
      1000 +
    countPositiveTargets(settings.formatTargets) * 100 +
    countPositiveTargets(settings.pillarTargets)
  );
}

/** No deja que un autosave vacío pise roles, pilares o formatos ya elegidos. */
export function preferRicherSettings(
  current: PlanningAccountOverride,
  incoming: PlanningAccountOverride,
): PlanningAccountOverride {
  if (settingsRichness(incoming) >= settingsRichness(current)) return incoming;

  return {
    ...incoming,
    roleTargets:
      countPositiveTargets(incoming.roleTargets as Record<string, number>) > 0
        ? incoming.roleTargets
        : current.roleTargets,
    formatTargets:
      countPositiveTargets(incoming.formatTargets) > 0
        ? incoming.formatTargets
        : current.formatTargets,
    pillarTargets:
      countPositiveTargets(incoming.pillarTargets) > 0
        ? incoming.pillarTargets
        : current.pillarTargets,
    repetitionLimits: incoming.repetitionLimits ?? current.repetitionLimits,
  };
}

export function mergeProfilesByRicherSettings(
  left: PlanningProfile[],
  right: PlanningProfile[],
): PlanningProfile[] {
  const byId = new Map<string, PlanningProfile>();

  for (const profile of [...left, ...right]) {
    const existing = byId.get(profile.id);
    if (!existing) {
      byId.set(profile.id, profile);
      continue;
    }

    const settings = preferRicherSettings(existing.settings, profile.settings);
    const pick =
      settingsRichness(profile.settings) > settingsRichness(existing.settings)
        ? profile
        : existing;

    byId.set(profile.id, { ...pick, settings });
  }

  return [...byId.values()];
}

export function preferRicherWizardSession(
  current: PlanningWizardSession | undefined,
  incoming: PlanningWizardSession,
): PlanningWizardSession {
  if (!current) return incoming;

  return {
    ...incoming,
    settings: preferRicherSettings(current.settings, incoming.settings),
    selectedFormatIds:
      incoming.selectedFormatIds.length > 0
        ? incoming.selectedFormatIds
        : current.selectedFormatIds,
    pillarPriorities:
      Object.keys(incoming.pillarPriorities).length > 0
        ? incoming.pillarPriorities
        : current.pillarPriorities,
  };
}
