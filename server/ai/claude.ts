import Anthropic from "@anthropic-ai/sdk";
import { reserveAiCall } from "../limits/guards.ts";

/**
 * The one place the server talks to Claude. Server-only: the key never leaves
 * this process.
 *
 * Structured output comes from a single strict tool: the model is told to
 * answer only through it, and the tool's input is returned as the result.
 * (Current models reject a forced tool_choice, so it stays "auto".)
 *
 * Returns null, never throws, when there is no key, the monthly budget is
 * spent, the AI is off (production without Upstash), the call times out
 * (8 s, no retries) or errors, or the model does not call the tool. Callers
 * fall back to their non-AI path on null.
 */

const DEFAULT_MODEL = "claude-sonnet-5-5";
const TIMEOUT_MS = 8_000;
const DEFAULT_MAX_TOKENS = 1024;

export type ClaudeJsonOptions = {
  system: string;
  user: string;
  /** JSON Schema for the tool input; an object schema with `required` and `additionalProperties: false`. */
  schema: object;
  toolName: string;
  maxTokens?: number;
};

/**
 * For visitor text serialised as JSON inside a `<visitor>` block: `<` and `>` become \u003c and
 * \u003e, which still decode to the same characters as JSON but can never form a closing tag.
 */
export const escapeAngles = (json: string) => json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e");

let client: Anthropic | null = null;
let clientKey = "";

function getClient(apiKey: string) {
  if (!client || clientKey !== apiKey) {
    client = new Anthropic({ apiKey, timeout: TIMEOUT_MS, maxRetries: 0 });
    clientKey = apiKey;
  }
  return client;
}

export async function callClaudeJson<T>(opts: ClaudeJsonOptions): Promise<T | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY || "";
  if (!apiKey) return null;
  // One atomic check-and-count before the request: a call that times out or errors still costs.
  if (!(await reserveAiCall())) return null;

  try {
    const response = await getClient(apiKey).messages.create({
      model: process.env.ATLA_AI_MODEL || DEFAULT_MODEL,
      max_tokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
      output_config: { effort: "low" },
      system: `${opts.system}\n\nAnswer only by calling the ${opts.toolName} tool, exactly once.`,
      messages: [{ role: "user", content: opts.user }],
      tools: [
        {
          name: opts.toolName,
          description: `Record the answer as ${opts.toolName}.`,
          input_schema: opts.schema as Anthropic.Tool.InputSchema,
          strict: true,
        },
      ],
      tool_choice: { type: "auto", disable_parallel_tool_use: true },
    });

    const toolUse = response.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === "tool_use" && block.name === opts.toolName,
    );
    if (!toolUse) {
      console.error(`[ai] ${opts.toolName}: no tool call (stop_reason ${response.stop_reason})`);
      return null;
    }
    return toolUse.input as T;
  } catch (err) {
    if (err instanceof Anthropic.APIConnectionTimeoutError) {
      console.error(`[ai] ${opts.toolName}: timed out after ${TIMEOUT_MS} ms`);
    } else if (err instanceof Anthropic.APIError) {
      console.error(`[ai] ${opts.toolName}: API error ${err.status ?? "unknown"} ${err.name}`);
    } else {
      console.error(`[ai] ${opts.toolName}: ${err instanceof Error ? err.name : "unknown error"}`);
    }
    return null;
  }
}
