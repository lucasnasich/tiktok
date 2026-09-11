import { Playground } from "@/components/AppShell";
import { ProposalsBoard } from "@/components/proposals/ProposalsBoard";
import { useProposals } from "@/hooks/use-proposals";
import { usePlanningConfig } from "@/hooks/use-planning-config";
import { toIsoDate } from "@/lib/planning-dates";

export function ProposalsScreen() {
  const { allCalendarSlots: slots } = usePlanningConfig();
  const { proposals } = useProposals();
  const todayIso = toIsoDate(new Date());

  return (
    <Playground title="Propuestas" meta={`${proposals.length}`}>
      <ProposalsBoard slots={slots} todayIso={todayIso} />
    </Playground>
  );
}
