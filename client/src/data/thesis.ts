/**
 * The thesis of Why We Love the Brands We Love.
 *
 * This is the page. Everything else on it, the live read, the Canvas, the kit,
 * is evidence for an argument, and the argument has to be written down before
 * any of it means anything.
 *
 * Sections render in order. A `quote` is set large and alone; a `note` is an
 * aside in the margin of the reader's attention, not a footnote.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "quote"; text: string }
  | { type: "note"; text: string }
  | { type: "list"; items: string[] };

export type Section = {
  id: string;
  step: string;
  /** Authored lines. Breaks follow meaning, so long headings are split here, not by width. */
  heading: Array<Array<{ text: string; italic?: boolean }>>;
  blocks: Block[];
};

export const THESIS: Section[] = [
  {
    id: "belonging",
    step: "01 · The claim",
    heading: [
      [{ text: "People" }, { text: "do" }, { text: "not" }, { text: "buy" }, { text: "brands." }],
      [{ text: "They", italic: true }, { text: "belong", italic: true }, { text: "to", italic: true }, { text: "them.", italic: true }],
    ],
    blocks: [
      {
        type: "p",
        text: "Ask someone why they love a brand and they will give you a reason. The coffee is better. The app is faster. The returns are easy. Then watch what they actually do, and the reason falls apart. They drive past three closer coffees. They keep the slower app. They have never returned anything in their life.",
      },
      {
        type: "p",
        text: "The reason was real. It was just not the cause. What they are describing is the justification they built after the fact, for a decision that was made somewhere else.",
      },
      {
        type: "p",
        text: "Brand love does not behave like preference. It behaves like membership. People defend brands they love the way they defend a team, a neighbourhood, a language. They take it personally when you criticise it, which is a strange thing to do about a company that sells you something.",
      },
      {
        type: "quote",
        text: "You cannot buy your way into that, and you cannot message your way into it either.",
      },
    ],
  },
  {
    id: "anthropology",
    step: "02 · The frame",
    heading: [
      [{ text: "This" }, { text: "is" }, { text: "anthropology," }],
      [{ text: "not", italic: true }, { text: "marketing.", italic: true }],
    ],
    blocks: [
      {
        type: "p",
        text: "Marketing asks what will make someone choose us. It is a good question and it has made a lot of money. It is also the wrong question for this, because it treats the customer as a decision to be won rather than a person looking for somewhere to belong.",
      },
      {
        type: "p",
        text: "Anthropology asks a different question: what does this group do together, and what does doing it mean? Every tribe that has ever held together has the same machinery. Rituals people perform. Symbols only members read correctly. Language outsiders get slightly wrong. Stories about where we came from. Things we would never do.",
      },
      {
        type: "p",
        text: "Brands that are loved have all of it. Not as a campaign. As a working culture that customers can join without being asked.",
      },
      {
        type: "note",
        text: "A test. If your customers have a word for themselves that you did not give them, you have a tribe. If the only word is “users”, you have a funnel.",
      },
    ],
  },
  {
    id: "concentration",
    step: "03 · The finding",
    heading: [
      [{ text: "Love" }, { text: "does" }, { text: "not" }, { text: "spread." }],
      [{ text: "It", italic: true }, { text: "concentrates.", italic: true }],
    ],
    blocks: [
      {
        type: "p",
        text: "Here is the part that changes what you do on Monday.",
      },
      {
        type: "p",
        text: "When you read what people actually write about a brand they love, in reviews, in forums, in the long unprompted messages they send at midnight, the affection does not sit evenly across the experience. It bunches. Three moments, sometimes four, carry almost all of it. Everything else in the relationship is competent and forgettable, and that is fine, because nobody fell in love with the competent parts.",
      },
      {
        type: "p",
        text: "The same is true of the damage. Brands do not usually lose people across the board. They lose them at one specific moment that nobody owns, that no department measures, and that never appears in a brand guideline.",
      },
      {
        type: "quote",
        text: "Nobody loves your whole brand. They love three moments of it, and they leave at one.",
      },
      {
        type: "p",
        text: "This is why spreading the budget evenly across the funnel produces a brand nobody hates and nobody chooses. Averages are the enemy here. You are not trying to raise the mean. You are trying to build three peaks and close one hole.",
      },
    ],
  },
  {
    id: "anatomy",
    step: "04 · The anatomy",
    heading: [
      [{ text: "Loving" }, { text: "a" }, { text: "brand" }, { text: "has" }],
      [{ text: "an", italic: true }, { text: "anatomy.", italic: true }],
    ],
    blocks: [
      {
        type: "p",
        text: "If love concentrates, then it has parts, and the parts can be examined. Eight of them. This is the Canvas, and it is the instrument the rest of the work runs on.",
      },
      {
        type: "p",
        text: "Most brands are strong in two or three blocks and have never thought about the others. That is not a failure of effort. It is a failure of inventory. You cannot build what you have not named.",
      },
    ],
  },
  {
    id: "moments",
    step: "05 · Where it lives",
    heading: [
      [{ text: "Five" }, { text: "moments." }],
      [{ text: "Twenty-five", italic: true }, { text: "touchpoints.", italic: true }],
    ],
    blocks: [
      {
        type: "p",
        text: "The Canvas says what love is made of. The map says where it happens. Five moments in any relationship with a company, and five touchpoints inside each one.",
      },
      {
        type: "list",
        items: [
          "Discovery. How they first find you, and what they decide about you in the four seconds before they read anything.",
          "First contact. The first real exchange, where the promise either survives meeting a human or does not.",
          "Purchase. The moment money moves, which everybody optimises and almost nobody loves.",
          "Use. Living with the thing, where most of the hours are and most of the budget is not.",
          "Return. Coming back, and telling someone else, which is the only moment that compounds.",
        ],
      },
      {
        type: "p",
        text: "Twenty-five slots. Most companies can fill nine or ten with something deliberate. The rest happen anyway, designed by whoever was closest at the time: an invoice template, a support macro, a confirmation email written in 2019 by someone who has left.",
      },
      {
        type: "quote",
        text: "The moments you did not design are still moments. They are just designed by accident.",
      },
    ],
  },
  {
    id: "twenty-five",
    step: "06 · The rule",
    heading: [
      [{ text: "Twenty" }, { text: "reasons." }],
      [{ text: "Five", italic: true }, { text: "without", italic: true }, { text: "compromise.", italic: true }],
    ],
    blocks: [
      {
        type: "p",
        text: "Here is the exercise, and it is harder than it reads.",
      },
      {
        type: "p",
        text: "List twenty reasons a customer could fall in love with your brand. Not twenty features. Twenty reasons a person would feel something. Then cut every one a competitor could also claim, which will remove more than half and will hurt.",
      },
      {
        type: "p",
        text: "Rank what survives by three things: the evidence that it matters, the intensity of the feeling, and whether you could own it. Then circle five and execute those five without compromise. Not twenty things done adequately. Five done to a standard that looks slightly unreasonable.",
      },
      {
        type: "note",
        text: "The evidence rule. A reason with no review, message or quote behind it scores no higher than two out of ten. You are not allowed to believe a reason because it sounds good in the room.",
      },
      {
        type: "p",
        text: "Unreasonable is the point. A gesture that is obviously more than required is legible as care in a way that a well-run process never is. Specific beats expensive. Unnecessary beats better. If a competitor could copy it by Friday, it was not it.",
      },
    ],
  },
  {
    id: "why-it-misses",
    step: "07 · Why the usual work misses",
    heading: [
      [{ text: "A" }, { text: "rebrand" }, { text: "repaints" }, { text: "the" }, { text: "average." }],
    ],
    blocks: [
      {
        type: "p",
        text: "Most brand projects deliver a logo, a palette, a type system and a document describing them. All of it is real work and some of it is beautiful. None of it touches the three moments, because the three moments are usually not owned by the people who commissioned the brand.",
      },
      {
        type: "p",
        text: "The moment that loses you customers is often operational. It is the silence after someone pays. It is the second email about a delay. It is what happens when a person writes to complain and the form does not work. No colour palette reaches any of that, which is why brands can look excellent and still bleed.",
      },
      {
        type: "p",
        text: "So the work is not to improve the brand. It is to find the three or four moments that carry the feeling, find the one that is leaking, and build those on purpose, in whatever department they happen to live.",
      },
    ],
  },
];

/** The single action the page closes on. */
export const THESIS_CLOSE = {
  heading: [
    [{ text: "Every" }, { text: "map" }, { text: "has" }, { text: "a" }, { text: "leak" }, { text: "in" }, { text: "it." }],
    [{ text: "Most", italic: true }, { text: "brands", italic: true }, { text: "are", italic: true }, { text: "fixing", italic: true }, { text: "the", italic: true }, { text: "wrong", italic: true }, { text: "one.", italic: true }],
  ],
  body: "A Brand Read finds which moment, in your customers’ own words, and writes the touchpoints that fill it.",
};
