// PENDING JP APPROVAL: every string in this file is a draft until JP signs off.
// Later tasks add keys under home, blocks, brief, services, about, contact.

export const siteCopy = {
  header: {
    navLabel: "Primary",
    links: [
      { label: "Work", href: "/" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
    ],
    cta: { label: "Start a brief", href: "/brief" },
    menuOpen: "Menu",
    menuClose: "Close",
    homeLabel: "Atla, home",
    skipLink: "Skip to content",
  },
  footer: {
    navLabel: "Footer",
    links: [
      { label: "Work", href: "/" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
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
    citiesLabel: "Studio hours",
    rights: "Atla. All rights reserved.",
  },
  // PENDING JP APPROVAL
  home: {
    // The headline reads `${headlineLead} ${phrase}`; one phrase per industry, in portfolio order:
    // hospitality, food & beverage, consumer goods, software.
    //
    // Three alternative structures for JP to pick from (same four industries):
    // A. Noun first, studio last. Lead empty, phrases carry it:
    //    "The hotel guests come back for." / "The restaurant with a waiting list." /
    //    "The product people pick up twice." / "The software that looks as good as it works."
    //    followed by a quiet second line: "Brands by Atla."
    // B. A question the bar answers. Headline: "What are you building?"
    //    The phrases rotate as the bar's placeholder instead: "A hotel in Tulum", "A natural wine bar",
    //    "A skincare line", "A fintech app".
    // C. Verb first, outcome led. Lead "We make" + phrases:
    //    "hotels feel like a destination." / "restaurants worth the reservation." /
    //    "products worth the shelf." / "software people trust on sight."
    headlineLead: "Brand identities for",
    phrases: [
      "hotels guests cross oceans for.",
      "restaurants with a waiting list.",
      "products that earn the shelf.",
      "software people trust on sight.",
    ],
    askLabel: "Search the work or describe your project",
    askPlaceholder: "Search the work, or tell us what you are building",
    askPlaceholderShort: "Search, or describe a project",
    askSubmit: "Search",
    askPending: "Searching",
    results: {
      label: "Results",
      closest: "Closest work",
      count: (n: number) => (n === 1 ? "1 project" : `${n} projects`),
      empty: "Nothing yet. Tell us about it instead.",
      error: "Search is offline. Showing what we have.",
      startBrief: "Start a brief",
      clear: "Clear",
    },
    featuredLabel: "Selected work",
    archiveLabel: "Archive",
    explore: "Explore",
    exploreDialog: "Filter the archive",
    filters: { region: "Region", industry: "Industry", service: "Service", year: "Year", all: "All" },
    project: (n: number) => (n === 1 ? "1 project" : `${n} projects`),
    showMore: "Show more",
    close: "Close",
    logosLabel: "Clients",
    // PENDING JP APPROVAL: Task 11 gathers logos. The row stays hidden while this is empty. Never invent logos.
    logos: [] as ReadonlyArray<{ name: string; src: string }>,
  },
  // PENDING JP APPROVAL
  blocks: [
    {
      label: "How we use AI",
      title: "Machines do the legwork. People make the calls.",
      body: "AI handles research, sorting and first passes. Every decision about taste stays with a designer.",
      href: "/about",
    },
    {
      label: "Brands for agents",
      title: "Your next customer may not be a person.",
      body: "Identities that read clearly to people and to the AI agents that now compare, book and buy for them.",
      href: "/services",
    },
    {
      label: "Services by moment",
      title: "Launching, growing or starting over.",
      body: "Services arranged around where your company is, not a menu of deliverables.",
      href: "/services",
    },
  ],
  // PENDING JP APPROVAL
  project: {
    ctaTitle: "Building something like this?",
    ctaLabel: "Start a brief",
    nextLabel: "Next project",
    // Pre-fills the brief's first answer: /brief?seed=Like <title>
    seed: (title: string) => `Like ${title}`,
  },
  // PENDING JP APPROVAL
  brief: {
    metaTitle: "Start a brief",
    metaDescription: "A few short questions about what you are building. We read every brief and reply by email.",
    label: "Brief",
    progressLabel: "Brief progress",
    stepSeparator: "/",
    back: "Back",
    continue: "Continue",
    multiHint: "Choose all that apply.",
    textPlaceholder: "A sentence or two is enough.",
    enterHint: "Enter to continue",
    contact: {
      prompt: "Where should we reply?",
      fields: {
        name: "Name",
        email: "Email",
        company: "Company",
        website: "Website",
        phone: "Phone",
      },
      optional: "Optional",
      submit: "Send brief",
      sending: "Sending",
      nameError: "Add your name.",
      emailError: "Add an email we can reply to.",
    },
    errors: {
      rateLimited: "Too many tries. Give it a few minutes.",
      network: "That did not go through. Your answers are saved.",
      retry: "Try again",
    },
    doneTitle: "Brief received.",
    done: "Thank you. We read every brief ourselves and will reply by email.",
    callLead: "If you would rather talk, pick a time.",
    bookCall: "Book a call",
    restart: "Start a new brief",
  },
  // PENDING JP APPROVAL. Deliverables are regrouped from the current /services page and the SEO landings
  // (/brand-strategy, /how-we-work, /hospitality-branding, /cpg-branding, /saas-branding). Nothing new.
  services: {
    metaTitle: "Brand Strategy, Identity, and Digital Design Services",
    metaDescription:
      "Explore Atla services in brand strategy, identity design, digital design, motion, packaging, and creative direction for ambitious companies.",
    title: "Services, arranged by where your company is.",
    lead: "Pick the moment you are in. Each one lists what we do there.",
    listLabel: "What we do",
    cta: "Start a brief",
    // `brief` is the /brief?moment= value: it pre-answers "What is the moment?" (briefStorage momentFromParam).
    moments: [
      {
        id: "launch",
        title: "Launch",
        line: "A new company gets one first impression. We make sure it is the right one.",
        brief: "launch",
        items: [
          "Brand strategy and positioning",
          "Naming direction",
          "Identity system: logo, typography, color, iconography",
          "Tone of voice",
          "Website design and dev-ready handoff",
          "Packaging and label systems",
          "Social templates and launch-ready assets",
        ],
      },
      {
        id: "raise-capital",
        title: "Raise capital",
        line: "Investors judge the company before they read the deck. The brand has to carry the story.",
        brief: "raise",
        items: [
          "Positioning statement",
          "Messaging architecture",
          "Pitch decks and one-pagers",
          "Investor and sales collateral",
          "Identity system",
          "Website design and conversion architecture",
        ],
      },
      {
        id: "grow-scale",
        title: "Grow / scale",
        line: "More products, more markets, more people making things. One brand that holds.",
        brief: "grow",
        items: [
          "Brand stewardship as the company grows",
          "Brand guidelines your team can run",
          "Packaging systems across SKUs",
          "Art direction and content standards",
          "Creative direction for campaigns and content",
          "Motion: brand animation, social content, UI motion",
          "Copywriting",
          "Strategy for entering a new market",
        ],
      },
      {
        id: "reposition",
        title: "Reposition",
        line: "The company has moved on and the brand has not. We start from what your customers already say.",
        brief: "reposition",
        items: [
          "Brand Diagnostic: customer reviews, team interviews, every touchpoint",
          "Leadership workshop and roadmap",
          "Competitive landscape and territory map",
          "Audience profiles",
          "Brand strategy reset",
          "Identity redesign",
          "Tone of voice",
        ],
      },
    ],
  },
  // PENDING JP APPROVAL. Team names and roles come from the current /about page (AtlaAbout.tsx TEAM).
  // Per-person cities are not on record anywhere in the repo, so they are left out. Task 11 brings JP the list.
  about: {
    metaTitle: "About Atla",
    metaSuffix: "Senior-Led Branding Studio, US and LatAm",
    metaDescription:
      "Meet Atla, a senior-led branding studio helping founders and teams build strategy, identity, and digital systems across the US and Latin America.",
    title: "A senior branding studio across the US and Latin America.",
    lead: "Small by design. Senior creatives, direct access, no account managers between you and the work.",
    howLabel: "How we work",
    howLead: "Machines do the legwork. People make the calls.",
    how: [
      {
        title: "Read the market",
        body: "AI gathers and sorts what customers and competitors say in public. A strategist reads what it finds.",
      },
      {
        title: "Talk to your people",
        body: "Interviews across leadership, sales, product and service. People run these, not software.",
      },
      {
        title: "Decide the position",
        body: "AI drafts options and tests them against the research. Your leadership and our team choose, in one workshop.",
      },
      {
        title: "Design the system",
        body: "AI handles first passes, variations and production. A creative director decides what ships.",
      },
      {
        title: "Hand it over",
        body: "Guidelines your team can run, and a team that stays on as the company grows.",
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
  // PENDING JP APPROVAL
  contact: {
    metaTitle: "Contact Atla",
    metaSuffix: "Start a Branding or Digital Project",
    metaDescription:
      "Contact Atla to discuss branding, identity, digital design, or creative direction for your next launch, reposition, or growth stage.",
    title: "Tell us what you are building.",
    lead: "A few short questions. We read every brief ourselves and reply by email.",
    cta: "Start a brief",
    emailLabel: "Email",
    socialLabel: "Elsewhere",
    citiesLabel: "Cities",
    formTitle: "Or write to us directly.",
    formLead: "What the business is, what feels misaligned right now, and what has to happen next.",
  },
} as const;

export type SiteCopy = typeof siteCopy;
