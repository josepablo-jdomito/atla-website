import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AUDIT_ANSWER_KEYS, MAX_AUDIT_FEEDBACK, type AuditAnswerKey, type AuditDraft } from "@shared/audit";
import { submitAuditFeedback } from "@/components/audit/auditApi";
import { Drawing } from "@/components/audit/Drawing";
import { siteCopy } from "@/content/siteCopy";

/**
 * The four questions after the send, as a quiz that takes the screen (JP, 2026-11-07, after AG1's
 * product quiz): one question centred, answers as cards with a title and one line, a tap moves on,
 * a line of progress at the top, back and exit. "Something else" opens a field; the last question is
 * a field. Every step posts the answers so far (final:false); the last one, an exit or the tab closing
 * posts the closing one (final:true) and the server writes the one Attio note. Closed, the page keeps
 * a line and a way back in; finished, the Bottle walks off with its sheet.
 */

const copy = siteCopy.audit;
const QUESTIONS = copy.answers;
const EMPTY: Record<AuditAnswerKey, string> = { frustration: "", outcome: "", tried: "", anything: "" };
const STEP_WORDS = ["One", "Two", "Three", "Four"];
type Answers = Record<AuditAnswerKey, string>;

const hasAny = (value: Answers) => AUDIT_ANSWER_KEYS.some((key) => value[key].trim());

export function AuditAnswers({ submissionId, sent }: { submissionId: string; sent: AuditDraft }) {
  const baseId = useId();
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  // "Something else" on a card question opens the field; the last question is the field.
  const [typing, setTyping] = useState(false);
  const [phase, setPhase] = useState<"asking" | "sending" | "done" | "failed">("asking");
  const heading = useRef<HTMLHeadingElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const closed = useRef(false);
  const latest = useRef(answers);
  latest.current = answers;

  const question = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];
  const last = step >= QUESTIONS.length - 1;
  const cards = question.cards ?? null;
  const showField = !cards || typing;
  const current = answers[question.key];
  // What the field shows: on a card question, only words that are not one of its cards.
  const fieldValue = cards && cards.some((card) => card.title === current) ? "" : current;

  // The question takes the keyboard on every step; the field when it is the way to answer.
  useEffect(() => {
    if (!open || phase !== "asking") return;
    if (showField) field.current?.focus({ preventScroll: true });
    else heading.current?.focus({ preventScroll: true });
  }, [open, step, showField, phase]);

  // The page behind does not scroll while the quiz is up.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // The tab closing or the phone switching apps midway: what was given goes out as the closing post.
  useEffect(() => {
    const flush = () => {
      if (closed.current || document.visibilityState !== "hidden") return;
      const value = latest.current;
      if (!hasAny(value)) return;
      closed.current = true;
      const body = JSON.stringify({ submissionId, ...sent, ...value, final: true });
      if (!navigator.sendBeacon?.("/api/audit/feedback", new Blob([body], { type: "application/json" }))) {
        void submitAuditFeedback({ submissionId, ...sent, ...value, final: true });
      }
    };
    document.addEventListener("visibilitychange", flush);
    return () => document.removeEventListener("visibilitychange", flush);
  }, [submissionId, sent]);

  const save = (value: Answers) => {
    if (!hasAny(value)) return;
    // A step: kept on the server, no note yet. A failure here costs nothing; the closing post carries everything.
    void submitAuditFeedback({ submissionId, ...sent, ...value, final: false });
  };

  const close = async (value: Answers) => {
    if (!hasAny(value)) {
      closed.current = true;
      setPhase("done");
      return;
    }
    setPhase("sending");
    const ok = await submitAuditFeedback({ submissionId, ...sent, ...value, final: true });
    closed.current = ok;
    setPhase(ok ? "done" : "failed");
  };

  const advance = (value: Answers) => {
    if (last) {
      void close(value);
      return;
    }
    save(value);
    setTyping(false);
    setStep(step + 1);
  };

  const pick = (title: string) => {
    if (phase === "sending") return;
    const value = { ...answers, [question.key]: title };
    setAnswers(value);
    // The card fills, then the next question comes: a beat, so the tap is seen to land.
    window.setTimeout(() => advance(value), 180);
  };

  const submitField = (event?: FormEvent) => {
    event?.preventDefault();
    if (phase === "sending") return;
    advance(answers);
  };

  const skip = () => {
    if (phase === "sending") return;
    const cleared = { ...answers, [question.key]: "" };
    setAnswers(cleared);
    advance(cleared);
  };

  const back = () => {
    if (phase === "sending") return;
    if (typing) {
      setTyping(false);
      return;
    }
    if (step > 0) setStep(step - 1);
  };

  // Leaving midway: what there is goes out now; the page keeps a way back in while nothing was written.
  const exit = () => {
    if (phase === "sending") return;
    if (hasAny(latest.current) && !closed.current) void close(latest.current);
    setOpen(false);
  };

  // Escape leaves the quiz, like its exit button.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") exit();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  const onKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submitField();
    }
  };

  const done = phase === "done";
  const walk = copy.steps[2];

  if (!open) {
    return (
      <div className="audit-answers" role="status">
        {done ? (
          <>
            <Drawing className="audit-answers__art" src={walk.src} clip={walk.clip} alt={walk.alt} width={560} height={560} />
            <p className="audit-answers__thanks">{hasAny(answers) ? copy.feedbackDone : copy.feedbackSkipped}</p>
          </>
        ) : (
          <p className="audit-answers__thanks">
            {copy.answersClosed}{" "}
            <button type="button" className="audit-done__link audit-answers__reopen" onClick={() => setOpen(true)}>
              {copy.answersReopen}
            </button>
          </p>
        )}
      </div>
    );
  }

  const progress = done ? 1 : step / QUESTIONS.length;
  const count = done ? "" : last ? copy.answersLast : copy.answersProgress.replace("{n}", STEP_WORDS[step]);

  return (
    <div className="audit-quiz" role="dialog" aria-modal="true" aria-labelledby={`${baseId}-q`}>
      <div className="audit-quiz__bar">
        <button type="button" className="audit-quiz__nav" onClick={back} disabled={done || (step === 0 && !typing)} aria-label={copy.answersBack}>
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
            <Drawing className="audit-quiz__art" src={walk.src} clip={walk.clip} alt={walk.alt} width={560} height={560} />
            <h2 className="audit-quiz__question" id={`${baseId}-q`}>
              {hasAny(answers) ? copy.feedbackDone : copy.feedbackSkipped}
            </h2>
            <p className="audit-quiz__line">{copy.answersDoneLine}</p>
            <button type="button" className="audit-submit audit-quiz__button" onClick={() => setOpen(false)}>
              {copy.answersClose}
            </button>
          </div>
        ) : (
          <div key={`${question.key}-${showField}`} className="audit-quiz__step">
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
                      <svg className="audit-quiz__card-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m6 3 5 5-5 5" />
                      </svg>
                    </button>
                  </li>
                ))}
                <li>
                  <button type="button" className="audit-quiz__card audit-quiz__card--other" onClick={() => setTyping(true)}>
                    <span className="audit-quiz__card-title">{copy.answersOther}</span>
                    <span className="audit-quiz__card-line">{copy.answersOtherLine}</span>
                  </button>
                </li>
              </ul>
            ) : (
              <form className="audit-quiz__form" onSubmit={submitField}>
                {question.hint ? <p className="audit-quiz__line">{question.hint}</p> : null}
                <textarea
                  ref={field}
                  id={`${baseId}-field`}
                  className="brief-input audit-quiz__field"
                  rows={3}
                  maxLength={MAX_AUDIT_FEEDBACK}
                  aria-label={question.label}
                  aria-describedby={`${baseId}-keys`}
                  value={fieldValue}
                  onChange={(event) => setAnswers((value) => ({ ...value, [question.key]: event.target.value }))}
                  onKeyDown={onKey}
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
                <p className="brief-status bcheck-status" role="status" data-tone={phase === "failed" ? "error" : undefined}>
                  {phase === "failed" ? copy.feedbackFailed : ""}
                </p>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
