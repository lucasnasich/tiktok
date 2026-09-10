import type { ColumnCount } from "@/components/ColumnSelector";
import { inspirationGridClass } from "@/components/ideas/inspiration-layout";
import { AllInspirationsPanel } from "@/components/ideas/AllInspirationsPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClienteInspirationPanel } from "@/components/ideas/ClienteInspirationPanel";
import { CreativeInspirationPanel } from "@/components/ideas/CreativeInspirationPanel";
import { InspirationSourceFilter } from "@/components/ideas/InspirationSourceFilter";
import { InspirationSwipeDeck } from "@/components/ideas/InspirationSwipeDeck";
import { OrganicInspirationPanel } from "@/components/ideas/OrganicInspirationPanel";
import { buildInspirationFeed, isSwipeableSource } from "@/content/inspiration-feed";
import { IDEA_SOURCES, INSPIRATION_ALL_SOURCE_ID } from "@/content/idea-sources";
import {
  INSPIRATION_VIEW,
  type InspirationViewId,
} from "@/content/inspiration-view";

type InspirationPanelProps = {
  activeSource: string;
  activeFormat?: string;
  view?: InspirationViewId;
  columns: ColumnCount;
  onSourceChange?: (sourceId: string) => void;
  showSourceFilterInline?: boolean;
  onLayoutChange?: () => void;
  onOpenReference?: (key: string) => void;
};

function SourceTopicsGrid({
  sourceId,
  columns,
}: {
  sourceId: string;
  columns: ColumnCount;
}) {
  const source = IDEA_SOURCES.find((entry) => entry.id === sourceId);
  if (!source) return null;

  return (
    <div className={inspirationGridClass(columns)}>
      {source.topics.map((topic) => (
        <Card key={topic.id} size="sm" className="rounded-none p-3 ring-0">
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
  );
}

function InspirationSourceContent({
  sourceId,
  activeFormat,
  columns,
  onOpenReference,
}: {
  sourceId: string;
  activeFormat?: string;
  columns: ColumnCount;
  onOpenReference?: (key: string) => void;
}) {
  if (sourceId === INSPIRATION_ALL_SOURCE_ID) {
    return (
      <AllInspirationsPanel
        columns={columns}
        activeFormat={activeFormat}
        onOpenReference={onOpenReference}
      />
    );
  }
  if (sourceId === "cliente") {
    return (
      <ClienteInspirationPanel
        columns={columns}
        onOpenReference={onOpenReference}
      />
    );
  }
  if (sourceId === "organico") {
    return (
      <OrganicInspirationPanel
        columns={columns}
        activeFormat={activeFormat}
        onOpenReference={onOpenReference}
      />
    );
  }
  if (sourceId === "creativo") {
    return (
      <CreativeInspirationPanel
        columns={columns}
        activeFormat={activeFormat}
        onOpenReference={onOpenReference}
      />
    );
  }
  return <SourceTopicsGrid sourceId={sourceId} columns={columns} />;
}

export function InspirationPanel({
  activeSource,
  activeFormat,
  view = INSPIRATION_VIEW.listado.id,
  columns,
  onSourceChange,
  showSourceFilterInline = false,
  onLayoutChange,
  onOpenReference,
}: InspirationPanelProps) {
  const feedItems = buildInspirationFeed(activeSource, activeFormat);
  const canReview = isSwipeableSource(activeSource);
  const isReviewView = view === INSPIRATION_VIEW.revisar.id;

  if (isReviewView) {
    return (
      <div className="space-y-4 px-5 py-8">
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
    <>
      {showSourceFilterInline && onSourceChange ? (
        <div className="flex justify-end px-5 pt-5">
          <InspirationSourceFilter
            value={activeSource}
            onChange={(next) => {
              onSourceChange(next);
              onLayoutChange?.();
            }}
          />
        </div>
      ) : null}

      <InspirationSourceContent
        sourceId={activeSource}
        activeFormat={activeFormat}
        columns={columns}
        onOpenReference={onOpenReference}
      />
    </>
  );
}
