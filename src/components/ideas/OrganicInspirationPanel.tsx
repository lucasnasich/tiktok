import {
  InspirationCommentCard,
  InspirationLinkCard,
} from "@/components/ideas/InspirationLinkCard";
import {
  INSPIRATION_CONTAINER_CLASS,
  INSPIRATION_GRID_CLASS,
} from "@/components/ideas/inspiration-layout";
import {
  organicInspirations,
  type OrganicInspiration,
} from "@/content/organic-inspirations";

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
        url: item.url,
        title: item.title,
        previewImage: item.previewImage,
        media: item.media,
        note: item.note,
      }}
    />
  );
}

export function OrganicInspirationPanel() {
  if (organicInspirations.length === 0) {
    return (
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        Todavía no hay piezas orgánicas guardadas.
      </p>
    );
  }

  return (
    <div className={INSPIRATION_CONTAINER_CLASS}>
      <div className={INSPIRATION_GRID_CLASS}>
        {organicInspirations.map((item) => (
          <OrganicInspirationCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
