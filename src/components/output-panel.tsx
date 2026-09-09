import { Copy, Download, RefreshCw, Trash2, TriangleAlert, Sparkle } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  title: string;
  emptyHint: string;
  filename: string;
  value: string;
  onChange: (value: string) => void;
  loading: boolean;
  error: string | null;
  demo: boolean;
  notice?: string;
  onRegenerate: () => void;
  onClear: () => void;
  canRegenerate: boolean;
};

export function OutputPanel({
  title,
  emptyHint,
  filename,
  value,
  onChange,
  loading,
  error,
  demo,
  notice,
  onRegenerate,
  onClear,
  canRegenerate,
}: Props) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy — select the text and copy manually.");
    }
  };

  const exportTxt = () => {
    const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported as text file");
  };

  return (
    <section className="flex min-h-[26rem] flex-col rounded-xl border border-border bg-card">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">{title}</h2>
          {demo && (
            <Badge variant="outline" className="border-warning/50 text-warning">
              Demo mode
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={copy}
            disabled={!value}
            data-testid="action-copy"
          >
            <Copy className="size-4" /> Copy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={exportTxt}
            disabled={!value}
            data-testid="action-export"
          >
            <Download className="size-4" /> Export
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRegenerate}
            disabled={!canRegenerate || loading}
            data-testid="action-regenerate"
          >
            <RefreshCw className="size-4" /> Regenerate
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            disabled={!value && !error}
            data-testid="action-clear"
          >
            <Trash2 className="size-4" /> Clear
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col p-4">
        {loading ? (
          <div className="space-y-3" data-testid="output-loading">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : error ? (
          <div
            className="flex flex-1 flex-col items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4"
            data-testid="output-error"
          >
            <p className="flex items-center gap-2 text-sm font-medium text-destructive">
              <TriangleAlert className="size-4" /> {error}
            </p>
            <Button variant="outline" size="sm" onClick={onRegenerate} disabled={!canRegenerate}>
              <RefreshCw className="size-4" /> Try again
            </Button>
          </div>
        ) : value ? (
          <>
            {notice && (
              <p className="mb-3 rounded-md bg-warning/10 px-3 py-2 text-xs text-warning">
                {notice}
              </p>
            )}
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              spellCheck
              data-testid="output-text"
              aria-label={`${title} — editable result`}
              className="min-h-80 flex-1 resize-y bg-background/60 font-sans text-sm leading-relaxed"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Fully editable — refine the wording before you copy or export it.
            </p>
          </>
        ) : (
          <div
            className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-8 text-center"
            data-testid="output-empty"
          >
            <Sparkle className="size-6 text-primary" />
            <p className="text-sm font-medium">Nothing generated yet</p>
            <p className="max-w-xs text-xs text-muted-foreground">{emptyHint}</p>
          </div>
        )}
      </div>
    </section>
  );
}
