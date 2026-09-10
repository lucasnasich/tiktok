import { useMemo } from "react";

import { Playground } from "@/components/AppShell";
import { PlanningAccountFilter } from "@/components/planning/PlanningAccountFilter";
import { PlanningCalendar } from "@/components/planning/PlanningCalendar";
import { PlanningGapsPanel } from "@/components/planning/PlanningGapsPanel";
import { PlanningPeriodNav } from "@/components/planning/PlanningPeriodNav";
import { PlanningViewTabs } from "@/components/planning/PlanningViewTabs";
import { Tabs } from "@/components/ui/tabs";
import { PLANNING_VIEW, type PlanningViewId } from "@/content/planning-view";
import { plannedSlots } from "@/content/planned-slots";
import { usePersistedState } from "@/hooks/use-persisted-state";
import {
  computePlanningInsights,
  filterSlotsByAccount,
  filterSlotsByDates,
  formatPeriodLabel,
  getDatesForView,
  getMonthCalendarDays,
  navigateFocusDate,
  parseIsoDate,
  startOfWeek,
  toIsoDate,
} from "@/lib/planning";
import {
  STUDIO_PREFERENCE_DEFAULTS,
  STUDIO_PREFERENCE_KEYS,
  parsePlanningAccount,
  parsePlanningView,
  parsePlanningWeekStart,
} from "@/lib/studio-preferences";

export function PlanningScreen() {
  const today = useMemo(() => new Date(), []);
  const todayIso = toIsoDate(today);
  const defaultFocusIso = toIsoDate(startOfWeek(today));

  const [accountId, setAccountId] = usePersistedState(
    STUDIO_PREFERENCE_KEYS.planningAccount,
    STUDIO_PREFERENCE_DEFAULTS.planningAccount,
    parsePlanningAccount,
  );
  const [focusDateIso, setFocusDateIso] = usePersistedState(
    STUDIO_PREFERENCE_KEYS.planningWeekStart,
    defaultFocusIso,
    parsePlanningWeekStart,
  );
  const [view, setView] = usePersistedState<PlanningViewId>(
    STUDIO_PREFERENCE_KEYS.planningView,
    STUDIO_PREFERENCE_DEFAULTS.planningView as PlanningViewId,
    (raw) => parsePlanningView(raw) as PlanningViewId | undefined,
  );

  const focusDate = useMemo(
    () => parseIsoDate(focusDateIso),
    [focusDateIso],
  );
  const dates = useMemo(
    () => getDatesForView(view, focusDate),
    [view, focusDate],
  );
  const monthDays = useMemo(
    () => getMonthCalendarDays(focusDate),
    [focusDate],
  );

  const visibleSlots = useMemo(() => {
    const inRange = filterSlotsByDates(plannedSlots, dates);
    return filterSlotsByAccount(inRange, accountId);
  }, [accountId, dates]);

  const insights = useMemo(
    () =>
      computePlanningInsights({
        slots: plannedSlots,
        rangeDates: dates,
        todayIso,
        accountFilter: accountId,
      }),
    [accountId, dates, todayIso],
  );

  const periodLabel = formatPeriodLabel(view, focusDate);
  const meta = `${visibleSlots.length} slots · ${periodLabel}`;

  function shiftPeriod(direction: -1 | 1) {
    setFocusDateIso(
      toIsoDate(navigateFocusDate(view, focusDate, direction)),
    );
  }

  return (
    <Tabs
      value={view}
      onValueChange={(next) => setView(next as PlanningViewId)}
      className="flex h-full min-h-0 flex-1 flex-col"
    >
      <Playground
        title="Planificación"
        meta={meta}
        fullWidth
        actions={
          <div className="flex items-center gap-2">
            <PlanningViewTabs />
            <PlanningPeriodNav
              periodLabel={periodLabel}
              onPrevious={() => shiftPeriod(-1)}
              onNext={() => shiftPeriod(1)}
              onToday={() => {
                if (view === PLANNING_VIEW.month.id) {
                  setFocusDateIso(todayIso);
                  return;
                }
                if (view === PLANNING_VIEW.day.id) {
                  setFocusDateIso(todayIso);
                  return;
                }
                setFocusDateIso(toIsoDate(startOfWeek(today)));
              }}
            />
            <PlanningAccountFilter value={accountId} onChange={setAccountId} />
          </div>
        }
      >
        <div className="flex min-h-full flex-col">
          <div className="shrink-0 border-b border-border px-5 py-4">
            <PlanningGapsPanel insights={insights} />
          </div>
          <div className="min-h-0 flex-1">
            <PlanningCalendar
              view={view}
              dates={dates}
              monthDays={monthDays}
              slots={visibleSlots}
              todayIso={todayIso}
            />
          </div>
        </div>
      </Playground>
    </Tabs>
  );
}
