import { TrashIcon } from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatCalendarGenerationMeta,
  type CalendarGeneration,
} from "@/content/calendar-generations";
import { cn } from "@/lib/utils";

function formatCreatedAt(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function GenerationRow({
  generation,
  active,
  onSelect,
  onDelete,
}: {
  generation: CalendarGeneration;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border px-3 py-2.5",
        active ? "border-primary bg-primary/5" : "border-border bg-card",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="min-w-0 flex-1 text-left"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="text-[13px] font-medium leading-snug text-foreground">
            {generation.label}
          </p>
          {active ? (
            <Badge variant="secondary" className="text-[10px]">
              Activa
            </Badge>
          ) : null}
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          {formatCalendarGenerationMeta(generation)}
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Creada {formatCreatedAt(generation.createdAt)}
        </p>
      </button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-8 shrink-0 text-destructive hover:text-destructive [&_svg]:size-3.5"
        aria-label={`Eliminar generación ${generation.label}`}
        onClick={onDelete}
      >
        <TrashIcon />
      </Button>
    </div>
  );
}

export function PlanningGenerationsPanel({
  generations,
  activeGenerationId,
  onSelect,
  onDelete,
}: {
  generations: CalendarGeneration[];
  activeGenerationId?: string;
  onSelect: (generationId: string) => void;
  onDelete: (generationId: string) => void;
}) {
  const ordered = [...generations].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt),
  );

  if (ordered.length === 0) {
    return (
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        Todavía no hay generaciones. Creá una con el botón Nuevo.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {ordered.map((generation) => (
        <li key={generation.id}>
          <GenerationRow
            generation={generation}
            active={generation.id === activeGenerationId}
            onSelect={() => onSelect(generation.id)}
            onDelete={() => onDelete(generation.id)}
          />
        </li>
      ))}
    </ul>
  );
}
