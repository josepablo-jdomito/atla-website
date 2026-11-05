// Every string the v2 site shows. PENDING JP APPROVAL until he signs off.
// Voice: Jose Pablo's. Short lines, plain words, specific nouns. No prices, no
// durations, no counts. Nothing invented.

export const siteCopy = {
  header: {
    navLabel: "Primary",
    links: [
      { label: "Work", href: "/" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
    ],
    // JP, 2026-10-04: the header reads "Start a project". It opens the brief.
    cta: { label: "Start a project", href: "/brief" },
    menuOpen: "Menu",
    menuClose: "Close",
    homeLabel: "Atla, home",
    skipLink: "Skip to the work",
  },
  footer: {
    navLabel: "Footer",
    links: [
      { label: "Work", href: "/" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Ventures", href: "/ventures" },
      { label: "Contact", href: "/contact" },
      { label: "Journal", href: "/journal" },
      { label: "Programs", href: "/programs" },
      { label: "Hospitality", href: "/hospitality" },
    ],
    legal: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
    cookiesLabel: "Analytics cookies",
    citiesLabel: "Studio cities",
    // JP, 2026-10-04: the footer line, verbatim.
    line: "When your brand has to change, start here.",
    rights: "Atla. All rights reserved.",
  },
  home: {
    // The bar lives off the home now; these strings serve it wherever it is placed.
    askLabel: "Search the work or say what you are building",
    askPlaceholder: "Search the work, or tell us what you are building",
    askPlaceholderShort: "Search, or tell us what you are building",
    askSubmit: "Search",
    askPending: "Looking",
    results: {
      label: "Results",
      closest: "The closest things we have made",
      count: (n: number) => (n === 1 ? "One project" : "Projects"),
      empty: "Nothing in the archive matches that. Tell us what you are building instead.",
      error: "Search is down. Here is what we have.",
      startBrief: "Start a project",
      clear: "Clear",
    },
    explore: "Explore",
    exploreDialog: "Filter the work",
    filters: { region: "Region", industry: "Industry", service: "Service", year: "Year", all: "All" },
    close: "Close",
  },
  project: {
    ctaTitle: "Building something like this?",
    ctaLabel: "Start a project",
    nextLabel: "Next",
    lightboxClose: "Close",
    lightboxPrev: "Previous image",
    lightboxNext: "Next image",
    // Pre-fills the brief's first answer: /brief?seed=Like <title>
    seed: (title: string) => `Like ${title}`,
  },
  brief: {
    metaTitle: "Start a project",
    metaDescription: "A few questions about what you are building, one at a time. Jose Pablo reads every brief and replies by email.",
    label: "Brief",
    progressLabel: "Brief progress",
    stepSeparator: "/",
    back: "Back",
    continue: "Continue",
    multiHint: "Pick as many as apply.",
    textPlaceholder: "A sentence or two is plenty.",
    enterHint: "Enter to continue",
    contact: {
      prompt: "Where do we write back?",
      fields: {
        name: "Name",
        email: "Email",
        company: "Company",
        website: "Website",
        phone: "Phone",
      },
      optional: "Optional",
      submit: "Send",
      sending: "Sending",
      nameError: "We need a name.",
      emailError: "We need an email we can reply to.",
    },
    errors: {
      rateLimited: "Too many tries. Give it a few minutes.",
      network: "That did not go through. Your answers are still here.",
      retry: "Try again",
    },
    doneTitle: "Got it.",
    done: "Jose Pablo reads every brief himself and replies by email.",
    callLead: "If you would rather talk it through, pick a time.",
    bookCall: "Book a call",
    restart: "Start another",
  },
  // Services after tbp.studio/services (JP, 2026-11-05): rows by discipline, an Includes list that
  // opens, a real project photo beside each row. The four moments sit on top and narrow the rows.
  // Every line below comes from the current /services page and the SEO landings. Nothing new.
  services: {
    metaTitle: "Brand Strategy, Identity, and Digital Design Services",
    metaDescription:
      "Brand strategy, naming, identity, packaging, websites and motion from Atla, for companies launching, raising, growing or starting over.",
    title: "What we do.",
    lead: "Six disciplines, one team. Pick the moment you are in and the list narrows to what matters now.",
    momentsLabel: "The moment",
    allMoments: "Any moment",
    includesLabel: "What is included",
    includesOpen: "See what is included",
    includesClose: "Close",
    cta: "Start a project",
    exampleLabel: "From the work",
    // `brief` is the /brief?moment= value: it pre-answers the moment question (briefStorage momentFromParam).
    moments: [
      { id: "launch", title: "Launch", line: "You get one first impression. We build the brand before anyone sees it.", brief: "launch" },
      {
        id: "raise",
        title: "Raise capital",
        line: "Investors judge the company before they open the deck. We make sure the brand holds up to that look.",
        brief: "raise",
      },
      {
        id: "grow",
        title: "Grow / scale",
        line: "More products, more markets, more people touching the brand. We keep it one brand.",
        brief: "grow",
      },
      {
        id: "reposition",
        title: "Reposition",
        line: "The company changed and the brand did not. We start with what your customers already say about you.",
        brief: "reposition",
      },
    ],
    // `project` is the slug whose cover sits beside the row. JP can swap any of them.
    disciplines: [
      {
        id: "strategy",
        title: "Strategy",
        line: "What the brand stands for, said in a way the whole company can repeat.",
        includes: [
          "Brand strategy and positioning",
          "Messaging",
          "Competitive map",
          "Audience profiles",
          "Diagnostic: reviews, team interviews, every touchpoint",
          "Leadership workshop and roadmap",
          "Strategy for a new market",
        ],
        moments: ["launch", "raise", "reposition"],
        project: "casa-colora",
      },
      {
        id: "naming",
        title: "Naming and voice",
        line: "The name, and the way the brand talks once it has one.",
        includes: ["Naming", "Tone of voice", "Copy"],
        moments: ["launch", "reposition"],
        project: "sexto-abismo",
      },
      {
        id: "identity",
        title: "Identity",
        line: "A system your team can run without us: logo, type, color, the rules.",
        includes: [
          "Identity: logo, type, color, iconography",
          "Identity redesign",
          "Guidelines your team can use without us",
          "Art direction and content standards",
          "Brand direction as the company grows",
        ],
        moments: ["launch", "raise", "grow", "reposition"],
        project: "rustico",
      },
      {
        id: "packaging",
        title: "Packaging",
        line: "The brand where it is held, opened and kept.",
        includes: ["Packaging and labels", "Packaging across the whole range"],
        moments: ["launch", "grow"],
        project: "reggie",
      },
      {
        id: "website",
        title: "Website and decks",
        line: "The places the brand has to convince someone on its own.",
        includes: [
          "Website, designed and ready for development",
          "Website built to convert",
          "Pitch deck and one-pager",
          "Investor and sales material",
          "Social templates and launch assets",
        ],
        moments: ["launch", "raise", "grow"],
        project: "anything-ai",
      },
      {
        id: "motion",
        title: "Motion and campaigns",
        line: "The brand in movement: the logo, the feed, the product.",
        includes: ["Motion: logo animation, social, product UI", "Creative direction for campaigns"],
        moments: ["launch", "grow"],
        project: "bond-and-bloom",
      },
    ],
  },
  // Team names and roles come from the current /about page; JP confirmed the list of seven on 2026-11-05.
  about: {
    metaTitle: "About Atla",
    metaSuffix: "Senior-Led Branding Studio, US and LatAm",
    metaDescription:
      "Atla is a small branding studio with senior people, working from Austin, Mexico City, Barcelona, Lima and Caracas.",
    title: "A small studio. Senior people. US and Latin America.",
    lead: "You talk to the people who make the work. There is no account manager in between.",
    howLabel: "How we work",
    howLead: "Machines do the legwork. People make the calls.",
    how: [
      {
        title: "Read the market",
        body: "AI gathers what customers and competitors say in public. A strategist reads it and decides what matters.",
      },
      {
        title: "Talk to your people",
        body: "We interview leadership, sales, product and whoever answers the phone. People do this part, not software.",
      },
      {
        title: "Pick the position",
        body: "AI drafts the options and checks them against the research. You and we choose one, in a room, in one session.",
      },
      {
        title: "Design the system",
        body: "AI does first passes, variations and production work. A creative director decides what ships.",
      },
      {
        title: "Hand it over",
        body: "Guidelines your team can use without us. And we stay on if you want us to.",
      },
    ],
    teamLabel: "Team",
    team: [
      { name: "José Pablo Domínguez", role: "Founder & Creative Director" },
      { name: "Paola Díaz", role: "COO" },
      { name: "Levi Ramírez", role: "Head of Growth" },
      { name: "Mariela Alata", role: "Project Manager" },
      { name: "Tais Kahatt", role: "Art Director" },
      { name: "Adriana Méndez", role: "Brand Designer" },
      { name: "José Aceves Covarrubias", role: "Brand Designer" },
    ] as ReadonlyArray<{ name: string; role: string; city?: string }>,
    citiesLabel: "Where we are",
  },
  contact: {
    metaTitle: "Contact Atla",
    metaSuffix: "Start a Branding or Digital Project",
    metaDescription: "Write to Atla about a launch, a raise, a growth stage or a reposition. Jose Pablo replies by email.",
    title: "Tell us what you are building.",
    lead: "A few questions, one at a time. Jose Pablo reads every one and replies by email.",
    cta: "Start a project",
    emailLabel: "Email",
    socialLabel: "Elsewhere",
    citiesLabel: "Cities",
    formTitle: "Or just write.",
    formLead: "What the business is, what feels off, and what has to happen next.",
  },
  // JP, 2026-11-05: client marks above the footer, like Cosmos. The files are the ones JP sends
  // (monochrome SVG in client/public/logos-v2/). Empty list = no band. Never invent a logo.
  logos: {
    label: "Clients",
    line: "Brands we have built with.",
    items: [] as ReadonlyArray<{ name: string; src: string }>,
  },
  // JP, 2026-11-05: a quiet page. Names and one line each, no detail, no logos.
  ventures: {
    metaTitle: "Ventures",
    metaDescription: "Companies Atla is involved in beyond client work.",
    title: "Ventures",
    lead: "Some brands we did not stop at designing.",
    items: [
      { name: "Sexto Abismo", line: "Surrealist gin from Mexico.", href: "/projects/sexto-abismo" },
      { name: "TigreTigre", line: "A restaurant.", href: "/projects/tigretigre" },
      { name: "Persona", line: "Nutrition, made personal.", href: "/projects/persona" },
      { name: "WeLoveDaily", line: "A daily curation of the brands we love.", href: "https://welovedaily.net" },
    ],
  },
} as const;

export type SiteCopy = typeof siteCopy;
