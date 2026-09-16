import type { PlanningAccount } from "@/content/planning-accounts";
import {
  DEFAULT_ACTIVE_DAYS,
  DEFAULT_TIME_SLOTS,
} from "@/content/planning-defaults";

export type PlanningRhythm = {
  postsPerDay: number;
  activeDays: number[];
  timeSlots: string[];
};

export const DEFAULT_PLANNING_RHYTHM: PlanningRhythm = {
  postsPerDay: 3,
  activeDays: [...DEFAULT_ACTIVE_DAYS],
  timeSlots: [...DEFAULT_TIME_SLOTS],
};

export const RHYTHM_COPY = {
  postsPerDay:
    "Cuántas piezas únicas por día. Una pieza puede salir en TikTok + IG a la vez — no cuenta doble.",
  activeDays:
    "Días en que publicás en este período. Podés dejar domingo libre si el público no está activo.",
  timeSlots:
    "Horarios editoriales posibles. Si elegís más horarios que piezas por día, el motor rota cuál queda fuera cada día para que todos se usen a lo largo de la semana.",
};

export function isPlanningRhythmComplete(rhythm: PlanningRhythm): boolean {
  return (
    rhythm.postsPerDay > 0 &&
    rhythm.activeDays.length > 0 &&
    rhythm.timeSlots.length > 0
  );
}

export function applyRhythmToPlanningAccount(
  account: PlanningAccount,
  rhythm: PlanningRhythm,
): PlanningAccount {
  return {
    ...account,
    postsPerDay: rhythm.postsPerDay,
    activeDays: [...rhythm.activeDays],
    timeSlots: [...rhythm.timeSlots],
  };
}

export function formatPlanningRhythmSummary(rhythm: PlanningRhythm): string {
  const dayCount = rhythm.activeDays.length;
  const dayLabel = dayCount === 7 ? "todos los días" : `${dayCount} días/sem`;
  return `${rhythm.postsPerDay}/día · ${dayLabel}`;
}
