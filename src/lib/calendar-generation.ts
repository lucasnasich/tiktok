import {
  presenceFromCameraMode,
  type CameraPresenceMode,
} from "@/content/camera-presence";
import { normalizeProductionConfig } from "@/content/production-options";
import {
  formatCalendarGenerationLabel,
  type CalendarGeneration,
  type CalendarGenerationRequest,
} from "@/content/calendar-generations";
import type { PlanningSlot } from "@/content/planned-slots";
import type { PlanningAccount } from "@/content/planning-accounts";
import { resolveProfile } from "@/content/planning-profiles";
import {
  buildPlanningAccountsForGeneration,
  type PlanningConfigStore,
} from "@/lib/planning-config-store";
import { generateMissingSlots } from "@/lib/planning-generator";

function stampGenerationSlots(
  slots: PlanningSlot[],
  generationId: string,
  cameraPresence: CameraPresenceMode,
): PlanningSlot[] {
  return slots.map((slot) => {
    const accountKey = slot.accountIds?.length
      ? slot.accountIds.join("+")
      : slot.accountId;

    return {
      ...slot,
      generationId,
      cameraPresence,
      id: `gen-${generationId}-${accountKey}-${slot.date}-${slot.time.replace(":", "")}`,
      generated: true,
    };
  });
}

function generateUnifiedSlots(
  planningAccounts: PlanningAccount[],
  studioAccountIds: string[],
  dateFrom: string,
  dateTo: string,
  cameraPresence: CameraPresenceMode,
): PlanningSlot[] {
  const leadAccount = planningAccounts[0];
  const platforms = [
    ...new Set(planningAccounts.flatMap((account) => account.platforms)),
  ];
  const unifiedAccount: PlanningAccount = {
    ...leadAccount,
    platforms,
  };

  return generateMissingSlots({
    accounts: [unifiedAccount],
    dateFrom,
    dateTo,
    existingSlots: [],
    cameraPresence,
  }).map((slot) => ({
    ...slot,
    accountId: leadAccount.id,
    accountIds: studioAccountIds,
    platforms,
  }));
}

export function getActiveCalendarGeneration(
  store: PlanningConfigStore,
): CalendarGeneration | undefined {
  if (!store.activeCalendarGenerationId) return undefined;
  return store.calendarGenerations.find(
    (generation) => generation.id === store.activeCalendarGenerationId,
  );
}

export function getAllCalendarGenerationSlots(
  store: PlanningConfigStore,
): PlanningSlot[] {
  return store.calendarGenerations.flatMap((generation) => generation.slots);
}

export function getActiveCalendarGenerationSlots(
  store: PlanningConfigStore,
): PlanningSlot[] {
  return getActiveCalendarGeneration(store)?.slots ?? [];
}

export function createCalendarGeneration(
  store: PlanningConfigStore,
  input: CalendarGenerationRequest,
): CalendarGeneration | undefined {
  const {
    profileId,
    accountIds,
    dateFrom,
    dateTo,
    publishingMode,
    rhythm,
  } = input;
  const profile = resolveProfile(profileId, store.profiles);
  if (!profile) return undefined;

  const accounts = store.accounts.filter((account) =>
    accountIds.includes(account.id),
  );
  if (accounts.length === 0) return undefined;

  const production = normalizeProductionConfig({
    cameraMode: profile.settings.cameraMode ?? profile.settings.cameraPresence,
    enabledIds: profile.settings.productionEnabledIds,
    targets: profile.settings.productionTypeTargets,
    publicationTypeTargets: profile.settings.publicationTypeTargets,
  });

  const planningAccounts = buildPlanningAccountsForGeneration(
    store,
    profileId,
    accountIds,
    rhythm,
    {
      cameraMode: production.cameraMode,
      productionEnabledIds: production.enabledIds,
      productionTypeTargets: production.targets,
    },
  );
  if (planningAccounts.length === 0) return undefined;
  if (dateFrom > dateTo) return undefined;

  const cameraPresence = presenceFromCameraMode(production.cameraMode);

  const generationId = `generation:${Date.now()}`;
  const useMirrored =
    publishingMode === "mirrored" && planningAccounts.length > 1;

  const rawSlots = useMirrored
    ? generateUnifiedSlots(
        planningAccounts,
        accounts.map((account) => account.id),
        dateFrom,
        dateTo,
        cameraPresence,
      )
    : generateMissingSlots({
        accounts: planningAccounts,
        dateFrom,
        dateTo,
        existingSlots: [],
        cameraPresence,
      });

  const slots = stampGenerationSlots(rawSlots, generationId, cameraPresence);

  return {
    id: generationId,
    label: formatCalendarGenerationLabel(
      profile,
      accounts,
      dateFrom,
      dateTo,
    ),
    createdAt: new Date().toISOString(),
    profileId,
    accountIds: accounts.map((account) => account.id),
    dateFrom,
    dateTo,
    publishingMode: useMirrored ? "mirrored" : "independent",
    cameraMode: production.cameraMode,
    productionEnabledIds: production.enabledIds,
    productionTypeTargets: production.targets,
    cameraPresence,
    rhythm,
    slots,
  };
}
