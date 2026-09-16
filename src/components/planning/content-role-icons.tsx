import type { Icon, IconProps } from "@phosphor-icons/react";
import {
  BookOpenIcon,
  ChatsCircleIcon,
  CompassIcon,
  HammerIcon,
  MonitorPlayIcon,
  SealCheckIcon,
  TagIcon,
} from "@phosphor-icons/react";

import { normalizeRoleId, type ContentRoleId } from "@/content/content-roles";

/** Un icono distinto por rol — sin repetir dentro de la taxonomía. */
const CONTENT_ROLE_ICONS: Record<ContentRoleId, Icon> = {
  build_in_public: HammerIcon,
  educacion: BookOpenIcon,
  producto: MonitorPlayIcon,
  marca: CompassIcon,
  evidencia: SealCheckIcon,
  comunidad: ChatsCircleIcon,
};

export function getContentRoleIcon(roleId: ContentRoleId | string): Icon {
  return CONTENT_ROLE_ICONS[normalizeRoleId(roleId)] ?? TagIcon;
}

export function ContentRoleIcon({
  roleId,
  className,
  ...props
}: { roleId: ContentRoleId | string } & IconProps) {
  const IconComponent = getContentRoleIcon(roleId);
  return <IconComponent className={className} {...props} />;
}
