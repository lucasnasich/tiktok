import type { Icon } from "@phosphor-icons/react";
import {
  GlobeIcon,
  InstagramLogoIcon,
  TiktokLogoIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CompetitorInspiration } from "@/content/competitor-inspirations";
import {
  formatCountryFlag,
  formatCountryFlags,
} from "@/content/competitor-flags";
import { getCompetitorMercantisMarkets } from "@/content/competitor-rankings";
import type { CompetitorSortId } from "@/content/competitor-view";
import { competitorLogos } from "@/content/competitor-logos";
import { cn } from "@/lib/utils";

type CompetitorCardProps = {
  item: CompetitorInspiration;
  /** Badge: global (#30 poder) o posición en el país (#2 en Argentina). */
  rank?: number;
  marketRank?: number;
  similarityRank?: number;
  countryMarketRank?: number;
  countryLabel?: string;
  isGlobal?: boolean;
  highlightSort?: CompetitorSortId;
  className?: string;
};

export function CompetitorCard({
  item,
  rank,
  marketRank,
  similarityRank,
  countryMarketRank,
  countryLabel,
  isGlobal = true,
  highlightSort = "market",
  className,
}: CompetitorCardProps) {
  const logo = competitorLogos[item.id];

  const links = [
    item.instagramUrl
      ? { label: "Instagram", url: item.instagramUrl, icon: InstagramLogoIcon }
      : null,
    item.websiteUrl
      ? { label: "Web", url: item.websiteUrl, icon: GlobeIcon }
      : null,
    item.tiktokUrl
      ? { label: "TikTok", url: item.tiktokUrl, icon: TiktokLogoIcon }
      : null,
  ].filter(Boolean) as {
    label: string;
    url: string;
    icon: Icon;
  }[];

  const mercantisMarkets = getCompetitorMercantisMarkets(item.id);
  const rankScores = [
    marketRank !== undefined ? `Poder global #${marketRank}` : null,
    similarityRank !== undefined ? `Similitud global #${similarityRank}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card
      size="sm"
      className={cn(
        "relative flex h-full w-full flex-col items-center gap-3 px-3 py-4 text-center ring-border/80",
        className,
      )}
    >
      {rank !== undefined ? (
        <span
          className="absolute top-2.5 left-2.5 flex size-6 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background"
          aria-label={`Posición ${rank}`}
        >
          {rank}
        </span>
      ) : null}

      <div className="flex w-full flex-col items-center gap-2.5">
        {logo ? (
          <img
            src={logo}
            alt=""
            className="size-11 rounded-xl border border-border/80 bg-background object-contain p-1.5 shadow-sm"
          />
        ) : (
          <div
            className="flex size-11 items-center justify-center rounded-xl border border-border/80 bg-muted text-[16px] font-semibold text-foreground"
            aria-hidden
          >
            {item.name.charAt(0)}
          </div>
        )}

        <div className="w-full space-y-1">
          <p className="text-[14px] font-semibold tracking-tight text-foreground">
            {item.name}
          </p>
          <p className="text-[12px] leading-snug text-muted-foreground">
            {item.summary}
          </p>
          {rankScores ? (
            <p className="text-[11px] font-medium text-foreground/85">
              {rankScores}
            </p>
          ) : null}
          {!isGlobal &&
          countryMarketRank !== undefined &&
          countryLabel &&
          highlightSort === "similarity" ? (
            <p className="text-[11px] text-muted-foreground">
              Poder en {countryLabel}: #{countryMarketRank}
            </p>
          ) : null}
          <p className="text-center text-[10px] leading-snug text-muted-foreground/90">
            <span className="font-medium text-foreground/80">Origen:</span>{" "}
            <span aria-label={item.originCountry}>
              {formatCountryFlag(item.originCountry)}
            </span>
            <br />
            <span className="font-medium text-foreground/80">Opera en:</span>{" "}
            <span aria-label={mercantisMarkets.join(", ")}>
              {formatCountryFlags(mercantisMarkets)}
            </span>
          </p>
        </div>
      </div>

      <CardContent className="w-full space-y-1.5 p-0">
        {links.map((link) => (
          <Button
            key={link.url}
            asChild
            variant="outline"
            className="h-8 w-full rounded-lg border-border/80 bg-background text-[12px] font-semibold shadow-sm transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
          >
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <link.icon className="size-3.5" />
              {link.label}
            </a>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
