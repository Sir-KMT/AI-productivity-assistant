import { useServerFn } from "@tanstack/react-start";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import { runAi } from "@/lib/ai.functions";
import type { ToolId, ToolInput } from "@/lib/demo-content";

export function useAiTool(tool: ToolId) {
  const call = useServerFn(runAi);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);
  const [notice, setNotice] = useState<string | undefined>();
  const lastInput = useRef<ToolInput | null>(null);

  const run = useCallback(
    async (input: ToolInput) => {
      lastInput.current = input;
      setLoading(true);
      setError(null);
      try {
        const result = await call({ data: { tool, input } });
        setOutput(result.text);
        setDemo(result.demo);
        setNotice(result.notice);
        if (result.demo) toast.info("Demo mode response");
      } catch (e) {
        const message = e instanceof Error ? e.message : "Something went wrong. Please try again.";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [call, tool],
  );

  const regenerate = useCallback(() => {
    if (lastInput.current) void run(lastInput.current);
  }, [run]);

  const clear = useCallback(() => {
    setOutput("");
    setError(null);
    setNotice(undefined);
    lastInput.current = null;
  }, []);

  return {
    output,
    setOutput,
    loading,
    error,
    demo,
    notice,
    run,
    regenerate,
    clear,
    canRegenerate: lastInput.current !== null,
  };
}
