import { useState } from "react";
import { Link, useLocation } from "wouter";
import { fallbackSiteSettings } from "@/lib/sanity.queries";
import { studioUrl } from "@/lib/sanity";
import { useIsMobile } from "@/hooks/use-mobile";

type NavLinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

const navItems: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "CMS", href: "/admin/projects" },
  { label: "Contact", href: `mailto:${fallbackSiteSettings.contactEmail}`, external: true },
];

function BrandMark() {
  return (
    <Link className="flex items-center gap-4" href="/">
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9cebc] bg-[#fcf8f1] shadow-[0_10px_24px_rgba(60,44,24,0.08)]">
        <img alt="Atla" className="h-6 w-auto" src="/figmaAssets/logo.svg" />
      </span>
      <div className="space-y-1">
        <p className="font-web-desktop-h3 text-2xl leading-none text-[#17130e]">Atla</p>
        <p className="text-[10px] uppercase tracking-[0.34em] text-[#8c7b68]">Design practice</p>
      </div>
    </Link>
  );
}

function NavItem({
  item,
  currentPath,
  onClick,
  mobile = false,
}: {
  item: NavLinkItem;
  currentPath: string;
  onClick?: () => void;
  mobile?: boolean;
}) {
  const isActive =
    item.href === "/"
      ? currentPath === "/"
      : item.href.startsWith("/work")
        ? currentPath.startsWith("/work")
        : false;

  const className = mobile
    ? `block border-b border-[#2e261c] pb-4 font-web-desktop-h3 text-4xl leading-none ${
        isActive ? "text-[#ffc629]" : "text-[#faf7f0]"
      }`
    : `text-[12px] uppercase tracking-[0.28em] transition-colors ${
        isActive ? "text-[#17130e]" : "text-[#6d6256] hover:text-[#17130e]"
      }`;

  if (item.external || item.href.includes("#")) {
    return (
      <a
        className={className}
        href={item.href}
        onClick={onClick}
        rel={item.external ? "noreferrer" : undefined}
        target={item.external ? "_blank" : undefined}
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link className={className} href={item.href} onClick={onClick}>
      {item.label}
    </Link>
  );
}

export function AtlaNav() {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-[#e4dacb] bg-[rgba(247,241,230,0.84)] backdrop-blur-xl">
        <div className="mx-auto flex h-[84px] max-w-6xl items-center justify-between px-5 md:px-8">
          <BrandMark />

          <div className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <NavItem currentPath={location} item={item} key={item.label} />
            ))}
          </div>

          <div className="hidden md:flex">
            <a
              className="rounded-full border border-[#17130e] bg-[#17130e] px-5 py-3 text-[11px] uppercase tracking-[0.28em] text-[#faf7f0] transition-colors hover:bg-transparent hover:text-[#17130e]"
              href={studioUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open Studio
            </a>
          </div>

          <button
            className="flex items-center gap-3 rounded-full border border-[#d9cebc] bg-[#fcf8f1] px-4 py-2.5 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#17130e]">
              {menuOpen ? "Close" : "Menu"}
            </span>
            <span className="space-y-1">
              <span className="block h-[1.5px] w-5 bg-[#17130e]" />
              <span className="block h-[1.5px] w-5 bg-[#17130e]" />
            </span>
          </button>
        </div>
      </nav>

      {isMobile && menuOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#17130e] px-6 py-8 text-[#faf7f0]">
          <div className="flex items-center justify-between">
            <BrandMark />
            <button
              className="rounded-full border border-[#3a3126] px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#faf7f0]"
              onClick={() => setMenuOpen(false)}
              type="button"
            >
              Close
            </button>
          </div>

          <div className="mt-14 flex flex-1 flex-col justify-between">
            <div className="space-y-6">
              {navItems.map((item) => (
                <NavItem
                  currentPath={location}
                  item={item}
                  key={item.label}
                  mobile
                  onClick={() => setMenuOpen(false)}
                />
              ))}
            </div>

            <div className="space-y-5 rounded-[28px] border border-[#2f261b] bg-[#211b14] p-6">
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#b5a387]">Studio access</p>
              <p className="text-sm leading-6 text-[#dccfb8]">
                Open the CMS to manage projects, settings, and the portfolio content model.
              </p>
              <a
                className="inline-flex rounded-full border border-[#ffc629] px-5 py-3 text-[11px] uppercase tracking-[0.28em] text-[#ffc629]"
                href={studioUrl}
                rel="noreferrer"
                target="_blank"
              >
                Open Studio
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
