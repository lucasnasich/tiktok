import { TagIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  formats,
  getFormatLabel,
  INSPIRATION_ALL_FORMATS_ID,
} from "@/content/formats";

const ALL_FORMATS_LABEL = "Todos";

export function InspirationFormatFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (formatId: string) => void;
}) {
  const activeLabel =
    value === INSPIRATION_ALL_FORMATS_ID
      ? ALL_FORMATS_LABEL
      : getFormatLabel(value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label={`Formato: ${activeLabel}`}
        >
          <TagIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-[min(24rem,70vh)] min-w-52 overflow-y-auto">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          <DropdownMenuRadioItem value={INSPIRATION_ALL_FORMATS_ID}>
            {ALL_FORMATS_LABEL}
          </DropdownMenuRadioItem>
          {formats.map((format) => (
            <DropdownMenuRadioItem key={format.id} value={format.id}>
              {format.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
