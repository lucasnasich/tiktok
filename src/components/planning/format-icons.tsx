import type { Icon, IconProps } from "@phosphor-icons/react";
import {
  ArrowsClockwiseIcon,
  ArrowsLeftRightIcon,
  BellRingingIcon,
  ChalkboardTeacherIcon,
  ChatsCircleIcon,
  ChatTextIcon,
  CirclesThreeIcon,
  ClockIcon,
  DeviceMobileIcon,
  EnvelopeSimpleIcon,
  FirstAidIcon,
  HandPointingIcon,
  HashStraightIcon,
  LayoutIcon,
  ListNumbersIcon,
  MagnifyingGlassIcon,
  MaskHappyIcon,
  MicrophoneIcon,
  NotePencilIcon,
  PencilLineIcon,
  PillIcon,
  ProhibitIcon,
  RankingIcon,
  ScalesIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  SignpostIcon,
  SmileySadIcon,
  SparkleIcon,
  StarIcon,
  TextAaIcon,
  TextStrikethroughIcon,
  ThumbsDownIcon,
  UserCircleIcon,
  VideoCameraIcon,
  WarningIcon,
} from "@phosphor-icons/react";

import { normalizeFormatId } from "@/content/formats";

/** Un icono distinto por formato — sin repetir dentro de la taxonomía. */
const FORMAT_ICONS: Record<string, Icon> = {
  "x-razones": ListNumbersIcon,
  "historia-instagram": DeviceMobileIcon,
  "nosotros-vs-ellos": ArrowsLeftRightIcon,
  "diagrama-venn": CirclesThreeIcon,
  "no-compres-esto": ProhibitIcon,
  "nota-iphone": NotePencilIcon,
  "captura-chat": ChatsCircleIcon,
  pizarra: ChalkboardTeacherIcon,
  "alerta-poco-stock": BellRingingIcon,
  "pedimos-disculpas": SmileySadIcon,
  "testimonio-cliente": UserCircleIcon,
  "lo-nuevo-vs-lo-viejo": ArrowsClockwiseIcon,
  "ultima-hora": ClockIcon,
  transformacion: SparkleIcon,
  "estilo-reddit": ChatTextIcon,
  "en-caso-de-emergencia": FirstAidIcon,
  "busqueda-google": MagnifyingGlassIcon,
  "problema-vs-solucion": ScalesIcon,
  "efecto-secundario": PillIcon,
  "oferta-combo": ShoppingBagIcon,
  "titular-con-dato": HashStraightIcon,
  garabato: PencilLineIcon,
  "captura-email": EnvelopeSimpleIcon,
  "no-seas-ese-que": HandPointingIcon,
  resenas: StarIcon,
  "texto-sobre-la-piel": TextAaIcon,
  "podcast-ia": MicrophoneIcon,
  "tier-list": RankingIcon,
  "cero-estrellas": ThumbsDownIcon,
  "green-screen": VideoCameraIcon,
  "x-senales": SignpostIcon,
  "mito-vs-realidad": MaskHappyIcon,
  "problemas-tachados": TextStrikethroughIcon,
  "lo-que-podes-evitar": ShieldCheckIcon,
  advertencia: WarningIcon,
};

export function getFormatIcon(formatId: string): Icon {
  return FORMAT_ICONS[normalizeFormatId(formatId)] ?? LayoutIcon;
}

export function FormatIcon({
  formatId,
  className,
  ...props
}: { formatId: string } & IconProps) {
  const IconComponent = getFormatIcon(formatId);
  return <IconComponent className={className} {...props} />;
}
