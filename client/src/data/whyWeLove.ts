/**
 * Content for love.atla.design.
 *
 * The page carries no case study and no example brand: the live read is about
 * whoever is looking at it. What stays here is the framework itself and the kit
 * a Brand Read ships.
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
