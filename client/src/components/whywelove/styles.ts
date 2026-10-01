import type { CSSProperties } from "react";

/**
 * The Why We Love the Brands We Love system: paper and ink, no accent color.
 * Tokens mirror the design guide so the web and the motion pieces agree.
 */

/**
 * Headlines, quotes and numbers.
 *
 * Times Now Light is licensed from JHA and is not in the repo; it is picked up
 * with local() when installed, exactly as the site already does for its other
 * trial cuts. Until that licence is cleared the page renders in Bodoni Moda,
 * a true didone with the same high-contrast, fine-hairline character. Falling
 * back to Times New Roman, as this did before, made the page look like a term
 * paper rather than a research note.
 */
export const SERIF =
  "'Times Now Light', 'Bodoni Moda', 'Didot', 'Times New Roman', Times, serif";
/** Labels, sources and small body. Parabolica Text, same licensing caveat. */
export const LABEL_FONT = "'Parabolica Text', 'Libre Franklin', Helvetica, sans-serif";
/** Only for the console and the kit viewer, where the content really is code. */
export const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/** Kept as aliases so the older components in this folder read the same system. */
export const SANS = LABEL_FONT;
export const DISPLAY = SERIF;

export const INK = "#141414";
export const PAPER = "#F8F3E8";
export const PAPER_EDGE = "#F4EDDD";
export const CARD = "#FBF8F1";
export const INK_FAINT = "#14141433";

/** Older token names, repointed at the paper system. */
export const MUTED = "rgba(20,20,20,0.55)";
export const LINE = "rgba(20,20,20,0.22)";
export const SURFACE = CARD;

/** Easing families. Each has one job; nothing borrows another's curve. */
export const EASE = {
  arrive: "cubic-bezier(.16,1,.3,1)",
  pop: "cubic-bezier(.34,1.56,.64,1)",
  camera: "cubic-bezier(.65,0,.35,1)",
  leave: "cubic-bezier(.7,0,.84,0)",
} as const;

/** Uppercase Parabolica with 0.14em tracking: every label on the page. */
export const label: CSSProperties = {
  fontFamily: LABEL_FONT,
  fontSize: 13,
  fontWeight: 500,
  letterSpacing: "0.14em",
  lineHeight: 1.2,
  textTransform: "uppercase",
  color: INK,
  margin: 0,
};

/** Alias for the older components. */
export const eyebrow: CSSProperties = { ...label, color: MUTED };

export const sectionTitle: CSSProperties = {
  fontFamily: SERIF,
  fontWeight: 300,
  letterSpacing: "-0.015em",
  lineHeight: 1,
  color: INK,
  margin: 0,
};

export const body: CSSProperties = {
  fontFamily: LABEL_FONT,
  fontSize: 17,
  fontWeight: 400,
  lineHeight: 1.35,
  color: INK,
  margin: 0,
  textWrap: "balance",
};

/** A card is a printed object on the page: lighter than the paper, ink-ruled. */
export const card: CSSProperties = {
  background: CARD,
  border: `1.5px solid ${INK}`,
  borderRadius: 0,
  padding: 24,
  boxSizing: "border-box",
};
