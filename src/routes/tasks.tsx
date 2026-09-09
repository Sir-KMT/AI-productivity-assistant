import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Wand2 } from "lucide-react";
import { useState } from "react";

import { OutputPanel } from "@/components/output-panel";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAiTool } from "@/hooks/use-ai-tool";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Aperture AI" },
      {
        name: "description",
        content:
          "Turn any goal into a phased task plan with priorities, effort estimates and a suggested execution order.",
      },
      { property: "og:title", content: "AI Task Planner — Aperture AI" },
      {
        property: "og:description",
        content: "From a one-line goal to an ordered, prioritised plan.",
      },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const ai = useAiTool("tasks");
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [context, setContext] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;
    void ai.run({ goal, deadline, context });
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="Describe the outcome you want. You get phases, prioritised tasks, effort estimates and a sensible order to work through them."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <form
          onSubmit={submit}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
        >
          <div className="grid gap-2">
            <Label htmlFor="goal">Goal *</Label>
            <Input
              id="goal"
              required
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Launch the new onboarding flow"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="deadline">Deadline or timeframe</Label>
            <Input
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="End of next month"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="context">Context and constraints</Label>
            <Textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Two engineers available, no budget for new tools, legal review required."
              className="min-h-32"
            />
          </div>
          <Button type="submit" disabled={ai.loading || !goal.trim()} data-testid="submit-tasks">
            <Wand2 className="size-4" />
            {ai.loading ? "Planning…" : "Build plan"}
          </Button>
        </form>

        <OutputPanel
          title="Task plan"
          filename="task-plan.txt"
          emptyHint="Describe a goal on the left to generate a phased plan."
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
