import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { KIT_FILES } from "@/data/whyWeLove";
import { INK, LINE, MONO, MUTED, SANS, SURFACE, body } from "./styles";

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
          border: `1px solid ${LINE}`,
          borderRadius: 12,
          background: SURFACE,
          padding: 10,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: 11, color: MUTED, padding: "6px 8px" }}>
          why-we-love/
        </span>
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
                borderRadius: 8,
                padding: "9px 10px",
                background: isActive ? "rgba(20,20,20,0.06)" : "transparent",
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 13, color: INK }}>
                {index === KIT_FILES.length - 1 ? "└──" : "├──"} {file.name}
              </span>
              <span style={{ fontFamily: SANS, fontSize: 12, color: MUTED, lineHeight: 1.4 }}>
                {file.blurb}
              </span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          border: `1px solid ${LINE}`,
          borderRadius: 12,
          background: SURFACE,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "10px 14px",
            borderBottom: `1px solid ${LINE}`,
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
            color: "#2a2a2a",
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

export function KitNote() {
  return (
    <p style={{ ...body, fontSize: 14, color: MUTED }}>
      The deliverable is visible. Proof, not promises.
    </p>
  );
}
