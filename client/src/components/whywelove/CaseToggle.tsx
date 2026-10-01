import { useState } from "react";
import { CASE_01 } from "@/data/whyWeLove";
import { INK, LINE, MONO, MUTED, SANS, SURFACE, body, card } from "./styles";

/** Case 01, one toggle. Same setup both sides; only the kit changes. */
export function CaseToggle() {
  const [withKit, setWithKit] = useState(true);
  const lines = withKit ? CASE_01.with : CASE_01.without;

  return (
    <div style={{ ...card, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 0.6, color: MUTED }}>
          CASE 01
        </span>
        <p style={{ ...body, fontSize: 15, color: INK }}>{CASE_01.brand}</p>
        <p style={{ ...body, fontSize: 15 }}>{CASE_01.setup}</p>
      </div>

      <div
        role="group"
        aria-label="Case 01, with or without the kit"
        style={{
          display: "inline-flex",
          alignSelf: "flex-start",
          padding: 4,
          gap: 4,
          borderRadius: 999,
          border: `1px solid ${LINE}`,
          background: "#fafafa",
        }}
      >
        {[
          { label: "Without the kit", value: false },
          { label: "With the kit", value: true },
        ].map((option) => {
          const isActive = option.value === withKit;
          return (
            <button
              key={option.label}
              type="button"
              aria-pressed={isActive}
              onClick={() => setWithKit(option.value)}
              style={{
                fontFamily: SANS,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: 0.2,
                minHeight: 38,
                padding: "0 16px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                background: isActive ? INK : "transparent",
                color: isActive ? "#f5f5f5" : MUTED,
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          background: SURFACE,
        }}
      >
        {lines.map((line) => (
          <li key={line} style={{ ...body, fontSize: 15, display: "flex", gap: 10 }}>
            <span style={{ fontFamily: MONO, fontSize: 12, color: MUTED, paddingTop: 3 }}>—</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <p
        style={{
          ...body,
          fontSize: 17,
          color: INK,
          fontWeight: 600,
          paddingTop: 14,
          borderTop: `1px solid ${LINE}`,
        }}
      >
        {CASE_01.verdict}
      </p>
    </div>
  );
}
