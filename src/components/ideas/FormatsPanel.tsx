import type { Icon } from "@phosphor-icons/react";
import {
  ArrowsClockwiseIcon,
  ArrowsLeftRightIcon,
  ChatsCircleIcon,
  CirclesThreeIcon,
  ClockIcon,
  DeviceMobileIcon,
  EnvelopeSimpleIcon,
  FirstAidIcon,
  HandPointingIcon,
  LayoutIcon,
  ListNumbersIcon,
  MagnifyingGlassIcon,
  MaskHappyIcon,
  MicrophoneIcon,
  NotePencilIcon,
  PackageIcon,
  PencilLineIcon,
  PillIcon,
  PresentationIcon,
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
  UserCircleIcon,
  VideoCameraIcon,
  WarningIcon,
} from "@phosphor-icons/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formats } from "@/content/formats";

const FORMAT_ICONS: Record<string, Icon> = {
  "x-razones": ListNumbersIcon,
  "historia-instagram": DeviceMobileIcon,
  "nosotros-vs-ellos": ArrowsLeftRightIcon,
  "diagrama-venn": CirclesThreeIcon,
  "no-compres-esto": ProhibitIcon,
  "nota-iphone": NotePencilIcon,
  "captura-chat": ChatsCircleIcon,
  pizarra: PresentationIcon,
  "alerta-poco-stock": PackageIcon,
  "pedimos-disculpas": SmileySadIcon,
  "testimonio-cliente": UserCircleIcon,
  "lo-nuevo-vs-lo-viejo": ArrowsClockwiseIcon,
  "ultima-hora": ClockIcon,
  transformacion: SparkleIcon,
  "estilo-reddit": ChatsCircleIcon,
  "en-caso-de-emergencia": FirstAidIcon,
  "busqueda-google": MagnifyingGlassIcon,
  "problema-vs-solucion": ScalesIcon,
  "efecto-secundario": PillIcon,
  "oferta-combo": ShoppingBagIcon,
  "titular-con-dato": ListNumbersIcon,
  garabato: PencilLineIcon,
  "captura-email": EnvelopeSimpleIcon,
  "no-seas-ese-que": HandPointingIcon,
  resenas: StarIcon,
  "texto-sobre-la-piel": TextAaIcon,
  "podcast-ia": MicrophoneIcon,
  "tier-list": RankingIcon,
  "cero-estrellas": StarIcon,
  "green-screen": VideoCameraIcon,
  "x-senales": SignpostIcon,
  "mito-vs-realidad": MaskHappyIcon,
  "problemas-tachados": TextStrikethroughIcon,
  "lo-que-podes-evitar": ShieldCheckIcon,
  advertencia: WarningIcon,
};

export function FormatsPanel() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {formats.map((format) => {
        const IconComponent = FORMAT_ICONS[format.id] ?? LayoutIcon;

        return (
          <Card key={format.id} size="sm" className="ring-border/80">
            <CardHeader className="gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground">
                <IconComponent className="size-4" />
              </div>
              <CardTitle className="text-[15px] tracking-tight">
                {format.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                {format.summary}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
