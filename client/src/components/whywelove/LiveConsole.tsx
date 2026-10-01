import { useEffect, useState } from "react";
import { CARD, INK, MONO, MUTED, label } from "./styles";

const LINES = [
  { text: "$ whoami", tone: "cmd" },
  { text: "why-we-love — a brand-love framework", tone: "out" },
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

/**
 * Ink on paper, not a glowing terminal: this is a printout of a run, and the
 * one line that matters is the one left at full strength. Emphasis is weight
 * and dimming, never color.
 */
const TONE_STYLE: Record<string, { color: string; weight: number }> = {
  cmd: { color: INK, weight: 500 },
  out: { color: "rgba(20,20,20,0.55)", weight: 400 },
  ok: { color: "rgba(20,20,20,0.75)", weight: 400 },
  hit: { color: INK, weight: 600 },
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
      aria-label="Printout: loading the kit and running a cold read"
      style={{
        width: "100%",
        maxWidth: 620,
        background: CARD,
        border: `1.5px solid ${INK}`,
        boxShadow: "0 10px 24px rgba(0,0,0,.2)",
        transform: "rotate(-0.4deg)",
      }}
    >
      <div
        style={{
          padding: "10px 16px",
          borderBottom: `1.2px solid ${INK}`,
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <span style={{ ...label, fontSize: 10 }}>Live prototype</span>
        <span style={{ ...label, fontSize: 10, color: MUTED }}>cold-read</span>
      </div>

      <pre
        style={{
          margin: 0,
          padding: "16px 14px 20px",
          fontFamily: MONO,
          fontSize: 12.5,
          lineHeight: 1.8,
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
            <span
              key={index}
              style={{
                color: TONE_STYLE[line.tone].color,
                fontWeight: TONE_STYLE[line.tone].weight,
                display: "block",
              }}
            >
              {line.text.slice(0, shown) || "\u00a0"}
              {isCurrent ? <span style={{ color: INK }}>▌</span> : null}
            </span>
          );
        })}
      </pre>
    </div>
  );
}
