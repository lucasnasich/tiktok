import {
  useCallback,
  useEffect,
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
  buildOfficialBalancedEditorialDefaults,
  OFFICIAL_ROLE_MIX_PRESETS,
} from "@/content/planning-presets";
import {
  PLANNING_SETUP_STEPS,
  ROLE_GUIDES,
  TOPIC_PRIORITY_OPTIONS,
  type PlanningSetupStepId,
} from "@/content/planning-setup-guide";
import {
  activeRolesHaveTopics,
  cloneDefaultRoleTopicPreferences,
  getTopicsForRole,
  normalizeRoleTopicPreferences,
  roleHasEnabledTopic,
  topicPrioritySummary,
  type TopicPriority,
} from "@/content/role-topics";
import { accountToProfileOverride } from "@/lib/planning-config-store";
import { sumPercentTargets } from "@/lib/planning-percent";
import { settingsRichness } from "@/lib/planning-settings-richness";
import { ContentRoleIcon } from "@/components/planning/content-role-icons";
import {
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
      return (
        Math.abs(ctx.roleSum - 100) <= 2 &&
        activeRolesHaveTopics(
          ctx.draft.roleTargets,
          ctx.draft.roleTopicPreferences,
        )
      );
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
      settingsRichness(accountToProfileOverride(fromSession)) >
      settingsRichness(accountToProfileOverride(draft))
    ) {
      draft = fromSession;
    }
  }

  draft = {
    ...draft,
    roleTopicPreferences: normalizeRoleTopicPreferences(
      draft.roleTopicPreferences ?? cloneDefaultRoleTopicPreferences(),
      draft.pillarTargets,
    ),
  };

  const hasRoleMix = Object.values(draft.roleTargets ?? {}).some(
    (value) => (value ?? 0) > 0,
  );
  if (!existingProfile && !hasRoleMix) {
    const official = buildOfficialBalancedEditorialDefaults();
    draft = {
      ...draft,
      roleTargets: { ...official.roleTargets },
      roleTopicPreferences: normalizeRoleTopicPreferences(
        official.roleTopicPreferences,
        draft.pillarTargets,
      ),
    };
  }

  return {
    stepIndex: session
      ? Math.min(Math.max(0, session.stepIndex), PLANNING_SETUP_STEPS.length - 1)
      : 0,
    selectedProfileId: preferredProfileId,
    profileLabel:
      existingProfile?.label ?? session?.profileLabel ?? "Mi perfil editorial",
    draft,
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

  const step = PLANNING_SETUP_STEPS[stepIndex];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      persistWizardDraft(
        buildWizardSessionSnapshot({
          accountId: wizardSessionKey(selectedProfileId),
          profileId: selectedProfileId,
          profileLabel,
          stepIndex,
          draft,
        }),
      );
    }, 500);

    return () => window.clearTimeout(timer);
  }, [
    draft,
    persistWizardDraft,
    profileLabel,
    selectedProfileId,
    stepIndex,
  ]);

  const updateDraft = useCallback((patch: Partial<PlanningAccount>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateRoleTarget = useCallback((roleId: string, value: number) => {
    setDraft((prev) => ({
      ...prev,
      roleTargets: { ...prev.roleTargets, [roleId]: value },
    }));
  }, []);

  const updateTopicPriority = useCallback(
    (roleId: ContentRoleId, topicId: string, priority: TopicPriority) => {
      setDraft((prev) => ({
        ...prev,
        roleTopicPreferences: {
          ...prev.roleTopicPreferences,
          [roleId]: {
            ...prev.roleTopicPreferences[roleId],
            [topicId]: priority,
          },
        },
      }));
    },
    [],
  );

  const goToStep = useCallback(
    (nextIndex: number) => {
      const clampedIndex = Math.min(
        Math.max(0, nextIndex),
        PLANNING_SETUP_STEPS.length - 1,
      );
      if (clampedIndex === stepIndex) return;
      setStepIndex(clampedIndex);
    },
    [stepIndex],
  );

  const goNext = useCallback(() => {
    if (stepIndex < PLANNING_SETUP_STEPS.length - 1) {
      setStepIndex((i) => i + 1);
      return;
    }

    onSave(draft, {
      profileLabel: profileLabel.trim() || `Perfil · ${draft.label}`,
      profileId:
        selectedProfileId && !isWizardDraftProfileId(selectedProfileId)
          ? selectedProfileId
          : undefined,
    });
    onComplete();
  }, [draft, onComplete, onSave, profileLabel, selectedProfileId, stepIndex]);

  const goBack = useCallback(() => {
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const roleSum = sumPercentTargets(
    draft.roleTargets as Record<string, number>,
  );
  const stepValidation: StepValidationContext = {
    draft,
    roleSum,
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
            Cada rol es un mundo editorial distinto. Los porcentajes gobiernan
            la semana. Después, para cada rol activo, elegí sobre qué áreas
            concretas hablar: Alta / Media / Baja / No. Alta no significa
            “siempre este tema”: es un peso relativo.
          </GuideCallout>

          <div className="flex flex-wrap gap-2">
            {OFFICIAL_ROLE_MIX_PRESETS.map((preset) => (
              <Button
                key={preset.id}
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  updateDraft({
                    roleTargets: preset.roleTargets,
                    ...(preset.roleTopicPreferences && {
                      roleTopicPreferences: preset.roleTopicPreferences,
                    }),
                  })
                }
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
              const topics = getTopicsForRole(role.id);
              const hasTopics = roleHasEnabledTopic(
                draft.roleTopicPreferences,
                role.id,
              );
              return (
                <Card
                  key={role.id}
                  size="sm"
                  className={cn("ring-border/80", tone.card)}
                >
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
                  <CardContent className="space-y-3 pt-0 text-[13px] leading-relaxed text-muted-foreground">
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

                    {value > 0 ? (
                      <div className="space-y-3 border-t border-border/70 pt-3">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="text-[13px] font-medium text-foreground">
                            Temas de este rol
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {topicPrioritySummary(
                              draft.roleTopicPreferences,
                              role.id,
                            )}
                          </p>
                        </div>
                        {!hasTopics ? (
                          <p className="text-[12px] text-destructive">
                            Activá al menos un tema distinto de “No”.
                          </p>
                        ) : null}
                        <div className="space-y-3">
                          {topics.map((topic) => (
                            <div
                              key={topic.id}
                              className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"
                            >
                              <div className="min-w-0 sm:max-w-[58%]">
                                <p className="text-[13px] font-medium text-foreground">
                                  {topic.label}
                                </p>
                                <p className="text-[12px] leading-snug text-muted-foreground">
                                  {topic.summary}
                                </p>
                              </div>
                              <SingleChoice
                                value={
                                  draft.roleTopicPreferences[role.id]?.[
                                    topic.id
                                  ] ?? "media"
                                }
                                onChange={(priority) =>
                                  updateTopicPriority(
                                    role.id,
                                    topic.id,
                                    priority,
                                  )
                                }
                                options={TOPIC_PRIORITY_OPTIONS}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="border-t border-border/70 pt-3 text-[12px]">
                        Este rol queda en 0%: no se programa y no hace falta
                        configurar temas.
                      </p>
                    )}
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
