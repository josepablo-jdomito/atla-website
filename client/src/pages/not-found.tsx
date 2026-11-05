import { Link } from "wouter";
import { PageShell } from "@/components/site/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <div className="site-page-body not-found">
        <header className="page-intro">
          <h1 className="home-section-label">Page not found</h1>
          <Link href="/" className="not-found__home">
            Go to home ↘
          </Link>
        </header>
      </div>
    </PageShell>
  );
}
