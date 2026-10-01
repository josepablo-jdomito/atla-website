import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { KIT_FILES } from "@/data/whyWeLove";
import { CARD, INK, LABEL_FONT, LINE, MONO, MUTED, label } from "./styles";

/**
 * The kit as a file tree the reader can actually open. Real content, not lorem:
 * the deliverable is visible, which is the whole argument of the page.
 */
export function KitViewer() {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = KIT_FILES[activeIndex];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "270px 1fr",
        gap: 12,
        alignItems: "start",
      }}
    >
      <div
        style={{
          border: `1.5px solid ${INK}`,
          background: CARD,
          padding: 10,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <span style={{ ...label, fontSize: 10, color: MUTED, padding: "6px 8px" }}>why-we-love/</span>
        {KIT_FILES.map((file, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={file.name}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-pressed={isActive}
              style={{
                textAlign: "left",
                cursor: "pointer",
                border: "none",
                borderRadius: 0,
                padding: "9px 10px",
                background: isActive ? INK : "transparent",
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 13, color: isActive ? CARD : INK }}>
                {index === KIT_FILES.length - 1 ? "└──" : "├──"} {file.name}
              </span>
              <span
                style={{
                  fontFamily: LABEL_FONT,
                  fontSize: 12,
                  lineHeight: 1.35,
                  color: isActive ? "rgba(251,248,241,0.72)" : MUTED,
                }}
              >
                {file.blurb}
              </span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          border: `1.5px solid ${INK}`,
          background: CARD,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "10px 14px",
            borderBottom: `1.2px solid ${INK}`,
            fontFamily: MONO,
            fontSize: 12,
            color: MUTED,
          }}
        >
          why-we-love/{active.name}
        </div>
        <pre
          style={{
            margin: 0,
            padding: 16,
            fontFamily: MONO,
            fontSize: 12.5,
            lineHeight: 1.7,
            color: "rgba(20,20,20,0.82)",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxHeight: 460,
            overflowY: "auto",
          }}
        >
          {active.content}
        </pre>
      </div>
    </div>
  );
}
