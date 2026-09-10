import type { ColumnCount } from "@/components/ColumnSelector";
import { InspirationLinkCard } from "@/components/ideas/InspirationLinkCard";
import { inspirationGridClass } from "@/components/ideas/inspiration-layout";
import { creativeInspirations } from "@/content/creative-inspirations";
import { getSourceLabel } from "@/content/idea-sources";
import { matchesFormatFilter } from "@/content/formats";

const SOURCE_LABEL = getSourceLabel("creativo");

export function CreativeInspirationPanel({
  columns,
  activeFormat,
  onOpenReference,
}: {
  columns: ColumnCount;
  activeFormat?: string;
  onOpenReference?: (key: string) => void;
}) {
  const items = creativeInspirations.filter((item) =>
    matchesFormatFilter(item.formatIds, activeFormat ?? "all"),
  );

  if (creativeInspirations.length === 0) {
    return (
      <p className="px-5 text-[14px] leading-relaxed text-muted-foreground">
        Todavía no hay referencias creativas guardadas.
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="px-5 text-[14px] leading-relaxed text-muted-foreground">
        Ninguna referencia con ese formato.
      </p>
    );
  }

  return (
    <div className={inspirationGridClass(columns)}>
      {items.map((item) => (
        <InspirationLinkCard
          key={item.id}
          item={{ ...item, sourceLabel: SOURCE_LABEL }}
          onOpen={
            onOpenReference ? () => onOpenReference(`creativo:${item.id}`) : undefined
          }
        />
      ))}
    </div>
  );
}
