import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormatIcon } from "@/components/planning/format-icons";
import { formats } from "@/content/formats";

export function FormatsPanel() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {formats.map((format) => (
        <Card key={format.id} size="sm" className="ring-border/80">
          <CardHeader className="gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground">
              <FormatIcon formatId={format.id} className="size-4" />
            </div>
            <CardTitle className="text-[15px] tracking-tight">
              {format.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              {format.summary}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
