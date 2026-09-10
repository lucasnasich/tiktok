import { useEffect, useState } from "react";

import { MarkdownContent } from "@/components/MarkdownContent";
import { MERCANTIS_BRAIN_DOCS } from "@/content/mercantis-brain";
import { cn } from "@/lib/utils";

const knowledgeLoaders = import.meta.glob("../../knowledge/mercantis/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

function loaderForFile(file: string): (() => Promise<string>) | undefined {
  const entry = Object.entries(knowledgeLoaders).find(([path]) =>
    path.endsWith(`/mercantis/${file}`),
  );
  return entry?.[1];
}

export function MercantisBrainDocs() {
  const [docId, setDocId] = useState(MERCANTIS_BRAIN_DOCS[0].id);
  const [content, setContent] = useState("");
  const active = MERCANTIS_BRAIN_DOCS.find((doc) => doc.id === docId)!;

  useEffect(() => {
    let cancelled = false;
    const load = loaderForFile(active.file);
    if (!load) {
      setContent(`_No se encontró \`${active.file}\`._`);
      return;
    }
    setContent("");
    void load().then((text) => {
      if (!cancelled) setContent(text);
    });
    return () => {
      cancelled = true;
    };
  }, [active.file]);

  return (
    <div className="flex min-h-0 flex-col gap-4 lg:flex-row lg:items-start">
      <nav className="flex shrink-0 flex-wrap gap-1 lg:w-44 lg:flex-col">
        {MERCANTIS_BRAIN_DOCS.map((doc) => (
          <button
            key={doc.id}
            type="button"
            onClick={() => setDocId(doc.id)}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-left text-[12px] font-medium tracking-tight",
              docId === doc.id
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            {doc.label}
          </button>
        ))}
      </nav>
      <article className="min-w-0 flex-1">
        <p className="mb-4 text-[12px] text-muted-foreground">
          Fuente de verdad de Mercantis · {active.file} · no es documentación del
          Studio
        </p>
        {content ? (
          <MarkdownContent content={content} />
        ) : (
          <p className="text-[14px] text-muted-foreground">Cargando…</p>
        )}
      </article>
    </div>
  );
}
