import { z } from "zod";

/**
 * Ask: the concierge mode of the Explore pill (JP, 2026-11-06, after Little Plains' global chat).
 * Shared by the route (server/ask) and the panel (client/src/components/site/AskPanel.tsx).
 *
 * The visitor sends the last turns; the server answers with a short caption, pieces from the wall
 * (by slug) and at most two page links, streamed as server-sent events.
 */

/** Turns sent per ask, the question included. */
export const ASK_MAX_TURNS = 8;
/** Characters per turn. The field stops there too. */
export const ASK_MAX_CHARS = 500;
/** Pieces of work one answer may show. */
export const ASK_MAX_PIECES = 6;
/** Page links one answer may carry. */
export const ASK_MAX_LINKS = 2;

export type AskRole = "visitor" | "atla";

export const askRequestSchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["visitor", "atla"]), text: z.string().trim().min(1).max(ASK_MAX_CHARS) }))
    .min(1)
    .max(ASK_MAX_TURNS)
    .refine((turns) => turns[turns.length - 1]?.role === "visitor", { message: "The last turn is the question" }),
  idempotencyKey: z.string().regex(/^[A-Za-z0-9-]{8,64}$/),
});
export type AskRequest = z.infer<typeof askRequestSchema>;

/**
 * The only pages an answer may point to. The model picks an href; the label always comes from here,
 * so it can never write its own link text or point anywhere else.
 */
export const ASK_LINKS = {
  "/brief": "Start a project",
  "/brand-check": "Brand check",
  "/services": "Services",
  "/services?moment=launch": "Services for a launch",
  "/services?moment=raise": "Services before a raise",
  "/services?moment=grow": "Services while you grow",
  "/services?moment=reposition": "Services for a reposition",
  "/about": "Why Atla",
  "/ventures": "Ventures",
} as const satisfies Record<string, string>;
export type AskHref = keyof typeof ASK_LINKS;
export const ASK_HREFS = Object.keys(ASK_LINKS) as AskHref[];

export type AskLink = { label: string; href: AskHref };
export type AskAnswer = { text: string; slugs: string[]; links: AskLink[] };

/** What the model must return (structured output). Links are hrefs only; labels are ours. */
export const ASK_OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    text: { type: "string" },
    slugs: { type: "array", items: { type: "string" } },
    links: { type: "array", items: { type: "string", enum: ASK_HREFS } },
  },
  required: ["text", "slugs", "links"],
  additionalProperties: false,
} as const;

export const askModelOutputSchema = z.object({
  text: z.string().trim().min(1).max(1200),
  slugs: z.array(z.string()).max(20),
  links: z.array(z.string()).max(10),
});

/** Server-sent events on POST /api/ask, one JSON object per `data:` line. */
export type AskEvent =
  | { type: "delta"; text: string }
  /** The text streamed so far is withdrawn (it broke a rule); a second answer follows. */
  | { type: "reset" }
  | { type: "done"; answer: AskAnswer }
  | { type: "error"; message: string };

/** The words the site never uses (VIGENTE, atla.design). */
export const BANNED_WORDS = [
  "elevate",
  "authentic",
  "game-changer",
  "game changer",
  "next level",
  "next-level",
  "synergy",
  "leverage",
  "robust",
  "seamless",
  "journey",
  "vibrant",
  "delve",
  "landscape",
  "tapestry",
  "testament",
  "unlock",
];

const YEAR = /^(19|20)\d\d$/;
/**
 * Number words that carry a price or a count as surely as digits do. "one" to "ten" stay allowed
 * (they are ordinary prose: "two ways in"); teens, tens, "grand", "figures" and "<word> k" are not.
 */
const NUMBER_WORDS =
  /\b(eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|grand|figures?)\b|\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred)\s?k\b/i;

/**
 * Why an answer cannot be shown as written, or null when it can. The site's rule: no numbers, counts,
 * prices or durations (years are fine), none of the banned words. An em dash is not a reason; the
 * server swaps it for a comma (`tidyAnswerText`).
 */
export function answerRuleBreak(text: string): string | null {
  const lower = text.toLowerCase();
  // ASCII, full-width, Arabic-Indic, Persian and Devanagari digits.
  const numbers = text.match(/[0-9\u0660-\u0669\u06f0-\u06f9\u0966-\u096f\uff10-\uff19][0-9\u0660-\u0669\u06f0-\u06f9\u0966-\u096f\uff10-\uff19.,]*/g) ?? [];
  // Full-width digits fold to ASCII (NFKC); other scripts stay non-ASCII and so never pass as a year.
  const ascii = (n: string) => n.normalize("NFKC").replace(/[.,]+$/, "");
  if (numbers.some((n) => !YEAR.test(ascii(n)))) return "number";
  if (NUMBER_WORDS.test(text)) return "price";
  if (/[$€£¥%]/.test(text)) return "price";
  if (/\b(dollars?|euros?|pesos?|usd|eur|mxn|percent)\b/.test(lower)) return "price";
  if (/\b(hundreds?|thousands?|millions?|billions?|dozens?)\b/.test(lower)) return "count";
  if (/\b(hours?|days?|weeks?|months?)\b/.test(lower)) return "duration";
  for (const word of BANNED_WORDS) {
    if (new RegExp(`\\b${word.replace(/[-\s]/g, "[-\\s]")}\\w*`, "i").test(text)) return "word";
  }
  return null;
}

/** Em and en dashes read as commas on this site. */
export const tidyAnswerText = (text: string) =>
  text
    .replace(/\s*[—–]\s*/g, ", ")
    .replace(/\s{2,}/g, " ")
    .trim();
