import { createFileRoute } from "@tanstack/react-router";
import { Mail, Wand2 } from "lucide-react";
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

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Aperture AI" },
      {
        name: "description",
        content:
          "Generate professional, on-tone workplace emails from a few key points, then edit, copy or export the draft.",
      },
      { property: "og:title", content: "Smart Email Generator — Aperture AI" },
      {
        property: "og:description",
        content: "Turn bullet points into a polished email draft in seconds.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const ai = useAiTool("email");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    void ai.run({ recipient, sender, topic, tone, length });
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Give the key points and the tone. You get a complete, ready-to-edit draft with a subject line."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <form
          onSubmit={submit}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
        >
          <div className="grid gap-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Priya, Head of Ops"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="topic">Key points *</Label>
            <Textarea
              id="topic"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ask for approval on the Q3 budget, mention the two new hires, propose a call Thursday."
              className="min-h-32"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger data-testid="select-tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["professional", "friendly", "direct", "persuasive", "apologetic"].map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger data-testid="select-length">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["short", "medium", "detailed"].map((l) => (
                    <SelectItem key={l} value={l} className="capitalize">
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sender">Sign-off name</Label>
            <Input
              id="sender"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="Alex Morgan"
            />
          </div>
          <Button type="submit" disabled={ai.loading || !topic.trim()} data-testid="submit-email">
            <Wand2 className="size-4" />
            {ai.loading ? "Writing…" : "Generate email"}
          </Button>
        </form>

        <OutputPanel
          title="Email draft"
          filename="email-draft.txt"
          emptyHint="Add your key points on the left and generate a draft."
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
