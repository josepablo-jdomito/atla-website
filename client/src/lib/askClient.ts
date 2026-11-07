import { useCallback, useEffect, useRef, useState } from "react";
import { siteCopy } from "@/content/siteCopy";
import { ASK_LINKS, ASK_MAX_CHARS, ASK_MAX_TURNS, type AskAnswer, type AskEvent, type AskHref, type AskLink } from "@shared/ask";
import { trackAskTurn } from "@/lib/askEvents";

/**
 * Ask in the browser: the conversation, the stream and whether Ask is on.
 *
 * The conversation lives in sessionStorage only (gone when the tab closes): never localStorage, never
 * analytics. Only the last turns travel to /api/ask, each cut to ASK_MAX_CHARS.
 */

export type AskTurn =
  | { role: "visitor"; text: string }
  | { role: "atla"; text: string; slugs: string[]; links: AskLink[] }
  /**
   * A fixed line from the site, never sent back to the server. `kind` picks what sits under it: an error
   * offers Try again, a limit or Ask resting offers the page links (older stored notes have no kind).
   */
  | { role: "note"; text: string; kind?: AskNoteKind };

export type AskNoteKind = "error" | "limited" | "unavailable";
const NOTE_KINDS: readonly string[] = ["error", "limited", "unavailable"];

/** A request with no word back for this long ends as an error note with Try again (states report 7). */
export const ASK_TIMEOUT_MS = 25_000;

export const ASK_STORAGE_KEY = "atla-ask";
const AVAILABLE_KEY = "atla-ask-available";

const QUESTION_START = /^(how|what|what's|whats|who|who's|do|does|can|could|is|are|why|where|which|when|should|would|tell me|show me)\b/i;

/** A sentence that reads as a question: it ends in "?" or starts like one. Single words stay a search. */
export function looksLikeQuestion(value: string): boolean {
  const text = value.trim();
  if (!text) return false;
  if (text.endsWith("?")) return true;
  return QUESTION_START.test(text) && /\s\S/.test(text);
}

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

/** A turn read back from sessionStorage is data, not code: check its shape and the link allowlist before it renders. */
function isStoredTurn(t: unknown): t is AskTurn {
  if (!t || typeof t !== "object") return false;
  const turn = t as Record<string, unknown>;
  if (typeof turn.text !== "string") return false;
  if (turn.role === "visitor") return true;
  if (turn.role === "note") return turn.kind === undefined || NOTE_KINDS.includes(turn.kind as string);
  if (turn.role !== "atla") return false;
  if (!Array.isArray(turn.slugs) || !turn.slugs.every((s) => typeof s === "string")) return false;
  return (
    Array.isArray(turn.links) &&
    turn.links.every((l) => {
      const link = l as Record<string, unknown> | null;
      return !!link && typeof link.href === "string" && Object.hasOwn(ASK_LINKS, link.href) && link.label === ASK_LINKS[link.href as AskHref];
    })
  );
}

export function readTurns(): AskTurn[] {
  try {
    const raw = storage()?.getItem(ASK_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter(isStoredTurn) : [];
  } catch {
    return [];
  }
}

function writeTurns(turns: AskTurn[]) {
  try {
    if (turns.length) storage()?.setItem(ASK_STORAGE_KEY, JSON.stringify(turns));
    else storage()?.removeItem(ASK_STORAGE_KEY);
  } catch {
    // A private window without storage keeps the conversation in memory only.
  }
}

/** The turns the server sees: visitor and Atla only, the last ASK_MAX_TURNS, each within ASK_MAX_CHARS. */
export function turnsForServer(turns: AskTurn[]) {
  return turns
    .filter((t): t is Exclude<AskTurn, { role: "note" }> => t.role !== "note")
    .slice(-ASK_MAX_TURNS)
    .map((t) => ({ role: t.role, text: t.text.trim().slice(0, ASK_MAX_CHARS) }))
    .filter((t) => t.text.length > 0);
}

/** Splits a server-sent-event body into AskEvents. Returns the events and the unfinished tail. */
export function parseAskEvents(buffer: string): { events: AskEvent[]; rest: string } {
  const blocks = buffer.split("\n\n");
  const rest = blocks.pop() ?? "";
  const events: AskEvent[] = [];
  for (const block of blocks) {
    const data = block
      .split("\n")
      .filter((line) => line.startsWith("data: "))
      .map((line) => line.slice(6))
      .join("");
    if (!data) continue;
    try {
      events.push(JSON.parse(data) as AskEvent);
    } catch {
      // A malformed event is skipped; the stream goes on.
    }
  }
  return { events, rest };
}

type StreamHandlers = {
  onDelta: (text: string) => void;
  onReset: () => void;
  /** Called on every sign of life (the response, each event), so a timeout can measure silence, not length. */
  onProgress?: () => void;
  signal?: AbortSignal;
};
export type AskOutcome = { kind: "answer"; answer: AskAnswer } | { kind: "note"; text: string; note: AskNoteKind };

const newKey = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `ask-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

/** POST /api/ask and read the stream to its end. Never throws: failures come back as a note from the copy. */
export async function streamAsk(turns: AskTurn[], handlers: StreamHandlers): Promise<AskOutcome> {
  const { ask } = siteCopy;
  let res: Response;
  try {
    res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: turnsForServer(turns), idempotencyKey: newKey() }),
      signal: handlers.signal,
    });
  } catch {
    return { kind: "note", text: ask.error, note: "error" };
  }
  handlers.onProgress?.();
  if (res.status === 503) return { kind: "note", text: ask.unavailable, note: "unavailable" };
  if (res.status === 429) return { kind: "note", text: ask.limited, note: "limited" };
  if (!res.ok || !res.body) return { kind: "note", text: ask.error, note: "error" };

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    for (;;) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      const { events, rest } = parseAskEvents(done ? `${buffer}\n\n` : buffer);
      buffer = rest;
      if (events.length) handlers.onProgress?.();
      for (const event of events) {
        if (event.type === "delta") handlers.onDelta(event.text);
        else if (event.type === "reset") handlers.onReset();
        else if (event.type === "done") return { kind: "answer", answer: event.answer };
        else if (event.type === "error") return { kind: "note", text: ask.error, note: "error" };
      }
      if (done) break;
    }
  } catch {
    return { kind: "note", text: ask.error, note: "error" };
  }
  return { kind: "note", text: ask.error, note: "error" };
}

function readAvailable(): boolean | null {
  const value = storage()?.getItem(AVAILABLE_KEY);
  return value === "1" ? true : value === "0" ? false : null;
}

/** The conversation and the stream, for the Explore pill. `available` is false until the server says yes. */
export function useAsk() {
  const [turns, setTurns] = useState<AskTurn[]>([]);
  const [available, setAvailable] = useState(false);
  const [pending, setPending] = useState(false);
  const [partial, setPartial] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const turnsRef = useRef<AskTurn[]>([]);

  const commit = useCallback((next: AskTurn[]) => {
    turnsRef.current = next;
    setTurns(next);
    writeTurns(next);
  }, []);

  const probed = useRef(false);
  useEffect(() => {
    commit(readTurns());
    const known = readAvailable();
    if (known !== null) {
      probed.current = true;
      setAvailable(known);
    }
  }, [commit]);

  /**
   * Asks the server once per tab whether Ask can answer. Lazy: it runs when the visitor first opens the
   * pill, so a visit that never touches it (and every search) makes no request.
   */
  const probe = useCallback(() => {
    if (probed.current) return;
    probed.current = true;
    fetch("/api/ask", { headers: { Accept: "application/json" } })
      .then(async (res) => {
        const json = res.ok && res.headers.get("content-type")?.includes("json") ? ((await res.json()) as { available?: unknown }) : null;
        return json?.available === true;
      })
      .catch(() => false)
      .then((yes) => {
        setAvailable(yes);
        try {
          storage()?.setItem(AVAILABLE_KEY, yes ? "1" : "0");
        } catch {
          // Without storage the check simply runs again next visit.
        }
      });
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, ASK_MAX_CHARS);
      if (!text || abortRef.current) return;
      const asked = [...turnsRef.current, { role: "visitor" as const, text }];
      commit(asked);
      setPending(true);
      setPartial("");
      const controller = new AbortController();
      abortRef.current = controller;
      // 25 s of silence (no response, no event) aborts the request and ends in the error note.
      let timedOut = false;
      let timer = 0;
      const arm = () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          timedOut = true;
          controller.abort();
        }, ASK_TIMEOUT_MS);
      };
      arm();
      const outcome = await streamAsk(asked, {
        signal: controller.signal,
        onProgress: arm,
        onDelta: (delta) => setPartial((current) => current + delta),
        onReset: () => setPartial(""),
      });
      window.clearTimeout(timer);
      // A restart aborted it on purpose: nothing to add. A timeout falls through to the error note.
      if (abortRef.current !== controller) return;
      abortRef.current = null;
      if (controller.signal.aborted && !timedOut) return;
      setPending(false);
      setPartial("");
      if (outcome.kind === "answer") {
        commit([...asked, { role: "atla", ...outcome.answer }]);
        trackAskTurn(outcome.answer.slugs.length, outcome.answer.links.length);
      } else {
        commit([...asked, { role: "note", text: outcome.text, kind: outcome.note }]);
        if (outcome.note === "unavailable") {
          setAvailable(false);
          try {
            storage()?.setItem(AVAILABLE_KEY, "0");
          } catch {
            // Nothing to keep.
          }
        }
      }
    },
    [commit],
  );

  /** Try again: the last question goes again, and the failed note (and that question) leave the log first. */
  const retry = useCallback(() => {
    if (abortRef.current) return;
    const turns = turnsRef.current;
    let last = -1;
    for (let i = turns.length - 1; i >= 0; i -= 1) {
      if (turns[i].role === "visitor") {
        last = i;
        break;
      }
    }
    if (last < 0) return;
    const text = turns[last].text;
    commit(turns.slice(0, last));
    void send(text);
  }, [commit, send]);

  const restart = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setPending(false);
    setPartial("");
    commit([]);
  }, [commit]);

  return { turns, available, pending, partial, send, retry, restart, probe };
}

export type AskController = ReturnType<typeof useAsk>;
