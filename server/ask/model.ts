import Anthropic from "@anthropic-ai/sdk";
import { ASK_OUTPUT_SCHEMA } from "../../shared/ask.ts";

/**
 * The one place Ask talks to Claude. Server-only: ANTHROPIC_API_KEY is read here and nowhere else in
 * the Ask path, and never leaves this process.
 *
 * Claude Haiku 5.5 by default (cost); ATLA_ASK_MODEL overrides it (claude-sonnet-5-5 if Haiku's answers
 * read badly). Structured output (a JSON schema) shapes the answer; the system prompt carries a cache
 * breakpoint, so the site and the projects are read from the cache after the first ask.
 */

export const DEFAULT_ASK_MODEL = "claude-haiku-5-5";
// Two attempts must fit inside the function's 30 s (vercel.json maxDuration).
const TIMEOUT_MS = 12_000;
const MAX_TOKENS = 1024;

export type AskUsage = { input: number; output: number; cacheRead: number; cacheWrite: number };
export type GenerateResult = { raw: string; stopReason: string | null; usage: AskUsage };
export type GenerateOptions = {
  system: string;
  user: string;
  /** Each piece of raw model text (JSON) as it arrives. */
  onText: (chunk: string) => void;
  signal?: AbortSignal;
};
export type Generate = (opts: GenerateOptions) => Promise<GenerateResult>;

export const askApiKey = () => process.env.ANTHROPIC_API_KEY || "";

let client: Anthropic | null = null;
let clientKey = "";

function getClient(apiKey: string) {
  if (!client || clientKey !== apiKey) {
    client = new Anthropic({ apiKey, timeout: TIMEOUT_MS, maxRetries: 0 });
    clientKey = apiKey;
  }
  return client;
}

/** Exported for tests: the stream call against any client with the SDK's `messages.stream`. */
export async function generateWith(sdk: Pick<Anthropic, "messages">, opts: GenerateOptions): Promise<GenerateResult> {
  const stream = sdk.messages.stream(
    {
      model: process.env.ATLA_ASK_MODEL || DEFAULT_ASK_MODEL,
      max_tokens: MAX_TOKENS,
      output_config: { effort: "low", format: { type: "json_schema", schema: ASK_OUTPUT_SCHEMA as unknown as Record<string, unknown> } },
      system: [{ type: "text", text: opts.system, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: opts.user }],
    },
    { signal: opts.signal },
  );
  let raw = "";
  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      raw += event.delta.text;
      opts.onText(event.delta.text);
    }
  }
  const message = await stream.finalMessage();
  return {
    raw,
    stopReason: message.stop_reason ?? null,
    usage: {
      input: message.usage.input_tokens ?? 0,
      output: message.usage.output_tokens ?? 0,
      cacheRead: message.usage.cache_read_input_tokens ?? 0,
      cacheWrite: message.usage.cache_creation_input_tokens ?? 0,
    },
  };
}

export const generateAnswer: Generate = (opts) => generateWith(getClient(askApiKey()), opts);
