import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";

import { InspirationBrowseFilters } from "@/components/ideas/InspirationBrowseFilters";
import { InspirationPanel } from "@/components/ideas/InspirationPanel";
import { Button } from "@/components/ui/button";
import {
  INSPIRATION_ALL_MEDIA_TYPES_ID,
  INSPIRATION_ALL_PLATFORMS_ID,
  type InspirationMediaTypeFilterId,
  type InspirationPlatformFilterId,
} from "@/content/inspiration-browse-filters";
export function SlotInspirationBrowse({
  slotId,
  onOpenReference,
}: {
  slotId: string;
  onOpenReference: (key: string) => void;
}) {
  const [platformFilter, setPlatformFilter] =
    useState<InspirationPlatformFilterId>(INSPIRATION_ALL_PLATFORMS_ID);
  const [mediaTypeFilter, setMediaTypeFilter] =
    useState<InspirationMediaTypeFilterId>(INSPIRATION_ALL_MEDIA_TYPES_ID);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <InspirationBrowseFilters
          platform={platformFilter}
          mediaType={mediaTypeFilter}
          onPlatformChange={setPlatformFilter}
          onMediaTypeChange={setMediaTypeFilter}
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="ml-auto h-7 text-xs"
          asChild
        >
          <Link to={`/inspiracion?slot=${encodeURIComponent(slotId)}`}>
            <ArrowSquareOutIcon className="size-3.5" />
            Biblioteca completa
          </Link>
        </Button>
      </div>
      <InspirationPanel
        platformFilter={platformFilter}
        mediaTypeFilter={mediaTypeFilter}
        columns={3}
        onOpenReference={onOpenReference}
      />
    </div>
  );
}
