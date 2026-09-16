import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  DEFAULT_PLANNING_RHYTHM,
  RHYTHM_COPY,
  type PlanningRhythm,
} from "@/content/planning-rhythm";
import { DEFAULT_TIME_SLOTS } from "@/content/planning-defaults";
import { WEEKDAY_LABELS } from "@/lib/planning-dates";
import { cn } from "@/lib/utils";

const TIME_OPTIONS = [...DEFAULT_TIME_SLOTS];

function GuideCallout({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-[12px] leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

function SingleChoice<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: ReactNode }[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant={value === option.value ? "default" : "outline"}
          size="sm"
          className="min-w-9"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

function MultiChoice<T extends string>({
  values,
  onChange,
  options,
  className,
}: {
  values: T[];
  onChange: (values: T[]) => void;
  options: { value: T; label: ReactNode }[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const selected = values.includes(option.value);
        return (
          <Button
            key={option.value}
            type="button"
            variant={selected ? "default" : "outline"}
            size="sm"
            onClick={() => {
              onChange(
                selected
                  ? values.filter((value) => value !== option.value)
                  : [...values, option.value],
              );
            }}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}

type PlanningRhythmFieldsProps = {
  value: PlanningRhythm;
  onChange: (value: PlanningRhythm) => void;
  className?: string;
};

export function PlanningRhythmFields({
  value,
  onChange,
  className,
}: PlanningRhythmFieldsProps) {
  return (
    <div className={cn("space-y-5", className)}>
      <div>
        <p className="mb-2 text-[13px] font-medium">Piezas por día</p>
        <GuideCallout>{RHYTHM_COPY.postsPerDay}</GuideCallout>
        <SingleChoice
          className="mt-3"
          value={String(value.postsPerDay)}
          onChange={(next) =>
            onChange({ ...value, postsPerDay: Number(next) })
          }
          options={[1, 2, 3, 4].map((count) => ({
            value: String(count),
            label: count,
          }))}
        />
      </div>

      <div>
        <p className="mb-2 text-[13px] font-medium">Días activos</p>
        <GuideCallout>{RHYTHM_COPY.activeDays}</GuideCallout>
        <MultiChoice
          className="mt-3"
          values={value.activeDays.map(String)}
          onChange={(days) => {
            if (days.length === 0) return;
            onChange({
              ...value,
              activeDays: days.map(Number).sort((a, b) => a - b),
            });
          }}
          options={WEEKDAY_LABELS.map((label, index) => ({
            value: String(index + 1),
            label,
          }))}
        />
      </div>

      <div>
        <p className="mb-2 text-[13px] font-medium">Horarios</p>
        <GuideCallout>{RHYTHM_COPY.timeSlots}</GuideCallout>
        <MultiChoice
          className="mt-3"
          values={value.timeSlots}
          onChange={(times) => {
            if (times.length === 0) return;
            onChange({
              ...value,
              timeSlots: TIME_OPTIONS.filter((time) => times.includes(time)),
            });
          }}
          options={TIME_OPTIONS.map((time) => ({
            value: time,
            label: time,
          }))}
        />
      </div>
    </div>
  );
}

export { DEFAULT_PLANNING_RHYTHM };
