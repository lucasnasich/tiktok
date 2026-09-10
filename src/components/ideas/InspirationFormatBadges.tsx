import { Badge } from "@/components/ui/badge";
import { getFormatLabel } from "@/content/formats";

const badgeClassName =
  "h-5 border-0 bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground hover:bg-muted";

export function InspirationFormatBadges({
  formatIds,
}: {
  formatIds?: string[];
}) {
  if (!formatIds?.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {formatIds.map((formatId) => (
        <Badge key={formatId} variant="secondary" className={badgeClassName}>
          {getFormatLabel(formatId)}
        </Badge>
      ))}
    </div>
  );
}
