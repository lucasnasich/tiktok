import { UsersIcon } from "@phosphor-icons/react";

import { PlatformIcon } from "@/components/icons/platform-icon";
import { PlanningToolbarButton } from "@/components/planning/PlanningToolbarButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PLANNING_ALL_ACCOUNTS_ID } from "@/content/planning-accounts";
import {
  studioAccountSocialLabel,
  type PlanningStudioAccount,
} from "@/content/planning-studio-accounts";

function AccountFilterOption({
  account,
}: {
  account: PlanningStudioAccount;
}) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <PlatformIcon
        platform={account.platform}
        className="size-3.5 shrink-0 text-muted-foreground"
      />
      <span className="truncate">{studioAccountSocialLabel(account)}</span>
    </span>
  );
}

export function PlanningAccountFilter({
  value,
  onChange,
  accounts,
}: {
  value: string;
  onChange: (accountId: string) => void;
  accounts: PlanningStudioAccount[];
}) {
  const activeAccount = accounts.find((account) => account.id === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <PlanningToolbarButton className="max-w-[220px]">
          {value === PLANNING_ALL_ACCOUNTS_ID || !activeAccount ? (
            <>
              <UsersIcon className="size-3.5 shrink-0" />
              <span className="truncate">Todas las cuentas</span>
            </>
          ) : (
            <>
              <PlatformIcon
                platform={activeAccount.platform}
                className="size-3.5 shrink-0"
              />
              <span className="truncate">
                {studioAccountSocialLabel(activeAccount)}
              </span>
            </>
          )}
        </PlanningToolbarButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          <DropdownMenuRadioItem value={PLANNING_ALL_ACCOUNTS_ID}>
            <span className="flex items-center gap-2">
              <UsersIcon className="size-3.5 shrink-0 text-muted-foreground" />
              Todas las cuentas
            </span>
          </DropdownMenuRadioItem>
          {accounts.map((account) => (
            <DropdownMenuRadioItem key={account.id} value={account.id}>
              <AccountFilterOption account={account} />
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
