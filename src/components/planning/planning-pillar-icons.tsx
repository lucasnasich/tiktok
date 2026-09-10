import type { Icon, IconProps } from "@phosphor-icons/react";
import {
  AppWindowIcon,
  CalculatorIcon,
  ChatCenteredDotsIcon,
  GraduationCapIcon,
  HandshakeIcon,
  KanbanIcon,
  MegaphoneIcon,
  NewspaperIcon,
  RobotIcon,
  RocketLaunchIcon,
  StorefrontIcon,
  TagIcon,
  TruckIcon,
  UsersThreeIcon,
  WalletIcon,
  WarehouseIcon,
} from "@phosphor-icons/react";

import { normalizePillarId } from "@/content/planning-pillars";

/** Un icono distinto por pilar — sin repetir dentro de la taxonomía. */
const PLANNING_PILLAR_ICONS: Record<string, Icon> = {
  "ventas-atencion": ChatCenteredDotsIcon,
  "inventario-stock": WarehouseIcon,
  "pedidos-logistica": TruckIcon,
  "pagos-cobros": WalletIcon,
  "catalogo-ecommerce": StorefrontIcon,
  "operacion-gestion": KanbanIcon,
  "marketing-crecimiento": MegaphoneIcon,
  "automatizacion-ia": RobotIcon,
  "equipo-sucursales": UsersThreeIcon,
  "clientes-fidelizacion": HandshakeIcon,
  "numeros-negocio": CalculatorIcon,
  "producto-mercantis": AppWindowIcon,
  emprendimiento: RocketLaunchIcon,
  "mercado-tendencias": NewspaperIcon,
  estudiantes: GraduationCapIcon,
};

export function getPlanningPillarIcon(pillarId: string): Icon {
  return PLANNING_PILLAR_ICONS[normalizePillarId(pillarId)] ?? TagIcon;
}

export function PlanningPillarIcon({
  pillarId,
  className,
  ...props
}: { pillarId: string } & IconProps) {
  const IconComponent = getPlanningPillarIcon(pillarId);
  return <IconComponent className={className} {...props} />;
}
