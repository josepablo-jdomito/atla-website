import { useState, useEffect } from "react";

const LIBRE = "'Libre Franklin', Helvetica, sans-serif";
const ABC_SYNT = "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif";

const NAV_FONT = {
  fontFamily: LIBRE,
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.28,
  color: "#222",
} as const;

const LABEL_FONT = {
  fontFamily: LIBRE,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.48,
  lineHeight: "120%",
  textTransform: "uppercase" as const,
  color: "#222",
};

const FILTER_ITEM = {
  fontFamily: LIBRE,
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.28,
  lineHeight: "110%",
};

const footerNav = ["Work", "About", "Services", "Careers", "Journal", "Contact"];
const footerSocials = ["Instagram", "Behance", "Linkedin", "Facebook"];
const OFFICE_TZS = [
  { city: "Austin, US", tz: "America/Chicago" },
  { city: "CDMX, MX", tz: "America/Mexico_City" },
  { city: "Caracas, VZ", tz: "America/Caracas" },
  { city: "Lima, PE", tz: "America/Lima" },
  { city: "Tijuana, MX", tz: "America/Tijuana" },
];
function useOfficeTimes() {
  const compute = () => {
    const now = new Date();
    const r: Record<string, string> = {};
    OFFICE_TZS.forEach(({ city, tz }) => {
      r[city] = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }).format(now);
    });
    return r;
  };
  const [times, setTimes] = useState<Record<string, string>>(compute);
  useEffect(() => {
    const id = setInterval(() => setTimes(compute()), 10000);
    return () => clearInterval(id);
  }, []);
  return times;
}

// Seeded project data mirrored from the database for static mockup
const PROJECTS = [
  {
    slug: "flux-division",
    title: "Flux Division",
    client: "Flux Division",
    year: 2025,
    category: "Motion Design",
    region: "America",
    industry: "Digital",
    service: "Art Direction",
    cover: "https://images.unsplash.com/photo-1536240478700-b869ad10a2ab?w=600&q=80",
  },
  {
    slug: "solari-house",
    title: "Solari House",
    client: "Solari House",
    year: 2025,
    category: "Brand Identity",
    region: "America",
    industry: "Consumer Goods",
    service: "Branding",
    cover: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
  },
  {
    slug: "klyra-house",
    title: "Klyra House",
    client: "Klyra House",
    year: 2024,
    category: "Visual Identity",
    region: "America",
    industry: "Hospitality",
    service: "Branding",
    cover: "https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=600&q=80",
  },
  {
    slug: "veer-studio",
    title: "Veer Studio",
    client: "Veer Studio",
    year: 2024,
    category: "Brand Identity",
    region: "America",
    industry: "Consumer Goods",
    service: "Packaging",
    cover: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80",
  },
  {
    slug: "aerith-agency",
    title: "Aerith",
    client: "Aerith Agency",
    year: 2024,
    category: "Web Design",
    region: "America",
    industry: "Digital",
    service: "Website",
    cover: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80",
  },
  {
    slug: "lumae-systems",
    title: "Lumae Systems",
    client: "Lumae Systems",
    year: 2023,
    category: "Art Direction",
    region: "America",
    industry: "SAAS",
    service: "Art Direction",
    cover: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80",
  },
  {
    slug: "onera-rebrand",
    title: "Onera Rebrand",
    client: "Onera Creative",
    year: 2023,
    category: "Brand Identity",
    region: "America",
    industry: "Consumer Goods",
    service: "Branding",
    cover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    slug: "meridian-arch",
    title: "Meridian Architecture",
    client: "Meridian Architecture",
    year: 2023,
    category: "Visual Identity",
    region: "Europe",
    industry: "Hospitality",
    service: "Branding",
    cover: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80",
  },
  {
    slug: "tessera-editorial",
    title: "Tessera Editorial",
    client: "Tessera",
    year: 2022,
    category: "Art Direction",
    region: "Europe",
    industry: "Food & Beverage",
    service: "Art Direction",
    cover: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  },
  {
    slug: "nori-co",
    title: "Nori Co.",
    client: "Nori Co.",
    year: 2022,
    category: "Brand Identity",
    region: "Asia",
    industry: "Food & Beverage",
    service: "Packaging",
    cover: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
  },
  {
    slug: "halvani-studio",
    title: "Halvani Studio",
    client: "Halvani Studio",
    year: 2022,
    category: "Brand Identity",
    region: "Middle East",
    industry: "Hospitality",
    service: "Branding",
    cover: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600&q=80",
  },
  {
    slug: "vaux-digital",
    title: "Vaux Digital",
    client: "Vaux Digital",
    year: 2022,
    category: "Web Design",
    region: "America",
    industry: "SAAS",
    service: "Website",
    cover: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
  },
];

const REGIONS = ["All", "America", "Europe", "Asia", "Middle East"];
const INDUSTRIES = ["All", "Hospitality", "Food & Beverage", "Consumer Goods", "SAAS", "Digital"];
const SERVICES = ["All", "Branding", "Art Direction", "Packaging", "Website"];
const VIEWS = ["Masonry", "Grid", "List"];

function Nav() {
  return (
    <nav
      className="flex w-full items-end justify-between px-5"
      style={{ height: 50, position: "absolute", top: 0, left: 0, zIndex: 10 }}
    >
      <div className="flex items-center gap-3.5 flex-1">
        {["Work", "About", "Services"].map((link) => (
          <a key={link} href="#" className="no-underline" style={NAV_FONT}>
            {link}
          </a>
        ))}
      </div>
      <div className="flex flex-1 justify-center">
        <img
          alt="Atla Logo"
          src="/__mockup/figmaAssets/p-framer-text.svg"
          className="h-7 object-contain"
        />
      </div>
      <div className="flex items-end justify-end gap-3.5 flex-1">
        {["Journal", "Contact"].map((link) => (
          <a key={link} href="#" className="no-underline" style={NAV_FONT}>
            {link}
          </a>
        ))}
        {/* Light/dark toggle icons */}
        <div style={{ display: "flex", alignItems: "center", height: 20, flexShrink: 0 }}>
          <div style={{ position: "relative", width: 20, height: 20, flexShrink: 0 }}>
            <img alt="Light mode" src="/__mockup/figmaAssets/toggle-sun.png"
              style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div style={{ position: "relative", width: 20, height: 20, flexShrink: 0 }}>
            <img alt="Dark mode" src="/__mockup/figmaAssets/toggle-moon.png"
              style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  const times = useOfficeTimes();
  return (
    <div
      style={{
        backgroundColor: "#ffc629",
        width: "100%",
        height: 750,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 48,
          alignItems: "flex-start",
          padding: 20,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              gap: 240,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 72,
                alignItems: "flex-start",
                fontFamily: LIBRE,
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: 0.28,
                color: "#222",
                width: "100%",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <p style={{ fontWeight: 700, fontSize: 14, lineHeight: "110%", margin: 0 }}>Atla</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {footerNav.map((item) => (
                    <p key={item} style={{ fontSize: 14, lineHeight: "110%", margin: 0 }}>{item}</p>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <p style={{ fontWeight: 700, fontSize: 14, lineHeight: "110%", margin: 0 }}>Socials</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {footerSocials.map((item) => (
                    <p key={item} style={{ fontSize: 14, lineHeight: "110%", margin: 0 }}>{item}</p>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 140 }}>
                <p style={{ fontWeight: 700, fontSize: 14, lineHeight: "110%", margin: 0 }}>Offices</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
                  {OFFICE_TZS.map(({ city }) => (
                    <div key={city} style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <p style={{ fontWeight: 700, fontSize: 14, lineHeight: "110%", margin: 0 }}>{city}</p>
                      <p style={{ fontSize: 14, lineHeight: "110%", margin: 0 }}>{times[city] ?? "--:--"}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ width: 320 }}>
              <p style={{ ...NAV_FONT, lineHeight: "110%", margin: 0 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
                libero et velit interdum, ac aliquet odio mattis. Class aptent taciti
                sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", alignSelf: "stretch" }}>
            <img
              alt="Atla Symbol"
              src="/__mockup/figmaAssets/atla-symbol.png"
              style={{ height: "100%", width: "auto", objectFit: "contain" }}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end", width: "100%" }}>
          <div style={{ width: "100%", position: "relative", height: 0 }}>
            <img
              alt=""
              src="/__mockup/figmaAssets/line-divider.png"
              style={{ position: "absolute", top: -1, left: 0, width: "100%", height: "auto", display: "block" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              ...LABEL_FONT,
            }}
          >
            <p style={{ margin: 0 }}>Back to top ↑</p>
            <p style={{ margin: 0 }}>2026 Atla® All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterColumn({
  title,
  options,
  active,
  onSelect,
}: {
  title: string;
  options: string[];
  active: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
      <p style={{ ...LABEL_FONT, margin: 0 }}>( {title} )</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            style={{
              ...FILTER_ITEM,
              color: opt === active ? "#222" : "#8e8e8e",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: typeof PROJECTS[0] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          width: "100%",
          aspectRatio: "290/290",
          overflow: "hidden",
        }}
      >
        <img
          src={project.cover}
          alt={project.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
      <p
        style={{
          ...FILTER_ITEM,
          color: "#8e8e8e",
          margin: 0,
        }}
      >
        {project.title}
      </p>
    </div>
  );
}

export function AtlaWork() {
  const [region, setRegion] = useState("All");
  const [industry, setIndustry] = useState("All");
  const [service, setService] = useState("All");
  const [view, setView] = useState("Masonry");

  const filtered = PROJECTS.filter((p) => {
    if (region !== "All" && p.region !== region) return false;
    if (industry !== "All" && p.industry !== industry) return false;
    if (service !== "All" && p.service !== service) return false;
    return true;
  });

  return (
    <div
      style={{ fontFamily: LIBRE, backgroundColor: "#fafafa" }}
      className="flex flex-col items-start w-full"
    >
      <div className="flex flex-col items-center" style={{ width: 1200 }}>
        <div className="relative flex flex-col items-center w-full overflow-hidden">
          <Nav />
          <div
            style={{
              paddingTop: 200,
              paddingBottom: 200,
              paddingLeft: 20,
              paddingRight: 20,
              gap: 60,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            {/* Filter Row */}
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start", width: "100%" }}>
              <FilterColumn title="Region" options={REGIONS} active={region} onSelect={setRegion} />
              <FilterColumn title="Industry" options={INDUSTRIES} active={industry} onSelect={setIndustry} />
              <FilterColumn title="Service" options={SERVICES} active={service} onSelect={setService} />
              <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
                <p style={{ ...LABEL_FONT, margin: 0 }}>( View )</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {VIEWS.map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      style={{
                        ...FILTER_ITEM,
                        color: v === view ? "#222" : "#8e8e8e",
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Grid */}
            {filtered.length === 0 ? (
              <p style={{ ...FILTER_ITEM, color: "#8e8e8e", textAlign: "center", width: "100%" }}>
                No projects match these filters.
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  columnGap: 15,
                  rowGap: 80,
                  width: "100%",
                }}
              >
                {filtered.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
