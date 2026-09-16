import { MoonIcon, SunIcon } from "@phosphor-icons/react";

import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const TOGGLE_CLASSNAME =
  "text-sidebar-foreground/70 data-[active=true]:bg-sidebar-active data-[active=true]:font-medium data-[active=true]:text-sidebar-active-foreground data-[active=true]:shadow-[inset_0_0_0_1px_var(--sidebar-border)]";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const Icon = isDark ? MoonIcon : SunIcon;
  const label = isDark ? "Oscuro" : "Claro";
  const nextLabel = isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro";

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        type="button"
        className={cn(TOGGLE_CLASSNAME, className)}
        aria-label={nextLabel}
        aria-pressed={isDark}
        title={nextLabel}
        onClick={toggleTheme}
      >
        <Icon className="size-4" />
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
