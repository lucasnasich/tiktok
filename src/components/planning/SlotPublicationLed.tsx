import {
  SLOT_PUBLICATION_LED_LABELS,
  type SlotPublicationLed,
} from "@/lib/slot-workflow";
import { cn } from "@/lib/utils";

const LED_CLASS: Record<SlotPublicationLed, string> = {
  pending: "bg-slot-led-pending shadow-[0_0_0_1px_color-mix(in_oklch,var(--slot-led-pending)_40%,transparent)]",
  scheduled:
    "bg-slot-led-scheduled shadow-[0_0_0_1px_color-mix(in_oklch,var(--slot-led-scheduled)_40%,transparent)]",
  published:
    "bg-slot-led-published shadow-[0_0_0_1px_color-mix(in_oklch,var(--slot-led-published)_40%,transparent)]",
};

export function SlotPublicationLed({
  status,
  className,
}: {
  status: SlotPublicationLed;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "size-1.5 shrink-0 rounded-full",
        LED_CLASS[status],
        className,
      )}
      title={SLOT_PUBLICATION_LED_LABELS[status]}
      aria-label={SLOT_PUBLICATION_LED_LABELS[status]}
    />
  );
}
