import type { Icon, IconProps } from "@phosphor-icons/react";
import {
  BookOpenIcon,
  ChatsCircleIcon,
  CompassIcon,
  CursorClickIcon,
  MonitorPlayIcon,
  SealCheckIcon,
  TagIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";

import { normalizeRoleId, type ContentRoleId } from "@/content/content-roles";

/** Un icono distinto por rol — sin repetir dentro de la taxonomía. */
const CONTENT_ROLE_ICONS: Record<ContentRoleId, Icon> = {
  educacion: BookOpenIcon,
  producto: MonitorPlayIcon,
  evidencia: SealCheckIcon,
  "build-in-public": UsersThreeIcon,
  conversion: CursorClickIcon,
  marca: CompassIcon,
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
