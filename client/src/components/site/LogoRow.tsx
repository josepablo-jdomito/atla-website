import { siteCopy } from "@/content/siteCopy";

/**
 * Client logos, monochrome, from client/public/logos-v2/. The list is
 * PENDING JP APPROVAL (Task 11); with no logos the row renders nothing.
 */
export function LogoRow({ logos }: { logos: ReadonlyArray<{ name: string; src: string }> }) {
  if (logos.length === 0) return null;
  return (
    <section className="logo-row" aria-label={siteCopy.home.logosLabel}>
      <ul className="logo-row__list">
        {logos.map((logo) => (
          <li key={logo.name}>
            <img className="logo-row__logo" src={logo.src} alt={logo.name} loading="lazy" decoding="async" />
          </li>
        ))}
      </ul>
    </section>
  );
}
