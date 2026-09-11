import type { CameraPresenceMode } from "@/content/camera-presence";
import type { PlanningPlatform } from "@/content/planning-accounts";
import type { ContentRoleId } from "@/content/content-roles";
import type { InspirationMaterialType } from "@/content/inspiration-taxonomy";

export type SlotSpecStatus = "draft" | "ready-for-cursor";
export type SlotDirectionKind = "inspiration" | "manual";

export const SLOT_SPEC_STATUS_LABELS: Record<SlotSpecStatus, string> = {
  draft: "Borrador",
  "ready-for-cursor": "Listo para Cursor",
};

export const SLOT_DIRECTION_KIND_LABELS: Record<SlotDirectionKind, string> = {
  inspiration: "Inspiración",
  manual: "Dirección personalizada",
};

/**
 * Decisiones persistidas del usuario sobre un slot.
 * El spec ensamblado para Cursor se deriva de esto + PlanningSlot + Brain + uso.
 */
export type SlotSpecRecord = {
  slotId: string;
  directionKind: SlotDirectionKind;
  inspirationRef?: string;
  signal?: string;
  creativeMechanism?: string;
  notes?: string[];
  /** Prosa amigable de qué busca la pieza — la redacta Cursor. */
  editorialDescription?: string;
  status: SlotSpecStatus;
  preparedAt?: string;
};

export type SlotSpecUsageContext = {
  previousUses: number;
  lastUsedAt?: string;
  usedAngles?: string[];
  relatedSlotIds?: string[];
  relatedProposalIds?: string[];
  accountIds?: string[];
};

/** Misión autocontenida que Cursor consume. El Studio la arma; no genera copy. */
export type SlotSpec = {
  slotId: string;
  accountId: string;
  platforms: PlanningPlatform[];
  date: string;
  time: string;
  roleId: ContentRoleId;
  pillarId: string;
  formatId: string;
  inspirationRef?: string;
  inspirationType?: InspirationMaterialType;
  origin?: string;
  signal?: string;
  creativeMechanism?: string;
  usageContext?: SlotSpecUsageContext;
  brainRefs: string[];
  editorialConstraints: string[];
  cameraPresence?: CameraPresenceMode;
  notes?: string[];
  status: SlotSpecStatus;
};
