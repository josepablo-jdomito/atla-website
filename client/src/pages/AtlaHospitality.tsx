import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import createGlobe from "cobe";
import { formatMetaTitle } from "@shared/siteSeo";
import { SeoHead } from "@/components/seo/SeoHead";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { AtlaHeader } from "@/components/atla/AtlaHeader";
import { buildServiceSchema } from "@/components/atla/AtlaLongformLayout";
import { trackEvent } from "@/hooks/use-analytics";
import { useIsMobile } from "@/hooks/use-mobile";

const PATHNAME = "/hospitality";
const DESCRIPTION =
  "Brand systems for hotels and the restaurants inside them: architecture for every outlet, standards your team can run, and production files for every vendor. Acre Resort, Casa Las Tortugas.";

const DISPLAY = "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif";
const SANS = "'Libre Franklin', Helvetica, sans-serif";
const INK = "#222";
const MUTED = "#6f6f6f";
const RULE = "#d4d4d4";

// Project photography is pending; each slot renders as a placeholder labelled with what goes there.
type CaseImage = { alt: string; ratio: string; wide?: boolean };

type Badge = { src: string; alt: string; label: string };

type HospitalityCase = {
  number: string;
  name: string;
  tagline: string;
  place: string;
  kind: string;
  summary: string;
  scope: string[];
  hero: CaseImage;
  details: CaseImage[];
  link?: { href: string; label: string };
  badge?: Badge;
};

const MICHELIN_KEY = { src: "/hospitality/michelin-key.webp", alt: "MICHELIN Key" };
const MICHELIN_GREEN_STAR = { src: "/hospitality/michelin-green-star.svg", alt: "MICHELIN Green Star" };

const PROOF_NAMES = ["Acre Resort", "Casa Las Tortugas", "Christophe's", "Temakase"];

const PROPERTY_TYPES = [
  "Independent hotel or resort",
  "Hotel within a brand or group",
  "Restaurant or bar inside a hotel",
  "Standalone restaurant or bar",
  "Other",
];
const STAGES_OF_WORK = ["Opening a new property", "Repositioning an existing property", "Adding an outlet or concept", "Other"];
const BUDGETS = ["$50K to $100K", "$100K to $250K", "$250K and up", "Not sure yet"];

const HERO: CaseImage = {
  alt: "Acre Resort, treehouse at dusk",
  ratio: "16 / 9",
};

// What hotel owners and brand teams tell us first, and what we do about it.
const PROBLEMS = [
  {
    problem: "On the booking site we look like every other hotel.",
    answer:
      "We set the identity, the photography direction and the website together, so the property reads as itself in a row of thumbnails and the booking path keeps that feeling.",
    proof: "Acre Resort: brand book and website.",
  },
  {
    problem: "We have five outlets and no single brand.",
    answer:
      "We write the brand architecture first: which restaurant, bar, spa and event space gets its own name and mark, which ones share the hotel's, and how every one of them points back to the property.",
    proof: "Casa Las Tortugas: four restaurants and a spa. Acre: treehouses, villas, a restaurant, a mezcal bar and weddings.",
  },
  {
    problem: "We open soon and every vendor is waiting on files.",
    answer:
      "Signage, uniforms, menus and packaging are designed with the supplier in mind and delivered as production files, with a supplier sheet that lists every item.",
    proof: "Christophe's got a supplier sheet for its packaging and ordered from it directly.",
  },
  {
    problem: "Our team changes faster than our brand guide.",
    answer:
      "We write operating standards the staff can actually use: what goes on a room card, how the restaurant posts, who signs off on what. New hires learn the brand from the same document.",
    proof: "Casa Las Tortugas: operating standards across the hotel.",
  },
];

const HOTEL_CASES: HospitalityCase[] = [
  {
    number: "01",
    name: "Acre Resort",
    tagline: "Treehouses, villas, a restaurant and a bar under one brand.",
    place: "Los Cabos",
    kind: "Treehouse hotel with villas, restaurants, a mezcal bar and weddings",
    summary:
      "Acre runs treehouses, villas, a restaurant with a MICHELIN Green Star, a mezcal bar and a wedding business on one property. We started with an audit that put all of it under one brand architecture, then wrote the brand book, designed the website and created Rústico, an open-air dinner on the grounds. We still work with Acre every week.",
    scope: ["Audit", "Brand architecture", "Brand book", "Website", "Restaurant identity"],
    hero: { alt: "Acre entrance wall with the wordmark", ratio: "16 / 9" },
    details: [
      { alt: "Rústico menu cover embossed in leather", ratio: "4 / 5" },
      { alt: "Rústico bread bag with the signature mark", ratio: "4 / 5" },
    ],
    link: { href: "/projects/rustico", label: "See Rústico" },
    badge: {
      ...MICHELIN_GREEN_STAR,
      label: "Acre Resort's restaurant holds a MICHELIN Green Star.",
    },
  },
  {
    number: "02",
    name: "Casa Las Tortugas",
    tagline: "Four restaurants and a spa on one beach.",
    place: "Holbox",
    kind: "Adults-only beachfront hotel, family owned",
    summary:
      "A family-owned hotel on Holbox's main beach, with four restaurants and a spa. We audited the property the way a guest moves through it, then set the brand architecture and the operating standards the team works from. The findings belong to the client. The method is the one we bring to every hotel.",
    scope: ["Hospitality audit", "Brand architecture", "Operating standards"],
    hero: { alt: "Casa Las Tortugas, Holbox", ratio: "16 / 9" },
    details: [],
    badge: {
      ...MICHELIN_KEY,
      label: "Casa Las Tortugas holds one MICHELIN Key.",
    },
  },
];

const FB_CASES: HospitalityCase[] = [
  {
    number: "03",
    name: "Christophe's Fine Foods",
    tagline: "A neighborhood market with a chef behind the counter.",
    place: "Chicago",
    kind: "Chef-led prepared foods market",
    summary:
      "Christophe's started from a blank page. We drew the logotype and monogram, then the awning, aprons, totes and a line of reheatable meal trays. The owner got a supplier sheet with every item on it and placed the orders directly.",
    scope: ["Identity", "Packaging", "Signage", "Uniforms", "Website"],
    hero: { alt: "Christophe's Fine Foods awning and monogram sign", ratio: "16 / 9" },
    details: [
      { alt: "Christophe's staff apron", ratio: "4 / 5" },
      { alt: "Christophe's reheatable meal trays with labels", ratio: "4 / 5" },
    ],
  },
  {
    number: "04",
    name: "Temakase",
    tagline: "Home of the handroll, with Mako on the window and the bag.",
    place: "New York",
    kind: "Hand roll bars",
    summary:
      "Temakase got a wordmark and a character. Mako is drawn after Ebisu, the Japanese god of fishermen and luck. He keeps the logo company instead of replacing it, and shows up on the window, the catering box and the sidewalk sign.",
    scope: ["Identity", "Character", "Storefront", "Menus", "Catering", "Takeout"],
    hero: { alt: "Temakase storefront with window graphics and sidewalk sign", ratio: "16 / 9" },
    details: [
      { alt: "Temakase lunch menu", ratio: "4 / 5" },
      { alt: "Temakase catering box with Mako", ratio: "4 / 5" },
    ],
  },
];

// Project locations. Sanity coordinates (atla.design/api/projects, read 2026-10-23) plus the
// hospitality clients that have no project page yet: Casa Las Tortugas, Christophe's, Temakase.
type Place = { name: string; projects: string; lat: number; lng: number; hospitality: boolean };

const PLACES: Place[] = [
  { name: "Los Cabos, Mexico", projects: "Acre Resort, Rústico", lat: 22.8905, lng: -109.9167, hospitality: true },
  { name: "Holbox, Mexico", projects: "Casa Las Tortugas", lat: 21.5236, lng: -87.378, hospitality: true },
  { name: "La Saladita, Mexico", projects: "Mundã", lat: 17.8762, lng: -101.7431, hospitality: true },
  { name: "Querétaro, Mexico", projects: "Huémac", lat: 20.5888, lng: -100.3899, hospitality: true },
  { name: "San Luis Potosí, Mexico", projects: "TigreTigre", lat: 22.1565, lng: -100.9855, hospitality: true },
  { name: "Monterrey, Mexico", projects: "Casa Colora", lat: 25.6866, lng: -100.3161, hospitality: true },
  { name: "Chicago, United States", projects: "Christophe's", lat: 41.8781, lng: -87.6298, hospitality: true },
  { name: "New York, United States", projects: "Temakase", lat: 40.7128, lng: -74.006, hospitality: true },
  { name: "Bali, Indonesia", projects: "The Bridge", lat: -8.6705, lng: 115.2126, hospitality: true },
  { name: "Austin", projects: "", lat: 30.2672, lng: -97.7431, hospitality: false },
  { name: "Dallas", projects: "", lat: 32.7767, lng: -96.797, hospitality: false },
  { name: "Los Angeles", projects: "", lat: 34.0522, lng: -118.2437, hospitality: false },
  { name: "San Diego", projects: "", lat: 32.7157, lng: -117.1611, hospitality: false },
  { name: "Bellevue", projects: "", lat: 47.6101, lng: -122.2015, hospitality: false },
  { name: "Charlotte", projects: "", lat: 35.2271, lng: -80.8431, hospitality: false },
  { name: "Upstate New York", projects: "", lat: 42.6526, lng: -73.7562, hospitality: false },
  { name: "Toronto", projects: "", lat: 43.6532, lng: -79.3832, hospitality: false },
  { name: "Amsterdam", projects: "", lat: 52.3676, lng: 4.9041, hospitality: false },
  { name: "Abu Dhabi", projects: "", lat: 24.4539, lng: 54.3773, hospitality: false },
  { name: "Dubai", projects: "", lat: 25.2048, lng: 55.2708, hospitality: false },
];

const TOUCHPOINTS = [
  "Brand architecture for every outlet",
  "Naming",
  "Identity and signature marks",
  "Website and booking path",
  "Photography and art direction",
  "Signage and wayfinding",
  "Room collateral and amenities",
  "Menus and F&B packaging",
  "Uniforms",
  "Operating standards for your team",
  "Production files and supplier specs",
];

const STAGES = [
  {
    name: "Audit",
    body: "We start on site, walking the property the way a guest would and noting every place the brand shows up. You come out of it with one brand architecture that covers each room, restaurant and service. For a group, we run the same audit on each property so the whole portfolio works from one method.",
    proof: "Casa Las Tortugas and Acre Resort.",
  },
  {
    name: "Brand",
    body: "We design the identity and every object around it, then hand over production files set up for the printer, embroiderer or builder who will make each one.",
    proof: "Acre Resort, Rústico, Christophe's and Temakase.",
  },
  {
    name: "Stay",
    body: "After launch we keep a weekly seat at the table, so new outlets, new rooms and the website come out of the same system.",
    proof: "We work with Acre and Temakase this way today.",
  },
];

const eyebrowStyle: CSSProperties = {
  fontFamily: SANS,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.48,
  lineHeight: "1.2",
  textTransform: "uppercase",
  color: MUTED,
  margin: 0,
};

const bodyStyle: CSSProperties = {
  fontFamily: SANS,
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.28,
  lineHeight: "1.55",
  color: INK,
  margin: 0,
};

const ctaStyle: CSSProperties = {
  fontFamily: SANS,
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: 0.4,
  lineHeight: "1.2",
  textTransform: "uppercase",
  textDecoration: "none",
  color: INK,
  minHeight: 48,
  display: "inline-flex",
  alignItems: "center",
  padding: "12px 4px",
};

function Figure({ image }: { image: CaseImage }) {
  return (
    <div
      role="img"
      aria-label={image.alt}
      style={{
        width: "100%",
        aspectRatio: image.ratio,
        backgroundColor: "#ececea",
        display: "flex",
        alignItems: "flex-end",
        padding: 14,
        boxSizing: "border-box",
      }}
    >
      <span style={{ ...eyebrowStyle, color: "#9a9a96" }}>{image.alt}</span>
    </div>
  );
}

function BadgeLine({ badge }: { badge: Badge }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 4 }}>
      <img
        src={badge.src}
        alt={badge.alt}
        loading="lazy"
        decoding="async"
        width={40}
        height={40}
        style={{ display: "block", width: 40, height: "auto", mixBlendMode: "multiply" }}
      />
      <p style={{ ...bodyStyle, fontSize: 13 }}>{badge.label}</p>
    </div>
  );
}

const GLOBE_INK: [number, number, number] = [0.13, 0.13, 0.13];
const GLOBE_GRAY: [number, number, number] = [0.62, 0.62, 0.6];
// cobe's phi/theta that put a longitude and latitude in front of the viewer.
const focusPhi = (lng: number) => Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2);
const focusTheta = (lat: number) => (lat * Math.PI) / 180;

function ProjectGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let size = canvas.offsetWidth;
    const basePhi = focusPhi(-98);
    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: basePhi,
      theta: focusTheta(24),
      markerElevation: 0,
      dark: 0,
      diffuse: 0.4,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: GLOBE_INK,
      glowColor: [0.98, 0.98, 0.98],
      markers: PLACES.map((place) => ({
        location: [place.lat, place.lng] as [number, number],
        size: place.hospitality ? 0.045 : 0.028,
        color: place.hospitality ? GLOBE_INK : GLOBE_GRAY,
      })),
    });

    // cobe 2 has no render loop of its own. Sway around the Americas, where most of the work is,
    // and only while the globe is on screen.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let visible = false;
    let t = 0;
    const tick = () => {
      t += 0.006;
      globe.update({ phi: basePhi + Math.sin(t) * 0.5 });
      frame = window.requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      window.cancelAnimationFrame(frame);
      if (visible && !reduceMotion) frame = window.requestAnimationFrame(tick);
    });
    observer.observe(canvas);

    const onResize = () => {
      size = canvas.offsetWidth;
      globe.update({ width: size * 2, height: size * 2 });
    };
    window.addEventListener("resize", onResize);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Globe with the places where Atla has done projects"
      style={{ display: "block", width: "100%", maxWidth: 520, aspectRatio: "1 / 1", margin: "0 auto" }}
    />
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, borderTop: `1px solid ${RULE}`, paddingTop: 20 }}>
      <p style={eyebrowStyle}>{eyebrow}</p>
      <h2
        style={{
          fontFamily: DISPLAY,
          fontSize: isMobile ? 30 : 44,
          fontWeight: 400,
          lineHeight: "1.1",
          color: INK,
          margin: 0,
          maxWidth: 820,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function CaseStudy({ item }: { item: HospitalityCase }) {
  const isMobile = useIsMobile();

  return (
    <article style={{ display: "flex", flexDirection: "column", gap: isMobile ? 14 : 20 }}>
      <Figure image={item.hero} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 0.34fr) minmax(0, 1fr)",
          gap: isMobile ? 10 : 24,
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <p style={eyebrowStyle}>
            {item.number} · {item.place}
          </p>
          <h3
            style={{
              fontFamily: DISPLAY,
              fontSize: isMobile ? 28 : 36,
              fontWeight: 400,
              lineHeight: "1.1",
              color: INK,
              margin: 0,
            }}
          >
            {item.name}
          </h3>
          <p style={{ fontFamily: DISPLAY, fontSize: isMobile ? 18 : 20, fontWeight: 400, lineHeight: "1.25", color: INK, margin: 0 }}>
            {item.tagline}
          </p>
          <p style={{ ...bodyStyle, color: MUTED }}>{item.kind}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 640 }}>
          <p style={bodyStyle}>{item.summary}</p>
          <p style={{ ...bodyStyle, color: MUTED }}>{item.scope.join(" · ")}</p>
          {item.badge ? <BadgeLine badge={item.badge} /> : null}
          {item.link ? (
            <a href={item.link.href} className="atla-link" style={ctaStyle}>
              {item.link.label} →
            </a>
          ) : null}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: item.details.length > 1 && !isMobile ? "repeat(2, minmax(0, 1fr))" : "1fr",
          gap: isMobile ? 8 : 12,
          alignItems: "start",
        }}
      >
        {item.details.map((image) => (
          <div key={image.alt} style={{ gridColumn: image.wide ? "1 / -1" : undefined }}>
            <Figure image={image.wide ? image : { ...image, ratio: "4 / 5" }} />
          </div>
        ))}
      </div>
    </article>
  );
}

const fieldStyle: CSSProperties = {
  ...bodyStyle,
  fontSize: 15,
  width: "100%",
  minHeight: 48,
  padding: "12px 14px",
  border: "1px solid #d8d8d8",
  borderRadius: 4,
  background: "#fff",
  boxSizing: "border-box",
  outlineOffset: 2,
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={eyebrowStyle}>{label}</span>
      {children}
    </label>
  );
}

function Choice({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <Field label={label}>
      <select name={name} required defaultValue="" style={{ ...fieldStyle, appearance: "auto" }}>
        <option value="" disabled>
          Choose one
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

type InquiryStatus = { state: "idle" | "submitting" | "sent" | "offline" } | { state: "error"; message: string };

// Posts to /api/contact like the audit questionnaire: the qualifying answers travel inside
// the message, so the Attio note carries them without a server change.
function InquiryForm() {
  const isMobile = useIsMobile();
  const [status, setStatus] = useState<InquiryStatus>({ state: "idle" });
  const statusRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (status.state === "sent") statusRef.current?.focus();
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
      `Budget: ${value("budget")}`,
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
      trackEvent("contact_form_submit", { page: "hospitality", property_type: value("propertyType"), budget: value("budget") });
    } catch {
      setStatus({ state: "error", message: "We could not reach the server. Email us instead." });
    }
  }

  const isSent = status.state === "sent";
  const isSubmitting = status.state === "submitting";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div ref={statusRef} role="status" aria-live="polite" tabIndex={-1} style={{ outline: "none" }}>
        {isSent ? (
          <p style={{ ...bodyStyle, fontWeight: 600 }}>Got it. José Pablo will write back with what we would do next.</p>
        ) : null}
      </div>
      {isSent ? null : (
        <form method="post" action="/api/contact" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <input type="hidden" name="source" value="atla.design/hospitality" />
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18 }}>
            <Field label="Name">
              <input name="name" type="text" required maxLength={120} autoComplete="name" style={fieldStyle} />
            </Field>
            <Field label="Email">
              <input name="email" type="email" required maxLength={200} autoComplete="email" inputMode="email" style={fieldStyle} />
            </Field>
            <Field label="Property, brand or group">
              <input name="company" type="text" required maxLength={160} autoComplete="organization" style={fieldStyle} />
            </Field>
            <Choice name="propertyType" label="Type of property" options={PROPERTY_TYPES} />
            <Choice name="stage" label="Stage of the project" options={STAGES_OF_WORK} />
            <Field label="Opening or launch date">
              <input name="opening" type="text" maxLength={60} placeholder="Month and year" style={fieldStyle} />
            </Field>
          </div>
          <Choice name="budget" label="Budget for brand and identity" options={BUDGETS} />
          <Field label="What should the guest feel when they walk in?">
            <textarea name="message" required minLength={10} maxLength={3000} rows={5} style={{ ...fieldStyle, resize: "vertical" }} />
          </Field>
          <div aria-hidden="true" style={{ position: "absolute", left: -10000, width: 1, height: 1, overflow: "hidden" }}>
            <label>
              Leave this field empty
              <input name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          {status.state === "offline" || status.state === "error" ? (
            <p role="alert" style={{ ...bodyStyle, color: status.state === "error" ? "#9a2d1f" : MUTED }}>
              {status.state === "error" ? status.message : "The form is offline right now. Write to us at"}{" "}
              <a href="mailto:josepablo@atla.design" style={{ color: INK }}>
                josepablo@atla.design
              </a>
            </p>
          ) : null}
          <p style={{ ...bodyStyle, color: MUTED }}>José Pablo reads it and writes back with what we would do first.</p>
          <p style={{ ...bodyStyle, fontSize: 13, color: MUTED }}>
            What you send goes to our CRM so we can answer you. See the{" "}
            <a href="/privacy" style={{ color: INK }}>
              privacy policy
            </a>
            .
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...ctaStyle,
                padding: "12px 24px",
                border: `1px solid ${INK}`,
                borderRadius: 999,
                background: INK,
                color: "#fafafa",
                cursor: "pointer",
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? "Sending…" : "Send"}
            </button>
            <a href="mailto:josepablo@atla.design" style={{ ...bodyStyle, color: MUTED, textDecoration: "underline" }}>
              or email josepablo@atla.design
            </a>
          </div>
        </form>
      )}
    </div>
  );
}

export default function AtlaHospitality() {
  const isMobile = useIsMobile();

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa" }}>
      <SeoHead
        title={formatMetaTitle("Hospitality", "Atla")}
        description={DESCRIPTION}
        pathname={PATHNAME}
        structuredData={buildServiceSchema({
          path: PATHNAME,
          name: "Branding for restaurants and hotels",
          description: DESCRIPTION,
        })}
      />
      <AtlaHeader />
      <div className="atla-dark-surface">
        <main
          className="atla-enter"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: isMobile ? "22px 8px 68px" : "34px 12px 112px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 1160,
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? 40 : 72,
            }}
          >
            <section style={{ display: "flex", flexDirection: "column", gap: isMobile ? 14 : 18 }}>
              <p style={eyebrowStyle}>Hotels and hospitality</p>
              <h1
                style={{
                  fontFamily: DISPLAY,
                  fontSize: isMobile ? 40 : 72,
                  fontWeight: 400,
                  lineHeight: "1.04",
                  color: INK,
                  margin: 0,
                  maxWidth: 980,
                }}
              >
                A hotel brand has to win the booking, then hold up for the whole stay.
              </h1>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 640 }}>
                <p style={bodyStyle}>
                  Guests compare you with a page of other hotels on the same screen. Then they meet your brand at the front
                  desk, the restaurant, the spa and the room key. We design for both moments, and we hand your team and
                  your vendors a system they can run.
                </p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: isMobile ? 10 : 16, paddingTop: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {[MICHELIN_KEY, MICHELIN_GREEN_STAR].map((mark) => (
                    <img
                      key={mark.src}
                      src={mark.src}
                      alt={mark.alt}
                      width={32}
                      height={32}
                      decoding="async"
                      style={{ display: "block", width: 32, height: 32, objectFit: "contain", mixBlendMode: "multiply" }}
                    />
                  ))}
                </div>
                <p style={{ ...bodyStyle, fontWeight: 600 }}>Casa Las Tortugas holds a MICHELIN Key. Acre Resort's restaurant holds a MICHELIN Green Star.</p>
                <p style={{ ...bodyStyle, color: MUTED, flexBasis: isMobile ? "100%" : "auto" }}>Selected clients: {PROOF_NAMES.join(" · ")}</p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <a href="#inquire" className="atla-link" style={ctaStyle}>
                  Tell us about your property →
                </a>
                <a href="#work" className="atla-link" style={{ ...ctaStyle, color: MUTED }}>
                  See the work ↓
                </a>
              </div>
              <div style={{ marginTop: isMobile ? 8 : 18 }}>
                <Figure image={HERO} />
              </div>
            </section>

            <section style={{ display: "flex", flexDirection: "column", gap: isMobile ? 20 : 28 }}>
              <SectionHead eyebrow="Why hotels come to us" title="What owners and brand teams tell us first" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
                  gap: isMobile ? 24 : 32,
                }}
              >
                {PROBLEMS.map((item) => (
                  <div key={item.problem} style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: `2px solid ${INK}`, paddingTop: 16 }}>
                    <h3 style={{ fontFamily: DISPLAY, fontSize: isMobile ? 22 : 26, fontWeight: 400, lineHeight: "1.2", color: INK, margin: 0 }}>
                      "{item.problem}"
                    </h3>
                    <p style={bodyStyle}>{item.answer}</p>
                    <p style={{ ...bodyStyle, color: MUTED }}>{item.proof}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="work" style={{ display: "flex", flexDirection: "column", gap: isMobile ? 32 : 56, scrollMarginTop: 80 }}>
              <SectionHead eyebrow="Hotels" title="Two hotels in Mexico, each with several outlets under one brand" />
              {HOTEL_CASES.map((item) => (
                <CaseStudy key={item.name} item={item} />
              ))}
            </section>

            <section style={{ display: "flex", flexDirection: "column", gap: isMobile ? 32 : 56 }}>
              <SectionHead eyebrow="Food and beverage" title="Restaurant work you can put inside a hotel" />
              {FB_CASES.map((item) => (
                <CaseStudy key={item.name} item={item} />
              ))}
            </section>

            <section style={{ display: "flex", flexDirection: "column", gap: isMobile ? 20 : 28 }}>
              <SectionHead eyebrow="Where we have worked" title="Nine places with hospitality work, most of them in Mexico" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) minmax(0, 0.9fr)",
                  gap: isMobile ? 20 : 40,
                  alignItems: "center",
                }}
              >
                <ProjectGlobe />
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {PLACES.filter((place) => place.hospitality).map((place) => (
                      <li
                        key={place.name}
                        style={{
                          ...bodyStyle,
                          display: "grid",
                          gridTemplateColumns: "16px 1fr",
                          alignItems: "baseline",
                          padding: "10px 0",
                          borderBottom: `1px solid ${RULE}`,
                        }}
                      >
                        <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 999, background: INK, display: "inline-block" }} />
                        <span>
                          {place.name} <span style={{ color: MUTED }}>· {place.projects}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p style={{ ...bodyStyle, color: MUTED }}>
                    In gray, the rest of our work:{" "}
                    {PLACES.filter((place) => !place.hospitality)
                      .map((place) => place.name)
                      .join(", ")}
                    .
                  </p>
                </div>
              </div>
            </section>

            <section style={{ display: "flex", flexDirection: "column", gap: isMobile ? 20 : 28 }}>
              <SectionHead eyebrow="What we design" title="What a hotel gets from us" />
              <ol
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
                  columnGap: 32,
                }}
              >
                {TOUCHPOINTS.map((item, index) => (
                  <li
                    key={item}
                    style={{
                      ...bodyStyle,
                      display: "grid",
                      gridTemplateColumns: "40px 1fr",
                      padding: "12px 0",
                      borderBottom: `1px solid ${RULE}`,
                    }}
                  >
                    <span style={{ color: MUTED }}>{String(index + 1).padStart(2, "0")}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section style={{ display: "flex", flexDirection: "column", gap: isMobile ? 20 : 28 }}>
              <SectionHead eyebrow="How we work" title="We start with an audit and stay after launch." />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
                  gap: isMobile ? 24 : 28,
                }}
              >
                {STAGES.map((stage, index) => (
                  <div
                    key={stage.name}
                    style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: `2px solid ${INK}`, paddingTop: 16 }}
                  >
                    <p style={eyebrowStyle}>{String(index + 1).padStart(2, "0")}</p>
                    <h3 style={{ fontFamily: DISPLAY, fontSize: isMobile ? 28 : 34, fontWeight: 400, lineHeight: "1.1", color: INK, margin: 0 }}>
                      {stage.name}
                    </h3>
                    <p style={bodyStyle}>{stage.body}</p>
                    <p style={{ ...bodyStyle, color: MUTED }}>{stage.proof}</p>
                  </div>
                ))}
              </div>
            </section>

            <section
              id="inquire"
              style={{
                borderTop: `1px solid ${RULE}`,
                paddingTop: 20,
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 0.8fr) minmax(0, 1fr)",
                gap: isMobile ? 20 : 40,
                alignItems: "start",
                scrollMarginTop: 80,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={eyebrowStyle}>Start here</p>
                <h2
                  style={{
                    fontFamily: DISPLAY,
                    fontSize: isMobile ? 30 : 44,
                    fontWeight: 400,
                    lineHeight: "1.1",
                    color: INK,
                    margin: 0,
                  }}
                >
                  Tell us about the property.
                </h2>
                <p style={bodyStyle}>
                  Opening, repositioning or adding an outlet, the first conversation is the same: what the property is,
                  who it is for, and where the brand breaks today. José Pablo Domínguez, our founder and creative
                  director, reads these and answers them himself.
                </p>
              </div>
              <InquiryForm />
            </section>
          </div>
        </main>
      </div>
      <AtlaFooter />
    </div>
  );
}
