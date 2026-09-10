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
}: {
  referenceKey: string | null;
  slots: PlanningSlot[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
      description="Biblioteca de inspiración. El matching vive en el slot."
    >
      {item ? (
        <InspirationDetailBody
          item={item}
          usage={usage}
          slots={slots}
          proposals={proposals}
        />
      ) : referenceKey ? (
        <p className="text-[13px] text-muted-foreground">
          No encontramos esa referencia.
        </p>
      ) : null}
    </StudioSheet>
  );
}
