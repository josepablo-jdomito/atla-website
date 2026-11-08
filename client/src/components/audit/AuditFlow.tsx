import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AUDIT_ANSWER_KEYS, MAX_AUDIT_FEEDBACK, auditSchema, type AuditAnswerKey, type AuditDraft, type AuditWeek } from "@shared/audit";
import { readAuditAttribution, submitAudit, submitAuditFeedback } from "@/components/audit/auditApi";
import { Drawing } from "@/components/audit/Drawing";
import { siteCopy } from "@/content/siteCopy";
import { trackAuditComplete, trackAuditFormStart, trackAuditSubmitError } from "@/lib/ga";

/**
 * The request as a flow that takes the screen, built the way Storetasker's "Get started" works on a
 * phone (JP, 2026-11-07: "quiero que el form imite y funcione como el de aquí"): a page per step, a
 * big title and one line, every field a labelled box, every choice a pill that fills in when picked,
 * the one button fixed at the bottom right with the save state beside it, "close" and "back" as
 * words at the top. Screen one is the request (the brand, the name, the email, Send); screens two
 * and three hold the four questions, two per screen, and post the answers so far after each
 * (final:false) and the closing one at the end, on exit or when the tab hides (final:true). The page
 * owns the open state and learns of the send through `onSent`.
 */

export type SentResult = { week: AuditWeek; repeat: boolean; draft: AuditDraft };

const copy = siteCopy.audit;
const flow = copy.flow;
const QUESTIONS = copy.answers;
const SCREENS: (typeof QUESTIONS)[] = [QUESTIONS.slice(0, 2), QUESTIONS.slice(2)];
const EMPTY_ANSWERS: Record<AuditAnswerKey, string> = { frustration: "", outcome: "", tried: "", anything: "" };
type Answers = Record<AuditAnswerKey, string>;
type Field = keyof AuditDraft;
type Stage = "request" | number;

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

function Arrow() {
  return (
    <svg className="audit-quiz__arrow" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9h12M10 4l5 5-5 5" />
    </svg>
  );
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
  const [stage, setStage] = useState<Stage>(sent ? 0 : "request");
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  // The questions whose "Something else" pill is open: their field shows under the pills.
  const [typing, setTyping] = useState<Partial<Record<AuditAnswerKey, boolean>>>({});
  const [phase, setPhase] = useState<"asking" | "sending" | "done" | "failed" | "rate-limited">("asking");
  const [saved, setSaved] = useState<"" | "saving" | "saved">("");
  const body = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef<HTMLInputElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const submissionId = useRef(newSubmissionId());
  const started = useRef(false);
  const closed = useRef(false);
  const latest = useRef({ answers, sent });
  latest.current = { answers, sent };

  const asking = typeof stage === "number";
  const screen = asking ? SCREENS[Math.min(stage, SCREENS.length - 1)] : null;
  const last = asking && stage >= SCREENS.length - 1;

  // Each screen starts at the top, with the first field or the title holding the keyboard.
  useEffect(() => {
    if (!open || phase === "sending" || phase === "done") return;
    body.current?.scrollTo({ top: 0 });
    if (!asking) first.current?.focus({ preventScroll: true });
    else heading.current?.focus({ preventScroll: true });
  }, [open, stage, asking, phase]);

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
      const payload = JSON.stringify({ submissionId: submissionId.current, ...request.draft, ...value, final: true });
      if (!navigator.sendBeacon?.("/api/audit/feedback", new Blob([payload], { type: "application/json" }))) {
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

  const check = (): boolean => {
    const parsed = auditSchema.safeParse({ ...draft, source: readAuditAttribution() });
    if (parsed.success) return true;
    const issues = new Set(parsed.error.issues.map((issue) => issue.path[0] as Field));
    const next: Partial<Record<Field, string>> = {};
    const keys: Field[] = ["site", "name", "email"];
    for (const key of keys) if (issues.has(key)) next[key] = ERROR_FOR[key];
    setErrors(next);
    const firstBad = keys.find((key) => next[key]);
    if (firstBad) document.getElementById(`${baseId}-${firstBad}`)?.focus();
    return !firstBad;
  };

  const sendRequest = async (event?: FormEvent) => {
    event?.preventDefault();
    if (phase === "sending") return;
    if (!check()) return;
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

  const save = async (value: Answers) => {
    const request = latest.current.sent;
    if (!request || !hasAny(value)) return;
    setSaved("saving");
    const ok = await submitAuditFeedback({ submissionId: submissionId.current, ...request.draft, ...value, final: false });
    setSaved(ok ? "saved" : "");
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

  const next = (event?: FormEvent) => {
    event?.preventDefault();
    if (phase === "sending") return;
    if (last) {
      void close(answers);
      return;
    }
    void save(answers);
    setStage(stage === "request" ? 0 : stage + 1);
  };

  const pick = (key: AuditAnswerKey, title: string) => {
    if (phase === "sending") return;
    setTyping((value) => ({ ...value, [key]: false }));
    setAnswers((value) => ({ ...value, [key]: value[key] === title ? "" : title }));
  };

  const other = (key: AuditAnswerKey) => {
    if (phase === "sending") return;
    const cards = QUESTIONS.find((question) => question.key === key)?.cards ?? [];
    setAnswers((value) => (cards.some((card) => card.title === value[key]) ? { ...value, [key]: "" } : value));
    setTyping((value) => ({ ...value, [key]: !value[key] }));
    window.setTimeout(() => document.getElementById(`${baseId}-${key}-field`)?.focus(), 0);
  };

  const back = () => {
    if (phase === "sending") return;
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

  if (!open) return null;

  const done = phase === "done";
  const walk = copy.steps[2];
  const canBack = asking && typeof stage === "number" && stage > 0 && !done;
  const requestReady = Boolean(draft.site.trim() && draft.name.trim() && draft.email.trim());
  const message = phase === "rate-limited" ? copy.rateLimited : phase === "failed" && !asking ? copy.network : phase === "failed" && asking ? copy.feedbackFailed : "";
  const buttonLabel = phase === "sending" ? copy.sending : phase === "failed" ? copy.retry : !asking ? flow.send : last ? copy.feedbackSend : copy.answersNext;
  const nod = sent ? (sent.repeat ? copy.done.repeat.line : copy.done[sent.week].line) : "";

  return (
    <div className="audit-quiz" role="dialog" aria-modal="true" aria-labelledby={`${baseId}-q`}>
      <div className="audit-quiz__bar">
        {canBack ? (
          <button type="button" className="audit-quiz__nav" onClick={back}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 9H3M8 4 3 9l5 5" />
            </svg>
            {flow.back}
          </button>
        ) : (
          <button type="button" className="audit-quiz__nav" onClick={done ? onClose : exit}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
              <path d="m4 4 10 10M14 4 4 14" />
            </svg>
            {flow.close}
          </button>
        )}
        {canBack ? (
          <button type="button" className="audit-quiz__nav audit-quiz__nav--end" onClick={exit}>
            {flow.close}
          </button>
        ) : null}
      </div>

      <div ref={body} className="audit-quiz__body">
        {done ? (
          <div className="audit-quiz__done" role="status">
            {/* The still only: a video blend inside a fixed layer shows its white box on iOS Safari. */}
            <Drawing className="audit-quiz__art" src={walk.src} alt={walk.alt} width={560} height={560} />
            <h2 className="audit-quiz__title" id={`${baseId}-q`}>
              {hasAny(answers) ? copy.feedbackDone : copy.feedbackSkipped}
            </h2>
            <p className="audit-quiz__line">{copy.answersDoneLine}</p>
          </div>
        ) : stage === "request" ? (
          <form key="request" id={`${baseId}-form`} className="audit-quiz__step" onSubmit={sendRequest} noValidate>
            <h2 ref={heading} className="audit-quiz__title" id={`${baseId}-q`}>
              {flow.requestTitle}
            </h2>
            <p className="audit-quiz__line">{flow.requestLine}</p>
            {(["site", "name", "email"] as const).map((key, index) => (
              <div key={key} className="audit-quiz__field" data-field={key}>
                <label htmlFor={`${baseId}-${key}`} className="audit-quiz__label">
                  {copy.fields[key]}
                </label>
                <input
                  ref={index === 0 ? first : undefined}
                  id={`${baseId}-${key}`}
                  className="audit-quiz__box"
                  type={key === "email" ? "email" : "text"}
                  name={key}
                  placeholder={flow.placeholders[key]}
                  autoComplete={key === "site" ? "url" : key}
                  autoCapitalize={key === "name" ? undefined : "none"}
                  spellCheck={key === "name" ? undefined : false}
                  value={draft[key]}
                  onFocus={onFieldFocus}
                  onChange={(event) => set(key, event.target.value)}
                  readOnly={phase === "sending"}
                  aria-invalid={errors[key] ? true : undefined}
                  aria-describedby={errors[key] ? `${baseId}-${key}-error` : undefined}
                />
                {errors[key] ? (
                  <p id={`${baseId}-${key}-error`} className="audit-quiz__error">
                    {errors[key]}
                  </p>
                ) : null}
              </div>
            ))}
            <div className="brief-hp" hidden>
              <label htmlFor={`${baseId}-gotcha`}>Leave this empty</label>
              <input ref={honeypot} id={`${baseId}-gotcha`} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>
            <p className="audit-quiz__privacy">{copy.privacyNotice}</p>
          </form>
        ) : screen ? (
          <form key={`screen-${stage}`} id={`${baseId}-form`} className="audit-quiz__step" onSubmit={next}>
            <h2 ref={heading} tabIndex={-1} className="audit-quiz__title" id={`${baseId}-q`}>
              {stage === 0 ? flow.questionsTitle : flow.questionsLastTitle}
            </h2>
            <p className="audit-quiz__line">{stage === 0 && nod ? `${nod} ${flow.questionsLine}` : stage === 0 ? flow.questionsLine : flow.questionsLastLine}</p>
            {screen.map((question) => {
              const current = answers[question.key];
              const chosen = question.cards?.find((card) => card.title === current);
              const open = !question.cards || typing[question.key];
              return (
                <div key={question.key} className="audit-quiz__field">
                  {question.cards ? (
                    <p className="audit-quiz__label" id={`${baseId}-${question.key}-label`}>
                      {question.label}
                    </p>
                  ) : (
                    <label htmlFor={`${baseId}-${question.key}-field`} className="audit-quiz__label">
                      {question.label}
                    </label>
                  )}
                  {question.cards ? (
                    <div className="audit-quiz__pills" role="group" aria-labelledby={`${baseId}-${question.key}-label`}>
                      {question.cards.map((card) => (
                        <button key={card.title} type="button" className="audit-quiz__pill" aria-pressed={current === card.title} onClick={() => pick(question.key, card.title)}>
                          {card.title}
                        </button>
                      ))}
                      <button type="button" className="audit-quiz__pill" aria-pressed={Boolean(typing[question.key])} onClick={() => other(question.key)}>
                        {copy.answersOther}
                      </button>
                    </div>
                  ) : null}
                  {chosen ? <p className="audit-quiz__note">{chosen.line}</p> : null}
                  {open ? (
                    <textarea
                      id={`${baseId}-${question.key}-field`}
                      className="audit-quiz__box audit-quiz__box--area"
                      aria-labelledby={question.cards ? `${baseId}-${question.key}-label` : undefined}
                      rows={3}
                      maxLength={MAX_AUDIT_FEEDBACK}
                      placeholder={question.hint ?? copy.answersOtherLine}
                      value={chosen ? "" : current}
                      onChange={(event) => setAnswers((value) => ({ ...value, [question.key]: event.target.value }))}
                      readOnly={phase === "sending"}
                    />
                  ) : null}
                </div>
              );
            })}
          </form>
        ) : null}
      </div>

      <div className="audit-quiz__foot">
        {message ? (
          <p className="audit-quiz__status" role="status" data-tone="error">
            {message}
          </p>
        ) : (
          <p className="audit-quiz__status" role="status">
            {asking && saved ? flow[saved] : ""}
          </p>
        )}
        {done ? (
          <button type="button" className="audit-quiz__go" data-ready="" onClick={onClose}>
            {copy.answersClose}
          </button>
        ) : (
          <button type="submit" form={`${baseId}-form`} className="audit-quiz__go" data-ready={asking || requestReady ? "" : undefined} aria-disabled={phase === "sending" || undefined} aria-busy={phase === "sending" || undefined}>
            {buttonLabel}
            <Arrow />
          </button>
        )}
      </div>
    </div>
  );
}
