import type { Proposal } from "@/content/proposals";
import type { PlanningSlot } from "@/content/planned-slots";
import {
  PILOT_ACCOUNT_ID,
  STUDIO_ONBOARDING_STEPS,
  type StudioOnboardingStep,
  type StudioOnboardingStepId,
} from "@/content/studio-onboarding-steps";
import type { SlotSpecRecord } from "@/content/slot-specs";
import { isSpecReadyForCursor } from "@/lib/slot-spec";

export type StudioOnboardingManualFlags = Partial<
  Record<StudioOnboardingStepId, boolean>
>;

export type StudioOnboardingStepState = StudioOnboardingStep & {
  completed: boolean;
  status: "complete" | "current" | "upcoming";
};

export type StudioOnboardingProgress = {
  steps: StudioOnboardingStepState[];
  completedCount: number;
  totalCount: number;
  percent: number;
  allComplete: boolean;
  currentStepId: StudioOnboardingStepId | null;
  suggestedSlotHref?: string;
};

type ComputeStudioOnboardingInput = {
  setupCompleted: boolean;
  assignedProfileId?: string;
  horizonSlots: PlanningSlot[];
  slotSpecs: Record<string, SlotSpecRecord>;
  proposals: Proposal[];
  manualFlags: StudioOnboardingManualFlags;
};

function stepChecks(input: ComputeStudioOnboardingInput) {
  const pilotSlots = input.horizonSlots.filter(
    (slot) => slot.accountId === PILOT_ACCOUNT_ID,
  );
  const specs = Object.values(input.slotSpecs);
  const readySpecs = specs.filter((record) => isSpecReadyForCursor(record));

  const pilotSlotIds = new Set(pilotSlots.map((slot) => slot.id));
  const pilotProposals = input.proposals.filter((proposal) =>
    pilotSlotIds.has(proposal.planSlotId),
  );

  const firstOpenSlot = pilotSlots.find(
    (slot) => !readySpecs.some((record) => record.slotId === slot.id),
  );

  return {
    perfil: Boolean(input.assignedProfileId) && input.setupCompleted,
    calendario: input.horizonSlots.length > 0,
    "slot-spec": readySpecs.length > 0,
    propuestas: pilotProposals.some(
      (proposal) => proposal.status === "candidate",
    ),
    elegir: pilotProposals.some((proposal) => proposal.status === "selected"),
    produccion: Boolean(input.manualFlags.produccion),
    publicacion: Boolean(input.manualFlags.publicacion),
    suggestedSlotHref: firstOpenSlot
      ? `/planificacion?slot=${firstOpenSlot.id}`
      : pilotSlots[0]
        ? `/planificacion?slot=${pilotSlots[0].id}`
        : undefined,
  };
}

export function computeStudioOnboardingProgress(
  input: ComputeStudioOnboardingInput,
): StudioOnboardingProgress {
  const checks = stepChecks(input);

  let currentStepId: StudioOnboardingStepId | null = null;
  const steps: StudioOnboardingStepState[] = STUDIO_ONBOARDING_STEPS.map(
    (step) => {
      const manualDone = step.manual
        ? Boolean(input.manualFlags[step.id])
        : false;
      const completed = step.manual
        ? manualDone
        : Boolean(checks[step.id as keyof typeof checks]);

      if (!completed && !currentStepId) {
        currentStepId = step.id;
      }

      return {
        ...step,
        completed,
        status: "upcoming",
      };
    },
  );

  for (const step of steps) {
    if (step.completed) {
      step.status = "complete";
    } else if (step.id === currentStepId) {
      step.status = "current";
    } else {
      step.status = "upcoming";
    }
  }

  const completedCount = steps.filter((step) => step.completed).length;
  const totalCount = steps.length;

  return {
    steps,
    completedCount,
    totalCount,
    percent: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
    allComplete: completedCount === totalCount,
    currentStepId,
    suggestedSlotHref: checks.suggestedSlotHref,
  };
}

export function hrefForOnboardingStep(
  step: StudioOnboardingStep,
  progress: StudioOnboardingProgress,
): string {
  if (step.id === "slot-spec" && progress.suggestedSlotHref) {
    return progress.suggestedSlotHref;
  }
  return step.href;
}
