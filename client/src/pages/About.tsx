import { PageShell } from "@/components/site/PageShell";
import { SITE_CITIES } from "@/components/site/SiteFooter";
import { SeoHead } from "@/components/seo/SeoHead";
import { siteCopy } from "@/content/siteCopy";
import { formatMetaTitle, ORGANIZATION_SCHEMA } from "@shared/siteSeo";

const copy = siteCopy.about;

export default function About() {
  return (
    <PageShell>
      <SeoHead
        title={formatMetaTitle(copy.metaTitle, copy.metaSuffix)}
        description={copy.metaDescription}
        pathname="/about"
        image="/figmaAssets/about-hero.jpg"
        structuredData={ORGANIZATION_SCHEMA}
      />
      <div className="site-page-body">
        <header className="page-intro">
          <h1 className="page-intro__title">{copy.title}</h1>
          <p className="page-intro__lead">{copy.lead}</p>
        </header>

        <section className="page-section" aria-labelledby="about-how">
          <h2 id="about-how" className="home-section-label">
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

        <section className="page-section" aria-labelledby="about-team" data-block="team">
          <h2 id="about-team" className="home-section-label">
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
            <h3 className="home-section-label team-cities__label">{copy.citiesLabel}</h3>
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
