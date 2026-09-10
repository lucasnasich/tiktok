import { useEffect, useMemo } from "react";

import { Playground } from "@/components/AppShell";
import { PlanningAccountFilter } from "@/components/planning/PlanningAccountFilter";
import { PlanningCalendar } from "@/components/planning/PlanningCalendar";
import { PlanningConfigPanel } from "@/components/planning/PlanningConfigPanel";
import { PlanningGapsPanel } from "@/components/planning/PlanningGapsPanel";
import { PlanningModeTabs } from "@/components/planning/PlanningModeTabs";
import { PlanningViewFilter } from "@/components/planning/PlanningViewFilter";
import { SlotDetailSheet } from "@/components/planning/SlotDetailSheet";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { PLANNING_MODE, type PlanningModeId } from "@/content/planning-mode";
import type { PlanningViewId } from "@/content/planning-view";
import { plannedSlots, type PlanningSlot } from "@/content/planned-slots";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { usePlanningConfig } from "@/hooks/use-planning-config";
import { useSheetSearchParam } from "@/hooks/use-sheet-search-param";
import {
  getCalendarSlots,
  getPlanningHorizonSlots,
} from "@/lib/planning-generator";
import {
  computePlanningInsights,
  filterSlotsByAccount,
  filterSlotsByDates,
  formatPeriodLabel,
  getDatesForView,
  getMonthCalendarDays,
  parseIsoDate,
  startOfWeek,
  toIsoDate,
} from "@/lib/planning";
import {
  STUDIO_PREFERENCE_DEFAULTS,
  STUDIO_PREFERENCE_KEYS,
  parsePlanningAccount,
  parsePlanningMode,
  parsePlanningView,
  parsePlanningWeekStart,
} from "@/lib/studio-preferences";

export function PlanningScreen() {
  const planningConfig = usePlanningConfig();
  const { accounts: planningAccountsConfig } = planningConfig;
  const today = useMemo(() => new Date(), []);
  const todayIso = toIsoDate(today);
  const defaultFocusIso = toIsoDate(startOfWeek(today));

  const [mode, setMode] = usePersistedState<PlanningModeId>(
    STUDIO_PREFERENCE_KEYS.planningMode,
    STUDIO_PREFERENCE_DEFAULTS.planningMode as PlanningModeId,
    (raw) => parsePlanningMode(raw) as PlanningModeId | undefined,
  );
  const [accountId, setAccountId] = usePersistedState(
    STUDIO_PREFERENCE_KEYS.planningAccount,
    STUDIO_PREFERENCE_DEFAULTS.planningAccount,
    parsePlanningAccount,
  );
  const [focusDateIso] = usePersistedState(
    STUDIO_PREFERENCE_KEYS.planningWeekStart,
    defaultFocusIso,
    parsePlanningWeekStart,
  );
  const [view, setView] = usePersistedState<PlanningViewId>(
    STUDIO_PREFERENCE_KEYS.planningView,
    STUDIO_PREFERENCE_DEFAULTS.planningView as PlanningViewId,
    (raw) => parsePlanningView(raw) as PlanningViewId | undefined,
  );
  const [selectedSlotId, setSelectedSlotId] = useSheetSearchParam("slot");

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

  const calendarSlots = useMemo(() => {
    const from = dates[0];
    const to = dates[dates.length - 1];
    if (!from || !to) return [];
    return getCalendarSlots(
      plannedSlots,
      from,
      to,
      planningAccountsConfig,
    );
  }, [dates, planningAccountsConfig]);

  const horizonSlots = useMemo(
    () => getPlanningHorizonSlots(plannedSlots, planningAccountsConfig, todayIso),
    [planningAccountsConfig, todayIso],
  );

  const visibleSlots = useMemo(() => {
    const inRange = filterSlotsByDates(calendarSlots, dates);
    return filterSlotsByAccount(inRange, accountId);
  }, [accountId, calendarSlots, dates]);

  const insights = useMemo(
    () =>
      computePlanningInsights({
        slots: calendarSlots,
        accounts: planningAccountsConfig,
        rangeDates: dates,
        todayIso,
        accountFilter: accountId,
      }),
    [accountId, calendarSlots, dates, planningAccountsConfig, todayIso],
  );

  const selectedSlot = useMemo(
    () =>
      horizonSlots.find((slot) => slot.id === selectedSlotId) ??
      calendarSlots.find((slot) => slot.id === selectedSlotId),
    [calendarSlots, horizonSlots, selectedSlotId],
  );

  const siblingSlots = useMemo(() => {
    if (!selectedSlot) return [];
    return horizonSlots
      .filter((slot) => slot.accountId === selectedSlot.accountId)
      .sort(
        (a, b) =>
          a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
      );
  }, [horizonSlots, selectedSlot]);

  const siblingIndex = selectedSlot
    ? siblingSlots.findIndex((slot) => slot.id === selectedSlot.id)
    : -1;

  useEffect(() => {
    if (selectedSlotId && mode === PLANNING_MODE.config.id) {
      setMode(PLANNING_MODE.calendar.id);
    }
  }, [mode, selectedSlotId, setMode]);

  const periodLabel = formatPeriodLabel(view, focusDate);
  const meta =
    mode === PLANNING_MODE.config.id
      ? "Motor editorial"
      : `${visibleSlots.length} piezas · ${periodLabel}`;

  return (
    <Tabs
      value={mode}
      onValueChange={(next) => setMode(next as PlanningModeId)}
      className="flex h-full min-h-0 flex-1 flex-col"
    >
      <Playground
        title="Planificación"
        meta={meta}
        fullWidth
        containedScroll={mode === PLANNING_MODE.config.id}
        actions={
          <div className="flex items-center gap-2">
            <PlanningModeTabs />
            {mode === PLANNING_MODE.calendar.id ? (
              <>
                <PlanningViewFilter value={view} onChange={setView} />
                <PlanningAccountFilter
                  value={accountId}
                  onChange={setAccountId}
                  accounts={planningAccountsConfig}
                />
              </>
            ) : null}
          </div>
        }
      >
        <TabsContent value={PLANNING_MODE.calendar.id} className="mt-0">
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
                onOpenSlot={(slot: PlanningSlot) => setSelectedSlotId(slot.id)}
              />
              <SlotDetailSheet
                slot={selectedSlot}
                slots={horizonSlots}
                open={Boolean(selectedSlot)}
                onOpenChange={(open) => {
                  if (!open) setSelectedSlotId(null);
                }}
                onPrev={
                  siblingIndex > 0
                    ? () => setSelectedSlotId(siblingSlots[siblingIndex - 1].id)
                    : undefined
                }
                onNext={
                  siblingIndex >= 0 && siblingIndex < siblingSlots.length - 1
                    ? () => setSelectedSlotId(siblingSlots[siblingIndex + 1].id)
                    : undefined
                }
                prevDisabled={siblingIndex <= 0}
                nextDisabled={
                  siblingIndex < 0 || siblingIndex >= siblingSlots.length - 1
                }
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value={PLANNING_MODE.config.id}
          className="mt-0 flex min-h-0 flex-1 flex-col data-[state=inactive]:hidden"
        >
          <PlanningConfigPanel {...planningConfig} />
        </TabsContent>
      </Playground>
    </Tabs>
  );
}
