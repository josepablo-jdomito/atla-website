import { describe, expect, it } from "vitest";
import {
  BRIEF_QUESTIONS,
  BRIEF_QUESTION_IDS,
  briefContactSchema,
  isComplete,
  nextFixedQuestion,
  optionLabel,
  type BriefState,
} from "./brief.ts";

const contact = { name: "Ana Ruiz", email: "ana@example.com", company: "", website: "", phone: "" };

// Copied from atla-start src/lib/quiz/definitions/waitlist.ts and waitlist-scoring.ts (2026-11-05).
const WAITLIST: { id: string; name: string; prompt: string; options: [string, string][] }[] = [
  {
    id: "q1",
    name: "brand_cost",
    prompt: "What's your brand actually costing you right now?",
    options: [
      ["lost_deals", "Lost deals. Clients can't see what we're worth."],
      ["wrong_audience", "Wrong audience. We attract the people we don't want."],
      ["inconsistent", "Inconsistent execution. Every touchpoint feels different."],
      ["stalled", "Stalled growth. We've outgrown what we built."],
      ["not_sure", "Honestly not sure. That's why I'm here."],
    ],
  },
  {
    id: "q2",
    name: "stage",
    prompt: "Where is your business today?",
    options: [
      ["pre_launch", "Pre-launch. Building the foundation."],
      ["launched", "Launched. Finding traction."],
      ["scaling", "Established. Growing and ready to scale."],
      ["plateau", "Established. Plateaued and need a new chapter."],
      ["project_specific", "Project-specific (rebrand, sub-brand, naming, strategic refresh)."],
    ],
  },
  {
    id: "q3",
    name: "differentiation",
    prompt: "Can you explain what makes your brand different in one sentence?",
    options: [
      ["yes_easily", "Yes, easily."],
      ["sort_of", "Sort of. It shifts depending on who I'm talking to."],
      ["no", "No, and that's part of the problem."],
    ],
  },
  {
    id: "q4",
    name: "budget",
    prompt: "What's your investment range for this?",
    options: [
      ["5_15k", "$5K \u2013 $15K"],
      ["15_35k", "$15K \u2013 $35K"],
      ["35_75k", "$35K \u2013 $75K"],
      ["75k_plus", "$75K+"],
    ],
  },
  {
    id: "q5",
    name: "timeline",
    prompt: "When do you want this live?",
    options: [
      ["30_days", "In the next 30 days."],
      ["1_3_months", "1 \u2013 3 months."],
      ["3_6_months", "3 \u2013 6 months."],
      ["no_timeline", "No fixed timeline."],
    ],
  },
];

const fullAnswers = (): BriefState["answers"] =>
  Object.fromEntries(BRIEF_QUESTIONS.map((q) => [q.id, q.options![0].value]));

describe("brief question bank", () => {
  it("is the waitlist's five questions: ids q1..q5, all single-select, exact wording, labels and values", () => {
    expect(BRIEF_QUESTIONS.map((q) => q.id)).toEqual(["q1", "q2", "q3", "q4", "q5"]);
    expect(BRIEF_QUESTIONS.every((q) => q.kind === "single")).toBe(true);
    expect(
      BRIEF_QUESTIONS.map((q) => ({
        id: q.id,
        name: q.name,
        prompt: q.prompt,
        options: q.options!.map((o): [string, string] => [o.value, o.label]),
      })),
    ).toEqual(WAITLIST);
  });

  it("walks the five questions in order, then contact, then done", () => {
    const state: BriefState = { answers: {} };
    const seen: string[] = [];
    for (let i = 0; i < 10; i++) {
      const q = nextFixedQuestion(state);
      seen.push(q.id);
      if (q.id === "contact" || q.id === "done") break;
      state.answers[q.id] = BRIEF_QUESTIONS.find((b) => b.id === q.id)!.options![0].value;
    }
    expect(seen).toEqual(["q1", "q2", "q3", "q4", "q5", "contact"]);
    expect(BRIEF_QUESTION_IDS).toEqual(["q1", "q2", "q3", "q4", "q5", "contact"]);
    expect(nextFixedQuestion({ ...state, contact })).toEqual({ id: "done" });
  });

  it("a seed answers nothing", () => {
    expect(nextFixedQuestion({ seed: "Like Casa Mar", answers: {} }).id).toBe("q1");
  });

  it("dollar figures live only in the budget question", () => {
    for (const q of BRIEF_QUESTIONS.filter((q) => q.id !== "q4")) {
      expect(JSON.stringify(q)).not.toMatch(/\$|\d+\s?k\b/i);
    }
    expect(BRIEF_QUESTIONS.find((q) => q.id === "q4")!.options!.map((o) => o.label)).toEqual([
      "$5K \u2013 $15K",
      "$15K \u2013 $35K",
      "$35K \u2013 $75K",
      "$75K+",
    ]);
  });

  it("no em dashes in any prompt or label", () => {
    expect(JSON.stringify(BRIEF_QUESTIONS)).not.toContain("\u2014");
  });

  it("optionLabel turns a stored value into the label the visitor saw", () => {
    const q4 = BRIEF_QUESTIONS.find((q) => q.id === "q4");
    expect(optionLabel(q4, "35_75k")).toBe("$35K \u2013 $75K");
    expect(optionLabel(q4, "other")).toBe("other");
    expect(optionLabel(undefined, "x")).toBe("x");
  });

  it("isComplete requires the five answers, name and email", () => {
    const base: BriefState = { answers: fullAnswers(), contact };
    expect(isComplete(base)).toBe(true);
    expect(isComplete({ ...base, answers: { ...base.answers, q4: "" } })).toBe(false);
    expect(isComplete({ ...base, answers: { q1: "stalled" } })).toBe(false);
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
