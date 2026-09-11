import { Playground } from "@/components/AppShell";
import { PlanningConfigPanel } from "@/components/planning/PlanningConfigPanel";
import { usePlanningConfig } from "@/hooks/use-planning-config";

export function PlanningConfigScreen() {
  const planningConfig = usePlanningConfig();

  return (
    <Playground
      title="Configuración"
      meta="Cuentas y perfiles editoriales"
      fullWidth
      containedScroll
    >
      <PlanningConfigPanel {...planningConfig} />
    </Playground>
  );
}
