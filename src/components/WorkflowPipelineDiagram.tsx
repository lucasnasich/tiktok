import { CaretRightIcon } from "@phosphor-icons/react";

import { WORKFLOW_STEPS } from "@/content/workflow-steps";
import { cn } from "@/lib/utils";

export function WorkflowPipelineDiagram() {
  return (
    <div className="mb-4 rounded-xl border border-border bg-card p-5">
      <div className="overflow-x-auto pb-1">
        <div
          className="mx-auto flex min-w-max items-center justify-center"
          role="img"
          aria-label={`Pipeline: ${WORKFLOW_STEPS.map((step) => step.title).join(", ")}`}
        >
          {WORKFLOW_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex min-w-[4.25rem] flex-col items-center rounded-lg border border-border bg-muted/40 px-2 py-2",
                    step.id === "propuestas" && "ring-1 ring-foreground/15",
                  )}
                >
                  <span
                    className="mb-1 flex size-5 items-center justify-center rounded-full bg-foreground text-[9px] font-semibold tabular-nums text-background"
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <span className="text-center text-[11px] font-medium leading-tight text-foreground">
                    {step.title}
                  </span>
                </div>
              </div>

              {index < WORKFLOW_STEPS.length - 1 ? (
                <CaretRightIcon
                  className="mx-1 size-4 shrink-0 text-muted-foreground/35"
                  aria-hidden
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-center text-[12px] leading-relaxed text-muted-foreground">
        El Studio prepara el spec. Cursor desarrolla. El usuario elige y ensambla.
        Mercantis Brain es contexto obligatorio — no un paso del pipeline.
      </p>
    </div>
  );
}
