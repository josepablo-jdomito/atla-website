import { Link } from "wouter";
import { PageShell } from "@/components/site/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";

export default function NotFound() {
  return (
    <PageShell logos={false}>
      <SeoHead title="Page not found | Atla" description="The page you requested could not be found." pathname="/404" robots="noindex,nofollow" />
      <div className="site-page-body not-found">
        <header className="page-intro">
          <h1 className="page-intro__title">That page is not here.</h1>
          <Link href="/" className="site-action not-found__home">
            See the work
          </Link>
        </header>
      </div>
    </PageShell>
  );
}
