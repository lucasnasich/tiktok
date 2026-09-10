import { useMemo } from "react";

import { Playground } from "@/components/AppShell";
import { IdeasBoard } from "@/components/ideas/IdeasBoard";
import { plannedSlots } from "@/content/planned-slots";
import { useIdeas } from "@/hooks/use-ideas";
import { usePlanningConfig } from "@/hooks/use-planning-config";
import { getPlanningHorizonSlots } from "@/lib/planning-generator";
import { toIsoDate } from "@/lib/planning-dates";

export function IdeasScreen() {
  const { accounts } = usePlanningConfig();
  const { ideas } = useIdeas();
  const todayIso = toIsoDate(new Date());
  const slots = useMemo(
    () => getPlanningHorizonSlots(plannedSlots, accounts, todayIso),
    [accounts, todayIso],
  );

  return (
    <Playground title="Ideas" meta={`${ideas.length}`}>
      <IdeasBoard slots={slots} todayIso={todayIso} />
    </Playground>
  );
}
