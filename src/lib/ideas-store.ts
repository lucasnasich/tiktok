import {
  ideas as seedIdeas,
  type Idea,
  type IdeaSourceType,
  type IdeaStatus,
} from "@/content/ideas";

const SOURCE_TYPES: IdeaSourceType[] = ["inspiration", "brain", "manual"];
const STATUSES: IdeaStatus[] = ["candidate", "selected", "in-copy"];

function isIdea(value: unknown): value is Idea {
  if (!value || typeof value !== "object") return false;
  const idea = value as Partial<Idea>;
  return (
    typeof idea.id === "string" &&
    typeof idea.planSlotId === "string" &&
    typeof idea.sourceType === "string" &&
    SOURCE_TYPES.includes(idea.sourceType) &&
    typeof idea.angleId === "string" &&
    typeof idea.concept === "string" &&
    typeof idea.hook === "string" &&
    typeof idea.status === "string" &&
    STATUSES.includes(idea.status)
  );
}

export function parseIdeas(raw: unknown): Idea[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const parsed = raw.filter(isIdea);
  return parsed;
}

export function createIdeaId(): string {
  return `idea-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const SEED_IDEAS: Idea[] = seedIdeas;

export function ideasForSlot(ideas: Idea[], planSlotId: string): Idea[] {
  return ideas.filter((idea) => idea.planSlotId === planSlotId);
}

export function selectedIdeaForSlot(
  ideas: Idea[],
  planSlotId: string,
): Idea | undefined {
  return ideas.find(
    (idea) =>
      idea.planSlotId === planSlotId &&
      (idea.status === "selected" || idea.status === "in-copy"),
  );
}

export function selectIdeaInList(ideas: Idea[], ideaId: string): Idea[] {
  const target = ideas.find((idea) => idea.id === ideaId);
  if (!target) return ideas;
  return ideas.map((idea) => {
    if (idea.id === ideaId) {
      return { ...idea, status: "selected" as const };
    }
    if (
      idea.planSlotId === target.planSlotId &&
      (idea.status === "selected" || idea.status === "in-copy")
    ) {
      return { ...idea, status: "candidate" as const };
    }
    return idea;
  });
}
