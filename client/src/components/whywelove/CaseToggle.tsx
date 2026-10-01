import { useState } from "react";
import { CASE_01 } from "@/data/whyWeLove";
import { JourneyChart } from "./JourneyChart";
import { Body, Headline } from "./primitives";
import { CARD, EASE, INK, LABEL_FONT, MUTED, SERIF, label } from "./styles";

/**
 * The payoff. Same setup both sides, one toggle, and the chart that showed the
 * problem changes state rather than being replaced: the lost dots fill in.
 */
export function CaseToggle() {
  const [withKit, setWithKit] = useState(false);
  const lines = withKit ? CASE_01.with : CASE_01.without;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 36, alignItems: "center", width: "100%" }}>
      <Headline
        lines={[
          [{ text: "Same" }, { text: "dress." }, { text: "Same" }, { text: "price." }],
          [{ text: "It", italic: true }, { text: "was", italic: true }, { text: "the", italic: true }, { text: "wait.", italic: true }],
        ]}
      />

      <Body>{CASE_01.setup}</Body>

      <div
        role="group"
        aria-label="Case 01, with or without the kit"
        style={{ display: "inline-flex", border: `1.5px solid ${INK}`, background: CARD }}
      >
        {[
          { text: "Without the kit", value: false },
          { text: "With the kit", value: true },
        ].map((option) => {
          const isActive = option.value === withKit;
          return (
            <button
              key={option.text}
              type="button"
              aria-pressed={isActive}
              onClick={() => setWithKit(option.value)}
              style={{
                ...label,
                fontSize: 11,
                minHeight: 46,
                padding: "0 20px",
                border: "none",
                cursor: "pointer",
                background: isActive ? INK : "transparent",
                color: isActive ? CARD : MUTED,
                transition: `background 220ms ${EASE.arrive}, color 220ms ${EASE.arrive}`,
              }}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      <JourneyChart fixed={withKit} />

      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 560,
        }}
      >
        {lines.map((line) => (
          <li
            key={line}
            style={{
              fontFamily: SERIF,
              fontWeight: 300,
              fontSize: "clamp(1.15rem, 2.2vw, 1.5rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.015em",
              color: INK,
              textAlign: "center",
            }}
          >
            {line}
          </li>
        ))}
      </ul>

      <span style={{ fontFamily: LABEL_FONT, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED }}>
        {withKit ? "Fix 01 · The Day-3 message" : "The gap, left open"}
      </span>
    </div>
  );
}
