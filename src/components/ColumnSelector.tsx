import { GridFourIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const COLUMN_OPTIONS = [
  { value: 3, label: "3 columnas" },
  { value: 4, label: "4 columnas" },
] as const;

export type ColumnCount = (typeof COLUMN_OPTIONS)[number]["value"];

type ColumnSelectorProps = {
  value: ColumnCount;
  onChange: (value: ColumnCount) => void;
};

export function ColumnSelector({ value, onChange }: ColumnSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-sm" aria-label="Columnas">
          <GridFourIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuRadioGroup
          value={String(value)}
          onValueChange={(next) => onChange(Number(next) as ColumnCount)}
        >
          {COLUMN_OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={String(option.value)}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
