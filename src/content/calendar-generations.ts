import type { CameraMode, CameraPresenceMode } from "@/content/camera-presence";
import { cameraModeFromPresence, presenceFromCameraMode } from "@/content/camera-presence";
import type {
  ProductionConfig,
  ProductionOptionId,
} from "@/content/production-options";
import { normalizeProductionConfig } from "@/content/production-options";
import type { PlanningSlot } from "@/content/planned-slots";
import type { PlanningStudioAccount } from "@/content/planning-studio-accounts";
import type { PlanningProfile } from "@/content/planning-profiles";
import {
  DEFAULT_PLANNING_RHYTHM,
  formatPlanningRhythmSummary,
  type PlanningRhythm,
} from "@/content/planning-rhythm";
import { cameraPresenceShortLabel } from "@/content/camera-presence";
import { normalizeRoleId } from "@/content/content-roles";
import { parseIsoDate, toIsoDate } from "@/lib/planning-dates";

export type CalendarGenerationRhythm = PlanningRhythm;

export type CalendarPublishingMode = "mirrored" | "independent";

export type CalendarGenerationRangePreset =
  | "rest-of-month"
  | "next-two-months"
  | "custom";

export type CalendarGenerationRequest = {
  profileId: string;
  accountIds: string[];
  dateFrom: string;
  dateTo: string;
  publishingMode: CalendarPublishingMode;
  rhythm: CalendarGenerationRhythm;
  production: ProductionConfig;
};

export type CalendarGeneration = {
  id: string;
  label: string;
  createdAt: string;
  profileId: string;
  accountIds: string[];
  dateFrom: string;
  dateTo: string;
  publishingMode: CalendarPublishingMode;
  cameraMode: CameraMode;
  productionEnabledIds: ProductionOptionId[];
  productionTypeTargets: Partial<Record<ProductionOptionId, number>>;
  /** Legacy snapshot. */
  publicationTypeTargets?: Partial<Record<string, number>>;
  /** Derivado de `cameraMode`; se conserva en slots generados. */
  cameraPresence: CameraPresenceMode;
  rhythm: CalendarGenerationRhythm;
  /** Slots congelados al generar — no se recalculan solos. */
  slots: PlanningSlot[];
};

export const CALENDAR_GENERATION_RANGE_PRESETS: {
  id: CalendarGenerationRangePreset;
  label: string;
  description: string;
}[] = [
  {
    id: "rest-of-month",
    label: "Resto del mes",
    description: "Desde hoy hasta fin de mes",
  },
  {
    id: "next-two-months",
    label: "Próximos 2 meses",
    description: "Desde hoy, dos meses hacia adelante",
  },
  {
    id: "custom",
    label: "Rango personalizado",
    description: "Elegí fecha de inicio y fin",
  },
];

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function resolveCalendarGenerationRange(
  preset: CalendarGenerationRangePreset,
  todayIso: string,
  customFrom?: string,
  customTo?: string,
): { dateFrom: string; dateTo: string } | undefined {
  const today = parseIsoDate(todayIso);

  switch (preset) {
    case "rest-of-month":
      return {
        dateFrom: todayIso,
        dateTo: toIsoDate(endOfMonth(today)),
      };
    case "next-two-months": {
      const end = new Date(today);
      end.setMonth(end.getMonth() + 2);
      return {
        dateFrom: todayIso,
        dateTo: toIsoDate(end),
      };
    }
    case "custom":
      if (!customFrom || !customTo || customFrom > customTo) return undefined;
      return { dateFrom: customFrom, dateTo: customTo };
    default:
      return undefined;
  }
}

export function formatCalendarGenerationDateRange(
  dateFrom: string,
  dateTo: string,
): string {
  const from = parseIsoDate(dateFrom);
  const to = parseIsoDate(dateTo);
  const sameMonth =
    from.getMonth() === to.getMonth() &&
    from.getFullYear() === to.getFullYear();

  if (dateFrom === dateTo) {
    return from.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
    });
  }

  if (sameMonth) {
    return `${from.getDate()}–${to.getDate()} ${from.toLocaleDateString("es-AR", { month: "short" })}`;
  }

  const fromLabel = from.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });
  const toLabel = to.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });
  return `${fromLabel} – ${toLabel}`;
}

export function normalizeCalendarGeneration(
  generation: Partial<CalendarGeneration> & {
    id: string;
    label: string;
    slots: PlanningSlot[];
    accountIds: string[];
    profileId: string;
    createdAt: string;
  },
): CalendarGeneration {
  const sortedDates = generation.slots.map((slot) => slot.date).sort();
  const dateFrom =
    generation.dateFrom ?? sortedDates[0] ?? toIsoDate(new Date());
  const dateTo =
    generation.dateTo ??
    sortedDates[sortedDates.length - 1] ??
    dateFrom;

  const cameraMode =
    generation.cameraMode ??
    cameraModeFromPresence(generation.cameraPresence ?? "off-camera");
  const production = normalizeProductionConfig({
    cameraMode,
    enabledIds: generation.productionEnabledIds,
    targets: generation.productionTypeTargets,
    publicationTypeTargets: generation.publicationTypeTargets,
  });

  return {
    id: generation.id,
    label: generation.label,
    createdAt: generation.createdAt,
    profileId: generation.profileId,
    accountIds: generation.accountIds,
    dateFrom,
    dateTo,
    publishingMode: generation.publishingMode ?? "independent",
    cameraMode: production.cameraMode,
    productionEnabledIds: production.enabledIds,
    productionTypeTargets: production.targets,
    publicationTypeTargets: production.targets,
    cameraPresence:
      generation.cameraPresence ?? presenceFromCameraMode(production.cameraMode),
    rhythm: generation.rhythm ?? DEFAULT_PLANNING_RHYTHM,
    slots: generation.slots.map((slot) => ({
      ...slot,
      roleId: normalizeRoleId(slot.roleId),
      cameraPresence:
        slot.cameraPresence ?? generation.cameraPresence ?? "off-camera",
    })),
  };
}

export function formatCalendarGenerationLabel(
  profile: PlanningProfile,
  accounts: PlanningStudioAccount[],
  dateFrom: string,
  dateTo: string,
): string {
  const range = formatCalendarGenerationDateRange(dateFrom, dateTo);
  if (accounts.length === 0) return `${profile.label} · ${range}`;
  if (accounts.length === 1) {
    return `${profile.label} · ${accounts[0].displayName} · ${range}`;
  }
  return `${profile.label} · ${accounts.length} cuentas · ${range}`;
}

export function formatCalendarGenerationMeta(
  generation: CalendarGeneration,
  slotCount?: number,
): string {
  const count = slotCount ?? generation.slots.length;
  const range = formatCalendarGenerationDateRange(
    generation.dateFrom,
    generation.dateTo,
  );
  const mode =
    generation.publishingMode === "mirrored" && generation.accountIds.length > 1
      ? " · unificada"
      : "";
  const camera = ` · ${cameraPresenceShortLabel(generation.cameraPresence)}`;
  const rhythm = ` · ${formatPlanningRhythmSummary(generation.rhythm)}`;
  return `${count} slots · ${range}${mode}${camera}${rhythm}`;
}
