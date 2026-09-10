import type { ColumnCount } from "@/components/ColumnSelector";
import { inspirationGridClass } from "@/components/ideas/inspiration-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  CLIENTE_INSPIRATION_TYPE_LABELS,
  clientInspirations,
  type ClienteInspiration,
} from "@/content/client-inspirations";

function ClienteInspirationCard({ item }: { item: ClienteInspiration }) {
  return (
    <Card size="sm" className="h-full rounded-none p-3 ring-0">
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

export function ClienteInspirationPanel({ columns }: { columns: ColumnCount }) {
  if (clientInspirations.length === 0) {
    return (
      <p className="px-5 text-[14px] leading-relaxed text-muted-foreground">
        Todavía no hay referencias de cliente guardadas.
      </p>
    );
  }

  return (
    <div className={inspirationGridClass(columns)}>
      {clientInspirations.map((item) => (
        <ClienteInspirationCard key={item.id} item={item} />
      ))}
    </div>
  );
}
