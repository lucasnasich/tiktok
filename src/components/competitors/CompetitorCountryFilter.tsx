import { GlobeHemisphereWestIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCountryFlag } from "@/content/competitor-flags";
import { COMPETITOR_ALL_COUNTRIES } from "@/content/competitor-view";

type CountryOption = {
  id: string;
  label: string;
};

export function CompetitorCountryFilter({
  value,
  options,
  onChange,
}: {
  value: string;
  options: CountryOption[];
  onChange: (countryId: string) => void;
}) {
  const activeLabel =
    options.find((option) => option.id === value)?.label ?? value;
  const activeFlag =
    value !== COMPETITOR_ALL_COUNTRIES.id ? getCountryFlag(value) : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs font-medium"
        >
          {activeFlag ? (
            <span className="text-sm leading-none" aria-hidden>
              {activeFlag}
            </span>
          ) : (
            <GlobeHemisphereWestIcon className="size-3.5" />
          )}
          <span className="whitespace-nowrap">{activeLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-52 max-h-[min(32rem,calc(100vh-6rem))] overflow-y-auto"
      >
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((option) => {
            const flag =
              option.id !== COMPETITOR_ALL_COUNTRIES.id
                ? getCountryFlag(option.id)
                : null;

            return (
              <DropdownMenuRadioItem key={option.id} value={option.id}>
                <span className="flex items-center gap-2">
                  {flag ? (
                    <span className="text-sm leading-none" aria-hidden>
                      {flag}
                    </span>
                  ) : (
                    <GlobeHemisphereWestIcon className="size-3.5 text-muted-foreground" />
                  )}
                  {option.label}
                </span>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
