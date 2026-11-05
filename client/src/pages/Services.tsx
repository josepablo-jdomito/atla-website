import { Link } from "wouter";
import { PageShell } from "@/components/site/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { siteCopy } from "@/content/siteCopy";
import { buildServicesStructuredData } from "@/lib/sitePageSchema";
import { formatMetaTitle } from "@shared/siteSeo";

const copy = siteCopy.services;

function briefHref(moment: string) {
  return `/brief?moment=${encodeURIComponent(moment)}`;
}

const structuredData = buildServicesStructuredData();

export default function Services() {
  return (
    <PageShell>
      <SeoHead
        title={formatMetaTitle(copy.metaTitle, "Atla")}
        description={copy.metaDescription}
        pathname="/services"
        structuredData={structuredData}
      />
      <div className="site-page-body">
        <header className="page-intro">
          <h1 className="page-intro__title">{copy.title}</h1>
          <p className="page-intro__lead">{copy.lead}</p>
        </header>

        <div className="moments">
          {copy.moments.map((moment) => (
            <section key={moment.id} id={moment.id} className="moment" aria-labelledby={`moment-${moment.id}`}>
              <h2 id={`moment-${moment.id}`} className="moment__title">
                {moment.title}
              </h2>
              <div className="moment__body">
                <p className="moment__line">{moment.line}</p>
                <h3 className="home-section-label">{copy.listLabel}</h3>
                <ul className="moment__list">
                  {moment.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <Link href={briefHref(moment.brief)} className="brief-primary moment__cta">
                  {copy.cta}
                </Link>
              </div>
            </section>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
