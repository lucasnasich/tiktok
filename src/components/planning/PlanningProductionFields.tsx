import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CAMERA_MODE_OPTIONS,
  type CameraMode,
} from "@/content/camera-presence";
import {
  isPublicationTypeAllowedForProduction,
  isPublicationTypeCompatibleWithPlatforms,
  publicationTypes,
  type PublicationTypeId,
} from "@/content/publication-types";
import { PublicationTypeIcon } from "@/components/planning/publication-type-icons";
import { sumPercentTargets } from "@/lib/planning-percent";
import { cn } from "@/lib/utils";

type PlanningPlatform = "tiktok" | "instagram";

type PlanningProductionFieldsProps = {
  cameraMode: CameraMode;
  onCameraModeChange: (mode: CameraMode) => void;
  publicationTypeTargets: Partial<Record<PublicationTypeId, number>>;
  onPublicationTypeTargetsChange: (
    targets: Partial<Record<PublicationTypeId, number>>,
  ) => void;
  platforms?: PlanningPlatform[];
};

export function PlanningProductionFields({
  cameraMode,
  onCameraModeChange,
  publicationTypeTargets,
  onPublicationTypeTargetsChange,
  platforms = [],
}: PlanningProductionFieldsProps) {
  const publicationSum = sumPercentTargets(
    publicationTypeTargets as Record<string, number>,
  );

  const visibleTypes = publicationTypes.filter((type) => {
    if (
      platforms.length > 0 &&
      !isPublicationTypeCompatibleWithPlatforms(type.id, platforms)
    ) {
      return false;
    }
    return isPublicationTypeAllowedForProduction(type.id, cameraMode);
  });

  const updatePublicationTypeTarget = (
    typeId: PublicationTypeId,
    value: number,
  ) => {
    onPublicationTypeTargetsChange({
      ...publicationTypeTargets,
      [typeId]: value,
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-[13px] font-medium">Restricción de producción</p>
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          Elegí si en esta generación se puede grabar a una persona. Sin cámara
          no significa sin video: un reel puede ser motion, screen recording o
          IA.
        </p>
        <div className="grid gap-2">
          {CAMERA_MODE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onCameraModeChange(option.id)}
              className={cn(
                "rounded-lg border px-3 py-2.5 text-left transition-colors",
                cameraMode === option.id
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
      </div>

      <div className="space-y-3">
        <p className="text-[13px] font-medium">Tipos de publicación</p>
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          Qué piezas nativas querés en este lote. El formato creativo se elige
          al desarrollar cada slot.
        </p>
        {visibleTypes.map((type) => {
          const value = publicationTypeTargets[type.id] ?? 0;
          return (
            <Card key={type.id} size="sm" className="ring-border/80">
              <CardHeader className="gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                      <PublicationTypeIcon typeId={type.id} className="size-4" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <CardTitle className="text-[15px]">{type.label}</CardTitle>
                      <p className="text-[13px] text-muted-foreground">
                        {type.summary}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={value}
                      onChange={(event) =>
                        updatePublicationTypeTarget(
                          type.id,
                          Number(event.target.value) || 0,
                        )
                      }
                      className="h-7 w-16 text-center text-[13px]"
                    />
                    <span className="text-[13px] text-muted-foreground">%</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 text-[13px] text-muted-foreground">
                Ejemplo: {type.example}
              </CardContent>
            </Card>
          );
        })}
        <p className="text-[13px] text-muted-foreground">
          Suma actual: <strong>{publicationSum}%</strong> — idealmente ~100%. Un
          tipo en 0% no se programa.
        </p>
      </div>
    </div>
  );
}
