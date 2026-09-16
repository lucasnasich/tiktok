import { useMemo, useState } from "react";
import { CalendarDotsIcon, MaskHappyIcon, UserCircleIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

import { PlatformIcon } from "@/components/icons/platform-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlanningCustomDateRange } from "@/components/planning/PlanningCustomDateRange";
import {
  DEFAULT_PLANNING_RHYTHM,
  PlanningRhythmFields,
} from "@/components/planning/PlanningRhythmFields";
import {
  CAMERA_PRESENCE_OPTIONS,
  type CameraPresenceMode,
} from "@/content/camera-presence";
import {
  CALENDAR_GENERATION_RANGE_PRESETS,
  formatCalendarGenerationDateRange,
  resolveCalendarGenerationRange,
  type CalendarGenerationRangePreset,
  type CalendarGenerationRequest,
  type CalendarPublishingMode,
} from "@/content/calendar-generations";
import { hasEditorialMix } from "@/content/planning-presets";
import {
  isPlanningRhythmComplete,
  type PlanningRhythm,
} from "@/content/planning-rhythm";
import type { PlanningProfile } from "@/content/planning-profiles";
import type { PlanningStudioAccount } from "@/content/planning-studio-accounts";
import { toIsoDate } from "@/lib/planning-dates";
import { cn } from "@/lib/utils";

type PlanningCalendarSetupProps = {
  studioAccounts: PlanningStudioAccount[];
  profiles: PlanningProfile[];
  onGenerate: (input: CalendarGenerationRequest) => void;
  /** Sin card centrada — para sheet o panel embebido. */
  embedded?: boolean;
};

function AccountOption({
  account,
  selected,
  onToggle,
}: {
  account: PlanningStudioAccount;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-[13px] transition-colors",
        selected
          ? "border-primary bg-primary/5 text-foreground"
          : "border-border bg-card text-foreground hover:bg-muted/50",
      )}
    >
      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded border",
          selected ? "border-primary bg-primary" : "border-input bg-background",
        )}
        aria-hidden
      >
        {selected ? (
          <span className="size-1.5 rounded-full bg-primary-foreground" />
        ) : null}
      </span>
      <PlatformIcon platform={account.platform} className="size-3.5 shrink-0" />
      <span className="min-w-0 truncate font-medium">{account.displayName}</span>
      <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
        {account.type === "official" ? "Oficial" : "Satélite"}
      </span>
    </button>
  );
}

function PresetOption({
  label,
  description,
  selected,
  onSelect,
}: {
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left transition-colors",
        selected
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:bg-muted/50",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border",
          selected ? "border-primary bg-primary" : "border-input bg-background",
        )}
        aria-hidden
      >
        {selected ? (
          <span className="size-1.5 rounded-full bg-primary-foreground" />
        ) : null}
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-medium">{label}</span>
        <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">
          {description}
        </span>
      </span>
    </button>
  );
}

function PublishingModeOption({
  label,
  description,
  selected,
  onSelect,
}: {
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <PresetOption
      label={label}
      description={description}
      selected={selected}
      onSelect={onSelect}
    />
  );
}

export function PlanningCalendarSetup({
  studioAccounts,
  profiles,
  onGenerate,
  embedded = false,
}: PlanningCalendarSetupProps) {
  const todayIso = useMemo(() => toIsoDate(new Date()), []);
  const [rangePreset, setRangePreset] =
    useState<CalendarGenerationRangePreset>("rest-of-month");
  const [customFrom, setCustomFrom] = useState(todayIso);
  const [customTo, setCustomTo] = useState(todayIso);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [publishingMode, setPublishingMode] =
    useState<CalendarPublishingMode>("mirrored");
  const [cameraPresence, setCameraPresence] =
    useState<CameraPresenceMode>("off-camera");
  const [rhythm, setRhythm] = useState<PlanningRhythm>(DEFAULT_PLANNING_RHYTHM);
  const [selectedProfileId, setSelectedProfileId] = useState<string>();

  const resolvedRange = useMemo(
    () =>
      resolveCalendarGenerationRange(
        rangePreset,
        todayIso,
        customFrom,
        customTo,
      ),
    [customFrom, customTo, rangePreset, todayIso],
  );

  const compatibleProfiles = profiles;

  const selectedProfile = compatibleProfiles.find(
    (profile) => profile.id === selectedProfileId,
  );

  const canGenerate =
    resolvedRange !== undefined &&
    selectedAccountIds.length > 0 &&
    selectedProfile !== undefined &&
    isPlanningRhythmComplete(rhythm) &&
    hasEditorialMix({
      roleTargets: selectedProfile.settings.roleTargets ?? {},
    });

  const toggleAccount = (accountId: string) => {
    setSelectedAccountIds((current) =>
      current.includes(accountId)
        ? current.filter((id) => id !== accountId)
        : [...current, accountId],
    );
  };

  if (studioAccounts.length === 0) {
    return (
      <div className="flex min-h-[min(420px,60vh)] items-center justify-center p-6">
        <Card className="w-full max-w-md ring-border/80">
          <CardHeader className="items-center text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <UserCircleIcon className="size-5 text-muted-foreground" weight="bold" />
            </div>
            <CardTitle className="text-base">Primero agregá cuentas</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Necesitás al menos una cuenta (Instagram o TikTok) antes de generar
              el calendario.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link to="/planificacion/configuracion">Ir a configuración</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="flex min-h-[min(420px,60vh)] items-center justify-center p-6">
        <Card className="w-full max-w-md ring-border/80">
          <CardHeader className="items-center text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <MaskHappyIcon className="size-5 text-muted-foreground" weight="bold" />
            </div>
            <CardTitle className="text-base">Creá un perfil editorial</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              El perfil define roles, pilares y formatos. Después lo asociás a las
              cuentas al generar el calendario.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link to="/planificacion/configuracion">Ir a configuración</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const form = (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-[13px] font-medium">Período</p>
        <div className="grid gap-2">
          {CALENDAR_GENERATION_RANGE_PRESETS.map((preset) => (
            <PresetOption
              key={preset.id}
              label={preset.label}
              description={preset.description}
              selected={rangePreset === preset.id}
              onSelect={() => setRangePreset(preset.id)}
            />
          ))}
        </div>
        {rangePreset === "custom" ? (
          <PlanningCustomDateRange
            from={customFrom}
            to={customTo}
            todayIso={todayIso}
            onChange={({ from, to }) => {
              setCustomFrom(from);
              setCustomTo(to);
            }}
          />
        ) : null}
        {resolvedRange ? (
          <p className="text-[12px] text-muted-foreground">
            Vas a generar slots del{" "}
            <span className="font-medium text-foreground">
              {formatCalendarGenerationDateRange(
                resolvedRange.dateFrom,
                resolvedRange.dateTo,
              )}
            </span>
            .
          </p>
        ) : (
          <p className="text-[12px] text-destructive">
            Revisá el rango de fechas.
          </p>
        )}
      </div>

      <PlanningRhythmFields value={rhythm} onChange={setRhythm} />

      <div className="space-y-2">
        <p className="text-[13px] font-medium">Presencia en cámara</p>
        <div className="grid gap-2">
          {CAMERA_PRESENCE_OPTIONS.map((option) => (
            <PublishingModeOption
              key={option.id}
              label={option.label}
              description={option.description}
              selected={cameraPresence === option.id}
              onSelect={() => setCameraPresence(option.id)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[13px] font-medium">Cuentas</p>
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          Elegí en qué cuentas aplica esta generación. Podés incluir una sola o
          varias a la vez.
        </p>
        <div className="grid gap-2">
          {studioAccounts.map((account) => (
            <AccountOption
              key={account.id}
              account={account}
              selected={selectedAccountIds.includes(account.id)}
              onToggle={() => toggleAccount(account.id)}
            />
          ))}
        </div>
      </div>

      {selectedAccountIds.length > 1 ? (
        <div className="space-y-2">
          <p className="text-[13px] font-medium">Estrategia entre cuentas</p>
          <div className="grid gap-2">
            <PublishingModeOption
              label="Misma pieza en todas"
              description="Un slot por pieza, publicada en todas las cuentas elegidas (sin duplicar)."
              selected={publishingMode === "mirrored"}
              onSelect={() => setPublishingMode("mirrored")}
            />
            <PublishingModeOption
              label="Cada cuenta por separado"
              description="Cada cuenta genera su propio calendario con el mismo perfil editorial."
              selected={publishingMode === "independent"}
              onSelect={() => setPublishingMode("independent")}
            />
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <p className="text-[13px] font-medium">Perfil editorial</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-full justify-start text-xs"
              disabled={selectedAccountIds.length === 0}
            >
              <MaskHappyIcon className="size-3.5 shrink-0" />
              {selectedProfile?.label ??
                (selectedAccountIds.length === 0
                  ? "Elegí cuentas primero"
                  : "Elegir perfil")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[var(--radix-dropdown-menu-trigger-width)]">
            {compatibleProfiles.map((profile) => (
              <DropdownMenuItem
                key={profile.id}
                className="text-[13px]"
                onSelect={() => setSelectedProfileId(profile.id)}
              >
                {profile.label}
                {!hasEditorialMix({
                  roleTargets: profile.settings.roleTargets ?? {},
                })
                  ? " (sin mix)"
                  : ""}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {selectedProfile &&
        !hasEditorialMix({
          roleTargets: selectedProfile.settings.roleTargets ?? {},
        }) ? (
          <p className="text-[12px] text-muted-foreground">
            Este perfil no tiene roles configurados.{" "}
            <Link
              to="/planificacion/configuracion"
              className="text-foreground underline-offset-2 hover:underline"
            >
              Completalo en configuración
            </Link>
            .
          </p>
        ) : null}
      </div>

      <Button
        type="button"
        className="w-full"
        disabled={!canGenerate}
        onClick={() => {
          if (!selectedProfileId || !resolvedRange) return;
          onGenerate({
            profileId: selectedProfileId,
            accountIds: selectedAccountIds,
            dateFrom: resolvedRange.dateFrom,
            dateTo: resolvedRange.dateTo,
            publishingMode:
              selectedAccountIds.length > 1 ? publishingMode : "independent",
            cameraPresence,
            rhythm,
          });
        }}
      >
        Generar slots
      </Button>
    </div>
  );

  if (embedded) return form;

  return (
    <div className="flex min-h-[min(420px,60vh)] items-center justify-center p-6">
      <Card className="w-full max-w-lg ring-border/80">
        <CardHeader className="gap-2 text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-muted">
            <CalendarDotsIcon
              className="size-5 text-muted-foreground"
              weight="bold"
            />
          </div>
          <CardTitle className="text-base">Generar calendario</CardTitle>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Definí el período, el ritmo, las cuentas y el perfil editorial. Los
            slots se congelan al confirmar.
          </p>
        </CardHeader>
        <CardContent>{form}</CardContent>
      </Card>
    </div>
  );
}
