import type { ReactNode } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function StudioSheet({
  open,
  onOpenChange,
  title,
  description,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
  children,
  footer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onPrev?: () => void;
  onNext?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const showNav = Boolean(onPrev || onNext);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-hidden p-0 sm:max-w-[40rem] data-[side=right]:sm:max-w-[40rem] md:max-w-[42rem] data-[side=right]:md:max-w-[42rem]"
      >
        <div className="flex h-full min-h-0 flex-col">
          <SheetHeader className="border-b border-border pr-12">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <SheetTitle>{title}</SheetTitle>
                {description ? (
                  <SheetDescription>{description}</SheetDescription>
                ) : null}
              </div>
              {showNav ? (
                <div className="flex shrink-0 items-center gap-1 pt-0.5">
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    disabled={!onPrev || prevDisabled}
                    onClick={onPrev}
                    aria-label="Anterior"
                  >
                    <CaretLeftIcon className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    disabled={!onNext || nextDisabled}
                    onClick={onNext}
                    aria-label="Siguiente"
                  >
                    <CaretRightIcon className="size-4" />
                  </Button>
                </div>
              ) : null}
            </div>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {children}
          </div>
          {footer ? (
            <div className="border-t border-border px-4 py-3">{footer}</div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function StudioBriefRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-[13px] text-foreground">{value}</p>
    </div>
  );
}

export function StudioSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-3", className)}>
      <div>
        <p className="text-[13px] font-medium">{title}</p>
        {description ? (
          <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
