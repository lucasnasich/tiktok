import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PLANNING_VIEW } from "@/content/planning-view";

export function PlanningViewTabs() {
  return (
    <TabsList className="h-8">
      {Object.values(PLANNING_VIEW).map((view) => (
        <TabsTrigger key={view.id} value={view.id} className="px-2.5 text-xs">
          {view.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
