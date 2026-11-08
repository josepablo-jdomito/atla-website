import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Link } from "wouter";
import { formatMetaTitle } from "@shared/siteSeo";
import { SeoHead } from "@/components/seo/SeoHead";
import { PageShell } from "@/components/site/PageShell";
import { buildServiceSchema, type FaqItem } from "@/components/atla/AtlaLongformLayout";
import { trackEvent } from "@/hooks/use-analytics";

/**
 * Hospitality, at /hospitality, on the v2 system (JP, 2026-11-07: "rebuild completo a v2"): the page title,
 * one action, the two cases per kind, the ways in, the places, the questions and the written form. Same
 * classes as Why Atla and Services; no page-only styles, no photo slot without a photo.
 */

const PATHNAME = "/hospitality";
const DESCRIPTION =
  "Hospitality audits, rebrands and new openings for hotels and restaurants. Clients include a MICHELIN Key hotel and a MICHELIN Green Star restaurant.";

// "Atla* Branding Agency" intro event on Calendly.
const INTRO_URL = "https://calendly.com/josepablo-atla/30min?utm_source=atla.design&utm_medium=hospitality";

const SANITY = "https://cdn.sanity.io/images/dvufm78f/production";
const sanityImage = (file: string, width: number) => `${SANITY}/${file}?w=${width}&auto=format&q=80`;

const HERO = { alt: "Rústico menu in embossed suede, Acre Resort", src: sanityImage("18a02d9a640324bce8de4272d67087c7c1ab3fbe-1396x1781.png", 1400) };

const AWARDS = [
  { src: "/hospitality/michelin-key.webp", label: "MICHELIN Key", who: "Casa Las Tortugas" },
  { src: "/hospitality/michelin-green-star.svg", label: "MICHELIN Green Star", who: "Acre" },
];

type HospitalityCase = {
  name: string;
  place: string;
  tagline: string;
  summary: string;
  scope: string;
  // JP's photos replace these; a case without one shows no picture (critique Ho2, 2026-11-05).
  image?: { alt: string; src: string };
  link?: { href: string; label: string };
};

const HOTELS: HospitalityCase[] = [
  {
    name: "Acre Resort",
    place: "Los Cabos, Mexico",
    tagline: "Treehouses, villas, a restaurant and a bar under one brand.",
    summary:
      "Acre runs treehouses, villas, a restaurant, a mezcal bar and weddings on one property. We audited it the way a guest moves through it, wrote one brand architecture and the brand book, designed the website and created Rústico, an open-air dinner on the grounds. Acre's restaurant holds a MICHELIN Green Star.",
    scope: "Audit, brand architecture, brand book, website, Rústico",
    image: { alt: "Rústico napkin with the embroidered wordmark", src: sanityImage("0cd9da27361a74cf11d59ee76bf054f30ffe97bc-1188x1781.png", 1200) },
    link: { href: "/projects/rustico", label: "See Rústico" },
  },
  {
    name: "Casa Las Tortugas",
    place: "Holbox, Mexico",
    tagline: "Restaurants and a spa on one beach.",
    summary:
      "A family-owned hotel on Holbox's main beach, and a MICHELIN Key. We audited the property, then set the brand architecture across its restaurants and spa, and wrote the operating standards the team works from. The findings stay with the client.",
    scope: "Hospitality audit, brand architecture, operating standards",
  },
];

const RESTAURANTS: HospitalityCase[] = [
  {
    name: "Christophe's Fine Foods",
    place: "Chicago",
    tagline: "A neighborhood market with a chef behind the counter.",
    summary:
      "Built from a blank page: logotype, monogram, awning, aprons, totes and a line of reheatable meal trays, with a supplier sheet so the owner could order everything directly.",
    scope: "Identity, packaging, signage, uniforms, website",
    image: { alt: "Christophe's Fine Foods awning and monogram sign", src: "/hospitality/review/christophes-storefront.webp" },
  },
  {
    name: "Temakase",
    place: "New York",
    tagline: "Home of the handroll.",
    summary:
      "Hand roll bars with a wordmark and a character. Mako is drawn after Ebisu, the Japanese god of fishermen and luck, and appears on the window, the catering box and the sidewalk sign.",
    scope: "Identity, character, storefront, menus, catering",
    image: { alt: "Temakase storefront with window graphics", src: "/hospitality/review/temakase-storefront.webp" },
  },
];

// The same ways in as Services, named for hospitality. No prices or durations (JP's rule).
const WAYS = [
  {
    name: "Audit",
    line: "For a property that is open and feels off, or before you commit to a rebrand.",
    body: "We walk the property the way a guest does, from the booking page to the room, and read every outlet, sign and object. The audit stands on its own. Casa Las Tortugas started here.",
    includes: ["On-site walk of every guest touchpoint", "Findings, ranked by what to fix first", "What to keep and what to change", "Operating standards for your team"],
  },
  {
    name: "Rebranding",
    line: "For a hotel or restaurant whose brand no longer matches the place.",
    body: "We keep what guests already recognize and redesign the rest, then roll it out without confusing the guests who come back. Acre Resort is the example.",
    includes: ["Brand architecture across rooms, restaurants and spa", "Repositioning", "New identity and signature marks", "Rollout across signage, menus, uniforms and rooms", "Website and booking path"],
  },
  {
    name: "Branding",
    line: "For a new opening: a hotel, restaurant, spa or coffee shop.",
    body: "We build the brand before the doors open: the name, the identity and every object a guest touches, ready for the vendors who make them. Christophe's and Temakase opened this way.",
    includes: ["Naming and positioning", "Identity, character and signature marks", "Facade, signage and interiors direction", "Menus, packaging and uniforms", "Website, launch and production files"],
  },
];

const PLACES = "Los Cabos, Holbox, La Saladita, Querétaro, San Luis Potosí and Monterrey in Mexico. Chicago and New York. Bali.";

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Is this right for a small independent property?",
    answer:
      "Yes. What matters is where you are: open and something feels off, start with the audit; opening soon, start with branding. The size of the property changes the scope, not the method.",
  },
  {
    question: "Do you work with hotels that belong to a brand or group?",
    answer: "Yes. We start from the group's standards and design what makes this hotel its own. Across several properties, the audit runs the same way on each one.",
  },
  {
    question: "Will you show our project?",
    answer: "Only with your permission. With Casa Las Tortugas we name the client and the method, and the findings stay private.",
  },
  {
    question: "What happens on the call?",
    answer: "A short conversation about the property and what is not working. We tell you what we would do first.",
  },
];

const PROPERTY_TYPES = ["Independent hotel or resort", "Hotel within a brand or group", "Restaurant or bar inside a hotel", "Standalone restaurant or bar", "Other"];
const STAGES_OF_WORK = ["Opening a new property", "Repositioning an existing property", "Adding an outlet or concept", "Other"];
const DECIDERS = ["I do", "I do, with partners or a board", "Someone else; I am gathering options"];

// Where the visitor came from, kept for the tab so it survives moving around the site before writing.
const ATTRIBUTION_KEY = "atla-hospitality-attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

function readAttribution(): string {
  try {
    const saved = sessionStorage.getItem(ATTRIBUTION_KEY);
    if (saved) return saved;
  } catch {
    // Storage blocked: fall through and read the current visit only.
  }
  const params = new URLSearchParams(window.location.search);
  const parts = UTM_KEYS.filter((key) => params.get(key)).map((key) => `${key}=${params.get(key)!.slice(0, 80)}`);
  const referrer = document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer.slice(0, 200) : "";
  if (referrer) parts.push(`referrer=${referrer}`);
  const attribution = parts.join(", ") || "direct";
  try {
    sessionStorage.setItem(ATTRIBUTION_KEY, attribution);
  } catch {
    // Not critical; the form still sends what this visit shows.
  }
  return attribution;
}

function Case({ item, wide }: { item: HospitalityCase; wide?: boolean }) {
  return (
    <article className={wide ? "hcase hcase--wide" : "hcase"}>
      {item.image ? <img className="hcase__cover" src={item.image.src} alt={item.image.alt} loading="lazy" decoding="async" /> : null}
      <div className="hcase__text">
        <p className="site-label">{item.place}</p>
        <h3 className="site-item-title">{item.name}</h3>
        <p className="hcase__line">{item.tagline}</p>
        <p className="hcase__body">{item.summary}</p>
        <p className="hcase__body">{item.scope}</p>
        {item.link ? (
          <Link href={item.link.href} className="why-proof__link">
            {item.link.label}
          </Link>
        ) : null}
      </div>
    </article>
  );
}

type InquiryStatus = { state: "idle" | "submitting" | "sent" | "offline" } | { state: "error"; message: string };

// Posts to /api/contact like the brief: the qualifying answers travel inside the message, so the
// Attio note carries them without a server change.
function InquiryForm({ id }: { id: string }) {
  const [status, setStatus] = useState<InquiryStatus>({ state: "idle" });
  const sentRef = useRef<HTMLHeadingElement | null>(null);
  const attributionRef = useRef("direct");

  useEffect(() => {
    attributionRef.current = readAttribution();
  }, []);

  useEffect(() => {
    if (status.state === "sent") sentRef.current?.focus();
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (key: string) => {
      const entry = data.get(key);
      return typeof entry === "string" ? entry.trim() : "";
    };
    const message = [
      `Property type: ${value("propertyType")}`,
      `Project: ${value("stage")}`,
      `Opening or launch date: ${value("opening") || "not given"}`,
      `Decides: ${value("decider")}`,
      `Came from: ${attributionRef.current}`,
      "",
      value("message"),
    ]
      .join("\n")
      .slice(0, 4000);

    setStatus({ state: "submitting" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: value("name"),
          email: value("email"),
          company: value("company"),
          message,
          source: "atla.design/hospitality",
          _gotcha: value("_gotcha"),
        }),
      });
      if (response.status === 503) {
        setStatus({ state: "offline" });
        return;
      }
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setStatus({ state: "error", message: body?.error || "Something went wrong. Email us instead." });
        return;
      }
      form.reset();
      setStatus({ state: "sent" });
      trackEvent("contact_form_submit", { page: "hospitality", property_type: value("propertyType"), decider: value("decider") });
    } catch {
      setStatus({ state: "error", message: "We could not reach the server. Email us instead." });
    }
  }

  if (status.state === "sent") {
    return (
      <div className="bcheck-done">
        <h3 ref={sentRef} tabIndex={-1} className="site-section-title bcheck-ask__title">
          Sent.
        </h3>
        <p className="bcheck-done__line">We will write back with what we would do first.</p>
      </div>
    );
  }

  const submitting = status.state === "submitting";
  const trouble =
    status.state === "error" ? status.message : status.state === "offline" ? "The form is offline right now. Write to josepablo@atla.design." : "";
  const field = (key: string) => `${id}-${key}`;
  const choice = (name: string, label: string, options: string[]) => (
    <div className="brief-field" data-field={name}>
      <label htmlFor={field(name)} className="brief-field__label">
        {label}
      </label>
      <select id={field(name)} name={name} className="brief-input" required defaultValue="" disabled={submitting}>
        <option value="" disabled>
          Choose one
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <form className="bcheck-form hospitality-form" method="post" action="/api/contact" onSubmit={handleSubmit}>
      <input type="hidden" name="source" value="atla.design/hospitality" />
      <div className="brief-fields">
        <div className="brief-field" data-field="name">
          <label htmlFor={field("name")} className="brief-field__label">
            Name
          </label>
          <input id={field("name")} className="brief-input" name="name" type="text" required maxLength={120} autoComplete="name" disabled={submitting} />
        </div>
        <div className="brief-field" data-field="email">
          <label htmlFor={field("email")} className="brief-field__label">
            Email
          </label>
          <input id={field("email")} className="brief-input" name="email" type="email" required maxLength={200} autoComplete="email" inputMode="email" disabled={submitting} />
        </div>
        <div className="brief-field" data-field="company">
          <label htmlFor={field("company")} className="brief-field__label">
            Property, brand or group
          </label>
          <input id={field("company")} className="brief-input" name="company" type="text" required maxLength={160} autoComplete="organization" disabled={submitting} />
        </div>
        <div className="brief-field" data-field="opening">
          <label htmlFor={field("opening")} className="brief-field__label">
            Opening or launch date, if there is one
          </label>
          <input id={field("opening")} className="brief-input" name="opening" type="text" maxLength={60} disabled={submitting} />
        </div>
        {choice("propertyType", "Type of property", PROPERTY_TYPES)}
        {choice("stage", "Stage of the project", STAGES_OF_WORK)}
        {choice("decider", "Who decides on this project?", DECIDERS)}
      </div>
      <div className="brief-field" data-field="message">
        <label htmlFor={field("message")} className="brief-field__label">
          What should the guest feel when they walk in?
        </label>
        <textarea id={field("message")} className="brief-input bcheck-message" name="message" required minLength={10} maxLength={3000} rows={4} disabled={submitting} />
      </div>
      {/* Honeypot: people never see or reach it; bots that fill every field give themselves away. */}
      <div className="brief-hp" hidden>
        <label htmlFor={field("gotcha")}>Leave this empty</label>
        <input id={field("gotcha")} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <p className="brief-privacy bcheck-privacy">
        What you send goes to our CRM so we can answer you. <Link href="/privacy">Privacy</Link>
      </p>
      <div className="brief-actions">
        <button type="submit" className="site-action" disabled={submitting}>
          {submitting ? "Sending" : status.state === "error" ? "Try again" : "Send the details"}
        </button>
        <p className="brief-status bcheck-status" role="status" data-tone={trouble ? "error" : undefined}>
          {trouble}
        </p>
      </div>
    </form>
  );
}

export default function AtlaHospitality() {
  const id = useId();
  return (
    <PageShell>
      <SeoHead
        title={formatMetaTitle("Hospitality", "Atla")}
        description={DESCRIPTION}
        pathname={PATHNAME}
        structuredData={buildServiceSchema({
          path: PATHNAME,
          name: "Branding for hotels, restaurants, wellness and coffee",
          description: DESCRIPTION,
          faqItems: FAQ_ITEMS,
        })}
      />
      <div className="site-page-body hospitality">
        <header className="page-intro">
          <h1 className="page-intro__title">Brands for hotels and restaurants, from the booking page to the room.</h1>
          <p className="page-intro__lead">
            Audits, rebrands and new openings for hotels, restaurants, spas and coffee shops. Acre's restaurant holds a MICHELIN Green Star and Casa Las
            Tortugas a MICHELIN Key.
          </p>
          <ul className="hospitality-awards" aria-label="Awards our clients hold">
            {AWARDS.map((award) => (
              <li key={award.label}>
                <img src={award.src} alt="" width={22} height={22} decoding="async" className="hospitality-award" />
                <span>
                  {award.label}, {award.who}
                </span>
              </li>
            ))}
          </ul>
          <a
            className="site-action"
            href={INTRO_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("book_call_click", { page: "hospitality", cta_type: "hero" })}
          >
            Book a call
          </a>
        </header>

        <img className="hospitality-hero" src={HERO.src} alt={HERO.alt} decoding="async" fetchPriority="high" />

        <section className="page-section" aria-labelledby={`${id}-hotels`}>
          <h2 id={`${id}-hotels`} className="site-section-title">
            Hotels
          </h2>
          <div className="page-section__body">
            <div className="hcases">
              {HOTELS.map((item) => (
                <Case key={item.name} item={item} wide />
              ))}
            </div>
          </div>
        </section>

        <section className="page-section" aria-labelledby={`${id}-restaurants`}>
          <h2 id={`${id}-restaurants`} className="site-section-title">
            Restaurants
          </h2>
          <div className="page-section__body">
            <div className="hcases hcases--pair">
              {RESTAURANTS.map((item) => (
                <Case key={item.name} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="page-section" aria-labelledby={`${id}-ways`}>
          <h2 id={`${id}-ways`} className="site-section-title">
            Ways to work with us
          </h2>
          <div className="page-section__body">
            <ol className="how-steps">
              {WAYS.map((way) => (
                <li key={way.name} className="how-step">
                  <h3 className="site-item-title how-step__title">{way.name}</h3>
                  <p className="hcase__line">{way.line}</p>
                  <p className="how-step__body">{way.body}</p>
                  <details className="discipline__includes">
                    <summary className="discipline__summary">Includes</summary>
                    <ul className="discipline__list">
                      {way.includes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </details>
                </li>
              ))}
            </ol>
            <p className="how-step__body">After launch we can stay on, so new outlets and rooms come out of the same system.</p>
          </div>
        </section>

        <section className="page-section" aria-labelledby={`${id}-places`}>
          <h2 id={`${id}-places`} className="site-section-title">
            Where we have worked
          </h2>
          <div className="page-section__body">
            <p className="hospitality-places">{PLACES}</p>
          </div>
        </section>

        <section className="page-section" aria-labelledby={`${id}-questions`}>
          <h2 id={`${id}-questions`} className="site-section-title">
            Questions
          </h2>
          <div className="page-section__body">
            <ol className="how-steps">
              {FAQ_ITEMS.map((item) => (
                <li key={item.question} className="how-step">
                  <h3 className="site-item-title how-step__title">{item.question}</h3>
                  <p className="how-step__body">{item.answer}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="inquire" className="page-section" aria-labelledby={`${id}-inquire`}>
          <h2 id={`${id}-inquire`} className="site-section-title">
            Tell us about your property
          </h2>
          <div className="page-section__body">
            <InquiryForm id={id} />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
