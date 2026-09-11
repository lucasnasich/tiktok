import {
  MaskHappyIcon,
  PencilSimpleIcon,
  PlusIcon,
  TrashIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";

import { PlatformIcon } from "@/components/icons/platform-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { PlanningProfile } from "@/content/planning-profiles";
import {
  normalizeSocialHandle,
  type PlanningStudioAccount,
} from "@/content/planning-studio-accounts";
import type { PlanningConfigApi } from "@/hooks/use-planning-config";

type PlanningProfilesPanelProps = Pick<
  PlanningConfigApi,
  | "studioAccounts"
  | "profiles"
  | "deleteStudioAccount"
  | "deleteProfile"
> & {
  onAddAccount: () => void;
  onEditAccount: (accountId: string) => void;
  onEditProfile: (profileId: string) => void;
  onCreateProfile: () => void;
};

function AddEmptyState({
  icon: Icon,
  title,
  description,
  buttonLabel,
  onAction,
}: {
  icon: typeof UserCircleIcon;
  title: string;
  description: string;
  buttonLabel: string;
  onAction: () => void;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-8 text-center"
    >
      <div className="flex size-9 items-center justify-center rounded-full bg-muted">
        <Icon className="size-4 text-muted-foreground" weight="bold" />
      </div>
      <div className="max-w-xs space-y-1">
        <p className="text-[13px] font-medium text-foreground">{title}</p>
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <Button type="button" size="sm" variant="outline" onClick={onAction}>
        <PlusIcon className="size-3.5" />
        {buttonLabel}
      </Button>
    </div>
  );
}

function AddSlot({
  buttonLabel,
  onAction,
}: {
  buttonLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-dashed border-border px-4 py-3">
      <Button type="button" size="sm" variant="outline" onClick={onAction}>
        <PlusIcon className="size-3.5" />
        {buttonLabel}
      </Button>
    </div>
  );
}

function StudioAccountPlatformIcon({
  account,
}: {
  account: PlanningStudioAccount;
}) {
  const handle = normalizeSocialHandle(account.handle);
  const label = account.platform === "tiktok" ? "TikTok" : "Instagram";

  if (!handle) return null;

  return (
    <span title={`${label} · @${handle}`} aria-label={`${label} · @${handle}`}>
      <PlatformIcon
        platform={account.platform}
        size={16}
        className="shrink-0 text-muted-foreground"
      />
    </span>
  );
}

function StudioAccountCard({
  account,
  onEdit,
  onDelete,
}: {
  account: PlanningStudioAccount;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card size="sm" className="ring-border/80">
      <CardHeader className="gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <StudioAccountPlatformIcon account={account} />
            <CardTitle className="text-[15px] tracking-tight">
              {account.displayName}
            </CardTitle>
            <Badge variant="outline" className="text-[11px]">
              {account.type === "official" ? "Oficial" : "Satélite"}
            </Badge>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={onEdit}
            >
              <PencilSimpleIcon className="size-3.5" />
              Editar cuenta
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <TrashIcon className="size-3.5" />
              Eliminar
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

function ProfileCard({
  profile,
  onEdit,
  onDelete,
}: {
  profile: PlanningProfile;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card size="sm" className="ring-border/80">
      <CardHeader className="gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <MaskHappyIcon
              className="size-4 shrink-0 text-muted-foreground"
              weight="bold"
              aria-hidden
            />
            <CardTitle className="text-[15px] tracking-tight">
              {profile.label}
            </CardTitle>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={onEdit}
            >
              <PencilSimpleIcon className="size-3.5" />
              Editar perfil
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <TrashIcon className="size-3.5" />
              Eliminar
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export function PlanningProfilesPanel({
  studioAccounts,
  profiles,
  deleteStudioAccount,
  deleteProfile,
  onAddAccount,
  onEditAccount,
  onEditProfile,
  onCreateProfile,
}: PlanningProfilesPanelProps) {
  const accountEmptyState = (
    <AddEmptyState
      icon={UserCircleIcon}
      title="Agregar cuenta"
      description="Una cuenta por red: nombre público, plataforma y @."
      buttonLabel="Agregar cuenta"
      onAction={onAddAccount}
    />
  );

  const accountAddSlot = (
    <AddSlot buttonLabel="Agregar cuenta" onAction={onAddAccount} />
  );

  const profileEmptyState = (
    <AddEmptyState
      icon={MaskHappyIcon}
      title="Crear perfil editorial"
      description="Mix de roles, pilares y formatos que podés reutilizar en varias cuentas."
      buttonLabel="Crear nuevo perfil"
      onAction={onCreateProfile}
    />
  );

  const profileAddSlot = (
    <AddSlot buttonLabel="Crear nuevo perfil" onAction={onCreateProfile} />
  );

  return (
    <div className="space-y-8 px-5 py-6">
      <section className="space-y-3">
        <h3 className="text-[13px] font-medium text-foreground">Cuentas</h3>

        {studioAccounts.length === 0 ? (
          accountEmptyState
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {studioAccounts.map((account) => (
              <StudioAccountCard
                key={account.id}
                account={account}
                onEdit={() => onEditAccount(account.id)}
                onDelete={() => deleteStudioAccount(account.id)}
              />
            ))}
            {accountAddSlot}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-[13px] font-medium text-foreground">
          Perfiles editoriales
        </h3>

        {profiles.length === 0 ? (
          profileEmptyState
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onEdit={() => onEditProfile(profile.id)}
                onDelete={() => deleteProfile(profile.id)}
              />
            ))}
            {profileAddSlot}
          </div>
        )}
      </section>
    </div>
  );
}
