import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react";

import { InspirationClassificationAudio } from "@/components/inspiration/InspirationClassificationAudio";
import { InspirationClassificationPreview } from "@/components/inspiration/InspirationClassificationPreview";
import { StudioSheet } from "@/components/studio/StudioSheet";
import { Button } from "@/components/ui/button";
import type { InspirationFeedItem } from "@/content/inspiration-feed";
import { getInspirationByKey } from "@/content/inspiration-feed";
import { useInspirationClassificationNotes } from "@/hooks/use-inspiration-classification-notes";
import {
  isInspirationClassified,
  unclassifiedInspirationKeys,
} from "@/lib/inspiration-classification";
import { cursorPromptForInspirationClassification } from "@/lib/inspiration-classification-prompt";
import type { InspirationMetaOverride } from "@/lib/inspiration-overrides-store";
import { copyText } from "@/lib/clipboard";
import { cn } from "@/lib/utils";

export function InspirationClassificationSheet({
  open,
  onOpenChange,
  items,
  overrides,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: InspirationFeedItem[];
  overrides: Record<string, InspirationMetaOverride>;
}) {
  const { getNote, patchNote } = useInspirationClassificationNotes();
  const pendingKeys = useMemo(
    () => unclassifiedInspirationKeys(items, overrides),
    [items, overrides],
  );
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [hasAudio, setHasAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contextText, setContextText] = useState("");

  const currentItem = currentKey
    ? getInspirationByKey(currentKey, overrides)
    : undefined;
  const currentIndex = currentKey
    ? pendingKeys.indexOf(currentKey)
    : -1;
  const isClassified =
    currentKey ? isInspirationClassified(overrides[currentKey]) : false;
  const allDone = pendingKeys.length === 0;

  useEffect(() => {
    if (!open) return;
    setCurrentKey(unclassifiedInspirationKeys(items, overrides)[0] ?? null);
  }, [open]);

  useEffect(() => {
    if (!currentKey) return;
    const saved = getNote(currentKey);
    setContextText(saved?.contextText ?? "");
    setHasAudio(saved?.hasAudio ?? false);
    setCopied(false);
  }, [currentKey, getNote]);

  useEffect(() => {
    if (!currentKey) return;
    patchNote(currentKey, {
      contextText,
      hasAudio,
      recordedAt: hasAudio ? new Date().toISOString() : undefined,
    });
  }, [contextText, currentKey, hasAudio, patchNote]);

  function goToKey(key: string | null) {
    setCurrentKey(key);
  }

  function goPrev() {
    if (currentIndex > 0) goToKey(pendingKeys[currentIndex - 1]);
  }

  function goNext() {
    if (currentIndex >= 0 && currentIndex < pendingKeys.length - 1) {
      goToKey(pendingKeys[currentIndex + 1]);
    }
  }

  async function copyCursorPrompt() {
    if (!currentItem) return;
    const ok = await copyText(
      cursorPromptForInspirationClassification(currentItem, {
        contextText,
        hasAudio,
      }),
    );
    setCopied(ok);
    if (ok) window.setTimeout(() => setCopied(false), 2000);
  }

  const title =
    allDone && !currentKey ? "Clasificación completa" : "Clasificar referencias";

  const description =
    allDone && !currentKey
      ? "Todas las referencias tienen clasificación en el repo o en overrides."
      : currentKey
        ? `${pendingKeys.length} pendientes · una por una con Cursor`
        : undefined;

  return (
    <StudioSheet
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      footer={
        currentKey && currentItem ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={currentIndex <= 0}
                onClick={goPrev}
                aria-label="Referencia anterior"
              >
                <ArrowLeftIcon className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={
                  currentIndex < 0 || currentIndex >= pendingKeys.length - 1
                }
                onClick={goNext}
                aria-label="Referencia siguiente"
              >
                <ArrowRightIcon className="size-3.5" />
              </Button>
              <p className="text-[12px] text-muted-foreground">
                {currentIndex >= 0
                  ? `${currentIndex + 1} / ${pendingKeys.length}`
                  : null}
              </p>
            </div>
            <Button type="button" size="sm" onClick={copyCursorPrompt}>
              {copied ? "Pedido copiado" : "Copiar pedido a Cursor"}
            </Button>
          </div>
        ) : allDone ? (
          <Button type="button" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        ) : null
      }
    >
      {allDone && !currentKey ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <CheckCircleIcon
            className="size-10 text-slot-led-published"
            weight="fill"
          />
          <p className="text-[14px] font-medium">¡Listo!</p>
          <p className="max-w-sm text-[13px] leading-relaxed text-muted-foreground">
            No quedan referencias sin clasificar.
          </p>
        </div>
      ) : currentItem ? (
        <div className="space-y-5">
          {isClassified ? (
            <p className="rounded-lg border border-slot-led-published/30 bg-slot-led-published/5 px-3 py-2 text-[12px] text-foreground">
              Esta referencia ya está clasificada. Podés revisarla o pasar a la
              siguiente.
            </p>
          ) : (
            <p className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-[12px] leading-relaxed text-muted-foreground">
              Mirá la referencia completa, grabá un audio (o escribí contexto) y
              copiá el pedido a Cursor. Adjuntá el audio en el chat: Cursor
              clasifica y guarda en{" "}
              <code className="text-[11px]">inspiration-classification-records.ts</code>.
            </p>
          )}

          <InspirationClassificationPreview item={currentItem} />

          <InspirationClassificationAudio
            key={currentKey}
            referenceKey={currentKey!}
            onRecordingChange={setHasAudio}
          />

          <div className="space-y-2">
            <label
              htmlFor="classification-context"
              className="text-[13px] font-medium"
            >
              Contexto escrito (opcional)
            </label>
            <textarea
              id="classification-context"
              value={contextText}
              onChange={(event) => setContextText(event.target.value)}
              placeholder="Si preferís escribir en lugar de audio: qué hace la pieza, qué mecanismo copiarías, para qué slot te serviría..."
              rows={4}
              className={cn(
                "w-full min-w-0 resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30",
              )}
            />
          </div>
        </div>
      ) : null}
    </StudioSheet>
  );
}
