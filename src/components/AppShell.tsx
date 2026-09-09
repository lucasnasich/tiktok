import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Playground({
  title,
  meta,
  fullWidth = false,
  actions,
  children,
}: {
  title: string;
  meta?: string;
  fullWidth?: boolean;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="sticky top-0 z-10 flex h-[var(--header-height)] shrink-0 items-center justify-between gap-4 border-b border-border/80 bg-secondary/80 px-5 backdrop-blur-sm">
        <div className="flex min-w-0 items-baseline gap-3">
          <h1 className="text-[15px] font-medium tracking-tight text-foreground">
            {title}
          </h1>
          {meta ? (
            <span className="text-[13px] text-muted-foreground">{meta}</span>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center">{actions}</div> : null}
      </header>
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div
          className={cn(
            "mx-auto w-full",
            fullWidth ? "min-h-full" : "max-w-[880px] px-5 py-8",
          )}
        >
          {children}
        </div>
      </main>
    </div>
  );
}

export function PageStack({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
}
