import { InspirationCommentCard, InspirationLinkCard } from "@/components/ideas/InspirationLinkCard";
import {
  INSPIRATION_CONTAINER_CLASS,
  INSPIRATION_GRID_CLASS,
} from "@/components/ideas/inspiration-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  CLIENTE_INSPIRATION_TYPE_LABELS,
  clientInspirations,
} from "@/content/client-inspirations";
import { creativeInspirations } from "@/content/creative-inspirations";
import { organicInspirations } from "@/content/organic-inspirations";

function ClienteCard({
  item,
}: {
  item: (typeof clientInspirations)[number];
}) {
  return (
    <Card size="sm" className="h-full ring-border/80">
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

export function AllInspirationsPanel() {
  const hasContent =
    clientInspirations.length > 0 ||
    organicInspirations.length > 0 ||
    creativeInspirations.length > 0;

  if (!hasContent) {
    return (
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        Todavía no hay referencias guardadas.
      </p>
    );
  }

  return (
    <div className={INSPIRATION_CONTAINER_CLASS}>
      <div className={INSPIRATION_GRID_CLASS}>
        {clientInspirations.map((item) => (
          <ClienteCard key={`cliente-${item.id}`} item={item} />
        ))}

        {organicInspirations.map((item) =>
          item.kind === "comment" ? (
            <InspirationCommentCard
              key={`organico-${item.id}`}
              item={{
                id: item.id,
                platform: item.platform,
                text: item.text,
                postUrl: item.postUrl,
              }}
            />
          ) : (
            <InspirationLinkCard
              key={`organico-${item.id}`}
              item={{
                id: item.id,
                platform: item.platform,
                url: item.url,
                title: item.title,
                previewImage: item.previewImage,
                media: item.media,
                note: item.note,
              }}
            />
          ),
        )}

        {creativeInspirations.map((item) => (
          <InspirationLinkCard key={`creativo-${item.id}`} item={item} />
        ))}
      </div>
    </div>
  );
}
