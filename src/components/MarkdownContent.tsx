import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";

const markdownComponents = {
  h1: ({ children }: { children?: ReactNode }) => (
    <h1 className="mb-4 text-[18px] font-semibold tracking-tight text-foreground">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="mt-6 mb-3 text-[15px] font-medium tracking-tight text-foreground first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className="mt-4 mb-2 text-[14px] font-medium tracking-tight text-foreground">
      {children}
    </h3>
  ),
  h4: ({ children }: { children?: ReactNode }) => (
    <h4 className="mt-3 mb-1.5 text-[13px] font-medium text-foreground">
      {children}
    </h4>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className="mb-3 text-[14px] leading-relaxed text-muted-foreground">{children}</p>
  ),
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="mb-3 border-l-2 border-border pl-3 text-[14px] leading-relaxed text-muted-foreground">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-6 border-border" />,
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="mb-4 list-disc space-y-1.5 pl-5 text-[14px] leading-relaxed text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="mb-4 list-decimal space-y-1.5 pl-5 text-[14px] leading-relaxed text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <li className="text-muted-foreground">{children}</li>
  ),
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-medium text-foreground">{children}</strong>
  ),
  code: ({ children }: { children?: ReactNode }) => (
    <code className="rounded bg-muted px-1 py-0.5 font-mono text-[12px] text-foreground">
      {children}
    </code>
  ),
  pre: ({ children }: { children?: ReactNode }) => (
    <pre className="mb-4 overflow-x-auto rounded-lg border border-border bg-card p-4 font-mono text-[12px] leading-relaxed text-foreground">
      {children}
    </pre>
  ),
  table: ({ children }: { children?: ReactNode }) => (
    <div className="mb-4 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-[13px]">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: ReactNode }) => (
    <thead className="border-b border-border bg-muted/50 text-foreground">{children}</thead>
  ),
  th: ({ children }: { children?: ReactNode }) => (
    <th className="px-3 py-2 font-medium">{children}</th>
  ),
  td: ({ children }: { children?: ReactNode }) => (
    <td className="border-t border-border px-3 py-2 text-muted-foreground">{children}</td>
  ),
};

export function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
  );
}
