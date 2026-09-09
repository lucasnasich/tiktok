import { IdeaStepDocs } from "@/components/IdeaStepDocs";
import { MarkdownContent } from "@/components/MarkdownContent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { WORKFLOW_STEPS } from "@/content/workflow-steps";

export function WorkflowDocs() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-[15px] font-medium tracking-tight text-foreground">
          Pasos
        </h2>
        <Accordion type="multiple" className="rounded-lg border border-border bg-card px-4">
          {WORKFLOW_STEPS.map((step, index) => (
            <AccordionItem key={step.id} value={step.id} className="border-border">
              <AccordionTrigger className="py-3.5 text-[14px] hover:no-underline">
                <span className="flex min-w-0 flex-col items-start gap-0.5 pr-2 text-left">
                  <span className="font-medium text-foreground">
                    {index + 1}. {step.title}
                  </span>
                  <span className="text-[13px] font-normal text-muted-foreground">
                    {step.summary}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-[14px] text-muted-foreground">
                {step.id === "idea" ? (
                  <IdeaStepDocs />
                ) : (
                  <MarkdownContent content={step.details} />
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
