/**
 * Restricción productiva de cámara.
 *
 * `CameraMode` es la source of truth del perfil editorial.
 * `CameraPresenceMode` se conserva en slots/generaciones ya persistidos.
 *
 * faceless ≠ sin video. Significa: no grabar físicamente a una persona.
 */

export type CameraMode = "faceless" | "camera_allowed";

/** Legacy en slots y lotes de calendario. */
export type CameraPresenceMode = "off-camera" | "on-camera" | "needs-guest";

export const CAMERA_MODE_OPTIONS: {
  id: CameraMode;
  label: string;
  description: string;
}[] = [
  {
    id: "faceless",
    label: "Sin cámara",
    description:
      "Nadie se graba. El video sigue permitido: motion, screen recording, IA, texto o capturas.",
  },
  {
    id: "camera_allowed",
    label: "Cámara permitida",
    description:
      "Se puede grabar a una persona si el formato creativo lo pide. No obliga talking head.",
  },
];

/** Compat: la UI de generación todavía puede leer estas opciones. */
export const CAMERA_PRESENCE_OPTIONS: {
  id: CameraPresenceMode;
  label: string;
  description: string;
}[] = [
  {
    id: "off-camera",
    label: CAMERA_MODE_OPTIONS[0].label,
    description: CAMERA_MODE_OPTIONS[0].description,
  },
  {
    id: "on-camera",
    label: CAMERA_MODE_OPTIONS[1].label,
    description: CAMERA_MODE_OPTIONS[1].description,
  },
];

export const CAMERA_MODE_LABELS: Record<CameraMode, string> = {
  faceless: "Sin cámara",
  camera_allowed: "Cámara permitida",
};

export const CAMERA_PRESENCE_LABELS: Record<CameraPresenceMode, string> = {
  "off-camera": "Sin cámara",
  "on-camera": "Cámara permitida",
  "needs-guest": "Con invitado",
};

export const DEFAULT_CAMERA_MODE: CameraMode = "faceless";

export function isCameraMode(value: string | undefined): value is CameraMode {
  return value === "faceless" || value === "camera_allowed";
}

export function cameraModeFromPresence(
  mode?: CameraPresenceMode | CameraMode | string,
): CameraMode {
  if (mode === "faceless" || mode === "off-camera") return "faceless";
  if (
    mode === "camera_allowed" ||
    mode === "on-camera" ||
    mode === "needs-guest"
  ) {
    return "camera_allowed";
  }
  return DEFAULT_CAMERA_MODE;
}

export function presenceFromCameraMode(mode: CameraMode): CameraPresenceMode {
  return mode === "faceless" ? "off-camera" : "on-camera";
}

export function isFacelessProduction(
  mode?: CameraPresenceMode | CameraMode | string,
): boolean {
  return cameraModeFromPresence(mode) === "faceless";
}

/**
 * Formatos cuyo mecanismo nativo exige grabar a una persona.
 * Completado por `format-capabilities.ts`; este set se mantiene para legacy.
 */
export const ON_CAMERA_FORMAT_IDS = new Set<string>([
  "green-screen",
  "texto-sobre-la-piel",
  "talking-head",
  "entrevista",
  "vlog",
]);

export function filterFormatTargetsForCameraPresence(
  targets: Record<string, number>,
  mode: CameraPresenceMode | CameraMode,
): Record<string, number> {
  if (!isFacelessProduction(mode)) return targets;

  const filtered = Object.fromEntries(
    Object.entries(targets).filter(
      ([formatId]) => !ON_CAMERA_FORMAT_IDS.has(formatId),
    ),
  );

  const weight = Object.values(filtered).reduce(
    (total, value) => total + value,
    0,
  );
  if (weight > 0) return filtered;
  return filtered;
}

export function cameraModeConstraint(mode: CameraMode): string {
  switch (mode) {
    case "faceless":
      return "Producción sin cámara: no grabar físicamente a una persona, espacio, entrevista o escena real. El video está permitido si se arma con screen recording, motion graphics, animación, IA, texto, capturas o voice-over. Prohibido talking head, vlog, selfie, entrevista filmada, POV que requiera filmación física o al equipo trabajando.";
    case "camera_allowed":
      return "Producción con cámara permitida: se puede grabar a una persona si el formato creativo lo pide. No obliga talking head; las ejecuciones faceless siguen siendo válidas.";
  }
}

export function cameraPresenceConstraint(
  mode: CameraPresenceMode | CameraMode,
): string {
  return cameraModeConstraint(cameraModeFromPresence(mode));
}

export function cameraPresenceShortLabel(
  mode: CameraPresenceMode | CameraMode,
): string {
  if (isCameraMode(mode)) return CAMERA_MODE_LABELS[mode];
  return CAMERA_PRESENCE_LABELS[mode];
}

export function cameraModeShortLabel(mode: CameraMode): string {
  return CAMERA_MODE_LABELS[mode];
}
