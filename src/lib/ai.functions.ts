import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { SYSTEM_PROMPTS, buildPrompt, demoResponse, type ToolId } from "./demo-content";

const Schema = z.object({
  tool: z.enum(["email", "meeting", "tasks", "research", "chat"]),
  input: z.record(z.string()),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .optional(),
});

export type AiResult = { text: string; demo: boolean; notice?: string };

export const runAi = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Schema.parse(data))
  .handler(async ({ data }): Promise<AiResult> => {
    const tool = data.tool as ToolId;
    const key = process.env["LOVABLE_API_KEY"];

    if (!key) {
      return {
        text: demoResponse(tool, data.input),
        demo: true,
        notice: "No AI connection configured — showing a demo response.",
      };
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPTS[tool] },
      ...(data.history ?? []),
      { role: "user", content: buildPrompt(tool, data.input) },
    ];

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": key,
          "X-Lovable-AIG-SDK": "fetch",
        },
        body: JSON.stringify({ model: "google/gemini-3.8-flash", messages }),
      });

      if (!res.ok) {
        const body = await res.text();
        if (res.status === 429) {
          throw new Error("Too many requests right now. Please wait a moment and try again.");
        }
        if (res.status === 402 || res.status === 403) {
          return {
            text: demoResponse(tool, data.input),
            demo: true,
            notice: "AI credits or access are unavailable — showing a demo response instead.",
          };
        }
        throw new Error(`AI request failed (${res.status}). ${body.slice(0, 200)}`);
      }

      const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = json.choices?.[0]?.message?.content?.trim();
      if (!text) throw new Error("The AI returned an empty response. Try again.");
      return { text, demo: false };
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Something went wrong contacting the AI.");
    }
  });
