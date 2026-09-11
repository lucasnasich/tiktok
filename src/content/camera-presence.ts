/** Restricción de producción para toda una generación de calendario. */
export type CameraPresenceMode =
  | "off-camera"
  | "on-camera"
  | "needs-guest";

export const CAMERA_PRESENCE_OPTIONS: {
  id: CameraPresenceMode;
  label: string;
  description: string;
}[] = [
  {
    id: "off-camera",
    label: "Sin cámara",
    description:
      "Nadie sale hablando a cámara. Máximo voz en off, pantalla, texto o B-roll.",
  },
  {
    id: "on-camera",
    label: "En cámara",
    description:
      "Carla o vos pueden salir hablando frente a cámara en las piezas.",
  },
];

export const CAMERA_PRESENCE_LABELS: Record<CameraPresenceMode, string> = {
  "off-camera": "Sin cámara",
  "on-camera": "En cámara",
  "needs-guest": "Con invitado",
};

/** Formatos que asumen talking head o presencia visible frente a cámara. */
export const ON_CAMERA_FORMAT_IDS = new Set<string>(["green-screen"]);

export function filterFormatTargetsForCameraPresence(
  targets: Record<string, number>,
  mode: CameraPresenceMode,
): Record<string, number> {
  if (mode !== "off-camera") return targets;

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

  return Object.fromEntries(
    Object.entries(targets).filter(
      ([formatId]) => !ON_CAMERA_FORMAT_IDS.has(formatId),
    ),
  );
}

export function cameraPresenceConstraint(mode: CameraPresenceMode): string {
  switch (mode) {
    case "off-camera":
      return "Producción sin cámara: nadie sale hablando a cámara. Máximo voz en off, pantalla, texto, capturas o B-roll. No proponer talking head ni green screen con presentador.";
    case "on-camera":
      return "Producción en cámara: Carla o el equipo pueden salir hablando frente a cámara. El copy y la dirección visual pueden asumir presentador visible.";
    case "needs-guest":
      return "Producción con invitado: planificar piezas que requieren invitado en cámara (cliente, experto o co-host). El guion y la logística deben contemplar a esa persona.";
  }
}

export function cameraPresenceShortLabel(mode: CameraPresenceMode): string {
  return CAMERA_PRESENCE_LABELS[mode];
}
