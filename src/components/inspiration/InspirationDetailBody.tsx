import { ArrowSquareOutIcon } from "@phosphor-icons/react";

import { InspirationLinkPreview } from "@/components/ideas/InspirationLinkPreview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAngleLabel } from "@/content/angles";
import { resolveInspirationPlatform } from "@/content/inspiration-browse-filters";
import type { InspirationFeedItem } from "@/content/inspiration-feed";
import { getPlanningAccountLabel } from "@/content/planning-accounts";
import type { PlanningSlot } from "@/content/planned-slots";
import type { Proposal } from "@/content/proposals";
import { PlatformIcon } from "@/components/icons/platform-icon";
import {
  formatInspirationUsage,
  type InspirationUsage,
} from "@/lib/inspiration-usage";
import { cn } from "@/lib/utils";

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
  const slide = item.media?.[0];
  const platform = resolveInspirationPlatform(item);
  const relatedSlots = slots.filter((slot) => usage.slotIds.includes(slot.id));
  const relatedProposals = proposals.filter((proposal) =>
    usage.proposalIds.includes(proposal.id),
  );

  return (
    <div className="space-y-6">
      {item.url && platform ? (
        <div className="overflow-hidden rounded-lg border border-border">
          <InspirationLinkPreview
            url={item.url}
            media={item.media}
            platform={platform}
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
        {platform ? (
          <Badge variant="outline" className="gap-1">
            <PlatformIcon platform={platform} size={12} />
            {platform}
          </Badge>
        ) : null}
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
            Cuentas:{" "}
            {usage.accountIds.map((id) => getPlanningAccountLabel(id)).join(", ")}
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
  const platform = resolveInspirationPlatform(item);

  if (!src) {
    return (
      <div
        className={cn(
          "flex size-16 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] text-muted-foreground",
        )}
      >
        {platform || "—"}
      </div>
    );
  }

  return <img src={src} alt="" className="size-16 shrink-0 rounded-md object-cover" />;
}
