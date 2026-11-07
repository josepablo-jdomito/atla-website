import { useEffect, useId, useRef, useState } from "react";
import { Link, useSearch } from "wouter";
import type { AuditStatus, AuditWeek } from "@shared/audit";
import { formatMetaTitle } from "@shared/siteSeo";
import { PageShell } from "@/components/site/PageShell";
import { SeoHead, useNoindex } from "@/components/seo/SeoHead";
import { fetchAuditStatus, readAuditAttribution } from "@/components/audit/auditApi";
import { AuditSlots } from "@/components/audit/AuditSlots";
import { AuditFloat } from "@/components/audit/AuditFloat";
import { AuditFlow, newSubmissionId, type SentResult } from "@/components/audit/AuditFlow";
import { AUDIT_FORM_ID, AUDIT_OPEN_EVENT, openAuditFlow } from "@/components/audit/openFlow";
import { useAuditMotion } from "@/components/audit/useMotion";
import { Drawing } from "@/components/audit/Drawing";
import { siteCopy } from "@/content/siteCopy";
import { trackAuditView } from "@/lib/ga";

/**
 * The free audit (/audit, JP 2026-11-07): a landing page. The offer in the title, JP's own line opening
 * the lead and his name signing it, the week's five as a live widget (AuditSlots, and AuditFloat once
 * it scrolls away), three drawn steps, the ledger of brands, then the closing section: the statement,
 * the one pill, the three assurances. The request itself is the flow that takes the screen
 * (AuditFlow): the brand, the name and the email, the send, then the four questions. Every door on the
 * page is the same pill; the plain form stays under <noscript>. Delivered like the brand check
 * (server/audit/route.ts).
 */

const copy = siteCopy.audit;
const INSTAGRAM_JP = "https://www.instagram.com/jdomito_/";
export { AUDIT_FORM_ID, openAuditFlow as goToForm };

type Done = AuditWeek | "repeat";

export default function Audit() {
  const baseId = useId();
  const [slots, setSlots] = useState<AuditStatus | null>(null);
  const [slotsAt, setSlotsAt] = useState<number | null>(null);
  const [flowOpen, setFlowOpen] = useState(false);
  const [sent, setSent] = useState<SentResult | null>(null);
  const [answered, setAnswered] = useState(false);
  // ?sent= comes back from the plain form route (/api/audit/form) when the form was sent without scripts.
  const search = useSearch();
  const arrived = new URLSearchParams(search).get("sent");
  const arrivedDone: Done | null = arrived === "open" || arrived === "full" ? arrived : null;
  const done: Done | null = sent ? (sent.repeat ? "repeat" : sent.week) : arrivedDone;
  const doneHeading = useRef<HTMLHeadingElement>(null);
  const root = useRef<HTMLDivElement>(null);
  useAuditMotion(root);
  useNoindex(done !== null);

  // The visit's source is read on arrival (the utm_* are on this first URL) and sent with the request.
  useEffect(() => {
    readAuditAttribution();
    trackAuditView();
  }, []);

  // Every pill on the page (header, hero, floating week, closing) opens the flow through one event.
  useEffect(() => {
    const open = (event: Event) => {
      event.preventDefault();
      setFlowOpen(true);
    };
    window.addEventListener(AUDIT_OPEN_EVENT, open);
    return () => window.removeEventListener(AUDIT_OPEN_EVENT, open);
  }, []);

  // The widget reads the week on mount, every half minute while the tab is visible, and when the
  // visitor comes back to the tab.
  useEffect(() => {
    const controller = new AbortController();
    const read = () => {
      if (document.visibilityState === "hidden") return;
      void fetchAuditStatus(controller.signal).then((value) => {
        if (controller.signal.aborted || !value) return;
        setSlots(value);
        setSlotsAt(Date.now());
      });
    };
    read();
    const timer = setInterval(read, 30_000);
    document.addEventListener("visibilitychange", read);
    return () => {
      controller.abort();
      clearInterval(timer);
      document.removeEventListener("visibilitychange", read);
    };
  }, []);

  useEffect(() => {
    if (done && !flowOpen) doneHeading.current?.focus();
  }, [done, flowOpen]);

  const onSent = (result: SentResult) => {
    setSent(result);
    if (result.repeat) return;
    // The visitor's own request takes a ring at once; the next poll confirms it.
    setSlots((current) => {
      const total = current?.cap ?? 5;
      const taken = Math.min(total, (current?.taken ?? 0) + 1);
      return { week: result.week === "full" || taken >= total ? "full" : "open", taken, cap: total, last: current?.last ?? 0 };
    });
    setSlotsAt(Date.now());
  };

  const finished = done ? copy.done[done] : null;
  const sentWeek: AuditWeek | null = done === "open" || done === "full" ? done : null;
  const walk = copy.steps[2];

  return (
    <PageShell landing>
      <SeoHead title={formatMetaTitle(copy.metaTitle, "Atla")} description={copy.metaDescription} pathname="/audit" />
      <div ref={root} className="site-page-body audit">
        <section className="audit-hero" aria-labelledby={`${baseId}-title`}>
          <div className="audit-hero__text">
            <h1 id={`${baseId}-title`} className="page-intro__title audit-hero__title">
              {copy.title}
            </h1>
            <p className="audit-hero__lead">{copy.lead}</p>
            <p className="audit-hero__byline">{copy.byline}</p>
            {done ? null : (
              <p className="audit-hero__action">
                <a href={`#${AUDIT_FORM_ID}`} className="audit-submit audit-hero__button" onClick={openAuditFlow}>
                  {copy.cta}
                </a>
              </p>
            )}
          </div>
          <figure className="audit-hero__art">
            <Drawing src={copy.heroArt.src} clip={copy.heroArt.clip} alt={copy.heroArt.alt} width={copy.heroArt.width} height={copy.heroArt.height} eager />
          </figure>
        </section>

        <AuditSlots status={slots} updatedAt={slotsAt} sent={sentWeek} />
        {done ? null : <AuditFloat status={slots} root={root} />}

        <section className="audit-how" aria-labelledby={`${baseId}-how`}>
          <h2 id={`${baseId}-how`} className="site-section-title audit-how__title" data-reveal>
            {copy.howTitle}
          </h2>
          <ol className="audit-steps">
            {copy.steps.map((step, index) => (
              <li key={step.src} className="audit-step" data-reveal style={{ ["--i" as string]: index }}>
                {/* Step numbers, the one place on the site with digits (JP, 2026-11-07: "agrega números al how it works"). */}
                <span className="site-label audit-step__number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Drawing className="audit-step__art" src={step.src} clip={step.clip} alt={step.alt} width={560} height={560} eager={index < 3} />
                <p className="audit-step__line">{step.line}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="audit-proof" aria-labelledby={`${baseId}-proof`}>
          <div className="audit-proof__head">
            <h2 id={`${baseId}-proof`} className="site-section-title audit-proof__title">
              {copy.proofTitle}
            </h2>
            <p className="audit-proof__line">{copy.proofLine}</p>
          </div>
          <ul className="audit-ledger">
            {copy.proofRows.map((row) => (
              <li key={row.name} className="audit-ledger__row" style={{ ["--mark-scale" as string]: row.scale }}>
                <span className="audit-ledger__name">{row.name}</span>
                <span className="audit-ledger__what">{row.what}</span>
                <span className="audit-ledger__proof">
                  {row.badge ? <img src={row.badge} alt="" width={24} height={24} loading="lazy" decoding="async" /> : null}
                  {row.proof}
                </span>
                <img className="audit-ledger__mark" src={row.mark} alt={`${row.name} logo`} width={row.width} height={row.height} loading="lazy" decoding="async" />
              </li>
            ))}
          </ul>
        </section>

        <section id={AUDIT_FORM_ID} className="audit-close" aria-labelledby={`${baseId}-close`}>
          {finished ? (
            <div className="audit-done">
              <h2 id={`${baseId}-close`} ref={doneHeading} tabIndex={-1} className="audit-close__title">
                {finished.title}
              </h2>
              <p className="audit-done__line">{finished.line}</p>
              <p className="audit-done__follow">
                {copy.doneFollow}{" "}
                <a href={INSTAGRAM_JP} target="_blank" rel="noopener noreferrer" className="audit-done__link">
                  {copy.doneFollowLink}
                </a>
              </p>
              {sent ? (
                <div className="audit-answers" role="status">
                  {answered ? (
                    <>
                      <Drawing className="audit-answers__art" src={walk.src} clip={walk.clip} alt={walk.alt} width={560} height={560} />
                      <p className="audit-answers__thanks">{copy.feedbackDone}</p>
                    </>
                  ) : (
                    <p className="audit-answers__thanks">
                      {copy.answersClosed}{" "}
                      <button type="button" className="audit-done__link audit-answers__reopen" onClick={() => setFlowOpen(true)}>
                        {copy.answersReopen}
                      </button>
                    </p>
                  )}
                </div>
              ) : null}
              <p>
                <Link href="/" className="site-text-button">
                  {copy.doneHome}
                </Link>
              </p>
            </div>
          ) : (
            <>
              <h2 id={`${baseId}-close`} className="audit-close__title">
                {copy.closeTitle}
              </h2>
              <p className="audit-close__line">{copy.closeLine}</p>
              <p className="audit-close__action">
                <a href={`#${AUDIT_FORM_ID}-form`} className="audit-submit audit-close__button" onClick={openAuditFlow}>
                  {copy.cta}
                </a>
              </p>
              <ul className="audit-close__assurances">
                {copy.assurances.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              {/* Without scripts the pill cannot open the flow: the plain form posts to /api/audit/form instead. */}
              <noscript>
                <form id={`${AUDIT_FORM_ID}-form`} className="audit-form audit-form--plain" method="post" action="/api/audit/form">
                  <input type="hidden" name="submissionId" value={newSubmissionId()} />
                  <div className="brief-fields">
                    {(["site", "name", "email"] as const).map((key) => (
                      <div key={key} className="brief-field" data-field={key}>
                        <label htmlFor={`${baseId}-plain-${key}`} className="brief-field__label">
                          {copy.fields[key]}
                        </label>
                        <input id={`${baseId}-plain-${key}`} className="brief-input" type={key === "email" ? "email" : "text"} name={key} required />
                      </div>
                    ))}
                  </div>
                  <button type="submit" className="audit-submit">
                    {copy.cta}
                  </button>
                  <p className="brief-privacy bcheck-privacy">
                    {copy.privacyNotice} <Link href="/privacy">{copy.privacyLink}</Link>
                  </p>
                </form>
              </noscript>
            </>
          )}
        </section>
      </div>
      <AuditFlow open={flowOpen} sent={sent} onClose={() => setFlowOpen(false)} onSent={onSent} onDone={() => setAnswered(true)} />
    </PageShell>
  );
}
