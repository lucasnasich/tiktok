import { normalizePercentTargets } from "../lib/planning-percent.ts";
import {
  getProductionOption,
  getProductionOptionLabel,
  getProductionOptionShortLabel,
  isProductionOptionCompatibleWithCamera,
  isProductionOptionId,
  migrateLegacyPublicationTypeId,
  migrateLegacyPublicationTypeTargets,
  normalizeProductionConfig,
  productionOptions,
  type ProductionOption,
  type ProductionOptionId,
} from "./production-options.ts";

type PlanningPlatform = "tiktok" | "instagram";

/** @deprecated Usar `ProductionOptionId`. Se conserva para slots/perfiles viejos. */
export type LegacyPublicationTypeId =
  | "single_image"
  | "image_carousel"
  | "short_video"
  | "story";

/**
 * En el modelo activo esto es una opción de producción.
 * Los IDs legacy (`short_video`, `story`) sólo aparecen en datos persistidos.
 */
export type PublicationTypeId = ProductionOptionId | LegacyPublicationTypeId;

export type PublicationType = ProductionOption & {
  platforms: PlanningPlatform[];
};

const ALL_PLATFORMS: PlanningPlatform[] = ["tiktok", "instagram"];

/** Source of truth: `production-options.ts`. `short_video` y `story` no se configuran. */
export const publicationTypes: PublicationType[] = productionOptions.map(
  (option) => ({
    ...option,
    platforms: ALL_PLATFORMS,
  }),
);

export const DEFAULT_PUBLICATION_TYPE_TARGETS: Partial<
  Record<ProductionOptionId, number>
> = {
  single_image: 100,
};

export function isPublicationTypeId(id: string): id is PublicationTypeId {
  return (
    isProductionOptionId(id) ||
    id === "short_video" ||
    id === "story"
  );
}

export function getPublicationType(id: string): PublicationType | undefined {
  const option = getProductionOption(migrateLegacyPublicationTypeId(id));
  if (!option) return undefined;
  return { ...option, platforms: ALL_PLATFORMS };
}

export function getPublicationTypeLabel(id: string): string {
  if (id === "short_video") return "Remotion";
  if (id === "story") return "Imagen única";
  return getProductionOptionLabel(migrateLegacyPublicationTypeId(id));
}

export function getPublicationTypeShortLabel(id: string): string {
  if (id === "short_video") return "Remotion";
  if (id === "story") return "Imagen única";
  return getProductionOptionShortLabel(migrateLegacyPublicationTypeId(id));
}

export function isPublicationTypeAllowedForProduction(
  typeId: PublicationTypeId,
  cameraMode?: string,
): boolean {
  const resolved = migrateLegacyPublicationTypeId(typeId);
  return isProductionOptionCompatibleWithCamera(resolved, cameraMode);
}

export function isPublicationTypeCompatibleWithPlatforms(
  typeId: PublicationTypeId,
  _platforms: PlanningPlatform[],
): boolean {
  void typeId;
  void _platforms;
  return true;
}

export function normalizePublicationTypeTargets(
  targets: Partial<Record<string, number>> | undefined,
  cameraMode: string = "faceless",
): Partial<Record<ProductionOptionId, number>> {
  return normalizeProductionConfig({
    cameraMode,
    publicationTypeTargets: targets,
  }).targets;
}

export function publicationTypeTargetsForPlatforms(
  targets: Partial<Record<string, number>> | undefined,
  _platforms: PlanningPlatform[],
  cameraMode: string = "faceless",
): Partial<Record<ProductionOptionId, number>> {
  void _platforms;
  const config = normalizeProductionConfig({
    cameraMode,
    publicationTypeTargets: targets,
  });
  const enabled = Object.fromEntries(
    Object.entries(config.targets).filter(
      ([id, weight]) =>
        (weight ?? 0) > 0 && config.enabledIds.includes(id as ProductionOptionId),
    ),
  ) as Partial<Record<ProductionOptionId, number>>;

  if (Object.values(enabled).some((value) => (value ?? 0) > 0)) {
    return normalizePercentTargets(enabled as Record<ProductionOptionId, number>);
  }

  return { single_image: 100 };
}

export { migrateLegacyPublicationTypeTargets };
