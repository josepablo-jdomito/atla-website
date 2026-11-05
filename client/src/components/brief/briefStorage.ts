import { z } from "zod";
import { BRIEF_QUESTIONS, type BriefContact, type BriefQuestion, type BriefState } from "@shared/brief";

/** A screen in the flow: a question from the bank or the contact form. */
export type BriefStep = BriefQuestion | { id: "contact" };

/**
 * The brief as the visitor left it. `path` is every screen shown so far, in
 * order and with the wording they saw; `index` is the screen they are on.
 * `calendlyUrl` is set once the brief was submitted.
 */
export type SavedBrief = BriefState & {
  submissionId: string;
  path: BriefStep[];
  index: number;
  calendlyUrl?: string;
};

const STORAGE_KEY = "atla-brief-v1";

/** `/brief?moment=<id>` (the Services page) pre-answers "What is the moment?" with one of its options. */
const MOMENT_PARAMS: Record<string, string> = {
  launch: "Launch",
  raise: "Raise capital",
  grow: "Grow / scale",
  reposition: "Reposition",
};
const MOMENT_OPTIONS = BRIEF_QUESTIONS.find((q) => q.id === "moment")?.options ?? [];

/** The moment option a `?moment=` value stands for; unknown values are ignored. */
export function momentFromParam(param: string | null | undefined): string | undefined {
  const option = param ? MOMENT_PARAMS[param.trim().toLowerCase()] : undefined;
  return option && MOMENT_OPTIONS.includes(option) ? option : undefined;
}

const contactSchema: z.ZodType<BriefContact> = z.object({
  name: z.string(),
  email: z.string(),
  company: z.string(),
  website: z.string(),
  phone: z.string(),
});

const stepSchema: z.ZodType<BriefStep> = z.union([
  z.object({
    id: z.string(),
    prompt: z.string(),
    kind: z.enum(["single", "multi", "text"]),
    options: z.array(z.string()).optional(),
  }),
  z.object({ id: z.literal("contact") }),
]);

const savedSchema = z.object({
  seed: z.string().optional(),
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
  contact: contactSchema.optional(),
  submissionId: z.string().min(1),
  path: z.array(stepSchema),
  index: z.number().int().min(0),
  calendlyUrl: z.string().optional(),
});

/** sessionStorage can be missing, blocked (Safari private mode, cookies off) or full: every access is guarded. */
function storage(): Storage | null {
  try {
    return typeof sessionStorage === "undefined" ? null : sessionStorage;
  } catch {
    return null;
  }
}

export function loadBrief(): SavedBrief | null {
  try {
    const raw = storage()?.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = savedSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return null;
    const saved = parsed.data as SavedBrief;
    // A brief with no screens has nothing to resume; an index past the end points at the last screen.
    if (saved.path.length === 0) return null;
    return { ...saved, index: Math.min(saved.index, saved.path.length - 1) };
  } catch {
    return null;
  }
}

export function saveBrief(brief: SavedBrief): void {
  try {
    storage()?.setItem(STORAGE_KEY, JSON.stringify(brief));
  } catch {
    // Storage full or blocked: the brief still works for this page view.
  }
}

export function clearBrief(): void {
  try {
    storage()?.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear when storage is unavailable.
  }
}
