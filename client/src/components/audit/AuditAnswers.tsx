import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AUDIT_ANSWER_KEYS, MAX_AUDIT_FEEDBACK, type AuditAnswerKey, type AuditDraft } from "@shared/audit";
import { submitAuditFeedback } from "@/components/audit/auditApi";
import { Drawing } from "@/components/audit/Drawing";
import { siteCopy } from "@/content/siteCopy";

/**
 * The four questions after the send, one at a time (JP, 2026-11-07: "el cuestionario se siente muerto").
 * Each step: a short nod to the last answer, the question in the display face, the progress in words,
 * one field (Enter sends, Shift+Enter breaks a line), quick choices on the second question, the filled
 * button to go on and a text button to skip. Every step posts the answers so far (final:false), the
 * last one closes them (final:true) and the Bottle walks off with its sheet; closing the tab midway
 * posts what there is, so nothing given is lost. The answers belong to the request just sent (`sent`).
 */

const copy = siteCopy.audit;
const ANSWERS = copy.answers;
const EMPTY: Record<AuditAnswerKey, string> = { frustration: "", outcome: "", tried: "", anything: "" };
const STEP_WORDS = ["One", "Two", "Three", "Four"];

export function AuditAnswers({ submissionId, sent }: { submissionId: string; sent: AuditDraft }) {
  const baseId = useId();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(EMPTY);
  const [phase, setPhase] = useState<"asking" | "sending" | "done" | "failed">("asking");
  const field = useRef<HTMLTextAreaElement>(null);
  const closed = useRef(false);
  // The latest answers, for the beacon on a closing tab (an effect's closure would be stale).
  const latest = useRef(answers);
  latest.current = answers;

  const question = ANSWERS[Math.min(step, ANSWERS.length - 1)];
  const last = step >= ANSWERS.length - 1;
  const answered = AUDIT_ANSWER_KEYS.some((key) => answers[key].trim());
  const previous = step > 0 ? ANSWERS[step - 1] : null;
  const nod = previous && answers[previous.key].trim() ? previous.nod : null;

  // The field takes the keyboard on every step, so a founder on a laptop types four answers without a click.
  useEffect(() => {
    if (phase === "asking") field.current?.focus({ preventScroll: true });
  }, [step, phase]);

  // The tab closing or the phone switching apps midway: what was given goes out as the closing post.
  useEffect(() => {
    const flush = () => {
      if (closed.current || document.visibilityState !== "hidden") return;
      const current = latest.current;
      if (!AUDIT_ANSWER_KEYS.some((key) => current[key].trim())) return;
      closed.current = true;
      const body = JSON.stringify({ submissionId, ...sent, ...current, final: true });
      if (!navigator.sendBeacon?.("/api/audit/feedback", new Blob([body], { type: "application/json" }))) {
        void submitAuditFeedback({ submissionId, ...sent, ...current, final: true });
      }
    };
    document.addEventListener("visibilitychange", flush);
    return () => document.removeEventListener("visibilitychange", flush);
  }, [submissionId, sent]);

  const save = (value: Record<AuditAnswerKey, string>) => {
    if (!AUDIT_ANSWER_KEYS.some((key) => value[key].trim())) return;
    // A step: kept on the server, no note yet. A failure here costs nothing; the closing post carries everything.
    void submitAuditFeedback({ submissionId, ...sent, ...value, final: false });
  };

  const close = async (value: Record<AuditAnswerKey, string>) => {
    if (!AUDIT_ANSWER_KEYS.some((key) => value[key].trim())) {
      closed.current = true;
      setPhase("done");
      return;
    }
    setPhase("sending");
    const ok = await submitAuditFeedback({ submissionId, ...sent, ...value, final: true });
    closed.current = ok;
    setPhase(ok ? "done" : "failed");
  };

  const next = (event?: FormEvent) => {
    event?.preventDefault();
    if (phase === "sending") return;
    if (last) {
      void close(answers);
      return;
    }
    save(answers);
    setStep(step + 1);
  };

  const skip = () => {
    if (phase === "sending") return;
    const cleared = { ...answers, [question.key]: "" };
    setAnswers(cleared);
    if (last) {
      void close(cleared);
      return;
    }
    setStep(step + 1);
  };

  const onKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      next();
    }
  };

  const choose = (choice: string) => {
    setAnswers((current) => {
      const text = current[question.key];
      const parts = text.split(/,\s*/).filter(Boolean);
      const on = parts.includes(choice);
      const nextParts = on ? parts.filter((part) => part !== choice) : [...parts, choice];
      return { ...current, [question.key]: nextParts.join(", ") };
    });
    field.current?.focus({ preventScroll: true });
  };

  if (phase === "done") {
    const walk = copy.steps[2];
    return (
      <div className="audit-answers audit-answers--done" role="status">
        <Drawing className="audit-answers__art" src={walk.src} clip={walk.clip} alt={walk.alt} width={560} height={560} />
        <p className="audit-answers__thanks">{answered ? copy.feedbackDone : copy.feedbackSkipped}</p>
      </div>
    );
  }

  const chosen = question.choices ? question.choices.filter((choice) => answers[question.key].split(/,\s*/).includes(choice)) : [];

  return (
    <form className="audit-answers" onSubmit={next} aria-labelledby={`${baseId}-q`}>
      <p className="audit-answers__progress">
        {nod ? <span className="audit-answers__nod">{nod} </span> : null}
        <span className="audit-answers__count">{last ? copy.answersLast : copy.answersProgress.replace("{n}", STEP_WORDS[step])}</span>
      </p>
      <label key={`q-${question.key}`} id={`${baseId}-q`} htmlFor={`${baseId}-field`} className="audit-answers__question">
        {question.label}
      </label>
      {question.hint ? <p className="audit-answers__hint">{question.hint}</p> : null}
      {question.choices ? (
        <div className="audit-answers__choices" role="group" aria-label={copy.answersChoicesLabel}>
          {question.choices.map((choice) => (
            <button key={choice} type="button" className="audit-answers__choice" aria-pressed={chosen.includes(choice)} onClick={() => choose(choice)}>
              {choice}
            </button>
          ))}
        </div>
      ) : null}
      <textarea
        key={`f-${question.key}`}
        ref={field}
        id={`${baseId}-field`}
        className="brief-input audit-answers__field"
        rows={2}
        maxLength={MAX_AUDIT_FEEDBACK}
        value={answers[question.key]}
        onChange={(event) => setAnswers((current) => ({ ...current, [question.key]: event.target.value }))}
        onKeyDown={onKey}
        readOnly={phase === "sending"}
        aria-describedby={`${baseId}-keys`}
      />
      <p id={`${baseId}-keys`} className="audit-answers__keys">
        {copy.answersKeys}
      </p>
      <div className="audit-answers__actions">
        <button type="submit" className="audit-submit audit-answers__next" aria-disabled={phase === "sending" || undefined} aria-busy={phase === "sending" || undefined}>
          {phase === "sending" ? copy.sending : phase === "failed" ? copy.retry : last ? copy.feedbackSend : copy.answersNext}
        </button>
        <button type="button" className="site-text-button" onClick={skip}>
          {last ? copy.answersSkipLast : copy.answersSkip}
        </button>
        <p className="brief-status bcheck-status" role="status" data-tone={phase === "failed" ? "error" : undefined}>
          {phase === "failed" ? copy.feedbackFailed : ""}
        </p>
      </div>
    </form>
  );
}
