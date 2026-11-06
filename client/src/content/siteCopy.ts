// Every string the v2 site shows.
// Voice: José Pablo's. Short lines, plain words, specific nouns. No prices, no
// durations, no counts. Nothing invented.

// The two proof lines are said once and shown twice: on Why Atla, and under the facets of the project they
// are about (fix wave 3, red team 5). The wording is JP's; nothing here adds a claim.
const PROOF_KEY = "MICHELIN Key, Casa Las Tortugas. We audited it and set its brand architecture.";
const PROOF_STAR = "MICHELIN Green Star, Acre's restaurant. We wrote Acre's brand architecture and brand book.";

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
    // The phone menu (below 768 px), JP's reference of 2026-11-06: one row per page with a picture,
    // the brief last as its own row.
    sheetLinks: [
      { label: "Work", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Why Atla", href: "/about" },
      { label: "Ventures", href: "/ventures" },
      { label: "Contact", href: "/contact" },
      { label: "Start a project", href: "/brief" },
    ],
    menuOpen: "Menu",
    menuClose: "Close",
    homeLabel: "Atla, home",
    skipLink: "Skip to the work",
    // The second skip link, home only: straight to the Explore field (keyboard walk F6).
    skipSearch: "Skip to search",
  },
  // The phone menu card's own words.
  menu: {
    navLabel: "Menu",
    closeLabel: "Close menu",
  },
  // A page whose content did not arrive (journal, article): said plainly, never as an empty state.
  states: {
    loading: "Loading",
    error: "This did not load.",
    errorBody: "The page is still here. Try again, or go back to the work.",
    retry: "Try again",
    home: "See the work",
  },
  // The analytics cookie notice (AnalyticsConsent). Escape closes it without choosing: nothing changes,
  // which is what the privacy page promises (cookies stay off in Europe until Accept).
  consent: {
    label: "Analytics cookies",
    bodyAll:
      "We use Google Analytics, Microsoft Clarity and the Meta Pixel to see which pages lead to projects and to measure our own campaigns. They load only if you accept.",
    bodyGa: "We use Google Analytics cookies to see which pages lead to projects.",
    privacy: "Privacy policy",
    accept: "Accept",
    decline: "Decline",
  },
  footer: {
    navLabel: "Footer",
    // One line (UX interview 15): the pages a buyer goes to, plus Journal (it is indexed and linked from
    // the site; dropping it would orphan the articles). Programs and Hospitality stay reachable by their
    // addresses and in the sitemap; they are not footer links (red team 17, 24).
    links: [
      { label: "Work", href: "/" },
      { label: "Services", href: "/services" },
      // The free brand check (JP, 2026-11-06). Footer only; the phone menu rows do not change.
      { label: "Brand check", href: "/brand-check" },
      { label: "Why Atla", href: "/about" },
      { label: "Ventures", href: "/ventures" },
      { label: "Journal", href: "/journal" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
    cookiesLabel: "Analytics cookies",
    // JP's Figma footer on paper (2026-11-06): three columns, one line, the Atlas symbol, the base line.
    pagesLabel: "Atla",
    socialsLabel: "Socials",
    citiesLabel: "Where we are",
    emailLabel: "Email",
    // The same sentence the site already uses to describe itself (index.html og:description).
    line: "Strategy, identity and creative direction for companies that take their brand seriously.",
    symbolLabel: "Atla symbol",
    backToTop: "Back to top",
    rights: "Atla. All rights reserved.",
  },
  // One control per page for every looping video (WCAG 2.2.2).
  motion: {
    pause: "Pause motion",
    play: "Play motion",
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
      // The quiet text link under the wall once auto-loading stops. Placeholder text: the content pass owns the wording.
      more: "More work",
      retry: "Try again",
    },
    // While /api/projects loads, the wall is colour blocks with no images; this names them for screen readers.
    loading: "Loading the work",
    // Ask's fixed notes (an error, a limit, Ask resting): their own label, never read as "Atla:".
    askNote: "Note",
    askRetry: "Try again",
    askLinks: [
      { label: "Services", href: "/services" },
      { label: "Start a project", href: "/brief" },
    ],
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
    /**
     * Proof for the project pages that carry it, keyed by slug: one quiet line under the facets, and the
     * same line on Why Atla links back here. A slug with no project in Sanity simply never renders.
     */
    proof: {
      rustico: PROOF_STAR,
      acre: PROOF_STAR,
      "casa-las-tortugas": PROOF_KEY,
    } as Readonly<Record<string, string>>,
    // Travels with the brief as context: /brief?seed=Like <title> (taken out of the URL on arrival; it answers nothing)
    seed: (title: string) => `Like ${title}`,
  },
  brief: {
    metaTitle: "Start a project",
    metaDescription: "A few questions, one at a time. José Pablo reads every brief and replies by email.",
    label: "Brief",
    progressLabel: "Brief progress",
    stepSeparator: "/",
    back: "Back",
    continue: "Continue",
    multiHint: "Pick as many as apply.",
    textPlaceholder: "A sentence or two is plenty.",
    enterHint: "Enter to continue",
    // Shown when Continue is pressed with nothing answered. Placeholder text: the content pass owns the wording.
    emptyText: "A sentence is enough to start.",
    emptyChoice: "Pick one to go on.",
    contact: {
      prompt: "Where should we send our reply?",
      // No durations on this site (JP's rule), so the waitlist's promise keeps its words minus the hours.
      body: "Every brief gets a careful read. Name and email are required so we can reach back, including when there's a faster path than working with us directly.",
      fields: {
        name: "Name",
        email: "Email",
        company: "Company",
        website: "Website",
        phone: "Phone",
      },
      optional: "Optional",
      // The one promise, said the same way on /contact and in the policy: we reply by email and manage the inquiry.
      privacyNotice: "We use this to reply and to manage your inquiry.",
      privacyLink: "Privacy",
      submit: "Send the brief",
      sending: "Sending",
      nameError: "We need a name.",
      emailError: "We need an email we can reply to.",
    },
    errors: {
      rateLimited: "Too many tries. Try again soon.",
      network: "That did not go through. Your answers are still here.",
      retry: "Try again",
    },
    doneTitle: "Got it.",
    done: "José Pablo reads every brief himself and replies by email.",
    callLead: "If you would rather talk it through, pick a time.",
    bookCall: "Book a call",
    restart: "Start another",
  },
  // Services after tbp.studio/services (JP, 2026-11-05): rows by discipline, an Includes list that
  // opens, a real project photo beside each row. Every line below comes from the current /services
  // page and the SEO landings. Nothing new.
  // JP, 2026-11-06 (second pass): the page is one route per moment. Once a moment is chosen it reads
  // top to bottom as that moment's route: what usually happens, the disciplines that matter, the
  // engagements that fit, one project, two doors, then the full index. `happens`, `byMoment` and
  // `engagementsByMoment` are written only from the moment's own line and the discipline lines: no
  // new claims, no numbers.
  services: {
    metaTitle: "Brand Strategy, Identity, and Digital Design Services",
    metaDescription:
      "Brand strategy, naming, identity, packaging, websites and motion from Atla, for companies launching, raising, growing or starting over.",
    title: "Services",
    // The same sentence the footer and index.html use to say what Atla does.
    lead: "Strategy, identity and creative direction for companies that take their brand seriously.",
    pickerTitle: "Where are you?",
    momentsLabel: "The moment",
    allMoments: "Any moment",
    happensTitle: "What usually happens",
    // With no moment chosen: the general version, from the strategy, identity and engagement lines.
    happensAny: [
      "The brand gets built in pieces, by different teams and agencies.",
      "Each piece is fine on its own, and together they stop looking like one company.",
    ],
    disciplinesTitle: "What we do",
    // Act two echoes the chosen moment (coordinator, 2026-11-06).
    disciplinesTitleByMoment: {
      launch: "What we do when you launch",
      raise: "What we do when you raise capital",
      grow: "What we do when you grow",
      reposition: "What we do when you reposition",
    },
    // With no moment chosen, the disciplines every moment leans on. The rest live in the index.
    anyDisciplines: ["strategy", "identity", "website"],
    // Read once by screen readers when the moment changes; never shown.
    liveAny: "Services for any moment.",
    liveFor: "Services for",
    includesLabel: "What is included",
    includesOpen: "See what is included",
    includesClose: "Close",
    cta: "Start a project",
    exampleLabel: "From the work",
    workTitle: "From the work",
    // With no moment chosen, the project in "From the work".
    anyProject: { slug: "rustico", line: "An identity for dinners under the stars." },
    // The two ways forward, side by side. No durations.
    doors: [
      { label: "Start a project", href: "/brief", line: "A few questions. José Pablo reads every one and replies by email." },
      { label: "Ask for a brand check", href: "/brand-check", line: "Free. A short video and a written check of what is in your way." },
    ],
    doorsLabel: "Ways to start",
    indexTitle: "Everything we do",
    // `project` is the one piece of work shown in "From the work" for that moment, with its line
    // taken from the project's own description.
    moments: [
      {
        id: "launch",
        title: "Launch",
        line: "You get one first impression. We build the brand before anyone sees it.",
        happens: [
          "The name has to clear legal, and the website has to explain a company nobody has heard of.",
        ],
        project: "rustico",
        projectLine: "A new brand in Mexico, designed for its first impression.",
      },
      {
        id: "raise",
        title: "Raise capital",
        line: "Investors judge the company before they open the deck. We make sure the brand survives that first look.",
        happens: [
          "The deck has to make the case when nobody from your team is in the room.",
        ],
        project: "anything-ai",
        projectLine: "An AI app builder from San Francisco, underestimated, with a launch date already on the calendar.",
      },
      {
        id: "grow",
        title: "Grow",
        line: "More products, more markets. Every new person touches the brand. We write the rules they follow.",
        happens: [
          "Different teams and agencies each take the brand their own way.",
        ],
        project: "casa-colora",
        projectLine: "A heritage leather house from Upstate New York, rebuilt for the way it sells today.",
      },
      {
        id: "reposition",
        title: "Reposition",
        line: "The company changed and the brand did not. We start with what your customers already say about you.",
        happens: [
          "Your customers already say something about you that the brand does not.",
        ],
        project: "hanks-leather",
        projectLine: "An identity for dinners under the stars.",
      },
    ],
    // How a company works with us. Names are the ones JP uses in proposals; no prices on the site.
    engagementsTitle: "How we work together",
    engagementsLead: "Every way in is senior-led. Nobody sits between you and the work.",
    engagements: [
      { title: "Audit", line: "A look inside your brand. Findings ranked by what to fix first, and a roadmap." },
      { title: "Brand system", line: "Strategy, identity and guidelines, built by one team so nothing is lost between them." },
      { title: "Full build", line: "The system plus the content to launch it: website, decks, social, packaging." },
      { title: "Fractional brand director", line: "A creative director on your team. Decisions, reviews, standards." },
    ],
    engagementsByMoment: {
      launch: "A launch starts with a Brand system, or a Full build when the website and packaging ship with it.",
      raise: "Before a raise, a Brand system with the pitch deck, or an Audit when the brand exists and needs fixing first.",
      grow: "As the company grows, a Fractional brand director reviews every new product and market before it ships.",
      reposition: "A reposition usually starts with an Audit: findings ranked by what to fix first, then the system.",
    },
    // The engagements each moment shows, by title; the others are not shown for that moment.
    engagementsFit: {
      launch: ["Brand system", "Full build"],
      raise: ["Brand system", "Audit"],
      grow: ["Fractional brand director"],
      reposition: ["Audit", "Brand system"],
    },
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
        byMoment: {
          launch: "One position the whole company can repeat, set before the first customer meets the brand.",
          raise: "One position the whole company can repeat, so the story investors hear holds from the first look.",
          grow: "A strategy for each new market, built on the one position every team already repeats.",
          reposition: "We start with what your customers already say, then pick the one position the company can repeat.",
        },
        moments: ["launch", "raise", "reposition"],
        project: "casa-colora",
      },
      {
        id: "naming",
        title: "Naming and voice",
        line: "A name that clears legal, and a voice that holds from the pitch deck to the shelf.",
        includes: ["Naming", "Tone of voice", "Copy"],
        byMoment: {
          launch: "A name that clears legal, and a voice ready for the first impression.",
          raise: "A voice that holds in the pitch deck, so investors meet the same company on every page.",
          grow: "One voice from the pitch deck to the shelf, across every new product and market.",
          reposition: "A new name if the company outgrew the old one, and a voice that says what changed.",
        },
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
        byMoment: {
          launch: "A system ready for your first hire and your first agency.",
          raise: "A system that makes the company look whole at first look, before the deck is open.",
          grow: "Guidelines your team can use without us, so a new hire gets it right without asking.",
          reposition: "An identity redesign that shows what changed, and guidelines so it holds.",
        },
        moments: ["launch", "raise", "grow", "reposition"],
        project: "rustico",
      },
      {
        id: "packaging",
        title: "Packaging",
        line: "Packaging you recognize at arm's length and in a thumbnail, across the whole range.",
        includes: ["Packaging and labels", "Packaging across the whole range"],
        byMoment: {
          launch: "Packaging you recognize at arm's length and in a thumbnail from the day it reaches a shelf.",
          raise: "Packaging that reads clearly in a thumbnail, wherever investors first see the product.",
          grow: "Packaging across the whole range, so every new product still looks like the last.",
          reposition: "Packaging that carries the change to the shelf, recognizable at arm's length.",
        },
        moments: ["grow"],
        project: "reggie",
      },
      {
        id: "website",
        title: "Website and decks",
        line: "Websites and decks that explain the company when you are not there.",
        includes: [
          "Website, designed and ready for development",
          "Website built to convert",
          "Pitch deck and one-pager",
          "Investor and sales material",
          "Social templates and launch assets",
        ],
        byMoment: {
          launch: "A website and launch assets that make the case to people who have never heard of you.",
          raise: "A pitch deck, one-pager and investor material that carry the story without you.",
          grow: "A website built to convert, and sales material every new market can use.",
          reposition: "A website that tells the new story on its own.",
        },
        moments: ["launch", "raise", "grow"],
        project: "anything-ai",
      },
      {
        id: "motion",
        title: "Motion and campaigns",
        line: "The brand in movement, without a second system.",
        includes: ["Motion: logo animation, social, product UI", "Creative direction for campaigns"],
        byMoment: {
          launch: "Logo animation and the launch campaign: the brand in movement from the start.",
          raise: "Motion for the deck and the product UI: the same brand, in movement.",
          grow: "Creative direction for every campaign as you grow, without a second system.",
          reposition: "The new brand in movement across social and product, without a second system.",
        },
        moments: ["grow"],
        project: "bond-and-bloom",
      },
    ],
  },
  // The free brand check (JP, 2026-11-06, "necesitamos algo así: baked.design/design-check"), in
  // atla's words: no counts, no durations. The option labels live in shared/brandCheck.ts.
  brandCheck: {
    metaTitle: "Free brand check",
    metaDescription:
      "A free brand check from Atla. We look at your brand as it lives today, find the biggest opportunities and show you what we would change first.",
    title: "What is holding your brand back?",
    lead: "A free brand check from the team behind the work on this site. We look at your brand as it lives today and show you what we would change first. For founders and teams who take their brand seriously.",
    factsLabel: "What you get",
    facts: ["A short video", "What is in your way, ranked by what to fix first", "A written brand check at atla.design/audit/your-brand"],
    capacity: "We take them in the order they arrive.",
    formTitle: "Ask for yours",
    fields: {
      name: "Name",
      email: "Email",
      site: "Website or Instagram",
      moment: "Your moment",
      size: "Company size",
      investing: "Investing in brand this year?",
      message: "Message",
    },
    sitePlaceholder: "brand.com or @brand",
    messagePlaceholder: "Anything we should look at first.",
    optional: "Optional",
    privacyNotice: "We use this to reply and to manage your inquiry.",
    privacyLink: "Privacy",
    submit: "Ask for a brand check",
    sending: "Sending",
    retry: "Try again",
    nameError: "We need a name.",
    emailError: "We need an email we can reply to.",
    siteError: "We need a website or an Instagram to look at.",
    choiceError: "Pick one.",
    rateLimited: "Too many tries. Try again soon.",
    network: "That did not go through. What you wrote is still here.",
    doneTitle: "Sent.",
    done: "Check your inbox for a note from José Pablo.",
    callLead: "If you would rather talk it through, pick a time.",
    bookCall: "Book a call",
  },
  // Why Atla (JP, 2026-11-05, "si soy un CMO de Starbucks no veo por qué contratarte"): the argument,
  // on one page, at /about. PENDING JP APPROVAL. Proof lines come from the hospitality page and the
  // ventures; selected clients from JP's 2026-10-04 list.
  about: {
    metaTitle: "Why Atla",
    metaSuffix: "Senior-led branding for the years after launch",
    metaDescription:
      "Atla builds brands for the years after launch. Senior people make the calls, AI does the slow parts, and the identity reads to people and to assistants.",
    title: "Many brands are built for the launch. We build them for the years after.",
    lead: "A small studio of senior people, working from Austin, Mexico City, Barcelona, Lima and Caracas. We use AI for the slow parts and keep every decision about taste with a person.",
    thesisLabel: "What we believe",
    thesis: [
      {
        title: "Taste is the job.",
        body: "Options are cheap now. Choosing well is not. A creative director decides what ships, every time.",
      },
      {
        title: "Your next customer may not be a person.",
        body: "Some assistants now compare and book for people. We build identities they can read too.",
      },
      {
        title: "A brand has to survive its third agency.",
        body: "We write the rules so your team, your next agency and your newest hire keep making the same brand.",
      },
      {
        title: "We are in business too.",
        body: "Sexto Abismo, TigreTigre, Persona. We know what a system has to survive after launch.",
      },
    ],
    howLabel: "How we work",
    howLead: "AI does the legwork, and people make the calls.",
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
        body: "AI drafts the options and checks them against the research. You and we choose one, in a room.",
      },
      {
        title: "Design the system",
        body: "AI does first passes and production work. A creative director decides what ships.",
      },
      {
        title: "Hand it over",
        body: "Guidelines your team can use without us. And we stay on if you want us to.",
      },
    ],
    proofLabel: "Proof",
    proof: [
      PROOF_KEY,
      PROOF_STAR,
      "Some of the brands we design are ventures we are involved in.",
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
      { name: "Aldo Jaramillo", role: "Motion Designer" },
    ] as ReadonlyArray<{ name: string; role: string; city?: string }>,
    citiesLabel: "Where we are",
    cta: "Start a project",
  },
  contact: {
    metaTitle: "Contact Atla",
    metaSuffix: "Start a Branding or Digital Project",
    metaDescription: "Write to Atla when you launch, raise capital, grow or reposition. José Pablo replies by email.",
    title: "Tell us what you are building.",
    lead: "Write to us in a few lines. José Pablo reads every note and replies by email.",
    cta: "Start a project",
    emailLabel: "Email",
    socialLabel: "Elsewhere",
    citiesLabel: "Where we are",
    // The same sentence the brief's contact step carries; the policy says it too.
    formNotice: "We use this to reply and to manage your inquiry.",
    formNoticeLink: "See the privacy policy.",
    sent: "Received. José Pablo reads every note himself and replies by email.",
    sentUrgent: "If it is urgent, write to",
    formTitle: "Or just write.",
  },
  // JP, 2026-11-05: client marks above the footer, like Cosmos. The files are the ones JP sends
  // (monochrome SVG in client/public/logos-v2/). Empty list = no band. Never invent a logo.
  logos: {
    label: "Clients",
    line: "Brands we have worked on.",
    // Order = JP's selected-client list (2026-10-04), then the featured projects. Sources per mark in
    // docs/superpowers/specs/2026-11-05-client-logos.md. Missing on purpose until JP sends files:
    // Aimee Kestenberg, PrettyBoy, Casa Colora, Reggie.
    items: [
      { name: "Temakase", src: "/logos-v2/temakase.svg" },
      { name: "Rústico", src: "/logos-v2/rustico.svg" },
      { name: "Pax & Beneficia", src: "/logos-v2/pax-beneficia.svg" },
      { name: "Persona", src: "/logos-v2/persona.svg" },
      { name: "Brick", src: "/logos-v2/brick.svg" },
      { name: "Anything", src: "/logos-v2/anything.svg" },
      { name: "Sexto Abismo", src: "/logos-v2/sexto-abismo.svg" },
      { name: "Bond&Bloom", src: "/logos-v2/bond-bloom.svg" },
      { name: "Hanks Leather Goods", src: "/logos-v2/hanks.svg" },
      { name: "The Curated Outfit", src: "/logos-v2/the-curated-outfit.svg" },
      { name: "Vyv", src: "/logos-v2/vyv.svg" },
      { name: "Arc Studio", src: "/logos-v2/arc-studio.svg" },
      { name: "Tequila Unido", src: "/logos-v2/tequila-unido.svg" },
      { name: "Angeles Wellness", src: "/logos-v2/angeles-wellness.svg" },
      { name: "TigreTigre", src: "/logos-v2/tigretigre.svg" },
      { name: "Alma Brava", src: "/logos-v2/alma-brava.svg" },
      { name: "Pathize Health", src: "/logos-v2/pathize-health.svg" },
      { name: "Huémac", src: "/logos-v2/huemac.svg" },
      { name: "Castro Capital", src: "/logos-v2/castro-capital.svg" },
      { name: "Oxylife", src: "/logos-v2/oxylife.svg" },
      { name: "Peachy Patients", src: "/logos-v2/peachy-patients.svg" },
      { name: "PuppyPy", src: "/logos-v2/puppypy.svg" },
      { name: "Mundã", src: "/logos-v2/munda.svg" },
      { name: "Baristio", src: "/logos-v2/baristio.svg" },
    ] as ReadonlyArray<{ name: string; src: string }>,
  },
  // JP, 2026-11-05: a quiet page. Names and one line each, no detail, no logos.
  ventures: {
    metaTitle: "Ventures",
    metaDescription: "Companies Atla is involved in beyond client work.",
    title: "Ventures",
    lead: "Some brands we did not stop at designing.",
    items: [
      { name: "Sexto Abismo", line: "Surrealist gin from Mexico.", href: "/projects/sexto-abismo" },
      { name: "TigreTigre", line: "A restaurant in San Luis Potosí.", href: "/projects/tigretigre" },
      { name: "Persona", line: "Nutrition, made personal.", href: "/projects/persona" },
      { name: "WeLoveDaily", line: "A daily curation of the brands we love.", href: "https://welovedaily.net" },
    ],
  },
  // Ask: the concierge mode of the Explore pill (JP, 2026-11-06, after Little Plains). The answers are
  // written by the model inside the site's rules (server/ask); these are the fixed lines around them.
  ask: {
    modeLabel: "Mode",
    search: "Search",
    ask: "Ask",
    dialog: "Ask Atla",
    inputLabel: "Ask Atla a question",
    placeholder: "Ask us about the work",
    greeting: "How can we help?",
    chipsLabel: "Suggestions",
    chips: ["Show me hospitality work", "What happens after I send a brief?", "Who have you worked with?"],
    visitor: "You",
    atla: "Atla",
    thinking: "Atla is answering",
    piecesLabel: "Work",
    restart: "Start over",
    // Said in place of an answer. No durations, no numbers, like everything else here.
    fallback: "We would rather answer that properly. Start a project and José Pablo replies himself.",
    error: "That did not go through. Ask again, or start a project.",
    limited: "That is enough questions for now. The brief is the quickest way to reach us.",
    unavailable: "Ask is resting for now. Search still works, and the brief reaches us directly.",
  },
} as const;

export type SiteCopy = typeof siteCopy;
