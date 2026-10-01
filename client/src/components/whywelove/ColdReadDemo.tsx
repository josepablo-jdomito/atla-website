import { useEffect, useRef, useState } from "react";
import { CLASSIFICATION, CLASSIFICATION_TOTAL, DAY_THREE_MESSAGE } from "@/data/whyWeLove";
import { INK, LINE, MONO, MUTED, SANS, body, card } from "./styles";

const STREAM_MS = 2600;

/**
 * The Cold-Read Ritual, run in front of the reader: 264 real posts from brides
 * of a wedding-dress brand classify themselves into the moments, live. The
 * animation starts when the section scrolls into view and runs once.
 */
export function ColdReadDemo() {
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof window === "undefined") return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setProgress(1);
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || progress >= 1) return;

    let frame = 0;
    const startedAt = performance.now();

    const step = (now: number) => {
      const ratio = Math.min((now - startedAt) / STREAM_MS, 1);
      setProgress(ratio);
      if (ratio < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
    // progress is intentionally omitted: the ramp owns it for the life of the run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  const classified = Math.round(CLASSIFICATION_TOTAL * progress);
  const max = Math.max(...CLASSIFICATION.map((row) => row.count));

  return (
    <div ref={containerRef} style={{ ...card, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 0.6, color: MUTED }}>
          cold-read --context=none
        </span>
        <span style={{ fontFamily: MONO, fontSize: 12, color: INK }} aria-live="polite">
          {classified} / {CLASSIFICATION_TOTAL} posts
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {CLASSIFICATION.map((row) => {
          const counted = Math.round(row.count * progress);
          const isLeak = row.count === max;
          return (
            <div key={row.momentId} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <span
                  style={{
                    fontFamily: SANS,
                    fontSize: 14,
                    fontWeight: isLeak ? 600 : 400,
                    color: isLeak ? INK : "#444",
                  }}
                >
                  {row.label}
                </span>
                <span style={{ fontFamily: MONO, fontSize: 13, color: isLeak ? INK : MUTED }}>
                  {counted}
                </span>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: "rgba(20,20,20,0.06)" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${(counted / max) * 100}%`,
                    borderRadius: 999,
                    background: isLeak ? INK : "rgba(20,20,20,0.3)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ ...body, fontSize: 15 }}>
        The leak was not the dress. It was the silence after they paid.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          paddingTop: 14,
          borderTop: `1px solid ${LINE}`,
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 0.6, color: MUTED }}>
          fresh agent · kit loaded · zero other context → the Day-3 message
        </span>
        <pre
          style={{
            margin: 0,
            fontFamily: SANS,
            fontSize: 15,
            lineHeight: 1.65,
            color: INK,
            whiteSpace: "pre-wrap",
            background: "#fafafa",
            border: `1px solid ${LINE}`,
            borderRadius: 10,
            padding: 16,
          }}
        >
          {DAY_THREE_MESSAGE}
        </pre>
      </div>
    </div>
  );
}
