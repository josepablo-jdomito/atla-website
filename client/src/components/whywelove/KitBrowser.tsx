import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import kit from "@/data/atlaKit.generated.json";
import { CARD, INK, LABEL_FONT, MONO, MUTED, SERIF, label } from "./styles";

/**
 * Atla's own kit, browsable. Every file is generated from this repository at
 * build time, and each one says whether it was lifted out of the running site
 * or written by the studio, so a reader can tell evidence from assertion.
 */
export function KitBrowser() {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = kit.files[activeIndex];

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "286px 1fr",
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
            gap: 3,
          }}
        >
          <span style={{ ...label, fontSize: 10, color: MUTED, padding: "6px 8px" }}>
            atla/ · generated from {kit.headSha}
          </span>
          {kit.files.map((file, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={file.path}
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
                <span style={{ fontFamily: MONO, fontSize: 12.5, color: isActive ? CARD : INK }}>
                  {file.path}
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

        <div style={{ border: `1.5px solid ${INK}`, background: CARD, overflow: "hidden" }}>
          <div
            style={{
              padding: "10px 14px",
              borderBottom: `1.2px solid ${INK}`,
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: 12, color: MUTED }}>atla/{active.path}</span>
            <span style={{ ...label, fontSize: 9 }}>
              {active.provenance.kind === "extracted" ? "Extracted from " : "Written · source of record "}
              {active.provenance.from}
            </span>
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
              maxHeight: 520,
              overflowY: "auto",
            }}
          >
            {active.content}
          </pre>
        </div>
      </div>

      <p
        style={{
          fontFamily: LABEL_FONT,
          fontSize: 13,
          lineHeight: 1.4,
          color: MUTED,
          margin: 0,
          textAlign: "center",
        }}
      >
        The extracted files are read out of the repository that builds this site each time it is
        deployed. If the site changes and the kit does not follow, the build fails.
      </p>
    </div>
  );
}

/**
 * The record of what changed and why, taken from this repository's commit log.
 * Unedited, including the parts where a decision was made and then reversed.
 */
export function DecisionHistory() {
  const [openSha, setOpenSha] = useState<string | null>(kit.decisions[0]?.sha ?? null);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 0 }}>
      {kit.decisions.map((decision) => {
        const isOpen = decision.sha === openSha;
        return (
          <div key={decision.sha} style={{ borderTop: `1.2px solid rgba(20,20,20,0.2)` }}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenSha(isOpen ? null : decision.sha)}
              style={{
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
                border: "none",
                background: "transparent",
                padding: "14px 0",
                display: "flex",
                gap: 14,
                alignItems: "baseline",
              }}
            >
              <span style={{ ...label, fontSize: 10, color: MUTED, flexShrink: 0, minWidth: 82 }}>
                {decision.date}
              </span>
              <span
                style={{
                  fontFamily: SERIF,
                  fontWeight: 300,
                  fontSize: "clamp(1.05rem, 2vw, 1.35rem)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.015em",
                  color: INK,
                  flex: 1,
                }}
              >
                {decision.subject}
              </span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: MUTED, flexShrink: 0 }}>
                {decision.sha}
              </span>
            </button>

            {isOpen ? (
              <div style={{ paddingBottom: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: LABEL_FONT,
                    fontSize: 14.5,
                    lineHeight: 1.45,
                    color: INK,
                    whiteSpace: "pre-wrap",
                    maxWidth: "62ch",
                  }}
                >
                  {decision.reasoning}
                </p>
                {decision.diff ? (
                  <pre
                    style={{
                      margin: 0,
                      padding: 14,
                      border: `1.2px solid ${INK}`,
                      background: CARD,
                      fontFamily: MONO,
                      fontSize: 11.5,
                      lineHeight: 1.65,
                      color: "rgba(20,20,20,0.8)",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      overflowX: "auto",
                    }}
                  >
                    {decision.diff}
                  </pre>
                ) : null}
                <span style={{ ...label, fontSize: 9, color: MUTED }}>
                  {decision.author} · {decision.files.length} file
                  {decision.files.length === 1 ? "" : "s"}
                </span>
              </div>
            ) : null}
          </div>
        );
      })}
      <div style={{ borderTop: `1.2px solid rgba(20,20,20,0.2)` }} />
    </div>
  );
}
