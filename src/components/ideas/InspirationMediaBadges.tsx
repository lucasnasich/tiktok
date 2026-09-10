import { Badge } from "@/components/ui/badge";
import { PlatformIcon } from "@/components/icons/platform-icon";

type InspirationMediaBadgesProps = {
  platform: string;
  sourceLabel?: string;
};

const badgeClassName =
  "h-5 gap-1 border-0 bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground hover:bg-muted";

export function InspirationMediaBadges({
  platform,
  sourceLabel,
}: InspirationMediaBadgesProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <PlatformIcon
        platform={platform}
        size={14}
        className="shrink-0 text-foreground"
        aria-label={platform}
      />
      {sourceLabel ? (
        <Badge variant="secondary" className={badgeClassName}>
          {sourceLabel}
        </Badge>
      ) : null}
    </div>
  );
}
