import { describe, expect, it } from "vitest";
import {
  BRIEF_QUESTIONS,
  BRIEF_QUESTION_IDS,
  briefContactSchema,
  isComplete,
  nextFixedQuestion,
  type BriefState,
} from "./brief.ts";

const contact = { name: "Ana Ruiz", email: "ana@example.com", company: "", website: "", phone: "" };

describe("brief question bank", () => {
  it("walks the fixed bank in order", () => {
    const state: BriefState = { answers: {} };
    const seen: string[] = [];
    for (let i = 0; i < 10; i++) {
      const q = nextFixedQuestion(state);
      seen.push(q.id);
      if (q.id === "contact" || q.id === "done") break;
      const full = BRIEF_QUESTIONS.find((b) => b.id === q.id)!;
      state.answers[q.id] = full.kind === "multi" ? [full.options![0]] : full.kind === "single" ? full.options![0] : "A hotel";
    }
    expect(seen).toEqual(["building", "industry", "stage", "moment", "deliverables", "timing", "contact"]);
    expect(BRIEF_QUESTION_IDS).toEqual(["building", "industry", "stage", "moment", "deliverables", "timing", "contact"]);
    expect(nextFixedQuestion({ ...state, contact })).toEqual({ id: "done" });
  });

  it("skips building when seed is present", () => {
    const q = nextFixedQuestion({ seed: "A boutique hotel in Tulum", answers: { building: "A boutique hotel in Tulum" } });
    expect(q.id).toBe("industry");
    expect(nextFixedQuestion({ seed: "A boutique hotel", answers: {} }).id).toBe("industry");
  });

  it("never asks budget", () => {
    expect(BRIEF_QUESTION_IDS.some((id) => /budget|price|cost/i.test(id))).toBe(false);
    const text = JSON.stringify(BRIEF_QUESTIONS);
    expect(text).not.toMatch(/budget|price|cost|\$/i);
  });

  it("uses the exact option labels", () => {
    const timing = BRIEF_QUESTIONS.find((q) => q.id === "timing")!;
    expect(timing.options).toEqual(["This month", "1–3 months", "3–6 months", "Exploring"]);
  });

  it("isComplete requires building, moment, name, email", () => {
    const base: BriefState = { answers: { building: "A hotel", moment: "Launch" }, contact };
    expect(isComplete(base)).toBe(true);
    expect(isComplete({ ...base, answers: { moment: "Launch" } })).toBe(false);
    expect(isComplete({ ...base, answers: { building: "A hotel" } })).toBe(false);
    expect(isComplete({ ...base, contact: { ...contact, name: "" } })).toBe(false);
    expect(isComplete({ ...base, contact: { ...contact, email: "nope" } })).toBe(false);
    expect(isComplete({ ...base, contact: undefined })).toBe(false);
  });

  it("briefContactSchema trims and bounds fields", () => {
    const ok = briefContactSchema.parse({ name: "  Ana ", email: " ana@example.com " });
    expect(ok).toEqual({ name: "Ana", email: "ana@example.com", company: "", website: "", phone: "" });
    expect(briefContactSchema.safeParse({ name: "x".repeat(121), email: "a@b.co" }).success).toBe(false);
    expect(briefContactSchema.safeParse({ name: "A", email: "a@b.co" + "x".repeat(200) }).success).toBe(false);
  });
});
