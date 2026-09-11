import { PlanningAccountForm } from "@/components/planning/PlanningAccountForm";
import { StudioSheet } from "@/components/studio/StudioSheet";
import type { PlanningStudioAccount } from "@/content/planning-studio-accounts";

type PlanningAccountSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: PlanningStudioAccount;
  onSave: (account: PlanningStudioAccount) => void;
};

export function PlanningAccountSheet({
  open,
  onOpenChange,
  initial,
  onSave,
}: PlanningAccountSheetProps) {
  const isEdit = Boolean(initial);

  return (
    <StudioSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Editar cuenta" : "Agregar cuenta"}
      description="Nombre público y @ en cada red donde publicás."
    >
      <PlanningAccountForm
        key={initial?.id ?? "create"}
        embedded
        initial={initial}
        onSave={(account) => {
          onSave(account);
          onOpenChange(false);
        }}
        onCancel={() => onOpenChange(false)}
      />
    </StudioSheet>
  );
}
