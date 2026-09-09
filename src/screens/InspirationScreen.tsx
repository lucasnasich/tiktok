import { LayoutGrid, ScanEye } from "lucide-react";

import { Playground } from "@/components/AppShell";
import { InspirationPanel } from "@/components/ideas/InspirationPanel";
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
                <LayoutGrid className="size-3.5" strokeWidth={1.75} />
                {INSPIRATION_VIEW.listado.label}
              </TabsTrigger>
              <TabsTrigger value={INSPIRATION_VIEW.revisar.id} className="gap-1.5 px-2.5 text-xs">
                <ScanEye className="size-3.5" strokeWidth={1.75} />
                {INSPIRATION_VIEW.revisar.label}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <InspirationSourceFilter
            value={activeSource}
            onChange={setActiveSource}
          />
        </div>
      }
    >
      <div className="px-5 py-8">
        <InspirationPanel
          activeSource={activeSource}
          view={view}
        />
      </div>
    </Playground>
  );
}
