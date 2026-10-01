import { useInView } from "@/hooks/use-in-view";
import { JOURNEY_STAGES, POSTS_AT_THE_GAP, POSTS_PER_DOT, POSTS_TOTAL } from "@/data/whyWeLove";
import { CARD, EASE, INK, LABEL_FONT, MUTED, label } from "./styles";

const GAP_DOTS = Math.round(POSTS_AT_THE_GAP / POSTS_PER_DOT);

/**
 * The journey as a vertical ink line: the stages as dots with their names, the
 * gap bracketed where the love is lost, and the real post count rendered as
 * dots beside it.
 *
 * `fixed` is the payoff device: the same chart that showed the problem changes
 * state, and the lost dots fill in rather than being replaced by a new chart.
 */
export function JourneyChart({ fixed = false }: { fixed?: boolean }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const gapIndex = JOURNEY_STAGES.findIndex((stage) => stage.isGap);

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      <div style={{ display: "flex", gap: 20, alignItems: "stretch", justifyContent: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}>
          {JOURNEY_STAGES.map((stage, index) => (
            <div key={stage.id} style={{ display: "flex", alignItems: "center", gap: 14, height: 76 }}>
              <div
                style={{
                  position: "relative",
                  width: 2,
                  alignSelf: "stretch",
                  background: INK,
                  transformOrigin: "top",
                  transform: inView ? "scaleY(1)" : "scaleY(0)",
                  transition: `transform 500ms ${EASE.arrive} ${index * 120}ms`,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: -5,
                    top: "50%",
                    width: 12,
                    height: 12,
                    marginTop: -6,
                    borderRadius: 999,
                    background: INK,
                    transform: inView ? "scale(1)" : "scale(0)",
                    transition: `transform 320ms ${EASE.pop} ${300 + index * 120}ms`,
                  }}
                />
              </div>
              <span
                style={{
                  ...label,
                  fontSize: 12,
                  minWidth: 150,
                  opacity: inView ? (stage.isGap ? 1 : 0.45) : 0,
                  transition: `opacity 400ms ${EASE.arrive} ${400 + index * 120}ms`,
                }}
              >
                {stage.name}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            // Pin the bracket beside the stage the posts actually belong to.
            marginTop: gapIndex * 76,
            alignSelf: "flex-start",
            height: 76,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: 12,
              height: 68,
              borderTop: `1.5px solid ${INK}`,
              borderBottom: `1.5px solid ${INK}`,
              borderRight: `1.5px solid ${INK}`,
              opacity: inView ? 1 : 0,
              transition: `opacity 400ms ${EASE.arrive} 900ms`,
            }}
          />
          <span
            style={{
              ...label,
              fontSize: 11,
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              opacity: inView ? 1 : 0,
              transition: `opacity 400ms ${EASE.arrive} 1000ms`,
            }}
          >
            {fixed ? "Loved" : "The gap"}
          </span>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(9, 1fr)",
              gap: 6,
              maxWidth: 160,
            }}
          >
            {Array.from({ length: GAP_DOTS }).map((_, index) => (
              <span
                key={index}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  border: `1.5px solid ${INK}`,
                  background: fixed ? INK : "transparent",
                  transform: inView ? "scale(1)" : "scale(0)",
                  transition: `transform 280ms ${EASE.pop} ${900 + index * 18}ms, background 260ms ${EASE.arrive} ${index * 14}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 18,
          alignItems: "center",
          borderTop: `1.2px solid ${INK}`,
          paddingTop: 14,
          justifyContent: "center",
        }}
      >
        <Legend filled={false} text="Lost" />
        <Legend filled text="Loved" />
        <span style={{ ...label, fontSize: 11, color: MUTED }}>
          1 dot = {POSTS_PER_DOT} posts · {POSTS_AT_THE_GAP} of {POSTS_TOTAL} at the wait
        </span>
      </div>
    </div>
  );
}

function Legend({ filled, text }: { filled: boolean; text: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          border: `1.5px solid ${INK}`,
          background: filled ? INK : CARD,
        }}
      />
      <span style={{ fontFamily: LABEL_FONT, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>
        {text}
      </span>
    </span>
  );
}
