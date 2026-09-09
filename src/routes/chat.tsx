import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Download, MessagesSquare, SendHorizontal, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { runAi } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — Aperture AI Workplace Assistant" },
      {
        name: "description",
        content:
          "A multi-turn AI chat that remembers the conversation and helps you think through work problems step by step.",
      },
      { property: "og:title", content: "AI Chat — Aperture AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Multi-turn workplace assistant chat with full conversation context.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Help me prioritise my week",
  "How do I say no to a meeting politely?",
  "Draft an agenda for a project kickoff",
  "Summarise how to run a retrospective",
];

function ChatPage() {
  const call = useServerFn(runAi);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [demo, setDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const history = messages;
    setMessages([...history, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const result = await call({
        data: { tool: "chat", input: { message: trimmed }, history },
      });
      setDemo(result.demo);
      setMessages((prev) => [...prev, { role: "assistant", content: result.text }]);
    } catch (e) {
      const message = e instanceof Error ? e.message : "The assistant could not reply.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const exportChat = () => {
    const text = messages
      .map((m) => `${m.role === "user" ? "You" : "Assistant"}:\n${m.content}`)
      .join("\n\n---\n\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "conversation.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Conversation exported");
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <PageHeader
        icon={MessagesSquare}
        title="AI Chat"
        description="A multi-turn assistant that keeps the whole conversation in context. Ask follow-ups — it remembers what you said."
      />

      <section className="flex flex-col rounded-xl border border-border bg-card">
        <header className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold">Conversation</h2>
            {demo && (
              <Badge variant="outline" className="border-warning/50 text-warning">
                Demo mode
              </Badge>
            )}
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={exportChat}
              disabled={!messages.length}
              data-testid="chat-export"
            >
              <Download className="size-4" /> Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setMessages([]);
                setError(null);
              }}
              disabled={!messages.length}
              data-testid="chat-clear"
            >
              <Trash2 className="size-4" /> Clear
            </Button>
          </div>
        </header>

        <div className="flex min-h-[24rem] flex-col gap-4 overflow-y-auto p-4" aria-live="polite">
          {messages.length === 0 && !loading ? (
            <div
              className="flex flex-1 flex-col items-center justify-center gap-3 text-center"
              data-testid="chat-empty"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Bot className="size-5" />
              </div>
              <p className="text-sm font-medium">Ask me anything about your work</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <Button key={s} variant="outline" size="sm" onClick={() => void send(s)}>
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                    <Bot className="size-4" />
                  </div>
                )}
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[80%] whitespace-pre-wrap rounded-xl bg-primary px-3.5 py-2.5 text-sm leading-relaxed text-primary-foreground"
                      : "max-w-[85%] whitespace-pre-wrap text-sm leading-relaxed text-foreground"
                  }
                >
                  {m.content}
                </div>
                {m.role === "user" && (
                  <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary">
                    <User className="size-4" />
                  </div>
                )}
              </div>
            ))
          )}

          {loading && (
            <div className="flex gap-3" data-testid="chat-loading">
              <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                <Bot className="size-4" />
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-3/4" />
              </div>
            </div>
          )}

          {error && (
            <p
              className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              data-testid="chat-error"
            >
              {error}
            </p>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="flex items-end gap-2 border-t border-border p-3"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            placeholder="Ask a question… (Enter to send, Shift+Enter for a new line)"
            aria-label="Message"
            data-testid="chat-input"
            className="min-h-11 max-h-40 flex-1 resize-none"
          />
          <Button
            type="submit"
            size="icon"
            disabled={loading || !input.trim()}
            aria-label="Send message"
            data-testid="chat-send"
          >
            <SendHorizontal className="size-4" />
          </Button>
        </form>
      </section>

      <p className="text-xs text-muted-foreground">
        Replies are AI-generated and may be inaccurate. This conversation lives in your browser only
        and is lost when you refresh.
      </p>
    </div>
  );
}
