import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CAMERA_MODE_OPTIONS,
  type CameraMode,
} from "@/content/camera-presence";
import {
  applyCameraModeToProduction,
  getProductionOptionsForCamera,
  hasEnabledProductionOptions,
  toggleProductionOption,
  updateProductionTarget,
  type ProductionConfig,
  type ProductionOptionId,
} from "@/content/production-options";
import { ProductionOptionIcon } from "@/components/planning/publication-type-icons";
import { sumPercentTargets } from "@/lib/planning-percent";
import { cn } from "@/lib/utils";

type PlanningProductionFieldsProps = {
  value: ProductionConfig;
  onChange: (next: ProductionConfig) => void;
};

export function PlanningProductionFields({
  value,
  onChange,
}: PlanningProductionFieldsProps) {
  const [cameraNotice, setCameraNotice] = useState<string | null>(null);
  const visibleOptions = getProductionOptionsForCamera(value.cameraMode);
  const enabledSet = new Set(value.enabledIds);
  const enabledOptions = visibleOptions.filter((option) =>
    enabledSet.has(option.id),
  );
  const showDistribution = enabledOptions.length >= 2;
  const distributionSum = sumPercentTargets(
    Object.fromEntries(
      enabledOptions.map((option) => [option.id, value.targets[option.id] ?? 0]),
    ),
  );

  const changeCamera = (cameraMode: CameraMode) => {
    const result = applyCameraModeToProduction(value, cameraMode);
    onChange(result.config);
    setCameraNotice(
      result.strippedIds.length > 0
        ? "Se deshabilitaron las opciones que requieren cámara."
        : null,
    );
  };

  const toggleOption = (optionId: ProductionOptionId, enabled: boolean) => {
    onChange(toggleProductionOption(value, optionId, enabled));
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-[13px] font-medium">Restricción de cámara</p>
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          Sin cámara no significa sin video. Cámara permitida no obliga a
          usarla: las opciones faceless siguen disponibles.
        </p>
        <div className="grid gap-2">
          {CAMERA_MODE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => changeCamera(option.id)}
              className={cn(
                "rounded-lg border px-3 py-2.5 text-left transition-colors",
                value.cameraMode === option.id
                  ? "border-foreground bg-muted/60"
                  : "border-border hover:bg-muted/40",
              )}
            >
              <p className="text-[13px] font-medium">{option.label}</p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
                {option.description}
              </p>
            </button>
          ))}
        </div>
        {cameraNotice ? (
          <p className="text-[12px] text-muted-foreground">{cameraNotice}</p>
        ) : null}
      </div>

      <div className="space-y-3">
        <p className="text-[13px] font-medium">Qué piezas querés producir</p>
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          Elegí las opciones de esta generación. El porcentaje viene después, y
          sólo entre las piezas activas.
        </p>
        <div className="grid gap-2">
          {visibleOptions.map((option) => {
            const enabled = enabledSet.has(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleOption(option.id, !enabled)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                  enabled
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-muted/50",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border",
                    enabled
                      ? "border-primary bg-primary"
                      : "border-input bg-background",
                  )}
                  aria-hidden
                >
                  {enabled ? (
                    <span className="size-1.5 rounded-full bg-primary-foreground" />
                  ) : null}
                </span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                  <ProductionOptionIcon typeId={option.id} className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium">
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-relaxed text-muted-foreground">
                    {option.summary}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        {!hasEnabledProductionOptions(value) ? (
          <p className="text-[12px] text-destructive">
            Tiene que haber al menos una opción activa.
          </p>
        ) : null}
      </div>

      {showDistribution ? (
        <div className="space-y-3">
          <p className="text-[13px] font-medium">Distribución</p>
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            Cómo se reparte el calendario entre las piezas habilitadas.
          </p>
          {enabledOptions.map((option) => {
            const weight = value.targets[option.id] ?? 0;
            return (
              <Card key={option.id} size="sm" className="ring-border/80">
                <CardHeader className="gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-[14px]">{option.label}</CardTitle>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={weight}
                        onChange={(event) =>
                          onChange(
                            updateProductionTarget(
                              value,
                              option.id,
                              Number(event.target.value) || 0,
                            ),
                          )
                        }
                        className="h-7 w-16 text-center text-[13px]"
                      />
                      <span className="text-[13px] text-muted-foreground">
                        %
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 text-[12px] text-muted-foreground">
                  {option.example}
                </CardContent>
              </Card>
            );
          })}
          <p className="text-[13px] text-muted-foreground">
            Suma actual: <strong>{distributionSum}%</strong> — idealmente 100%.
          </p>
        </div>
      ) : enabledOptions.length === 1 ? (
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          Con una sola opción activa, todo el calendario usa{" "}
          <strong>{enabledOptions[0].label}</strong>.
        </p>
      ) : null}
    </div>
  );
}
