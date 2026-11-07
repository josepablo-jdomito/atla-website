// Every string the v2 site shows.
// Voice: José Pablo's. Short lines, plain words, specific nouns. No prices, no
// durations, no counts. Nothing invented.

// The two proof lines are said once and shown twice: on Why Atla, and under the facets of the project they
// are about. Nothing here adds a claim.
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
    cta: { label: "Start a project", href: "/brief" },
    // The phone menu (below 768 px): one row per page with a picture, the brief last as its own row.
    sheetLinks: [
      { label: "Work", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Why Atla", href: "/about" },
      { label: "Ventures", href: "/ventures" },
      { label: "Start a project", href: "/brief" },
    ],
    menuOpen: "Menu",
    homeLabel: "Atla, home",
    skipLink: "Skip to the work",
    // The second skip link, home only: straight to the Explore field.
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
    retry: "Try again",
    home: "See the work",
  },
  // The analytics cookie notice (AnalyticsConsent). Escape closes it without choosing: nothing changes,
  // which is what the privacy page promises (cookies stay off in Europe until Accept).
  consent: {
    label: "Analytics cookies",
    body: "We use analytics cookies to see which pages lead to projects and to measure our campaigns.",
    privacy: "Privacy",
    accept: "Accept",
    decline: "Decline",
  },
  footer: {
    navLabel: "Footer",
    // The pages a buyer goes to, plus Journal (dropping it would orphan the articles). Programs and the
    // SEO landings stay reachable by their addresses and in the sitemap.
    links: [
      { label: "Work", href: "/" },
      { label: "Services", href: "/services" },
      // Footer only; the phone menu rows do not change.
      { label: "Brand check", href: "/brand-check" },
      { label: "Free audit", href: "/audit" },
      { label: "Why Atla", href: "/about" },
      { label: "Ventures", href: "/ventures" },
      { label: "Journal", href: "/journal" },
    ],
    legal: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
    cookiesLabel: "Analytics cookies",
    pagesLabel: "Atla",
    socialsLabel: "Socials",
    citiesLabel: "Global Team",
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
    askLabel: "Search the work or say what you are building",
    results: {
      closest: "The closest things we have made",
      empty: "Nothing matches that.",
      error: "The work did not load.",
      startBrief: "Start a project",
      clear: "Clear",
      // The quiet text button under the wall once auto-loading stops.
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
    /** The facet line under the facts: each value opens the wall filtered to it. */
    facetsLabel: "Find similar work",
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
  },
  brief: {
    metaTitle: "Start a branding project",
    metaDescription:
      "Tell us about your brand in a few questions, one at a time. José Pablo reads every brief himself and replies by email with a first point of view.",
    progressLabel: "Brief progress",
    back: "Back",
    contact: {
      prompt: "Where should we send our reply?",
      fields: {
        name: "Name",
        email: "Email",
        company: "Company",
        website: "Website",
        phone: "Phone",
      },
      // The one promise, said the same way on the brand check and in the policy: we reply by email and manage the inquiry.
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
    bookCall: "Book a call",
  },
  // Services, one route per moment. `happens`, `byMoment` and `engagementsByMoment` are written only from
  // the moment's own line and the discipline lines: no new claims, no numbers.
  services: {
    metaTitle: "Brand Strategy, Identity, and Digital Design Services",
    metaDescription:
      "Brand strategy, naming, identity, packaging, websites and motion from Atla, for companies launching, raising, growing or starting over.",
    title: "Services",
    pickerTitle: "Where are you?",
    allMoments: "Any moment",
    happensTitle: "What usually happens",
    // With no moment chosen: the general version, from the strategy, identity and engagement lines.
    happensAny: [
      "The brand gets built in pieces, by different teams and agencies.",
      "Each piece is fine on its own, and together they stop looking like one company.",
    ],
    disciplinesTitle: "What we do",
    // Act two echoes the chosen moment.
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
    includesOpen: "See what is included",
    workTitle: "From the work",
    // With no moment chosen, the project in "From the work".
    anyProject: { slug: "rustico", line: "An identity for dinners under the stars." },
    // The two ways forward, side by side.
    doors: [
      { label: "Start a project", href: "/brief" },
      { label: "Ask for a free brand check", href: "/brand-check" },
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
        projectLine: "An open-fire dinner at Acre, given a brand for its first season.",
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
        projectLine: "A name and a house of color for a kids' creative space in Monterrey.",
      },
      {
        id: "reposition",
        title: "Reposition",
        line: "The company changed and the brand did not. We start with what your customers already say about you.",
        happens: [
          "Your customers already say something about you that the brand does not.",
        ],
        project: "hanks-leather",
        projectLine: "A heritage leather house from Upstate New York, rebuilt for the way it sells today.",
      },
    ],
    // How a company works with us. Names are the ones JP uses in proposals; no prices on the site.
    engagementsTitle: "How we work together",
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
  // The free brand check: no counts, no durations. The option labels live in shared/brandCheck.ts.
  brandCheck: {
    metaTitle: "Free brand check from a branding studio",
    metaDescription:
      "A free brand check from Atla. We look at your brand as it lives today, find the biggest opportunities and show you what we would change first.",
    title: "What is holding your brand back?",
    fields: {
      name: "Name",
      email: "Email",
      site: "Website or Instagram",
      moment: "Your moment",
      size: "Company size",
      investing: "Investing in brand this year?",
      message: "Message",
    },
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
    bookCall: "Book a call",
  },
  // The free audit, at /audit (JP, 2026-11-07, interview; the deliverable is a brand audit, not a video, JP same day): the reader comes from JP's reels, the magic is JP
  // himself looking at their brand, so the page is JP in first person. Lines follow VOICE-JP.md (vault,
  // Resources/jdomito-content/craft): his camera lines, "I think", "say, hey", no triads, no cute one-liners.
  // What he usually finds, what they get, three fields; read in two minutes. The number is said in words only
  // ("five a week"); the cap lives in shared/audit.ts. Nothing here names a client or a past audit.
  audit: {
    metaTitle: "Free brand audit from José Pablo",
    metaDescription:
      "A free brand audit from José Pablo, founder of Atla. Send your website or Instagram and get an honest audit: what works, and what he'd change first. Five a week.",
    // CRO review 2026-11-07 (docs/superpowers/specs/2026-11-07-audit-landing/cro-review.md): name JP above the
    // title, state the offer in the title, JP's own line opens the lead. Policies confirmed by JP the same day:
    // the video is private; it is sent as soon as it is ready (no fixed window); the audit says what works and
    // what doesn't, fixes are a sometimes; the email may join the list (so no "only for the video" line).
    eyebrow: "José Pablo, founder of Atla",
    title: "Send me your brand. I'll audit it, free, and tell you what works and what doesn't.",
    lead: "We all need an extra pair of eyes. You're too close to your brand, and attached to it. On Instagram I break down brands I don't work for. This one I do for you.",
    // The live widget (components/audit/AuditSlots.tsx). {left} and {cap} are said in words.
    week: {
      label: "This week",
      live: "Live",
      neutral: "Five spots a week, in the order they come in.",
      empty: "This week's five are open. I do them in the order they come in.",
      left: "{left} of {cap} spots left this week.",
      lastOne: "One spot left this week.",
      full: "This week's five are taken. Send yours anyway and I'll get to it after them, in the order it came in.",
      // What the person who just sent sees in place of the call to send.
      sentOpen: "You took one of this week's five.",
      sentFull: "You're on the list, after this week's five.",
      updatedNow: "Updated just now",
      updatedMoment: "Updated a moment ago",
      updatedMinutes: "Updated a few minutes ago",
      // Shown once a full week has gone by with its five taken: the one proof the counter can carry.
      lastWeek: "Last week's five were taken too.",
      resets: "Five a week, because I do every one myself.",
    },
    // The hero drawing and three drawn steps (Higgsfield GPT Image, after JP's references, 2026-11-07: absurd,
    // hand-inked, halftone; one cast, the Inspector with his giant magnifying glass and the Bottle).
    heroArt: { src: "/audit/landing/hero.webp", clip: "/audit/landing/hero", alt: "José Pablo as a drawn inspector, his face magnified through a magnifying glass bigger than himself", width: 740, height: 1000 },
    howTitle: "How it works",
    steps: [
      { src: "/audit/landing/step-1.webp", clip: "/audit/landing/step-1", alt: "A bottle with little legs climbing into an envelope", line: "You send me your website or your Instagram." },
      { src: "/audit/landing/step-2.webp", clip: "/audit/landing/step-2", alt: "A man holding a magnifying glass bigger than himself up to the bottle", line: "I look at it the way a customer does and put the audit together. I start with what I like, then what I'd change, in order." },
      { src: "/audit/landing/step-3.webp", clip: "/audit/landing/step-3", alt: "The bottle walking off with its audit sheet under its arm while the man waves goodbye", line: "You get the audit by email. Sometimes we fix a couple of things along the way. If you don't need a studio yet, I'll say so." },
    ],
    // The hero action and the landing header on /audit both jump to the form (the page has no other door).
    cta: "Send me your brand",
    // The hero button (JP, 2026-11-07: "un botón que diga start free audit request"); the header keeps the short door.
    heroCta: "Start free audit request",
    proofLabel: "Brands I've worked with",
    // The social proof under the steps (JP, 2026-11-07: "que se vea de que este cabrón es la verga"). Every claim
    // is on the site already or checked the same day: MICHELIN Key (Casa Las Tortugas), MICHELIN Green Star
    // (Acre's restaurant), Anything's series A (Bessemer, Footwork), Ulysses's series A (Andreessen Horowitz).
    proofLine: "From a MICHELIN Key hotel and a MICHELIN Green Star restaurant to startups backed by Andreessen Horowitz and Bessemer.",
    proofAwards: [
      { name: "Casa Las Tortugas", award: "MICHELIN Key", src: "/hospitality/michelin-key.webp" },
      { name: "Acre", award: "MICHELIN Green Star", src: "/hospitality/michelin-green-star.svg" },
    ],
    // Marks without a logo file yet are set in type (Ulysses's wordmark is pending).
    proofNames: ["Ulysses"],
    formTitle: "Where does your brand live?",
    fit: "Any brand that's live works: a shop, a restaurant, a product, an app. If you look at it and say, hey, something is off, send it.",
    fields: { site: "Website or Instagram", name: "Name", email: "Email" },
    // Under the button: the private promise (JP, 2026-11-07), the no-catch line, the no-effort line.
    assurances: [
      "The audit is only for you. I don't post it, and your brand doesn't end up in a reel.",
      "I think a few of you will want to work with Atla later. Most won't, and that's all right.",
      "No call, nothing to prepare. It's free, and I send it as soon as it's ready.",
    ],
    // JP, 2026-11-07: the email may join the lists, so the line says it (red team P0-3).
    privacyNotice: "We use this to reply, to run your audit and, now and then, to send you news from Atla and WeLoveDaily. You can unsubscribe any time.",
    privacyLink: "Privacy",
    submit: "Start free audit request",
    sending: "Sending",
    retry: "Try again",
    nameError: "I need a name.",
    emailError: "I need an email I can reply to.",
    siteError: "I need a website or an Instagram to look at.",
    rateLimited: "Too many tries from here. Try again later.",
    network: "That didn't go through. What you wrote is still here.",
    done: {
      open: { title: "Got it.", line: "You're in this week's five. The audit comes by email, from me, as soon as it's ready." },
      full: { title: "You're on the list.", line: "This week's five are taken, so yours comes after them, in the order it came in. The audit comes by email as soon as it's ready." },
      error: { title: "That didn't go through.", line: "Nothing was lost. Scroll up and send it again in a moment." },
    },
    // After the send: one micro step, then the questions that make the audit sharper (Daniel Priestley's
    // scorecard questions, JP 2026-11-07): frustration, outcome, what they tried, and always "anything else" last.
    doneFollow: "While it's on its way, I'm on Instagram every week.",
    doneFollowLink: "Follow @jdomito_",
    answersTitle: "Four questions, so the audit is about you",
    answersLine: "Skip any of them. What you write goes to me, not to a form.",
    answers: [
      { key: "frustration", label: "What's bugging you about your brand right now?" },
      { key: "outcome", label: "Where do you want it to be a year from now?" },
      { key: "tried", label: "What have you already tried that didn't work?" },
      { key: "anything", label: "Anything else you want me to know?" },
    ],
    feedbackSend: "Send the answers",
    feedbackDone: "Got them. That makes the audit better.",
    feedbackFailed: "That didn't save. Try again in a moment.",
    doneHome: "See the work",
  },
  // Why Atla, at /about: the argument a buyer reads before hiring. Proof lines come from the hospitality
  // page and the ventures; selected clients from JP's list.
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
    ] as ReadonlyArray<{ name: string; role: string }>,
  },
  // Client marks above the footer: monochrome SVGs JP sends (client/public/logos-v2/). Empty list = no
  // band. Never invent a logo.
  logos: {
    label: "Clients",
    // Order = JP's selected-client list, then the featured projects. Sources per mark in
    // docs/superpowers/specs/2026-11-05-client-logos.md. Missing until JP sends files:
    // Aimee Kestenberg, PrettyBoy, Casa Colora, Reggie.
    items: [
      { name: "Temakase", src: "/logos-v2/temakase.svg", width: 660, height: 103 },
      { name: "Rústico", src: "/logos-v2/rustico.svg", width: 548, height: 130 },
      { name: "Pax & Beneficia", src: "/logos-v2/pax-beneficia.svg", width: 859, height: 460 },
      { name: "Persona", src: "/logos-v2/persona.svg", width: 1485, height: 259 },
      { name: "Brick", src: "/logos-v2/brick.svg", width: 142, height: 26 },
      { name: "Anything", src: "/logos-v2/anything.svg", width: 971, height: 253 },
      { name: "Sexto Abismo", src: "/logos-v2/sexto-abismo.svg", width: 574, height: 275 },
      { name: "Bond&Bloom", src: "/logos-v2/bond-bloom.svg", width: 399, height: 50 },
      { name: "Hanks Leather Goods", src: "/logos-v2/hanks.svg", width: 762, height: 249 },
      { name: "The Curated Outfit", src: "/logos-v2/the-curated-outfit.svg", width: 699, height: 154 },
      { name: "Vyv", src: "/logos-v2/vyv.svg", width: 802, height: 466 },
      { name: "Arc Studio", src: "/logos-v2/arc-studio.svg", width: 820, height: 146 },
      { name: "Tequila Unido", src: "/logos-v2/tequila-unido.svg", width: 207, height: 91 },
      { name: "Angeles Wellness", src: "/logos-v2/angeles-wellness.svg", width: 1037, height: 303 },
      { name: "TigreTigre", src: "/logos-v2/tigretigre.svg", width: 811, height: 157 },
      { name: "Alma Brava", src: "/logos-v2/alma-brava.svg", width: 617, height: 149 },
      { name: "Pathize Health", src: "/logos-v2/pathize-health.svg", width: 1003, height: 115 },
      { name: "Huémac", src: "/logos-v2/huemac.svg", width: 223, height: 40 },
      { name: "Castro Capital", src: "/logos-v2/castro-capital.svg", width: 396, height: 33 },
      { name: "Oxylife", src: "/logos-v2/oxylife.svg", width: 742, height: 130 },
      { name: "Peachy Patients", src: "/logos-v2/peachy-patients.svg", width: 842, height: 332 },
      { name: "PuppyPy", src: "/logos-v2/puppypy.svg", width: 2252, height: 423 },
      { name: "Mundã", src: "/logos-v2/munda.svg", width: 656, height: 162 },
      { name: "Baristio", src: "/logos-v2/baristio.svg", width: 281, height: 100 },
    ] as ReadonlyArray<{ name: string; src: string; width: number; height: number }>,
  },
  // A quiet page: names and one line each.
  ventures: {
    metaTitle: "Ventures beyond client work",
    metaDescription: "The companies Atla founded or is involved in beyond client work, starting with WeLoveDaily, the curation media it built.",
    title: "Some brands we did not stop at designing.",
    items: [
      { name: "Sexto Abismo", line: "Surrealist gin from Mexico.", href: "/projects/sexto-abismo" },
      { name: "TigreTigre", line: "A restaurant in San Luis Potosí.", href: "/projects/tigretigre" },
      { name: "Persona", line: "Nutrition, made personal.", href: "/projects/persona" },
      { name: "WeLoveDaily", line: "A daily curation of the brands we love.", href: "https://welovedaily.net" },
    ],
  },
  // Ask: the concierge mode of the Explore pill. The answers are written by the model inside the site's
  // rules (server/ask); these are the fixed lines around them.
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
