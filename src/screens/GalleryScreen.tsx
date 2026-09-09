import { Check, Copy, Image as ImageIcon, LayoutGrid } from "lucide-react";
import { useState } from "react";

import { Playground } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { assets, type Asset } from "@/lib/images";

const COLUMN_OPTIONS = [
  { value: 3, label: "3 columnas" },
  { value: 4, label: "4 columnas" },
] as const;

type ColumnCount = (typeof COLUMN_OPTIONS)[number]["value"];

function ColumnSelector({
  value,
  onChange,
}: {
  value: ColumnCount;
  onChange: (value: ColumnCount) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-sm" aria-label="Columnas">
          <LayoutGrid className="size-4" strokeWidth={1.75} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuRadioGroup
          value={String(value)}
          onValueChange={(next) => onChange(Number(next) as ColumnCount)}
        >
          {COLUMN_OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={String(option.value)}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function GalleryTile({ asset }: { asset: Asset }) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);

  async function copyPrompt() {
    if (!asset.prompt) return;
    await navigator.clipboard.writeText(asset.prompt);
    setCopiedPrompt(true);
    window.setTimeout(() => setCopiedPrompt(false), 1500);
  }

  async function copyImage() {
    const response = await fetch(asset.src);
    const blob = await response.blob();
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    setCopiedImage(true);
    window.setTimeout(() => setCopiedImage(false), 1500);
  }

  const showActions = copiedPrompt || copiedImage;

  return (
    <div className="group relative aspect-[9/16] bg-muted">
      <div className="relative size-full overflow-hidden">
        <img src={asset.src} alt="" className="size-full object-cover" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black/25 opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>

      <div
        className={cn(
          "absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-1.5",
          "opacity-0 group-hover:opacity-100 focus-within:opacity-100",
          showActions && "opacity-100",
        )}
      >
        {asset.prompt ? (
          <Button
            type="button"
            variant="secondary"
            size="xs"
            onClick={copyPrompt}
            aria-label="Copiar prompt"
            className="gap-1.5 border-0 bg-black/55 p-1.5 text-[10px] text-white shadow-none hover:bg-black/70"
          >
            {copiedPrompt ? (
              <Check className="size-3 shrink-0" strokeWidth={2} />
            ) : (
              <Copy className="size-3 shrink-0" strokeWidth={2} />
            )}
            <span className="leading-none">
              {copiedPrompt ? "Copiado" : "Copiar prompt"}
            </span>
          </Button>
        ) : null}
        <Button
          type="button"
          variant="secondary"
          size="xs"
          onClick={copyImage}
          aria-label="Copiar imagen"
          className="gap-1.5 border-0 bg-black/55 p-1.5 text-[10px] text-white shadow-none hover:bg-black/70"
        >
          {copiedImage ? (
            <Check className="size-3 shrink-0" strokeWidth={2} />
          ) : (
            <ImageIcon className="size-3 shrink-0" strokeWidth={2} />
          )}
          <span className="leading-none">
            {copiedImage ? "Copiado" : "Copiar imagen"}
          </span>
        </Button>
      </div>
    </div>
  );
}

export function GalleryScreen() {
  const [columns, setColumns] = useState<ColumnCount>(4);

  return (
    <Playground
      title="Imágenes"
      meta={`${assets.length}`}
      fullWidth
      actions={<ColumnSelector value={columns} onChange={setColumns} />}
    >
      <div
        className="grid gap-px bg-white"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {assets.map((asset) => (
          <GalleryTile key={asset.src} asset={asset} />
        ))}
      </div>
    </Playground>
  );
}
