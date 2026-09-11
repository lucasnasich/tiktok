import { Badge } from "@/components/ui/badge";
import { PlatformIcon } from "@/components/icons/platform-icon";

export function InspirationMediaBadges({ platform }: { platform: string }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <PlatformIcon
        platform={platform}
        size={14}
        className="shrink-0 text-foreground"
        aria-label={platform}
      />
      <Badge
        variant="secondary"
        className="h-5 gap-1 border-0 bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground hover:bg-muted"
      >
        {platform}
      </Badge>
    </div>
  );
}
