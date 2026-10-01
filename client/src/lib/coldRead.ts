/**
 * Rule-based cold-read grader for the /why-we-love prototype.
 *
 * It stands in for a fresh agent reading a drafted touchpoint with no context
 * about the reader's brand. It grades against the six rules in moments.md and
 * returns three short lines: what it understood, what it had to invent, and
 * what is missing. Deterministic on purpose — the point is that the reader can
 * see the grading happen, not that a model happened to be in the loop.
 */

export type ColdReadVerdict = {
  understood: string;
  invented: string;
  missing: string;
  /** Rules the draft passed, by index into GRADING_RULES. */
  passed: number[];
  /** Rules the draft failed, by index into GRADING_RULES. */
  failed: number[];
};

/** Language any competitor in any category could paste unchanged. */
const GENERIC_TERMS = [
  "better",
  "improve",
  "improved",
  "quality",
  "premium",
  "seamless",
  "experience",
  "journey",
  "engaging",
  "delightful",
  "world-class",
  "best-in-class",
  "elevate",
  "unique",
  "personalized",
  "customer-centric",
  "value",
  "solution",
  "touchpoint",
  "optimize",
  "streamline",
];

/** Incremental-improvement verbs: the thing the rules say loses to delight. */
const INCREMENTAL_TERMS = [
  "free",
  "faster",
  "cheaper",
  "discount",
  "coupon",
  "promo",
  "upgrade",
  "optimize",
  "more",
  "increase",
  "reduce",
];

/** Concrete nouns that mean a real object, channel, or act exists in the draft. */
const CONCRETE_TERMS = [
  "note",
  "letter",
  "card",
  "call",
  "voice",
  "photo",
  "video",
  "box",
  "package",
  "message",
  "text",
  "email",
  "dm",
  "name",
  "hand",
  "handwritten",
  "ship",
  "deliver",
  "visit",
  "fitting",
  "sample",
  "swatch",
  "receipt",
  "invite",
  "door",
  "sticker",
  "tag",
  "thread",
  "stitch",
];

/** Words that locate the touchpoint in a moment of real feeling or doubt. */
const EMOTION_TERMS = [
  "wait",
  "waiting",
  "quiet",
  "silence",
  "nervous",
  "anxious",
  "worried",
  "doubt",
  "unsure",
  "afraid",
  "scared",
  "excited",
  "proud",
  "relief",
  "alone",
  "first",
  "last",
  "late",
  "wrong",
  "sorry",
];

const TIME_PATTERN =
  /\b(day|days|week|weeks|month|months|hour|hours|minute|minutes|morning|night|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/;

function words(draft: string) {
  return draft
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function hits(tokens: string[], terms: string[]) {
  return terms.filter((term) => tokens.includes(term));
}

/**
 * Grade a drafted touchpoint for one moment.
 *
 * @param draft     the reader's one-line touchpoint
 * @param momentName the moment the cell belongs to, used in the verdict copy
 */
export function coldRead(draft: string, momentName: string): ColdReadVerdict | null {
  const trimmed = draft.trim();
  if (trimmed.length < 3) return null;

  const tokens = words(trimmed);
  const generic = hits(tokens, GENERIC_TERMS);
  const incremental = hits(tokens, INCREMENTAL_TERMS);
  const concrete = hits(tokens, CONCRETE_TERMS);
  const emotion = hits(tokens, EMOTION_TERMS);
  const hasNumber = /\d/.test(trimmed);
  const hasTime = TIME_PATTERN.test(trimmed.toLowerCase());
  const isSpecific = concrete.length > 0 || hasNumber || hasTime;
  const isShort = tokens.length < 5;

  // Rule order matches GRADING_RULES in client/src/data/whyWeLove.ts.
  const results = [
    incremental.length === 0 && generic.length === 0, // delight over improvement
    emotion.length > 0 || hasTime, // high emotion, low certainty
    isSpecific, // past a defined floor, not vague
    isSpecific && generic.length === 0, // unnecessary and specific
    !isShort && isSpecific, // unmistakably intentional
    generic.length === 0 && isSpecific, // the copy test
  ];

  const passed = results.flatMap((ok, index) => (ok ? [index] : []));
  const failed = results.flatMap((ok, index) => (ok ? [] : [index]));

  const understood = isSpecific
    ? `I read this as a ${momentName.toLowerCase()} touchpoint built around ${concrete[0] ? `"${concrete[0]}"` : hasTime ? "a specific moment in time" : "a specific detail"}. I can picture who does it and when.`
    : `I read this as an intention for ${momentName.toLowerCase()}, not a touchpoint. I cannot tell what gets made, who makes it, or when it reaches the customer.`;

  const inventedParts: string[] = [];
  if (!isSpecific) inventedParts.push("the object, the channel, and the timing");
  if (isShort) inventedParts.push("most of the sentence around it");
  if (generic.length > 0) inventedParts.push(`what you mean by "${generic[0]}"`);
  if (emotion.length === 0 && !hasTime) inventedParts.push("the feeling this is supposed to meet");

  const invented =
    inventedParts.length === 0
      ? "Nothing. I could build this from the line alone, which is the bar."
      : `I had to invent ${inventedParts.slice(0, 2).join(", and ")}. Every invention is a hole in the kit, not a mistake on my side.`;

  // Driven by the failed rules, so the verdict never contradicts the badges below it.
  const missingParts: string[] = [];
  if (!results[5])
    missingParts.push(
      generic[0]
        ? `the copy test: "${generic[0]}" would survive a paste into any competitor's deck`
        : "the copy test: any competitor in your category could paste this unchanged",
    );
  if (!results[0] && incremental.length > 0)
    missingParts.push(`this improves the floor (${incremental[0]}) instead of going past it`);
  if (!results[1]) missingParts.push("the uncertainty it answers, and a moment in time to fire it");
  if (!results[4]) missingParts.push("enough of a sentence to look intentional rather than noted down");

  const missing =
    missingParts.length === 0
      ? "Nothing blocking. It is specific, timed, and no competitor could paste it unchanged."
      : `Missing: ${missingParts.slice(0, 2).join("; ")}.`;

  return { understood, invented, missing, passed, failed };
}
