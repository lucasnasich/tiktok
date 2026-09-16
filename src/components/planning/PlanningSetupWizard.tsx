import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ArrowLeftIcon, ArrowRightIcon, LightbulbIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { contentRoles } from "@/content/content-roles";
import {
  createPlanningAccountTemplate,
  type PlanningAccount,
} from "@/content/planning-accounts";
import {
  profileSettingsToAccount,
  type PlanningProfile,
} from "@/content/planning-profiles";
import {
  OFFICIAL_ROLE_MIX_PRESETS,
  FORMAT_ROTATION_PRESETS,
  formatRotationPresetIdFor,
  officialFormatIds,
  repetitionLimitsWithFormatRotation,
} from "@/content/planning-presets";
import { getPlanningPillarsForAccount } from "@/content/planning-pillars";
import {
  PILLAR_PRIORITY_WEIGHT,
  PLANNING_SETUP_STEPS,
  ROLE_GUIDES,
  getSetupFormats,
  type PillarPriority,
  type PlanningSetupStepId,
} from "@/content/planning-setup-guide";
import { accountToOverride } from "@/lib/planning-config-store";
import {
  normalizePercentTargets,
  sumPercentTargets,
} from "@/lib/planning-percent";
import { settingsRichness } from "@/lib/planning-settings-richness";
import { ContentRoleIcon } from "@/components/planning/content-role-icons";
import { FormatGuideSheet } from "@/components/planning/FormatGuideSheet";
import { FormatSetupOption } from "@/components/planning/FormatSetupOption";
import { PlanningPillarIcon } from "@/components/planning/planning-pillar-icons";
import {
  buildMergedWizardAccount,
  buildPillarPrioritiesFromTargets,
  buildWizardSessionSnapshot,
  isWizardDraftProfileId,
  sessionToAccount,
  wizardSessionKey,
  type PlanningWizardSession,
} from "@/lib/planning-wizard-session";
import { cn } from "@/lib/utils";

function SingleChoice<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: ReactNode }[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant={value === option.value ? "default" : "outline"}
          size="sm"
          className="min-w-9"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

type PlanningSetupWizardProps = {
  embedded?: boolean;
  initialProfileId?: string;
  getProfile: (profileId: string) => PlanningProfile | undefined;
  getWizardSession: (sessionKey: string) => PlanningWizardSession | undefined;
  persistWizardDraft: (session: PlanningWizardSession) => void;
  onSave: (
    account: PlanningAccount,
    options: { profileLabel: string; profileId?: string },
  ) => void;
  onComplete: () => void;
};

type StepValidationContext = {
  draft: PlanningAccount;
  roleSum: number;
  selectedFormats: Set<string>;
  pillarPriorities: Record<string, PillarPriority>;
  relevantPillarIds: string[];
  profileLabel: string;
};

function isStepComplete(
  stepId: PlanningSetupStepId,
  ctx: StepValidationContext,
): boolean {
  switch (stepId) {
    case "profile":
      return ctx.profileLabel.trim().length > 0;
    case "roles":
      return Math.abs(ctx.roleSum - 100) <= 2;
    case "pillars":
      return ctx.relevantPillarIds.some(
        (id) => (ctx.pillarPriorities[id] ?? "media") !== "no",
      );
    case "formats":
      return ctx.selectedFormats.size > 0;
    default:
      return true;
  }
}

function StepProgress({
  currentIndex,
  validation,
  onStepClick,
}: {
  currentIndex: number;
  validation: StepValidationContext;
  onStepClick: (index: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Pasos del asistente">
      {PLANNING_SETUP_STEPS.map((step, index) => {
        const isCurrent = index === currentIndex;
        const complete = isStepComplete(step.id, validation);

        return (
          <button
            key={step.id}
            type="button"
            role="tab"
            aria-selected={isCurrent}
            aria-current={isCurrent ? "step" : undefined}
            onClick={() => onStepClick(index)}
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-tight transition-colors",
              isCurrent
                ? "bg-primary text-primary-foreground"
                : complete
                  ? "bg-muted text-foreground hover:bg-muted/80"
                  : "bg-destructive/10 text-destructive hover:bg-destructive/15",
            )}
          >
            {index + 1}. {step.label}
          </button>
        );
      })}
    </div>
  );
}

function GuideCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
      <LightbulbIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        {children}
      </p>
    </div>
  );
}

function resolveWizardInitialState({
  profileId: preferredProfileId,
  getProfile,
  getWizardSession,
}: {
  profileId?: string;
  getProfile: (profileId: string) => PlanningProfile | undefined;
  getWizardSession: (sessionKey: string) => PlanningWizardSession | undefined;
}) {
  const sessionKey = wizardSessionKey(preferredProfileId);
  const session = getWizardSession(sessionKey);
  const existingProfile =
    preferredProfileId && !isWizardDraftProfileId(preferredProfileId)
      ? getProfile(preferredProfileId)
      : undefined;
  const draftTemplate = createPlanningAccountTemplate("official");

  let draft = existingProfile
    ? profileSettingsToAccount(draftTemplate, existingProfile.settings)
    : draftTemplate;

  if (session) {
    const fromSession = sessionToAccount(draftTemplate, session);
    if (
      settingsRichness(accountToOverride(fromSession)) >
      settingsRichness(accountToOverride(draft))
    ) {
      draft = fromSession;
    }
  }

  const pillarPriorities =
    session && Object.keys(session.pillarPriorities).length > 0
      ? session.pillarPriorities
      : buildPillarPrioritiesFromTargets(draft);
  const selectedFormats =
    session && session.selectedFormatIds.length > 0
      ? new Set(session.selectedFormatIds)
      : new Set(Object.keys(draft.formatTargets));

  return {
    stepIndex: session
      ? Math.min(Math.max(0, session.stepIndex), PLANNING_SETUP_STEPS.length - 1)
      : 0,
    selectedProfileId: preferredProfileId,
    profileLabel:
      existingProfile?.label ?? session?.profileLabel ?? "Mi perfil editorial",
    draft,
    pillarPriorities,
    selectedFormats,
  };
}

export function PlanningSetupWizard({
  embedded = false,
  initialProfileId,
  getProfile,
  getWizardSession,
  persistWizardDraft,
  onSave,
  onComplete,
}: PlanningSetupWizardProps) {
  const initialState = resolveWizardInitialState({
    profileId: initialProfileId,
    getProfile,
    getWizardSession,
  });

  const [stepIndex, setStepIndex] = useState(initialState.stepIndex);
  const selectedProfileId = initialProfileId;
  const [profileLabel, setProfileLabel] = useState(initialState.profileLabel);
  const [draft, setDraft] = useState<PlanningAccount>(initialState.draft);
  const [pillarPriorities, setPillarPriorities] = useState<
    Record<string, PillarPriority>
  >(initialState.pillarPriorities);
  const [selectedFormats, setSelectedFormats] = useState<Set<string>>(
    initialState.selectedFormats,
  );
  const [formatGuideId, setFormatGuideId] = useState<string | null>(null);

  const step = PLANNING_SETUP_STEPS[stepIndex];
  const relevantPillars = useMemo(
    () => getPlanningPillarsForAccount("profile-wizard", "official"),
    [],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      persistWizardDraft(
        buildWizardSessionSnapshot({
          accountId: wizardSessionKey(selectedProfileId),
          profileId: selectedProfileId,
          profileLabel,
          stepIndex,
          draft,
          pillarPriorities,
          relevantPillarIds: relevantPillars.map((pillar) => pillar.id),
          selectedFormatIds: [...selectedFormats],
        }),
      );
    }, 500);

    return () => window.clearTimeout(timer);
  }, [
    draft,
    persistWizardDraft,
    pillarPriorities,
    profileLabel,
    relevantPillars,
    selectedFormats,
    selectedProfileId,
    stepIndex,
  ]);

  const updateDraft = useCallback(
    (patch: Partial<PlanningAccount>) => {
      setDraft((prev) => ({ ...prev, ...patch }));
    },
    [],
  );

  const updateRoleTarget = useCallback((roleId: string, value: number) => {
    setDraft((prev) => ({
      ...prev,
      roleTargets: { ...prev.roleTargets, [roleId]: value },
    }));
  }, []);

  const applyPillarPriorities = useCallback(() => {
    const weights: Record<string, number> = {};
    for (const pillar of relevantPillars) {
      const priority = pillarPriorities[pillar.id] ?? "media";
      weights[pillar.id] = PILLAR_PRIORITY_WEIGHT[priority];
    }
    updateDraft({ pillarTargets: normalizePercentTargets(weights) });
  }, [pillarPriorities, relevantPillars, updateDraft]);

  const applyFormatSelection = useCallback(() => {
    const weights: Record<string, number> = {};
    for (const id of selectedFormats) {
      weights[id] = 1;
    }
    updateDraft({ formatTargets: normalizePercentTargets(weights) });
  }, [selectedFormats, updateDraft]);

  const applyStepSideEffects = useCallback(
    (fromStepId: PlanningSetupStepId) => {
      if (fromStepId === "pillars") applyPillarPriorities();
      if (fromStepId === "formats") applyFormatSelection();
    },
    [applyFormatSelection, applyPillarPriorities],
  );

  const goToStep = useCallback(
    (nextIndex: number) => {
      const clampedIndex = Math.min(
        Math.max(0, nextIndex),
        PLANNING_SETUP_STEPS.length - 1,
      );
      if (clampedIndex === stepIndex) return;

      applyStepSideEffects(step.id);
      setStepIndex(clampedIndex);
    },
    [applyStepSideEffects, step.id, stepIndex],
  );

  const goNext = useCallback(() => {
    applyStepSideEffects(step.id);

    if (stepIndex < PLANNING_SETUP_STEPS.length - 1) {
      setStepIndex((i) => i + 1);
      return;
    }

    const mergedDraft = buildMergedWizardAccount(
      draft,
      pillarPriorities,
      relevantPillars.map((pillar) => pillar.id),
      selectedFormats,
    );
    onSave(mergedDraft, {
      profileLabel: profileLabel.trim() || `Perfil · ${mergedDraft.label}`,
      profileId:
        selectedProfileId && !isWizardDraftProfileId(selectedProfileId)
          ? selectedProfileId
          : undefined,
    });
    onComplete();
  }, [
    applyStepSideEffects,
    draft,
    onComplete,
    onSave,
    pillarPriorities,
    profileLabel,
    relevantPillars,
    selectedFormats,
    selectedProfileId,
    step.id,
    stepIndex,
  ]);

  const goBack = useCallback(() => {
    applyStepSideEffects(step.id);
    setStepIndex((i) => Math.max(0, i - 1));
  }, [applyStepSideEffects, step.id]);

  const roleSum = sumPercentTargets(
    draft.roleTargets as Record<string, number>,
  );
  const stepValidation: StepValidationContext = {
    draft,
    roleSum,
    selectedFormats,
    pillarPriorities,
    relevantPillarIds: relevantPillars.map((pillar) => pillar.id),
    profileLabel,
  };
  const canAdvance = isStepComplete(step.id, stepValidation);

  return (
    <div
      className={
        embedded ? "space-y-6" : "mx-auto max-w-3xl space-y-6 px-5 py-6"
      }
    >
      <StepProgress
        currentIndex={stepIndex}
        validation={stepValidation}
        onStepClick={goToStep}
      />

      <div>
        <h2 className="text-lg font-semibold tracking-tight">{step.title}</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          {step.intro}
        </p>
      </div>

      {step.id === "profile" && (
        <div>
          <p className="mb-2 text-[13px] font-medium">Nombre del perfil</p>
          <Input
            value={profileLabel}
            onChange={(event) => setProfileLabel(event.target.value)}
            placeholder="Ej. Institucional, Q4 alcance…"
            className="max-w-md"
          />
        </div>
      )}

      {step.id === "roles" && (
        <div className="space-y-5">
          <GuideCallout>
            Cada rol es un mundo editorial distinto. No uses “alcance” ni
            “valor” como categorías: el alcance se gana con el hook y el
            valor debería estar en casi cualquier pieza. Los porcentajes
            gobiernan la semana, no cada día.
          </GuideCallout>

          <div className="flex flex-wrap gap-2">
              {OFFICIAL_ROLE_MIX_PRESETS.map((preset) => (
                <Button
                  key={preset.id}
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => updateDraft({ roleTargets: preset.roleTargets })}
                >
                  {preset.label}
                </Button>
              ))}
          </div>

          <div className="space-y-3">
            {contentRoles.map((role) => {
                const guide = ROLE_GUIDES.find((g) => g.id === role.id)!;
                const value = draft.roleTargets[role.id] ?? 0;
                return (
                  <Card key={role.id} size="sm" className="ring-border/80">
                    <CardHeader className="gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                            <ContentRoleIcon
                              roleId={role.id}
                              className="size-4"
                            />
                          </div>
                          <div className="min-w-0 space-y-1">
                            <CardTitle className="text-[15px]">
                              {role.label}
                            </CardTitle>
                            <p className="text-[13px] text-muted-foreground">
                              {role.summary}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={value}
                            onChange={(e) =>
                              updateRoleTarget(
                                role.id,
                                Number(e.target.value) || 0,
                              )
                            }
                            className="h-7 w-16 text-center text-[13px]"
                          />
                          <span className="text-[13px] text-muted-foreground">
                            %
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-0 text-[13px] leading-relaxed text-muted-foreground">
                      <p>
                        <span className="font-medium text-foreground">
                          Cuándo usarlo:{" "}
                        </span>
                        {guide.cuandoUsar}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">
                          Ejemplo:{" "}
                        </span>
                        {guide.ejemplo}
                      </p>
                      <p className="text-[12px] italic">{guide.tip}</p>
                    </CardContent>
                  </Card>
                );
              })}
          </div>

          <p className="text-[13px] text-muted-foreground">
            Suma actual: <strong>{roleSum}%</strong> — idealmente ~100%. Un rol
            en 0% no se programa; una pieza manual igual puede usarlo.
          </p>
        </div>
      )}

      {step.id === "pillars" && (
        <div className="space-y-3">
          <GuideCallout>
            Marcá la prioridad de cada tema. “Alta” no significa todos los días
            — solo que el motor lo incluirá más seguido que un tema “bajo”.
          </GuideCallout>
          {relevantPillars.map((pillar) => (
            <Card key={pillar.id} size="sm" className="ring-border/80">
              <CardHeader className="gap-2">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                    <PlanningPillarIcon pillarId={pillar.id} className="size-4" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <CardTitle className="text-[15px]">{pillar.label}</CardTitle>
                    <p className="text-[13px] text-muted-foreground">
                      {pillar.summary}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <SingleChoice
                  value={pillarPriorities[pillar.id] ?? "media"}
                  onChange={(v) =>
                    setPillarPriorities((prev) => ({
                      ...prev,
                      [pillar.id]: v as PillarPriority,
                    }))
                  }
                  options={[
                    { value: "alta", label: "Alta" },
                    { value: "media", label: "Media" },
                    { value: "baja", label: "Baja" },
                    { value: "no", label: "No usar" },
                  ]}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {step.id === "formats" && (
        <div className="space-y-3">
          <GuideCallout>
            Elegí los formatos que querés rotar ({getSetupFormats().length}{" "}
            disponibles). Mejor pocos bien distribuidos que marcar todos.
          </GuideCallout>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setSelectedFormats(new Set(officialFormatIds()))}
          >
            Usar formatos recomendados
          </Button>
          <div className="grid gap-2 sm:grid-cols-2">
            {getSetupFormats().map((format) => {
              const active = selectedFormats.has(format.id);
              return (
                <FormatSetupOption
                  key={format.id}
                  format={format}
                  active={active}
                  onToggle={() =>
                    setSelectedFormats((prev) => {
                      const next = new Set(prev);
                      if (next.has(format.id)) next.delete(format.id);
                      else next.add(format.id);
                      return next;
                    })
                  }
                  onOpenGuide={() => setFormatGuideId(format.id)}
                />
              );
            })}
          </div>
          <FormatGuideSheet
            formatId={formatGuideId}
            open={formatGuideId !== null}
            onOpenChange={(open) => {
              if (!open) setFormatGuideId(null);
            }}
          />
          <p className="text-[13px] text-muted-foreground">
            {selectedFormats.size} formatos seleccionados
          </p>

          <div className="border-t border-border pt-4">
            <p className="mb-2 text-[13px] font-medium">Rotación de formatos</p>
            <GuideCallout>
              Los roles ya vienen del mix del paso Roles. Los pilares, de las
              prioridades del paso Pilares. Acá definís cuánto puede repetirse
              el mismo formato en la semana — el motor baja prioridad, no bloquea.
            </GuideCallout>
            <div className="mt-3 flex flex-wrap gap-2">
              {FORMAT_ROTATION_PRESETS.map((preset) => (
                <Button
                  key={preset.id}
                  type="button"
                  size="sm"
                  variant={
                    formatRotationPresetIdFor(draft.repetitionLimits) ===
                    preset.id
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    updateDraft({
                      repetitionLimits: repetitionLimitsWithFormatRotation(
                        preset.maxSameFormatInPeriod,
                      ),
                    })
                  }
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            <p className="mt-2 text-[12px] text-muted-foreground">
              {
                FORMAT_ROTATION_PRESETS.find(
                  (preset) =>
                    preset.id === formatRotationPresetIdFor(draft.repetitionLimits),
                )?.hint
              }
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border pt-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={goBack}
          disabled={stepIndex === 0}
        >
          <ArrowLeftIcon />
          Anterior
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={goNext}
          disabled={!canAdvance}
        >
          {stepIndex === PLANNING_SETUP_STEPS.length - 1 ? (
            "Guardar perfil"
          ) : (
            <>
              Siguiente
              <ArrowRightIcon />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

