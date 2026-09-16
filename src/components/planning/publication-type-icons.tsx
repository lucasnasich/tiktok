import type { Icon, IconProps } from "@phosphor-icons/react";
import {
  FilmStripIcon,
  ImageSquareIcon,
  ImagesIcon,
  MagicWandIcon,
  MonitorPlayIcon,
  SparkleIcon,
  VideoCameraIcon,
  VideoIcon,
} from "@phosphor-icons/react";

import {
  isProductionOptionId,
  migrateLegacyPublicationTypeId,
  type ProductionOptionId,
} from "@/content/production-options";

const PRODUCTION_OPTION_ICONS: Record<ProductionOptionId, Icon> = {
  single_image: ImageSquareIcon,
  image_carousel: ImagesIcon,
  animated_carousel: FilmStripIcon,
  remotion_video: MagicWandIcon,
  screen_demo: MonitorPlayIcon,
  ai_generated_video: SparkleIcon,
  talking_camera: VideoCameraIcon,
  talking_camera_remotion: VideoIcon,
};

export function ProductionOptionIcon({
  typeId,
  className,
  ...props
}: { typeId: string } & IconProps) {
  const id = isProductionOptionId(typeId)
    ? typeId
    : migrateLegacyPublicationTypeId(typeId);
  const IconComponent = PRODUCTION_OPTION_ICONS[id];
  return <IconComponent className={className} {...props} />;
}

/** @deprecated Usar `ProductionOptionIcon`. */
export function PublicationTypeIcon(props: { typeId: string } & IconProps) {
  return <ProductionOptionIcon {...props} />;
}
