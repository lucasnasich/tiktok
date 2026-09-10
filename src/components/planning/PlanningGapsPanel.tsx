import {
  ArrowsClockwiseIcon,
  CircleDashedIcon,
  WarningIcon,
} from "@phosphor-icons/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PlanningInsight } from "@/lib/planning";
import { cn } from "@/lib/utils";

const INSIGHT_STYLES = {
  gap: {
    icon: CircleDashedIcon,
    className: "text-amber-700 dark:text-amber-400",
  },
  variety: {
    icon: ArrowsClockwiseIcon,
    className: "text-sky-700 dark:text-sky-400",
  },
  warning: {
    icon: WarningIcon,
    className: "text-rose-700 dark:text-rose-400",
  },
} as const;

export function PlanningGapsPanel({ insights }: { insights: PlanningInsight[] }) {
  return (
    <Card size="sm" className="ring-border/80">
      <CardHeader className="gap-1">
        <CardTitle className="text-[15px] tracking-tight">Qué falta</CardTitle>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Brechas vs. targets y señales de variedad para la semana.
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        {insights.length === 0 ? (
          <p className="text-[13px] text-muted-foreground">
            El calendario está alineado con los targets de esta semana.
          </p>
        ) : (
          <ul className="space-y-2">
            {insights.map((insight) => {
              const style = INSIGHT_STYLES[insight.kind];
              const Icon = style.icon;

              return (
                <li
                  key={insight.id}
                  className="flex items-start gap-2 text-[13px] leading-relaxed text-foreground"
                >
                  <Icon
                    className={cn("mt-0.5 size-4 shrink-0", style.className)}
                    aria-hidden
                  />
                  <span>{insight.message}</span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
