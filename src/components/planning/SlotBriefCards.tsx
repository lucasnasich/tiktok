import { PlatformIcon } from "@/components/icons/platform-icon";
import { cameraPresenceShortLabel } from "@/content/camera-presence";
import {
  getContentRoleLabel,
  normalizeRoleId,
} from "@/content/content-roles";
import { getSlotTopicLabel } from "@/content/role-topics";
import {
  getSlotPublicationTypeShortLabel,
  type PlanningSlot,
} from "@/content/planned-slots";
import type { PlanningStudioAccount } from "@/content/planning-studio-accounts";
import { getSlotAccountLabel } from "@/content/planning-accounts";
import { parseIsoDate } from "@/lib/planning-dates";

const PLATFORM_LABELS: Record<string, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
};

function formatSlotDateTime(date: string, time: string): string {
  const parsed = parseIsoDate(date);
  const dateLabel = parsed.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });
  return `${dateLabel} · ${time}`;
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
    <div className="space-y-1">
      <p className="text-[13px] font-medium leading-snug tracking-tight">
        {getContentRoleLabel(roleId)} · {getSlotTopicLabel(slot)} ·{" "}
        {getSlotPublicationTypeShortLabel(slot)}
      </p>
      <p className="flex min-w-0 flex-wrap items-center gap-x-1.5 text-[11px] text-muted-foreground">
        <span>{getSlotAccountLabel(slot, studioAccounts)}</span>
        <span aria-hidden>·</span>
        <span>{formatSlotDateTime(slot.date, slot.time)}</span>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1">
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
          {platformLabel}
        </span>
        <span aria-hidden>·</span>
        <span>{cameraPresenceShortLabel(productionMode)}</span>
      </p>
    </div>
  );
}
