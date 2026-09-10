export type IdeaStatus = "captura" | "en-copy" | "lista";

export type Idea = {
  id: string;
  sourceId: string;
  signal: string;
  angulo: string;
  publico: string;
  formato: string;
  hook: string;
  status: IdeaStatus;
};

export const ideas: Idea[] = [];
