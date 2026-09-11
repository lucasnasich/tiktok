import { cn } from "@/lib/utils";
import { isInspirationClassified } from "@/lib/inspiration-classification";
import type { InspirationMetaOverride } from "@/lib/inspiration-overrides-store";

export function InspirationClassificationLed({
  override,
  className,
}: {
  override?: InspirationMetaOverride;
  className?: string;
}) {
  const classified = isInspirationClassified(override);

  return (
    <span
      className={cn(
        "size-1.5 shrink-0 rounded-full shadow-[0_0_0_1px_color-mix(in_oklch,currentColor_35%,transparent)]",
        classified
          ? "bg-slot-led-published text-slot-led-published"
          : "bg-slot-led-pending text-slot-led-pending",
        className,
      )}
      title={classified ? "Clasificada" : "Sin clasificar"}
      aria-label={classified ? "Clasificada" : "Sin clasificar"}
    />
  );
}
