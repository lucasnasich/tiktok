import { useCallback, useMemo } from "react";

import type { StudioOnboardingManualFlags } from "@/lib/studio-onboarding";
import {
  computeStudioOnboardingProgress,
  type StudioOnboardingProgress,
} from "@/lib/studio-onboarding";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { usePlanningConfig } from "@/hooks/use-planning-config";
import { useProposals } from "@/hooks/use-proposals";
import { useSlotSpecs } from "@/hooks/use-slot-specs";

const MANUAL_STORAGE_KEY = "studio-onboarding-manual";

function parseManualFlags(raw: unknown): StudioOnboardingManualFlags {
  if (!raw || typeof raw !== "object") return {};
  const data = raw as Record<string, unknown>;
  const result: StudioOnboardingManualFlags = {};
  if (data.produccion === true) result.produccion = true;
  if (data.publicacion === true) result.publicacion = true;
  return result;
}

export function useStudioOnboarding(): {
  progress: StudioOnboardingProgress;
  markManualStepDone: (stepId: keyof StudioOnboardingManualFlags) => void;
  clearManualStep: (stepId: keyof StudioOnboardingManualFlags) => void;
} {
  const {
    allCalendarSlots,
    studioAccounts,
    setupCompleted,
    getAssignedProfileId,
  } = usePlanningConfig();
  const pilotAccountId = studioAccounts[0]?.id;
  const { proposals } = useProposals();
  const { records: slotSpecs } = useSlotSpecs();
  const [manualFlags, setManualFlags] = usePersistedState<StudioOnboardingManualFlags>(
    MANUAL_STORAGE_KEY,
    {},
    parseManualFlags,
  );

  const horizonSlots = allCalendarSlots;

  const progress = useMemo(
    () =>
      computeStudioOnboardingProgress({
        setupCompleted,
        assignedProfileId: pilotAccountId
          ? getAssignedProfileId(pilotAccountId)
          : undefined,
        horizonSlots,
        slotSpecs,
        proposals,
        manualFlags,
      }),
    [
      getAssignedProfileId,
      horizonSlots,
      manualFlags,
      pilotAccountId,
      proposals,
      setupCompleted,
      slotSpecs,
    ],
  );

  const markManualStepDone = useCallback(
    (stepId: keyof StudioOnboardingManualFlags) => {
      setManualFlags((prev) => ({ ...prev, [stepId]: true }));
    },
    [setManualFlags],
  );

  const clearManualStep = useCallback(
    (stepId: keyof StudioOnboardingManualFlags) => {
      setManualFlags((prev) => {
        const next = { ...prev };
        delete next[stepId];
        return next;
      });
    },
    [setManualFlags],
  );

  return { progress, markManualStepDone, clearManualStep };
}
