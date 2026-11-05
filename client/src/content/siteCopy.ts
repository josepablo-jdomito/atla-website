// Every string the v2 site shows. PENDING JP APPROVAL until he signs off.
// Voice: Jose Pablo's. Short lines, plain words, specific nouns. No prices, no
// durations, no counts. Nothing invented.

export const siteCopy = {
  header: {
    navLabel: "Primary",
    links: [
      { label: "Work", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Why Atla", href: "/about" },
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
      { label: "Why Atla", href: "/about" },
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
    filters: { sector: "Sector", discipline: "Discipline", place: "Place", year: "Year", all: "All" },
    close: "Close",
  },
  project: {
    ctaTitle: "Building something like this?",
    ctaLabel: "Start a project",
    nextLabel: "Next",
    /** The facet line under the facts: each value opens the wall filtered to it. */
    facetsLabel: "Find similar work",
    moreLabel: "More like this",
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
    // How a company works with us. Names are the ones JP uses in proposals; no prices on the site.
    engagementsTitle: "Working with a company your size",
    engagementsLead: "Four ways in. All of them senior from day one, and none of them a layer between you and the work.",
    engagements: [
      { title: "Audit", line: "Two weeks inside your brand. Findings ranked by what to fix first, and a roadmap." },
      { title: "Brand system", line: "Strategy, identity and guidelines, built by one team so nothing is lost between them." },
      { title: "Full build", line: "The system plus the content to launch it: website, decks, social, packaging." },
      { title: "Fractional brand director", line: "A creative director on your team by the month. Decisions, reviews, standards." },
    ],
    // `project` is the slug whose cover sits beside the row. JP can swap any of them.
    disciplines: [
      {
        id: "strategy",
        title: "Strategy",
        line: "One position the whole company can repeat, so every team and agency builds on the same thing.",
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
        line: "A name that clears legal, and a voice that holds from the pitch deck to the shelf.",
        includes: ["Naming", "Tone of voice", "Copy"],
        moments: ["launch", "reposition"],
        project: "sexto-abismo",
      },
      {
        id: "identity",
        title: "Identity",
        line: "A system that still looks like one brand in the hands of your third agency and your newest hire.",
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
        line: "Packaging that is recognized at arm's length, in a thumbnail, and across the whole range.",
        includes: ["Packaging and labels", "Packaging across the whole range"],
        moments: ["launch", "grow"],
        project: "reggie",
      },
      {
        id: "website",
        title: "Website and decks",
        line: "Websites and decks that make the case when nobody from your team is in the room.",
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
        line: "The brand in movement, from the logo to the feed to the product, without a second system.",
        includes: ["Motion: logo animation, social, product UI", "Creative direction for campaigns"],
        moments: ["launch", "grow"],
        project: "bond-and-bloom",
      },
    ],
  },
  // Why Atla (JP, 2026-11-05, "si soy un CMO de Starbucks no veo por qué contratarte"): the argument,
  // on one page, at /about. PENDING JP APPROVAL. Proof lines come from the hospitality page and the
  // ventures; selected clients from JP's 2026-10-04 list.
  about: {
    metaTitle: "Why Atla",
    metaSuffix: "A Senior-Led Branding Studio for the Next Few Years",
    metaDescription:
      "Atla builds brands for the years after the launch: senior people, AI for the slow parts, identities that read to people and to the machines that now shop for them.",
    title: "Most brands are built for the launch. We build them for the years after.",
    lead: "A small studio of senior people, working from Austin, Mexico City, Barcelona, Lima and Caracas. We use AI for the slow parts and keep every decision about taste with a person.",
    thesisLabel: "What we believe",
    thesis: [
      {
        title: "Taste is the job.",
        body: "Research, options and production are getting cheap. Choosing well is not. A creative director decides what ships, every time.",
      },
      {
        title: "Your next customer may not be a person.",
        body: "Assistants and agents now compare, book and buy. We build identities that read clearly to people and to the machines in between.",
      },
      {
        title: "A brand has to survive its third agency.",
        body: "We write the rules so your team, your next agency and your newest hire keep making the same brand.",
      },
      {
        title: "We run brands too.",
        body: "Sexto Abismo, TigreTigre, Persona. We know what a system has to take once the launch is over.",
      },
    ],
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
    proofLabel: "Proof",
    proof: [
      "MICHELIN Key, Casa Las Tortugas, a brand we built.",
      "MICHELIN Green Star, Acre, a brand we rebuilt.",
      "Three companies we design for are companies we own.",
    ],
    clientsLabel: "Selected clients",
    clients: ["Aimee Kestenberg", "PrettyBoy", "Temakase", "Acre", "Pax & Beneficia", "Persona", "Brick", "Anything"],
    engagementsLabel: "Ways to work with us",
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
    cta: "Start a project",
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
