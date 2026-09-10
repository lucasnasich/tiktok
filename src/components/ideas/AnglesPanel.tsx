import type { Icon } from "@phosphor-icons/react";
import {
  ArrowsLeftRightIcon,
  BookOpenIcon,
  FlameIcon,
  GraduationCapIcon,
  HeartBreakIcon,
  RocketIcon,
  SparkleIcon,
  WarningIcon,
} from "@phosphor-icons/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { angles } from "@/content/angles";

const ANGLE_ICONS: Record<string, Icon> = {
  dolor: HeartBreakIcon,
  error: WarningIcon,
  oportunidad: SparkleIcon,
  comparacion: ArrowsLeftRightIcon,
  polemico: FlameIcon,
  storytelling: BookOpenIcon,
  educativo: GraduationCapIcon,
  aspiracional: RocketIcon,
};

export function AnglesPanel() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {angles.map((angle) => {
        const IconComponent = ANGLE_ICONS[angle.id];

        return (
          <Card key={angle.id} size="sm" className="ring-border/80">
            <CardHeader className="gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground">
                <IconComponent className="size-4" />
              </div>
              <CardTitle className="text-[15px] tracking-tight">{angle.label}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                {angle.summary}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
