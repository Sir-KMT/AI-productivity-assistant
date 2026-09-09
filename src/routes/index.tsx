import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/lib/tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Aperture AI Workplace Assistant" },
      {
        name: "description",
        content:
          "One dashboard for AI email drafting, meeting summaries, task planning, research briefs and multi-turn chat.",
      },
      { property: "og:title", content: "Dashboard — Aperture AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Five AI workplace tools in a single focused dark workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const STATS = [
  { label: "Tools ready", value: "5", icon: Zap },
  { label: "Avg. draft time", value: "8s", icon: Clock },
  { label: "Outputs editable", value: "100%", icon: Sparkles },
  { label: "Human review", value: "Always", icon: ShieldCheck },
];

function Dashboard() {
  const tools = NAV_ITEMS.filter((item) => item.to !== "/");

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageHeader
        icon={Sparkles}
        title="Your AI workspace"
        description="Draft, summarize, plan and research without leaving one place. Every result is editable, copyable and exportable — and always yours to review."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <stat.icon className="size-4 text-primary" />
            <p className="mt-3 font-display text-2xl font-semibold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Tools</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              data-testid={`card-${tool.to.slice(1)}`}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/60"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <tool.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{tool.title}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{tool.blurb}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Open
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-semibold">How this assistant behaves</h2>
          <Badge variant="outline" className="border-primary/50 text-primary">
            Responsible AI
          </Badge>
        </div>
        <ul className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
          <li>• Results are generated suggestions, not verified facts — review before sending.</li>
          <li>• The research assistant has no live web access and never invents sources.</li>
          <li>• Nothing you type is stored on a server; your work stays in this session.</li>
          <li>
            • If no AI connection is configured, tools run in clearly labelled Demo Mode with
            realistic sample output.
          </li>
        </ul>
        <Button asChild className="mt-4">
          <Link to="/chat">
            Start with chat <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
