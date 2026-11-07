import { useEffect, useState, type RefObject } from "react";
import type { AuditStatus } from "@shared/audit";
import { AUDIT_FORM_ID, openAuditFlow } from "@/components/audit/openFlow";
import { siteCopy } from "@/content/siteCopy";

/**
 * The week, floating (JP, 2026-11-07: "un widget flotante en la pantalla sin importar el scroll"): a
 * pill at the bottom of the screen (the site's floating surface, like the Explore pill) with the five
 * rings, the count in words with the live mark beating, and the one way to the form. It shows once the hero's strip is behind and goes
 * while the form section is on screen (the form has its own button) or before the first read.
 */

const copy = siteCopy.audit.float;
const WORDS = ["zero", "one", "two", "three", "four", "five"];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function AuditFloat({ status, root }: { status: AuditStatus | null; root: RefObject<HTMLElement | null> }) {
  const [pastStrip, setPastStrip] = useState(false);
  const [formNear, setFormNear] = useState(false);

  // Read from the boxes on every scroll (an observer can miss a jump in some engines): shown once the
  // strip's bottom is above the viewport, hidden once the form section reaches the lower fifth.
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      const strip = node.querySelector(".audit-slots");
      const form = document.getElementById(AUDIT_FORM_ID);
      if (!strip || !form) return;
      const height = window.innerHeight || document.documentElement.clientHeight;
      setPastStrip(strip.getBoundingClientRect().bottom < 0);
      setFormNear(form.getBoundingClientRect().top < height * 0.8);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [root]);

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
  const shown = Boolean(status) && pastStrip && !formNear;

  return (
    <div className="audit-float" data-shown={shown ? "" : undefined} aria-hidden={shown ? undefined : true}>
      <ol className="audit-float__rings" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <li key={index} className="audit-slots__ring" data-taken={index < taken ? "" : undefined} />
        ))}
      </ol>
      <p className="audit-float__line">
        <span className="audit-slots__pulse" aria-hidden="true" />
        {line}
      </p>
      <a href={`#${AUDIT_FORM_ID}`} className="audit-submit audit-submit--compact audit-float__action" onClick={openAuditFlow} tabIndex={shown ? undefined : -1}>
        <span>{copy.action}</span>
        {/* On a phone the pill is the whole widget, so the count rides inside it, on one line. */}
        <span className="audit-float__count" aria-hidden="true">
          {line}
        </span>
      </a>
    </div>
  );
}
