import { useCallback, useRef } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PROPOSAL_CARD_FIELDS,
  PROPOSAL_FINAL_EXAMPLE,
  PROPOSAL_FINAL_FORMULA,
  PROPOSAL_SIGNAL_EXAMPLE,
  PROPOSAL_SUBSTEPS,
  angles,
} from "@/content/proposal-step";

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

export function ProposalStepDocs() {
  const { rootRef, syncAccordionHeight } = useAccordionHeightSync();

  return (
    <div ref={rootRef} className="space-y-4">
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        El Studio prepara el SlotSpec. Cursor desarrolla las propuestas. El
        usuario elige. El Studio no genera copy.
      </p>
      <Tabs
        defaultValue={PROPOSAL_SUBSTEPS[0].id}
        className="gap-4"
        onValueChange={syncAccordionHeight}
      >
        <TabsList className="h-auto w-full flex-wrap justify-start">
          {PROPOSAL_SUBSTEPS.map((step, index) => (
            <TabsTrigger
              key={step.id}
              value={step.id}
              className="px-2.5 text-[13px] font-medium tracking-tight"
            >
              {index + 1}. {step.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="slot" className="mt-0 flex-none space-y-3">
          <p className="text-[14px] leading-relaxed text-muted-foreground">
            El flujo parte del calendario: click en un slot abre el sheet. El
            brief (cuenta, rol, pilar, formato, plataformas, fecha/hora) queda
            fijo. El spec suma inspiración, Brain e historial.
          </p>
        </TabsContent>

        <TabsContent value="fuente" className="mt-0 flex-none space-y-3">
          <p className="text-[14px] leading-relaxed text-muted-foreground">
            El camino principal es elegir una referencia recomendada. Dirección
            personalizada es escape hatch. El Brain no es una fuente: es
            contexto obligatorio de todas.
          </p>
          <blockquote className="border-l-2 border-border py-0.5 pl-4 text-[14px] leading-relaxed text-muted-foreground italic">
            “{PROPOSAL_SIGNAL_EXAMPLE}”
          </blockquote>
        </TabsContent>

        <TabsContent value="angulo" className="mt-0 flex-none space-y-3">
          <p className="text-[14px] leading-relaxed text-muted-foreground">
            Cursor elige/propone el ángulo dentro de la misión. El formato ya
            viene del slot.
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

        <TabsContent value="propuesta" className="mt-0 flex-none space-y-4">
          <div>
            <p className="mb-2 text-[13px] font-medium text-foreground">Fórmula</p>
            <p className="text-[14px] leading-relaxed text-muted-foreground">
              {PROPOSAL_FINAL_FORMULA}
            </p>
          </div>

          <blockquote className="border-l-2 border-border py-0.5 pl-4 text-[14px] leading-relaxed text-muted-foreground italic">
            {PROPOSAL_FINAL_EXAMPLE}
          </blockquote>

          <div className="border-t border-border pt-4">
            <p className="mb-2 text-[13px] font-medium text-foreground">Ficha</p>
            <p className="text-[14px] leading-relaxed text-muted-foreground">
              {PROPOSAL_CARD_FIELDS.join(" | ")}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
