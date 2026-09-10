import { PageStack } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ideas, type Idea, type IdeaStatus } from "@/content/ideas";
import { getSourceLabel } from "@/content/idea-sources";
import { IDEA_CARD_FIELDS } from "@/content/idea-step";

const STATUS: Record<IdeaStatus, string> = {
  captura: "Captura",
  "en-copy": "En copy",
  lista: "Lista",
};

function getFieldValue(idea: Idea, field: string) {
  switch (field) {
    case "Fuente":
      return getSourceLabel(idea.sourceId);
    case "Señal":
      return idea.signal;
    case "Ángulo":
      return idea.angulo;
    case "Público":
      return idea.publico;
    case "Formato":
      return idea.formato;
    case "Idea/Hook":
      return idea.hook;
    default:
      return "";
  }
}

export function FinalIdeasPanel() {
  if (ideas.length === 0) {
    return (
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        Todavía no hay ideas armadas.
      </p>
    );
  }

  return (
    <PageStack>
      {ideas.map((idea) => (
        <Card key={idea.id} size="sm" className="ring-border/80">
          <CardHeader>
            <CardTitle className="text-[15px] tracking-tight">{idea.hook}</CardTitle>
            <CardAction>
              <Badge variant="secondary" className="text-[11px]">
                {STATUS[idea.status]}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="pt-0">
            <dl className="grid gap-2 sm:grid-cols-2">
              {IDEA_CARD_FIELDS.map((field) => (
                <div key={field} className="min-w-0">
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {field}
                  </dt>
                  <dd className="mt-0.5 text-[13px] leading-relaxed text-foreground">
                    {getFieldValue(idea, field)}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      ))}
    </PageStack>
  );
}
