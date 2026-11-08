import type { RefObject } from "react";
import type { AuditStatus } from "@shared/audit";
import { AUDIT_FORM_ID, openAuditFlow } from "@/components/audit/openFlow";
import { siteCopy } from "@/content/siteCopy";

/**
 * The week, floating (JP, 2026-11-07, his pick B): a card at the bottom of the phone screen, bottom
 * right from 768. "This week" and the live mark on top, the five rings beside the count in words, the
 * one pill under. It is the only place the week lives and the one door to the flow (the poster
 * composition, JP 2026-11-07): there from the first read, gone once the request is sent.
 */

const copy = siteCopy.audit.float;
const week = siteCopy.audit.week;
const WORDS = ["zero", "one", "two", "three", "four", "five"];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function AuditFloat({
  status,
}: {
  status: AuditStatus | null;
  root?: RefObject<HTMLElement | null>;
}) {
  const total = status?.cap ?? 5;
  const taken = status?.taken ?? 0;
  const left = Math.max(0, total - taken);
  const line = !status
    ? ""
    : status.week === "full" || left === 0
      ? copy.full
      : taken === 0
        ? copy.open
        : left === 1
          ? copy.lastOne
          : cap(copy.left.replace("{left}", WORDS[left] ?? String(left)));
  // The one door on the page, there from the first read of the week.
  const shown = Boolean(status);

  return (
    <div
      className="audit-float"
      data-shown={shown ? "" : undefined}
      aria-hidden={shown ? undefined : true}
    >
      <p className="audit-float__row">
        {/* No rings while none is taken: five empty rings read as no demand (CRO review). */}
        <span
          className="audit-float__rings"
          aria-hidden="true"
          hidden={taken === 0}
        >
          {Array.from({ length: total }, (_, index) => (
            <span
              key={index}
              className="audit-float__ring"
              data-taken={index < taken ? "" : undefined}
            />
          ))}
        </span>
        <span className="audit-float__line" aria-live="polite">
          {line}
        </span>
        <span className="audit-float__live">
          <span className="audit-float__pulse" aria-hidden="true" />
          {week.live}
        </span>
      </p>
      <a
        href={`#${AUDIT_FORM_ID}`}
        className="audit-submit audit-float__action"
        onClick={openAuditFlow}
        tabIndex={shown ? undefined : -1}
      >
        {copy.action}
      </a>
    </div>
  );
}
