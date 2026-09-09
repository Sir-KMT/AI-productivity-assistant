import { type ReactNode } from "react";

function inline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-secondary px-1 py-0.5 text-[0.85em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}

/** Renders the light markdown that chat replies use: headings, bullets, bold, code, rules. */
export function MarkdownLite({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {lines.map((raw, i) => {
        const line = raw.trimEnd();
        if (!line.trim()) return <div key={i} className="h-1" />;
        if (/^\s*(---|\*\*\*|___)\s*$/.test(line))
          return <hr key={i} className="border-border" />;

        const heading = /^(#{1,6})\s+(.*)$/.exec(line);
        if (heading) {
          return (
            <p key={i} className="pt-1 font-display text-sm font-semibold text-foreground">
              {inline(heading[2] ?? "")}
            </p>
          );
        }

        const bullet = /^\s*[-*•]\s+(.*)$/.exec(line);
        if (bullet) {
          return (
            <p key={i} className="flex gap-2 pl-1">
              <span className="text-primary">•</span>
              <span>{inline(bullet[1] ?? "")}</span>
            </p>
          );
        }

        const numbered = /^\s*(\d+)[.)]\s+(.*)$/.exec(line);
        if (numbered) {
          return (
            <p key={i} className="flex gap-2 pl-1">
              <span className="text-primary">{numbered[1]}.</span>
              <span>{inline(numbered[2] ?? "")}</span>
            </p>
          );
        }

        return <p key={i}>{inline(line)}</p>;
      })}
    </div>
  );
}
