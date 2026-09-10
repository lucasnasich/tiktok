import { IconContext } from "@phosphor-icons/react";
import type { CSSProperties } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

import { PHOSPHOR_ICON_DEFAULTS } from "@/components/icons/icon-defaults";

import { AppSidebar } from "@/components/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CompetitorsScreen } from "@/screens/CompetitorsScreen";
import { GalleryScreen } from "@/screens/GalleryScreen";
import { DocsScreen } from "@/screens/DocsScreen";
import { InspirationScreen } from "@/screens/InspirationScreen";
import { PlanningScreen } from "@/screens/PlanningScreen";
import { ProposalsScreen } from "@/screens/ProposalsScreen";
import { ProposalsProvider } from "@/hooks/use-proposals";
import { SlotSpecsProvider } from "@/hooks/use-slot-specs";
import { InspirationOverridesProvider } from "@/hooks/use-inspiration-overrides";

function LegacyIdeasRedirect() {
  const location = useLocation();
  return (
    <Navigate
      to={{ pathname: "/propuestas", search: location.search }}
      replace
    />
  );
}

export function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <IconContext.Provider value={PHOSPHOR_ICON_DEFAULTS}>
        <ProposalsProvider>
        <SlotSpecsProvider>
        <InspirationOverridesProvider>
        <SidebarProvider
          className="h-svh overflow-hidden"
          style={
            {
              "--sidebar-width": "180px",
              "--header-height": "3.5rem",
            } as CSSProperties
          }
        >
          <AppSidebar />
          <SidebarInset className="flex h-svh min-h-0 flex-1 flex-col overflow-hidden bg-secondary">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <Routes>
                <Route path="/inspiracion" element={<InspirationScreen />} />
                <Route
                  path="/inspiracion/competidores"
                  element={<CompetitorsScreen />}
                />
                <Route path="/planificacion" element={<PlanningScreen />} />
                <Route path="/propuestas" element={<ProposalsScreen />} />
                <Route path="/ideas" element={<LegacyIdeasRedirect />} />
                <Route
                  path="/produccion"
                  element={<Navigate to="/produccion/imagenes" replace />}
                />
                <Route
                  path="/produccion/imagenes"
                  element={<GalleryScreen />}
                />
                <Route path="/documentacion" element={<DocsScreen />} />
                <Route path="/" element={<Navigate to="/inspiracion" replace />} />
                <Route
                  path="/competidores"
                  element={<Navigate to="/inspiracion/competidores" replace />}
                />
                <Route
                  path="/imagenes"
                  element={<Navigate to="/produccion/imagenes" replace />}
                />
                <Route path="*" element={<Navigate to="/inspiracion" replace />} />
              </Routes>
            </div>
          </SidebarInset>
        </SidebarProvider>
        </InspirationOverridesProvider>
        </SlotSpecsProvider>
        </ProposalsProvider>
        </IconContext.Provider>
      </TooltipProvider>
    </BrowserRouter>
  );
}
