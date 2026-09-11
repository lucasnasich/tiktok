import { Playground } from "@/components/AppShell";
import { StudioOnboarding } from "@/components/home/StudioOnboarding";
import { useStudioOnboarding } from "@/hooks/use-studio-onboarding";

export function HomeScreen() {
  const { progress, markManualStepDone } = useStudioOnboarding();

  return (
    <Playground
      title="Inicio"
      meta={
        progress.allComplete
          ? "Flujo completo"
          : `${progress.completedCount}/${progress.totalCount} pasos`
      }
    >
      <StudioOnboarding
        progress={progress}
        onMarkManualDone={markManualStepDone}
      />
    </Playground>
  );
}
