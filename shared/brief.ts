import { z } from "zod";

export type BriefContact = { name: string; email: string; company: string; website: string; phone: string };
export type BriefState = {
  seed?: string;
  answers: Record<string, string | string[]>;
  contact?: BriefContact;
};
export type BriefQuestion = { id: string; prompt: string; kind: "single" | "multi" | "text"; options?: string[] };

export const BRIEF_QUESTIONS: BriefQuestion[] = [
  { id: "building", prompt: "What are you building?", kind: "text" },
  {
    id: "industry",
    prompt: "Which world is it in?",
    kind: "single",
    options: ["Hospitality", "Consumer / CPG", "Tech / startup", "Real estate / lifestyle", "Other"],
  },
  { id: "stage", prompt: "Where is it today?", kind: "single", options: ["Idea", "Pre-launch", "Launched", "Established"] },
  {
    id: "moment",
    prompt: "What is the moment?",
    kind: "single",
    options: ["Launch", "Raise capital", "Grow / scale", "Reposition"],
  },
  {
    id: "deliverables",
    prompt: "What do you need from us?",
    kind: "multi",
    options: ["Naming", "Identity", "Packaging", "Website", "Motion", "Campaign", "Not sure"],
  },
  { id: "timing", prompt: "When do you want to start?", kind: "single", options: ["This month", "1–3 months", "3–6 months", "Exploring"] },
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

/** The seed counts as the answer to `building` when it was not copied into answers. */
function hasAnswer(state: BriefState, id: string): boolean {
  if (isAnswered(state.answers[id])) return true;
  return id === "building" && isAnswered(state.seed);
}

export function nextFixedQuestion(state: BriefState): BriefQuestion | { id: "contact" } | { id: "done" } {
  for (const q of BRIEF_QUESTIONS) if (!hasAnswer(state, q.id)) return q;
  return state.contact && briefContactSchema.safeParse(state.contact).success ? { id: "done" } : { id: "contact" };
}

export function isComplete(state: BriefState): boolean {
  return (
    hasAnswer(state, "building") &&
    hasAnswer(state, "moment") &&
    !!state.contact &&
    briefContactSchema.safeParse(state.contact).success
  );
}
