import { Link, useLocation } from "wouter";
import { useState, type CSSProperties } from "react";
import { studioUrl } from "@/lib/sanity";
import { useIsMobile } from "@/hooks/use-mobile";

const navLinkStyle: CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.28,
  lineHeight: "110%",
  color: "#222222",
  textDecoration: "none",
  whiteSpace: "nowrap",
};

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
  { label: "Contact", href: "mailto:hello@example.com", external: true },
];

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <img alt="Atla" src="/figmaAssets/logo.svg" className="h-7 w-auto" />
      <span className="text-[11px] uppercase tracking-[0.35em] text-[#6b6b6b]">
        Design Studio
      </span>
    </div>
  );
}

function NavItem({ item, currentPath, onClick }: { item: NavLinkItem; currentPath: string; onClick?: () => void }) {
  const isActive =
    item.href === "/"
      ? currentPath === "/"
      : item.href.startsWith("/work")
        ? currentPath.startsWith("/work")
        : false;

  const className = isActive ? "text-[#111111]" : "text-[#555555]";

  if (item.external || item.href.includes("#")) {
    return (
      <a
        className={className}
        href={item.href}
        onClick={onClick}
        rel={item.external ? "noreferrer" : undefined}
        style={navLinkStyle}
        target={item.external ? "_blank" : undefined}
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link className={className} href={item.href} onClick={onClick} style={navLinkStyle}>
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
      <nav className="sticky top-0 z-40 flex h-[72px] w-full items-center justify-between border-b border-[#e9e1d2] bg-[rgba(250,248,244,0.9)] px-5 backdrop-blur md:px-8">
        <BrandMark />
        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavItem currentPath={location} item={item} key={item.label} />
          ))}
        </div>
        <div className="hidden md:flex">
          <a
            className="rounded-full border border-[#222222] px-4 py-2 text-xs uppercase tracking-[0.25em] text-[#222222] transition-colors hover:bg-[#222222] hover:text-[#faf7f0]"
            href={studioUrl}
            rel="noreferrer"
            target="_blank"
          >
            Open Studio
          </a>
        </div>
        <button
          className="flex items-center gap-2 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-[#222222]">Menu</span>
          <span className="space-y-1">
            <span className="block h-[1.5px] w-5 bg-[#222222]" />
            <span className="block h-[1.5px] w-5 bg-[#222222]" />
          </span>
        </button>
      </nav>

      {isMobile && menuOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#1c1c1c] px-6 py-8 text-[#faf7f0]">
          <div className="flex items-center justify-between">
            <BrandMark />
            <button
              className="text-xs uppercase tracking-[0.3em]"
              onClick={() => setMenuOpen(false)}
              type="button"
            >
              Close
            </button>
          </div>
          <div className="mt-16 flex flex-1 flex-col justify-between">
            <div className="space-y-6">
              {navItems.map((item) => (
                <NavItem
                  currentPath={location}
                  item={item}
                  key={item.label}
                  onClick={() => setMenuOpen(false)}
                />
              ))}
            </div>
            <a
              className="inline-flex w-fit rounded-full border border-[#faf7f0] px-4 py-2 text-xs uppercase tracking-[0.25em]"
              href={studioUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open Studio
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
