import { useEffect, useRef, useState } from "react";
import { SparkleIcon, TextAlignLeftIcon } from "@phosphor-icons/react";

import { StudioSection } from "@/components/studio/StudioSheet";
import { Button } from "@/components/ui/button";
import type { SlotSpec } from "@/content/slot-specs";
import { fetchSlotDescription } from "@/lib/inspiration-intelligence";

export function SlotEditorialDescription({
  spec,
  accountLabel,
  editorialDescription,
  inspirationSearchBrief,
  structuralSearchBrief,
  visualSearchBrief,
  onGenerated,
}: {
  spec: SlotSpec;
  accountLabel?: string;
  editorialDescription?: string;
  inspirationSearchBrief?: string;
  structuralSearchBrief?: string;
  visualSearchBrief?: string;
  onGenerated: (payload: {
    editorialDescription: string;
    structuralSearchBrief: string;
    visualSearchBrief: string;
  }) => void;
}) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasDescription = Boolean(editorialDescription?.trim());
  const slotIdRef = useRef(spec.slotId);
  slotIdRef.current = spec.slotId;

  useEffect(() => {
    setError(null);
    setGenerating(false);
  }, [spec.slotId]);

  async function generate() {
    if (generating) return;
    const requestedId = spec.slotId;
    setGenerating(true);
    setError(null);
    try {
      const payload = await fetchSlotDescription({ spec, accountLabel });
      if (requestedId !== slotIdRef.current) return;
      onGenerated(payload);
    } catch (caught) {
      if (requestedId !== slotIdRef.current) return;
      const message =
        caught instanceof Error && caught.message.trim()
          ? caught.message.trim()
          : "No se pudo generar la descripción.";
      setError(message);
    } finally {
      if (requestedId === slotIdRef.current) setGenerating(false);
    }
  }

  const actionLabel = generating
    ? "Generando…"
    : hasDescription
      ? "Regenerar"
      : "Generar con Gemini";

  return (
    <StudioSection title="Descripción">
      {hasDescription ? (
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-foreground">
            {editorialDescription}
          </p>
          {structuralSearchBrief ? (
            <div className="rounded-lg border border-border bg-muted/25 px-3 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Brief estructural
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-foreground">
                {structuralSearchBrief}
              </p>
            </div>
          ) : null}
          {visualSearchBrief ? (
            <div className="rounded-lg border border-border bg-muted/25 px-3 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Brief visual
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-foreground">
                {visualSearchBrief}
              </p>
            </div>
          ) : null}
          {!structuralSearchBrief && !visualSearchBrief && inspirationSearchBrief ? (
            <div className="rounded-lg border border-border bg-muted/25 px-3 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Qué buscar en inspiración
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-foreground">
                {inspirationSearchBrief}
              </p>
            </div>
          ) : null}
          <div className="space-y-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={generating}
              onClick={generate}
            >
              <SparkleIcon className="size-3.5" />
              {actionLabel}
            </Button>
            {error ? (
              <p className="text-[12px] text-destructive">{error}</p>
            ) : null}
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-8 text-center"
        >
          <div className="flex size-9 items-center justify-center rounded-full bg-muted">
            <TextAlignLeftIcon
              className="size-4 text-muted-foreground"
              weight="bold"
            />
          </div>
          <p className="text-[13px] font-medium text-foreground">
            Sin descripción todavía
          </p>
          <Button
            type="button"
            size="sm"
            disabled={generating}
            onClick={generate}
          >
            <SparkleIcon className="size-3.5" />
            {actionLabel}
          </Button>
          {error ? (
            <p className="text-[12px] text-destructive">{error}</p>
          ) : null}
        </div>
      )}
    </StudioSection>
  );
}
