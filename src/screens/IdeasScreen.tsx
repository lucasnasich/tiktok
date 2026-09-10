import { Playground } from "@/components/AppShell";
import { AnglesPanel } from "@/components/ideas/AnglesPanel";
import { FormatsPanel } from "@/components/ideas/FormatsPanel";
import { FinalIdeasPanel } from "@/components/ideas/FinalIdeasPanel";
import { SignalsPanel } from "@/components/ideas/SignalsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ideas } from "@/content/ideas";
import { IDEA_SCREEN_TABS } from "@/content/idea-step";
import { usePersistedState } from "@/hooks/use-persisted-state";
import {
  STUDIO_PREFERENCE_DEFAULTS,
  STUDIO_PREFERENCE_KEYS,
  parseIdeasTab,
} from "@/lib/studio-preferences";

export function IdeasScreen() {
  const [activeTab, setActiveTab] = usePersistedState(
    STUDIO_PREFERENCE_KEYS.ideasTab,
    STUDIO_PREFERENCE_DEFAULTS.ideasTab,
    parseIdeasTab,
  );

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="flex h-full min-h-0 flex-1 flex-col"
    >
      <Playground
        title="Ideas"
        meta={`${ideas.length}`}
        actions={
          <TabsList>
            {IDEA_SCREEN_TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="px-2.5 text-[13px] font-medium tracking-tight"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        }
      >
        <TabsContent value="senales" className="mt-0 pb-8">
          <SignalsPanel />
        </TabsContent>
        <TabsContent value="angulos" className="mt-0 pb-8">
          <AnglesPanel />
        </TabsContent>
        <TabsContent value="formatos" className="mt-0 pb-8">
          <FormatsPanel />
        </TabsContent>
        <TabsContent value="idea" className="mt-0 pb-8">
          <FinalIdeasPanel />
        </TabsContent>
      </Playground>
    </Tabs>
  );
}
