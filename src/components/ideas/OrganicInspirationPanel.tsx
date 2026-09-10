import type { ColumnCount } from "@/components/ColumnSelector";
import {
  InspirationCommentCard,
  InspirationLinkCard,
} from "@/components/ideas/InspirationLinkCard";
import { inspirationGridClass } from "@/components/ideas/inspiration-layout";
import { getSourceLabel } from "@/content/idea-sources";
import { matchesFormatFilter } from "@/content/formats";
import {
  organicInspirations,
  type OrganicInspiration,
} from "@/content/organic-inspirations";

const SOURCE_LABEL = getSourceLabel("organico");

function OrganicInspirationCard({ item }: { item: OrganicInspiration }) {
  if (item.kind === "comment") {
    return (
      <InspirationCommentCard
        item={{
          id: item.id,
          platform: item.platform,
          text: item.text,
          postUrl: item.postUrl,
        }}
      />
    );
  }

  return (
    <InspirationLinkCard
      item={{
        id: item.id,
        platform: item.platform,
        sourceLabel: SOURCE_LABEL,
        url: item.url,
        title: item.title,
        previewImage: item.previewImage,
        media: item.media,
        postText: item.postText,
        author: item.author,
        note: item.note,
        formatIds: item.formatIds,
      }}
    />
  );
}

export function OrganicInspirationPanel({
  columns,
  activeFormat,
}: {
  columns: ColumnCount;
  activeFormat?: string;
}) {
  const items = organicInspirations.filter((item) =>
    matchesFormatFilter(
      item.kind === "post" ? item.formatIds : undefined,
      activeFormat ?? "all",
    ),
  );

  if (organicInspirations.length === 0) {
    return (
      <p className="px-5 text-[14px] leading-relaxed text-muted-foreground">
        Todavía no hay piezas orgánicas guardadas.
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="px-5 text-[14px] leading-relaxed text-muted-foreground">
        Ninguna referencia con ese formato.
      </p>
    );
  }

  return (
    <div className={inspirationGridClass(columns)}>
      {items.map((item) => (
        <OrganicInspirationCard key={item.id} item={item} />
      ))}
    </div>
  );
}
