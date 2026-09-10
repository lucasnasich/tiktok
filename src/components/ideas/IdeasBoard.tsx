import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckIcon, PlusIcon } from "@phosphor-icons/react";

import { PageStack } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { angles, getAngleLabel } from "@/content/angles";
import { getContentRoleLabel } from "@/content/content-roles";
import { getFormatLabel } from "@/content/formats";
import {
  IDEA_SOURCE_TYPE_LABELS,
  IDEA_STATUS_LABELS,
  type Idea,
  type IdeaSourceType,
} from "@/content/ideas";
import { MERCANTIS_BRAIN_DOCS } from "@/content/mercantis-brain";
import { getPlanningAccountLabel } from "@/content/planning-accounts";
import { getPlanningPillarLabel } from "@/content/planning-pillars";
import type { PlanningSlot } from "@/content/planned-slots";
import { useIdeas } from "@/hooks/use-ideas";
import { createIdeaId, ideasForSlot, selectedIdeaForSlot } from "@/lib/ideas-store";
import { cn } from "@/lib/utils";

const PLATFORM_LABELS: Record<string, string> = {
  tiktok: "TikTok",
  instagram: "IG",
};

const BRAIN_PICKER_DOCS = MERCANTIS_BRAIN_DOCS.filter(
  (doc) => doc.id !== "readme" && doc.id !== "master",
);

const SOURCE_OPTIONS: { id: IdeaSourceType; hint: string }[] = [
  {
    id: "inspiration",
    hint: "Partís de una referencia del Studio.",
  },
  {
    id: "brain",
    hint: "Partís de materia prima propia de Mercantis.",
  },
  {
    id: "manual",
    hint: "Escribís una señal, concepto o instrucción.",
  },
];

function slotBrief(slot: PlanningSlot): string {
  return [
    getPlanningAccountLabel(slot.accountId),
    getContentRoleLabel(slot.roleId),
    getPlanningPillarLabel(slot.pillarId),
    getFormatLabel(slot.formatId),
  ].join(" · ");
}

function SlotBriefCard({ slot }: { slot: PlanningSlot }) {
  return (
    <Card size="sm" className="ring-border/80">
      <CardHeader className="gap-2">
        <CardTitle className="text-[15px] tracking-tight">Brief del slot</CardTitle>
        <p className="text-[13px] text-muted-foreground">
          Lo decide Planificación. Idea no vuelve a elegir cuenta, rol, pilar ni formato.
        </p>
      </CardHeader>
      <CardContent className="grid gap-2 pt-0 sm:grid-cols-2">
        <BriefField label="Cuenta" value={getPlanningAccountLabel(slot.accountId)} />
        <BriefField
          label="Plataformas"
          value={slot.platforms.map((p) => PLATFORM_LABELS[p] ?? p).join(" + ")}
        />
        <BriefField label="Fecha / hora" value={`${slot.date} · ${slot.time}`} />
        <BriefField label="Rol" value={getContentRoleLabel(slot.roleId)} />
        <BriefField label="Pilar" value={getPlanningPillarLabel(slot.pillarId)} />
        <BriefField label="Formato" value={getFormatLabel(slot.formatId)} />
      </CardContent>
    </Card>
  );
}

function BriefField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-[13px] text-foreground">{value}</p>
    </div>
  );
}

function IdeaComposer({
  slot,
  onSave,
}: {
  slot: PlanningSlot;
  onSave: (idea: Idea) => void;
}) {
  const [sourceType, setSourceType] = useState<IdeaSourceType>("manual");
  const [sourceRef, setSourceRef] = useState("");
  const [signal, setSignal] = useState("");
  const [angleId, setAngleId] = useState("");
  const [concept, setConcept] = useState("");
  const [hook, setHook] = useState("");
  const [brainRefs, setBrainRefs] = useState<string[]>([]);

  const canSave = angleId.length > 0 && concept.trim().length > 0 && hook.trim().length > 0;

  function toggleBrainRef(file: string) {
    setBrainRefs((prev) =>
      prev.includes(file) ? prev.filter((item) => item !== file) : [...prev, file],
    );
  }

  function save() {
    if (!canSave) return;
    onSave({
      id: createIdeaId(),
      planSlotId: slot.id,
      sourceType,
      sourceRef: sourceRef.trim() || undefined,
      signal: signal.trim() || undefined,
      angleId,
      concept: concept.trim(),
      hook: hook.trim(),
      brainRefs: sourceType === "brain" || brainRefs.length > 0 ? brainRefs : undefined,
      status: "candidate",
    });
    setSourceRef("");
    setSignal("");
    setConcept("");
    setHook("");
  }

  return (
    <div className="space-y-4">
      <SlotBriefCard slot={slot} />

      <div className="space-y-3">
        <p className="text-[13px] font-medium text-foreground">Fuente</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {SOURCE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setSourceType(option.id)}
              className={cn(
                "rounded-lg border px-3 py-2.5 text-left transition-colors",
                sourceType === option.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50",
              )}
            >
              <p className="text-[13px] font-medium">
                {IDEA_SOURCE_TYPE_LABELS[option.id]}
              </p>
              <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">
                {option.hint}
              </p>
            </button>
          ))}
        </div>
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          Aunque la fuente sea Inspiración o Manual, el agente consulta el Mercantis
          Brain cuando hay que adaptar la idea a hechos reales de Mercantis.
        </p>
      </div>

      {sourceType === "inspiration" ? (
        <div>
          <p className="mb-1.5 text-[13px] font-medium">Referencia</p>
          <Input
            value={sourceRef}
            onChange={(event) => setSourceRef(event.target.value)}
            placeholder="ID o nota de la referencia (opcional)"
          />
        </div>
      ) : null}

      {sourceType === "brain" ? (
        <div>
          <p className="mb-1.5 text-[13px] font-medium">Documentos del Brain</p>
          <div className="grid max-h-48 gap-1 overflow-y-auto rounded-lg border border-border p-2 sm:grid-cols-2">
            {BRAIN_PICKER_DOCS.map((doc) => {
              const active = brainRefs.includes(doc.file);
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => toggleBrainRef(doc.file)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px]",
                    active ? "bg-primary/10 text-foreground" : "hover:bg-muted/60",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded border",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border",
                    )}
                  >
                    {active ? <CheckIcon className="size-3" weight="bold" /> : null}
                  </span>
                  {doc.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div>
        <p className="mb-1.5 text-[13px] font-medium">Señal</p>
        <Input
          value={signal}
          onChange={(event) => setSignal(event.target.value)}
          placeholder="Qué viste, escuchaste o querés contar"
        />
      </div>

      <div>
        <p className="mb-2 text-[13px] font-medium">Ángulo</p>
        <div className="flex flex-wrap gap-2">
          {angles.map((angle) => (
            <Button
              key={angle.id}
              type="button"
              size="sm"
              variant={angleId === angle.id ? "default" : "outline"}
              onClick={() => setAngleId(angle.id)}
            >
              {angle.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-[13px] font-medium">Concepto</p>
        <Input
          value={concept}
          onChange={(event) => setConcept(event.target.value)}
          placeholder="Qué cuenta esta pieza, en una frase"
        />
      </div>

      <div>
        <p className="mb-1.5 text-[13px] font-medium">Hook</p>
        <Input
          value={hook}
          onChange={(event) => setHook(event.target.value)}
          placeholder="Apertura que frena el scroll"
        />
      </div>

      <Button type="button" size="sm" disabled={!canSave} onClick={save}>
        <PlusIcon className="size-3.5" />
        Guardar candidata
      </Button>
    </div>
  );
}

function IdeaCard({
  idea,
  onSelect,
}: {
  idea: Idea;
  onSelect: (id: string) => void;
}) {
  const selected = idea.status === "selected" || idea.status === "in-copy";

  return (
    <Card size="sm" className="ring-border/80">
      <CardHeader>
        <CardTitle className="text-[15px] tracking-tight">{idea.hook}</CardTitle>
        <CardAction>
          <Badge variant={selected ? "default" : "secondary"} className="text-[11px]">
            {IDEA_STATUS_LABELS[idea.status]}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <p className="text-[13px] leading-relaxed text-foreground">{idea.concept}</p>
        <p className="text-[12px] text-muted-foreground">
          {IDEA_SOURCE_TYPE_LABELS[idea.sourceType]}
          {idea.signal ? ` · ${idea.signal}` : ""}
          {" · "}
          {getAngleLabel(idea.angleId)}
        </p>
        {idea.brainRefs && idea.brainRefs.length > 0 ? (
          <p className="text-[11px] text-muted-foreground">
            Brain: {idea.brainRefs.join(", ")}
          </p>
        ) : null}
        {selected ? null : (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => onSelect(idea.id)}
          >
            Seleccionar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function IdeasBoard({
  slots,
  todayIso,
}: {
  slots: PlanningSlot[];
  todayIso: string;
}) {
  const [params, setParams] = useSearchParams();
  const slotId = params.get("slot");
  const { ideas, addIdea, selectIdea } = useIdeas();

  const slotById = useMemo(
    () => new Map(slots.map((slot) => [slot.id, slot])),
    [slots],
  );
  const activeSlot = slotId ? slotById.get(slotId) : undefined;

  const grouped = useMemo(() => {
    const groups = new Map<string, Idea[]>();
    for (const idea of ideas) {
      const list = groups.get(idea.planSlotId) ?? [];
      list.push(idea);
      groups.set(idea.planSlotId, list);
    }
    return [...groups.entries()].sort((a, b) => {
      const slotA = slotById.get(a[0]);
      const slotB = slotById.get(b[0]);
      if (!slotA || !slotB) return a[0].localeCompare(b[0]);
      return (
        slotA.date.localeCompare(slotB.date) ||
        slotA.time.localeCompare(slotB.time)
      );
    });
  }, [ideas, slotById]);

  const upcoming = useMemo(() => {
    return slots
      .filter((slot) => slot.date >= todayIso && slot.status !== "publicado")
      .filter((slot) => !selectedIdeaForSlot(ideas, slot.id))
      .slice(0, 10);
  }, [ideas, slots, todayIso]);

  function openSlot(id: string) {
    setParams({ slot: id });
  }

  return (
    <PageStack className="gap-6">
      {slotId && !activeSlot ? (
        <p className="text-[14px] text-muted-foreground">
          No encontramos ese slot en el horizonte de planificación.
        </p>
      ) : null}

      {activeSlot ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[15px] font-medium tracking-tight">Nueva idea</h2>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setParams({})}
            >
              Cerrar
            </Button>
          </div>
          <IdeaComposer slot={activeSlot} onSave={addIdea} />
          {ideasForSlot(ideas, activeSlot.id).length > 0 ? (
            <div className="space-y-2">
              <p className="text-[13px] font-medium">Candidatas de este slot</p>
              {ideasForSlot(ideas, activeSlot.id).map((idea) => (
                <IdeaCard key={idea.id} idea={idea} onSelect={selectIdea} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {grouped.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-[15px] font-medium tracking-tight">Ideas por slot</h2>
          {grouped.map(([planSlotId, slotIdeas]) => {
            const slot = slotById.get(planSlotId);
            return (
              <div key={planSlotId} className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[13px] font-medium text-foreground">
                    {slot
                      ? `${slot.date} ${slot.time} · ${slotBrief(slot)}`
                      : planSlotId}
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => openSlot(planSlotId)}
                  >
                    Nueva candidata
                  </Button>
                </div>
                {slotIdeas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} onSelect={selectIdea} />
                ))}
              </div>
            );
          })}
        </section>
      ) : !activeSlot ? (
        <p className="text-[14px] leading-relaxed text-muted-foreground">
          Todavía no hay ideas. Elegí un slot en Planificación y creá la primera,
          o partí de un slot pendiente acá abajo.
        </p>
      ) : null}

      {upcoming.length > 0 && !activeSlot ? (
        <section className="space-y-3">
          <h2 className="text-[15px] font-medium tracking-tight">
            Slots sin idea seleccionada
          </h2>
          <div className="grid gap-2">
            {upcoming.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => openSlot(slot.id)}
                className="rounded-lg border border-border px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
              >
                <p className="text-[13px] font-medium">
                  {slot.date} · {slot.time} · {getContentRoleLabel(slot.roleId)}
                </p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  {slotBrief(slot)}
                </p>
              </button>
            ))}
          </div>
          <p className="text-[12px] text-muted-foreground">
            También podés partir desde el{" "}
            <Link to="/planificacion" className="underline underline-offset-2">
              calendario
            </Link>
            .
          </p>
        </section>
      ) : null}
    </PageStack>
  );
}
