import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  CheckIcon,
  LightbulbIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { contentRoles, type ContentRoleId } from "@/content/content-roles";
import { getFormatLabel } from "@/content/formats";
import {
  planningAccounts,
  type PlanningAccount,
} from "@/content/planning-accounts";
import {
  formatProfileRoleSummary,
  type PlanningProfile,
} from "@/content/planning-profiles";
import { DEFAULT_TIME_SLOTS } from "@/content/planning-defaults";
import { getPlanningPillarLabel } from "@/content/planning-pillars";
import {
  DISTRIBUTION_TYPE_LABELS,
  type DistributionType,
} from "@/content/planned-slots";
import { getPlanningPillarsForAccount } from "@/content/planning-pillars";
import {
  PILLAR_PRIORITY_WEIGHT,
  PLANNING_SETUP_STEPS,
  RHYTHM_COPY,
  ROLE_GUIDES,
  VARIETY_COPY,
  getSetupFormats,
  type PillarPriority,
} from "@/content/planning-setup-guide";
import { WEEKDAY_LABELS } from "@/lib/planning-dates";
import {
  normalizePercentTargets,
  sumPercentTargets,
} from "@/lib/planning-percent";
import { ContentRoleIcon } from "@/components/planning/content-role-icons";
import { FormatIcon } from "@/components/planning/format-icons";
import { PlanningPillarIcon } from "@/components/planning/planning-pillar-icons";
import {
  buildMergedWizardAccount,
  buildPillarPrioritiesFromTargets,
  buildWizardSessionSnapshot,
  getWizardDraftProfileId,
  sessionToAccount,
  type PlanningWizardSession,
} from "@/lib/planning-wizard-session";
import { cn } from "@/lib/utils";

const WEEKDAY_BY_ISO = ["", ...WEEKDAY_LABELS];
const TIME_OPTIONS = [...DEFAULT_TIME_SLOTS];

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

function MultiChoice<T extends string>({
  values,
  onChange,
  options,
  className,
}: {
  values: T[];
  onChange: (values: T[]) => void;
  options: { value: T; label: ReactNode }[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const selected = values.includes(option.value);
        return (
          <Button
            key={option.value}
            type="button"
            variant={selected ? "default" : "outline"}
            size="sm"
            onClick={() => {
              onChange(
                selected
                  ? values.filter((v) => v !== option.value)
                  : [...values, option.value],
              );
            }}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}

type PlanningSetupWizardProps = {
  initialAccountId?: string;
  initialProfileId?: string;
  getAccountDraft: (accountId: string) => PlanningAccount;
  getAccountDraftFromProfile: (
    accountId: string,
    profileId: string,
  ) => PlanningAccount;
  getProfilesForAccount: (accountId: string) => PlanningProfile[];
  getAssignedProfileId: (accountId: string) => string | undefined;
  getWizardSession: (accountId: string) => PlanningWizardSession | undefined;
  persistWizardDraft: (session: PlanningWizardSession) => void;
  onSave: (
    account: PlanningAccount,
    options: { profileLabel: string; profileId?: string },
  ) => void;
  onComplete: () => void;
};

function StepProgress({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {PLANNING_SETUP_STEPS.map((step, index) => (
        <div
          key={step.id}
          className={cn(
            "rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-tight",
            index === currentIndex
              ? "bg-primary text-primary-foreground"
              : index < currentIndex
                ? "bg-muted text-foreground"
                : "bg-muted/50 text-muted-foreground",
          )}
        >
          {index + 1}. {step.label}
        </div>
      ))}
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
  accountId: preferredAccountId,
  profileId: preferredProfileId,
  getWizardSession,
  getAccountDraft,
  getAccountDraftFromProfile,
  getProfilesForAccount,
  getAssignedProfileId,
}: {
  accountId: string;
  profileId?: string;
  getWizardSession: (accountId: string) => PlanningWizardSession | undefined;
  getAccountDraft: (accountId: string) => PlanningAccount;
  getAccountDraftFromProfile: (
    accountId: string,
    profileId: string,
  ) => PlanningAccount;
  getProfilesForAccount: (accountId: string) => PlanningProfile[];
  getAssignedProfileId: (accountId: string) => string | undefined;
}) {
  const session = getWizardSession(preferredAccountId);
  if (session && (!preferredProfileId || session.profileId === preferredProfileId)) {
    const base = planningAccounts.find((a) => a.id === session.accountId)!;
    const draft = sessionToAccount(base, session);
    return {
      accountId: session.accountId,
      stepIndex: session.stepIndex,
      selectedProfileId:
        session.profileId ?? getAssignedProfileId(session.accountId),
      profileLabel: session.profileLabel,
      draft,
      pillarPriorities: session.pillarPriorities,
      selectedFormats: new Set(session.selectedFormatIds),
    };
  }

  const profileId =
    preferredProfileId ?? getAssignedProfileId(preferredAccountId);
  const draft = profileId
    ? getAccountDraftFromProfile(preferredAccountId, profileId)
    : getAccountDraft(preferredAccountId);

  let profileLabel = "Mi perfil";
  if (!profileId) {
    const account = planningAccounts.find((a) => a.id === preferredAccountId);
    profileLabel = account ? `Perfil · ${account.label}` : profileLabel;
  } else {
    const profile = getProfilesForAccount(preferredAccountId).find(
      (p) => p.id === profileId,
    );
    profileLabel = profile?.label ?? profileLabel;
  }

  return {
    accountId: preferredAccountId,
    stepIndex: 0,
    selectedProfileId: profileId,
    profileLabel,
    draft,
    pillarPriorities: buildPillarPrioritiesFromTargets(draft),
    selectedFormats: new Set(Object.keys(draft.formatTargets)),
  };
}

export function PlanningSetupWizard({
  initialAccountId,
  initialProfileId,
  getAccountDraft,
  getAccountDraftFromProfile,
  getProfilesForAccount,
  getAssignedProfileId,
  getWizardSession,
  persistWizardDraft,
  onSave,
  onComplete,
}: PlanningSetupWizardProps) {
  const initialAccId = initialAccountId ?? planningAccounts[0].id;
  const initialState = resolveWizardInitialState({
    accountId: initialAccId,
    profileId: initialProfileId,
    getWizardSession,
    getAccountDraft,
    getAccountDraftFromProfile,
    getProfilesForAccount,
    getAssignedProfileId,
  });

  const [stepIndex, setStepIndex] = useState(initialState.stepIndex);
  const [accountId, setAccountId] = useState(initialState.accountId);
  const [selectedProfileId, setSelectedProfileId] = useState<string | undefined>(
    initialState.selectedProfileId,
  );
  const [profileLabel, setProfileLabel] = useState(initialState.profileLabel);
  const [draft, setDraft] = useState<PlanningAccount>(initialState.draft);
  const [pillarPriorities, setPillarPriorities] = useState<
    Record<string, PillarPriority>
  >(initialState.pillarPriorities);
  const [selectedFormats, setSelectedFormats] = useState<Set<string>>(
    initialState.selectedFormats,
  );

  const step = PLANNING_SETUP_STEPS[stepIndex];
  const accountMeta = planningAccounts.find((a) => a.id === accountId)!;

  const relevantPillars = useMemo(
    () => getPlanningPillarsForAccount(accountId, accountMeta.type),
    [accountId, accountMeta.type],
  );

  const satelliteExcludedRoles: ContentRoleId[] = ["prueba", "conversion"];

  const compatibleProfiles = useMemo(
    () => getProfilesForAccount(accountId),
    [accountId, getProfilesForAccount],
  );

  const applyProfile = useCallback(
    (profileId: string) => {
      setSelectedProfileId(profileId);
      const nextDraft = getAccountDraftFromProfile(accountId, profileId);
      setDraft(nextDraft);
      setPillarPriorities(buildPillarPrioritiesFromTargets(nextDraft));
      setSelectedFormats(new Set(Object.keys(nextDraft.formatTargets)));
      const profile = compatibleProfiles.find((p) => p.id === profileId);
      if (profile) setProfileLabel(profile.label);
    },
    [accountId, compatibleProfiles, getAccountDraftFromProfile],
  );

  const switchAccount = useCallback(
    (nextId: string) => {
      const nextState = resolveWizardInitialState({
        accountId: nextId,
        getWizardSession,
        getAccountDraft,
        getAccountDraftFromProfile,
        getProfilesForAccount,
        getAssignedProfileId,
      });
      setAccountId(nextState.accountId);
      setStepIndex(nextState.stepIndex);
      setSelectedProfileId(nextState.selectedProfileId);
      setProfileLabel(nextState.profileLabel);
      setDraft(nextState.draft);
      setPillarPriorities(nextState.pillarPriorities);
      setSelectedFormats(nextState.selectedFormats);
    },
    [
      getAccountDraft,
      getAccountDraftFromProfile,
      getAssignedProfileId,
      getProfilesForAccount,
      getWizardSession,
    ],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      persistWizardDraft(
        buildWizardSessionSnapshot({
          accountId,
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
    accountId,
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

  const goNext = useCallback(() => {
    if (step.id === "pillars") applyPillarPriorities();
    if (step.id === "formats") applyFormatSelection();

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
      profileId: selectedProfileId ?? getWizardDraftProfileId(accountId),
    });
    onComplete();
  }, [
    applyFormatSelection,
    applyPillarPriorities,
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
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const roleSum = sumPercentTargets(
    draft.roleTargets as Record<string, number>,
  );
  const canAdvance =
    step.id !== "roles" || Math.abs(roleSum - 100) <= 2 || accountMeta.type === "satellite";

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-5 py-6">
      <StepProgress currentIndex={stepIndex} />

      <div>
        <h2 className="text-lg font-semibold tracking-tight">{step.title}</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          {step.intro}
        </p>
      </div>

      {step.id === "welcome" && (
        <GuideCallout>
          El calendario no reemplaza Ideas ni Inspiración: solo te propone
          huecos con rol, pilar y formato. Vos después elegís ángulo, hook y
          copy en el flujo creativo.
        </GuideCallout>
      )}

      {step.id === "account" && (
        <div className="space-y-5">
          <div className="grid gap-3">
            {planningAccounts.map((account) => (
              <button
                key={account.id}
                type="button"
                onClick={() => switchAccount(account.id)}
                className={cn(
                  "rounded-lg border px-4 py-3 text-left transition-colors",
                  accountId === account.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50",
                )}
              >
                <p className="font-medium text-foreground">{account.label}</p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  {account.type === "official"
                    ? "Cuenta principal · TikTok + Instagram"
                    : `Satélite · ${account.platforms.map((p) => p.toUpperCase()).join(" + ")}`}
                </p>
              </button>
            ))}
          </div>

          {compatibleProfiles.length > 0 ? (
            <div>
              <p className="mb-2 text-[13px] font-medium">
                ¿Partís de un perfil que ya creaste?
              </p>
              <GuideCallout>
                Opcional: elegí un perfil existente como base. Si no, seguí al
                siguiente paso y armás uno nuevo desde cero.
              </GuideCallout>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {compatibleProfiles.map((profile) => (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => applyProfile(profile.id)}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-left transition-colors",
                      selectedProfileId === profile.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50",
                    )}
                  >
                    <p className="text-[13px] font-medium">{profile.label}</p>
                    <p className="mt-0.5 text-[12px] text-muted-foreground">
                      {formatProfileRoleSummary(profile.settings)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <GuideCallout>
              Todavía no tenés perfiles. En los pasos siguientes vas a crear el
              primero para esta cuenta.
            </GuideCallout>
          )}
        </div>
      )}

      {step.id === "rhythm" && (
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-[13px] font-medium">Piezas por día</p>
            <GuideCallout>{RHYTHM_COPY.postsPerDay}</GuideCallout>
            <SingleChoice
              className="mt-3"
              value={String(draft.postsPerDay)}
              onChange={(v) => updateDraft({ postsPerDay: Number(v) })}
              options={[1, 2, 3, 4].map((n) => ({
                value: String(n),
                label: n,
              }))}
            />
          </div>

          <div>
            <p className="mb-2 text-[13px] font-medium">Días activos</p>
            <GuideCallout>{RHYTHM_COPY.activeDays}</GuideCallout>
            <MultiChoice
              className="mt-3"
              values={draft.activeDays.map(String)}
              onChange={(values) =>
                updateDraft({
                  activeDays: values.map(Number).sort((a, b) => a - b),
                })
              }
              options={WEEKDAY_LABELS.map((label, index) => ({
                value: String(index + 1),
                label,
              }))}
            />
          </div>

          <div>
            <p className="mb-2 text-[13px] font-medium">Horarios</p>
            <GuideCallout>{RHYTHM_COPY.timeSlots}</GuideCallout>
            <MultiChoice
              className="mt-3"
              values={draft.timeSlots}
              onChange={(values) =>
                updateDraft({
                  timeSlots: TIME_OPTIONS.filter((t) => values.includes(t)),
                })
              }
              options={TIME_OPTIONS.map((time) => ({
                value: time,
                label: time,
              }))}
            />
          </div>
        </div>
      )}

      {step.id === "roles" && (
        <div className="space-y-5">
          <GuideCallout>
            Pensá el mix como un embudo suave: primero llegás (alcance), después
            enseñás (valor), mostrás (prueba) y recién ahí pedís acción
            (conversión). No hace falta un post de cada rol todos los días.
          </GuideCallout>

          <div className="space-y-3">
            {contentRoles
              .filter(
                (role) =>
                  accountMeta.type !== "satellite" ||
                  !satelliteExcludedRoles.includes(role.id),
              )
              .map((role) => {
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

          {accountMeta.type === "official" ? (
            <p className="text-[13px] text-muted-foreground">
              Suma actual: <strong>{roleSum}%</strong> — idealmente ~100%.
              Prueba y conversión pueden alternar en el mismo slot del día.
            </p>
          ) : (
            <p className="text-[13px] text-muted-foreground">
              En satélites la conversión es excepcional: solo cuando el
              contenido ya calentó la audiencia.
            </p>
          )}
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
          <div className="grid gap-2 sm:grid-cols-2">
            {getSetupFormats().map((format) => {
              const active = selectedFormats.has(format.id);
              return (
                <button
                  key={format.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    setSelectedFormats((prev) => {
                      const next = new Set(prev);
                      if (next.has(format.id)) next.delete(format.id);
                      else next.add(format.id);
                      return next;
                    })
                  }
                  className={cn(
                    "flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                    active
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground",
                    )}
                  >
                    <FormatIcon formatId={format.id} className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13px] font-medium leading-snug">
                        {format.label}
                      </p>
                      {active ? (
                        <CheckIcon
                          className="mt-0.5 size-4 shrink-0 text-primary"
                          weight="bold"
                        />
                      ) : null}
                    </div>
                    <p className="text-[12px] leading-snug text-muted-foreground">
                      {format.summary}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-[13px] text-muted-foreground">
            {selectedFormats.size} formatos seleccionados
          </p>
        </div>
      )}

      {step.id === "variety" && (
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-[13px] font-medium">
              Mismo pilar seguido
            </p>
            <GuideCallout>{VARIETY_COPY.maxConsecutiveSamePillar}</GuideCallout>
            <SingleChoice
              className="mt-3"
              value={String(draft.repetitionLimits.maxConsecutiveSamePillar)}
              onChange={(v) =>
                updateDraft({
                  repetitionLimits: {
                    ...draft.repetitionLimits,
                    maxConsecutiveSamePillar: Number(v),
                  },
                })
              }
              options={[1, 2, 3].map((n) => ({
                value: String(n),
                label: n,
              }))}
            />
          </div>

          <div>
            <p className="mb-2 text-[13px] font-medium">
              Mismo formato en el período
            </p>
            <GuideCallout>{VARIETY_COPY.maxSameFormatInPeriod}</GuideCallout>
            <SingleChoice
              className="mt-3"
              value={String(draft.repetitionLimits.maxSameFormatInPeriod)}
              onChange={(v) =>
                updateDraft({
                  repetitionLimits: {
                    ...draft.repetitionLimits,
                    maxSameFormatInPeriod: Number(v),
                  },
                })
              }
              options={[2, 3, 4, 5].map((n) => ({
                value: String(n),
                label: n,
              }))}
            />
          </div>

          <div>
            <p className="mb-2 text-[13px] font-medium">Mismo rol seguido</p>
            <GuideCallout>{VARIETY_COPY.maxSameRoleInRow}</GuideCallout>
            <SingleChoice
              className="mt-3"
              value={String(draft.repetitionLimits.maxSameRoleInRow)}
              onChange={(v) =>
                updateDraft({
                  repetitionLimits: {
                    ...draft.repetitionLimits,
                    maxSameRoleInRow: Number(v),
                  },
                })
              }
              options={[1, 2, 3].map((n) => ({
                value: String(n),
                label: n,
              }))}
            />
          </div>

          <div>
            <p className="mb-2 text-[13px] font-medium">Distribución default</p>
            <GuideCallout>
              {VARIETY_COPY.defaultDistributionType}
            </GuideCallout>
            <SingleChoice
              className="mt-3"
              value={draft.defaultDistributionType}
              onChange={(v) =>
                updateDraft({ defaultDistributionType: v as DistributionType })
              }
              options={Object.entries(DISTRIBUTION_TYPE_LABELS).map(
                ([id, label]) => ({
                  value: id,
                  label,
                }),
              )}
            />
          </div>
        </div>
      )}

      {step.id === "review" && (
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-[13px] font-medium">Nombre del perfil</p>
            <Input
              value={profileLabel}
              onChange={(e) => setProfileLabel(e.target.value)}
              placeholder="Ej. Oficial Q4 · más alcance"
              className="max-w-md"
            />
            <p className="mt-1.5 text-[12px] text-muted-foreground">
              Se guarda como perfil reutilizable y se asigna a {draft.label}.
            </p>
          </div>
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[15px]">
              <CheckCircleIcon className="size-4 text-primary" />
              {draft.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0 text-[13px] text-muted-foreground">
            <p>
              {draft.postsPerDay} piezas/día ·{" "}
              {draft.activeDays.map((d) => WEEKDAY_BY_ISO[d]).join(", ")} ·{" "}
              {draft.timeSlots.join(", ")}
            </p>
            <p>
              Roles:{" "}
              {Object.entries(draft.roleTargets)
                .filter(([, v]) => v)
                .map(([id, v]) => `${id} ${v}%`)
                .join(" · ")}
            </p>
            <p>
              Pilares activos:{" "}
              {Object.entries(draft.pillarTargets)
                .filter(([, v]) => v > 0)
                .map(([id, v]) => `${getPlanningPillarLabel(id)} ${v}%`)
                .join(" · ")}
            </p>
            <p>
              Formatos:{" "}
              {Object.keys(draft.formatTargets)
                .slice(0, 6)
                .map(getFormatLabel)
                .join(", ")}
              {Object.keys(draft.formatTargets).length > 6 ? "…" : ""}
            </p>
          </CardContent>
        </Card>
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

