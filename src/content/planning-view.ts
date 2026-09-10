export const PLANNING_VIEW = {
  day: {
    id: "day",
    label: "Día",
    gridColumns: 1,
  },
  fourDay: {
    id: "four-day",
    label: "4 días",
    gridColumns: 4,
  },
  week: {
    id: "week",
    label: "Semana",
    gridColumns: 7,
  },
  month: {
    id: "month",
    label: "Mes",
    gridColumns: 7,
  },
} as const;

export type PlanningViewId =
  (typeof PLANNING_VIEW)[keyof typeof PLANNING_VIEW]["id"];

export const PLANNING_VIEW_IDS = Object.values(PLANNING_VIEW).map(
  (view) => view.id,
);
