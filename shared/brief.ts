import { z } from "zod";

export type BriefContact = { name: string; email: string; company: string; website: string; phone: string };
export type BriefState = {
  seed?: string;
  answers: Record<string, string | string[]>;
  contact?: BriefContact;
};
/** An option on screen: `label` is what the visitor reads, `value` is what is stored and sent. */
export type BriefOption = { value: string; label: string };
/** `name` is the semantic name of the question (stable `id`s are for analytics, like the waitlist's q1..q5). */
export type BriefQuestion = { id: string; name?: string; prompt: string; kind: "single" | "multi" | "text"; options?: BriefOption[] };

/**
 * The same five questions as start.atla.design/waitlist (atla-start, src/lib/quiz/definitions/waitlist.ts):
 * same wording, same labels, same values (waitlist-scoring.ts), so Attio and GA stay comparable.
 * The budget ranges are the one place on the site where dollar figures are allowed.
 */
export const BRIEF_QUESTIONS: BriefQuestion[] = [
  {
    id: "q1",
    name: "brand_cost",
    prompt: "What's your brand actually costing you right now?",
    kind: "single",
    options: [
      { value: "lost_deals", label: "Lost deals. Clients can't see what we're worth." },
      { value: "wrong_audience", label: "Wrong audience. We attract the people we don't want." },
      { value: "inconsistent", label: "Inconsistent execution. Every touchpoint feels different." },
      { value: "stalled", label: "Stalled growth. We've outgrown what we built." },
      { value: "not_sure", label: "Honestly not sure. That's why I'm here." },
    ],
  },
  {
    id: "q2",
    name: "stage",
    prompt: "Where is your business today?",
    kind: "single",
    options: [
      { value: "pre_launch", label: "Pre-launch. Building the foundation." },
      { value: "launched", label: "Launched. Finding traction." },
      { value: "scaling", label: "Established. Growing and ready to scale." },
      { value: "plateau", label: "Established. Plateaued and need a new chapter." },
      { value: "project_specific", label: "Project-specific (rebrand, sub-brand, naming, strategic refresh)." },
    ],
  },
  {
    id: "q3",
    name: "differentiation",
    prompt: "Can you explain what makes your brand different in one sentence?",
    kind: "single",
    options: [
      { value: "yes_easily", label: "Yes, easily." },
      { value: "sort_of", label: "Sort of. It shifts depending on who I'm talking to." },
      { value: "no", label: "No, and that's part of the problem." },
    ],
  },
  {
    id: "q4",
    name: "budget",
    prompt: "What's your investment range for this?",
    kind: "single",
    options: [
      { value: "5_15k", label: "$5K \u2013 $15K" },
      { value: "15_35k", label: "$15K \u2013 $35K" },
      { value: "35_75k", label: "$35K \u2013 $75K" },
      { value: "75k_plus", label: "$75K+" },
    ],
  },
  {
    id: "q5",
    name: "timeline",
    prompt: "When do you want this live?",
    kind: "single",
    options: [
      { value: "30_days", label: "In the next 30 days." },
      { value: "1_3_months", label: "1 \u2013 3 months." },
      { value: "3_6_months", label: "3 \u2013 6 months." },
      { value: "no_timeline", label: "No fixed timeline." },
    ],
  },
];

/** Ordered ids of the whole flow, including the contact step. */
export const BRIEF_QUESTION_IDS: string[] = [...BRIEF_QUESTIONS.map((q) => q.id), "contact"];

const optionalText = (max: number) => z.string().trim().max(max).optional().default("");

export const briefContactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  company: optionalText(200),
  website: optionalText(300),
  phone: optionalText(60),
});

function isAnswered(value: string | string[] | undefined): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === "string" && value.trim().length > 0;
}

export function nextFixedQuestion(state: BriefState): BriefQuestion | { id: "contact" } | { id: "done" } {
  for (const q of BRIEF_QUESTIONS) if (!isAnswered(state.answers[q.id])) return q;
  return state.contact && briefContactSchema.safeParse(state.contact).success ? { id: "done" } : { id: "contact" };
}

export function isComplete(state: BriefState): boolean {
  return (
    BRIEF_QUESTIONS.every((q) => isAnswered(state.answers[q.id])) &&
    !!state.contact &&
    briefContactSchema.safeParse(state.contact).success
  );
}

/** The label of a stored answer value (a label when the value is not one of the question's options). */
export function optionLabel(question: BriefQuestion | undefined, value: string): string {
  return question?.options?.find((o) => o.value === value)?.label ?? value;
}
