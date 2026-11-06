import { describe, expect, it } from "vitest";
import Anthropic from "@anthropic-ai/sdk";
import { answerRuleBreak, tidyAnswerText } from "../../shared/ask.ts";
import { buildSystemPrompt } from "./context.ts";
import { DEFAULT_ASK_MODEL, generateWith } from "./model.ts";

describe("answerRuleBreak", () => {
  it("lets years and plain words through", () => {
    expect(answerRuleBreak("We built Acre's brand architecture in 2021 and still work with them.")).toBeNull();
    expect(answerRuleBreak("Most brands are built for the launch. We build them for the years after.")).toBeNull();
  });
  it.each([
    ["We quote $25k.", "number"],
    ["Prices start in the low thousands.", "count"],
    ["About eight weeks.", "duration"],
    ["We have done 40 projects.", "number"],
    ["Fees are in dollars.", "price"],
    ["We elevate brands.", "word"],
    ["A seamless rollout.", "word"],
  ])("%s → %s", (text, reason) => {
    expect(answerRuleBreak(text)).toBe(reason);
  });
  it.each([
    ["We usually start at fifty grand.", "price"],
    ["Think fifty k.", "price"],
    ["Budgets run to six figures.", "price"],
    ["We have done twenty projects.", "price"],
    ["Around １２３ pieces.", "number"],
    ["Around ٣٠٠ pieces.", "number"],
  ])("number written another way: %s", (text, reason) => {
    expect(answerRuleBreak(text)).toBe(reason);
  });
  it("lets full-width years and ordinary small number words through", () => {
    expect(answerRuleBreak("Built in ２０２１, with two ways in and one team.")).toBeNull();
    expect(answerRuleBreak("A bookshop with a good book list.")).toBeNull();
  });
  it("turns dashes into commas", () => {
    expect(tidyAnswerText("Yes — we do.")).toBe("Yes, we do.");
  });
});

describe("system prompt", () => {
  it("carries the rules, the site copy and the projects, and is stable for the same input", () => {
    const projects = [
      { slug: "b", title: "B", client: "Confidential", sector: "Food & Drink", disciplines: [], place: "", year: 2020, description: "", body: "" },
      { slug: "a", title: "A", client: "Acre", sector: "Hospitality & Travel", disciplines: ["Packaging"], place: "Mexico", year: 2023, description: "D", body: "Case" },
    ];
    const prompt = buildSystemPrompt(projects);
    expect(prompt).toBe(buildSystemPrompt([...projects].reverse()));
    expect(prompt).toContain("we quote after a short call");
    expect(prompt).toContain("about.title: Most brands are built for the launch.");
    expect(prompt.indexOf('<project slug="a">')).toBeLessThan(prompt.indexOf('<project slug="b">'));
    expect(prompt).toContain("never name it");
    expect(prompt).not.toMatch(/\d{2}:\d{2}/);
  });
});

describe("generateWith (mocked SDK)", () => {
  it("streams with Haiku, structured output, a cached system prompt and the visitor block as the only message", async () => {
    const calls: unknown[] = [];
    const events = [
      { type: "content_block_delta", delta: { type: "text_delta", text: '{"text":"Hi' } },
      { type: "content_block_delta", delta: { type: "text_delta", text: '","slugs":[],"links":[]}' } },
    ];
    const sdk = {
      messages: {
        stream: (params: unknown) => {
          calls.push(params);
          return {
            async *[Symbol.asyncIterator]() {
              yield* events;
            },
            finalMessage: async () => ({
              stop_reason: "end_turn",
              usage: { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 900, cache_creation_input_tokens: 0 },
            }),
          };
        },
      },
    } as unknown as Pick<Anthropic, "messages">;
    const chunks: string[] = [];
    const result = await generateWith(sdk, { system: "SYS", user: "<visitor>\n{}\n</visitor>", onText: (c) => chunks.push(c) });
    expect(result).toEqual({ raw: '{"text":"Hi","slugs":[],"links":[]}', stopReason: "end_turn", usage: { input: 10, output: 5, cacheRead: 900, cacheWrite: 0 } });
    expect(chunks).toHaveLength(2);
    const params = calls[0] as Record<string, any>;
    expect(params.model).toBe(DEFAULT_ASK_MODEL);
    expect(DEFAULT_ASK_MODEL).toBe("claude-haiku-5-5");
    expect(params.output_config.format.type).toBe("json_schema");
    expect(params.system[0].cache_control).toEqual({ type: "ephemeral" });
    expect(params.messages).toEqual([{ role: "user", content: "<visitor>\n{}\n</visitor>" }]);
  });
});
