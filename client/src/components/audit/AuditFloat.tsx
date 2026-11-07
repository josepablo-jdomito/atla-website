import { useEffect, useState, type RefObject } from "react";
import type { AuditStatus } from "@shared/audit";
import { AUDIT_FORM_ID, openAuditFlow } from "@/components/audit/openFlow";
import { siteCopy } from "@/content/siteCopy";

/**
 * The week, floating (JP, 2026-11-07, his pick B): a card at the bottom of the phone screen, bottom
 * right from 768. "This week" and the live mark on top, the five rings beside the count in words, the
 * one pill under. It is the only place the week lives. It shows once the hero's pill is above the
 * viewport and goes while the closing section is on screen (that one has the pill) or before the
 * first read; the page hides it once the request is sent.
 */

const copy = siteCopy.audit.float;
const week = siteCopy.audit.week;
const WORDS = ["zero", "one", "two", "three", "four", "five"];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function AuditFloat({ status, root }: { status: AuditStatus | null; root: RefObject<HTMLElement | null> }) {
  const [pastHero, setPastHero] = useState(false);
  const [closeNear, setCloseNear] = useState(false);

  // Read from the boxes on every scroll: shown once the hero's pill is above the viewport, hidden once
  // the closing section reaches the lower fifth.
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      const hero = node.querySelector(".audit-hero__action") ?? node.querySelector(".audit-hero");
      const close = document.getElementById(AUDIT_FORM_ID);
      if (!hero || !close) return;
      const height = window.innerHeight || document.documentElement.clientHeight;
      setPastHero(hero.getBoundingClientRect().bottom < 0);
      setCloseNear(close.getBoundingClientRect().top < height * 0.8);
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
  const shown = Boolean(status) && pastHero && !closeNear;

  return (
    <div className="audit-float" data-shown={shown ? "" : undefined} aria-hidden={shown ? undefined : true}>
      <p className="audit-float__head">
        <span className="site-label">{week.label}</span>
        <span className="audit-float__live">
          <span className="audit-float__pulse" aria-hidden="true" />
          {week.live}
        </span>
      </p>
      <p className="audit-float__row">
        <span className="audit-float__rings" aria-hidden="true">
          {Array.from({ length: total }, (_, index) => (
            <span key={index} className="audit-float__ring" data-taken={index < taken ? "" : undefined} />
          ))}
        </span>
        <span className="audit-float__line" aria-live="polite">
          {line}
        </span>
      </p>
      <a href={`#${AUDIT_FORM_ID}`} className="audit-submit audit-float__action" onClick={openAuditFlow} tabIndex={shown ? undefined : -1}>
        {copy.action}
      </a>
    </div>
  );
}
