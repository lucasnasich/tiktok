import { Playground } from "@/components/AppShell";
import { AnglesPanel } from "@/components/ideas/AnglesPanel";
import { FinalIdeasPanel } from "@/components/ideas/FinalIdeasPanel";
import { InspirationPanel } from "@/components/ideas/InspirationPanel";
import { SignalsPanel } from "@/components/ideas/SignalsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ideas } from "@/content/ideas";
import { IDEA_SCREEN_TABS } from "@/content/idea-step";

export function IdeasScreen() {
  return (
    <Tabs defaultValue="idea" className="flex h-full min-h-0 flex-1 flex-col">
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
        <TabsContent value="inspiracion" className="mt-0 pb-8">
          <InspirationPanel />
        </TabsContent>
        <TabsContent value="senales" className="mt-0 pb-8">
          <SignalsPanel />
        </TabsContent>
        <TabsContent value="angulos" className="mt-0 pb-8">
          <AnglesPanel />
        </TabsContent>
        <TabsContent value="idea" className="mt-0 pb-8">
          <FinalIdeasPanel />
        </TabsContent>
      </Playground>
    </Tabs>
  );
}
