import { PlanningSetupWizard } from "@/components/planning/PlanningSetupWizard";
import { StudioSheet } from "@/components/studio/StudioSheet";
import type { PlanningAccount } from "@/content/planning-accounts";
import type { PlanningProfile } from "@/content/planning-profiles";
import type { PlanningWizardSession } from "@/lib/planning-wizard-session";
import { wizardSessionKey } from "@/lib/planning-wizard-session";

type PlanningProfileWizardSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProfileId?: string;
  getProfile: (profileId: string) => PlanningProfile | undefined;
  getWizardSession: (sessionKey: string) => PlanningWizardSession | undefined;
  persistWizardDraft: (session: PlanningWizardSession) => void;
  clearWizardSession: (sessionKey: string) => void;
  onSave: (
    account: PlanningAccount,
    options: { profileLabel: string; profileId?: string },
  ) => void;
  onComplete: () => void;
};

export function PlanningProfileWizardSheet({
  open,
  onOpenChange,
  initialProfileId,
  getProfile,
  getWizardSession,
  persistWizardDraft,
  clearWizardSession,
  onSave,
  onComplete,
}: PlanningProfileWizardSheetProps) {
  const isEdit = Boolean(initialProfileId);
  const sheetKey = initialProfileId ?? "new-profile";

  return (
    <StudioSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Editar perfil editorial" : "Crear perfil editorial"}
      description="Ritmo, roles, temas por rol, tipos de publicación y restricciones de producción. Sin elegir cuentas acá."
    >
      {open ? (
        <PlanningSetupWizard
          key={sheetKey}
          embedded
          initialProfileId={initialProfileId}
          getProfile={getProfile}
          getWizardSession={getWizardSession}
          persistWizardDraft={persistWizardDraft}
          onSave={onSave}
          onComplete={() => {
            clearWizardSession(wizardSessionKey(initialProfileId));
            onComplete();
            onOpenChange(false);
          }}
        />
      ) : null}
    </StudioSheet>
  );
}
