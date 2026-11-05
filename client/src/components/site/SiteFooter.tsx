import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { OPEN_CONSENT_EVENT } from "@/components/atla/AnalyticsConsent";
import { siteCopy } from "@/content/siteCopy";
import { CONTACT_EMAIL, SOCIAL_PROFILES } from "@shared/siteSeo";

const { footer } = siteCopy;

/** Studio cities, in footer order. Also listed on /about and /contact. */
export const SITE_CITIES = [
  { label: "Austin", timeZone: "America/Chicago" },
  { label: "Mexico City", timeZone: "America/Mexico_City" },
  { label: "Barcelona", timeZone: "Europe/Madrid" },
  { label: "Lima", timeZone: "America/Lima" },
  { label: "Caracas", timeZone: "America/Caracas" },
] as const;

function getCityTimes() {
  return SITE_CITIES.map((city) => ({
    ...city,
    time: new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: city.timeZone,
    }).format(new Date()),
  }));
}

export function SiteFooter() {
  const [cityTimes, setCityTimes] = useState(getCityTimes);
  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    const timer = window.setInterval(() => setCityTimes(getCityTimes()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <nav aria-label={footer.navLabel}>
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
        <div>
          <ul className="site-footer__list">
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="site-link">
                {CONTACT_EMAIL}
              </a>
            </li>
            {SOCIAL_PROFILES.map((social) => (
              <li key={social.href}>
                <a href={social.href} target="_blank" rel="noreferrer" className="site-link">
                  {social.label === "Linkedin" ? "LinkedIn" : social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <ul className="site-footer__list site-footer__cities" aria-label={footer.citiesLabel}>
          {cityTimes.map((city) => (
            <li key={city.label}>
              <span>{city.label}</span>
              <span className="site-footer__time">{city.time}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="site-footer__base">
        <span>
          © {year} {footer.rights}
        </span>
        <div className="site-footer__legal">
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
      </div>
    </footer>
  );
}
