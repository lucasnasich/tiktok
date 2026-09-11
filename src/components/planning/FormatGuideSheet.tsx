import { StudioSection } from "@/components/studio/StudioSheet";
import { StudioSheet } from "@/components/studio/StudioSheet";
import { FormatIcon } from "@/components/planning/format-icons";
import { getFormatById, getFormatLabel } from "@/content/formats";
import { getFormatGuideOrFallback } from "@/content/format-guides";

export function FormatGuideSheet({
  formatId,
  open,
  onOpenChange,
}: {
  formatId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!formatId) return null;

  const guide = getFormatGuideOrFallback(formatId);
  const label = getFormatLabel(formatId);
  const format = getFormatById(formatId);

  return (
    <StudioSheet
      open={open}
      onOpenChange={onOpenChange}
      title={label}
      description="Qué es este formato y cómo usarlo en contenido."
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background ring-1 ring-foreground/10">
            <FormatIcon formatId={formatId} className="size-5" />
          </div>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {format?.summary}
          </p>
        </div>

        <StudioSection title="Descripción">
          <p className="text-[13px] leading-relaxed text-foreground">
            {guide.paragraph}
          </p>
        </StudioSection>

        <StudioSection title="Ideas con Mercantis">
          <ul className="space-y-2">
            {guide.mercantisIdeas.map((idea) => (
              <li
                key={idea}
                className="rounded-lg border border-border bg-card px-3 py-2.5 text-[13px] leading-relaxed"
              >
                {idea}
              </li>
            ))}
          </ul>
        </StudioSection>
      </div>
    </StudioSheet>
  );
}
