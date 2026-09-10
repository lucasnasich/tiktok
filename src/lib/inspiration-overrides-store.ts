import type { ContentRoleId } from "@/content/content-roles";
import type {
  InspirationMaterialType,
  InspirationOrigin,
} from "@/content/inspiration-taxonomy";

export type InspirationMetaOverride = {
  origin?: InspirationOrigin;
  materialType?: InspirationMaterialType;
  signal?: string;
  pillarAffinities?: string[];
  roleAffinities?: ContentRoleId[];
  formatAffinities?: string[];
  angleAffinities?: string[];
  creativeMechanism?: string;
  sourceAccount?: string;
  notes?: string[];
};

const ORIGINS: InspirationOrigin[] = [
  "competitor",
  "creator",
  "brand",
  "client",
  "organic",
  "ad",
  "trend",
  "visual-reference",
  "other",
  "unknown",
];

const TYPES: InspirationMaterialType[] = ["suggestion", "example"];

function stringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter((item): item is string => typeof item === "string");
  return items.length > 0 ? items : undefined;
}

export function parseInspirationOverride(
  raw: unknown,
): InspirationMetaOverride | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const value = raw as Record<string, unknown>;
  const origin =
    typeof value.origin === "string" &&
    ORIGINS.includes(value.origin as InspirationOrigin)
      ? (value.origin as InspirationOrigin)
      : undefined;
  const materialType =
    typeof value.materialType === "string" &&
    TYPES.includes(value.materialType as InspirationMaterialType)
      ? (value.materialType as InspirationMaterialType)
      : typeof value.inspirationType === "string" &&
          TYPES.includes(value.inspirationType as InspirationMaterialType)
        ? (value.inspirationType as InspirationMaterialType)
        : undefined;

  const override: InspirationMetaOverride = {
    origin,
    materialType,
    signal: typeof value.signal === "string" ? value.signal : undefined,
    pillarAffinities: stringArray(value.pillarAffinities),
    roleAffinities: stringArray(value.roleAffinities) as
      | ContentRoleId[]
      | undefined,
    formatAffinities: stringArray(value.formatAffinities),
    angleAffinities: stringArray(value.angleAffinities),
    creativeMechanism:
      typeof value.creativeMechanism === "string"
        ? value.creativeMechanism
        : undefined,
    sourceAccount:
      typeof value.sourceAccount === "string" ? value.sourceAccount : undefined,
    notes: stringArray(value.notes),
  };

  return Object.values(override).some((item) => item !== undefined)
    ? override
    : undefined;
}

export function parseInspirationOverrides(
  raw: unknown,
): Record<string, InspirationMetaOverride> | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const result: Record<string, InspirationMetaOverride> = {};
  for (const [key, value] of Object.entries(raw)) {
    const parsed = parseInspirationOverride(value);
    if (parsed) result[key] = parsed;
  }
  return result;
}
