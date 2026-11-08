import { useMemo } from "react";
import { Link } from "wouter";
import { OPEN_CONSENT_EVENT } from "@/components/atla/AnalyticsConsent";
import { siteCopy } from "@/content/siteCopy";
import { CONTACT_EMAIL, SOCIAL_PROFILES } from "@shared/siteSeo";

const { footer } = siteCopy;

/** Studio cities, in footer order. Also listed on /about. No clocks: no numbers on the site. */
export const SITE_CITIES = [
  { label: "Austin", timeZone: "America/Chicago" },
  { label: "Mexico City", timeZone: "America/Mexico_City" },
  { label: "Barcelona", timeZone: "Europe/Madrid" },
  { label: "Lima", timeZone: "America/Lima" },
  { label: "Caracas", timeZone: "America/Caracas" },
] as const;

/**
 * JP's Figma footer (file U5QZmCKgSrT1W21pYYwTRe, frame 4546:2280) on the site's paper instead of
 * yellow (JP, 2026-11-06: "Mismo Figma, en papel"): three columns (Atla, Socials, Studios), one
 * paragraph, the Atlas symbol at the right, then a rule and the bottom line with Back to top, the
 * legal links and the rights. No clocks beside the cities: no numbers on the site.
 */
/**
 * `slim`: a landing page's footer (JP, 2026-11-07): the studio line, the legal links and the rights,
 * without the site's columns, so the page keeps its one door.
 */
export function SiteFooter({ slim = false }: { slim?: boolean } = {}) {
  const year = useMemo(() => new Date().getFullYear(), []);
  const backToTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <footer className="site-footer" data-slim={slim ? "" : undefined}>
      <div className="site-footer__body">
        {slim ? null : (
        <div className="site-footer__columns">
          <nav aria-label={footer.navLabel} className="site-footer__column">
            <h2 className="site-footer__head">{footer.pagesLabel}</h2>
            <ul className="site-footer__list">
              {footer.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="site-footer__link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="site-footer__column">
            <h2 className="site-footer__head">{footer.socialsLabel}</h2>
            <ul className="site-footer__list">
              {SOCIAL_PROFILES.map((social) => (
                <li key={social.href}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" className="site-footer__link">
                    {social.label === "Linkedin" ? "LinkedIn" : social.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="site-footer__link site-footer__email">
                  {footer.emailLabel}
                </a>
              </li>
            </ul>
          </div>
          <div className="site-footer__column">
            <h2 className="site-footer__head">{footer.citiesLabel}</h2>
            <ul className="site-footer__list site-footer__cities">
              {SITE_CITIES.map((city) => (
                <li key={city.label}>{city.label}</li>
              ))}
            </ul>
          </div>
        </div>
        )}
        <p className="site-footer__line">{footer.line}</p>
        <span className="site-footer__symbol" role="img" aria-label={footer.symbolLabel} />
      </div>
      <div className="site-footer__base">
        <button type="button" className="site-footer__base-link site-footer__top" onClick={backToTop}>
          {footer.backToTop} <span aria-hidden="true">↑</span>
        </button>
        <div className="site-footer__legal">
          {footer.legal.map((link) => (
            <Link key={link.href} href={link.href} className="site-footer__base-link">
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            className="site-footer__base-link site-footer__button"
            onClick={() => window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT))}
          >
            {footer.cookiesLabel}
          </button>
        </div>
        <span className="site-footer__rights">
          © {year} {footer.rights}
        </span>
      </div>
    </footer>
  );
}
