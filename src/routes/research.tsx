import { createFileRoute } from "@tanstack/react-router";
import { Search, TriangleAlert, Wand2 } from "lucide-react";
import { useState } from "react";

import { OutputPanel } from "@/components/output-panel";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAiTool } from "@/hooks/use-ai-tool";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Aperture AI" },
      {
        name: "description",
        content:
          "Get a structured research brief with a summary, key findings, considerations and next steps for any work question.",
      },
      { property: "og:title", content: "AI Research Assistant — Aperture AI" },
      {
        property: "og:description",
        content: "Structured briefs for work questions, with uncertainty stated plainly.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const ai = useAiTool("research");
  const [question, setQuestion] = useState("");
  const [audience, setAudience] = useState("");
  const [depth, setDepth] = useState("standard");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    void ai.run({ question, audience, depth });
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        icon={Search}
        title="AI Research Assistant"
        description="Ask a work question and get a structured brief: summary, findings, considerations and next steps."
      />

      <p className="flex items-start gap-2 rounded-xl border border-warning/40 bg-warning/10 p-3 text-xs text-warning">
        <TriangleAlert className="mt-0.5 size-4 shrink-0" />
        No live web access. Findings reflect the model's general knowledge, may be out of date, and
        must be verified before you rely on them. Sources are never fabricated.
      </p>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <form
          onSubmit={submit}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
        >
          <div className="grid gap-2">
            <Label htmlFor="question">Research question *</Label>
            <Textarea
              id="question"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What should we consider before rolling out AI note-taking to our support team?"
              className="min-h-32"
            />
          </div>
          <div className="grid gap-2">
            <Label>Depth</Label>
            <Select value={depth} onValueChange={setDepth}>
              <SelectTrigger data-testid="select-depth">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["quick", "standard", "deep"].map((d) => (
                  <SelectItem key={d} value={d} className="capitalize">
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="audience">Audience</Label>
            <Input
              id="audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="Exec team"
            />
          </div>
          <Button
            type="submit"
            disabled={ai.loading || !question.trim()}
            data-testid="submit-research"
          >
            <Wand2 className="size-4" />
            {ai.loading ? "Researching…" : "Create brief"}
          </Button>
        </form>

        <OutputPanel
          title="Research brief"
          filename="research-brief.txt"
          emptyHint="Ask a question on the left to get a structured brief."
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
