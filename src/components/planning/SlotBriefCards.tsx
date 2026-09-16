import {
  UserSoundIcon,
  VideoCameraIcon,
  VideoCameraSlashIcon,
} from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { PlatformIcon } from "@/components/icons/platform-icon";
import { ContentRoleIcon } from "@/components/planning/content-role-icons";
import { FormatIcon } from "@/components/planning/format-icons";
import { PlanningPillarIcon } from "@/components/planning/planning-pillar-icons";
import {
  cameraPresenceShortLabel,
  type CameraPresenceMode,
} from "@/content/camera-presence";
import { getContentRoleLabel, normalizeRoleId, type ContentRoleId } from "@/content/content-roles";
import { getFormatLabel } from "@/content/formats";
import { getPlanningPillarLabel } from "@/content/planning-pillars";
import type { PlanningSlot } from "@/content/planned-slots";
import type { PlanningStudioAccount } from "@/content/planning-studio-accounts";
import { getSlotAccountLabel } from "@/content/planning-accounts";
import { parseIsoDate } from "@/lib/planning-dates";
import { cn } from "@/lib/utils";

const PLATFORM_LABELS: Record<string, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
};

const ROLE_CARD_CLASS: Record<ContentRoleId, string> = {
  educacion:
    "border-sky-500/25 bg-sky-500/12 text-sky-900 dark:text-sky-100",
  producto:
    "border-indigo-500/25 bg-indigo-500/12 text-indigo-900 dark:text-indigo-100",
  evidencia:
    "border-emerald-500/25 bg-emerald-500/12 text-emerald-900 dark:text-emerald-100",
  "build-in-public":
    "border-violet-500/25 bg-violet-500/12 text-violet-900 dark:text-violet-100",
  conversion:
    "border-amber-500/25 bg-amber-500/12 text-amber-900 dark:text-amber-100",
  marca: "border-rose-500/25 bg-rose-500/12 text-rose-900 dark:text-rose-100",
  comunidad:
    "border-fuchsia-500/25 bg-fuchsia-500/12 text-fuchsia-900 dark:text-fuchsia-100",
};

const ROLE_ICON_SHELL_CLASS: Record<ContentRoleId, string> = {
  educacion: "bg-sky-500/20",
  producto: "bg-indigo-500/20",
  evidencia: "bg-emerald-500/20",
  "build-in-public": "bg-violet-500/20",
  conversion: "bg-amber-500/20",
  marca: "bg-rose-500/20",
  comunidad: "bg-fuchsia-500/20",
};

const PILLAR_CARD_CLASS =
  "border-teal-500/25 bg-teal-500/12 text-teal-900 dark:text-teal-100";

const PILLAR_ICON_SHELL_CLASS = "bg-teal-500/20";

const FORMAT_CARD_CLASS =
  "border-indigo-500/25 bg-indigo-500/12 text-indigo-900 dark:text-indigo-100";

const FORMAT_ICON_SHELL_CLASS = "bg-indigo-500/20";

const PRODUCTION_CARD_CLASS: Record<CameraPresenceMode, string> = {
  "off-camera":
    "border-slate-500/25 bg-slate-500/12 text-slate-900 dark:text-slate-100",
  "on-camera":
    "border-orange-500/25 bg-orange-500/12 text-orange-900 dark:text-orange-100",
  "needs-guest":
    "border-purple-500/25 bg-purple-500/12 text-purple-900 dark:text-purple-100",
};

const PRODUCTION_ICON_SHELL_CLASS: Record<CameraPresenceMode, string> = {
  "off-camera": "bg-slate-500/20",
  "on-camera": "bg-orange-500/20",
  "needs-guest": "bg-purple-500/20",
};

const ICON_SHELL_BASE =
  "flex size-9 shrink-0 items-center justify-center rounded-lg";

function formatSlotDateTime(date: string, time: string): string {
  const parsed = parseIsoDate(date);
  const dateLabel = parsed.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });
  return `${dateLabel} · ${time}`;
}

function BriefHighlightCard({
  label,
  value,
  icon,
  className,
  iconShellClassName,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  className: string;
  iconShellClassName: string;
}) {
  return (
    <div className={cn("rounded-xl border px-3 py-3", className)}>
      <div className="flex items-start gap-3">
        <div className={cn(ICON_SHELL_BASE, iconShellClassName)} aria-hidden>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
            {label}
          </p>
          <p className="mt-1 text-[15px] font-semibold leading-snug tracking-tight">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function BriefMetaCard({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children?: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-border/50 bg-muted/25 px-2.5 py-2">
      <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
      <div className="mt-1 flex min-w-0 items-center gap-1">
        {children}
        <p className="min-w-0 truncate text-[11px] text-foreground/75">{value}</p>
      </div>
    </div>
  );
}

function ProductionIcon({ mode }: { mode: CameraPresenceMode }) {
  if (mode === "on-camera") {
    return <VideoCameraIcon className="size-4" />;
  }
  if (mode === "needs-guest") {
    return <UserSoundIcon className="size-4" />;
  }
  return <VideoCameraSlashIcon className="size-4" />;
}

export function SlotBriefCards({
  slot,
  studioAccounts = [],
}: {
  slot: PlanningSlot;
  studioAccounts?: PlanningStudioAccount[];
}) {
  const roleId = normalizeRoleId(slot.roleId);
  const productionMode = slot.cameraPresence ?? "off-camera";
  const platformLabel = slot.platforms
    .map((platform) => PLATFORM_LABELS[platform] ?? platform)
    .join(" + ");

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <BriefMetaCard
          label="Cuenta"
          value={getSlotAccountLabel(slot, studioAccounts)}
        />
        <BriefMetaCard
          label="Fecha / hora"
          value={formatSlotDateTime(slot.date, slot.time)}
        />
        <BriefMetaCard label="Plataformas" value={platformLabel}>
          <span className="inline-flex shrink-0 items-center gap-0.5">
            {slot.platforms.map((platform) => (
              <PlatformIcon
                key={platform}
                platform={platform}
                size={12}
                className="text-muted-foreground"
              />
            ))}
          </span>
        </BriefMetaCard>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <BriefHighlightCard
          label="Rol"
          value={getContentRoleLabel(roleId)}
          icon={<ContentRoleIcon roleId={roleId} className="size-4" />}
          className={ROLE_CARD_CLASS[roleId] ?? ROLE_CARD_CLASS.educacion}
          iconShellClassName={
            ROLE_ICON_SHELL_CLASS[roleId] ?? ROLE_ICON_SHELL_CLASS.educacion
          }
        />
        <BriefHighlightCard
          label="Pilar"
          value={getPlanningPillarLabel(slot.pillarId)}
          icon={
            <PlanningPillarIcon pillarId={slot.pillarId} className="size-4" />
          }
          className={PILLAR_CARD_CLASS}
          iconShellClassName={PILLAR_ICON_SHELL_CLASS}
        />
        <BriefHighlightCard
          label="Formato"
          value={getFormatLabel(slot.formatId)}
          icon={<FormatIcon formatId={slot.formatId} className="size-4" />}
          className={FORMAT_CARD_CLASS}
          iconShellClassName={FORMAT_ICON_SHELL_CLASS}
        />
        <BriefHighlightCard
          label="Producción"
          value={cameraPresenceShortLabel(productionMode)}
          icon={<ProductionIcon mode={productionMode} />}
          className={PRODUCTION_CARD_CLASS[productionMode]}
          iconShellClassName={PRODUCTION_ICON_SHELL_CLASS[productionMode]}
        />
      </div>
    </div>
  );
}
