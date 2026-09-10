import { UsersIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getPlanningAccountLabel,
  type PlanningAccount,
} from "@/content/planning-accounts";
import { getPlanningAccountOptions } from "@/lib/planning";

export function PlanningAccountFilter({
  value,
  onChange,
  accounts,
}: {
  value: string;
  onChange: (accountId: string) => void;
  accounts?: PlanningAccount[];
}) {
  const options = getPlanningAccountOptions(accounts);
  const activeLabel = getPlanningAccountLabel(value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs font-medium"
        >
          <UsersIcon className="size-3.5" />
          <span className="whitespace-nowrap">{activeLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.id} value={option.id}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
