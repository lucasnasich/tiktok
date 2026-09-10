import type { Icon } from "@phosphor-icons/react";
import {
  FacebookLogoIcon,
  InstagramLogoIcon,
  TiktokLogoIcon,
  XLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
import type { IconProps } from "@phosphor-icons/react";

const PLATFORM_ICONS: Record<string, Icon> = {
  tiktok: TiktokLogoIcon,
  instagram: InstagramLogoIcon,
  x: XLogoIcon,
  twitter: XLogoIcon,
  youtube: YoutubeLogoIcon,
  facebook: FacebookLogoIcon,
};

function normalizePlatform(platform: string) {
  return platform.trim().toLowerCase().replace(/\s+/g, "");
}

type PlatformIconProps = Omit<IconProps, "ref"> & {
  platform: string;
};

export function PlatformIcon({ platform, size = 14, ...props }: PlatformIconProps) {
  const IconComponent = PLATFORM_ICONS[normalizePlatform(platform)];
  if (!IconComponent) return null;

  return <IconComponent size={size} weight="duotone" {...props} />;
}
