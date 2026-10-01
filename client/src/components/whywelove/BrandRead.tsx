import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { CARD, EASE, INK, LABEL_FONT, MUTED, SERIF, label } from "./styles";
import { QuoteStrip } from "./primitives";

/** Mirrors JOURNEY_MOMENTS in server/brandRead.ts. */
const MOMENT_NAMES: Record<string, string> = {
  discovery: "Discovery",
  "first-contact": "First contact",
  purchase: "Purchase",
  wait: "The wait",
  use: "Use",
  "when-it-goes-wrong": "When it goes wrong",
  return: "Return",
};

type Result = {
  brand: string;
  category: string;
  total: number;
  counts: Array<{ momentId: string; count: number }>;
  leakMomentId: string;
  quotes: Array<{ text: string; source: string; momentId: string }>;
  verdict: string;
  sources: string[];
};

type Outcome =
  | { status: "ok"; result: Result }
  | { status: "no_corpus"; brand: string }
  | { status: "not_configured"; missing: string[] }
  | { status: "rate_limited" }
  | { status: "failed"; reason: string };

/** The job log, so the reader watches the read happen instead of a spinner. */
const STEPS = [
  "resolving the brand",
  "finding where its customers write",
  "reading every post",
  "mapping each one to a moment",
  "counting where the love leaks",
];

export function BrandRead({ onUnavailable }: { onUnavailable?: () => void } = {}) {
  const isMobile = useIsMobile();
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [brand, setBrand] = useState("");
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearInterval(timer.current);
  }, []);

  // Ask before offering. A page that invites you to run a read and then cannot
  // is worse than a page that does not offer one.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/brand-read/status")
      .then((response) => response.json())
      .then((payload: { configured?: boolean }) => {
        if (cancelled) return;
        const ready = Boolean(payload?.configured);
        setConfigured(ready);
        if (!ready) onUnavailable?.();
      })
      .catch(() => {
        if (cancelled) return;
        setConfigured(false);
        onUnavailable?.();
      });
    return () => {
      cancelled = true;
    };
  }, [onUnavailable]);

  const run = async () => {
    const trimmed = brand.trim();
    if (!trimmed || running) return;

    setRunning(true);
    setOutcome(null);
    setStep(0);

    // The steps are the real stages of the job, paced so the reader can read them.
    timer.current = window.setInterval(() => {
      setStep((previous) => Math.min(previous + 1, STEPS.length - 1));
    }, 2200);

    try {
      const response = await fetch("/api/brand-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: trimmed }),
      });
      setOutcome((await response.json()) as Outcome);
    } catch {
      setOutcome({ status: "failed", reason: "The read could not reach the server." });
    } finally {
      if (timer.current) window.clearInterval(timer.current);
      setRunning(false);
    }
  };

  // Nothing at all until we know, and nothing ever if the read cannot run.
  if (configured !== true) return null;

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 28, alignItems: "center" }}>
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 12,
          alignItems: isMobile ? "stretch" : "flex-end",
        }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <label htmlFor="wwl-brand" style={{ ...label, fontSize: 10, color: MUTED }}>
            Your brand, or your competitor’s
          </label>
          <input
            id="wwl-brand"
            value={brand}
            disabled={running}
            onChange={(event) => setBrand(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") run();
            }}
            placeholder="oatly.com"
            style={{
              fontFamily: SERIF,
              fontWeight: 300,
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              letterSpacing: "-0.015em",
              padding: "6px 0",
              border: "none",
              borderBottom: `1.5px solid ${INK}`,
              background: "transparent",
              color: INK,
              outline: "none",
              width: "100%",
            }}
          />
        </div>

        <button
          type="button"
          onClick={run}
          disabled={running}
          style={{
            ...label,
            fontSize: 11,
            minHeight: 50,
            padding: "0 22px",
            border: `1.5px solid ${INK}`,
            background: running ? "transparent" : INK,
            color: running ? MUTED : CARD,
            cursor: running ? "default" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {running ? "Reading" : "Read it"}
        </button>
      </div>

      {running ? <JobLog step={step} /> : null}

      {outcome ? <Outcome outcome={outcome} /> : null}
    </div>
  );
}

function JobLog({ step }: { step: number }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{ display: "flex", flexDirection: "column", gap: 7, alignItems: "flex-start" }}
    >
      {STEPS.slice(0, step + 1).map((text, index) => (
        <span
          key={text}
          style={{
            ...label,
            fontSize: 10,
            color: index === step ? INK : MUTED,
            opacity: index === step ? 1 : 0.5,
          }}
        >
          {index === step ? "→ " : "✓ "}
          {text}
        </span>
      ))}
    </div>
  );
}

function Outcome({ outcome }: { outcome: Outcome }) {
  if (outcome.status === "ok") return <Report result={outcome.result} />;

  const message =
    outcome.status === "no_corpus"
      ? `I could not find enough public customer writing about ${outcome.brand} to read honestly. That is its own finding: nobody is talking about you where strangers can see it.`
      : outcome.status === "rate_limited"
        ? "That is five reads in an hour from here. Come back later, or bring the brand to a Brand Read."
        : outcome.status === "not_configured"
          ? "The live read is not switched on yet."
          : outcome.reason;

  return (
    <p
      style={{
        fontFamily: SERIF,
        fontWeight: 300,
        fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)",
        lineHeight: 1.25,
        letterSpacing: "-0.015em",
        color: INK,
        textAlign: "center",
        maxWidth: "42ch",
        margin: 0,
      }}
    >
      {message}
    </p>
  );
}

function Report({ result }: { result: Result }) {
  const max = Math.max(...result.counts.map((entry) => entry.count), 1);
  const leak = result.counts.find((entry) => entry.momentId === result.leakMomentId);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 40, alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
        <span style={{ ...label, fontSize: 10, color: MUTED }}>
          {result.total} posts · {result.sources.join(" · ")} · {result.category}
        </span>
        <span
          className="wwl-bleed"
          style={{
            fontFamily: SERIF,
            fontWeight: 300,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.015em",
            color: INK,
            textAlign: "center",
          }}
        >
          The love leaks at{" "}
          <em>{(MOMENT_NAMES[result.leakMomentId] ?? result.leakMomentId).toLowerCase()}</em>.
        </span>
      </div>

      <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: 11 }}>
        {result.counts.map((entry) => {
          const isLeak = entry.momentId === result.leakMomentId;
          return (
            <div key={entry.momentId} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <span style={{ ...label, fontSize: 10, color: isLeak ? INK : MUTED, opacity: isLeak ? 1 : 0.55 }}>
                  {MOMENT_NAMES[entry.momentId] ?? entry.momentId}
                </span>
                <span style={{ ...label, fontSize: 10, color: isLeak ? INK : MUTED, opacity: isLeak ? 1 : 0.55 }}>
                  {entry.count}
                </span>
              </div>
              <div style={{ height: 7, background: "rgba(20,20,20,0.08)" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${(entry.count / max) * 100}%`,
                    background: INK,
                    opacity: isLeak ? 1 : 0.28,
                    transition: `width 700ms ${EASE.arrive}`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {result.quotes.length > 0 ? (
        <div
          style={{
            width: "100%",
            maxWidth: 620,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <span style={{ ...label, fontSize: 10, color: MUTED, textAlign: "center" }}>
            In their words, not mine
          </span>
          {result.quotes.map((quote, index) => (
            <QuoteStrip
              key={quote.text}
              source={quote.source}
              quote={quote.text}
              rotate={index % 2 === 0 ? -1.1 : 0.9}
            />
          ))}
        </div>
      ) : null}

      <p
        style={{
          fontFamily: SERIF,
          fontWeight: 300,
          fontSize: "clamp(1.2rem, 2.4vw, 1.65rem)",
          lineHeight: 1.28,
          letterSpacing: "-0.015em",
          color: INK,
          maxWidth: "46ch",
          textAlign: "center",
          margin: 0,
          textWrap: "pretty",
        }}
      >
        {result.verdict}
      </p>

      <div
        style={{
          width: "100%",
          maxWidth: 560,
          borderTop: `1.5px solid ${INK}`,
          paddingTop: 20,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          alignItems: "center",
        }}
      >
        <span style={{ ...label, fontSize: 10, color: MUTED }}>Where this read stops</span>
        <p
          style={{
            fontFamily: LABEL_FONT,
            fontSize: "1rem",
            lineHeight: 1.35,
            color: INK,
            maxWidth: "48ch",
            textAlign: "center",
            margin: 0,
          }}
        >
          That is one moment, found in public, in {leak ? leak.count : "a handful of"} posts strangers
          wrote. A Brand Read does it on everything your customers actually send you, names the three
          or four moments worth building, and writes the touchpoints that fill them.
        </p>
        <a
          href="https://www.atla.design/contact"
          style={{
            ...label,
            fontSize: 11,
            textDecoration: "none",
            border: `1.5px solid ${INK}`,
            background: INK,
            color: CARD,
            padding: "16px 26px",
            display: "inline-flex",
            alignItems: "center",
            minHeight: 48,
            boxSizing: "border-box",
          }}
        >
          Book a Brand Read
        </a>
      </div>
    </div>
  );
}
