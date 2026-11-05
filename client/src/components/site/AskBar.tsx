import { useId, useRef, useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { rankProjects, type ProjectLite } from "@shared/rankProjects";
import { siteCopy } from "@/content/siteCopy";
import { ProjectCard } from "@/components/site/ProjectCard";
import { useSiteProjects, type SiteProject } from "@/components/site/siteProjects";
import { useIsMobile } from "@/hooks/use-mobile";

const { home } = siteCopy;
const ASK_TIMEOUT_MS = 8000;
const MAX_RESULTS = 6;

type AskResponse =
  | { kind: "results"; projects: ProjectLite[]; closest: boolean }
  | { kind: "brief"; seed: string };

type Results = { query: string; projects: ProjectLite[]; closest: boolean; offline: boolean };

function isAskResponse(value: unknown): value is AskResponse {
  if (!value || typeof value !== "object") return false;
  const body = value as Record<string, unknown>;
  if (body.kind === "brief") return typeof body.seed === "string";
  return body.kind === "results" && Array.isArray(body.projects);
}

async function ask(q: string): Promise<AskResponse> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), ASK_TIMEOUT_MS);
  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`ask ${res.status}`);
    const body: unknown = await res.json();
    if (!isAskResponse(body)) throw new Error("ask: bad response");
    return body;
  } finally {
    window.clearTimeout(timer);
  }
}

const briefHref = (seed: string) => `/brief?seed=${encodeURIComponent(seed)}`;

/**
 * The home search bar. Enter submits (no debounce). The API either returns
 * work, shown inline under the bar, or recognises a project description and
 * sends the visitor to the brief with their words as the seed. If the API is
 * unreachable, the same ranking runs here on the projects already loaded.
 */
export function AskBar() {
  const [, navigate] = useLocation();
  const { projects } = useSiteProjects();
  const isMobile = useIsMobile();
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const [results, setResults] = useState<Results | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef(0);
  const statusId = useId();

  const bySlug = new Map<string, SiteProject>(projects.map((project) => [project.slug, project]));

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const q = value.trim();
    if (!q || pending) return;
    const request = ++requestRef.current;
    setPending(true);
    try {
      const response = await ask(q);
      if (request !== requestRef.current) return;
      if (response.kind === "brief") {
        navigate(briefHref(response.seed || q));
        return;
      }
      setResults({ query: q, projects: response.projects, closest: response.closest, offline: false });
    } catch {
      if (request !== requestRef.current) return;
      const ranked = rankProjects(q, projects);
      setResults({ query: q, projects: ranked.projects, closest: ranked.closest, offline: true });
    } finally {
      if (request === requestRef.current) setPending(false);
    }
  };

  const clear = () => {
    requestRef.current += 1;
    setPending(false);
    setResults(null);
    setValue("");
    inputRef.current?.focus();
  };

  const shown = results?.projects.slice(0, MAX_RESULTS) ?? [];
  const status = results
    ? shown.length === 0
      ? home.results.empty
      : results.closest
        ? home.results.closest
        : home.results.count(results.projects.length)
    : "";

  return (
    <div className="ask">
      <form className="ask-bar" role="search" onSubmit={onSubmit} data-pending={pending || undefined}>
        <input
          ref={inputRef}
          className="ask-bar__input"
          type="text"
          name="q"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={isMobile ? home.askPlaceholderShort : home.askPlaceholder}
          aria-label={home.askLabel}
          aria-describedby={results ? statusId : undefined}
          autoComplete="off"
          enterKeyHint="search"
          maxLength={300}
        />
        <button
          className="ask-bar__submit"
          type="submit"
          aria-label={pending ? home.askPending : home.askSubmit}
          aria-busy={pending}
          disabled={!value.trim() && !pending}
        >
          {pending ? (
            <span className="ask-bar__spinner" aria-hidden="true" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </form>

      <p className="sr-only" aria-live="polite">
        {results ? `${status}${results.offline && shown.length > 0 ? `. ${home.results.error}` : ""}` : ""}
      </p>
      <div className="ask-results">
        {results ? (
          <div key={results.query} className="ask-results__inner">
            <div className="ask-results__head">
              <p id={statusId} className="ask-results__label">
                {status}
              </p>
              <div className="ask-results__actions">
                <Link href={briefHref(results.query)} className="site-link">
                  {home.results.startBrief}
                </Link>
                <button type="button" className="site-link ask-results__clear" onClick={clear}>
                  {home.results.clear}
                </button>
              </div>
            </div>
            {shown.length > 0 ? (
              <ul className="ask-results__grid">
                {shown.map((lite, index) => {
                  const full = bySlug.get(lite.slug);
                  return (
                    <li key={lite.slug} style={{ ["--i" as string]: index }}>
                      <ProjectCard project={full ?? lite} size="grid" />
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
