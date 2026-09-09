export type ToolId = "email" | "meeting" | "tasks" | "research" | "chat";

export type ToolInput = Record<string, string>;

const wrap = (title: string, body: string) => `${title}\n\n${body.trim()}\n`;

export function demoResponse(tool: ToolId, input: ToolInput): string {
  switch (tool) {
    case "email": {
      const to = input.recipient || "the team";
      const topic = input.topic || "project update";
      const tone = input.tone || "professional";
      return wrap(
        `Subject: ${topic.charAt(0).toUpperCase() + topic.slice(1)} — next steps`,
        `Hi ${to},

I hope your week is going well. I wanted to share a short update on ${topic} and confirm the next steps on our side.

• Current status: on track, with the first milestone completed ahead of schedule.
• What we need from you: a quick confirmation of the timeline by Friday.
• What happens next: I'll circulate a revised plan and book a 30-minute review.

If a call would be easier than email, I'm happy to find a slot that works for you.

Best regards,
${input.sender || "Alex Morgan"}

(Demo sample — ${tone} tone, ${input.length || "medium"} length.)`,
      );
    }
    case "meeting":
      return wrap(
        "Meeting Summary",
        `Overview
The team reviewed delivery progress, agreed on scope for the next release, and resolved two open blockers.

Key Decisions
1. Ship the reporting module in the next release; defer bulk export.
2. Move the weekly sync to Tuesdays at 10:00.
3. Approve one additional contractor for the migration work.

Action Items
- Priya — finalise the reporting spec — due Thursday
- Daniel — unblock the staging environment — due tomorrow
- Sam — draft the customer comms plan — due next Monday

Risks & Follow-ups
- Data migration timing depends on vendor access, still unconfirmed.
- Support team needs training material before launch.

(Demo sample generated from your pasted notes.)`,
      );
    case "tasks":
      return wrap(
        `Plan: ${input.goal || "Launch the new workspace"}`,
        `Phase 1 — Discovery (Days 1-3)
1. [High] Define success metrics and scope — 2h
2. [High] Interview three stakeholders — 3h
3. [Med] Audit existing tooling — 2h

Phase 2 — Build (Days 4-9)
4. [High] Draft the implementation plan — 3h
5. [High] Set up the environment and access — 4h
6. [Med] Build the first working version — 2 days
7. [Low] Prepare internal documentation — 3h

Phase 3 — Launch (Days 10-12)
8. [High] Run a pilot with five users — 1 day
9. [Med] Collect feedback and fix top issues — 1 day
10. [Med] Announce and hand over — 2h

Suggested order: 1 → 2 → 4 → 5 → 6 → 8 → 9 → 3 → 7 → 10

(Demo sample plan — priority in brackets, effort estimated.)`,
      );
    case "research":
      return wrap(
        `Research Brief: ${input.question || "Market overview"}`,
        `Summary
The area is maturing quickly, with adoption concentrated among mid-sized teams that already run structured workflows. Cost and trust remain the two decisive factors in purchase decisions.

Key Findings
1. Buyers prioritise measurable time savings over feature breadth.
2. Integration with existing tools is the most common blocker.
3. Governance and data-handling questions now appear early in evaluations.

Considerations
- Evidence quality varies; treat figures as directional.
- Regional differences are significant and worth separate review.

Suggested Next Steps
- Validate the top two findings with primary interviews.
- Compare three shortlisted options against your own criteria.

(Demo sample — not sourced from live search. Verify before relying on it.)`,
      );
    case "chat":
      return `Here's how I'd approach that:

1. Clarify the outcome you want and who it's for.
2. Break the work into two or three concrete steps.
3. Decide what "done" looks like for each step.

Tell me a bit more about your constraints — timeline, people involved, or tools you already use — and I'll turn this into a specific plan.

_(Demo mode reply — connect AI to get live answers.)_`;
  }
}

export const SYSTEM_PROMPTS: Record<ToolId, string> = {
  email:
    "You are a professional workplace writing assistant. Write clear, well-structured emails. Always start with a 'Subject:' line. No preamble, no explanations — output only the email.",
  meeting:
    "You summarise meeting notes for busy professionals. Output sections: Overview, Key Decisions, Action Items (owner — task — due), Risks & Follow-ups. Be concise and factual; never invent names or dates that are not implied by the notes.",
  tasks:
    "You are a planning assistant. Turn a goal into a phased, ordered task plan with priorities and effort estimates. Output plain text with numbered tasks grouped into phases, plus a suggested execution order.",
  research:
    "You are a research assistant. Produce a structured brief: Summary, Key Findings (numbered), Considerations, Suggested Next Steps. You have no live web access — state uncertainty plainly and never fabricate citations, statistics, or sources.",
  chat: "You are an AI workplace productivity assistant. Be concise, practical and well-structured. Use markdown-light formatting (short paragraphs, bullets). Say when you are unsure.",
};

export function buildPrompt(tool: ToolId, input: ToolInput): string {
  switch (tool) {
    case "email":
      return `Write an email.
Recipient: ${input.recipient || "the team"}
Sender name: ${input.sender || "(omit signature name)"}
Topic / key points: ${input.topic}
Tone: ${input.tone || "professional"}
Length: ${input.length || "medium"}`;
    case "meeting":
      return `Summarise these meeting notes.\nMeeting: ${input.title || "(untitled)"}\n\nNotes:\n${input.notes}`;
    case "tasks":
      return `Goal: ${input.goal}
Deadline / timeframe: ${input.deadline || "not specified"}
Context and constraints: ${input.context || "none given"}`;
    case "research":
      return `Research question: ${input.question}
Depth: ${input.depth || "standard"}
Audience: ${input.audience || "internal team"}`;
    case "chat":
      return input.message ?? "";
  }
}
