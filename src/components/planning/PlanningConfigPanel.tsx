import { useState } from "react";
import {
  ArrowsClockwiseIcon,
  SlidersHorizontalIcon,
  SparkleIcon,
  StackIcon,
} from "@phosphor-icons/react";

import { PlanningProfilesPanel } from "@/components/planning/PlanningProfilesPanel";
import { PlanningSetupWizard } from "@/components/planning/PlanningSetupWizard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getContentRoleLabel } from "@/content/content-roles";
import { getFormatLabel } from "@/content/formats";
import {
  planningAccounts,
  type PlanningAccount,
} from "@/content/planning-accounts";
import { getPlanningPillarLabel } from "@/content/planning-pillars";
import type { PlanningConfigApi } from "@/hooks/use-planning-config";
import { WEEKDAY_LABELS } from "@/lib/planning-dates";

type PlanningConfigPanelProps = PlanningConfigApi;

const WEEKDAY_BY_ISO = ["", ...WEEKDAY_LABELS];

function formatPercentTargets(
  targets: Record<string, number>,
  labelFor: (id: string) => string,
) {
  return Object.entries(targets)
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([id, value]) => `${labelFor(id)} ${value}%`)
    .join(" · ");
}

function AccountConfigCard({
  account,
  profileLabel,
  compatibleProfiles,
  assignedProfileId,
  onAssignProfile,
}: {
  account: PlanningAccount;
  profileLabel: string;
  compatibleProfiles: { id: string; label: string }[];
  assignedProfileId?: string;
  onAssignProfile: (profileId: string) => void;
}) {
  const roleSummary = formatPercentTargets(
    account.roleTargets as Record<string, number>,
    (id) => getContentRoleLabel(id),
  );
  const pillarSummary = formatPercentTargets(
    account.pillarTargets,
    getPlanningPillarLabel,
  );
  const formatSummary = formatPercentTargets(
    account.formatTargets,
    getFormatLabel,
  );

  return (
    <Card size="sm" className="ring-border/80">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <CardTitle className="text-[15px] tracking-tight">
            {account.label}
          </CardTitle>
          <Badge variant="secondary" className="text-[11px]">
            {account.type === "official" ? "Oficial" : "Satélite"}
          </Badge>
        </div>
        {compatibleProfiles.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="text-left text-[13px] font-medium text-primary underline-offset-2 hover:underline"
              >
                Perfil: {profileLabel}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-52">
              <DropdownMenuRadioGroup
                value={assignedProfileId ?? ""}
                onValueChange={onAssignProfile}
              >
                {compatibleProfiles.map((profile) => (
                  <DropdownMenuRadioItem key={profile.id} value={profile.id}>
                    {profile.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <p className="text-[13px] text-muted-foreground">
            Sin perfil — creá uno en el asistente
          </p>
        )}
        <p className="text-[13px] text-muted-foreground">
          {account.postsPerDay} piezas/día ·{" "}
          {account.platforms.map((p) => p.toUpperCase()).join(" + ")}
        </p>
      </CardHeader>
      <CardContent className="space-y-3 pt-0 text-[13px] leading-relaxed">
        <div>
          <p className="font-medium text-foreground">Días activos</p>
          <p className="text-muted-foreground">
            {account.activeDays.map((day) => WEEKDAY_BY_ISO[day]).join(", ")}
          </p>
        </div>
        <div>
          <p className="font-medium text-foreground">Horarios</p>
          <p className="text-muted-foreground">{account.timeSlots.join(" · ")}</p>
        </div>
        <div>
          <p className="font-medium text-foreground">Rol</p>
          <p className="text-muted-foreground">{roleSummary}</p>
        </div>
        <div>
          <p className="font-medium text-foreground">Pilar</p>
          <p className="text-muted-foreground">{pillarSummary}</p>
        </div>
        <div>
          <p className="font-medium text-foreground">Formato</p>
          <p className="text-muted-foreground">{formatSummary}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function PlanningConfigPanel({
  accounts,
  profiles,
  setupCompleted,
  store,
  saveAccountAsProfile,
  markSetupCompleted,
  resetSetup,
  getWizardSession,
  persistWizardDraft,
  clearWizardSession,
  getAccountDraft,
  getAccountDraftFromProfile,
  getProfilesForAccount,
  getAssignedProfileId,
  getAssignedProfile,
  assignProfileToAccount,
  deleteProfile,
  duplicateProfile,
}: PlanningConfigPanelProps) {
  const [configTab, setConfigTab] = useState<
    "assistant" | "profiles" | "summary"
  >(setupCompleted ? "summary" : "assistant");
  const [wizardProfileId, setWizardProfileId] = useState<string | undefined>();
  const [wizardAccountId, setWizardAccountId] = useState<string | undefined>();

  const openAssistant = (profileId?: string, accountId?: string) => {
    setWizardProfileId(profileId);
    setWizardAccountId(accountId ?? store.lastAccountId);
    setConfigTab("assistant");
  };

  return (
    <Tabs
      value={configTab}
      onValueChange={(v) =>
        setConfigTab(v as "assistant" | "profiles" | "summary")
      }
      className="flex min-h-0 flex-1 flex-col gap-0"
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary px-5 py-3">
        <TabsList className="h-8">
          <TabsTrigger value="assistant" className="gap-1.5 px-2.5 text-xs">
            <SparkleIcon className="size-3.5" />
            Asistente
          </TabsTrigger>
          <TabsTrigger value="profiles" className="gap-1.5 px-2.5 text-xs">
            <StackIcon className="size-3.5" />
            Perfiles
          </TabsTrigger>
          <TabsTrigger value="summary" className="gap-1.5 px-2.5 text-xs">
            <SlidersHorizontalIcon className="size-3.5" />
            Resumen
          </TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          {setupCompleted ? (
            <Badge variant="secondary" className="text-[11px]">
              Configuración activa
            </Badge>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              resetSetup();
              setConfigTab("assistant");
            }}
          >
            <ArrowsClockwiseIcon className="size-3.5" />
            Reiniciar
          </Button>
        </div>
      </div>

      <TabsContent
        value="assistant"
        className="mt-0 min-h-0 flex-1 overflow-y-auto"
      >
        <PlanningSetupWizard
          initialAccountId={wizardAccountId ?? store.lastAccountId}
          initialProfileId={wizardProfileId}
          getAccountDraft={getAccountDraft}
          getAccountDraftFromProfile={getAccountDraftFromProfile}
          getProfilesForAccount={getProfilesForAccount}
          getAssignedProfileId={getAssignedProfileId}
          getWizardSession={getWizardSession}
          persistWizardDraft={persistWizardDraft}
          onSave={(account, options) => {
            saveAccountAsProfile(
              account,
              options.profileLabel,
              undefined,
              options.profileId,
            );
          }}
          onComplete={() => {
            clearWizardSession(
              wizardAccountId ?? store.lastAccountId ?? planningAccounts[0].id,
            );
            markSetupCompleted();
            setConfigTab("summary");
            setWizardProfileId(undefined);
          }}
        />
      </TabsContent>

      <TabsContent
        value="profiles"
        className="mt-0 min-h-0 flex-1 overflow-y-auto"
      >
        <PlanningProfilesPanel
          profiles={profiles}
          assignProfileToAccount={assignProfileToAccount}
          deleteProfile={deleteProfile}
          duplicateProfile={duplicateProfile}
          getAssignedProfileId={getAssignedProfileId}
          onEditProfile={(profileId, accountId) =>
            openAssistant(profileId, accountId)
          }
          onCreateProfile={() => openAssistant()}
        />
      </TabsContent>

      <TabsContent
        value="summary"
        className="mt-0 min-h-0 flex-1 overflow-y-auto"
      >
        <div className="space-y-4 px-5 py-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
              Cada cuenta usa un perfil. Cambiá el perfil desde acá o en la
              pestaña Perfiles; el calendario se actualiza al instante.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => openAssistant()}
            >
              <SparkleIcon className="size-3.5" />
              Crear / editar perfil
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
            {accounts.map((account) => {
              const profile = getAssignedProfile(account.id);
              return (
                <AccountConfigCard
                  key={account.id}
                  account={account}
                  profileLabel={profile?.label ?? "Sin perfil"}
                  compatibleProfiles={getProfilesForAccount(account.id)}
                  assignedProfileId={getAssignedProfileId(account.id)}
                  onAssignProfile={(profileId) =>
                    assignProfileToAccount(account.id, profileId)
                  }
                />
              );
            })}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
