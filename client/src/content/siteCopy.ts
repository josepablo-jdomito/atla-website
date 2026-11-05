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
} as const;

export type SiteCopy = typeof siteCopy;
