export const PLANNING_MODE = {
  calendar: {
    id: "calendar",
    label: "Calendario",
  },
  config: {
    id: "config",
    label: "Configuración",
  },
} as const;

export type PlanningModeId =
  (typeof PLANNING_MODE)[keyof typeof PLANNING_MODE]["id"];
