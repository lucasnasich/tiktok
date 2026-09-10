import { ArrowsDownUpIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  COMPETITOR_SORT,
  type CompetitorSortId,
} from "@/content/competitor-view";

export function CompetitorSortFilter({
  value,
  onChange,
}: {
  value: CompetitorSortId;
  onChange: (sort: CompetitorSortId) => void;
}) {
  const active = COMPETITOR_SORT[value];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-auto shrink-0 gap-1.5 px-2.5 text-xs font-medium whitespace-nowrap"
        >
          <ArrowsDownUpIcon className="size-3.5 shrink-0" />
          <span>{active.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => onChange(next as CompetitorSortId)}
        >
          {Object.values(COMPETITOR_SORT).map((mode) => (
            <DropdownMenuRadioItem key={mode.id} value={mode.id}>
              <span className="flex flex-col gap-0.5">
                <span>{mode.label}</span>
                <span className="text-[11px] font-normal text-muted-foreground">
                  {mode.description}
                </span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
