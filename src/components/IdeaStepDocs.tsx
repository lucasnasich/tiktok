import { useCallback, useRef } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IDEA_CARD_FIELDS,
  IDEA_FINAL_EXAMPLE,
  IDEA_FINAL_FORMULA,
  IDEA_SIGNAL_EXAMPLE,
  IDEA_SUBSTEPS,
  angles,
} from "@/content/idea-step";

function useAccordionHeightSync() {
  const rootRef = useRef<HTMLDivElement>(null);

  const syncAccordionHeight = useCallback(() => {
    requestAnimationFrame(() => {
      const accordionContent = rootRef.current?.closest(
        '[data-slot="accordion-content"]',
      ) as HTMLElement | null;

      if (accordionContent) {
        accordionContent.style.height = "auto";
      }
    });
  }, []);

  return { rootRef, syncAccordionHeight };
}

export function IdeaStepDocs() {
  const { rootRef, syncAccordionHeight } = useAccordionHeightSync();

  return (
    <div ref={rootRef} className="space-y-4">
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        Capturás una señal, elegís un ángulo y armás la ficha.
      </p>
      <Tabs
        defaultValue={IDEA_SUBSTEPS[0].id}
        className="gap-4"
        onValueChange={syncAccordionHeight}
      >
        <TabsList className="h-auto w-full flex-wrap justify-start">
          {IDEA_SUBSTEPS.map((step, index) => (
            <TabsTrigger
              key={step.id}
              value={step.id}
              className="px-2.5 text-[13px] font-medium tracking-tight"
            >
              {index + 1}. {step.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="senal" className="mt-0 flex-none space-y-3">
          <p className="text-[14px] leading-relaxed text-muted-foreground">
            Una observación concreta. Algo que viste, escuchaste o leíste que
            merece un post.
          </p>
          <blockquote className="border-l-2 border-border py-0.5 pl-4 text-[14px] leading-relaxed text-muted-foreground italic">
            “{IDEA_SIGNAL_EXAMPLE}”
          </blockquote>
        </TabsContent>

        <TabsContent value="angulo" className="mt-0 flex-none space-y-3">
          <p className="text-[14px] leading-relaxed text-muted-foreground">
            Cómo vas a encarar la señal. Elegí uno:
          </p>
          <ul className="list-disc space-y-1.5 pl-5 text-[14px] leading-relaxed text-muted-foreground">
            {angles.map((angle) => (
              <li key={angle.id}>
                <span className="font-medium text-foreground">{angle.label}</span>
                {" — "}
                {angle.summary}
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="idea" className="mt-0 flex-none space-y-4">
          <div>
            <p className="mb-2 text-[13px] font-medium text-foreground">Formato</p>
            <p className="text-[14px] leading-relaxed text-muted-foreground">
              {IDEA_FINAL_FORMULA}
            </p>
          </div>

          <blockquote className="border-l-2 border-border py-0.5 pl-4 text-[14px] leading-relaxed text-muted-foreground italic">
            {IDEA_FINAL_EXAMPLE}
          </blockquote>

          <div className="border-t border-border pt-4">
            <p className="mb-2 text-[13px] font-medium text-foreground">Ficha</p>
            <p className="text-[14px] leading-relaxed text-muted-foreground">
              {IDEA_CARD_FIELDS.join(" | ")}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
