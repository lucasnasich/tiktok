import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PLANNING_MODE } from "@/content/planning-mode";

export function PlanningModeTabs() {
  return (
    <TabsList className="h-8">
      <TabsTrigger
        value={PLANNING_MODE.calendar.id}
        className="px-2.5 text-xs"
      >
        {PLANNING_MODE.calendar.label}
      </TabsTrigger>
      <TabsTrigger value={PLANNING_MODE.config.id} className="px-2.5 text-xs">
        {PLANNING_MODE.config.label}
      </TabsTrigger>
    </TabsList>
  );
}
