import { ArrowSquareOutIcon } from "@phosphor-icons/react";

import { InspirationLinkPreview } from "@/components/ideas/InspirationLinkPreview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { angles, getAngleLabel } from "@/content/angles";
import { contentRoles, type ContentRoleId } from "@/content/content-roles";
import { formats, getFormatLabel } from "@/content/formats";
import type { InspirationFeedItem } from "@/content/inspiration-feed";
import {
  INSPIRATION_ORIGIN_LABELS,
  INSPIRATION_ORIGINS,
  INSPIRATION_TYPE_LABELS,
  type InspirationMaterialType,
  type InspirationOrigin,
} from "@/content/inspiration-taxonomy";
import { getPlanningAccountLabel } from "@/content/planning-accounts";
import {
  planningPillars,
} from "@/content/planning-pillars";
import type { PlanningSlot } from "@/content/planned-slots";
import type { Proposal } from "@/content/proposals";
import { useInspirationOverrides } from "@/hooks/use-inspiration-overrides";
import {
  formatInspirationUsage,
  type InspirationUsage,
} from "@/lib/inspiration-usage";
import { cn } from "@/lib/utils";

function ChipGroup<T extends string>({
  values,
  options,
  onToggle,
}: {
  values: T[];
  options: { value: T; label: string }[];
  onToggle: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const active = values.includes(option.value);
        return (
          <Button
            key={option.value}
            type="button"
            size="xs"
            variant={active ? "default" : "outline"}
            onClick={() => onToggle(option.value)}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}

export function InspirationDetailBody({
  item,
  usage,
  slots,
  proposals,
  onUse,
}: {
  item: InspirationFeedItem;
  usage: InspirationUsage;
  slots: PlanningSlot[];
  proposals: Proposal[];
  onUse?: () => void;
}) {
  const { patchOverride } = useInspirationOverrides();
  const slide = item.media?.[0];
  const relatedSlots = slots.filter((slot) => usage.slotIds.includes(slot.id));
  const relatedProposals = proposals.filter((proposal) =>
    usage.proposalIds.includes(proposal.id),
  );

  function toggleList<T extends string>(current: T[] | undefined, value: T) {
    const list = current ?? [];
    return list.includes(value)
      ? list.filter((itemValue) => itemValue !== value)
      : [...list, value];
  }

  return (
    <div className="space-y-6">
      {item.url && item.platform ? (
        <div className="overflow-hidden rounded-lg border border-border">
          <InspirationLinkPreview
            url={item.url}
            media={item.media}
            platform={item.platform}
            title={item.title}
            postText={item.postText}
            author={item.author}
          />
        </div>
      ) : slide?.kind === "image" ? (
        <img src={slide.url} alt="" className="w-full rounded-lg object-cover" />
      ) : item.quote ? (
        <blockquote className="border-l-2 border-border pl-3 text-[14px] leading-relaxed">
          “{item.quote}”
        </blockquote>
      ) : null}

      <div className="space-y-2">
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary">
            {INSPIRATION_TYPE_LABELS[item.materialType]}
          </Badge>
          <Badge variant="outline">{INSPIRATION_ORIGIN_LABELS[item.origin]}</Badge>
        </div>
        <p className="text-[15px] font-medium leading-snug">{item.title}</p>
        {item.signal ? (
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {item.signal}
          </p>
        ) : null}
        {item.creativeMechanism ? (
          <p className="text-[13px] leading-relaxed text-foreground">
            Mecanismo: {item.creativeMechanism}
          </p>
        ) : null}
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[13px] font-medium underline underline-offset-2"
          >
            Abrir original
            <ArrowSquareOutIcon className="size-3.5" />
          </a>
        ) : null}
      </div>

      <div className="space-y-2">
        <p className="text-[13px] font-medium">Historial</p>
        <p className="text-[13px] text-muted-foreground">
          {formatInspirationUsage(usage)}
        </p>
        {usage.accountIds.length > 0 ? (
          <p className="text-[12px] text-muted-foreground">
            Cuentas: {usage.accountIds.map(getPlanningAccountLabel).join(", ")}
          </p>
        ) : null}
        {usage.angleIds.length > 0 ? (
          <p className="text-[12px] text-muted-foreground">
            Ángulos: {usage.angleIds.map(getAngleLabel).join(", ")}
          </p>
        ) : null}
        {relatedSlots.length > 0 ? (
          <ul className="space-y-1 text-[12px] text-muted-foreground">
            {relatedSlots.map((slot) => (
              <li key={slot.id}>
                Slot {slot.date} · {slot.time} · {getPlanningAccountLabel(slot.accountId)}
              </li>
            ))}
          </ul>
        ) : null}
        {relatedProposals.length > 0 ? (
          <ul className="space-y-1 text-[12px] text-muted-foreground">
            {relatedProposals.map((proposal) => (
              <li key={proposal.id}>{proposal.hook}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="space-y-3">
        <p className="text-[13px] font-medium">Clasificación</p>
        <p className="text-[12px] text-muted-foreground">
          Corregí solo si hay evidencia. Vacío o parcial está bien.
        </p>
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Tipo
          </p>
          <div className="flex gap-1.5">
            {(["suggestion", "example"] as InspirationMaterialType[]).map((type) => (
              <Button
                key={type}
                type="button"
                size="sm"
                variant={item.materialType === type ? "default" : "outline"}
                onClick={() => patchOverride(item.key, { materialType: type })}
              >
                {INSPIRATION_TYPE_LABELS[type]}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Origen
          </p>
          <ChipGroup
            values={[item.origin]}
            options={INSPIRATION_ORIGINS.map((origin) => ({
              value: origin,
              label: INSPIRATION_ORIGIN_LABELS[origin],
            }))}
            onToggle={(origin: InspirationOrigin) =>
              patchOverride(item.key, { origin })
            }
          />
        </div>
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Afinidad de rol
          </p>
          <ChipGroup
            values={item.roleAffinities ?? []}
            options={contentRoles.map((role) => ({
              value: role.id,
              label: role.label,
            }))}
            onToggle={(roleId: ContentRoleId) =>
              patchOverride(item.key, {
                roleAffinities: toggleList(item.roleAffinities, roleId),
              })
            }
          />
        </div>
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Afinidad de pilar
          </p>
          <ChipGroup
            values={item.pillarAffinities ?? []}
            options={planningPillars.map((pillar) => ({
              value: pillar.id,
              label: pillar.label,
            }))}
            onToggle={(pillarId: string) =>
              patchOverride(item.key, {
                pillarAffinities: toggleList(item.pillarAffinities, pillarId),
              })
            }
          />
        </div>
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Afinidad de formato
          </p>
          <ChipGroup
            values={item.formatAffinities ?? []}
            options={formats.slice(0, 16).map((format) => ({
              value: format.id,
              label: getFormatLabel(format.id),
            }))}
            onToggle={(formatId: string) =>
              patchOverride(item.key, {
                formatAffinities: toggleList(item.formatAffinities, formatId),
              })
            }
          />
        </div>
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Afinidad de ángulo
          </p>
          <ChipGroup
            values={item.angleAffinities ?? []}
            options={angles.map((angle) => ({
              value: angle.id,
              label: angle.label,
            }))}
            onToggle={(angleId: string) =>
              patchOverride(item.key, {
                angleAffinities: toggleList(item.angleAffinities, angleId),
              })
            }
          />
        </div>
      </div>

      {onUse ? (
        <Button type="button" onClick={onUse}>
          Usar esta
        </Button>
      ) : null}
    </div>
  );
}

export function InspirationThumb({ item }: { item: InspirationFeedItem }) {
  const slide = item.media?.[0];
  const src = slide?.kind === "image" ? slide.url : slide?.poster;

  if (!src) {
    return (
      <div
        className={cn(
          "flex size-16 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] text-muted-foreground",
        )}
      >
        {item.platform ?? item.sourceLabel}
      </div>
    );
  }

  return <img src={src} alt="" className="size-16 shrink-0 rounded-md object-cover" />;
}
