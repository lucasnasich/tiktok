import { GridFourIcon, ScanIcon } from "@phosphor-icons/react";

import { Playground } from "@/components/AppShell";
import { ColumnSelector } from "@/components/ColumnSelector";
import { InspirationPanel } from "@/components/ideas/InspirationPanel";
import { InspirationFormatFilter } from "@/components/ideas/InspirationFormatFilter";
import { InspirationSourceFilter } from "@/components/ideas/InspirationSourceFilter";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  INSPIRATION_VIEW,
  type InspirationViewId,
} from "@/content/inspiration-view";
import { usePersistedState } from "@/hooks/use-persisted-state";
import {
  STUDIO_PREFERENCE_DEFAULTS,
  STUDIO_PREFERENCE_KEYS,
  parseGridColumns,
  parseInspirationFormat,
  parseInspirationSource,
  parseInspirationView,
} from "@/lib/studio-preferences";

export function InspirationScreen() {
  const [activeSource, setActiveSource] = usePersistedState(
    STUDIO_PREFERENCE_KEYS.inspirationSource,
    STUDIO_PREFERENCE_DEFAULTS.inspirationSource,
    parseInspirationSource,
  );
  const [view, setView] = usePersistedState<InspirationViewId>(
    STUDIO_PREFERENCE_KEYS.inspirationView,
    STUDIO_PREFERENCE_DEFAULTS.inspirationView as InspirationViewId,
    (raw) => parseInspirationView(raw) as InspirationViewId | undefined,
  );
  const [columns, setColumns] = usePersistedState(
    STUDIO_PREFERENCE_KEYS.gridColumns,
    STUDIO_PREFERENCE_DEFAULTS.gridColumns,
    parseGridColumns,
  );
  const [activeFormat, setActiveFormat] = usePersistedState(
    STUDIO_PREFERENCE_KEYS.inspirationFormat,
    STUDIO_PREFERENCE_DEFAULTS.inspirationFormat,
    parseInspirationFormat,
  );

  const isListView = view === INSPIRATION_VIEW.listado.id;
  const viewMeta =
    view === INSPIRATION_VIEW.revisar.id
      ? INSPIRATION_VIEW.revisar.label
      : INSPIRATION_VIEW.listado.label;

  return (
    <Playground
      title="Inspiración"
      meta={viewMeta}
      fullWidth
      actions={
        <div className="flex items-center gap-2">
          <Tabs
            value={view}
            onValueChange={(next) => setView(next as InspirationViewId)}
          >
            <TabsList className="h-8">
              <TabsTrigger value={INSPIRATION_VIEW.listado.id} className="gap-1.5 px-2.5 text-xs">
                <GridFourIcon className="size-3.5" />
                {INSPIRATION_VIEW.listado.label}
              </TabsTrigger>
              <TabsTrigger value={INSPIRATION_VIEW.revisar.id} className="gap-1.5 px-2.5 text-xs">
                <ScanIcon className="size-3.5" />
                {INSPIRATION_VIEW.revisar.label}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {isListView ? (
            <ColumnSelector value={columns} onChange={setColumns} />
          ) : null}
          <InspirationFormatFilter
            value={activeFormat}
            onChange={setActiveFormat}
          />
          <InspirationSourceFilter
            value={activeSource}
            onChange={setActiveSource}
          />
        </div>
      }
    >
      <InspirationPanel
        activeSource={activeSource}
        activeFormat={activeFormat}
        view={view}
        columns={columns}
      />
    </Playground>
  );
}
