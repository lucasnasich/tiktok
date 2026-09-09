import { InspirationLinkCard } from "@/components/ideas/InspirationLinkCard";
import {
  INSPIRATION_CONTAINER_CLASS,
  INSPIRATION_GRID_CLASS,
} from "@/components/ideas/inspiration-layout";
import { creativeInspirations } from "@/content/creative-inspirations";

export function CreativeInspirationPanel() {
  if (creativeInspirations.length === 0) {
    return (
      <p className="text-[14px] leading-relaxed text-muted-foreground">
        Todavía no hay referencias creativas guardadas.
      </p>
    );
  }

  return (
    <div className={INSPIRATION_CONTAINER_CLASS}>
      <div className={INSPIRATION_GRID_CLASS}>
        {creativeInspirations.map((item) => (
          <InspirationLinkCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
