import { Link } from "wouter";
import { PageShell } from "@/components/site/PageShell";
import { SITE_CITIES } from "@/components/site/SiteFooter";
import { useSiteProjects } from "@/components/site/siteProjects";
import { SeoHead } from "@/components/seo/SeoHead";
import { siteCopy } from "@/content/siteCopy";
import { formatMetaTitle, ORGANIZATION_SCHEMA } from "@shared/siteSeo";

/**
 * Why Atla, at /about (the URL stays for SEO). The argument a CMO reads before
 * hiring: the thesis, how we work, proof, clients, ways in, the team.
 */
const copy = siteCopy.about;
const engagements = siteCopy.services;

/** The project page a proof line is about, when that project is on the site. */
function proofSlug(line: string, slugs: Set<string>) {
  return Object.entries(siteCopy.project.proof).find(([slug, text]) => text === line && slugs.has(slug))?.[0];
}

export default function About() {
  const { projects } = useSiteProjects();
  const slugs = new Set(projects.map((project) => project.slug));
  return (
    <PageShell>
      <SeoHead
        title={formatMetaTitle(copy.metaTitle, copy.metaSuffix)}
        description={copy.metaDescription}
        pathname="/about"
        image="/figmaAssets/about-hero.jpg"
        structuredData={ORGANIZATION_SCHEMA}
      />
      <div className="site-page-body why">
        <header className="page-intro why-intro">
          <h1 className="page-intro__title why-intro__title">{copy.title}</h1>
          <p className="page-intro__lead">{copy.lead}</p>
        </header>

        <section className="page-section" aria-labelledby="why-thesis">
          <h2 id="why-thesis" className="site-label">
            {copy.thesisLabel}
          </h2>
          <div className="page-section__body">
            <ol className="how-steps why-thesis">
              {copy.thesis.map((item) => (
                <li key={item.title} className="how-step">
                  <h3 className="how-step__title why-thesis__title">{item.title}</h3>
                  <p className="how-step__body">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="page-section" aria-labelledby="about-how">
          <h2 id="about-how" className="site-label">
            {copy.howLabel}
          </h2>
          <div className="page-section__body">
            <p className="page-section__lead">{copy.howLead}</p>
            <ol className="how-steps">
              {copy.how.map((step) => (
                <li key={step.title} className="how-step">
                  <h3 className="how-step__title">{step.title}</h3>
                  <p className="how-step__body">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="page-section" aria-labelledby="why-proof">
          <h2 id="why-proof" className="site-label">
            {copy.proofLabel}
          </h2>
          <div className="page-section__body">
            <ul className="why-proof">
              {copy.proof.map((line) => {
                const slug = proofSlug(line, slugs);
                return (
                  <li key={line}>
                    {slug ? (
                      <Link href={`/projects/${slug}`} className="why-proof__link">
                        {line}
                      </Link>
                    ) : (
                      line
                    )}
                  </li>
                );
              })}
            </ul>
            <h3 className="site-label team-cities__label">{copy.clientsLabel}</h3>
            <p className="why-clients">{copy.clients.join("  ·  ")}</p>
          </div>
        </section>

        <section className="page-section" aria-labelledby="why-ways">
          <h2 id="why-ways" className="site-label">
            {copy.engagementsLabel}
          </h2>
          <div className="page-section__body">
            <p className="page-section__lead">{engagements.engagementsLead}</p>
            <ol className="how-steps">
              {engagements.engagements.map((item) => (
                <li key={item.title} className="how-step">
                  <h3 className="how-step__title">{item.title}</h3>
                  <p className="how-step__body">{item.line}</p>
                </li>
              ))}
            </ol>
            <Link href="/brief" className="site-link why-cta">
              {copy.cta}
            </Link>
          </div>
        </section>

        <section className="page-section" aria-labelledby="about-team" data-block="team">
          <h2 id="about-team" className="site-label">
            {copy.teamLabel}
          </h2>
          <div className="page-section__body">
            <ul className="team-list">
              {copy.team.map((member) => (
                <li key={member.name} className="team-list__row">
                  <span className="team-list__name">{member.name}</span>
                  <span className="team-list__role">{member.role}</span>
                  {member.city ? <span className="team-list__city">{member.city}</span> : null}
                </li>
              ))}
            </ul>
            <h3 className="site-label team-cities__label">{copy.citiesLabel}</h3>
            <ul className="city-list">
              {SITE_CITIES.map((city) => (
                <li key={city.label}>{city.label}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
