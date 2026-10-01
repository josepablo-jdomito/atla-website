import { DAY_THREE_MESSAGE, POSTS_TOTAL } from "@/data/whyWeLove";
import { useInView } from "@/hooks/use-in-view";
import { CARD, EASE, INK, MUTED, SERIF, label } from "./styles";
import { Counter } from "./Counter";
import { JourneyChart } from "./JourneyChart";
import { SourceTag } from "./primitives";

const PLATFORMS = ["Mumsnet", "Trustpilot", "The Knot", "WeddingWire", "Hitched", "Reddit"];

/**
 * 03 · The gap. The cold read run in front of the reader: the posts counted up,
 * the sources they came from, and the journey chart that shows where the love
 * is lost.
 */
export function ColdReadDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 44, alignItems: "center", width: "100%" }}>
      <Counter to={POSTS_TOTAL} caption="Posts read · forums and review sites" />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 560 }}>
        {PLATFORMS.map((platform) => (
          <SourceTag key={platform}>{platform}</SourceTag>
        ))}
      </div>

      <AIBox />

      <JourneyChart />

      <DayThreeMessage />
    </div>
  );
}

/** The square the sources stream into. An italic serif "AI", nothing more. */
function AIBox() {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        width: 84,
        height: 84,
        border: `1.5px solid ${INK}`,
        background: CARD,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: inView ? "scale(1)" : "scale(0.8)",
        opacity: inView ? 1 : 0,
        transition: `transform 340ms ${EASE.pop}, opacity 340ms ${EASE.arrive}`,
      }}
    >
      <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: 34, color: INK }}>AI</span>
    </div>
  );
}

/** The fix a fresh agent wrote with the kit loaded and nothing else. */
function DayThreeMessage() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        maxWidth: 620,
        background: CARD,
        border: `1.5px solid ${INK}`,
        padding: "22px 26px",
        boxShadow: "0 10px 24px rgba(0,0,0,.2)",
        transform: `rotate(-0.6deg) translateY(${inView ? 0 : 18}px)`,
        opacity: inView ? 1 : 0,
        transition: `transform 420ms ${EASE.arrive}, opacity 420ms ${EASE.arrive}`,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <span style={{ ...label, fontSize: 11, color: MUTED }}>
        Fix 01 · The Day-3 message · written cold from the kit
      </span>
      {DAY_THREE_MESSAGE.map((paragraph) => (
        <p
          key={paragraph}
          style={{
            margin: 0,
            fontFamily: SERIF,
            fontWeight: 300,
            fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
            lineHeight: 1.3,
            letterSpacing: "-0.015em",
            color: INK,
            textWrap: "pretty",
          }}
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
