import {
  CopyIcon,
  PencilSimpleIcon,
  PlusIcon,
  TrashIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getContentRoleLabel } from "@/content/content-roles";
import {
  planningAccounts,
  getPlanningAccountLabel,
} from "@/content/planning-accounts";
import {
  formatProfileRoleSummary,
  type PlanningProfile,
} from "@/content/planning-profiles";
import type { PlanningConfigApi } from "@/hooks/use-planning-config";
import { cn } from "@/lib/utils";

type PlanningProfilesPanelProps = Pick<
  PlanningConfigApi,
  | "profiles"
  | "assignProfileToAccount"
  | "deleteProfile"
  | "duplicateProfile"
  | "getAssignedProfileId"
> & {
  onEditProfile: (profileId: string, accountId?: string) => void;
  onCreateProfile: () => void;
};

function ProfileCard({
  profile,
  assignedAccounts,
  onAssign,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  profile: PlanningProfile;
  assignedAccounts: string[];
  onAssign: (accountId: string) => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const roleSummary = formatProfileRoleSummary(profile.settings)
    .split(" · ")
    .map((part) => {
      if (part === "Sin roles definidos") return part;
      const [id, pct] = part.split(" ");
      return `${getContentRoleLabel(id)} ${pct}`;
    })
    .join(" · ");

  return (
    <Card size="sm" className="ring-border/80">
      <CardHeader className="gap-2">
        <CardTitle className="text-[15px] tracking-tight">
          {profile.label}
        </CardTitle>
        {profile.description ? (
          <p className="text-[13px] text-muted-foreground">
            {profile.description}
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <p className="text-[13px] text-muted-foreground">
          <span className="font-medium text-foreground">Roles: </span>
          {roleSummary}
        </p>
        <p className="text-[13px] text-muted-foreground">
          <span className="font-medium text-foreground">Cuentas: </span>
          {assignedAccounts.length > 0
            ? assignedAccounts.map(getPlanningAccountLabel).join(", ")
            : "Sin asignar"}
        </p>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <UserCircleIcon className="size-3.5" />
                Asignar a cuenta
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-48">
              {planningAccounts
                .filter((a) => profile.accountTypes.includes(a.type))
                .map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    className="flex w-full cursor-default items-center rounded-md px-2 py-1.5 text-[13px] outline-none hover:bg-muted"
                    onClick={() => onAssign(account.id)}
                  >
                    {account.label}
                  </button>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={onEdit}
          >
            <PencilSimpleIcon className="size-3.5" />
            Editar
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={onDuplicate}
          >
            <CopyIcon className="size-3.5" />
            Duplicar
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <TrashIcon className="size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function PlanningProfilesPanel({
  profiles,
  assignProfileToAccount,
  deleteProfile,
  duplicateProfile,
  getAssignedProfileId,
  onEditProfile,
  onCreateProfile,
}: PlanningProfilesPanelProps) {
  const accountsUsingProfile = (profileId: string) =>
    planningAccounts
      .filter(
        (account) => getAssignedProfileId(account.id) === profileId,
      )
      .map((account) => account.id);

  return (
    <div className="space-y-6 px-5 py-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
          Acá vivien tus perfiles. Cada uno define el balance de roles, pilares
          y formatos. Creás uno, lo asignás a la cuenta que quieras, y listo.
        </p>
        <Button type="button" size="sm" onClick={onCreateProfile}>
          <PlusIcon className="size-3.5" />
          Crear perfil
        </Button>
      </div>

      <section className="space-y-3">
        <h3 className="text-[13px] font-medium text-foreground">
          Asignación por cuenta
        </h3>
        <div className="grid gap-2 sm:grid-cols-3">
          {planningAccounts.map((account) => {
            const profileId = getAssignedProfileId(account.id);
            const compatible = profiles.filter((p) =>
              p.accountTypes.includes(account.type),
            );
            const profile = profileId
              ? profiles.find((p) => p.id === profileId)
              : undefined;
            return (
              <div
                key={account.id}
                className="rounded-lg border border-border px-3 py-2.5"
              >
                <p className="text-[13px] font-medium">{account.label}</p>
                {compatible.length > 0 ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "mt-1 text-left text-[13px] underline-offset-2 hover:underline",
                          profile
                            ? "text-primary"
                            : "text-muted-foreground",
                        )}
                      >
                        {profile?.label ?? "Elegir perfil"}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-52">
                      <DropdownMenuRadioGroup
                        value={profileId ?? ""}
                        onValueChange={(id) =>
                          assignProfileToAccount(account.id, id)
                        }
                      >
                        {compatible.map((item) => (
                          <DropdownMenuRadioItem
                            key={item.id}
                            value={item.id}
                          >
                            {item.label}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    Sin perfiles — creá uno primero
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-[13px] font-medium text-foreground">
          Tus perfiles
        </h3>
        {profiles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-6 py-10 text-center">
            <p className="text-[14px] text-muted-foreground">
              No hay perfiles todavía. Usá el asistente o el botón de arriba
              para crear el primero.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                assignedAccounts={accountsUsingProfile(profile.id)}
                onAssign={(accountId) =>
                  assignProfileToAccount(accountId, profile.id)
                }
                onEdit={() => onEditProfile(profile.id)}
                onDuplicate={() => duplicateProfile(profile.id)}
                onDelete={() => deleteProfile(profile.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
