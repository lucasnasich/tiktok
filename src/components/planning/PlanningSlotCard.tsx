import { Link } from "react-router-dom";

import { getAngleLabel } from "@/content/angles";
import { getContentRoleLabel } from "@/content/content-roles";
import { getFormatLabel } from "@/content/formats";
import { getPlanningAccountLabel } from "@/content/planning-accounts";
import { getPlanningPillarLabel } from "@/content/planning-pillars";
import {
  DISTRIBUTION_TYPE_LABELS,
  PLANNING_SLOT_STATUS_LABELS,
  getSlotDistributionType,
  type PlanningSlot,
} from "@/content/planned-slots";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIdeas } from "@/hooks/use-ideas";
import { selectedIdeaForSlot } from "@/lib/ideas-store";
import { cn } from "@/lib/utils";

const ROLE_BADGE_CLASS: Record<string, string> = {
  alcance: "bg-violet-500/15 text-violet-800 dark:text-violet-300",
  valor: "bg-sky-500/15 text-sky-800 dark:text-sky-300",
  prueba: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
  conversion: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  marca: "bg-rose-500/15 text-rose-800 dark:text-rose-300",
  comunidad: "bg-fuchsia-500/15 text-fuchsia-800 dark:text-fuchsia-300",
};

const PLATFORM_LABELS: Record<string, string> = {
  tiktok: "TikTok",
  instagram: "IG",
};

export function PlanningSlotCard({ slot }: { slot: PlanningSlot }) {
  const { ideas } = useIdeas();
  const selected = selectedIdeaForSlot(ideas, slot.id);
  const distributionType = getSlotDistributionType(slot);

  return (
    <Card size="sm" className="ring-border/80">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant="secondary"
            className={cn(
              "border-0 text-[11px] font-medium",
              ROLE_BADGE_CLASS[slot.roleId],
            )}
          >
            {getContentRoleLabel(slot.roleId)}
          </Badge>
          <Badge variant="outline" className="text-[11px]">
            {PLANNING_SLOT_STATUS_LABELS[slot.status]}
          </Badge>
          {distributionType !== "organic" ? (
            <Badge variant="outline" className="text-[11px]">
              {DISTRIBUTION_TYPE_LABELS[distributionType]}
            </Badge>
          ) : null}
        </div>
        <CardTitle className="text-[14px] leading-snug tracking-tight">
          {getPlanningPillarLabel(slot.pillarId)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <p className="text-[12px] text-muted-foreground">
          {slot.time} · {getPlanningAccountLabel(slot.accountId)} ·{" "}
          {slot.platforms.map((p) => PLATFORM_LABELS[p] ?? p).join(" + ")}
          {slot.generated ? " · auto" : ""}
        </p>
        <p className="text-[13px] leading-relaxed text-foreground">
          {getFormatLabel(slot.formatId)}
          {slot.angleId ? ` · ${getAngleLabel(slot.angleId)}` : ""}
        </p>
        {selected ? (
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            Idea: {selected.hook}
          </p>
        ) : null}
        {slot.postId ? (
          <p className="text-[11px] font-medium text-muted-foreground">
            Post: {slot.postId}
          </p>
        ) : null}
        {slot.notes ? (
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            {slot.notes}
          </p>
        ) : null}
        <Button asChild size="sm" variant="outline" className="h-7 text-xs">
          <Link to={`/ideas?slot=${encodeURIComponent(slot.id)}`}>
            {selected ? "Ver ideas" : "Crear idea"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
