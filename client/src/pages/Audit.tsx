import { useEffect, useId, useRef, useState } from "react";
import { Link, useSearch } from "wouter";
import type { AuditStatus, AuditWeek } from "@shared/audit";
import { formatMetaTitle } from "@shared/siteSeo";
import { PageShell } from "@/components/site/PageShell";
import { SeoHead, useNoindex } from "@/components/seo/SeoHead";
import {
  fetchAuditStatus,
  readAuditAttribution,
} from "@/components/audit/auditApi";
import { AuditFloat } from "@/components/audit/AuditFloat";
import {
  AuditFlow,
  newSubmissionId,
  type SentResult,
} from "@/components/audit/AuditFlow";
import {
  AUDIT_FORM_ID,
  AUDIT_OPEN_EVENT,
  openAuditFlow,
} from "@/components/audit/openFlow";
import { useAuditMotion } from "@/components/audit/useMotion";
import { Drawing } from "@/components/audit/Drawing";
import { siteCopy } from "@/content/siteCopy";
import { trackAuditView } from "@/lib/ga";

/**
 * The free audit (/audit, JP 2026-11-07): a landing page. The offer in the title, JP's own line opening
 * the lead, the week's five as a floating card (AuditFloat, the only place the week lives), three drawn steps, the ledger of brands, then the closing section: the statement,
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
  const [flowOpen, setFlowOpen] = useState(false);
  const [sent, setSent] = useState<SentResult | null>(null);
  const [answered, setAnswered] = useState(false);
  // ?sent= comes back from the plain form route (/api/audit/form) when the form was sent without scripts.
  const search = useSearch();
  const arrived = new URLSearchParams(search).get("sent");
  const arrivedDone: Done | null =
    arrived === "open" || arrived === "full" ? arrived : null;
  const arrivedError = arrived === "error";
  const done: Done | null = sent
    ? sent.repeat
      ? "repeat"
      : sent.week
    : arrivedDone;
  const doneHeading = useRef<HTMLHeadingElement>(null);
  const root = useRef<HTMLDivElement>(null);
  useAuditMotion(root);

  // While the flow is up, the page behind it is inert: focus and the virtual cursor cannot leave the sheet.
  useEffect(() => {
    if (!flowOpen) return;
    const others = [
      root.current,
      ...Array.from(
        document.querySelectorAll<HTMLElement>(
          ".site-header, .site-footer, .consent",
        ),
      ),
    ].filter(Boolean) as HTMLElement[];
    others.forEach((el) => el.setAttribute("inert", ""));
    return () => others.forEach((el) => el.removeAttribute("inert"));
  }, [flowOpen]);
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
      return {
        week: result.week === "full" || taken >= total ? "full" : "open",
        taken,
        cap: total,
        last: current?.last ?? 0,
      };
    });
  };

  const finished = done ? copy.done[done] : null;
  const walk = copy.steps[2];

  return (
    <PageShell landing>
      <SeoHead
        title={formatMetaTitle(copy.metaTitle, "Atla")}
        description={copy.metaDescription}
        pathname="/audit"
      />
      <div ref={root} className="site-page-body audit">
        <section className="audit-hero" aria-labelledby={`${baseId}-title`}>
          <div className="audit-hero__text">
            <h1 id={`${baseId}-title`} className="audit-hero__title">
              {copy.title}
            </h1>
            <p className="audit-hero__lead">{copy.lead}</p>
          </div>
          {/* The poster: the Inspector large, running off the right edge and the bottom. */}
          <figure className="audit-hero__art" aria-hidden="true">
            <Drawing
              src={copy.heroArt.src}
              clip={copy.heroArt.clip}
              alt=""
              width={copy.heroArt.width}
              height={copy.heroArt.height}
              eager
            />
          </figure>
        </section>

        {done ? null : <AuditFloat status={slots} root={root} />}

        <section className="audit-how" aria-labelledby={`${baseId}-how`}>
          <h2
            id={`${baseId}-how`}
            className="site-section-title audit-how__title"
          >
            {copy.howTitle}
          </h2>
          {/* One scene: the three drawings on one ground line, a caption under each; on a phone it slides. */}
          <ol
            className="audit-scene"
            data-reveal
            tabIndex={0}
            aria-labelledby={`${baseId}-how`}
          >
            {copy.steps.map((step, index) => (
              <li
                key={step.src}
                className="audit-scene__panel"
                style={{ ["--i" as string]: index }}
              >
                <Drawing
                  className="audit-scene__art"
                  src={step.src}
                  clip={step.clip}
                  alt={step.alt}
                  width={560}
                  height={560}
                  eager={index < 3}
                />
                <p className="audit-scene__caption">
                  {/* Step numbers, the one place on the site with digits (JP, 2026-11-07: "agrega números al how it works"). */}
                  <span className="audit-scene__number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {step.line}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="audit-proof" aria-labelledby={`${baseId}-proof`}>
          <div className="audit-proof__head">
            <h2
              id={`${baseId}-proof`}
              className="site-section-title audit-proof__title"
            >
              {copy.proofTitle}
            </h2>
            <p className="audit-proof__line">{copy.proofLine}</p>
          </div>
          <ul className="audit-ledger">
            {copy.proofRows.map((row) => (
              <li
                key={row.name}
                className="audit-ledger__row"
                style={{ ["--mark-scale" as string]: row.scale }}
              >
                <span className="audit-ledger__mark">
                  <img
                    src={row.mark}
                    alt={row.name}
                    width={row.width}
                    height={row.height}
                    loading="lazy"
                    decoding="async"
                  />
                  {row.badge ? (
                    <img
                      className="audit-ledger__seal"
                      src={row.badge}
                      alt=""
                      width={40}
                      height={40}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </span>
                <span className="audit-ledger__proof">{row.proof}</span>
              </li>
            ))}
          </ul>
        </section>

        <section
          id={AUDIT_FORM_ID}
          className="audit-close"
          aria-labelledby={`${baseId}-close`}
        >
          {finished ? (
            <div className="audit-done">
              <div className="audit-done__text">
                <h2
                  id={`${baseId}-close`}
                  ref={doneHeading}
                  tabIndex={-1}
                  className="audit-close__title"
                >
                  {finished.title}
                </h2>
                <p className="audit-done__line">{finished.line}</p>
                <p className="audit-done__follow">
                  {copy.doneFollow}{" "}
                  <a
                    href={INSTAGRAM_JP}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="audit-done__link"
                  >
                    {copy.doneFollowLink}
                  </a>
                </p>
                {sent && !answered ? (
                  <div className="audit-done__ask">
                    <p className="audit-done__line">{copy.answersClosed}</p>
                    <button
                      type="button"
                      className="audit-submit audit-done__button"
                      onClick={() => setFlowOpen(true)}
                    >
                      {copy.answersReopen}
                    </button>
                  </div>
                ) : null}
                <p className="audit-done__home">
                  <Link href="/" className="site-text-button">
                    {copy.doneHome}
                  </Link>
                </p>
              </div>
              {/* The Bottle walks off with its sheet, running off the edge like the Inspector did. */}
              <figure className="audit-done__art" aria-hidden="true">
                <Drawing src={walk.src} alt="" width={560} height={560} />
              </figure>
            </div>
          ) : (
            <>
              <h2 id={`${baseId}-close`} className="audit-close__label">
                {copy.psLabel}
              </h2>
              <div className="audit-close__note">
                {copy.ps.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              {/* The second door, at the second point of intent (CRO review, 2026-11-07). */}
              <button
                type="button"
                className="audit-submit audit-close__cta"
                onClick={openAuditFlow}
              >
                {copy.cta}
              </button>
              {arrivedError ? (
                <p
                  className="audit-quiz__status audit-close__status"
                  role="alert"
                  data-tone="error"
                >
                  {copy.network}
                </p>
              ) : null}
              {/* Without scripts the pill cannot open the flow: the plain form posts to /api/audit/form instead. */}
              <noscript>
                <form
                  id={`${AUDIT_FORM_ID}-form`}
                  className="audit-form audit-form--plain"
                  method="post"
                  action="/api/audit/form"
                >
                  {/* No submissionId here: a prerendered one would be the same for every visitor and the server would drop every send after the first (red team, 2026-11-07). The server mints one. */}
                  <div className="brief-fields">
                    {(["site", "name", "email"] as const).map((key) => (
                      <div key={key} className="brief-field" data-field={key}>
                        <label
                          htmlFor={`${baseId}-plain-${key}`}
                          className="brief-field__label"
                        >
                          {copy.fields[key]}
                        </label>
                        <input
                          id={`${baseId}-plain-${key}`}
                          className="brief-input"
                          type={key === "email" ? "email" : "text"}
                          name={key}
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <button type="submit" className="audit-submit">
                    {copy.cta}
                  </button>
                  <p className="brief-privacy bcheck-privacy">
                    {copy.privacyNotice}{" "}
                    <Link href="/privacy">{copy.privacyLink}</Link>
                  </p>
                </form>
              </noscript>
            </>
          )}
        </section>
      </div>
      <AuditFlow
        open={flowOpen}
        sent={sent}
        onClose={() => {
          setFlowOpen(false);
          // Focus goes back to the door the visitor came through.
          window.setTimeout(
            () =>
              (
                document.querySelector<HTMLElement>(
                  ".audit-float__action, .audit-done__button, .audit-close__title",
                ) ?? undefined
              )?.focus(),
            0,
          );
        }}
        onSent={onSent}
        onDone={() => setAnswered(true)}
      />
    </PageShell>
  );
}
