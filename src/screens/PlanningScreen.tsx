import { useMemo, useState } from "react";
import { ClockCounterClockwiseIcon, PlusIcon } from "@phosphor-icons/react";

import { Playground } from "@/components/AppShell";
import { PlanningAccountFilter } from "@/components/planning/PlanningAccountFilter";
import { PlanningCalendar } from "@/components/planning/PlanningCalendar";
import { PlanningCalendarSetup } from "@/components/planning/PlanningCalendarSetup";
import { PlanningGenerationsPanel } from "@/components/planning/PlanningGenerationsPanel";
import { PlanningGapsPanel } from "@/components/planning/PlanningGapsPanel";
import { PlanningInsightsButton } from "@/components/planning/PlanningInsightsButton";
import {
  PlanningToolbarIconButton,
} from "@/components/planning/PlanningToolbarButton";
import { PlanningViewFilter } from "@/components/planning/PlanningViewFilter";
import { SlotDetailSheet } from "@/components/planning/SlotDetailSheet";
import { StudioSheet } from "@/components/studio/StudioSheet";
import { PLANNING_VIEW, type PlanningViewId } from "@/content/planning-view";
import type { CalendarGenerationRequest } from "@/content/calendar-generations";
import type { PlanningSlot } from "@/content/planned-slots";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { usePlanningConfig } from "@/hooks/use-planning-config";
import { useSheetSearchParam } from "@/hooks/use-sheet-search-param";
import { PLANNING_ALL_ACCOUNTS_ID } from "@/content/planning-accounts";
import {
  computePlanningInsights,
  dedupeSlotsForAllAccountsView,
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
  parsePlanningView,
  parsePlanningWeekStart,
} from "@/lib/studio-preferences";

export function PlanningScreen() {
  const planningConfig = usePlanningConfig();
  const {
    studioAccounts,
    profiles,
    calendarGenerations,
    activeCalendarGeneration,
    activeCalendarSlots,
    activeCalendarAccounts,
    calendarActive,
    generateCalendar,
    setActiveCalendarGeneration,
    deleteCalendarGeneration,
  } = planningConfig;
  const [newGenerationOpen, setNewGenerationOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [generationsOpen, setGenerationsOpen] = useState(false);
  const today = useMemo(() => new Date(), []);
  const todayIso = toIsoDate(today);
  const defaultFocusIso = toIsoDate(startOfWeek(today));

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
    () => getDatesForView(view, focusDate, todayIso),
    [focusDate, todayIso, view],
  );
  const monthDays = useMemo(
    () => getMonthCalendarDays(focusDate),
    [focusDate],
  );

  const filterableStudioAccounts = useMemo(() => {
    if (!activeCalendarGeneration) return [];
    const accountIds = new Set(activeCalendarGeneration.accountIds);
    return studioAccounts.filter((account) => accountIds.has(account.id));
  }, [activeCalendarGeneration, studioAccounts]);

  const calendarSlots = useMemo(() => {
    const from = dates[0];
    const to = dates[dates.length - 1];
    if (!from || !to) return [];
    return activeCalendarSlots.filter(
      (slot) => slot.date >= from && slot.date <= to,
    );
  }, [activeCalendarSlots, dates]);

  const visibleSlots = useMemo(() => {
    const inRange = filterSlotsByDates(calendarSlots, dates);
    const filtered = filterSlotsByAccount(inRange, accountId);
    if (accountId === PLANNING_ALL_ACCOUNTS_ID) {
      return dedupeSlotsForAllAccountsView(filtered);
    }
    return filtered;
  }, [accountId, calendarSlots, dates]);

  const insights = useMemo(
    () =>
      computePlanningInsights({
        slots: calendarSlots,
        accounts: activeCalendarAccounts,
        rangeDates: dates,
        todayIso,
        accountFilter: accountId,
      }),
    [accountId, calendarSlots, dates, activeCalendarAccounts, todayIso],
  );

  const selectedSlot = useMemo(
    () => activeCalendarSlots.find((slot) => slot.id === selectedSlotId),
    [activeCalendarSlots, selectedSlotId],
  );

  const navigableSlots = useMemo(
    () =>
      [...visibleSlots].sort(
        (a, b) =>
          a.date.localeCompare(b.date) ||
          a.time.localeCompare(b.time) ||
          a.id.localeCompare(b.id),
      ),
    [visibleSlots],
  );

  const navigableIndex = selectedSlot
    ? navigableSlots.findIndex((slot) => slot.id === selectedSlot.id)
    : -1;

  const periodLabel = useMemo(() => {
    if (
      (view === PLANNING_VIEW.day.id || view === PLANNING_VIEW.fourDay.id) &&
      dates[0]
    ) {
      return formatPeriodLabel(view, parseIsoDate(dates[0]));
    }
    return formatPeriodLabel(view, focusDate);
  }, [dates, focusDate, view]);
  const meta = !calendarActive
    ? "Sin generaciones"
    : activeCalendarGeneration
      ? `${visibleSlots.length} piezas · ${periodLabel}`
      : "Sin generación activa";

  const handleGenerate = (input: CalendarGenerationRequest) => {
    generateCalendar(input);
    setNewGenerationOpen(false);
  };

  return (
    <>
      <Playground
        title="Calendario"
        meta={meta}
        fullWidth
        containedScroll={calendarActive && Boolean(activeCalendarGeneration)}
        actions={
          calendarActive ? (
            <div className="flex items-center gap-2">
              {filterableStudioAccounts.length > 1 ? (
                <PlanningAccountFilter
                  value={accountId}
                  onChange={setAccountId}
                  accounts={filterableStudioAccounts}
                />
              ) : null}
              <PlanningInsightsButton
                count={insights.length}
                onClick={() => setInsightsOpen(true)}
              />
              <PlanningViewFilter value={view} onChange={setView} />
              <PlanningToolbarIconButton
                type="button"
                aria-label="Historial de generaciones"
                onClick={() => setGenerationsOpen(true)}
              >
                <ClockCounterClockwiseIcon />
              </PlanningToolbarIconButton>
              <PlanningToolbarIconButton
                type="button"
                aria-label="Nueva generación"
                onClick={() => setNewGenerationOpen(true)}
              >
                <PlusIcon />
              </PlanningToolbarIconButton>
            </div>
          ) : null
        }
      >
        {!calendarActive ? (
          <PlanningCalendarSetup
            studioAccounts={studioAccounts}
            profiles={profiles}
            onGenerate={handleGenerate}
          />
        ) : activeCalendarGeneration ? (
          <div className="flex min-h-0 flex-1 flex-col bg-secondary">
            <PlanningCalendar
              view={view}
              dates={dates}
              monthDays={monthDays}
              slots={visibleSlots}
              todayIso={todayIso}
              accountFilter={accountId}
              studioAccounts={studioAccounts}
              onOpenSlot={(slot: PlanningSlot) => setSelectedSlotId(slot.id)}
            />
          </div>
        ) : (
          <div className="flex min-h-[min(420px,60vh)] items-center justify-center p-6 text-center">
            <p className="max-w-sm text-[13px] leading-relaxed text-muted-foreground">
              Creá una nueva generación para ver el calendario.
            </p>
          </div>
        )}

        <SlotDetailSheet
          slot={selectedSlot}
          slots={activeCalendarSlots}
          studioAccounts={studioAccounts}
          open={Boolean(selectedSlot)}
          onOpenChange={(open) => {
            if (!open) setSelectedSlotId(null);
          }}
          onPrev={
            navigableSlots.length > 1
              ? () => {
                  if (navigableIndex > 0) {
                    setSelectedSlotId(navigableSlots[navigableIndex - 1].id);
                  }
                }
              : undefined
          }
          onNext={
            navigableSlots.length > 1
              ? () => {
                  if (
                    navigableIndex >= 0 &&
                    navigableIndex < navigableSlots.length - 1
                  ) {
                    setSelectedSlotId(navigableSlots[navigableIndex + 1].id);
                  }
                }
              : undefined
          }
          prevDisabled={navigableIndex <= 0}
          nextDisabled={
            navigableIndex < 0 || navigableIndex >= navigableSlots.length - 1
          }
        />
      </Playground>

      <StudioSheet
        open={insightsOpen}
        onOpenChange={setInsightsOpen}
        title="Qué falta"
        description={`Brechas vs. targets y señales de variedad para ${periodLabel}.`}
        size="narrow"
      >
        <PlanningGapsPanel embedded insights={insights} periodLabel={periodLabel} />
      </StudioSheet>

      <StudioSheet
        open={generationsOpen}
        onOpenChange={setGenerationsOpen}
        title="Historial"
        description="Generaciones de slots del calendario. Podés cambiar la activa o eliminar las que no uses."
        size="narrow"
      >
        <PlanningGenerationsPanel
          generations={calendarGenerations}
          activeGenerationId={activeCalendarGeneration?.id}
          onSelect={setActiveCalendarGeneration}
          onDelete={(generationId) => {
            deleteCalendarGeneration(generationId);
            if (calendarGenerations.length <= 1) {
              setGenerationsOpen(false);
            }
          }}
        />
      </StudioSheet>

      <StudioSheet
        open={newGenerationOpen}
        onOpenChange={setNewGenerationOpen}
        title="Nueva generación"
        description="Período, cuentas, estrategia y perfil. Los slots se congelan al confirmar."
        size="narrow"
      >
        <PlanningCalendarSetup
          embedded
          studioAccounts={studioAccounts}
          profiles={profiles}
          onGenerate={handleGenerate}
        />
      </StudioSheet>
    </>
  );
}
