import { useMemo } from "react";

import { Playground } from "@/components/AppShell";
import { ProposalsBoard } from "@/components/proposals/ProposalsBoard";
import { plannedSlots } from "@/content/planned-slots";
import { useProposals } from "@/hooks/use-proposals";
import { usePlanningConfig } from "@/hooks/use-planning-config";
import { getPlanningHorizonSlots } from "@/lib/planning-generator";
import { toIsoDate } from "@/lib/planning-dates";

export function ProposalsScreen() {
  const { accounts } = usePlanningConfig();
  const { proposals } = useProposals();
  const todayIso = toIsoDate(new Date());
  const slots = useMemo(
    () => getPlanningHorizonSlots(plannedSlots, accounts, todayIso),
    [accounts, todayIso],
  );

  return (
    <Playground title="Propuestas" meta={`${proposals.length}`}>
      <ProposalsBoard slots={slots} todayIso={todayIso} />
    </Playground>
  );
}
