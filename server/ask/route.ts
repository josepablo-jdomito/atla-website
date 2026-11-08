import type { Express, NextFunction, Request, Response } from "express";
import { siteCopy } from "../../client/src/content/siteCopy.ts";
import {
  ASK_HREFS,
  ASK_LINKS,
  ASK_MAX_LINKS,
  ASK_MAX_PIECES,
  answerRuleBreak,
  askModelOutputSchema,
  askRequestSchema,
  tidyAnswerText,
  type AskAnswer,
  type AskEvent,
  type AskHref,
  type AskRequest,
} from "../../shared/ask.ts";
import { clientIp, foreignPostSource } from "../contact.ts";
import { hashIp } from "../limits/guards.ts";
import { fetchProjectsFromSanity } from "../sanity/projectService.ts";
import { buildSystemPrompt, type AskProject } from "./context.ts";
import { askStoreReady, checkAskLimits, takeAskRetryBudget, type AskLimit } from "./limits.ts";
import { askApiKey, generateAnswer, type AskUsage, type Generate } from "./model.ts";

/**
 * Ask, the concierge mode of the Explore pill.
 *
 * GET  /api/ask  → { available }  Whether Ask can answer here (a key, and shared limits in production).
 * POST /api/ask  { messages: [{ role, text }], idempotencyKey } → text/event-stream of AskEvent
 *
 * Refusals answer JSON before any stream: 403 for a post from another site, 400 for a bad body,
 * 503 without ANTHROPIC_API_KEY or (in production) without Upstash, 409 for a resent ask, 429 past the
 * window or the daily cap. The client hides Ask on 503 and keeps Search.
 *
 * The model's JSON is validated (zod) and checked against the site's rules (no numbers, prices,
 * durations, banned words). A failure is retried once, after a `reset` event withdraws what was
 * streamed; a second failure, or a refusal, ends in a fixed line that points to the brief.
 *
 * Privacy: the visitor's words go to Anthropic inside an escaped <visitor> block and nowhere else.
 * The log line holds a timestamp, the hashed address, token counts, latency and a status, never text.
 */

/** Own keys only: `in` on ASK_LINKS would accept "__proto__", "constructor", "toString". */
const ASK_HREF_SET: ReadonlySet<string> = new Set(ASK_HREFS);

const PROJECT_CACHE_MS = 10 * 60 * 1000;
const { ask: copy } = siteCopy;

export type AskDeps = {
  apiKey: () => string;
  storeReady: () => boolean;
  checkLimits: (ip: string, idempotencyKey: string) => Promise<AskLimit>;
  loadProjects: () => Promise<AskProject[]>;
  generate: Generate;
  /** A second unit of the monthly budget, taken before the retry (a retry is a second model call). Omitted = allowed. */
  takeRetryBudget?: () => Promise<boolean>;
};

/**
 * For visitor text serialised as JSON inside a `<visitor>` block: `<` and `>` become \u003c and
 * \u003e, which still decode to the same characters as JSON but can never form a closing tag.
 */
export const escapeAngles = (json: string) => json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e");

/**
 * The turns as one escaped JSON data block: the earlier visitor turns as history, the last as the
 * question. Turns the client labels "atla" are dropped: the client can write anything there, so the
 * server never lets it put words in Atla's mouth (and never sends them as assistant messages).
 */
export function visitorBlock(messages: AskRequest["messages"]): string {
  const history = messages
    .slice(0, -1)
    .filter((turn) => turn.role === "visitor")
    .map((turn) => ({ who: turn.role, text: turn.text }));
  const question = messages[messages.length - 1].text;
  return `<visitor>\n${escapeAngles(JSON.stringify({ history, question }))}\n</visitor>`;
}

/**
 * Reads the "text" string of a JSON object while it streams in, so the caption can be shown before
 * the object closes. Returns only what is new since the last call; an escape cut in half waits.
 */
export function createTextStreamer() {
  let raw = "";
  let emitted = 0;
  return (chunk: string): string => {
    raw += chunk;
    const start = /"text"\s*:\s*"/.exec(raw);
    if (!start) return "";
    let i = start.index + start[0].length;
    let out = "";
    while (i < raw.length) {
      const ch = raw[i];
      if (ch === '"') break;
      if (ch !== "\\") {
        out += ch;
        i += 1;
        continue;
      }
      const next = raw[i + 1];
      if (next === undefined) break;
      if (next === "u") {
        const hex = raw.slice(i + 2, i + 6);
        if (hex.length < 4) break;
        out += String.fromCharCode(Number.parseInt(hex, 16));
        i += 6;
        continue;
      }
      out += ({ n: "\n", t: "\t", r: "", b: "", f: "" } as Record<string, string>)[next] ?? next;
      i += 2;
    }
    const fresh = out.slice(emitted);
    emitted = out.length;
    return fresh;
  };
}

/** The model's JSON as an answer we can show, or why not. Slugs must be visible projects; links come from ASK_LINKS. */
export function settleAnswer(raw: string, knownSlugs: Set<string>): { answer: AskAnswer } | { problem: string } {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { problem: "json" };
  }
  const parsed = askModelOutputSchema.safeParse(json);
  if (!parsed.success) return { problem: "shape" };
  const text = tidyAnswerText(parsed.data.text);
  const broken = answerRuleBreak(text);
  if (broken) return { problem: broken };
  const slugs = Array.from(new Set(parsed.data.slugs.map((s) => s.trim().toLowerCase()))).filter((s) => knownSlugs.has(s)).slice(0, ASK_MAX_PIECES);
  const hrefs = Array.from(new Set(parsed.data.links)).filter((href): href is AskHref => ASK_HREF_SET.has(href)).slice(0, ASK_MAX_LINKS);
  return { answer: { text, slugs, links: hrefs.map((href) => ({ href, label: ASK_LINKS[href] })) } };
}

const fallbackAnswer = (): AskAnswer => ({ text: copy.fallback, slugs: [], links: [{ href: "/brief", label: ASK_LINKS["/brief"] }] });

const RETRY_NOTE =
  "Your previous answer could not be shown: it was not valid JSON, or it broke a rule (a number, a price, a count, a duration or a banned word). Answer the same question again and follow every rule.";

function toAskProject(project: Record<string, unknown>): AskProject {
  const text = (value: unknown) => (typeof value === "string" ? value : "");
  const list = (value: unknown) => (Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : []);
  return {
    slug: text(project.slug).trim().toLowerCase(),
    title: text(project.title),
    client: text(project.client),
    sector: text(project.sector),
    disciplines: list(project.disciplines),
    place: text(project.place),
    year: Number(project.year) || 0,
    description: text(project.description),
    body: text(project.body),
  };
}

let projectCache: { at: number; projects: AskProject[] } | null = null;

/** The projects the wall shows (hidden and, when configured, draft ones are already dropped), cached ten minutes per instance. */
export async function loadVisibleProjects(): Promise<AskProject[]> {
  if (projectCache && Date.now() - projectCache.at < PROJECT_CACHE_MS) return projectCache.projects;
  const all = await fetchProjectsFromSanity();
  const projects = all.map((p) => toAskProject(p as unknown as Record<string, unknown>)).filter((p) => p.slug);
  projectCache = { at: Date.now(), projects };
  return projects;
}

/** The system prompt, rebuilt only when the project list changes (so the prompt cache keeps hitting). */
let promptCache: { key: string; prompt: string } | null = null;
function systemPromptFor(projects: AskProject[]) {
  const key = projects.map((p) => `${p.slug}:${p.title.length}:${p.description.length}:${p.body.length}`).sort().join("|");
  if (promptCache?.key !== key) promptCache = { key, prompt: buildSystemPrompt(projects) };
  return promptCache.prompt;
}

const defaultDeps: AskDeps = {
  apiKey: askApiKey,
  storeReady: askStoreReady,
  checkLimits: checkAskLimits,
  loadProjects: loadVisibleProjects,
  generate: generateAnswer,
  takeRetryBudget: takeAskRetryBudget,
};

type LogFields = { ip: string; status: string; code: number; started: number; attempts?: number; usage?: AskUsage };

/** The only log line Ask writes. Never the question, the history or the answer. */
export function askLogLine({ ip, status, code, started, attempts = 0, usage }: LogFields): string {
  const tokens = usage
    ? ` in=${usage.input} out=${usage.output} cache_read=${usage.cacheRead} cache_write=${usage.cacheWrite}`
    : "";
  return `[ask] at=${new Date().toISOString()} ip=${hashIp(ip)} status=${status} code=${code} attempts=${attempts}${tokens} ms=${Date.now() - started}`;
}

const addUsage = (a: AskUsage | undefined, b: AskUsage): AskUsage =>
  a ? { input: a.input + b.input, output: a.output + b.output, cacheRead: a.cacheRead + b.cacheRead, cacheWrite: a.cacheWrite + b.cacheWrite } : b;

function sameSiteOnly(req: Request, res: Response, next: NextFunction) {
  if (!foreignPostSource(req)) return next();
  console.log(askLogLine({ ip: clientIp(req), status: "foreign", code: 403, started: Date.now() }));
  return res.status(403).json({ error: "Forbidden" });
}

export function registerAskRoutes(app: Express, deps: AskDeps = defaultDeps) {
  const available = () => Boolean(deps.apiKey()) && deps.storeReady();

  app.get("/api/ask", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({ available: available() });
  });

  app.post("/api/ask", sameSiteOnly, async (req, res) => {
    const started = Date.now();
    const ip = clientIp(req);
    const refuse = (code: number, status: string, body: Record<string, unknown>) => {
      console.log(askLogLine({ ip, status, code, started }));
      return res.status(code).json(body);
    };

    const parsed = askRequestSchema.safeParse(req.body);
    if (!parsed.success) return refuse(400, "invalid", { error: "Invalid question" });
    if (!available()) return refuse(503, "unavailable", { error: copy.unavailable, available: false });

    const limit = await deps.checkLimits(ip, parsed.data.idempotencyKey);
    if (limit === "duplicate") return refuse(409, "duplicate", { error: copy.error });
    if (limit === "rate" || limit === "daily") return refuse(429, limit, { error: copy.limited });
    if (limit !== "ok") return refuse(503, limit, { error: copy.unavailable, available: false });

    let projects: AskProject[] = [];
    try {
      projects = await deps.loadProjects();
    } catch (err) {
      console.error(`[ask] could not load projects: ${err instanceof Error ? err.name : "unknown error"}`);
    }
    const known = new Set(projects.map((p) => p.slug));
    const system = systemPromptFor(projects);
    const user = visitorBlock(parsed.data.messages);

    res.status(200);
    res.set({ "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" });
    res.flushHeaders?.();
    const send = (event: AskEvent) => {
      if (!res.writableEnded) res.write(`data: ${JSON.stringify(event)}\n\n`);
    };

    const abort = new AbortController();
    res.on("close", () => abort.abort());

    let usage: AskUsage | undefined;
    let attempts = 0;
    let status = "answered";
    let answer: AskAnswer | null = null;
    try {
      for (attempts = 1; attempts <= 2 && !answer; attempts += 1) {
        if (attempts === 2 && deps.takeRetryBudget && !(await deps.takeRetryBudget())) break;
        const stream = createTextStreamer();
        let streamed = false;
        const result = await deps.generate({
          system,
          user: attempts === 1 ? user : `${user}\n\n${RETRY_NOTE}`,
          signal: abort.signal,
          onText: (chunk) => {
            const text = stream(chunk);
            if (!text) return;
            streamed = true;
            // Dashes are tidied in the settled answer; the stream shows them as commas already.
            send({ type: "delta", text: text.replace(/[\u2014\u2013]/g, ",") });
          },
        });
        usage = addUsage(usage, result.usage);
        if (result.stopReason === "refusal") {
          if (streamed) send({ type: "reset" });
          status = "refusal";
          break;
        }
        const settled = settleAnswer(result.raw, known);
        if ("answer" in settled) {
          answer = settled.answer;
          if (attempts > 1) status = "retried";
          break;
        }
        status = `rejected-${settled.problem}`;
        if (streamed) send({ type: "reset" });
      }
      attempts = Math.min(attempts, 2);
      if (!answer) status = status === "refusal" ? "refusal" : `fallback-${status.replace(/^rejected-/, "")}`;
      send({ type: "done", answer: answer ?? fallbackAnswer() });
    } catch (err) {
      status = abort.signal.aborted ? "aborted" : `error-${err instanceof Error ? err.name.replace(/[^A-Za-z0-9]/g, "") : "unknown"}`;
      send({ type: "error", message: copy.error });
    }
    console.log(askLogLine({ ip, status, code: 200, started, attempts, usage }));
    res.end();
  });
}
