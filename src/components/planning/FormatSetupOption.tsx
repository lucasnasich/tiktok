import { CheckIcon, InfoIcon } from "@phosphor-icons/react";

import { FormatIcon } from "@/components/planning/format-icons";
import { Button } from "@/components/ui/button";
import type { Format } from "@/content/formats";
import { cn } from "@/lib/utils";

export function FormatSetupOption({
  format,
  active,
  onToggle,
  onOpenGuide,
}: {
  format: Format;
  active: boolean;
  onToggle: () => void;
  onOpenGuide: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors",
        active
          ? "border-primary bg-primary/5"
          : "border-border hover:bg-muted/50",
      )}
    >
      <button
        type="button"
        aria-pressed={active}
        onClick={onToggle}
        className="flex min-w-0 flex-1 items-start gap-3 text-left"
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

        <div className="min-w-0 flex-1 space-y-0.5 pr-1">
          <p className="text-[13px] font-medium leading-snug">{format.label}</p>
          <p className="text-[12px] leading-snug text-muted-foreground">
            {format.summary}
          </p>
        </div>
      </button>

      <div className="flex w-8 shrink-0 flex-col items-center gap-1 pt-0.5">
        <div className="flex size-5 items-center justify-center">
          {active ? (
            <CheckIcon
              className="size-4 text-primary"
              weight="bold"
              aria-hidden
            />
          ) : null}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          className={cn(
            "size-7 text-muted-foreground hover:text-foreground",
            !active && "opacity-50",
          )}
          aria-label={`Más información sobre ${format.label}`}
          onClick={onOpenGuide}
        >
          <InfoIcon className="size-3.5" weight="bold" />
        </Button>
      </div>
    </div>
  );
}
