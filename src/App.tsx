import { IconContext } from "@phosphor-icons/react";
import type { CSSProperties } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { PHOSPHOR_ICON_DEFAULTS } from "@/components/icons/icon-defaults";

import { AppSidebar } from "@/components/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CompetitorsScreen } from "@/screens/CompetitorsScreen";
import { GalleryScreen } from "@/screens/GalleryScreen";
import { DocsScreen } from "@/screens/DocsScreen";
import { IdeasScreen } from "@/screens/IdeasScreen";
import { InspirationScreen } from "@/screens/InspirationScreen";
import { PlanningScreen } from "@/screens/PlanningScreen";

export function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <IconContext.Provider value={PHOSPHOR_ICON_DEFAULTS}>
        <SidebarProvider
          className="h-svh overflow-hidden"
          style={
            {
              "--sidebar-width": "200px",
              "--header-height": "3.5rem",
            } as CSSProperties
          }
        >
          <AppSidebar />
          <SidebarInset className="flex h-svh min-h-0 flex-1 flex-col overflow-hidden bg-secondary">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <Routes>
                <Route path="/planificacion" element={<PlanningScreen />} />
                <Route path="/" element={<IdeasScreen />} />
                <Route path="/inspiracion" element={<InspirationScreen />} />
                <Route path="/imagenes" element={<GalleryScreen />} />
                <Route path="/competidores" element={<CompetitorsScreen />} />
                <Route path="/documentacion" element={<DocsScreen />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </SidebarInset>
        </SidebarProvider>
        </IconContext.Provider>
      </TooltipProvider>
    </BrowserRouter>
  );
}
