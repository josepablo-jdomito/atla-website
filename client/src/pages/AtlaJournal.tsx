import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ORGANIZATION_LOGO_URL,
  ORGANIZATION_NAME,
  SITE_ORIGIN,
} from "@shared/siteSeo";
import { useRoute } from "wouter";
import { trackEvent } from "@/hooks/use-analytics";
import { AtlaNav } from "@/components/atla/AtlaNav";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { SeoHead } from "@/components/seo/SeoHead";
import NotFound from "@/pages/not-found";
import { fetchJournalArticles, fetchJournalCategories } from "@/lib/journalApi";
import { articleDescription, articlePublishedIso } from "@/lib/journalSeo";
import { useIsMobile } from "@/hooks/use-mobile";

const BODY: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.28,
  lineHeight: "1.1",
  margin: 0,
};

const LABEL: React.CSSProperties = {
  ...BODY,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.48,
  lineHeight: "1.2",
  textTransform: "uppercase",
};

const DEFAULT_PAGE_DESCRIPTION =
  "Atla Journal publishes essays, studio notes, and articles on branding, digital craft, motion, and visual storytelling.";

export default function AtlaJournal() {
  const isMobile = useIsMobile();
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
  const heroImage = heroArticle?.heroImage || heroArticle?.coverImage || "";
  const pathname = activeCategory ? `/journal/category/${activeCategory.slug}` : "/journal";
  const pageTitle = activeCategory?.seoTitle || (activeCategory ? `${activeCategory.title} — Atla Journal` : "Journal");
  const pageDescription = activeCategory?.seoDescription || activeCategory?.description || DEFAULT_PAGE_DESCRIPTION;
  const heroTitle = activeCategory
    ? activeCategory.title
    : "How we think about brands, design, and the work behind the work. Essays, process notes, and studio perspectives.";
  const heroDescription = activeCategory?.description;

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
    <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa" }}>
      <SeoHead
        title={pageTitle}
        description={pageDescription}
        pathname={pathname}
        image={heroArticle?.coverImage || undefined}
        structuredData={collectionSchema}
      />
      <div className="atla-dark-surface">
      <main style={{ width: "100%", position: "relative" }}>
        <div style={{ position: "relative", minHeight: 750, backgroundColor: "#222", overflow: "hidden" }}>
          {heroImage ? (
            <img
              src={heroImage}
              alt=""
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.64 }}
            />
          ) : null}
          <AtlaNav inverted />

          <div
            className="atla-enter"
            style={{
              padding: isMobile ? "80px 10px 40px" : "100px 20px 20px",
              minHeight: 750,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {activeCategory ? (
                  <p style={{ ...LABEL, color: "#fafafa" }}>Journal category</p>
                ) : null}
                <h1
                  style={{
                    fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
                    fontSize: isMobile ? 40 : 64,
                    fontWeight: 400,
                    lineHeight: "1.1",
                    color: "#fafafa",
                    margin: 0,
                    maxWidth: isMobile ? 366 : 928,
                  }}
                >
                  {heroTitle}
                </h1>
                {heroDescription ? (
                  <p style={{ ...BODY, color: "#fafafa", maxWidth: 520 }}>
                    {heroDescription}
                  </p>
                ) : null}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center" }}>
                <a
                  href="/journal"
                  className="atla-link"
                  style={{
                    ...LABEL,
                    color: "#fafafa",
                    textDecoration: "none",
                    borderBottom: activeCategory ? "1px solid transparent" : "1px solid #fafafa",
                    paddingBottom: 4,
                  }}
                >
                  All
                </a>
                {categories.map((category) => {
                  const isActive = activeCategorySlug === category.slug;
                  return (
                    <a
                      key={category.slug}
                      href={`/journal/category/${category.slug}`}
                      className="atla-link"
                      style={{
                        ...LABEL,
                        color: "#fafafa",
                        textDecoration: "none",
                        borderBottom: isActive ? "1px solid #fafafa" : "1px solid transparent",
                        paddingBottom: 4,
                        opacity: isActive ? 1 : 0.72,
                      }}
                    >
                      {category.title}
                    </a>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))", gap: 20 }}>
              {(isMobile ? featured.slice(0, 1) : featured).map((article) => (
                <a
                  key={article.slug}
                  href={`/journal/${article.slug}`}
                  className="atla-card"
                  onClick={() =>
                    trackEvent("journal_cta_click", {
                      page: pathname,
                      article_slug: article.slug,
                      article_category: article.category,
                      cta_type: "hero_card",
                    })}
                  style={{ color: "#fafafa", textDecoration: "none", display: "flex", flexDirection: "column", gap: 32 }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <p style={{ ...LABEL, color: "#fafafa" }}>{article.category}</p>
                    <p style={{ ...BODY, color: "#fafafa" }}>{article.title}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <p style={{ ...BODY, color: "#fafafa" }}>{article.date.toUpperCase()}</p>
                    <div style={{ width: "100%", height: 1, backgroundColor: "rgba(250,250,250,0.2)" }} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: isMobile ? "100px 10px" : "200px 20px",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
            gap: isMobile ? 64 : 20,
            rowGap: isMobile ? 64 : 80,
          }}
        >
          {cards.length > 0 ? cards.map((article) => (
            <a
              key={article.slug}
              href={`/journal/${article.slug}`}
              className="atla-card"
              onClick={() =>
                trackEvent("journal_cta_click", {
                  page: pathname,
                  article_slug: article.slug,
                  article_category: article.category,
                  cta_type: "grid_card",
                })}
              style={{ textDecoration: "none", color: "#222", display: "flex", flexDirection: "column", gap: 20 }}
            >
              <div style={{ width: "100%", aspectRatio: "380 / 331.63", overflow: "hidden", backgroundColor: "#efefef" }}>
                {article.coverImage ? (
                  <img src={article.coverImage} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : null}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <p style={{ ...LABEL, color: "#8e8e8e" }}>{article.category}</p>
                <h2
                  style={{
                    fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                    fontSize: isMobile ? 24 : 32,
                    fontWeight: 400,
                    lineHeight: "1.1",
                    color: "#222",
                    margin: 0,
                  }}
                >
                  {article.title}
                </h2>
                <p style={{ ...BODY, color: "#8e8e8e", maxWidth: 304 }}>{article.excerpt}</p>
                <p style={{ ...BODY, paddingTop: 10 }}>{article.date}</p>
              </div>
            </a>
          )) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p
                style={{
                  fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
                  fontSize: isMobile ? 32 : 48,
                  lineHeight: "1.1",
                  color: "#222",
                  margin: 0,
                }}
              >
                Nothing here yet.
              </p>
              <p style={{ ...BODY, maxWidth: 420 }}>
                We&apos;ll publish articles in this category soon. Browse the full archive from All.
              </p>
            </div>
          )}
        </div>
      </main>
      </div>
      <AtlaFooter />
    </div>
  );
}
