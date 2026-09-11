import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const planningToolbarButtonClass =
  "h-8 gap-1.5 px-2.5 text-xs font-medium [&_svg]:size-3.5";

export const planningToolbarIconButtonClass = "size-8 [&_svg]:size-3.5";

export function PlanningToolbarButton({
  className,
  variant = "outline",
  size = "default",
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(planningToolbarButtonClass, className)}
      {...props}
    />
  );
}

export function PlanningToolbarIconButton({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(planningToolbarIconButtonClass, className)}
      {...props}
    />
  );
}
