import type { Icon } from "@phosphor-icons/react";
import {
  BookOpenIcon,
  CalendarBlankIcon,
  ImagesIcon,
  LightbulbIcon,
  SparkleIcon,
  TargetIcon,
} from "@phosphor-icons/react";
import { NavLink, useLocation } from "react-router-dom";

import { MercantisIconBold } from "@/components/MercantisIcon";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const MAIN_NAV = [
  { to: "/planificacion", label: "Planificación", icon: CalendarBlankIcon, end: true },
  { to: "/", label: "Ideas", icon: LightbulbIcon, end: true },
  { to: "/inspiracion", label: "Inspiración", icon: SparkleIcon, end: true },
  { to: "/imagenes", label: "Imágenes", icon: ImagesIcon, end: true },
  { to: "/competidores", label: "Competidores", icon: TargetIcon, end: true },
] as const;

const DOCS_NAV = {
  to: "/documentacion",
  label: "Documentación",
  icon: BookOpenIcon,
  end: false,
} as const;

function NavItem({
  to,
  label,
  icon: Icon,
  end = false,
}: {
  to: string;
  label: string;
  icon: Icon;
  end?: boolean;
}) {
  const location = useLocation();
  const isActive = end
    ? location.pathname === to
    : location.pathname.startsWith(to);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <NavLink to={to} end={end}>
          <Icon className="size-4" />
          <span>{label}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="none" className="h-svh shrink-0 overflow-hidden border-r border-sidebar-border">
      <SidebarHeader className="relative h-[var(--header-height)] justify-center px-3">
        <div className="flex min-w-0 items-center gap-2 px-1">
          <MercantisIconBold className="size-5 shrink-0 text-foreground" />
          <span className="truncate text-[15px] font-semibold tracking-tight text-foreground">
            Studio
          </span>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sidebar-border to-transparent"
        />
      </SidebarHeader>

      <SidebarContent className="overflow-hidden px-2 py-3">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {MAIN_NAV.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto shrink-0 gap-0 p-0 px-2 pb-2">
        <div
          aria-hidden
          className="pointer-events-none mb-3 h-px bg-gradient-to-r from-transparent via-sidebar-border to-transparent"
        />
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem {...DOCS_NAV} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
