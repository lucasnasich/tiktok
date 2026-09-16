import { useEffect, useState } from "react";
import type { Icon } from "@phosphor-icons/react";
import {
  BookOpenIcon,
  CalendarBlankIcon,
  CaretRightIcon,
  HouseIcon,
  LightbulbIcon,
  SparkleIcon,
  StackIcon,
} from "@phosphor-icons/react";
import { NavLink, useLocation } from "react-router-dom";

import { MercantisIconBold } from "@/components/MercantisIcon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

type NavChild = {
  to: string;
  label: string;
  end?: boolean;
};

type NavEntry = {
  to: string;
  label: string;
  icon: Icon;
  end?: boolean;
  children?: NavChild[];
};

const MAIN_NAV: NavEntry[] = [
  { to: "/inicio", label: "Inicio", icon: HouseIcon, end: true },
  {
    to: "/inspiracion",
    label: "Inspiración",
    icon: SparkleIcon,
    children: [
      { to: "/inspiracion", label: "Referencias", end: true },
      { to: "/inspiracion/competidores", label: "Competidores", end: true },
    ],
  },
  {
    to: "/planificacion",
    label: "Planificación",
    icon: CalendarBlankIcon,
    children: [
      { to: "/planificacion", label: "Calendario", end: true },
      {
        to: "/planificacion/configuracion",
        label: "Configuración",
        end: true,
      },
    ],
  },
  { to: "/propuestas", label: "Propuestas", icon: LightbulbIcon, end: true },
  {
    to: "/produccion",
    label: "Producción",
    icon: StackIcon,
    children: [{ to: "/produccion/imagenes", label: "Imágenes", end: true }],
  },
];

const DOCS_NAV = {
  to: "/documentacion",
  label: "Documentación",
  icon: BookOpenIcon,
  end: false,
} as const;

const NAV_ITEM_CLASSNAME =
  "text-sidebar-foreground/70 data-[active=true]:bg-sidebar-active data-[active=true]:font-medium data-[active=true]:text-sidebar-active-foreground data-[active=true]:shadow-[inset_0_0_0_1px_var(--sidebar-border)]";

const NAV_SECTION_CLASSNAME = cn(
  NAV_ITEM_CLASSNAME,
  "data-[active=true]:!bg-sidebar-active data-[active=true]:!text-sidebar-active-foreground",
);

const NAV_SUB_ITEM_CLASSNAME = cn(
  "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  "data-[active=true]:!bg-transparent data-[active=true]:!font-medium data-[active=true]:!text-foreground data-[active=true]:!shadow-none",
  "data-[active=true]:hover:!bg-transparent data-[active=true]:hover:!text-foreground",
);

function pathMatches(pathname: string, to: string, end = false) {
  if (end) return pathname === to;
  return pathname === to || pathname.startsWith(`${to}/`);
}

function isSidebarNavSectionPathActive(
  pathname: string,
  sectionTo: string,
  subItems: NavChild[],
) {
  if (subItems.some((subItem) => pathMatches(pathname, subItem.to, subItem.end ?? true))) {
    return true;
  }

  return pathMatches(pathname, sectionTo, false);
}

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
  const isActive = pathMatches(location.pathname, to, end);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} className={NAV_ITEM_CLASSNAME}>
        <NavLink to={to} end={end}>
          <Icon className="size-4" />
          <span>{label}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function NestedNavItem({
  item,
  isOpen,
  onOpenChange,
}: {
  item: NavEntry;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const location = useLocation();
  const children = item.children ?? [];
  const sectionActive = isSidebarNavSectionPathActive(
    location.pathname,
    item.to,
    children,
  );

  const handleToggle = () => {
    onOpenChange(!isOpen);
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <SidebarMenuButton
          type="button"
          isActive={sectionActive}
          aria-expanded={isOpen}
          aria-label={isOpen ? `Contraer ${item.label}` : `Expandir ${item.label}`}
          className={NAV_SECTION_CLASSNAME}
          onClick={handleToggle}
        >
          <item.icon className="size-4" />
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          <CaretRightIcon
            className={cn(
              "ml-auto size-4 shrink-0 transition-transform duration-200",
              isOpen && "rotate-90",
            )}
          />
        </SidebarMenuButton>

        <CollapsibleContent>
          <SidebarMenuSub className="border-l-0 ml-3.5 w-[calc(100%-0.875rem)] pl-2.5 pr-0">
            {children.map((child) => {
              const childActive = pathMatches(
                location.pathname,
                child.to,
                child.end ?? true,
              );

              return (
                <SidebarMenuSubItem key={child.to} className="w-full">
                  <SidebarMenuSubButton
                    asChild
                    isActive={childActive}
                    size="sm"
                    className={NAV_SUB_ITEM_CLASSNAME}
                  >
                    <NavLink to={child.to} end={child.end}>
                      <span>{child.label}</span>
                    </NavLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const [openAccordionTo, setOpenAccordionTo] = useState<string | null>(null);

  useEffect(() => {
    for (const item of MAIN_NAV) {
      if (!item.children?.length) continue;

      const subItems = item.children ?? [];
      if (isSidebarNavSectionPathActive(location.pathname, item.to, subItems)) {
        setOpenAccordionTo(item.to);
        return;
      }
    }
  }, [location.pathname]);

  const handleAccordionOpenChange = (sectionTo: string, nextOpen: boolean) => {
    if (nextOpen) {
      setOpenAccordionTo(sectionTo);
      return;
    }

    setOpenAccordionTo((current) => (current === sectionTo ? null : current));
  };

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

      <SidebarContent className="overflow-y-auto px-2 py-3">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {MAIN_NAV.map((item) =>
                item.children?.length ? (
                  <NestedNavItem
                    key={item.to}
                    item={item}
                    isOpen={openAccordionTo === item.to}
                    onOpenChange={(nextOpen) =>
                      handleAccordionOpenChange(item.to, nextOpen)
                    }
                  />
                ) : (
                  <NavItem key={item.to} {...item} />
                ),
              )}
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
              <ThemeToggle />
              <NavItem {...DOCS_NAV} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
