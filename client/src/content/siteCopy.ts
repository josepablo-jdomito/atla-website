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
