import { PageStack } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSourceLabel } from "@/content/idea-sources";
import { signals } from "@/content/signals";

export function SignalsPanel() {
  return (
    <PageStack>
      {signals.map((signal) => (
        <Card key={signal.id} size="sm" className="ring-border/80">
          <CardHeader>
            <CardTitle className="text-[15px] leading-snug tracking-tight">
              {signal.text}
            </CardTitle>
            <CardAction>
              <Badge variant="secondary" className="text-[11px]">
                {getSourceLabel(signal.sourceId)}
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </PageStack>
  );
}
