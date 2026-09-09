import { INSPIRATION_CONTAINER_CLASS, INSPIRATION_GRID_CLASS } from "@/components/ideas/inspiration-layout";
import { AllInspirationsPanel } from "@/components/ideas/AllInspirationsPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClienteInspirationPanel } from "@/components/ideas/ClienteInspirationPanel";
import { CreativeInspirationPanel } from "@/components/ideas/CreativeInspirationPanel";
import { InspirationSourceFilter } from "@/components/ideas/InspirationSourceFilter";
import { InspirationSwipeDeck } from "@/components/ideas/InspirationSwipeDeck";
import { OrganicInspirationPanel } from "@/components/ideas/OrganicInspirationPanel";
import {
  buildInspirationFeed,
  getInspirationSourceSummary,
  isSwipeableSource,
} from "@/content/inspiration-feed";
import { IDEA_SOURCES, INSPIRATION_ALL_SOURCE_ID } from "@/content/idea-sources";
import {
  INSPIRATION_VIEW,
  type InspirationViewId,
} from "@/content/inspiration-view";

type InspirationPanelProps = {
  activeSource: string;
  view?: InspirationViewId;
  onSourceChange?: (sourceId: string) => void;
  showSourceFilterInline?: boolean;
  onLayoutChange?: () => void;
};

function SourceTopicsGrid({ sourceId }: { sourceId: string }) {
  const source = IDEA_SOURCES.find((entry) => entry.id === sourceId);
  if (!source) return null;

  return (
    <div className={INSPIRATION_CONTAINER_CLASS}>
      <div className={INSPIRATION_GRID_CLASS}>
        {source.topics.map((topic) => (
          <Card key={topic.id} size="sm" className="ring-border/80">
            <CardHeader>
              <CardTitle className="text-[15px] tracking-tight">{topic.label}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                {topic.summary}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function InspirationSourceContent({ sourceId }: { sourceId: string }) {
  if (sourceId === INSPIRATION_ALL_SOURCE_ID) return <AllInspirationsPanel />;
  if (sourceId === "cliente") return <ClienteInspirationPanel />;
  if (sourceId === "organico") return <OrganicInspirationPanel />;
  if (sourceId === "creativo") return <CreativeInspirationPanel />;
  return <SourceTopicsGrid sourceId={sourceId} />;
}

export function InspirationPanel({
  activeSource,
  view = INSPIRATION_VIEW.listado.id,
  onSourceChange,
  showSourceFilterInline = false,
  onLayoutChange,
}: InspirationPanelProps) {
  const summary = getInspirationSourceSummary(activeSource);
  const feedItems = buildInspirationFeed(activeSource);
  const canReview = isSwipeableSource(activeSource);
  const isReviewView = view === INSPIRATION_VIEW.revisar.id;

  if (isReviewView) {
    return (
      <div className="space-y-4">
        {showSourceFilterInline && onSourceChange ? (
          <div className="flex justify-end">
            <InspirationSourceFilter
              value={activeSource}
              onChange={(next) => {
                onSourceChange(next);
                onLayoutChange?.();
              }}
            />
          </div>
        ) : null}

        <p className="text-[14px] leading-relaxed text-muted-foreground">
          {canReview
            ? INSPIRATION_VIEW.revisar.description
            : "Esta fuente no tiene referencias guardadas para revisar."}
        </p>

        {canReview ? <InspirationSwipeDeck items={feedItems} /> : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showSourceFilterInline && onSourceChange ? (
        <div className="flex justify-end">
          <InspirationSourceFilter
            value={activeSource}
            onChange={(next) => {
              onSourceChange(next);
              onLayoutChange?.();
            }}
          />
        </div>
      ) : null}

      <p className="text-[14px] leading-relaxed text-muted-foreground">
        {summary}
      </p>

      <InspirationSourceContent sourceId={activeSource} />
    </div>
  );
}
