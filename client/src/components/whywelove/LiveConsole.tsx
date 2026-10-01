import { useEffect, useState } from "react";
import { MONO } from "./styles";

const LINES = [
  { text: "$ whoami", tone: "cmd" },
  { text: "atla — brand systems studio", tone: "out" },
  { text: "", tone: "out" },
  { text: "$ load why-we-love/", tone: "cmd" },
  { text: "✓ moments.md        5 moments · 25 touchpoints", tone: "ok" },
  { text: "✓ voice.md          tone, rules, examples", tone: "ok" },
  { text: "✓ cold-read.md      the ritual, step by step", tone: "ok" },
  { text: "", tone: "out" },
  { text: "$ run cold-read --context=none", tone: "cmd" },
  { text: "→ reading 264 posts… mapping to moments…", tone: "out" },
  { text: "→ leak found: the wait after purchase (141 of 264)", tone: "hit" },
] as const;

const TONE_COLOR: Record<string, string> = {
  cmd: "#eaeaea",
  out: "#9b9b9b",
  ok: "#7fd1a4",
  hit: "#f0c674",
};

const CHAR_MS = 14;
/** A line break costs this many character ticks, so lines land with a beat between them. */
const LINE_PAUSE_CHARS = 12;

/** Character offset at which each line starts typing. */
const LINE_OFFSETS = LINES.reduce<number[]>((offsets, line, index) => {
  const previous = index === 0 ? 0 : offsets[index - 1] + LINES[index - 1].text.length + LINE_PAUSE_CHARS;
  offsets.push(previous);
  return offsets;
}, []);

const TOTAL_CHARS =
  LINE_OFFSETS[LINE_OFFSETS.length - 1] + LINES[LINES.length - 1].text.length;

/**
 * Terminal header that types itself once on mount. Cosmetic but deliberate:
 * the framework ships as files, not opinions. Respects reduced-motion by
 * rendering the finished transcript immediately.
 */
export function LiveConsole() {
  const [typed, setTyped] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setDone(true);
      return;
    }

    let timer = 0;
    const tick = () => {
      setTyped((previous) => {
        const next = previous + 1;
        if (next >= TOTAL_CHARS) setDone(true);
        return next;
      });
      timer = window.setTimeout(tick, CHAR_MS);
    };

    timer = window.setTimeout(tick, 320);
    return () => window.clearTimeout(timer);
  }, []);


  return (
    <div
      className="atla-theme-preserve"
      aria-label="Terminal transcript: loading the why-we-love kit and running a cold read"
      style={{
        background: "#111111",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.10)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span style={{ width: 9, height: 9, borderRadius: 999, background: "#3d3d3d" }} />
        <span style={{ width: 9, height: 9, borderRadius: 999, background: "#3d3d3d" }} />
        <span style={{ width: 9, height: 9, borderRadius: 999, background: "#3d3d3d" }} />
        <span
          style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: 0.6,
            textTransform: "uppercase",
            color: "#7a7a7a",
            marginLeft: 6,
          }}
        >
          Live prototype
        </span>
      </div>

      <pre
        style={{
          margin: 0,
          padding: "16px 14px 20px",
          fontFamily: MONO,
          fontSize: 13,
          lineHeight: 1.75,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          minHeight: 268,
        }}
      >
        {LINES.map((line, index) => {
          const consumed = done ? line.text.length : typed - LINE_OFFSETS[index];
          if (consumed < 0) return null;
          const shown = Math.min(consumed, line.text.length);
          const isCurrent = !done && consumed <= line.text.length;
          return (
            <span key={index} style={{ color: TONE_COLOR[line.tone], display: "block" }}>
              {line.text.slice(0, shown) || "\u00a0"}
              {isCurrent ? <span style={{ color: "#eaeaea" }}>▌</span> : null}
            </span>
          );
        })}
      </pre>
    </div>
  );
}
