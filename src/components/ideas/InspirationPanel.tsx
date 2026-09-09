import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IDEA_SOURCE_TABS } from "@/content/idea-sources";
import { IDEA_INSPIRATION_SOURCES } from "@/content/idea-step";

type InspirationPanelProps = {
  onNestedTabChange?: () => void;
};

export function InspirationPanel({ onNestedTabChange }: InspirationPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-3 text-[14px] leading-relaxed text-muted-foreground">
          Podés sacar ideas de:
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-[14px] leading-relaxed text-muted-foreground">
          {IDEA_INSPIRATION_SOURCES.map((source) => (
            <li key={source}>{source}</li>
          ))}
        </ul>
      </div>

      <div className="border-t border-border pt-4">
        <p className="mb-3 text-[13px] font-medium text-foreground">
          Detalle por fuente
        </p>
        <Tabs
          defaultValue={IDEA_SOURCE_TABS[0].id}
          className="gap-3"
          onValueChange={onNestedTabChange}
        >
          <TabsList className="h-auto w-full flex-wrap justify-start">
            {IDEA_SOURCE_TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="px-2.5 text-[13px] font-medium tracking-tight"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {IDEA_SOURCE_TABS.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0 flex-none">
              <ul className="list-disc space-y-1.5 pl-5 text-[14px] leading-relaxed text-muted-foreground">
                {tab.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
