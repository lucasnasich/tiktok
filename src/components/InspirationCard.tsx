import { MarkdownContent } from "@/components/MarkdownContent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BRAIN_WORKFLOW_DETAILS,
  INSPIRATION_WORKFLOW_DETAILS,
} from "@/content/workflow-steps";

export function InspirationCard() {
  return (
    <Accordion
      type="multiple"
      className="rounded-lg border border-border bg-card px-4"
    >
      <AccordionItem value="inspiracion" className="border-border">
        <AccordionTrigger className="py-3.5 text-[14px] hover:no-underline">
          <span className="flex min-w-0 flex-col items-start gap-0.5 pr-2 text-left">
            <span className="font-medium text-foreground">Inspiración</span>
            <span className="text-[13px] font-normal text-muted-foreground">
              Fuente paralela — Referencias y Competidores alimentan Idea.
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="text-[14px] text-muted-foreground">
          <MarkdownContent content={INSPIRATION_WORKFLOW_DETAILS} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="brain" className="border-border">
        <AccordionTrigger className="py-3.5 text-[14px] hover:no-underline">
          <span className="flex min-w-0 flex-col items-start gap-0.5 pr-2 text-left">
            <span className="font-medium text-foreground">Mercantis Brain</span>
            <span className="text-[13px] font-normal text-muted-foreground">
              Contexto real de la empresa — no es un paso del pipeline.
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="text-[14px] text-muted-foreground">
          <MarkdownContent content={BRAIN_WORKFLOW_DETAILS} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
