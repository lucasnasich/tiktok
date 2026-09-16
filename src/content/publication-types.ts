import { normalizePercentTargets } from "../lib/planning-percent.ts";

type PlanningPlatform = "tiktok" | "instagram";

/**
 * Tipo de publicación = la pieza nativa que vamos a producir.
 * Distinto del formato creativo (cómo se ejecuta visualmente).
 */
export type PublicationTypeId =
  | "single_image"
  | "image_carousel"
  | "short_video"
  | "story";

export type PublicationType = {
  id: PublicationTypeId;
  label: string;
  shortLabel: string;
  summary: string;
  platforms: PlanningPlatform[];
  example: string;
};

const PUBLICATION_TYPE_IDS = new Set<PublicationTypeId>([
  "single_image",
  "image_carousel",
  "short_video",
  "story",
]);

export const publicationTypes: PublicationType[] = [
  {
    id: "single_image",
    label: "Imagen única",
    shortLabel: "Imagen",
    summary:
      "Una sola imagen estática: placa, gráfico, captura o composición editorial.",
    platforms: ["instagram", "tiktok"],
    example: "Una placa con un dato o una captura de producto.",
  },
  {
    id: "image_carousel",
    label: "Carrusel de imágenes",
    shortLabel: "Carrusel",
    summary:
      "Varias imágenes en secuencia. Sirve para listas, pasos, comparaciones y storytelling.",
    platforms: ["instagram", "tiktok"],
    example: "Un carrusel de 6 slides explicando un proceso.",
  },
  {
    id: "short_video",
    label: "Video corto / Reel",
    shortLabel: "Reel",
    summary:
      "Video nativo de feed (Reel / TikTok). Puede ser faceless: motion, screen recording o IA.",
    platforms: ["instagram", "tiktok"],
    example: "Un reel de 20s con screen recording o motion graphics.",
  },
  {
    id: "story",
    label: "Historia",
    shortLabel: "Story",
    summary:
      "Pieza efímera de Stories. Texto corto, sticker, captura o clip breve.",
    platforms: ["instagram", "tiktok"],
    example: "Una story con una pregunta o un avance de producto.",
  },
];

const typeById = new Map(publicationTypes.map((item) => [item.id, item]));

export const DEFAULT_PUBLICATION_TYPE_TARGETS: Record<PublicationTypeId, number> =
  {
    short_video: 45,
    image_carousel: 30,
    story: 15,
    single_image: 10,
  };

/** Afinidades suaves rol → tipo. Señales, no restricciones. */
export const ROLE_PUBLICATION_TYPE_AFFINITY: Record<
  string,
  Partial<Record<PublicationTypeId, number>>
> = {
  build_in_public: {
    short_video: 3,
    story: 2,
    image_carousel: 2,
    single_image: 1,
  },
  educacion: {
    image_carousel: 3,
    short_video: 3,
    single_image: 2,
    story: 1,
  },
  producto: {
    short_video: 3,
    image_carousel: 3,
    story: 1,
    single_image: 1,
  },
  marca: {
    single_image: 2,
    short_video: 2,
    image_carousel: 2,
    story: 1,
  },
  evidencia: {
    short_video: 3,
    image_carousel: 2,
    single_image: 2,
    story: 1,
  },
  comunidad: {
    story: 3,
    short_video: 2,
    image_carousel: 2,
    single_image: 1,
  },
};

export function isPublicationTypeId(id: string): id is PublicationTypeId {
  return PUBLICATION_TYPE_IDS.has(id as PublicationTypeId);
}

export function getPublicationType(id: string): PublicationType | undefined {
  return typeById.get(id as PublicationTypeId);
}

export function getPublicationTypeLabel(id: string): string {
  return typeById.get(id as PublicationTypeId)?.label ?? id;
}

export function getPublicationTypeShortLabel(id: string): string {
  return typeById.get(id as PublicationTypeId)?.shortLabel ?? id;
}

export function isPublicationTypeAllowedForProduction(
  typeId: PublicationTypeId,
  _cameraMode?: string,
): boolean {
  void typeId;
  // Ningún tipo nativo exige grabar a una persona. short_video sigue permitido en faceless.
  return true;
}

export function isPublicationTypeCompatibleWithPlatforms(
  typeId: PublicationTypeId,
  platforms: PlanningPlatform[],
): boolean {
  const type = typeById.get(typeId);
  if (!type) return false;
  if (platforms.length === 0) return true;
  return platforms.every((platform) => type.platforms.includes(platform));
}

export function normalizePublicationTypeTargets(
  targets: Partial<Record<string, number>> | undefined,
): Record<PublicationTypeId, number> {
  const mapped: Partial<Record<PublicationTypeId, number>> = {};
  for (const [key, value] of Object.entries(targets ?? {})) {
    if (!isPublicationTypeId(key)) continue;
    if (typeof value !== "number" || Number.isNaN(value) || value <= 0) continue;
    mapped[key] = (mapped[key] ?? 0) + value;
  }

  if (!Object.values(mapped).some((value) => (value ?? 0) > 0)) {
    return { ...DEFAULT_PUBLICATION_TYPE_TARGETS };
  }

  return normalizePercentTargets(mapped as Record<PublicationTypeId, number>);
}

export function publicationTypeTargetsForPlatforms(
  targets: Partial<Record<string, number>> | undefined,
  platforms: PlanningPlatform[],
): Record<PublicationTypeId, number> {
  const normalized = normalizePublicationTypeTargets(targets);
  const filtered = Object.fromEntries(
    Object.entries(normalized).filter(([id]) =>
      isPublicationTypeCompatibleWithPlatforms(
        id as PublicationTypeId,
        platforms,
      ),
    ),
  ) as Record<PublicationTypeId, number>;

  if (Object.values(filtered).some((value) => (value ?? 0) > 0)) {
    return normalizePercentTargets(filtered);
  }

  return normalizePublicationTypeTargets(
    Object.fromEntries(
      publicationTypes
        .filter((type) =>
          isPublicationTypeCompatibleWithPlatforms(type.id, platforms),
        )
        .map((type) => [type.id, DEFAULT_PUBLICATION_TYPE_TARGETS[type.id]]),
    ),
  );
}
