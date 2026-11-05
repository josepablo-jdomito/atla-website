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
} as const;

export type SiteCopy = typeof siteCopy;
