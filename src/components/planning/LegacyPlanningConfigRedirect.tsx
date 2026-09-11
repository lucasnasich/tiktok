import { Navigate, useLocation } from "react-router-dom";

import { PlanningScreen } from "@/screens/PlanningScreen";

/** Compat: `/planificacion?config=1` → `/planificacion/configuracion` */
export function LegacyPlanningConfigRedirect() {
  const location = useLocation();

  if (location.search.includes("config=1")) {
    const params = new URLSearchParams(location.search);
    params.delete("config");
    const search = params.toString();
    return (
      <Navigate
        to={{
          pathname: "/planificacion/configuracion",
          search: search ? `?${search}` : "",
        }}
        replace
      />
    );
  }

  return <PlanningScreen />;
}
