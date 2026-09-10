import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type InspirationMediaHoverTargetProps = {
  children: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
};

export function InspirationMediaHoverTarget({
  children,
  onClick,
  ariaLabel = "Ver en grande",
  className,
}: InspirationMediaHoverTargetProps) {
  if (!onClick) {
    return <div className={cn("relative size-full", className)}>{children}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "group/media relative block size-full cursor-pointer",
        className,
      )}
    >
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-black/25 opacity-0 transition-opacity group-hover/media:opacity-100"
      />
    </button>
  );
}
