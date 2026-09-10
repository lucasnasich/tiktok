import type { ColumnCount } from "@/components/ColumnSelector";
import { InspirationCommentCard, InspirationLinkCard } from "@/components/ideas/InspirationLinkCard";
import { inspirationGridClass } from "@/components/ideas/inspiration-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  CLIENTE_INSPIRATION_TYPE_LABELS,
  clientInspirations,
} from "@/content/client-inspirations";
import { getSourceLabel } from "@/content/idea-sources";
import { creativeInspirations } from "@/content/creative-inspirations";
import { matchesFormatFilter } from "@/content/formats";
import { organicInspirations } from "@/content/organic-inspirations";

function ClienteCard({
  item,
  onOpen,
}: {
  item: (typeof clientInspirations)[number];
  onOpen?: () => void;
}) {
  return (
    <Card
      size="sm"
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen}
      className={
        onOpen
          ? "h-full cursor-pointer rounded-none p-3 ring-0 transition-colors hover:bg-muted/40"
          : "h-full rounded-none p-3 ring-0"
      }
    >
      <CardHeader className="gap-2">
        <Badge variant="secondary" className="w-fit text-[11px]">
          Cliente · {CLIENTE_INSPIRATION_TYPE_LABELS[item.type]}
        </Badge>
        <blockquote className="border-l-2 border-border py-0.5 pl-3 text-[14px] leading-relaxed text-foreground">
          “{item.text}”
        </blockquote>
      </CardHeader>
      {item.context ? (
        <CardContent className="pt-0">
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {item.context}
          </p>
        </CardContent>
      ) : null}
    </Card>
  );
}

export function AllInspirationsPanel({
  columns,
  activeFormat,
  onOpenReference,
}: {
  columns: ColumnCount;
  activeFormat?: string;
  onOpenReference?: (key: string) => void;
}) {
  const formatId = activeFormat ?? "all";
  const filteredOrganic = organicInspirations.filter((item) =>
    matchesFormatFilter(
      item.kind === "post" ? item.formatIds : undefined,
      formatId,
    ),
  );
  const filteredCreative = creativeInspirations.filter((item) =>
    matchesFormatFilter(item.formatIds, formatId),
  );
  const showCliente = formatId === "all";

  const hasContent =
    (showCliente && clientInspirations.length > 0) ||
    filteredOrganic.length > 0 ||
    filteredCreative.length > 0;

  if (
    clientInspirations.length === 0 &&
    organicInspirations.length === 0 &&
    creativeInspirations.length === 0
  ) {
    return (
      <p className="px-5 text-[14px] leading-relaxed text-muted-foreground">
        Todavía no hay referencias guardadas.
      </p>
    );
  }

  if (!hasContent) {
    return (
      <p className="px-5 text-[14px] leading-relaxed text-muted-foreground">
        Ninguna referencia con ese formato.
      </p>
    );
  }

  return (
    <div className={inspirationGridClass(columns)}>
        {showCliente
          ? clientInspirations.map((item) => (
          <ClienteCard
            key={`cliente-${item.id}`}
            item={item}
            onOpen={
              onOpenReference
                ? () => onOpenReference(`cliente:${item.id}`)
                : undefined
            }
          />
        ))
          : null}

        {filteredOrganic.map((item) =>
          item.kind === "comment" ? (
            <InspirationCommentCard
              key={`organico-${item.id}`}
              item={{
                id: item.id,
                platform: item.platform,
                text: item.text,
                postUrl: item.postUrl,
              }}
              onOpen={
                onOpenReference
                  ? () => onOpenReference(`organico:${item.id}`)
                  : undefined
              }
            />
          ) : (
            <InspirationLinkCard
              key={`organico-${item.id}`}
              item={{
                id: item.id,
                platform: item.platform,
                sourceLabel: getSourceLabel("organico"),
                url: item.url,
                title: item.title,
                previewImage: item.previewImage,
                media: item.media,
                postText: item.postText,
                author: item.author,
                note: item.note,
                formatIds: item.formatIds,
              }}
              onOpen={
                onOpenReference
                  ? () => onOpenReference(`organico:${item.id}`)
                  : undefined
              }
            />
          ),
        )}

        {filteredCreative.map((item) => (
          <InspirationLinkCard
            key={`creativo-${item.id}`}
            item={{ ...item, sourceLabel: getSourceLabel("creativo") }}
            onOpen={
              onOpenReference
                ? () => onOpenReference(`creativo:${item.id}`)
                : undefined
            }
          />
      ))}
    </div>
  );
}
