import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { siteCopy } from "@/content/siteCopy";
import { useSiteProjects } from "@/components/site/siteProjects";
import { ALL, facetOptions, filtersFromSearch, searchFromFilters, type Filters } from "@/components/site/workFilters";

const { home } = siteCopy;
const FACETS: Array<{ key: keyof Filters; label: string }> = [
  { key: "region", label: home.filters.region },
  { key: "industry", label: home.filters.industry },
  { key: "service", label: home.filters.service },
  { key: "year", label: home.filters.year },
];

/**
 * The "Work" link in the header. On a pointer device, resting on it shows the
 * four facets as plain text links into the filtered wall (the one idea kept
 * from the morphing mega menu, JP 2026-11-05). Keyboard: Tab into the link and
 * the lines appear too; Escape hides them. Nothing but text, a hairline and the
 * page background.
 */
export function WorkPeek({ href, label }: { href: string; label: string }) {
  const { projects } = useSiteProjects();
  const [location] = useLocation();
  const search = useSearch();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLLIElement>(null);
  const timer = useRef<number>();
  const panelId = useId();
  const options = useMemo(() => facetOptions(projects), [projects]);
  const active = useMemo(() => filtersFromSearch(location === "/" ? search : ""), [location, search]);

  useEffect(() => setOpen(false), [location, search]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const show = () => {
    window.clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), 120);
  };

  return (
    <li
      ref={rootRef}
      className="work-peek"
      data-open={open}
      onPointerEnter={(event) => event.pointerType === "mouse" && show()}
      onPointerLeave={(event) => event.pointerType === "mouse" && hide()}
      onFocus={show}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <Link href={href} className="site-link" aria-expanded={open} aria-controls={panelId}>
        {label}
      </Link>
      {projects.length > 0 ? (
        <div id={panelId} className="work-peek__panel" hidden={!open}>
          {FACETS.map((facet) => (
            <div key={facet.key} className="work-peek__facet">
              <span className="work-peek__label">{facet.label}</span>
              <ul className="work-peek__list">
                {options[facet.key].map((value) => {
                  const next = { ...active, [facet.key]: value };
                  const current = active[facet.key] === value || (value === ALL && active[facet.key] === ALL);
                  return (
                    <li key={value}>
                      <Link
                        href={`/${searchFromFilters(next)}`}
                        className="work-peek__link"
                        aria-current={current ? "true" : undefined}
                        tabIndex={open ? 0 : -1}
                      >
                        {value}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </li>
  );
}
