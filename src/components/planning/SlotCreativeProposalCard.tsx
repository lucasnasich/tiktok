import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CREATIVE_GENERATION_MODE_LABELS,
  type CreativeProposal,
} from "@/content/creative-proposals";
import { cn } from "@/lib/utils";

export function SlotCreativeProposalCard({
  proposal,
  selected,
  busy,
  showActions = true,
  onSelect,
  onMoreLikeThis,
}: {
  proposal: CreativeProposal;
  selected: boolean;
  busy?: boolean;
  showActions?: boolean;
  onSelect?: () => void;
  onMoreLikeThis?: () => void;
}) {
  return (
    <article
      className={cn(
        "space-y-3 rounded-lg border px-3 py-3",
        selected ? "border-primary bg-primary/5" : "border-border",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[14px] font-medium leading-snug">{proposal.title}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {CREATIVE_GENERATION_MODE_LABELS[proposal.generationMode]}
            {selected ? " · Dirección elegida" : ""}
          </p>
        </div>
        {selected ? <Badge>Elegida</Badge> : null}
      </div>

      <Field label="Idea" value={proposal.idea} />
      <Field label="Ángulo" value={proposal.angle} />
      <Field label="Qué queremos decir" value={proposal.message} />
      <div className="rounded-md bg-muted/40 px-3 py-2.5">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Qué se ve
        </p>
        <p className="mt-1 text-[13px] leading-relaxed">{proposal.visualConcept}</p>
      </div>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Estructura
        </p>
        <ol className="mt-1 list-decimal space-y-1 pl-4 text-[13px] leading-relaxed">
          {proposal.structure.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
      {proposal.requiredAssets?.length ? (
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Assets
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-[13px] leading-relaxed">
            {proposal.requiredAssets.map((asset) => (
              <li key={asset}>{asset}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-[12px] text-muted-foreground">
          Se puede generar por completo.
        </p>
      )}

      {showActions ? (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selected ? null : (
            <Button type="button" size="sm" disabled={busy} onClick={onSelect}>
              Elegir
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={onMoreLikeThis}
          >
            Más como esta
          </Button>
        </div>
      ) : null}
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-[13px] leading-relaxed">{value}</p>
    </div>
  );
}
