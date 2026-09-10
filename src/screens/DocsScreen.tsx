import { Playground } from "@/components/AppShell";
import { MarkdownContent } from "@/components/MarkdownContent";
import { MercantisBrainDocs } from "@/components/MercantisBrainDocs";
import { WorkflowDocs } from "@/components/WorkflowDocs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import agente from "../../docs/agente.md?raw";
import integraciones from "../../docs/integraciones.md?raw";
import proyecto from "../../docs/proyecto.md?raw";

const MARKDOWN_TABS = [
  { id: "proyecto", label: "Proyecto", content: proyecto },
  { id: "integraciones", label: "Integraciones", content: integraciones },
  { id: "agente", label: "Agente", content: agente },
] as const;

export function DocsScreen() {
  return (
    <Tabs defaultValue="workflow" className="flex h-full min-h-0 flex-1 flex-col">
      <Playground
        title="Documentación"
        actions={
          <TabsList>
            <TabsTrigger
              value="workflow"
              className="px-2.5 text-[13px] font-medium tracking-tight"
            >
              Workflow
            </TabsTrigger>
            <TabsTrigger
              value="mercantis"
              className="px-2.5 text-[13px] font-medium tracking-tight"
            >
              Mercantis
            </TabsTrigger>
            {MARKDOWN_TABS.map((tab) => (
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
        <TabsContent value="workflow" className="mt-0 pb-8">
          <article>
            <WorkflowDocs />
          </article>
        </TabsContent>
        <TabsContent value="mercantis" className="mt-0 pb-8">
          <MercantisBrainDocs />
        </TabsContent>
        {MARKDOWN_TABS.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-0 pb-8">
            <article>
              <MarkdownContent content={tab.content} />
            </article>
          </TabsContent>
        ))}
      </Playground>
    </Tabs>
  );
}
