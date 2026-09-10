export type IdeaSourceType = "inspiration" | "brain" | "manual";

export type IdeaStatus = "candidate" | "selected" | "in-copy";

export type Idea = {
  id: string;
  planSlotId: string;
  sourceType: IdeaSourceType;
  sourceRef?: string;
  signal?: string;
  angleId: string;
  concept: string;
  hook: string;
  brainRefs?: string[];
  status: IdeaStatus;
};

export const IDEA_SOURCE_TYPE_LABELS: Record<IdeaSourceType, string> = {
  inspiration: "Inspiración",
  brain: "Mercantis Brain",
  manual: "Manual",
};

export const IDEA_STATUS_LABELS: Record<IdeaStatus, string> = {
  candidate: "Candidata",
  selected: "Seleccionada",
  "in-copy": "En copy",
};

export const ideas: Idea[] = [];
