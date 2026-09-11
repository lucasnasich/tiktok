import type { ColumnCount } from "@/components/ColumnSelector";
import { AllInspirationsPanel } from "@/components/ideas/AllInspirationsPanel";
import { buildInspirationFeed } from "@/content/inspiration-feed";
import type {
  InspirationMediaTypeFilterId,
  InspirationPlatformFilterId,
} from "@/content/inspiration-browse-filters";
import { filterInspirationFeed } from "@/content/inspiration-browse-filters";

type InspirationPanelProps = {
  platformFilter: InspirationPlatformFilterId;
  mediaTypeFilter: InspirationMediaTypeFilterId;
  columns: ColumnCount;
  onOpenReference?: (key: string) => void;
};

export function InspirationPanel({
  platformFilter,
  mediaTypeFilter,
  columns,
  onOpenReference,
}: InspirationPanelProps) {
  const feedItems = filterInspirationFeed(
    buildInspirationFeed(),
    platformFilter,
    mediaTypeFilter,
  );

  return (
    <AllInspirationsPanel
      columns={columns}
      items={feedItems}
      onOpenReference={onOpenReference}
    />
  );
}
