import {
  ArrowRightIcon,
  CheckCircleIcon,
  CircleIcon,
  RocketLaunchIcon,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { hrefForOnboardingStep } from "@/lib/studio-onboarding";
import type { StudioOnboardingProgress } from "@/lib/studio-onboarding";
import type { StudioOnboardingStepId } from "@/content/studio-onboarding-steps";

type StudioOnboardingProps = {
  progress: StudioOnboardingProgress;
  onMarkManualDone: (stepId: StudioOnboardingStepId) => void;
};

function StepIcon({ status }: { status: "complete" | "current" | "upcoming" }) {
  if (status === "complete") {
    return (
      <CheckCircleIcon
        className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400"
        weight="fill"
      />
    );
  }

  return (
    <CircleIcon
      className={cn(
        "size-5 shrink-0",
        status === "current"
          ? "text-foreground"
          : "text-muted-foreground/40",
      )}
      weight={status === "current" ? "bold" : "regular"}
    />
  );
}

export function StudioOnboarding({
  progress,
  onMarkManualDone,
}: StudioOnboardingProps) {
  const currentStep = progress.steps.find((step) => step.status === "current");

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <RocketLaunchIcon className="size-4" />
              <span className="text-[12px] font-medium uppercase tracking-wide">
                Primeros pasos
              </span>
            </div>
            <h2 className="text-lg font-medium tracking-tight text-foreground">
              {progress.allComplete
                ? "Flujo listo para trabajar"
                : "Armá el flujo editorial de punta a punta"}
            </h2>
            <p className="max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
              {progress.allComplete
                ? "Completaste la configuración inicial. Seguí produciendo desde Planificación y Propuestas."
                : "El Studio prepara · Cursor crea · Vos decidís y ensamblás. Completá cada paso en orden."}
            </p>
          </div>

          <div className="shrink-0 rounded-lg border border-border bg-muted/30 px-4 py-3 text-right">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Progreso
            </p>
            <p className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">
              {progress.completedCount}
              <span className="text-base font-normal text-muted-foreground">
                /{progress.totalCount}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-5">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground transition-all duration-500"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <p className="mt-2 text-[12px] text-muted-foreground">
            {progress.percent}% completado
            {currentStep ? ` · Siguiente: ${currentStep.title}` : null}
          </p>
        </div>
      </section>

      <ol className="flex flex-col gap-3">
        {progress.steps.map((step, index) => {
          const href = hrefForOnboardingStep(step, progress);
          const isCurrent = step.status === "current";

          return (
            <li key={step.id}>
              <Card
                size="sm"
                className={cn(
                  "transition-colors",
                  isCurrent && "ring-2 ring-foreground/15",
                  step.completed && "opacity-80",
                )}
              >
                <CardHeader className="pb-0">
                  <div className="flex items-start gap-3">
                    <StepIcon status={step.status} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-[15px]">
                          {index + 1}. {step.title}
                        </CardTitle>
                        {isCurrent ? (
                          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                            Ahora
                          </span>
                        ) : null}
                      </div>
                      <CardDescription className="mt-1 text-[13px] leading-relaxed">
                        {step.summary}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                {isCurrent ? (
                  <CardContent className="pt-3">
                    <p className="text-[13px] leading-relaxed text-muted-foreground">
                      {step.detail}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Button asChild size="sm">
                        <Link to={href}>
                          {step.hrefLabel}
                          <ArrowRightIcon />
                        </Link>
                      </Button>
                      {step.manual ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => onMarkManualDone(step.id)}
                        >
                          Marcar como hecho
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                ) : null}
              </Card>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
