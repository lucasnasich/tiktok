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
import { contentRoles, type ContentRoleId } from "@/content/content-roles";
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
} from "@/content/planning-presets";
import { getPlanningPillarsForAccount } from "@/content/planning-pillars";
import {
  PILLAR_PRIORITY_WEIGHT,
  PLANNING_SETUP_STEPS,
  ROLE_GUIDES,
  type PillarPriority,
  type PlanningSetupStepId,
} from "@/content/planning-setup-guide";
import { CAMERA_MODE_OPTIONS } from "@/content/camera-presence";
import {
  DEFAULT_CAMERA_MODE,
  DEFAULT_PUBLICATION_TYPE_TARGETS,
} from "@/content/planning-defaults";
import {
  publicationTypes,
  type PublicationTypeId,
} from "@/content/publication-types";
import { accountToOverride } from "@/lib/planning-config-store";
import {
  normalizePercentTargets,
  sumPercentTargets,
} from "@/lib/planning-percent";
import { settingsRichness } from "@/lib/planning-settings-richness";
import { ContentRoleIcon } from "@/components/planning/content-role-icons";
import { PlanningPillarIcon } from "@/components/planning/planning-pillar-icons";
import { PublicationTypeIcon } from "@/components/planning/publication-type-icons";
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

const ROLE_WIZARD_TONE: Record<
  ContentRoleId,
  { card: string; icon: string }
> = {
  build_in_public: {
    card: "ring-violet-500/25",
    icon: "bg-violet-500/15 text-violet-800 dark:text-violet-200",
  },
  educacion: {
    card: "ring-sky-500/25",
    icon: "bg-sky-500/15 text-sky-800 dark:text-sky-200",
  },
  producto: {
    card: "ring-indigo-500/25",
    icon: "bg-indigo-500/15 text-indigo-800 dark:text-indigo-200",
  },
  marca: {
    card: "ring-rose-500/25",
    icon: "bg-rose-500/15 text-rose-800 dark:text-rose-200",
  },
  evidencia: {
    card: "ring-emerald-500/25",
    icon: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
  },
  comunidad: {
    card: "ring-fuchsia-500/25",
    icon: "bg-fuchsia-500/15 text-fuchsia-800 dark:text-fuchsia-200",
  },
};

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
  publicationSum: number;
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
    case "publication":
      return Math.abs(ctx.publicationSum - 100) <= 2;
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

  if (
    !Object.values(draft.publicationTypeTargets ?? {}).some(
      (value) => (value ?? 0) > 0,
    )
  ) {
    draft = {
      ...draft,
      publicationTypeTargets: { ...DEFAULT_PUBLICATION_TYPE_TARGETS },
    };
  }
  if (!draft.cameraMode) {
    draft = { ...draft, cameraMode: DEFAULT_CAMERA_MODE };
  }

  const pillarPriorities =
    session && Object.keys(session.pillarPriorities).length > 0
      ? session.pillarPriorities
      : buildPillarPrioritiesFromTargets(draft);

  return {
    stepIndex: session
      ? Math.min(Math.max(0, session.stepIndex), PLANNING_SETUP_STEPS.length - 1)
      : 0,
    selectedProfileId: preferredProfileId,
    profileLabel:
      existingProfile?.label ?? session?.profileLabel ?? "Mi perfil editorial",
    draft,
    pillarPriorities,
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

  const updatePublicationTypeTarget = useCallback(
    (typeId: PublicationTypeId, value: number) => {
      setDraft((prev) => ({
        ...prev,
        publicationTypeTargets: {
          ...prev.publicationTypeTargets,
          [typeId]: value,
        },
      }));
    },
    [],
  );

  const applyPillarPriorities = useCallback(() => {
    const weights: Record<string, number> = {};
    for (const pillar of relevantPillars) {
      const priority = pillarPriorities[pillar.id] ?? "media";
      weights[pillar.id] = PILLAR_PRIORITY_WEIGHT[priority];
    }
    updateDraft({ pillarTargets: normalizePercentTargets(weights) });
  }, [pillarPriorities, relevantPillars, updateDraft]);

  const applyStepSideEffects = useCallback(
    (fromStepId: PlanningSetupStepId) => {
      if (fromStepId === "pillars") applyPillarPriorities();
    },
    [applyPillarPriorities],
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
  const publicationSum = sumPercentTargets(
    draft.publicationTypeTargets as Record<string, number>,
  );
  const stepValidation: StepValidationContext = {
    draft,
    roleSum,
    publicationSum,
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
            placeholder="Ej. Institucional, Q4…"
            className="max-w-md"
          />
        </div>
      )}

      {step.id === "roles" && (
        <div className="space-y-5">
          <GuideCallout>
            Cada rol es un mundo editorial distinto. Los porcentajes
            gobiernan la semana, no cada día. Un CTA puede aparecer en
            cualquier pieza: no define el rol.
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
                const guide = ROLE_GUIDES[role.id];
                const value = draft.roleTargets[role.id] ?? 0;
                const tone = ROLE_WIZARD_TONE[role.id];
                return (
                  <Card key={role.id} size="sm" className={cn("ring-border/80", tone.card)}>
                    <CardHeader className="gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div
                            className={cn(
                              "flex size-9 shrink-0 items-center justify-center rounded-lg",
                              tone.icon,
                            )}
                          >
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

      {step.id === "publication" && (
        <div className="space-y-5">
          <GuideCallout>
            Tipo de publicación = qué pieza vamos a producir. Formato creativo
            = cómo la ejecutamos, y se elige al desarrollar cada slot. Sin
            cámara no significa sin video.
          </GuideCallout>

          <div className="space-y-2">
            <p className="text-[13px] font-medium">Restricción de producción</p>
            <div className="grid gap-2">
              {CAMERA_MODE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => updateDraft({ cameraMode: option.id })}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 text-left transition-colors",
                    draft.cameraMode === option.id
                      ? "border-foreground bg-muted/60"
                      : "border-border hover:bg-muted/40",
                  )}
                >
                  <p className="text-[13px] font-medium">{option.label}</p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[13px] font-medium">Tipos de publicación</p>
            {publicationTypes.map((type) => {
              const value = draft.publicationTypeTargets[type.id] ?? 0;
              return (
                <Card key={type.id} size="sm" className="ring-border/80">
                  <CardHeader className="gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                          <PublicationTypeIcon
                            typeId={type.id}
                            className="size-4"
                          />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <CardTitle className="text-[15px]">
                            {type.label}
                          </CardTitle>
                          <p className="text-[13px] text-muted-foreground">
                            {type.summary}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={value}
                          onChange={(event) =>
                            updatePublicationTypeTarget(
                              type.id,
                              Number(event.target.value) || 0,
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
                  <CardContent className="pt-0 text-[13px] text-muted-foreground">
                    Ejemplo: {type.example}
                  </CardContent>
                </Card>
              );
            })}
            <p className="text-[13px] text-muted-foreground">
              Suma actual: <strong>{publicationSum}%</strong> — idealmente
              ~100%. Un tipo en 0% no se programa.
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

