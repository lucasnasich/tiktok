import { StudioSheet } from "@/components/studio/StudioSheet";
import { InspirationDetailBody } from "@/components/inspiration/InspirationDetailBody";
import { getInspirationByKey } from "@/content/inspiration-feed";
import type { PlanningSlot } from "@/content/planned-slots";
import { useInspirationOverrides } from "@/hooks/use-inspiration-overrides";
import { useProposals } from "@/hooks/use-proposals";
import { useSlotSpecs } from "@/hooks/use-slot-specs";
import { usageForInspiration } from "@/lib/inspiration-usage";

export function InspirationDetailSheet({
  referenceKey,
  slots,
  open,
  onOpenChange,
  slotPickId,
  onPickForSlot,
}: {
  referenceKey: string | null;
  slots: PlanningSlot[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slotPickId?: string | null;
  onPickForSlot?: (referenceKey: string) => void;
}) {
  const { overrides } = useInspirationOverrides();
  const { proposals } = useProposals();
  const { records } = useSlotSpecs();
  const item = referenceKey
    ? getInspirationByKey(referenceKey, overrides)
    : undefined;
  const usage = referenceKey
    ? usageForInspiration(referenceKey, proposals, Object.values(records), slots)
    : {
        count: 0,
        proposalIds: [],
        slotIds: [],
        angleIds: [],
        accountIds: [],
      };

  return (
    <StudioSheet
      open={open}
      onOpenChange={onOpenChange}
      title={item?.title ?? "Referencia"}
      description={
        slotPickId
          ? "Elegí la referencia que querés usar para este slot."
          : "Biblioteca de inspiración."
      }
    >
      {item ? (
        <InspirationDetailBody
          item={item}
          usage={usage}
          slots={slots}
          proposals={proposals}
          onUse={
            slotPickId && onPickForSlot
              ? () => onPickForSlot(item.key)
              : undefined
          }
        />
      ) : referenceKey ? (
        <p className="text-[13px] text-muted-foreground">
          No encontramos esa referencia.
        </p>
      ) : null}
    </StudioSheet>
  );
}
