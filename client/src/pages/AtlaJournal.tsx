import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  JOURNAL_DESCRIPTION_PAD,
  JOURNAL_EMPTY,
  JOURNAL_META_DESCRIPTION,
  JOURNAL_TITLE_SUFFIX,
  formatMetaTitle,
  ORGANIZATION_LOGO_URL,
  ORGANIZATION_NAME,
  SITE_ORIGIN,
} from "@shared/siteSeo";
import { useRoute } from "wouter";
import { trackEvent } from "@/hooks/use-analytics";
import { PageError, PageShell, PageSkeleton } from "@/components/site/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import NotFound from "@/pages/not-found";
import { fetchJournalArticles, fetchJournalCategories } from "@/lib/journalApi";
import { articleDescription, articlePublishedIso } from "@/lib/journalSeo";
import { formatJournalMetaTitle } from "@/lib/seoSchema";
import { getImageDimensions } from "@shared/imageDelivery";
import { ownCovers } from "@/lib/journalCovers";

const DEFAULT_PAGE_DESCRIPTION = JOURNAL_META_DESCRIPTION;
const CATEGORY_SUPPORT_COPY: Record<string, string[]> = {
  branding: ["Naming, positioning, rebrands and launches, and what each one changes once it reaches the website, the package and the pitch."],
  strategy: ["Positioning and audience, written so the design work moves faster."],
  insights: ["Short notes from client work."],
  "web-design": ["A website has to explain the business as well as it looks. These essays cover structure, copy, case studies and the path to an inquiry."],
};

function ensureDescriptionLength(description: string) {
  // A complete sentence is never padded with a second one that says the same thing.
  if (description.length >= 80) return description;
  const fallback = JOURNAL_DESCRIPTION_PAD;
  const combined = `${description} ${fallback}`.trim();
  return combined.length > 160 ? `${combined.slice(0, 157).trimEnd()}...` : combined;
}

export default function AtlaJournal() {
  const [, categoryParams] = useRoute("/journal/category/:slug");
  const activeCategorySlug = categoryParams?.slug ?? null;

  const {
    data: articlesData,
    isPending: areArticlesPending,
    isError: articlesFailed,
    refetch: refetchArticles,
  } = useQuery({
    queryKey: ["/api/journal"],
    queryFn: fetchJournalArticles,
  });
  const {
    data: categoriesData,
    isPending: areCategoriesPending,
    isError: categoriesFailed,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["/api/journal/categories"],
    queryFn: fetchJournalCategories,
  });

  const articles = useMemo(() => articlesData ?? [], [articlesData]);
  // Only a cover no other article shares is shown (see journalCovers.ts).
  const covers = useMemo(() => ownCovers(articles), [articles]);
  const categories = useMemo(() => categoriesData ?? [], [categoriesData]);
  const activeCategory = useMemo(
    () => categories.find((category) => category.slug === activeCategorySlug) ?? null,
    [categories, activeCategorySlug],
  );

  // A failed request is an error, never "Nothing here yet" and never a 404 (states report 6).
  if ((!articlesData && articlesFailed) || (activeCategorySlug && !categoriesData && categoriesFailed)) {
    return (
      <PageShell>
        <PageError
          onRetry={() => {
            void refetchArticles();
            void refetchCategories();
          }}
        />
      </PageShell>
    );
  }

  if (activeCategorySlug && !areCategoriesPending && !activeCategory) {
    return <NotFound />;
  }

  // Loading keeps the header and footer; a category route also waits for its category, so the generic
  // heading never flashes before the category's own.
  if ((!articlesData && areArticlesPending) || (activeCategorySlug && !categoriesData && areCategoriesPending)) {
    return (
      <PageShell>
        <PageSkeleton />
      </PageShell>
    );
  }

  const filteredArticles = activeCategory
    ? articles.filter((article) => article.categorySlug === activeCategory.slug)
    : articles;
  const cards = filteredArticles.slice(0, 6);
  const heroCover = cards.map((article) => covers.get(article.slug)).find(Boolean);
  const pathname = activeCategory ? `/journal/category/${activeCategory.slug}` : "/journal";
  const pageTitle = activeCategory
    ? formatJournalMetaTitle(activeCategory.seoTitle || `${activeCategory.title} Articles`)
    : formatMetaTitle("Atla Journal", JOURNAL_TITLE_SUFFIX);
  const pageDescription = ensureDescriptionLength(activeCategory?.seoDescription || activeCategory?.description || DEFAULT_PAGE_DESCRIPTION);
  const heroTitle = activeCategory
    ? activeCategory.title
    : "Notes on brands, design and how we work.";
  const heroDescription = activeCategory?.description;
  const categorySupportCopy = activeCategory
    ? CATEGORY_SUPPORT_COPY[activeCategory.slug] || [
      `Notes filed under ${activeCategory.title}.`,
    ]
    : [];
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": activeCategory ? "CollectionPage" : "Blog",
    name: activeCategory ? `${activeCategory.title} | Atla Journal` : "Atla Journal",
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
      image: covers.get(article.slug) || undefined,
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
        image={heroCover}
        structuredData={collectionSchema}
      />
      <div className="site-page-body journal">
        <header className="page-intro journal-intro">
          <h1 className="page-intro__title journal-intro__title">{heroTitle}</h1>
          {heroDescription ? <p className="page-intro__lead">{heroDescription}</p> : null}
          {categorySupportCopy.map((paragraph) => (
            <p key={paragraph} className="longform-text journal-intro__support">
              {paragraph}
            </p>
          ))}
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
                {covers.has(article.slug) ? (
                  <div className="journal-card__media">
                    <img
                      src={covers.get(article.slug)}
                      alt={article.title}
                      width={getImageDimensions(covers.get(article.slug)!)?.width}
                      height={getImageDimensions(covers.get(article.slug)!)?.height}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ) : null}
                <div className="journal-card__text">
                  <p className="site-label">{article.category}</p>
                  <h2 className="site-item-title journal-card__title">{article.title}</h2>
                  <p className="journal-card__excerpt">{article.excerpt}</p>
                  <p className="journal-card__date">{article.date}</p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="journal-empty">
            <h2 className="site-section-title journal-empty__title">{JOURNAL_EMPTY.title}</h2>
            <p className="longform-text">{JOURNAL_EMPTY.body}</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
