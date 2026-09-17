import { CheckIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

export type SlotWorkflowStepId = "idea" | "inspiration" | "production";
export type SlotWorkflowStepState = "complete" | "active" | "pending";

const STEPS: Array<{ id: SlotWorkflowStepId; n: number; label: string }> = [
  { id: "idea", n: 1, label: "Idea" },
  { id: "inspiration", n: 2, label: "Inspiración" },
  { id: "production", n: 3, label: "Producción" },
];

export function SlotWorkflowStepper({
  states,
  enabled,
  onSelect,
}: {
  states: Record<SlotWorkflowStepId, SlotWorkflowStepState>;
  enabled?: Partial<Record<SlotWorkflowStepId, boolean>>;
  onSelect: (id: SlotWorkflowStepId) => void;
}) {
  return (
    <nav aria-label="Progreso del slot" className="flex flex-wrap items-center gap-1">
      {STEPS.map((step, index) => {
        const state = states[step.id];
        const clickable = enabled?.[step.id] ?? state !== "pending";
        return (
          <div key={step.id} className="flex items-center gap-1">
            {index > 0 ? (
              <span className="px-0.5 text-[11px] text-muted-foreground" aria-hidden>
                →
              </span>
            ) : null}
            <button
              type="button"
              disabled={!clickable}
              onClick={() => onSelect(step.id)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors",
                state === "active" &&
                  "bg-primary text-primary-foreground",
                state === "complete" &&
                  "bg-muted text-foreground hover:bg-muted/80",
                state === "pending" && "text-muted-foreground",
              )}
            >
              {state === "complete" ? (
                <CheckIcon className="size-3" weight="bold" />
              ) : (
                <span className="tabular-nums">{step.n}</span>
              )}
              {step.label}
            </button>
          </div>
        );
      })}
    </nav>
  );
}
