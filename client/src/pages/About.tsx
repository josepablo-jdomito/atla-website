import { useMemo, type ReactNode } from "react";
import { Link } from "wouter";
import { PageShell } from "@/components/site/PageShell";
import { BracketLabel, ContactCard } from "@/components/site/ContactForm";
import { useSiteProjects } from "@/components/site/siteProjects";
import { SeoHead } from "@/components/seo/SeoHead";
import { siteCopy } from "@/content/siteCopy";
import { getOptimizedImageUrl } from "@shared/imageDelivery";
import { formatMetaTitle, ORGANIZATION_SCHEMA } from "@shared/siteSeo";
import "@/styles/pages.css";

/**
 * Why Atla, at /about (the URL stays for SEO), drawn as JP's Figma About frame (4423:3581):
 * the thesis line in ABC Synt, then rows with a script title on the left and the content on the
 * right. Team is names and roles only (JP's rule: no photos). Press waits until JP gives items.
 */
const copy = siteCopy.about;
const services = siteCopy.services;
const CARD_PROJECT = "rustico";

function Row({
  id,
  title,
  first = false,
  block,
  children,
}: {
  id: string;
  title: string;
  first?: boolean;
  block?: string;
  children: ReactNode;
}) {
  return (
    <section className={first ? "fp-row fp-row--first" : "fp-row"} aria-labelledby={id} data-block={block}>
      <h2 id={id} className="fp-script">
        {title}
      </h2>
      <div className="fp-row__content">{children}</div>
    </section>
  );
}

export default function About() {
  const { projects } = useSiteProjects();
  const cardImage = useMemo(() => {
    const cover = projects.find((project) => project.slug === CARD_PROJECT)?.coverImage;
    return cover ? getOptimizedImageUrl(cover, { width: 1280, quality: 80 }) || cover : undefined;
  }, [projects]);
  const half = Math.ceil(copy.clients.length / 2);

  return (
    <PageShell>
      <SeoHead
        title={formatMetaTitle(copy.metaTitle, copy.metaSuffix)}
        description={copy.metaDescription}
        pathname="/about"
        image="/figmaAssets/about-hero.jpg"
        structuredData={ORGANIZATION_SCHEMA}
      />
      <div className="fp why">
        <header className="fp-hero">
          <img
            className="fp-hero__media"
            src="/figmaAssets/v2/about-atlas.webp"
            alt=""
            width={800}
            height={800}
            decoding="async"
          />
          <div className="fp-hero__text">
            <h1 className="fp-display">{copy.title}</h1>
          </div>
        </header>

        <Row id="why-about" title={copy.rows.about} first block="about">
          <div className="fp-paras">
            <p className="fp-body">{copy.lead}</p>
            {copy.thesis.map((item) => (
              <p key={item.title} className="fp-body">
                {item.title} {item.body}
              </p>
            ))}
          </div>
        </Row>

        <Row id="why-team" title={copy.rows.team} block="team">
          <ul className="fp-team">
            {copy.team.map((member) => (
              <li key={member.name} className="fp-team__member">
                <span className="fp-team__name">{member.name}</span>
                <span className="fp-team__role">
                  <BracketLabel muted>{member.role}</BracketLabel>
                </span>
              </li>
            ))}
          </ul>
        </Row>

        <Row id="why-services" title={copy.rows.services} block="services">
          <ul className="fp-list">
            {services.disciplines.map((discipline) => (
              <li key={discipline.id}>
                <Link href={`/services#${discipline.id}`}>{discipline.title}</Link>
              </li>
            ))}
          </ul>
        </Row>

        <Row id="why-clients" title={copy.rows.clients} block="clients">
          <div className="fp-cols2">
            <ul>
              {copy.clients.slice(0, half).map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <ul>
              {copy.clients.slice(half).map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </Row>

        <Row id="why-honors" title={copy.rows.honors} block="honors">
          <ul className="fp-pairs">
            {copy.honors.map((honor) => (
              <li key={honor.award} className="fp-pair">
                <span>{honor.award}</span>
                <span>{honor.for}</span>
              </li>
            ))}
          </ul>
        </Row>

        <Row id="why-ways" title={copy.rows.ways} block="ways">
          <p className="fp-body">{services.engagementsLead}</p>
          <ul className="fp-pairs">
            {services.engagements.map((item) => (
              <li key={item.title} className="fp-pair">
                <span>{item.title}</span>
                <span className="fp-pair__b">{item.line}</span>
              </li>
            ))}
          </ul>
        </Row>

        <Row id="why-contact" title={copy.rows.contact} block="contact">
          <ContactCard title={siteCopy.contact.cardTitle} lead={siteCopy.contact.lead} cta={copy.cta} image={cardImage} />
        </Row>
      </div>
    </PageShell>
  );
}
