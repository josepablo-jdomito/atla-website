import { useEffect, useState } from "react";
import type { AuditStatus } from "@shared/audit";
import { siteCopy } from "@/content/siteCopy";

/**
 * This week's five, as a live widget (JP, 2026-11-07: "se tiene que sentir como un live widget para
 * que piensen que es real"). Five slots drawn as rings, the taken ones filled; a pulsing mark and
 * "Updated just now" that ages; the page polls /api/audit/status. Numbers stay in words
 * ("two of five spots left"). Before the first read, and when a read fails, the neutral line shows
 * and no ring is filled.
 */

const copy = siteCopy.audit.week;
const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const inWords = (n: number) => WORDS[n] ?? String(n);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function ageLine(updatedAt: number | null, now: number): string {
  if (!updatedAt) return "";
  const seconds = Math.round((now - updatedAt) / 1000);
  if (seconds < 20) return copy.updatedNow;
  if (seconds < 90) return copy.updatedMoment;
  return copy.updatedMinutes;
}

export function AuditSlots({ status, updatedAt }: { status: AuditStatus | null; updatedAt: number | null }) {
  const [now, setNow] = useState(() => Date.now());
  // The "updated" line ages on its own, so the widget never says "just now" for an hour.
  useEffect(() => {
    if (!updatedAt) return;
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 10_000);
    return () => clearInterval(timer);
  }, [updatedAt]);

  const total = status?.cap ?? 5;
  const taken = status?.taken ?? 0;
  const left = Math.max(0, total - taken);
  const line = !status
    ? copy.neutral
    : status.week === "full" || left === 0
      ? copy.full
      : taken === 0
        ? copy.empty
        : left === 1
        ? copy.lastOne.replace("{cap}", inWords(total))
        : cap(copy.left.replace("{left}", inWords(left)).replace("{cap}", inWords(total)));

  return (
    <div className="audit-slots" data-state={!status ? "pending" : status.week} aria-live="polite">
      <p className="audit-slots__head">
        <span className="site-label">{copy.label}</span>
        <span className="audit-slots__live" aria-hidden={status ? undefined : true}>
          <span className="audit-slots__pulse" aria-hidden="true" />
          {copy.live}
        </span>
      </p>
      <ol className="audit-slots__rings" aria-label={line}>
        {Array.from({ length: total }, (_, index) => (
          <li key={index} className="audit-slots__ring" data-taken={index < taken ? "" : undefined} aria-hidden="true" />
        ))}
      </ol>
      <p className="audit-slots__line">{line}</p>
      <p className="audit-slots__meta">
        {status ? (
          <>
            <span>{ageLine(updatedAt, now)}</span>
            <span className="audit-slots__sep" aria-hidden="true">
              ·
            </span>
          </>
        ) : null}
        <span>{copy.resets}</span>
      </p>
    </div>
  );
}
