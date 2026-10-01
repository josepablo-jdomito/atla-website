import type { CSSProperties, ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";
import { CARD, EASE, INK, LABEL_FONT, MUTED, SERIF, label } from "./styles";

/** `01 · Research`. The step marker, and the only chrome on the page. */
export function StepLabel({ children, tone = "ink" }: { children: ReactNode; tone?: "ink" | "faint" }) {
  return <p style={{ ...label, color: tone === "faint" ? MUTED : INK }}>{children}</p>;
}

/**
 * The signature headline: Times Now Light, line-height 1, tight tracking,
 * centered, with roman and italic mixed so the italic carries the turn.
 *
 * Lines are authored, never wrapped by width — each entry in `lines` is its own
 * line, and the words inside it rise one by one when the headline scrolls in.
 */
export function Headline({
  lines,
  as: Tag = "h2",
  size = "h2",
}: {
  lines: Array<Array<{ text: string; italic?: boolean }>>;
  as?: "h1" | "h2";
  size?: "hero" | "h2";
}) {
  const { ref, inView } = useInView<HTMLHeadingElement>(0.2);

  let wordIndex = 0;

  return (
    <Tag
      ref={ref}
      className="wwl-bleed"
      style={{
        fontFamily: SERIF,
        fontWeight: 300,
        fontSize: size === "hero" ? "clamp(1.85rem, 5.4vw, 5.25rem)" : "clamp(1.75rem, 4vw, 3.5rem)",
        lineHeight: 1,
        letterSpacing: "-0.015em",
        color: INK,
        margin: 0,
        textAlign: "center",
      }}
    >
      {lines.map((line, lineNumber) => (
        <span key={lineNumber} style={{ display: "block" }}>
          {line.map((word, index) => {
            // Words land in reading order across the whole headline, 70ms apart.
            const delay = wordIndex * 70;
            wordIndex += 1;
            return (
              <span
                key={index}
                style={{
                  display: "inline-block",
                  fontStyle: word.italic ? "italic" : "normal",
                  transform: inView ? "translateY(0)" : "translateY(24px)",
                  opacity: inView ? 1 : 0,
                  transition: `transform 230ms ${EASE.arrive} ${delay}ms, opacity 230ms ${EASE.arrive} ${delay}ms`,
                }}
              >
                {word.text}
                {index < line.length - 1 ? " " : null}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

/** Narrow centered column, balanced, one idea at a time. */
export function Body({ children, align = "center" }: { children: ReactNode; align?: "center" | "left" }) {
  return (
    <p
      style={{
        fontFamily: LABEL_FONT,
        fontSize: "1.0625rem",
        lineHeight: 1.35,
        color: INK,
        margin: "0 auto",
        maxWidth: "47ch",
        textAlign: align,
        textWrap: "balance",
      }}
    >
      {children}
    </p>
  );
}

/** A small ink-ruled tag naming a platform. Never names the brand. */
export function SourceTag({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        ...label,
        fontSize: 11,
        display: "inline-block",
        border: `1.2px solid ${INK}`,
        background: CARD,
        padding: "5px 10px",
      }}
    >
      {children}
    </span>
  );
}

/**
 * A real quote, lifted from a real platform, set in the serif inside typographic
 * quotes with its source labelled above. Rotated a hair so it sits on the page
 * like something pasted down.
 */
export function QuoteStrip({
  source,
  quote,
  rotate = -1.2,
  style,
}: {
  source: string;
  quote: string;
  rotate?: number;
  style?: CSSProperties;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);

  return (
    <figure
      ref={ref}
      style={{
        margin: 0,
        background: CARD,
        border: `1.5px solid ${INK}`,
        padding: "18px 24px",
        boxShadow: "0 10px 24px rgba(0,0,0,.2)",
        transform: `rotate(${rotate}deg) scale(${inView ? 1 : 0.96})`,
        opacity: inView ? 1 : 0,
        transition: `transform 320ms ${EASE.pop}, opacity 320ms ${EASE.arrive}`,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        ...style,
      }}
    >
      <figcaption style={{ ...label, fontSize: 11, color: MUTED }}>{source}</figcaption>
      <blockquote
        style={{
          margin: 0,
          fontFamily: SERIF,
          fontWeight: 300,
          fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)",
          lineHeight: 1.15,
          letterSpacing: "-0.015em",
          color: INK,
        }}
      >
        {`“${quote}”`}
      </blockquote>
    </figure>
  );
}

/** A thin ink rule that draws itself when it scrolls in. Never pre-drawn. */
export function DrawnRule({ width = "100%" }: { width?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.5);

  return (
    <div ref={ref} style={{ width, height: 2, overflow: "hidden" }}>
      <div
        style={{
          height: "100%",
          width: inView ? "100%" : "0%",
          background: INK,
          transition: `width 700ms ${EASE.arrive}`,
        }}
      />
    </div>
  );
}
