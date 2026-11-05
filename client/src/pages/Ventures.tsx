import { Link } from "wouter";
import { PageShell } from "@/components/site/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import { siteCopy } from "@/content/siteCopy";
import { formatMetaTitle, ORGANIZATION_SCHEMA } from "@shared/siteSeo";

const copy = siteCopy.ventures;

/** A quiet page (JP, 2026-11-05): four names, one line each, nothing more. */
export default function Ventures() {
  return (
    <PageShell>
      <SeoHead
        title={formatMetaTitle(copy.metaTitle, "Atla")}
        description={copy.metaDescription}
        pathname="/ventures"
        structuredData={ORGANIZATION_SCHEMA}
      />
      <div className="site-page-body">
        <header className="page-intro">
          <h1 className="page-intro__title">{copy.title}</h1>
          <p className="page-intro__lead">{copy.lead}</p>
        </header>
        <ul className="ventures-list">
          {copy.items.map((item) => {
            const external = item.href.startsWith("http");
            const inner = (
              <>
                <span className="ventures-list__name">{item.name}</span>
                <span className="ventures-list__line">{item.line}</span>
              </>
            );
            return (
              <li key={item.name} className="ventures-list__row">
                {external ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className="ventures-list__link">
                    {inner}
                  </a>
                ) : (
                  <Link href={item.href} className="ventures-list__link">
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </PageShell>
  );
}
