import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { coldRead, type ColdReadVerdict } from "@/lib/coldRead";
import { CASE_01_CELL, GRADING_RULES, MOMENTS, TOUCHPOINT_SLOTS } from "@/data/whyWeLove";
import { CARD, EASE, INK, LABEL_FONT, LINE, MUTED, SERIF, body, card, label } from "./styles";

type CellKey = `${string}:${number}`;

function cellKey(momentId: string, slot: number): CellKey {
  return `${momentId}:${slot}`;
}

const CASE_KEY = cellKey(CASE_01_CELL.momentId, CASE_01_CELL.slot);

/**
 * The 5x5 map. Empty by design: the filled map is what a Brand Read produces.
 * One cell is filled (Case 01) so the reader can see the shape of an answer,
 * and every other cell takes a draft and runs the cold read on it.
 */
export function MomentMap() {
  const isMobile = useIsMobile();
  const [openCell, setOpenCell] = useState<CellKey | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [verdicts, setVerdicts] = useState<Record<string, ColdReadVerdict>>({});
  const [error, setError] = useState("");

  const runColdRead = (key: CellKey, momentName: string) => {
    const verdict = coldRead(drafts[key] ?? "", momentName);
    if (!verdict) {
      setError("Write the touchpoint first. One line is enough.");
      return;
    }
    setError("");
    setVerdicts((previous) => ({ ...previous, [key]: verdict }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "180px repeat(5, 1fr)",
          gap: 8,
        }}
      >
        {MOMENTS.map((moment) => (
          <div
            key={moment.id}
            style={{
              display: "contents",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                padding: isMobile ? "12px 2px 2px" : "10px 12px 10px 0",
                justifyContent: "center",
              }}
            >
              <span style={{ ...label, fontSize: 10, color: MUTED }}>
                {String(moment.index).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontFamily: SERIF,
                  fontWeight: 300,
                  fontSize: "1.25rem",
                  lineHeight: 1.05,
                  letterSpacing: "-0.015em",
                  color: INK,
                }}
              >
                {moment.name}
              </span>
              <span style={{ fontFamily: LABEL_FONT, fontSize: 12.5, color: MUTED, lineHeight: 1.35 }}>
                {moment.whatItIs}
              </span>
            </div>

            <div
              style={{
                display: isMobile ? "grid" : "contents",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 8,
              }}
            >
              {TOUCHPOINT_SLOTS.map((slotLabel, slotIndex) => {
                const key = cellKey(moment.id, slotIndex);
                const isCase = key === CASE_KEY;
                const isOpen = openCell === key;
                const hasDraft = Boolean((drafts[key] ?? "").trim());

                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={isOpen}
                    aria-label={
                      isCase
                        ? `${moment.name}, touchpoint ${slotLabel}: ${CASE_01_CELL.label}`
                        : `${moment.name}, touchpoint ${slotLabel}: empty. Write a touchpoint and cold-read it.`
                    }
                    onClick={() => {
                      if (isCase) return;
                      setError("");
                      setOpenCell(isOpen ? null : key);
                    }}
                    style={{
                      minHeight: isMobile ? 56 : 64,
                      padding: isMobile ? 8 : 10,
                      textAlign: "left",
                      cursor: isCase ? "default" : "pointer",
                      borderRadius: 0,
                      boxSizing: "border-box",
                      fontFamily: LABEL_FONT,
                      fontSize: 12,
                      lineHeight: 1.35,
                      transition: `border-color 180ms ${EASE.arrive}, background 180ms ${EASE.arrive}`,
                      border: isCase || isOpen ? `1.5px solid ${INK}` : `1.2px dashed ${LINE}`,
                      background: isCase ? INK : hasDraft ? CARD : "transparent",
                      color: isCase ? CARD : hasDraft ? INK : MUTED,
                    }}
                  >
                    {isCase ? (
                      <>
                        <span style={{ ...label, fontSize: 9, opacity: 0.75 }}>Case 01</span>
                        <br />
                        {isMobile ? "Day-3 message" : CASE_01_CELL.label}
                      </>
                    ) : (
                      <>
                        <span style={{ ...label, fontSize: 9, opacity: 0.6 }}>{slotLabel}</span>
                        <br />
                        {/* On phones a 60px cell cannot hold a sentence, so the draft lives in the panel below. */}
                        {isMobile ? (hasDraft ? "drafted" : "+") : hasDraft ? drafts[key] : "empty"}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {openCell ? (
        <ColdReadPanel
          momentName={MOMENTS.find((moment) => openCell.startsWith(`${moment.id}:`))?.name ?? ""}
          draft={drafts[openCell] ?? ""}
          onDraftChange={(value) => setDrafts((previous) => ({ ...previous, [openCell]: value }))}
          onRun={() =>
            runColdRead(
              openCell,
              MOMENTS.find((moment) => openCell.startsWith(`${moment.id}:`))?.name ?? "this moment",
            )
          }
          verdict={verdicts[openCell]}
          error={error}
        />
      ) : (
        <p style={{ ...body, fontSize: 14, color: MUTED }}>
          Tap any empty cell. Write the touchpoint you would put there, then have a cold agent read it.
        </p>
      )}
    </div>
  );
}

function ColdReadPanel({
  momentName,
  draft,
  onDraftChange,
  onRun,
  verdict,
  error,
}: {
  momentName: string;
  draft: string;
  onDraftChange: (value: string) => void;
  onRun: () => void;
  verdict?: ColdReadVerdict;
  error: string;
}) {
  return (
    <div style={{ ...card, display: "flex", flexDirection: "column", gap: 14 }}>
      <label
        htmlFor="why-we-love-draft"
        style={{ ...label, fontSize: 11 }}
      >
        {momentName}: write the touchpoint you would put here.
      </label>

      <input
        id="why-we-love-draft"
        value={draft}
        onChange={(event) => onDraftChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") onRun();
        }}
        placeholder="A handwritten note in the box, signed by whoever made it"
        style={{
          fontFamily: SERIF,
          fontWeight: 300,
          fontSize: "1.25rem",
          letterSpacing: "-0.015em",
          padding: "12px 14px",
          borderRadius: 0,
          border: "none",
          borderBottom: `1.5px solid ${INK}`,
          background: "transparent",
          color: INK,
          outline: "none",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={onRun}
          style={{
            ...label,
            fontSize: 11,
            minHeight: 46,
            padding: "0 20px",
            border: `1.5px solid ${INK}`,
            background: INK,
            color: CARD,
            cursor: "pointer",
          }}
        >
          Cold-read my draft
        </button>
        {error ? (
          <span style={{ fontFamily: LABEL_FONT, fontSize: 13, color: INK, fontStyle: "italic" }}>{error}</span>
        ) : (
          <span style={{ fontFamily: LABEL_FONT, fontSize: 13, color: MUTED }}>
            No context about your brand. Only the rules in moments.md.
          </span>
        )}
      </div>

      {verdict ? (
        <div
          role="status"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            paddingTop: 14,
            borderTop: `1px solid ${LINE}`,
          }}
        >
          <VerdictLine tag="Understood" text={verdict.understood} />
          <VerdictLine tag="Invented" text={verdict.invented} />
          <VerdictLine tag="Missing" text={verdict.missing} />

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingTop: 4 }}>
            {GRADING_RULES.map((rule, index) => {
              const passed = verdict.passed.includes(index);
              return (
                <span
                  key={rule}
                  title={rule}
                  style={{
                    ...label,
                    fontSize: 9,
                    padding: "5px 9px",
                    border: `1.2px solid ${INK}`,
                    color: passed ? CARD : INK,
                    background: passed ? INK : "transparent",
                    opacity: passed ? 1 : 0.4,
                  }}
                >
                  {passed ? "PASS" : "FAIL"} · rule {index + 1}
                </span>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function VerdictLine({ tag, text }: { tag: string; text: string }) {
  return (
    <p style={{ ...body, fontSize: 14.5, display: "flex", gap: 12, alignItems: "baseline" }}>
      <span
        style={{
          ...label,
          fontSize: 10,
          color: MUTED,
          minWidth: 74,
          flexShrink: 0,
        }}
      >
        {tag}
      </span>
      <span>{text}</span>
    </p>
  );
}
