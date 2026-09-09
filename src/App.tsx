import type { CSSProperties } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppSidebar } from "@/components/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GalleryScreen } from "@/screens/GalleryScreen";
import { DocsScreen } from "@/screens/DocsScreen";
import { IdeasScreen } from "@/screens/IdeasScreen";

export function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <SidebarProvider
          className="h-svh overflow-hidden"
          style={
            {
              "--sidebar-width": "230px",
              "--header-height": "3.5rem",
            } as CSSProperties
          }
        >
          <AppSidebar />
          <SidebarInset className="flex h-svh min-h-0 flex-1 flex-col overflow-hidden bg-secondary">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <Routes>
                <Route path="/" element={<IdeasScreen />} />
                <Route path="/imagenes" element={<GalleryScreen />} />
                <Route path="/documentacion" element={<DocsScreen />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </BrowserRouter>
  );
}
