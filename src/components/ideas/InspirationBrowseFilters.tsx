import { ImageIcon, TextAaIcon } from "@phosphor-icons/react";

import { PlatformIcon } from "@/components/icons/platform-icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  INSPIRATION_ALL_MEDIA_TYPES_ID,
  INSPIRATION_ALL_PLATFORMS_ID,
  INSPIRATION_MEDIA_TYPE_FILTERS,
  INSPIRATION_PLATFORM_FILTERS,
  type InspirationMediaTypeFilterId,
  type InspirationPlatformFilterId,
} from "@/content/inspiration-browse-filters";

export function InspirationBrowseFilters({
  platform,
  mediaType,
  onPlatformChange,
  onMediaTypeChange,
}: {
  platform: InspirationPlatformFilterId;
  mediaType: InspirationMediaTypeFilterId;
  onPlatformChange: (value: InspirationPlatformFilterId) => void;
  onMediaTypeChange: (value: InspirationMediaTypeFilterId) => void;
}) {
  const platformLabel =
    INSPIRATION_PLATFORM_FILTERS.find((entry) => entry.id === platform)?.label ??
    "Red";
  const mediaTypeLabel =
    INSPIRATION_MEDIA_TYPE_FILTERS.find((entry) => entry.id === mediaType)
      ?.label ?? "Tipo";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            aria-label={`Red: ${platformLabel}`}
          >
            <PlatformIcon platform="Instagram" size={14} className="opacity-70" />
            {platform === INSPIRATION_ALL_PLATFORMS_ID ? "Red" : platformLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-40">
          <DropdownMenuRadioGroup
            value={platform}
            onValueChange={(value) =>
              onPlatformChange(value as InspirationPlatformFilterId)
            }
          >
            {INSPIRATION_PLATFORM_FILTERS.map((entry) => (
              <DropdownMenuRadioItem key={entry.id} value={entry.id}>
                {entry.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            aria-label={`Tipo: ${mediaTypeLabel}`}
          >
            {mediaType === "written" ? (
              <TextAaIcon className="size-3.5 opacity-70" />
            ) : (
              <ImageIcon className="size-3.5 opacity-70" />
            )}
            {mediaType === INSPIRATION_ALL_MEDIA_TYPES_ID ? "Tipo" : mediaTypeLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-44">
          <DropdownMenuRadioGroup
            value={mediaType}
            onValueChange={(value) =>
              onMediaTypeChange(value as InspirationMediaTypeFilterId)
            }
          >
            {INSPIRATION_MEDIA_TYPE_FILTERS.map((entry) => (
              <DropdownMenuRadioItem key={entry.id} value={entry.id}>
                {entry.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
