import {
  cameraModeFromPresence,
  type CameraMode,
} from "./camera-presence.ts";
import { normalizePercentTargets } from "../lib/planning-percent.ts";

/**
 * Opción de producción = la pieza concreta que el equipo sabe y quiere fabricar.
 * No es un tipo nativo abstracto (reel/story) ni un formato creativo.
 */
export type ProductionOptionId =
  | "single_image"
  | "image_carousel"
  | "animated_carousel"
  | "remotion_video"
  | "screen_demo"
  | "ai_generated_video"
  | "talking_camera"
  | "talking_camera_remotion";

export type ProductionOption = {
  id: ProductionOptionId;
  label: string;
  shortLabel: string;
  summary: string;
  example: string;
  requiresCamera: boolean;
};

export type ProductionConfig = {
  cameraMode: CameraMode;
  enabledIds: ProductionOptionId[];
  targets: Partial<Record<ProductionOptionId, number>>;
};

export const PRODUCTION_OPTION_IDS: ProductionOptionId[] = [
  "single_image",
  "image_carousel",
  "animated_carousel",
  "remotion_video",
  "screen_demo",
  "ai_generated_video",
  "talking_camera",
  "talking_camera_remotion",
];

const PRODUCTION_OPTION_ID_SET = new Set<string>(PRODUCTION_OPTION_IDS);

export const productionOptions: ProductionOption[] = [
  {
    id: "single_image",
    label: "Imagen única",
    shortLabel: "Imagen única",
    summary:
      "Una pieza estática: placa, foto, composición editorial, screenshot diseñado o imagen generada.",
    example: "Una placa con un dato o una captura de producto.",
    requiresCamera: false,
  },
  {
    id: "image_carousel",
    label: "Carrusel de imágenes",
    shortLabel: "Carrusel",
    summary: "Carrusel compuesto principalmente por imágenes o placas estáticas.",
    example: "Un carrusel de 6 slides explicando un proceso.",
    requiresCamera: false,
  },
  {
    id: "animated_carousel",
    label: "Carrusel animado",
    shortLabel: "Carrusel animado",
    summary:
      "Carrusel donde los elementos pueden ser clips, animaciones o pequeñas piezas de video. Puede producirse generando cada pieza con Remotion.",
    example: "Un carrusel de clips animados, uno por idea.",
    requiresCamera: false,
  },
  {
    id: "remotion_video",
    label: "Remotion",
    shortLabel: "Remotion",
    summary:
      "Video producido con motion graphics, animaciones, UI, texto, screenshots, gráficos, imágenes u otros assets. No requiere grabar personas.",
    example: "Un video de 20s con tipografía, UI y gráficos.",
    requiresCamera: false,
  },
  {
    id: "screen_demo",
    label: "Demo",
    shortLabel: "Demo",
    summary:
      "Video basado en grabación de pantalla: Mercantis, una funcionalidad, workflow, navegación o before/after digital. Puede incluir edición, zoom, texto, voice-over u overlays. No requiere cámara física.",
    example: "Mostrar cómo entra un pedido y se actualiza el stock.",
    requiresCamera: false,
  },
  {
    id: "ai_generated_video",
    label: "Video generado con IA",
    shortLabel: "Video IA",
    summary:
      "Video generado 100% con herramientas de IA. No es un video convencional que sólo usó IA en la edición.",
    example: "Una pieza hecha enteramente con un generador de video.",
    requiresCamera: false,
  },
  {
    id: "talking_camera",
    label: "Hablando a cámara",
    shortLabel: "A cámara",
    summary:
      "Una persona aparece físicamente en cámara hablando. Si hay dos personas pero el mecanismo sigue siendo hablar frente a cámara, sigue siendo esta categoría.",
    example: "Lucas o Carla contando una decisión de producto.",
    requiresCamera: true,
  },
  {
    id: "talking_camera_remotion",
    label: "Hablando a cámara + Remotion",
    shortLabel: "Cámara + Remotion",
    summary:
      "Persona físicamente en cámara combinada con animaciones, motion graphics, UI, overlays, producto o composiciones generadas con Remotion.",
    example: "Hablar a cámara y cortar a una animación de la interfaz.",
    requiresCamera: true,
  },
];

const optionById = new Map(productionOptions.map((item) => [item.id, item]));

/** Default conservador: sólo imagen única. No habilitar video ni cámara. */
export const DEFAULT_PRODUCTION_ENABLED_IDS: ProductionOptionId[] = [
  "single_image",
];

export const DEFAULT_PRODUCTION_TARGETS: Partial<
  Record<ProductionOptionId, number>
> = {
  single_image: 100,
};

export const DEFAULT_CAMERA_MODE_FOR_PRODUCTION: CameraMode = "faceless";

/** Afinidades suaves rol → opción. Nunca habilitan opciones apagadas. */
export const ROLE_PRODUCTION_OPTION_AFFINITY: Record<
  string,
  Partial<Record<ProductionOptionId, number>>
> = {
  build_in_public: {
    talking_camera: 3,
    talking_camera_remotion: 3,
    single_image: 2,
    remotion_video: 2,
    screen_demo: 2,
  },
  educacion: {
    image_carousel: 3,
    single_image: 3,
    remotion_video: 2,
    talking_camera: 2,
  },
  producto: {
    screen_demo: 3,
    remotion_video: 3,
    image_carousel: 2,
    animated_carousel: 2,
    talking_camera_remotion: 2,
  },
  marca: {
    single_image: 3,
    remotion_video: 2,
    talking_camera: 2,
  },
  evidencia: {
    single_image: 3,
    image_carousel: 2,
    talking_camera: 2,
    talking_camera_remotion: 2,
  },
  comunidad: {
    single_image: 3,
    talking_camera: 3,
    image_carousel: 2,
  },
};

export function isProductionOptionId(id: string): id is ProductionOptionId {
  return PRODUCTION_OPTION_ID_SET.has(id);
}

export function getProductionOption(
  id: string | undefined,
): ProductionOption | undefined {
  if (!id) return undefined;
  return optionById.get(id as ProductionOptionId);
}

export function getProductionOptionLabel(id: string | undefined): string {
  return getProductionOption(id)?.label ?? id ?? "Producción";
}

export function getProductionOptionShortLabel(id: string | undefined): string {
  return getProductionOption(id)?.shortLabel ?? id ?? "Producción";
}

export function productionOptionRequiresCamera(
  id: string | undefined,
): boolean {
  return Boolean(getProductionOption(id)?.requiresCamera);
}

export function isProductionOptionCompatibleWithCamera(
  id: ProductionOptionId,
  cameraMode?: CameraMode | string,
): boolean {
  const option = getProductionOption(id);
  if (!option) return false;
  if (!option.requiresCamera) return true;
  return cameraModeFromPresence(cameraMode) === "camera_allowed";
}

export function getProductionOptionsForCamera(
  cameraMode?: CameraMode | string,
): ProductionOption[] {
  return productionOptions.filter((option) =>
    isProductionOptionCompatibleWithCamera(option.id, cameraMode),
  );
}

export function cloneDefaultProductionConfig(): ProductionConfig {
  return {
    cameraMode: DEFAULT_CAMERA_MODE_FOR_PRODUCTION,
    enabledIds: [...DEFAULT_PRODUCTION_ENABLED_IDS],
    targets: { ...DEFAULT_PRODUCTION_TARGETS },
  };
}

function uniqueEnabledIds(
  ids: Iterable<string>,
  cameraMode: CameraMode,
): ProductionOptionId[] {
  const seen = new Set<ProductionOptionId>();
  const result: ProductionOptionId[] = [];
  for (const id of ids) {
    if (!isProductionOptionId(id)) continue;
    if (!isProductionOptionCompatibleWithCamera(id, cameraMode)) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    result.push(id);
  }
  return result;
}

function redistributeTargets(
  enabledIds: ProductionOptionId[],
  previous: Partial<Record<ProductionOptionId, number>> | undefined,
): Partial<Record<ProductionOptionId, number>> {
  if (enabledIds.length === 0) return { ...DEFAULT_PRODUCTION_TARGETS };
  if (enabledIds.length === 1) return { [enabledIds[0]]: 100 };

  const kept: Partial<Record<ProductionOptionId, number>> = {};
  const missing: ProductionOptionId[] = [];
  for (const id of enabledIds) {
    const weight = previous?.[id] ?? 0;
    if (weight > 0) kept[id] = weight;
    else missing.push(id);
  }

  if (Object.keys(kept).length === 0) {
    const even = 100 / enabledIds.length;
    return normalizePercentTargets(
      Object.fromEntries(enabledIds.map((id) => [id, even])) as Record<
        ProductionOptionId,
        number
      >,
    );
  }

  const values = Object.values(kept) as number[];
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  for (const id of missing) kept[id] = average;
  return normalizePercentTargets(kept as Record<ProductionOptionId, number>);
}

export function enabledProductionTargets(
  config: Pick<ProductionConfig, "enabledIds" | "targets" | "cameraMode">,
): Record<ProductionOptionId, number> {
  const enabledIds = uniqueEnabledIds(config.enabledIds, config.cameraMode);
  const resolved =
    enabledIds.length > 0
      ? enabledIds
      : uniqueEnabledIds(DEFAULT_PRODUCTION_ENABLED_IDS, config.cameraMode);
  const fallback =
    resolved.length > 0 ? resolved : (["single_image"] as ProductionOptionId[]);
  return redistributeTargets(fallback, config.targets) as Record<
    ProductionOptionId,
    number
  >;
}

export function hasEnabledProductionOptions(
  config: Pick<ProductionConfig, "enabledIds" | "cameraMode">,
): boolean {
  return uniqueEnabledIds(config.enabledIds, config.cameraMode).length > 0;
}

export function applyCameraModeToProduction(
  config: ProductionConfig,
  cameraMode: CameraMode,
): { config: ProductionConfig; strippedIds: ProductionOptionId[] } {
  const strippedIds = config.enabledIds.filter(
    (id) =>
      isProductionOptionId(id) &&
      !isProductionOptionCompatibleWithCamera(id, cameraMode),
  );
  const enabledIds = uniqueEnabledIds(config.enabledIds, cameraMode);
  const resolved =
    enabledIds.length > 0 ? enabledIds : [...DEFAULT_PRODUCTION_ENABLED_IDS];
  return {
    config: {
      cameraMode,
      enabledIds: resolved,
      targets: redistributeTargets(resolved, config.targets),
    },
    strippedIds,
  };
}

export function toggleProductionOption(
  config: ProductionConfig,
  optionId: ProductionOptionId,
  enabled: boolean,
): ProductionConfig {
  if (
    enabled &&
    !isProductionOptionCompatibleWithCamera(optionId, config.cameraMode)
  ) {
    return config;
  }

  const nextEnabled = enabled
    ? uniqueEnabledIds([...config.enabledIds, optionId], config.cameraMode)
    : uniqueEnabledIds(
        config.enabledIds.filter((id) => id !== optionId),
        config.cameraMode,
      );

  if (nextEnabled.length === 0) {
    return {
      ...config,
      enabledIds: [...DEFAULT_PRODUCTION_ENABLED_IDS],
      targets: { ...DEFAULT_PRODUCTION_TARGETS },
    };
  }

  return {
    ...config,
    enabledIds: nextEnabled,
    targets: redistributeTargets(nextEnabled, config.targets),
  };
}

export function updateProductionTarget(
  config: ProductionConfig,
  optionId: ProductionOptionId,
  value: number,
): ProductionConfig {
  if (!config.enabledIds.includes(optionId)) return config;
  const safe = Number.isFinite(value) ? Math.max(0, value) : 0;
  return {
    ...config,
    targets: {
      ...config.targets,
      [optionId]: safe,
    },
  };
}

type LegacyPublicationId =
  | "single_image"
  | "image_carousel"
  | "short_video"
  | "story";

function isLegacyPublicationId(id: string): id is LegacyPublicationId {
  return (
    id === "single_image" ||
    id === "image_carousel" ||
    id === "short_video" ||
    id === "story"
  );
}

/**
 * Migración conservadora del modelo viejo (imagen / carrusel / reel / story).
 * `short_video` → Remotion. `story` se descarta y su peso se redistribuye.
 */
export function migrateLegacyPublicationTypeTargets(
  targets: Partial<Record<string, number>> | undefined,
  cameraMode: CameraMode = DEFAULT_CAMERA_MODE_FOR_PRODUCTION,
): Partial<Record<ProductionOptionId, number>> {
  const mapped: Partial<Record<ProductionOptionId, number>> = {};

  for (const [rawId, rawWeight] of Object.entries(targets ?? {})) {
    const weight = rawWeight ?? 0;
    if (weight <= 0) continue;

    if (isProductionOptionId(rawId) && rawId !== "single_image" && rawId !== "image_carousel") {
      if (isProductionOptionCompatibleWithCamera(rawId, cameraMode)) {
        mapped[rawId] = (mapped[rawId] ?? 0) + weight;
      }
      continue;
    }

    if (!isLegacyPublicationId(rawId) && !isProductionOptionId(rawId)) continue;

    if (rawId === "single_image") {
      mapped.single_image = (mapped.single_image ?? 0) + weight;
      continue;
    }
    if (rawId === "image_carousel") {
      mapped.image_carousel = (mapped.image_carousel ?? 0) + weight;
      continue;
    }
    if (rawId === "short_video") {
      mapped.remotion_video = (mapped.remotion_video ?? 0) + weight;
      continue;
    }
    // story: no es opción productiva activa
  }

  return mapped;
}

export function migrateLegacyPublicationTypeId(
  id: string | undefined,
): ProductionOptionId {
  if (id && isProductionOptionId(id)) return id;
  if (id === "short_video") return "remotion_video";
  if (id === "image_carousel") return "image_carousel";
  if (id === "single_image") return "single_image";
  return "single_image";
}

export function normalizeProductionConfig(input?: {
  cameraMode?: CameraMode | string;
  enabledIds?: Iterable<string>;
  targets?: Partial<Record<string, number>>;
  publicationTypeTargets?: Partial<Record<string, number>>;
}): ProductionConfig {
  const cameraMode = cameraModeFromPresence(
    input?.cameraMode ?? DEFAULT_CAMERA_MODE_FOR_PRODUCTION,
  );

  const incomingEnabled = [...(input?.enabledIds ?? [])].filter(
    isProductionOptionId,
  );
  const hasExplicitSelection = incomingEnabled.length > 0;
  const migratedLegacy = migrateLegacyPublicationTypeTargets(
    input?.publicationTypeTargets ?? input?.targets,
    cameraMode,
  );
  const incomingTargets = {
    ...migratedLegacy,
    ...(input?.targets ?? {}),
  };

  let enabledIds = hasExplicitSelection
    ? uniqueEnabledIds(incomingEnabled, cameraMode)
    : uniqueEnabledIds(
        Object.entries(incomingTargets)
          .filter(([, weight]) => (weight ?? 0) > 0)
          .map(([id]) => id),
        cameraMode,
      );

  if (enabledIds.length === 0) {
    enabledIds = [...DEFAULT_PRODUCTION_ENABLED_IDS];
  }

  return {
    cameraMode,
    enabledIds,
    targets: redistributeTargets(enabledIds, incomingTargets),
  };
}

export function productionTargetsForRole(
  config: ProductionConfig,
  roleId: string,
): Record<ProductionOptionId, number> {
  const base = enabledProductionTargets(config);
  const affinity = ROLE_PRODUCTION_OPTION_AFFINITY[roleId] ?? {};
  const weighted = {} as Record<ProductionOptionId, number>;
  for (const [id, weight] of Object.entries(base) as Array<
    [ProductionOptionId, number]
  >) {
    if ((weight ?? 0) <= 0) continue;
    const bonus = affinity[id] ?? 0;
    weighted[id] = weight * (1 + bonus * 0.08);
  }
  if (!Object.values(weighted).some((value) => value > 0)) return base;
  return normalizePercentTargets(weighted);
}
