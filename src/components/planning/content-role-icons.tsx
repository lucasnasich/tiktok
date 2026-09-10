import type { Icon, IconProps } from "@phosphor-icons/react";
import {
  BookOpenIcon,
  BroadcastIcon,
  ChatsCircleIcon,
  CompassIcon,
  CursorClickIcon,
  SealCheckIcon,
  TagIcon,
} from "@phosphor-icons/react";

import type { ContentRoleId } from "@/content/content-roles";

/** Un icono distinto por rol — sin repetir dentro de la taxonomía. */
const CONTENT_ROLE_ICONS: Record<ContentRoleId, Icon> = {
  alcance: BroadcastIcon,
  valor: BookOpenIcon,
  prueba: SealCheckIcon,
  conversion: CursorClickIcon,
  marca: CompassIcon,
  comunidad: ChatsCircleIcon,
};

export function getContentRoleIcon(roleId: ContentRoleId | string): Icon {
  return CONTENT_ROLE_ICONS[roleId as ContentRoleId] ?? TagIcon;
}

export function ContentRoleIcon({
  roleId,
  className,
  ...props
}: { roleId: ContentRoleId | string } & IconProps) {
  const IconComponent = getContentRoleIcon(roleId);
  return <IconComponent className={className} {...props} />;
}
