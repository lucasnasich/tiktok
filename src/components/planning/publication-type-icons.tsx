import type { Icon, IconProps } from "@phosphor-icons/react";
import {
  DeviceMobileIcon,
  ImagesIcon,
  ImageSquareIcon,
  MonitorPlayIcon,
} from "@phosphor-icons/react";

import {
  isPublicationTypeId,
  type PublicationTypeId,
} from "@/content/publication-types";

const PUBLICATION_TYPE_ICONS: Record<PublicationTypeId, Icon> = {
  single_image: ImageSquareIcon,
  image_carousel: ImagesIcon,
  short_video: MonitorPlayIcon,
  story: DeviceMobileIcon,
};

export function PublicationTypeIcon({
  typeId,
  className,
  ...props
}: { typeId: string } & IconProps) {
  const id = isPublicationTypeId(typeId) ? typeId : "short_video";
  const IconComponent = PUBLICATION_TYPE_ICONS[id];
  return <IconComponent className={className} {...props} />;
}
