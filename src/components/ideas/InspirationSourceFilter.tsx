import { ListFilter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IDEA_SOURCES,
  INSPIRATION_ALL_SOURCE,
} from "@/content/idea-sources";

export function InspirationSourceFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (sourceId: string) => void;
}) {
  const activeLabel = getSourceLabel(value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label={`Fuente: ${activeLabel}`}
        >
          <ListFilter className="size-4" strokeWidth={1.75} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          <DropdownMenuRadioItem value={INSPIRATION_ALL_SOURCE.id}>
            {INSPIRATION_ALL_SOURCE.label}
          </DropdownMenuRadioItem>
          {IDEA_SOURCES.map((source) => (
            <DropdownMenuRadioItem key={source.id} value={source.id}>
              {source.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getSourceLabel(id: string) {
  if (id === INSPIRATION_ALL_SOURCE.id) return INSPIRATION_ALL_SOURCE.label;
  return IDEA_SOURCES.find((source) => source.id === id)?.label ?? id;
}
