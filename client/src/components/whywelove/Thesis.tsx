import type { Block, Section } from "@/data/thesis";
import { useInView } from "@/hooks/use-in-view";
import { EASE, INK, LABEL_FONT, MUTED, SERIF, label } from "./styles";
import { Headline, StepLabel } from "./primitives";

/** Long prose reads left-aligned in a narrow column. Centring it past a few lines costs the reader. */
const MEASURE = "62ch";

type Group = { kind: "quote" | "prose"; blocks: Array<Extract<Block, { text: string }>> | Block[] };

/** Runs of prose stay together in one column; each quote stands alone. */
function groupBlocks(blocks: Block[]) {
  const groups: Array<{ kind: "quote" | "prose"; blocks: any[] }> = [];
  for (const block of blocks) {
    const kind = block.type === "quote" ? "quote" : "prose";
    const last = groups[groups.length - 1];
    if (kind === "quote" || !last || last.kind !== "prose") {
      groups.push({ kind, blocks: [block] });
    } else {
      last.blocks.push(block);
    }
  }
  return groups;
}

export function ThesisSection({ section, children }: { section: Section; children?: React.ReactNode }) {
  return (
    <section
      id={section.id}
      style={{ display: "flex", flexDirection: "column", gap: 30, alignItems: "center", width: "100%" }}
    >
      <div style={{ width: "100%", maxWidth: MEASURE, display: "flex", flexDirection: "column", gap: 18 }}>
        <StepLabel>{section.step}</StepLabel>
      </div>
      <Headline lines={section.heading} />
      {/* Prose runs at the reading measure. A pull quote is a visual event, so
          it steps outside that column and takes the full width of the page. */}
      {groupBlocks(section.blocks).map((group, index) =>
        group.kind === "quote" ? (
          <PullQuote key={index} text={group.blocks[0].text} />
        ) : (
          <div
            key={index}
            style={{
              width: "100%",
              maxWidth: MEASURE,
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            {group.blocks.map((block, inner) => (
              <ThesisBlock key={inner} block={block} />
            ))}
          </div>
        ),
      )}
      {children}
    </section>
  );
}

function ThesisBlock({ block }: { block: Block }) {
  if (block.type === "quote") {
    return (
      <PullQuote text={block.text} />
    );
  }

  if (block.type === "p") {
    return (
      <p
        style={{
          margin: 0,
          fontFamily: LABEL_FONT,
          fontSize: "1.0625rem",
          lineHeight: 1.62,
          color: INK,
          textWrap: "pretty",
        }}
      >
        {block.text}
      </p>
    );
  }

  if (block.type === "list") {
    return (
      <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
        {block.items.map((item, index) => (
          <li
            key={item}
            style={{
              display: "flex",
              gap: 16,
              fontFamily: LABEL_FONT,
              fontSize: "1.0625rem",
              lineHeight: 1.62,
              color: INK,
            }}
          >
            <span style={{ ...label, fontSize: 10, color: MUTED, flexShrink: 0, paddingTop: 6 }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span style={{ textWrap: "pretty" }}>{item}</span>
          </li>
        ))}
      </ol>
    );
  }

  if (block.type === "note") {
    return (
      <p
        style={{
          margin: 0,
          paddingLeft: 18,
          borderLeft: `1.5px solid ${INK}`,
          fontFamily: LABEL_FONT,
          fontSize: "0.95rem",
          lineHeight: 1.55,
          color: MUTED,
          textWrap: "pretty",
        }}
      >
        {block.text}
      </p>
    );
  }

  return null;
}

/** The line the section turns on. Set large, alone, and given room. */
function PullQuote({ text }: { text: string }) {
  const { ref, inView } = useInView<HTMLParagraphElement>(0.4);

  return (
    <p
      ref={ref}
      className="wwl-bleed"
      style={{
        margin: "26px 0",
        width: "100%",
        maxWidth: 980,
        marginInline: "auto",
        fontFamily: SERIF,
        fontWeight: 400,
        fontOpticalSizing: "auto",
        fontSize: "clamp(1.55rem, 3.4vw, 2.75rem)",
        lineHeight: 1.1,
        letterSpacing: "-0.026em",
        color: INK,
        textAlign: "center",
        textWrap: "balance",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 520ms ${EASE.arrive}, transform 520ms ${EASE.arrive}`,
      }}
    >
      {text}
    </p>
  );
}
