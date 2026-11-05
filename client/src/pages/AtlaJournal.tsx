import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  formatMetaTitle,
  ORGANIZATION_LOGO_URL,
  ORGANIZATION_NAME,
  SITE_ORIGIN,
} from "@shared/siteSeo";
import { useRoute } from "wouter";
import { trackEvent } from "@/hooks/use-analytics";
import { PageShell } from "@/components/site/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import NotFound from "@/pages/not-found";
import { fetchJournalArticles, fetchJournalCategories } from "@/lib/journalApi";
import { articleDescription, articlePublishedIso } from "@/lib/journalSeo";
import { formatJournalMetaTitle } from "@/lib/seoSchema";
import { getImageDimensions } from "@shared/imageDelivery";

const DEFAULT_PAGE_DESCRIPTION =
  "Atla Journal publishes essays, studio notes, and practical articles on branding, strategy, digital craft, motion, and visual storytelling for modern brands.";
const CATEGORY_SUPPORT_COPY: Record<string, string[]> = {
  branding: [
    "This category collects practical essays on naming, positioning, rebrands, launch systems, and the strategic choices that help a company stay recognizable as it grows.",
    "It is meant for founders, operators, and marketing teams who need clearer language around what branding work actually changes once it reaches the website, packaging, investor narrative, or customer experience.",
  ],
  strategy: [
    "Strategy pieces focus on the choices that come before visual execution: where a company sits in the market, what it needs to be known for, and how that point of view should shape messaging, structure, and rollout.",
    "The goal is not abstract theory. It is to make positioning, audience clarity, and business decisions legible enough that the creative work can move faster and hold together under pressure.",
  ],
  insights: [
    "Insights gathers shorter observations from the studio about client work, launch patterns, brand operations, and the recurring decisions that tend to shape better outcomes over time.",
    "These pieces are useful when you want a quick signal rather than a full framework: the kind of guidance that helps a team sharpen a conversation before it turns into a larger engagement.",
    "Think of this category as field notes from ongoing brand work. It is where smaller lessons live before they become larger systems, and where teams can often spot the pattern behind a problem they are already feeling internally.",
  ],
  "web-design": [
    "Web design articles in the journal focus on how structure, narrative, interaction, and visual hierarchy turn a brand system into a site that feels clear, credible, and commercially useful.",
    "They are especially relevant for teams redesigning a homepage, launch site, or company website that needs to look stronger while also explaining the business more convincingly.",
    "The emphasis is on websites as business tools, not just visual containers. These essays look at how copy, hierarchy, case studies, and conversion paths need to support the same brand logic as the visual layer.",
    "They also cover the practical tension most teams run into during redesigns: how to improve the visual language without losing clarity, speed, or the commercial usefulness of the site once it is live.",
    "That makes this category especially useful for founders and marketing teams trying to evaluate whether a redesign needs a visual refresh, a stronger story architecture, or a deeper strategic reset before design decisions start getting made.",
  ],
};

function ensureDescriptionLength(description: string) {
  if (description.length >= 130) return description;
  const fallback = "Essays, frameworks, and studio notes from Atla Journal for teams investing in stronger brand systems.";
  const combined = `${description} ${fallback}`.trim();
  return combined.length > 160 ? `${combined.slice(0, 157).trimEnd()}...` : combined;
}

export default function AtlaJournal() {
  const [, categoryParams] = useRoute("/journal/category/:slug");
  const activeCategorySlug = categoryParams?.slug ?? null;

  const { data: articlesData, isPending: areArticlesPending } = useQuery({
    queryKey: ["/api/journal"],
    queryFn: fetchJournalArticles,
  });
  const { data: categoriesData, isPending: areCategoriesPending } = useQuery({
    queryKey: ["/api/journal/categories"],
    queryFn: fetchJournalCategories,
  });

  const articles = useMemo(() => articlesData ?? [], [articlesData]);
  const categories = useMemo(() => categoriesData ?? [], [categoriesData]);
  const activeCategory = useMemo(
    () => categories.find((category) => category.slug === activeCategorySlug) ?? null,
    [categories, activeCategorySlug],
  );

  if (activeCategorySlug && !areCategoriesPending && !activeCategory) {
    return <NotFound />;
  }

  if (!articlesData && areArticlesPending) {
    return null;
  }

  const filteredArticles = activeCategory
    ? articles.filter((article) => article.categorySlug === activeCategory.slug)
    : articles;
  const featured = filteredArticles.slice(0, 3);
  const cards = filteredArticles.slice(0, 6);
  const heroArticle = featured[0] ?? articles[0];
  const pathname = activeCategory ? `/journal/category/${activeCategory.slug}` : "/journal";
  const pageTitle = activeCategory
    ? formatJournalMetaTitle(activeCategory.seoTitle || `${activeCategory.title} Articles`)
    : formatMetaTitle("Atla Journal", "Branding, Strategy, and Digital Craft");
  const pageDescription = ensureDescriptionLength(activeCategory?.seoDescription || activeCategory?.description || DEFAULT_PAGE_DESCRIPTION);
  const heroTitle = activeCategory
    ? activeCategory.title
    : "How we think about brands, design, and the work behind the work. Essays, process notes, and studio perspectives.";
  const heroDescription = activeCategory?.description;
  const categorySupportCopy = activeCategory
    ? CATEGORY_SUPPORT_COPY[activeCategory.slug] || [
      `A tighter selection of ${activeCategory.title.toLowerCase()} writing from the Atla Journal archive, focused on how ideas translate into sharper decisions, better systems, and stronger execution.`,
      `Use this category as a more specific way into the journal if you are trying to solve one problem at a time rather than browse the full archive.`,
    ]
    : [];
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": activeCategory ? "CollectionPage" : "Blog",
    name: activeCategory ? `${activeCategory.title} — Atla Journal` : "Atla Journal",
    description: pageDescription,
    url: `${SITE_ORIGIN}${pathname}`,
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
      logo: {
        "@type": "ImageObject",
        url: ORGANIZATION_LOGO_URL,
      },
    },
    hasPart: cards.map((article) => ({
      "@type": "BlogPosting",
      headline: article.title,
      url: `${SITE_ORIGIN}/journal/${article.slug}`,
      image: article.coverImage || undefined,
      description: articleDescription(article),
      datePublished: article.publishedAt || articlePublishedIso(article.date),
      articleSection: article.category,
    })),
  };

  return (
    <PageShell>
      <SeoHead
        title={pageTitle}
        description={pageDescription}
        pathname={pathname}
        image={heroArticle?.coverImage || undefined}
        structuredData={collectionSchema}
      />
      <div className="site-page-body journal">
        <header className="page-intro journal-intro">
          <p className="home-section-label">{activeCategory ? "Journal category" : "Journal"}</p>
          <h1 className="page-intro__title journal-intro__title">{heroTitle}</h1>
          {heroDescription ? <p className="page-intro__lead">{heroDescription}</p> : null}
          {categorySupportCopy.map((paragraph) => (
            <p key={paragraph} className="longform-text journal-intro__support">
              {paragraph}
            </p>
          ))}
          {!activeCategory ? (
            <p className="longform-text journal-intro__support">
              Use the journal as both an archive and a working reference. Some pieces are short and tactical, others are
              longer frameworks, but they all aim to make brand, strategy, and digital decisions easier to evaluate before
              teams commit time, budget, or attention in the wrong direction.
            </p>
          ) : null}
        </header>

        <nav className="journal-categories" aria-label="Journal categories">
          <a href="/journal" className="journal-category" aria-current={activeCategory ? undefined : "page"}>
            All
          </a>
          {categories.map((category) => (
            <a
              key={category.slug}
              href={`/journal/category/${category.slug}`}
              className="journal-category"
              aria-current={activeCategorySlug === category.slug ? "page" : undefined}
            >
              {category.title}
            </a>
          ))}
        </nav>

        {featured.length > 0 ? (
          <ul className="journal-featured">
            {featured.map((article) => (
              <li key={article.slug} className="journal-featured__item">
                <a
                  href={`/journal/${article.slug}`}
                  className="journal-featured__link"
                  onClick={() =>
                    trackEvent("journal_cta_click", {
                      page: pathname,
                      article_slug: article.slug,
                      article_category: article.category,
                      cta_type: "hero_card",
                    })}
                >
                  <span className="home-section-label">{article.category}</span>
                  <span className="journal-featured__title">{article.title}</span>
                  <span className="journal-card__date">{article.date.toUpperCase()}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        {activeCategory ? (
          <div className="journal-category-notes">
            <p className="longform-text">
              Category pages are designed to be useful on their own, not just as filters. Each one brings together essays that solve a related problem, whether that is repositioning a company, planning a rebrand, structuring a launch, or improving how a website communicates value.
            </p>
            <p className="longform-text">
              If you are comparing articles, start with the most practical piece first and then move into the longer framework essays. That usually gives enough context to understand not just what to change, but why the change matters operationally.
            </p>
            <p className="longform-text">
              Use this archive as a decision aid: identify the scenario that matches your current stage, then map the recommended sequence from strategy through execution. The objective is to reduce guesswork and help teams move from reading to actionable next steps without losing coherence.
            </p>
          </div>
        ) : null}

        {cards.length > 0 ? (
          <div className="journal-grid">
            {cards.map((article) => (
              <a
                key={article.slug}
                href={`/journal/${article.slug}`}
                className="journal-card"
                onClick={() =>
                  trackEvent("journal_cta_click", {
                    page: pathname,
                    article_slug: article.slug,
                    article_category: article.category,
                    cta_type: "grid_card",
                  })}
              >
                <div className="journal-card__media">
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      width={getImageDimensions(article.coverImage)?.width}
                      height={getImageDimensions(article.coverImage)?.height}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </div>
                <div className="journal-card__text">
                  <p className="home-section-label">{article.category}</p>
                  <h2 className="journal-card__title">{article.title}</h2>
                  <p className="journal-card__excerpt">{article.excerpt}</p>
                  <p className="journal-card__date">{article.date}</p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="journal-empty">
            <p className="journal-empty__title">Nothing here yet.</p>
            <p className="longform-text">We&apos;ll publish articles in this category soon. Browse the full archive from All.</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
