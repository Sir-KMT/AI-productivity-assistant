import { createFileRoute } from "@tanstack/react-router";
import { FileText, Wand2 } from "lucide-react";
import { useState } from "react";

import { OutputPanel } from "@/components/output-panel";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAiTool } from "@/hooks/use-ai-tool";

const SAMPLE = `Standup 14 May. Priya: reporting module 80% done, blocked on staging creds.
Daniel: will get staging creds from IT today.
Sam: customer comms not started, needs the launch date.
Decision: ship reporting next release, defer bulk export.
Decision: weekly sync moves to Tuesday 10:00.
Risk: vendor access for data migration still unconfirmed.`;

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Aperture AI" },
      {
        name: "description",
        content:
          "Paste messy meeting notes and get a clean summary with decisions, owners, due dates and follow-up risks.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Aperture AI" },
      {
        property: "og:description",
        content: "Decisions, action items and risks extracted from raw notes.",
      },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const ai = useAiTool("meeting");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;
    void ai.run({ title, notes });
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Paste raw notes or a transcript. You get an overview, the decisions made, action items with owners, and open risks."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <form
          onSubmit={submit}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
        >
          <div className="grid gap-2">
            <Label htmlFor="title">Meeting name</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Weekly delivery sync"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes or transcript *</Label>
            <Textarea
              id="notes"
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste anything — bullet points, chat log, transcript…"
              className="min-h-56"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              disabled={ai.loading || !notes.trim()}
              data-testid="submit-meeting"
            >
              <Wand2 className="size-4" />
              {ai.loading ? "Summarizing…" : "Summarize notes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setNotes(SAMPLE)}
              data-testid="load-sample"
            >
              Use sample notes
            </Button>
          </div>
        </form>

        <OutputPanel
          title="Summary"
          filename="meeting-summary.txt"
          emptyHint="Paste your notes on the left, then summarize them."
          value={ai.output}
          onChange={ai.setOutput}
          loading={ai.loading}
          error={ai.error}
          demo={ai.demo}
          notice={ai.notice}
          onRegenerate={ai.regenerate}
          onClear={ai.clear}
          canRegenerate={ai.canRegenerate}
        />
      </div>
    </div>
  );
}
