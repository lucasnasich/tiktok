import { useState } from "react";

import { PlanningAccountSheet } from "@/components/planning/PlanningAccountSheet";
import { PlanningProfileWizardSheet } from "@/components/planning/PlanningProfileWizardSheet";
import { PlanningProfilesPanel } from "@/components/planning/PlanningProfilesPanel";
import { resolveProfile } from "@/content/planning-profiles";
import type { PlanningConfigApi } from "@/hooks/use-planning-config";

type PlanningConfigPanelProps = PlanningConfigApi;

export function PlanningConfigPanel({
  studioAccounts,
  profiles,
  saveAccountAsProfile,
  markSetupCompleted,
  getWizardSession,
  persistWizardDraft,
  clearWizardSession,
  createStudioAccount,
  updateStudioAccount,
  deleteStudioAccount,
  deleteProfile,
}: PlanningConfigPanelProps) {
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const [wizardProfileId, setWizardProfileId] = useState<string | undefined>();
  const [accountSheetOpen, setAccountSheetOpen] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);

  const editingAccount = editingAccountId
    ? studioAccounts.find((account) => account.id === editingAccountId)
    : undefined;

  const openProfileSheet = (profileId?: string) => {
    setWizardProfileId(profileId);
    setProfileSheetOpen(true);
  };

  const openAccountSheet = (accountId?: string) => {
    setEditingAccountId(accountId ?? null);
    setAccountSheetOpen(true);
  };

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PlanningProfilesPanel
          studioAccounts={studioAccounts}
          profiles={profiles}
          deleteStudioAccount={deleteStudioAccount}
          deleteProfile={deleteProfile}
          onAddAccount={() => openAccountSheet()}
          onEditAccount={(accountId) => openAccountSheet(accountId)}
          onEditProfile={(profileId) => openProfileSheet(profileId)}
          onCreateProfile={() => openProfileSheet()}
        />
      </div>

      <PlanningAccountSheet
        open={accountSheetOpen}
        onOpenChange={(open) => {
          setAccountSheetOpen(open);
          if (!open) setEditingAccountId(null);
        }}
        initial={editingAccount}
        onSave={(account) => {
          if (editingAccount) {
            updateStudioAccount(editingAccount.id, account);
          } else {
            createStudioAccount(account);
          }
        }}
      />

      <PlanningProfileWizardSheet
        open={profileSheetOpen}
        onOpenChange={(open) => {
          setProfileSheetOpen(open);
          if (!open) {
            setWizardProfileId(undefined);
          }
        }}
        initialProfileId={wizardProfileId}
        getProfile={(profileId) => resolveProfile(profileId, profiles)}
        getWizardSession={getWizardSession}
        persistWizardDraft={persistWizardDraft}
        clearWizardSession={clearWizardSession}
        onSave={(account, options) => {
          saveAccountAsProfile(
            account,
            options.profileLabel,
            undefined,
            options.profileId,
          );
        }}
        onComplete={() => {
          markSetupCompleted();
          setWizardProfileId(undefined);
        }}
      />
    </>
  );
}
