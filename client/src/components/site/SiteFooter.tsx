import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { OPEN_CONSENT_EVENT } from "@/components/atla/AnalyticsConsent";
import { siteCopy } from "@/content/siteCopy";
import { SOCIAL_PROFILES } from "@shared/siteSeo";

const { footer } = siteCopy;

/** Studio cities, in footer order, with their time zones (Figma footer 4546:2280). */
export const SITE_CITIES = footer.offices;

/** "11:35" in the city's own time, 24-hour, as drawn. */
export function cityTime(timeZone: string, now: Date) {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone }).format(now);
}

/**
 * The clock is client-only: the prerendered HTML carries no time, so it never disagrees with the
 * visitor's clock on hydration. It ticks on the minute.
 */
function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    let timer = 0;
    const tick = () => {
      const current = new Date();
      setNow(current);
      timer = window.setTimeout(tick, 60_000 - (current.getSeconds() * 1000 + current.getMilliseconds()));
    };
    tick();
    return () => window.clearTimeout(timer);
  }, []);
  return now;
}

export function SiteFooter() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const now = useNow();

  const backToTop = () => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <div className="site-footer__info">
          <div className="site-footer__cols">
            <nav className="site-footer__col" aria-label={footer.navLabel}>
              <p className="site-footer__head">{footer.atla.head}</p>
              <ul className="site-footer__list">
                {footer.atla.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="site-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="site-footer__col">
              <p className="site-footer__head">{footer.socialsHead}</p>
              <ul className="site-footer__list">
                {SOCIAL_PROFILES.map((social) => (
                  <li key={social.href}>
                    <a href={social.href} target="_blank" rel="noreferrer" className="site-link">
                      {social.label === "Linkedin" ? "LinkedIn" : social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="site-footer__col site-footer__col--offices">
              <p className="site-footer__head">{footer.officesHead}</p>
              <ul className="site-footer__list">
                {SITE_CITIES.map((city) => (
                  <li key={city.label} className="site-footer__office">
                    <span className="site-footer__city">{city.label}</span>
                    <span className="site-footer__time">{now ? cityTime(city.timeZone, now) : ""}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="site-footer__line">{footer.line}</p>
        </div>
        <div className="site-footer__symbol">
          <img src="/figmaAssets/v2/atlas-symbol.svg" alt="" width={290.795} height={504} loading="lazy" decoding="async" />
        </div>
      </div>
      <div className="site-footer__base">
        <div className="site-footer__bottom">
          <button type="button" className="site-link site-footer__top" onClick={backToTop}>
            {footer.backToTop}
          </button>
          <div className="site-footer__legal">
            {footer.legal.map((link) => (
              <Link key={link.href} href={link.href} className="site-link">
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              className="site-link"
              onClick={() => window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT))}
            >
              {footer.cookiesLabel}
            </button>
          </div>
          <p className="site-footer__rights">
            {year} {footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
