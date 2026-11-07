import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AUDIT_ANSWER_KEYS, MAX_AUDIT_FEEDBACK, auditSchema, type AuditAnswerKey, type AuditDraft, type AuditWeek } from "@shared/audit";
import { readAuditAttribution, submitAudit, submitAuditFeedback } from "@/components/audit/auditApi";
import { Drawing } from "@/components/audit/Drawing";
import { siteCopy } from "@/content/siteCopy";
import { trackAuditComplete, trackAuditFormStart, trackAuditSubmitError } from "@/lib/ga";

/**
 * The request as a flow that takes the screen (JP, 2026-11-07, after AG1's product quiz): the brand,
 * then the name and the email, the send, then the four questions, one per screen, answers as cards
 * with a title and one line, a tap moves on. A hairline of progress at the top, back and exit, Escape
 * leaves. "Something else" opens a field; the last question is a field. Every answered question posts
 * the answers so far (final:false); the last one, an exit or the tab closing posts the closing one
 * (final:true) and the server writes the one Attio note. The page owns the open state and learns of
 * the send through `onSent`; the flow keeps the draft and the answers while the page lives.
 */

export type SentResult = { week: AuditWeek; repeat: boolean; draft: AuditDraft };

const copy = siteCopy.audit;
const flow = copy.flow;
const QUESTIONS = copy.answers;
const EMPTY_ANSWERS: Record<AuditAnswerKey, string> = { frustration: "", outcome: "", tried: "", anything: "" };
const STEP_WORDS = ["One", "Two", "Three", "Four", "Five", "Six"];
type Answers = Record<AuditAnswerKey, string>;
type Field = keyof AuditDraft;
type Stage = "brand" | "you" | number;

const ERROR_FOR: Record<Field, string> = { name: copy.nameError, email: copy.emailError, site: copy.siteError };
const hasAny = (value: Answers) => AUDIT_ANSWER_KEYS.some((key) => value[key].trim());

export function newSubmissionId(): string {
  try {
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
    return Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }
}

export function AuditFlow({
  open,
  sent,
  onClose,
  onSent,
  onDone,
}: {
  open: boolean;
  /** The request already delivered, if any: the flow then starts at the questions. */
  sent: SentResult | null;
  onClose: () => void;
  onSent: (result: SentResult) => void;
  /** The questions closed (answered or skipped): the page stops offering them. */
  onDone: () => void;
}) {
  const baseId = useId();
  const [draft, setDraft] = useState<AuditDraft>({ name: "", email: "", site: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [stage, setStage] = useState<Stage>(sent ? 0 : "brand");
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [typing, setTyping] = useState(false);
  const [phase, setPhase] = useState<"asking" | "sending" | "done" | "failed" | "rate-limited">("asking");
  const heading = useRef<HTMLHeadingElement>(null);
  const field = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const submissionId = useRef(newSubmissionId());
  const started = useRef(false);
  const closed = useRef(false);
  const latest = useRef({ answers, sent });
  latest.current = { answers, sent };

  const asking = typeof stage === "number";
  const step = asking ? stage : -1;
  const question = asking ? QUESTIONS[Math.min(step, QUESTIONS.length - 1)] : null;
  const last = asking && step >= QUESTIONS.length - 1;
  const cards = question?.cards ?? null;
  const showField = asking && (!cards || typing);
  const current = question ? answers[question.key] : "";
  const fieldValue = cards && cards.some((card) => card.title === current) ? "" : current;
  const stepIndex = stage === "brand" ? 0 : stage === "you" ? 1 : 2 + step;
  const total = 2 + QUESTIONS.length;

  // The question takes the keyboard on every screen; the field when it is the way to answer.
  useEffect(() => {
    if (!open || phase === "sending" || phase === "done") return;
    if (!asking || showField) field.current?.focus({ preventScroll: true });
    else heading.current?.focus({ preventScroll: true });
  }, [open, stage, showField, asking, phase]);

  // The page behind does not scroll while the flow is up.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // The tab closing midway through the questions: what was given goes out as the closing post.
  useEffect(() => {
    const flush = () => {
      if (closed.current || document.visibilityState !== "hidden") return;
      const { answers: value, sent: request } = latest.current;
      if (!request || !hasAny(value)) return;
      closed.current = true;
      const body = JSON.stringify({ submissionId: submissionId.current, ...request.draft, ...value, final: true });
      if (!navigator.sendBeacon?.("/api/audit/feedback", new Blob([body], { type: "application/json" }))) {
        void submitAuditFeedback({ submissionId: submissionId.current, ...request.draft, ...value, final: true });
      }
    };
    document.addEventListener("visibilitychange", flush);
    return () => document.removeEventListener("visibilitychange", flush);
  }, []);

  const set = (key: Field, value: string) => {
    setDraft((value0) => ({ ...value0, [key]: value }));
    if (errors[key]) setErrors((value0) => ({ ...value0, [key]: undefined }));
  };

  const onFieldFocus = () => {
    if (started.current) return;
    started.current = true;
    trackAuditFormStart();
  };

  const check = (keys: Field[]): boolean => {
    const parsed = auditSchema.safeParse({ ...draft, source: readAuditAttribution() });
    if (parsed.success) return true;
    const issues = new Set(parsed.error.issues.map((issue) => issue.path[0] as Field));
    const next: Partial<Record<Field, string>> = {};
    for (const key of keys) if (issues.has(key)) next[key] = ERROR_FOR[key];
    setErrors(next);
    const first = keys.find((key) => next[key]);
    if (first) document.getElementById(`${baseId}-${first}`)?.focus();
    return !first;
  };

  const sendRequest = async (event?: FormEvent) => {
    event?.preventDefault();
    if (phase === "sending") return;
    if (!check(["name", "email"])) return;
    const parsed = auditSchema.safeParse({ ...draft, source: readAuditAttribution() });
    if (!parsed.success) return;
    setPhase("sending");
    const result = await submitAudit(parsed.data, submissionId.current, honeypot.current?.value ?? "");
    if (result.status === "ok") {
      trackAuditComplete(submissionId.current);
      const delivered: SentResult = { week: result.week, repeat: result.repeat, draft: { name: parsed.data.name, email: parsed.data.email, site: parsed.data.site } };
      onSent(delivered);
      setPhase("asking");
      setStage(0);
      return;
    }
    trackAuditSubmitError(result.status === "rate-limited" ? "rate_limited" : "failed");
    setPhase(result.status);
  };

  const save = (value: Answers) => {
    const request = latest.current.sent;
    if (!request || !hasAny(value)) return;
    void submitAuditFeedback({ submissionId: submissionId.current, ...request.draft, ...value, final: false });
  };

  const close = async (value: Answers) => {
    const request = latest.current.sent;
    if (!request || !hasAny(value)) {
      closed.current = true;
      setPhase("done");
      onDone();
      return;
    }
    setPhase("sending");
    const ok = await submitAuditFeedback({ submissionId: submissionId.current, ...request.draft, ...value, final: true });
    closed.current = ok;
    setPhase(ok ? "done" : "failed");
    if (ok) onDone();
  };

  const advance = (value: Answers) => {
    if (last) {
      void close(value);
      return;
    }
    save(value);
    setTyping(false);
    setStage(step + 1);
  };

  const pick = (title: string) => {
    if (!question || phase === "sending") return;
    const value = { ...answers, [question.key]: title };
    setAnswers(value);
    window.setTimeout(() => advance(value), 180);
  };

  const submitField = (event?: FormEvent) => {
    event?.preventDefault();
    if (phase === "sending") return;
    advance(answers);
  };

  const skip = () => {
    if (!question || phase === "sending") return;
    const cleared = { ...answers, [question.key]: "" };
    setAnswers(cleared);
    advance(cleared);
  };

  const back = () => {
    if (phase === "sending") return;
    if (stage === "you") {
      setStage("brand");
      return;
    }
    if (typing) {
      setTyping(false);
      return;
    }
    if (typeof stage === "number" && stage > 0) setStage(stage - 1);
  };

  const exit = () => {
    if (phase === "sending") return;
    if (asking && hasAny(latest.current.answers) && !closed.current) void close(latest.current.answers);
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") exit();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  const onFieldKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submitField();
    }
  };

  const brandNext = (event: FormEvent) => {
    event.preventDefault();
    if (check(["site"])) setStage("you");
  };

  if (!open) return null;

  const done = phase === "done";
  const walk = copy.steps[2];
  const progress = done ? 1 : stepIndex / total;
  const count = done ? "" : last ? copy.answersLast : copy.answersProgress.replace("{n}", STEP_WORDS[stepIndex]).replace("{total}", "six");
  const backDisabled = done || stage === "brand" || (stage === 0 && !typing);
  const sendLabel = phase === "sending" ? copy.sending : phase === "failed" ? copy.retry : flow.send;
  const message = phase === "rate-limited" ? copy.rateLimited : phase === "failed" && !asking ? copy.network : phase === "failed" && asking ? copy.feedbackFailed : "";

  return (
    <div className="audit-quiz" role="dialog" aria-modal="true" aria-labelledby={`${baseId}-q`}>
      <div className="audit-quiz__bar">
        <button type="button" className="audit-quiz__nav" onClick={back} disabled={backDisabled} aria-label={copy.answersBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12.5 4 6.5 10l6 6" />
          </svg>
        </button>
        <span className="audit-quiz__count" aria-live="polite">
          {count}
        </span>
        <button type="button" className="audit-quiz__nav" onClick={exit} aria-label={copy.answersExit}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="m5 5 10 10M15 5 5 15" />
          </svg>
        </button>
      </div>
      <div className="audit-quiz__progress" aria-hidden="true">
        <span className="audit-quiz__progress-fill" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <div className="audit-quiz__body">
        {done ? (
          <div className="audit-quiz__done" role="status">
            {/* The still only: a video blend inside a fixed layer shows its white box on iOS Safari. */}
            <Drawing className="audit-quiz__art" src={walk.src} alt={walk.alt} width={560} height={560} />
            <h2 className="audit-quiz__question" id={`${baseId}-q`}>
              {hasAny(answers) ? copy.feedbackDone : copy.feedbackSkipped}
            </h2>
            <p className="audit-quiz__line">{copy.answersDoneLine}</p>
            <button type="button" className="audit-submit audit-quiz__button" onClick={onClose}>
              {copy.answersClose}
            </button>
          </div>
        ) : stage === "brand" ? (
          <form key="brand" className="audit-quiz__step" onSubmit={brandNext} noValidate>
            {/* The Bottle climbing into the envelope: the page's cast walks into the flow. */}
            <Drawing className="audit-quiz__cast" src={copy.steps[0].src} clip={copy.steps[0].clip} alt="" width={560} height={560} eager />
            <h2 ref={heading} className="audit-quiz__question" id={`${baseId}-q`}>
              {flow.brandTitle}
            </h2>
            <p className="audit-quiz__line">{flow.brandLine}</p>
            <div className="audit-quiz__form">
              <div className="brief-field" data-field="site">
                <label htmlFor={`${baseId}-site`} className="brief-field__label">
                  {copy.fields.site}
                </label>
                <input
                  ref={field as React.RefObject<HTMLInputElement>}
                  id={`${baseId}-site`}
                  className="brief-input audit-quiz__input"
                  type="text"
                  name="site"
                  autoComplete="url"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={draft.site}
                  onFocus={onFieldFocus}
                  onChange={(event) => set("site", event.target.value)}
                  aria-invalid={errors.site ? true : undefined}
                  aria-describedby={errors.site ? `${baseId}-site-error` : undefined}
                />
                {errors.site ? (
                  <p id={`${baseId}-site-error`} className="brief-field__error">
                    {errors.site}
                  </p>
                ) : null}
              </div>
              <div className="audit-quiz__actions">
                <button type="submit" className="audit-submit audit-quiz__button">
                  {copy.answersNext}
                </button>
              </div>
            </div>
          </form>
        ) : stage === "you" ? (
          <form key="you" className="audit-quiz__step" onSubmit={sendRequest} noValidate>
            <h2 ref={heading} className="audit-quiz__question" id={`${baseId}-q`}>
              {flow.youTitle}
            </h2>
            <p className="audit-quiz__line">{flow.youLine}</p>
            <div className="audit-quiz__form">
              {(["name", "email"] as const).map((key, index) => (
                <div key={key} className="brief-field" data-field={key}>
                  <label htmlFor={`${baseId}-${key}`} className="brief-field__label">
                    {copy.fields[key]}
                  </label>
                  <input
                    ref={index === 0 ? (field as React.RefObject<HTMLInputElement>) : undefined}
                    id={`${baseId}-${key}`}
                    className="brief-input audit-quiz__input"
                    type={key === "email" ? "email" : "text"}
                    name={key}
                    autoComplete={key}
                    autoCapitalize={key === "email" ? "none" : undefined}
                    spellCheck={key === "email" ? false : undefined}
                    value={draft[key]}
                    onChange={(event) => set(key, event.target.value)}
                    readOnly={phase === "sending"}
                    aria-invalid={errors[key] ? true : undefined}
                    aria-describedby={errors[key] ? `${baseId}-${key}-error` : undefined}
                  />
                  {errors[key] ? (
                    <p id={`${baseId}-${key}-error`} className="brief-field__error">
                      {errors[key]}
                    </p>
                  ) : null}
                </div>
              ))}
              <div className="brief-hp" hidden>
                <label htmlFor={`${baseId}-gotcha`}>Leave this empty</label>
                <input ref={honeypot} id={`${baseId}-gotcha`} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" defaultValue="" />
              </div>
              <div className="audit-quiz__actions">
                <button type="submit" className="audit-submit audit-quiz__button" aria-disabled={phase === "sending" || undefined} aria-busy={phase === "sending" || undefined}>
                  {sendLabel}
                </button>
              </div>
              <p className="brief-status bcheck-status" role="status" data-tone={message ? "error" : undefined}>
                {message}
              </p>
              <p className="audit-quiz__privacy">{copy.privacyNotice}</p>
            </div>
          </form>
        ) : question ? (
          <div key={`${question.key}-${showField}`} className="audit-quiz__step">
            {step === 0 && sent ? <p className="audit-quiz__nod">{sent.repeat ? copy.done.repeat.line : copy.done[sent.week].line}</p> : null}
            <h2 ref={heading} tabIndex={-1} className="audit-quiz__question" id={`${baseId}-q`}>
              {question.label}
            </h2>
            {!showField && cards ? (
              <ul className="audit-quiz__cards">
                {cards.map((card) => (
                  <li key={card.title}>
                    <button type="button" className="audit-quiz__card" aria-pressed={current === card.title} onClick={() => pick(card.title)}>
                      <span className="audit-quiz__card-title">{card.title}</span>
                      <span className="audit-quiz__card-line">{card.line}</span>
                      <span className="audit-quiz__card-ring" aria-hidden="true" />
                    </button>
                  </li>
                ))}
                <li>
                  <button type="button" className="audit-quiz__card audit-quiz__card--other" onClick={() => setTyping(true)}>
                    <span className="audit-quiz__card-title">{copy.answersOther}</span>
                    <span className="audit-quiz__card-line">{copy.answersOtherLine}</span>
                    <span className="audit-quiz__card-ring" aria-hidden="true" />
                  </button>
                </li>
              </ul>
            ) : (
              <form className="audit-quiz__form" onSubmit={submitField}>
                {question.hint ? <p className="audit-quiz__line">{question.hint}</p> : null}
                <textarea
                  ref={field as React.RefObject<HTMLTextAreaElement>}
                  id={`${baseId}-field`}
                  className="brief-input audit-quiz__field"
                  rows={3}
                  maxLength={MAX_AUDIT_FEEDBACK}
                  aria-label={question.label}
                  aria-describedby={`${baseId}-keys`}
                  value={fieldValue}
                  onChange={(event) => setAnswers((value) => ({ ...value, [question.key]: event.target.value }))}
                  onKeyDown={onFieldKey}
                  readOnly={phase === "sending"}
                />
                <p id={`${baseId}-keys`} className="audit-quiz__keys">
                  {copy.answersKeys}
                </p>
                <div className="audit-quiz__actions">
                  <button type="submit" className="audit-submit audit-quiz__button" aria-disabled={phase === "sending" || undefined} aria-busy={phase === "sending" || undefined}>
                    {phase === "sending" ? copy.sending : phase === "failed" ? copy.retry : last ? copy.feedbackSend : copy.answersNext}
                  </button>
                  <button type="button" className="site-text-button" onClick={skip}>
                    {last ? copy.answersSkipLast : copy.answersSkip}
                  </button>
                </div>
                <p className="brief-status bcheck-status" role="status" data-tone={message ? "error" : undefined}>
                  {message}
                </p>
              </form>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
