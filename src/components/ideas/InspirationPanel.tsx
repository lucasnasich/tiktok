import type { ColumnCount } from "@/components/ColumnSelector";
import { AllInspirationsPanel } from "@/components/ideas/AllInspirationsPanel";
import { buildInspirationFeed } from "@/content/inspiration-feed";
import type {
  InspirationMediaTypeFilterId,
  InspirationPlatformFilterId,
} from "@/content/inspiration-browse-filters";
import { filterInspirationFeed } from "@/content/inspiration-browse-filters";
import type { InspirationMetaOverride } from "@/lib/inspiration-overrides-store";

type InspirationPanelProps = {
  platformFilter: InspirationPlatformFilterId;
  mediaTypeFilter: InspirationMediaTypeFilterId;
  columns: ColumnCount;
  overrides?: Record<string, InspirationMetaOverride>;
  onOpenReference?: (key: string) => void;
};

export function InspirationPanel({
  platformFilter,
  mediaTypeFilter,
  columns,
  overrides,
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
      overrides={overrides}
      onOpenReference={onOpenReference}
    />
  );
}
