import { useEffect, useState } from "react";
import { AtlaSymbol } from "@/components/atla/AtlaMarks";
import { OPEN_CONSENT_EVENT } from "@/components/atla/AnalyticsConsent";
import { HOME_META_DESCRIPTION, SOCIAL_PROFILES } from "@shared/siteSeo";
import type { AtlaCta } from "@/components/atla/AtlaHeader";

// Figma: Atla 🌐 / Web / Footer - Desktop (4546:2089), Tablet (4546:2090), Mobile (4546:2091).
// Layout and type live in index.css under .atla-footer so the prerender holds at every width.

const OFFICES = [
  { label: "Austin, US", timeZone: "America/Chicago" },
  { label: "CDMX, MX", timeZone: "America/Mexico_City" },
  { label: "Barcelona, ES", timeZone: "Europe/Madrid" },
  { label: "Lima, PE", timeZone: "America/Lima" },
  { label: "Caracas, VE", timeZone: "America/Caracas" },
] as const;

const STUDIO_LINKS = [
  { label: "Work", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Programs", href: "/programs" },
  { label: "Journal", href: "/journal" },
] as const;

const CONTACT: AtlaCta = { label: "Contact", href: "/contact" };

function officeTimes() {
  const now = new Date();
  return OFFICES.map((office) => ({
    ...office,
    time: new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: office.timeZone,
    }).format(now),
  }));
}

export function AtlaFooter({ cta = CONTACT }: { cta?: AtlaCta }) {
  const [offices, setOffices] = useState(officeTimes);
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
    setOffices(officeTimes());
    const timer = window.setInterval(() => setOffices(officeTimes()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const links = [...STUDIO_LINKS, cta];

  return (
    <footer className="atla-footer">
      <div className="atla-footer-inner">
        <div className="atla-footer-main">
          <div className="atla-footer-text">
            <div className="atla-footer-columns">
              <nav aria-label="Atla" className="atla-footer-column">
                <p className="atla-footer-heading">Atla</p>
                <ul>
                  {links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="atla-footer-link"
                        {...("external" in link && link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="atla-footer-column">
                <p className="atla-footer-heading">Socials</p>
                <ul>
                  {SOCIAL_PROFILES.map((social) => (
                    <li key={social.href}>
                      <a href={social.href} target="_blank" rel="noopener noreferrer" className="atla-footer-link">
                        {social.label === "Linkedin" ? "LinkedIn" : social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="atla-footer-column atla-footer-offices">
                <p className="atla-footer-heading">Offices</p>
                <ul>
                  {offices.map((office) => (
                    <li key={office.label}>
                      <span className="atla-footer-city">{office.label}</span>
                      <time className="atla-footer-time">{office.time}</time>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="atla-footer-blurb">{HOME_META_DESCRIPTION}</p>
          </div>

          <div className="atla-footer-symbol" aria-hidden="true">
            <AtlaSymbol color="#222222" title="" />
          </div>
        </div>

        <div className="atla-footer-bar">
          <button
            type="button"
            className="atla-footer-link"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Back to top ↑
          </button>
          <div className="atla-footer-legal">
            <a href="/privacy" className="atla-footer-link">Privacy</a>
            <a href="/terms" className="atla-footer-link">Terms</a>
            <button
              type="button"
              className="atla-footer-link"
              onClick={() => window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT))}
            >
              Cookies
            </button>
          </div>
          <p>{year} Atla® All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
