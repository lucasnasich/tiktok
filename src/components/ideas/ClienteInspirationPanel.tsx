import {
  INSPIRATION_CONTAINER_CLASS,
  INSPIRATION_GRID_CLASS,
} from "@/components/ideas/inspiration-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  CLIENTE_INSPIRATION_TYPE_LABELS,
  clientInspirations,
  type ClienteInspiration,
} from "@/content/client-inspirations";

function ClienteInspirationCard({ item }: { item: ClienteInspiration }) {
  return (
    <Card size="sm" className="h-full ring-border/80">
      <CardHeader className="gap-2">
        <Badge variant="secondary" className="w-fit text-[11px]">
          {CLIENTE_INSPIRATION_TYPE_LABELS[item.type]}
        </Badge>
        <p className="text-[14px] leading-relaxed text-foreground">{item.text}</p>
      </CardHeader>
      {item.context ? (
        <CardContent className="pt-0">
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            {item.context}
          </p>
        </CardContent>
      ) : null}
    </Card>
  );
}

export function ClienteInspirationPanel() {
  return (
    <div className={INSPIRATION_CONTAINER_CLASS}>
      <div className={INSPIRATION_GRID_CLASS}>
        {clientInspirations.map((item) => (
          <ClienteInspirationCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
