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
  inspirationSearchBrief,
}: {
  spec: SlotSpec;
  editorialDescription?: string;
  inspirationSearchBrief?: string;
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
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-foreground">
            {editorialDescription}
          </p>
          {inspirationSearchBrief ? (
            <div className="rounded-lg border border-border bg-muted/25 px-3 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Qué buscar en inspiración
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-foreground">
                {inspirationSearchBrief}
              </p>
            </div>
          ) : null}
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
