import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { formatMetaTitle } from "@shared/siteSeo";
import { SeoHead } from "@/components/seo/SeoHead";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { AtlaHeader, type AtlaCta } from "@/components/atla/AtlaHeader";
import { buildServiceSchema, type FaqItem } from "@/components/atla/AtlaLongformLayout";
import { trackEvent } from "@/hooks/use-analytics";
import { useIsMobile } from "@/hooks/use-mobile";

const PATHNAME = "/hospitality";
const DESCRIPTION =
  "Atla designs hospitality brands for hotels, restaurants, wellness and coffee. Clients include a MICHELIN Key hotel and a MICHELIN Green Star restaurant.";

// ABC Synt is only installed locally, so visitors get Instrument Serif (Google Fonts, the deck's face) instead of Helvetica.
const DISPLAY = "'ABC Synt Variable Unlicensed Trial', 'Instrument Serif', Georgia, serif";
const DISPLAY_FONT_HREF = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap";
const SANS = "'Libre Franklin', Helvetica, sans-serif";
const INK = "#1c1f27";
const PAPER = "#f4f0e8";
const PLACEHOLDER = "#e7e1d4";
const MUTED = "#6b6a66";
const RULE = "rgba(28,31,39,0.18)";

// "Atla* Branding Agency" intro event on Calendly.
const INTRO_URL = "https://calendly.com/josepablo-atla/30min?utm_source=atla.design&utm_medium=hospitality";
// One path on this page: header, footer and every link go to the introduction.
const INTRO_CTA: AtlaCta = { label: "Inquire", href: INTRO_URL, external: true };

// Project photography is pending; each slot renders as a placeholder labelled with what goes there.
// TEMPORARY (design review only): `src` points at deck and Sanity images so JP can judge the layout.
// JP's own photos replace every one of them before this page is merged.
type CaseImage = { alt: string; ratio: string; src?: string; position?: string };

const SANITY = "https://cdn.sanity.io/images/dvufm78f/production";
const sanityImage = (file: string, width: number) => `${SANITY}/${file}?w=${width}&auto=format&q=80`;

type CaseSpec = { label: string; value: string };

type HospitalityCase = {
  name: string;
  place: string;
  tagline: string;
  summary: string;
  specs: CaseSpec[];
  image: CaseImage;
  link?: { href: string; label: string };
};

const MICHELIN_KEY = { src: "/hospitality/michelin-key.webp", alt: "MICHELIN Key" };
const MICHELIN_GREEN_STAR = { src: "/hospitality/michelin-green-star.svg", alt: "MICHELIN Green Star" };

const AWARDS = [
  { ...MICHELIN_KEY, label: "MICHELIN Key", who: "Casa Las Tortugas" },
  { ...MICHELIN_GREEN_STAR, label: "MICHELIN Green Star", who: "Acre" },
];

const PROPERTY_TYPES = [
  "Independent hotel or resort",
  "Hotel within a brand or group",
  "Restaurant or bar inside a hotel",
  "Standalone restaurant or bar",
  "Other",
];
const STAGES_OF_WORK = ["Opening a new property", "Repositioning an existing property", "Adding an outlet or concept", "Other"];
const BUDGETS = ["$50K to $100K", "$100K to $250K", "$250K and up", "Not sure yet"];

const HERO: CaseImage = { alt: "Acre Resort entrance with the wordmark", ratio: "16 / 9", src: "/hospitality/review/acre-entrance.webp" };

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
  { name: "Denver", projects: "", lat: 39.7392, lng: -104.9903, hospitality: false },
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

// Names stand in for the logo files until they arrive.
const SELECTED_CLIENTS = [
  "Acre Resort",
  "Casa Las Tortugas",
  "Christophe's",
  "Temakase",
  "TigreTigre",
  "Casa Colora",
  "Mundã",
  "Huémac",
  "The Bridge",
];

const HOTELS: HospitalityCase[] = [
  {
    name: "Acre Resort",
    place: "Los Cabos, Mexico",
    tagline: "Treehouses, villas, a restaurant and a bar under one brand.",
    summary:
      "Acre runs treehouses, villas, a restaurant, a mezcal bar and weddings on one property. We audited it the way a guest moves through it, wrote one brand architecture and the brand book, designed the website and created Rústico, an open-air dinner on the grounds. We still work with Acre every week.",
    specs: [
      { label: "Scope", value: "Audit, brand architecture, brand book, website, Rústico" },
      { label: "Distinction", value: "MICHELIN Green Star, Acre's restaurant" },
    ],
    image: { alt: "Acre amenity oil and towel with the wordmark", ratio: "4 / 5", src: "/hospitality/review/acre-objects.webp", position: "100% center" },
    link: { href: "/projects/rustico", label: "Rústico" },
  },
  {
    name: "Casa Las Tortugas",
    place: "Holbox, Mexico",
    tagline: "Four restaurants and a spa on one beach.",
    summary:
      "A family-owned hotel on Holbox's main beach. We audited the property, then set the brand architecture across its four restaurants and spa, and wrote the operating standards the team works from. The findings stay with the client.",
    specs: [
      { label: "Scope", value: "Hospitality audit, brand architecture, operating standards" },
      { label: "Distinction", value: "MICHELIN Key" },
    ],
    image: { alt: "Casa Las Tortugas, Holbox", ratio: "4 / 5" },
  },
];

const RESTAURANTS: HospitalityCase[] = [
  {
    name: "Christophe's Fine Foods",
    place: "Chicago",
    tagline: "A neighborhood market with a chef behind the counter.",
    summary:
      "Built from a blank page: logotype, monogram, awning, aprons, totes and a line of reheatable meal trays, with a supplier sheet so the owner could order everything directly.",
    specs: [{ label: "Scope", value: "Identity, packaging, signage, uniforms, website" }],
    image: { alt: "Christophe's Fine Foods awning and monogram sign", ratio: "3 / 2", src: "/hospitality/review/christophes-storefront.webp" },
  },
  {
    name: "Temakase",
    place: "New York",
    tagline: "Home of the handroll.",
    summary:
      "Hand roll bars with a wordmark and a character. Mako is drawn after Ebisu, the Japanese god of fishermen and luck, and appears on the window, the catering box and the sidewalk sign.",
    specs: [{ label: "Scope", value: "Identity, character, storefront, menus, catering" }],
    image: { alt: "Temakase storefront with window graphics", ratio: "3 / 2", src: "/hospitality/review/temakase-storefront.webp" },
  },
];

const METHOD = [
  {
    numeral: "I",
    name: "Audit",
    body: "We walk the property the way a guest does and map every outlet, from the booking page to the room. You come away with one brand architecture.",
  },
  {
    numeral: "II",
    name: "Brand",
    body: "Identity, naming and every object a guest touches, delivered as production files your vendors can use.",
  },
  {
    numeral: "III",
    name: "Stay",
    body: "A weekly seat at the table after launch, so new outlets, rooms and the website come out of the same system.",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Do you work with hotels that belong to a brand or group?",
    answer:
      "Yes. We start from the group's standards and design what makes this hotel its own. Across several properties, the audit runs the same way on each one.",
  },
  {
    question: "Can we start with the audit alone?",
    answer:
      "You can. The audit stands on its own: you get the brand architecture and a list of what to fix first. If we continue, it becomes the brief for the brand work.",
  },
  {
    question: "Will you show our project?",
    answer: "Only with your permission. With Casa Las Tortugas we name the client and the method, and the findings stay private.",
  },
  {
    question: "What happens in the introduction?",
    answer:
      "A short conversation with José Pablo about the property and what is not working. He tells you what we would do first, which for most properties is the audit.",
  },
];

const labelStyle: CSSProperties = {
  fontFamily: SANS,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 1.6,
  lineHeight: "1.4",
  textTransform: "uppercase",
  color: MUTED,
  margin: 0,
};

const bodyStyle: CSSProperties = {
  fontFamily: SANS,
  fontSize: 15,
  fontWeight: 400,
  letterSpacing: 0.1,
  lineHeight: "1.65",
  color: INK,
  margin: 0,
};

const ctaStyle: CSSProperties = {
  fontFamily: SANS,
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: 1.4,
  textTransform: "uppercase",
  textDecoration: "none",
  color: INK,
  minHeight: 44,
  display: "inline-flex",
  alignItems: "center",
};

// "Our take on branding", rebuilt from slide 29:592 of the Atla Intro Deck (Figma).
// Positions are percentages of a 1060 x 750 frame, measured from the slide.
const TAKE_TILES = [
  { name: "TigreTigre", src: sanityImage("4db603342969023ae67d8fde174854cdc3bc0aa4-1400x788.png", 600), x: 0, y: 37, w: 15.7, ratio: "166 / 200" },
  { name: "Rústico", src: sanityImage("7cc46aa684db97a142951eea093612947de54122-2616x1445.png", 600), x: 18, y: 13, w: 15.7, ratio: "166 / 200" },
  { name: "Baristio", src: sanityImage("0d972a00ce19c334bee663286c8bdec400d70ccb-2616x1445.png", 600), x: 42, y: 0, w: 15.7, ratio: "166 / 216" },
  { name: "Angeles Wellness", src: sanityImage("97d041917fb7859099cf40caef8e25704b6faf25-1080x1440.png", 600), x: 63, y: 7.7, w: 14, ratio: "1 / 1" },
  { name: "Persona", src: sanityImage("0a70dd45515bc5ed36769a8d9ae87b8f4f499dce-1453x803.jpg", 600), x: 83, y: 23.5, w: 14, ratio: "150 / 182" },
  { name: "Casa Colora", src: sanityImage("38132ee83995acfe226e73b2d0fa72edd40e31c3-1722x986.png", 600), x: 84.5, y: 52, w: 15.5, ratio: "166 / 192" },
  { name: "Bond&Bloom", src: sanityImage("4347625dbb9d17c5d2e1ed6b2e87e9a18ab59125-3840x2160.jpg", 600), x: 64, y: 63.7, w: 13.4, ratio: "142 / 192" },
  { name: "Reggie", src: sanityImage("ba880c418a42908393fec8329d62677112533e9d-1744x964.png", 600), x: 42.5, y: 71, w: 13.4, ratio: "142 / 216" },
  { name: "Arc Studio", src: sanityImage("05dd95e74edfd5572c9c6c677ceab72b53207760-3000x2000.jpg", 600), x: 19, y: 65, w: 13.4, ratio: "142 / 208" },
];
const TAKE_WORDS = [
  { word: "Voice & values", x: 37.7, y: 44.5 },
  { word: "Strategy", x: 54.7, y: 45 },
  { word: "Loyalty", x: 32.9, y: 49 },
  { word: "Brands", x: 47.5, y: 49.2 },
  { word: "Humans", x: 41.2, y: 52.8 },
  { word: "Visual identity", x: 51, y: 52.7 },
  { word: "Customer experience", x: 37.4, y: 57.5 },
  { word: "Storytelling", x: 56.8, y: 56 },
];

function Figure({ image, eager = false }: { image: CaseImage; eager?: boolean }) {
  if (image.src) {
    return (
      <img
        src={image.src}
        alt={image.alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          aspectRatio: image.ratio,
          objectFit: "cover",
          objectPosition: image.position ?? "center",
          backgroundColor: PLACEHOLDER,
        }}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={image.alt}
      style={{
        width: "100%",
        aspectRatio: image.ratio,
        backgroundColor: PLACEHOLDER,
        display: "flex",
        alignItems: "flex-end",
        padding: 14,
        boxSizing: "border-box",
      }}
    >
      <span style={{ ...labelStyle, color: "#9a9a96" }}>{image.alt}</span>
    </div>
  );
}

function IntroLink({ position, inverted = false }: { position: string; inverted?: boolean }) {
  return (
    <a
      href={INTRO_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("book_call_click", { page: "hospitality", cta_type: position })}
      style={{
        ...ctaStyle,
        color: inverted ? PAPER : INK,
        borderBottom: `1px solid ${inverted ? PAPER : INK}`,
        minHeight: 0,
        paddingBottom: 4,
      }}
    >
      Request an introduction
    </a>
  );
}

function Label({ children, inverted = false }: { children: ReactNode; inverted?: boolean }) {
  return <p style={{ ...labelStyle, color: inverted ? "rgba(244,240,232,0.6)" : MUTED }}>{children}</p>;
}

// Equirectangular frame of americas-dots.svg (Natural Earth 110m land, public domain): 128W to 56W, 56N to 12N.
const MAP_LEFT = -128;
const MAP_WIDTH = 72;
const MAP_TOP = 56;
const MAP_HEIGHT = 44;
const inMapFrame = (place: Place) =>
  place.lng >= MAP_LEFT && place.lng <= MAP_LEFT + MAP_WIDTH && place.lat <= MAP_TOP && place.lat >= MAP_TOP - MAP_HEIGHT;

function ProjectMap() {
  const isMobile = useIsMobile();
  const placesOnMap = PLACES.filter(inMapFrame).sort((x, y) => Number(x.hospitality) - Number(y.hospitality));
  return (
    <div
      role="img"
      aria-label={`Map of the places in the Americas where Atla has done projects: ${placesOnMap.map((place) => place.name).join(", ")}`}
      style={{ position: "relative", width: "100%", aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}
    >
      <img src="/hospitality/americas-dots.svg" alt="" decoding="async" style={{ display: "block", width: "100%", height: "100%" }} />
      {/* Hospitality work is solid ink; the rest of the work is an ink ring. */}
      {placesOnMap.map((place) => {
        const size = place.hospitality ? (isMobile ? 7 : 11) : isMobile ? 6 : 8;
        return (
          <span
            key={place.name}
            title={place.projects ? `${place.name} · ${place.projects}` : place.name}
            style={{
              position: "absolute",
              left: `${((place.lng - MAP_LEFT) / MAP_WIDTH) * 100}%`,
              top: `${((MAP_TOP - place.lat) / MAP_HEIGHT) * 100}%`,
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              borderRadius: 999,
              boxSizing: "border-box",
              background: place.hospitality ? INK : PAPER,
              border: place.hospitality ? "none" : `1.5px solid ${INK}`,
              boxShadow: `0 0 0 2px ${PAPER}`,
            }}
          />
        );
      })}
    </div>
  );
}

function Specs({ specs }: { specs: CaseSpec[] }) {
  return (
    <dl style={{ margin: 0, borderTop: `1px solid ${RULE}` }}>
      {specs.map((spec) => (
        <div key={spec.label} style={{ display: "grid", gridTemplateColumns: "112px 1fr", gap: 16, padding: "12px 0", borderBottom: `1px solid ${RULE}` }}>
          <dt style={labelStyle}>{spec.label}</dt>
          <dd style={{ ...bodyStyle, fontSize: 14, margin: 0 }}>{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function HotelFeature({ item, flip }: { item: HospitalityCase; flip: boolean }) {
  const isMobile = useIsMobile();
  return (
    <article
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.15fr) minmax(0, 1fr)",
        gap: isMobile ? 24 : 72,
        alignItems: "center",
      }}
    >
      <div style={{ order: isMobile || !flip ? 0 : 1 }}>
        <Figure image={item.image} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 480 }}>
        <Label>{item.place}</Label>
        <h3 style={{ fontFamily: DISPLAY, fontSize: isMobile ? 34 : 48, fontWeight: 400, lineHeight: "1.02", color: INK, margin: 0 }}>{item.name}</h3>
        <p style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: isMobile ? 19 : 22, lineHeight: "1.3", color: INK, margin: 0 }}>{item.tagline}</p>
        <p style={bodyStyle}>{item.summary}</p>
        <Specs specs={item.specs} />
        {item.link ? (
          <a href={item.link.href} style={{ ...ctaStyle, minHeight: 0, alignSelf: "flex-start", borderBottom: `1px solid ${INK}`, paddingBottom: 4 }}>
            {item.link.label}
          </a>
        ) : null}
      </div>
    </article>
  );
}

function RestaurantFeature({ item }: { item: HospitalityCase }) {
  return (
    <article style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Figure image={item.image} />
      <Label>{item.place}</Label>
      <h3 style={{ fontFamily: DISPLAY, fontSize: 32, fontWeight: 400, lineHeight: "1.05", color: INK, margin: 0 }}>{item.name}</h3>
      <p style={{ fontFamily: DISPLAY, fontStyle: "italic", fontSize: 19, lineHeight: "1.3", color: INK, margin: 0 }}>{item.tagline}</p>
      <p style={bodyStyle}>{item.summary}</p>
      <Specs specs={item.specs} />
    </article>
  );
}

function TakeConstellation() {
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ ...labelStyle, color: INK, lineHeight: "2" }}>{TAKE_WORDS.map((item) => item.word).join(" · ")}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
          {TAKE_TILES.map((tile) => (
            <Figure key={tile.name} image={{ alt: tile.name, ratio: "3 / 4", src: tile.src }} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "1060 / 750" }}>
      {/* Thin lines from each project to the middle, like the deck slide. */}
      <svg viewBox="0 0 1060 750" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {TAKE_TILES.map((tile) => {
          const cx = ((tile.x + tile.w / 2) / 100) * 1060;
          const cy = (tile.y / 100) * 750 + 90;
          return (
            <path
              key={tile.name}
              d={`M${cx} ${cy} Q ${(cx + 500) / 2} ${cy > 375 ? cy - 60 : cy + 60} 500 375`}
              fill="none"
              stroke="#d4d4cf"
              strokeWidth={1}
            />
          );
        })}
      </svg>
      {TAKE_TILES.map((tile) => (
        <div key={tile.name} style={{ position: "absolute", left: `${tile.x}%`, top: `${tile.y}%`, width: `${tile.w}%` }}>
          <Figure image={{ alt: tile.name, ratio: tile.ratio, src: tile.src }} />
        </div>
      ))}
      {TAKE_WORDS.map((item) => (
        <span
          key={item.word}
          style={{
            ...labelStyle,
            fontSize: 11,
            color: INK,
            position: "absolute",
            left: `${item.x}%`,
            top: `${item.y}%`,
            background: PAPER,
            padding: "2px 4px",
            whiteSpace: "nowrap",
          }}
        >
          {item.word}
        </span>
      ))}
    </div>
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
      <span style={labelStyle}>{label}</span>
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
                borderRadius: 0,
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
  const gutter = isMobile ? 16 : 48;
  const sectionGap = isMobile ? 72 : 120;

  useEffect(() => {
    if (document.querySelector(`link[href="${DISPLAY_FONT_HREF}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = DISPLAY_FONT_HREF;
    document.head.appendChild(link);
  }, []);

  const hospitalityPlaces = PLACES.filter((place) => place.hospitality).map((place) => place.name.split(",")[0]);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: PAPER }}>
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
      <AtlaHeader cta={INTRO_CTA} background={PAPER} />
      <main
        className="atla-enter"
        style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", background: PAPER, paddingBottom: isMobile ? 0 : 0 }}
      >
        <div style={{ width: "100%", maxWidth: 1280, padding: `0 ${gutter}px`, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: sectionGap }}>
          {/* Hero */}
          <section style={{ display: "flex", flexDirection: "column", gap: isMobile ? 22 : 32, paddingTop: isMobile ? 40 : 96 }}>
            <Label>Restaurants · Wellness · Coffee Shops · Hotels</Label>
            {/* PP Playground drawn as outlines (script/build_hospitality_wordmark.py) so every visitor sees it. */}
            <img
              src="/hospitality/hospitality-wordmark.svg"
              alt="Hospitality"
              decoding="async"
              style={{ display: "block", width: isMobile ? "88%" : 760, maxWidth: "100%", height: "auto", aspectRatio: "3560 / 1100", marginLeft: isMobile ? -6 : -18 }}
            />
            <h1
              style={{
                fontFamily: DISPLAY,
                fontSize: isMobile ? 28 : 46,
                fontWeight: 400,
                lineHeight: "1.12",
                color: INK,
                margin: 0,
                maxWidth: 900,
              }}
            >
              We design hospitality experiences people love, win awards, and make sure your guests keep coming back.
            </h1>
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "flex-end",
                justifyContent: "space-between",
                gap: 28,
                borderTop: `1px solid ${RULE}`,
                paddingTop: 24,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Label>Recent client awards</Label>
                {AWARDS.map((award) => (
                  <div key={award.src} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img src={award.src} alt="" width={22} height={22} decoding="async" style={{ width: 22, height: 22, objectFit: "contain", mixBlendMode: "multiply" }} />
                    <span style={{ ...bodyStyle, fontSize: 14 }}>
                      {award.label} <span style={{ color: MUTED }}>· {award.who}</span>
                    </span>
                  </div>
                ))}
              </div>
              <IntroLink position="hero" />
            </div>
          </section>
        </div>

        {/* Full-bleed hero image */}
        <div style={{ width: "100%", maxWidth: 1600, padding: isMobile ? "40px 0 0" : "56px 0 0", boxSizing: "border-box" }}>
          <Figure image={HERO} eager />
        </div>

        <div style={{ width: "100%", maxWidth: 1280, padding: `0 ${gutter}px`, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: sectionGap, paddingTop: isMobile ? 56 : 96 }}>
          {/* Selected clients */}
          <section style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "200px 1fr", gap: isMobile ? 12 : 40 }}>
            <Label>Selected clients</Label>
            <p style={{ fontFamily: DISPLAY, fontSize: isMobile ? 22 : 30, lineHeight: "1.35", color: INK, margin: 0 }}>
              {SELECTED_CLIENTS.join(" · ")}
            </p>
          </section>

          {/* Our take on branding */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 0.4fr) minmax(0, 1fr)",
              gap: isMobile ? 32 : 56,
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Label>Our take on branding</Label>
              <h2 style={{ fontFamily: DISPLAY, fontSize: isMobile ? 28 : 36, fontWeight: 400, lineHeight: "1.12", color: INK, margin: 0 }}>
                Branding goes far beyond visuals, it’s the foundation of building a complete and memorable identity.
              </h2>
              <p style={bodyStyle}>
                While the visual elements are the starting point, a true brand is shaped by a cohesive strategy that aligns
                tone, voice, and objectives.
              </p>
              <p style={bodyStyle}>
                The ultimate goal of branding is to foster meaningful, long-term relationships that inspire loyalty and
                trust, turning every interaction into an opportunity to connect with your audience on a deeper level.
              </p>
            </div>
            <TakeConstellation />
          </section>

          {/* Hotels */}
          <section id="work" style={{ display: "flex", flexDirection: "column", gap: isMobile ? 64 : 96, scrollMarginTop: 80 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Label>Hotels</Label>
              <h2 style={{ fontFamily: DISPLAY, fontSize: isMobile ? 30 : 52, fontWeight: 400, lineHeight: "1.05", color: INK, margin: 0, maxWidth: 820 }}>
                Properties with many outlets and one brand.
              </h2>
            </div>
            {HOTELS.map((item, index) => (
              <HotelFeature key={item.name} item={item} flip={index % 2 === 1} />
            ))}
          </section>

          {/* Restaurants */}
          <section style={{ display: "flex", flexDirection: "column", gap: isMobile ? 40 : 56 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Label>Restaurants</Label>
              <h2 style={{ fontFamily: DISPLAY, fontSize: isMobile ? 30 : 52, fontWeight: 400, lineHeight: "1.05", color: INK, margin: 0, maxWidth: 820 }}>
                Restaurant work, from the awning to the takeout bag.
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))", gap: isMobile ? 64 : 56 }}>
              {RESTAURANTS.map((item) => (
                <RestaurantFeature key={item.name} item={item} />
              ))}
            </div>
          </section>
        </div>

        {/* Method, on ink */}
        <section style={{ width: "100%", background: INK, marginTop: sectionGap, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "100%",
              maxWidth: 1280,
              padding: isMobile ? `72px ${gutter}px` : `128px ${gutter}px`,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? 40 : 64,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 760 }}>
              <Label inverted>Method</Label>
              <h2 style={{ fontFamily: DISPLAY, fontSize: isMobile ? 32 : 52, fontWeight: 400, lineHeight: "1.05", color: PAPER, margin: 0 }}>
                Audit, brand, then stay.
              </h2>
              <p style={{ ...bodyStyle, color: "rgba(244,240,232,0.75)" }}>
                We believe in a holistic approach to branding, guided by defined creative processes and the understanding
                that great brands are built day by day.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))", gap: isMobile ? 36 : 48 }}>
              {METHOD.map((step) => (
                <div key={step.name} style={{ display: "flex", flexDirection: "column", gap: 12, borderTop: "1px solid rgba(244,240,232,0.22)", paddingTop: 20 }}>
                  <p style={{ fontFamily: DISPLAY, fontSize: 18, color: "rgba(244,240,232,0.6)", margin: 0 }}>{step.numeral}</p>
                  <h3 style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 400, lineHeight: "1.1", color: PAPER, margin: 0 }}>{step.name}</h3>
                  <p style={{ ...bodyStyle, color: "rgba(244,240,232,0.75)" }}>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div style={{ width: "100%", maxWidth: 1280, padding: `0 ${gutter}px`, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: sectionGap, paddingTop: sectionGap }}>
          {/* Places */}
          <section style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "200px 1fr", gap: isMobile ? 12 : 40 }}>
            <Label>Where we have worked</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 20 : 28 }}>
              <ProjectMap />
              <p style={{ fontFamily: DISPLAY, fontSize: isMobile ? 22 : 30, lineHeight: "1.35", color: INK, margin: 0 }}>
                {hospitalityPlaces.join(" · ")}
              </p>
              <p style={{ ...bodyStyle, fontSize: 13, color: MUTED }}>
                Solid points mark hospitality work; rings mark the rest of our work. Also in{" "}
                {PLACES.filter((place) => !inMapFrame(place))
                  .map((place) => place.name.split(",")[0])
                  .join(", ")}
                .
              </p>
            </div>
          </section>

          {/* FAQ as plain text */}
          <section style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "200px 1fr", gap: isMobile ? 20 : 40 }}>
            <Label>Questions</Label>
            <dl style={{ margin: 0, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))", gap: isMobile ? 28 : 48 }}>
              {FAQ_ITEMS.map((item) => (
                <div key={item.question} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <dt style={{ fontFamily: DISPLAY, fontSize: 22, lineHeight: "1.25", color: INK }}>{item.question}</dt>
                  <dd style={{ ...bodyStyle, margin: 0, color: MUTED }}>{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        {/* Closing, on ink */}
        <section
          id="inquire"
          style={{ width: "100%", background: INK, marginTop: sectionGap, display: "flex", justifyContent: "center", scrollMarginTop: 80 }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 1280,
              padding: isMobile ? `72px ${gutter}px` : `128px ${gutter}px`,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: 28,
              alignItems: "flex-start",
            }}
          >
            <h2 style={{ fontFamily: DISPLAY, fontSize: isMobile ? 36 : 72, fontWeight: 400, lineHeight: "1.02", color: PAPER, margin: 0, maxWidth: 900 }}>
              Tell us about your property.
            </h2>
            <IntroLink position="closing" inverted />
            <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 24 }}>
              <p style={{ fontFamily: DISPLAY, fontSize: 20, color: PAPER, margin: 0 }}>José Pablo Domínguez</p>
              <Label inverted>Founder and Creative Director</Label>
            </div>
          </div>
        </section>

        <div style={{ width: "100%", maxWidth: 1280, padding: `40px ${gutter}px ${isMobile ? 72 : 112}px`, boxSizing: "border-box" }}>
          <details>
            <summary style={{ ...ctaStyle, color: MUTED, cursor: "pointer", listStyle: "none" }}>Prefer to write? Send the details</summary>
            <div style={{ paddingTop: 20, maxWidth: 760 }}>
              <InquiryForm />
            </div>
          </details>
        </div>
      </main>
      <AtlaFooter cta={INTRO_CTA} />
    </div>
  );
}
