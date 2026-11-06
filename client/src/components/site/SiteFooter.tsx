import { useMemo } from "react";
import { Link } from "wouter";
import { OPEN_CONSENT_EVENT } from "@/components/atla/AnalyticsConsent";
import { siteCopy } from "@/content/siteCopy";
import { CONTACT_EMAIL } from "@shared/siteSeo";

const { footer } = siteCopy;

/** Studio cities, in footer order. Also listed on /about and /contact. No clocks: no numbers on the site. */
export const SITE_CITIES = [
  { label: "Austin", timeZone: "America/Chicago" },
  { label: "Mexico City", timeZone: "America/Mexico_City" },
  { label: "Barcelona", timeZone: "Europe/Madrid" },
  { label: "Lima", timeZone: "America/Lima" },
  { label: "Caracas", timeZone: "America/Caracas" },
] as const;

/**
 * The footer JP chose (UX interview 15: "paper, one line, links, cities"): one quiet line on the page's
 * own paper, no display headline and no columns. Links, cities, the email, then the legal row. It wraps
 * on a phone; nothing in it is bigger than the body text.
 */
export function SiteFooter() {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="site-footer">
      <nav aria-label={footer.navLabel} className="site-footer__part">
        <ul className="site-footer__list">
          {footer.links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="site-link">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <ul className="site-footer__list site-footer__cities site-footer__part" aria-label={footer.citiesLabel}>
        {SITE_CITIES.map((city) => (
          <li key={city.label}>{city.label}</li>
        ))}
      </ul>
      <a href={`mailto:${CONTACT_EMAIL}`} className="site-link site-footer__part site-footer__email">
        {CONTACT_EMAIL}
      </a>
      <div className="site-footer__legal site-footer__part">
        <span>
          © {year} {footer.rights}
        </span>
        {footer.legal.map((link) => (
          <Link key={link.href} href={link.href} className="site-link">
            {link.label}
          </Link>
        ))}
        <button
          type="button"
          className="site-link site-footer__button"
          onClick={() => window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT))}
        >
          {footer.cookiesLabel}
        </button>
      </div>
    </footer>
  );
}
