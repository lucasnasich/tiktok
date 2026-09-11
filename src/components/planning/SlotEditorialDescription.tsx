import { useEffect, useState } from "react";
import { CopyIcon, TextAlignLeftIcon } from "@phosphor-icons/react";

import { StudioSection } from "@/components/studio/StudioSheet";
import { Button } from "@/components/ui/button";
import type { SlotSpec } from "@/content/slot-specs";
import { copyText } from "@/lib/clipboard";
import { cursorPromptForSlotDescription } from "@/lib/slot-spec";

export function SlotEditorialDescription({
  spec,
  editorialDescription,
}: {
  spec: SlotSpec;
  editorialDescription?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [spec.slotId]);

  async function copyPrompt() {
    const ok = await copyText(cursorPromptForSlotDescription(spec));
    if (ok) setCopied(true);
  }

  return (
    <StudioSection title="Descripción">
      {editorialDescription ? (
        <p className="text-[13px] leading-relaxed text-foreground">
          {editorialDescription}
        </p>
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
            variant="outline"
            onClick={copyPrompt}
          >
            <CopyIcon className="size-3.5" />
            {copied ? "Pedido copiado" : "Copiar pedido a Cursor"}
          </Button>
        </div>
      )}
    </StudioSection>
  );
}
