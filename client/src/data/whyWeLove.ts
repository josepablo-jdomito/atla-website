/**
 * Content and rules for /why-we-love — the live prototype of the
 * "Why We Love The Brands We Love" framework.
 *
 * Everything here is the page's source of truth: the kit files the reader can
 * open, the 5x5 map, the Case 01 record, and the rules the cold-read grades
 * a draft touchpoint against.
 */

export type Moment = {
  id: string;
  index: number;
  name: string;
  whatItIs: string;
};

export const MOMENTS: Moment[] = [
  { id: "discovery", index: 1, name: "Discovery", whatItIs: "How they first find you" },
  { id: "first-contact", index: 2, name: "First contact", whatItIs: "The first real exchange" },
  { id: "purchase", index: 3, name: "Purchase", whatItIs: "The moment money moves" },
  { id: "use", index: 4, name: "Use", whatItIs: "Living with the thing" },
  { id: "return", index: 5, name: "Return", whatItIs: "Coming back, telling others" },
];

/** Five touchpoint slots per moment. Labels are slots, not prescriptions. */
export const TOUCHPOINT_SLOTS = ["01", "02", "03", "04", "05"] as const;

/**
 * The only filled cell on the page. The filled map is the paid diagnostic;
 * this row exists so the reader can see what a filled cell looks like.
 */
export const CASE_01_CELL = {
  momentId: "return",
  slot: 2,
  label: "The Day-3 message",
  body: "An honest message on day 3 of the wait, then a rhythm of small, specific updates until the dress ships.",
};

export const GRADING_RULES = [
  "Unexpected delight beats incremental improvement.",
  "Aim for high emotion and low certainty moments.",
  "Define the competent floor first, then go past it on purpose.",
  "Unnecessary beats better. Specific beats expensive.",
  "Every choice must look unmistakably intentional.",
  "The copy test: if a competitor could paste it unchanged, it fails.",
];

/**
 * The Canvas: the eight blocks of the framework, set on the arcs of the ring
 * diagram. Short labels are what the diagram carries; the full names are what
 * the page writes out.
 */
export const CANVAS_BLOCKS = [
  { id: "cult", short: "Cult", name: "Cult", covers: "Rituals, symbols, language, mythology" },
  { id: "attachment", short: "Attachment", name: "Attachment", covers: "Emotional connection, identity, loyalty" },
  { id: "culture", short: "Culture", name: "Cultural Influence", covers: "Tribes, movements, social meaning" },
  { id: "community", short: "Community", name: "Community", covers: "Belonging, connection between users" },
  { id: "sensory", short: "Sensory", name: "Sensory Experience", covers: "Visuals, materials, atmosphere, pleasure" },
  { id: "story", short: "Story", name: "Story / Narrative", covers: "Origin, purpose, myths, voice" },
  { id: "symbol", short: "Symbol", name: "Symbolic Positioning", covers: "Values, aspiration, archetype, promise" },
  { id: "behavior", short: "Behavior", name: "Consumer Behaviors", covers: "Rituals of use, integration into daily life" },
];

export const FUNNEL_STEPS = [
  "Content (Instagram / LinkedIn)",
  "This page (live prototype)",
  "Comment LOVED",
  "DM in under 60 seconds (ManyChat)",
  "Beehiiv: book pre-launch list and the worksheet",
  "3 emails: Case 01, the 8, invitation",
  "Brand Read call",
];

export type KitFile = {
  name: string;
  blurb: string;
  language: "markdown" | "json";
  content: string;
};

export const KIT_FILES: KitFile[] = [
  {
    name: "moments.md",
    blurb: "The 5 moments and the rules every touchpoint is graded against.",
    language: "markdown",
    content: `# The five moments

People do not love a whole brand. They love three or four moments of it.
These are the five places a moment can live. Every touchpoint belongs to one.

1. Discovery — how they first find you.
2. First contact — the first real exchange.
3. Purchase — the moment money moves.
4. Use — living with the thing.
5. Return — coming back, telling others.

Five touchpoints per moment. Twenty-five total. No orphans.

# The rules

- Unexpected delight beats incremental improvement.
- Aim for high emotion and low certainty moments.
- Define the competent floor first, then go past it on purpose.
- Unnecessary beats better. Specific beats expensive.
- Every choice must look unmistakably intentional.
- The copy test: if a competitor could paste it unchanged, it fails.

# How to use this file

Give it to an agent with no context about the brand. Hand it real customer
language. Ask it to place each line in a moment. Where it guesses, the file
is not finished yet.`,
  },
  {
    name: "map-5x5.json",
    blurb: "The grid as structured data. Case 01 is the only filled row.",
    language: "json",
    content: `{
  "version": 1,
  "moments": [
    { "id": "discovery", "touchpoints": [null, null, null, null, null] },
    { "id": "first-contact", "touchpoints": [null, null, null, null, null] },
    { "id": "purchase", "touchpoints": [null, null, null, null, null] },
    { "id": "use", "touchpoints": [null, null, null, null, null] },
    {
      "id": "return",
      "touchpoints": [
        null,
        {
          "label": "The Day-3 message",
          "source": "case-01",
          "evidence": "141 of 264 posts named the wait after purchase"
        },
        null,
        null,
        null
      ]
    }
  ]
}`,
  },
  {
    name: "cold-read.md",
    blurb: "The ritual, step by step.",
    language: "markdown",
    content: `# The Cold-Read Ritual

Give the kit to an agent with zero context. Have it read real customer
language and map it to the 5 moments. Whatever it invents, fix the kit
until it invents nothing.

## Steps

1. Open a fresh agent. No brand context, no brief, no prior thread.
2. Load moments.md and voice.md. Nothing else.
3. Paste real customer language: reviews, DMs, comments, support tickets.
   Unedited. The complaints included, especially the complaints.
4. Ask it to place every line in one of the five moments, and to flag any
   line it cannot place.
5. Count. The moment holding the most lines is where the love leaks.
6. Ask it to write the missing touchpoint for that moment, using voice.md.
7. Read what it invented. Anything it made up is a hole in the kit, not a
   mistake by the agent.
8. Fix the kit. Re-run from step 1 until it invents nothing.

## The only pass condition

A cold agent, given only these files, writes something the brand would
have shipped. Until then the kit is not done.`,
  },
  {
    name: "voice.md",
    blurb: "How the brand sounds when it is working.",
    language: "markdown",
    content: `# Voice

Two states. Everything we write lands in one of them.

## Cared for

- Names the thing that is happening, in order, with a date attached.
- Admits the part that is slow or uncomfortable before being asked.
- Short sentences. One idea each.
- Says “your dress”, never “your order”.

Example:
  "Your dress went into cutting this morning. The next three weeks are the
  quiet part. I will write you on the 14th with the first fitting photo,
  whether or not there is news."

## Processed

- Status language with no person behind it.
- Enthusiasm standing in for information.
- Hedging dates, or no dates at all.

Example:
  "Your order is being processed. We will keep you updated. Thank you for
  your patience."

## Rules

- No exclamation marks.
- No apology without a date next to it.
- If a competitor could send it unchanged, rewrite it.`,
  },
];

/** The Day-3 message, written by a fresh agent with the kit loaded and nothing else. */
export const DAY_THREE_MESSAGE = [
  "Your dress is in the slow part now.",
  "Cutting started Tuesday. From here it is three weeks of hand work that produces nothing you can see, which is exactly why this stretch feels like silence.",
  "So: I will write you on the 14th with the first photo off the table, and again when the hem goes in. If something slips, you will hear it from me before you have to ask.",
  "Nothing is wrong. It is just quiet.",
];

export const CASE_01 = {
  brand: "A wedding-dress label.",
  setup:
    "Brides loved the dress. They loved the fitting. Then they went quiet for weeks while it was made.",
  without: [
    "The brand kept polishing moment 3, the purchase.",
    "More discounts. Better packaging. A smoother checkout.",
    "The complaints did not move.",
  ],
  with: [
    "The cold-read found the leak next door to moment 5: the post-purchase wait.",
    "141 of 264 posts named it.",
    "The fix was one honest message on day 3, then a rhythm of small, specific updates.",
  ],
  verdict: "Same dress. Same price. It was the wait.",
};

/**
 * The journey the posts were mapped onto. Only the gap carries a count: it is
 * the one number the read produced, and the page does not invent the rest.
 */
export const JOURNEY_STAGES = [
  { id: "discovery", name: "Discovery", isGap: false },
  { id: "first-contact", name: "First contact", isGap: false },
  { id: "purchase", name: "Purchase", isGap: false },
  { id: "wait", name: "The wait", isGap: true },
  { id: "delivery", name: "Delivery", isGap: false },
  { id: "return", name: "Return", isGap: false },
];

export const POSTS_TOTAL = 264;
export const POSTS_AT_THE_GAP = 141;
/** Everything that did not land at the wait. 264 minus 141, not a guess. */
export const POSTS_ELSEWHERE = POSTS_TOTAL - POSTS_AT_THE_GAP;
export const POSTS_PER_DOT = 4;
