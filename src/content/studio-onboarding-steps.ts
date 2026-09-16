export type StudioOnboardingStepId =
  | "perfil"
  | "calendario"
  | "slot-spec"
  | "propuestas"
  | "elegir"
  | "produccion"
  | "publicacion";

export type StudioOnboardingStep = {
  id: StudioOnboardingStepId;
  title: string;
  summary: string;
  detail: string;
  href: string;
  hrefLabel: string;
  /** Pasos fuera del Studio (Figma, Buffer) — el usuario los marca manualmente. */
  manual?: boolean;
};

export const PILOT_ACCOUNT_ID = "mercantis-oficial";

export const STUDIO_ONBOARDING_STEPS: StudioOnboardingStep[] = [
  {
    id: "perfil",
    title: "Configurar perfil editorial",
    summary: "Definí mix de roles y temas por rol.",
    detail:
      "Sin perfil activo el calendario queda vacío. Completá el asistente en Configuración y guardá el perfil.",
    href: "/planificacion/configuracion",
    hrefLabel: "Ir a configuración",
  },
  {
    id: "calendario",
    title: "Revisar el calendario",
    summary: "Confirmá que aparecen slots con cuenta, hora, rol, tema y pieza de producción.",
    detail:
      "El motor completa huecos según tu perfil. Todavía no hay copy ni ideas — solo el marco editorial.",
    href: "/planificacion",
    hrefLabel: "Abrir calendario",
  },
  {
    id: "slot-spec",
    title: "Preparar un slot para Cursor",
    summary: "Elegí inspiración y dejá el SlotSpec listo con Preparar para Cursor.",
    detail:
      "Abrí un slot, elegí una referencia compatible o una dirección personalizada, y marcá el spec como listo.",
    href: "/planificacion",
    hrefLabel: "Abrir un slot",
  },
  {
    id: "propuestas",
    title: "Desarrollar propuestas con Cursor",
    summary: "Pedile a Cursor que escriba propuestas completas para ese slot.",
    detail:
      "El Studio no genera copy. Copiá el spec preparado y pedí propuestas en Cursor; después aparecen en Propuestas.",
    href: "/propuestas",
    hrefLabel: "Ver propuestas",
  },
  {
    id: "elegir",
    title: "Elegir una propuesta",
    summary: "Seleccioná la dirección creativa que vas a producir.",
    detail:
      "Compará candidatas y dejá una como seleccionada. Esa pieza queda lista para ensamblar.",
    href: "/propuestas",
    hrefLabel: "Elegir propuesta",
  },
  {
    id: "produccion",
    title: "Ensamblar el creativo en Figma",
    summary: "Copy de Cursor + visuales + sistema Mercantis.",
    detail:
      "Usá la propuesta seleccionada como guía. Imágenes del Studio van sin texto quemado, listas para Figma.",
    href: "/produccion/imagenes",
    hrefLabel: "Abrir imágenes",
    manual: true,
  },
  {
    id: "publicacion",
    title: "Programar en Buffer",
    summary: "Agendá la pieza con la fecha y hora del slot.",
    detail:
      "No publiques al instante salvo que lo pidas con claridad. Default: draft o scheduled con fecha futura.",
    href: "/documentacion",
    hrefLabel: "Ver guía",
    manual: true,
  },
];
