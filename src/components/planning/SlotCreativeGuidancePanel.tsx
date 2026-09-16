import { Button } from "@/components/ui/button";
import { getInspirationByKey } from "@/content/inspiration-feed";
import type { CreativeProposalGuidance } from "@/content/creative-proposals";
import { cn } from "@/lib/utils";

export function SlotCreativeGuidancePanel({
  formats,
  feedKeys,
  value,
  onChange,
  onGenerate,
  onCancel,
  busy,
}: {
  formats: Array<{ id: string; label: string; summary: string }>;
  feedKeys: string[];
  value: CreativeProposalGuidance;
  onChange: (next: CreativeProposalGuidance) => void;
  onGenerate: () => void;
  onCancel: () => void;
  busy?: boolean;
}) {
  const selectedFormats = new Set(value.creativeFormatIds ?? []);
  const selectedRefs = new Set(value.inspirationRefs ?? []);

  function toggleFormat(id: string) {
    const next = new Set(selectedFormats);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange({ ...value, creativeFormatIds: [...next] });
  }

  function toggleRef(key: string) {
    const next = new Set(selectedRefs);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange({ ...value, inspirationRefs: [...next] });
  }

  return (
    <div className="space-y-4 rounded-lg border border-border px-3 py-3">
      <div>
        <p className="text-[13px] font-medium">Formatos creativos</p>
        <p className="mt-0.5 text-[12px] text-muted-foreground">
          Guidance, no una camisa de fuerza. Sólo aparecen opciones compatibles
          con esta producción. Ninguna viene seleccionada.
        </p>
        <div className="mt-2 flex max-h-48 flex-col gap-1 overflow-y-auto">
          {formats.map((format) => {
            const active = selectedFormats.has(format.id);
            return (
              <button
                key={format.id}
                type="button"
                className={cn(
                  "rounded-md border px-2.5 py-2 text-left",
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/40",
                )}
                onClick={() => toggleFormat(format.id)}
              >
                <p className="text-[13px] font-medium">{format.label}</p>
                <p className="text-[11px] text-muted-foreground">
                  {format.summary}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[13px] font-medium">Referencias de inspiración</p>
        <p className="mt-0.5 text-[12px] text-muted-foreground">
          Dirección visual o estructural a explorar. No se copian.
        </p>
        <div className="mt-2 flex max-h-40 flex-col gap-1 overflow-y-auto">
          {feedKeys.length === 0 ? (
            <p className="text-[12px] text-muted-foreground">
              No hay referencias compatibles con esta producción.
            </p>
          ) : (
            feedKeys.map((key) => {
              const item = getInspirationByKey(key);
              const active = selectedRefs.has(key);
              return (
                <button
                  key={key}
                  type="button"
                  className={cn(
                    "rounded-md border px-2.5 py-2 text-left",
                    active
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/40",
                  )}
                  onClick={() => toggleRef(key)}
                >
                  <p className="text-[13px] font-medium">
                    {item?.title ?? key}
                  </p>
                  {item?.signal ? (
                    <p className="line-clamp-2 text-[11px] text-muted-foreground">
                      {item.signal}
                    </p>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div>
        <p className="text-[13px] font-medium">Instrucción libre</p>
        <textarea
          className="mt-1 min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          placeholder="Quiero algo más agresivo. Menos texto, más metáfora visual."
          value={value.instruction ?? ""}
          onChange={(event) =>
            onChange({ ...value, instruction: event.target.value })
          }
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Button type="button" size="sm" disabled={busy} onClick={onGenerate}>
          Generar 5 orientadas
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={busy}
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}
