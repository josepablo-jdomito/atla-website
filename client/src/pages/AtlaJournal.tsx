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
import { AtlaNav } from "@/components/atla/AtlaNav";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { SeoHead } from "@/components/seo/SeoHead";
import NotFound from "@/pages/not-found";
import { fetchJournalArticles, fetchJournalCategories } from "@/lib/journalApi";
import { articleDescription, articlePublishedIso } from "@/lib/journalSeo";
import { useIsMobile } from "@/hooks/use-mobile";
import { buildImageSrcSet, getImageDimensions, getOptimizedImageUrl } from "@shared/imageDelivery";

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

const MUTED_TEXT = "#6f6f6f";
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
  const pageTitle = activeCategory
    ? formatMetaTitle(activeCategory.seoTitle || `${activeCategory.title} Articles`, "Atla Journal")
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
  const heroImageDimensions = getImageDimensions(heroImage);
  const heroImageSrc = heroImage
    ? getOptimizedImageUrl(heroImage, { width: isMobile ? 900 : 1600, quality: 82 }) || heroImage
    : "";
  const heroImageSrcSet = heroImage
    ? buildImageSrcSet(heroImage, isMobile ? [640, 900] : [900, 1280, 1600], { quality: 82 })
    : "";

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
              src={heroImageSrc}
              srcSet={heroImageSrcSet}
              sizes="100vw"
              alt=""
              width={heroImageDimensions?.width}
              height={heroImageDimensions?.height}
              fetchPriority="high"
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
                  <p style={{ ...LABEL, color: "#d8d1c6" }}>Journal category</p>
                ) : null}
                <h1
                  style={{
                    fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
                    fontSize: isMobile ? 40 : 64,
                    fontWeight: 400,
                    lineHeight: "1.1",
                    color: "#e2dbd1",
                    margin: 0,
                    maxWidth: isMobile ? 366 : 928,
                  }}
                >
                  {heroTitle}
                </h1>
                {heroDescription ? (
                  <p style={{ ...BODY, color: "#d8d1c6", maxWidth: 560, lineHeight: "1.5" }}>
                    {heroDescription}
                  </p>
                ) : null}
                {categorySupportCopy.map((paragraph) => (
                  <p key={paragraph} style={{ ...BODY, color: "#cfc5b8", maxWidth: 640, lineHeight: "1.55" }}>
                    {paragraph}
                  </p>
                ))}
                {!activeCategory ? (
                  <p style={{ ...BODY, color: "#cfc5b8", maxWidth: 640, lineHeight: "1.55" }}>
                    Use the journal as both an archive and a working reference. Some pieces are short and tactical,
                    others are longer frameworks, but they all aim to make brand, strategy, and digital decisions easier
                    to evaluate before teams commit time, budget, or attention in the wrong direction.
                  </p>
                ) : null}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center" }}>
                <a
                  href="/journal"
                  className="atla-link"
                  style={{
                    ...LABEL,
                    color: "#d8d1c6",
                    textDecoration: "none",
                    borderBottom: activeCategory ? "1px solid transparent" : "1px solid #d8d1c6",
                    padding: "14px 4px",
                    minHeight: 52,
                    display: "inline-flex",
                    alignItems: "center",
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
                        color: "#d3cabd",
                        textDecoration: "none",
                        borderBottom: isActive ? "1px solid #d8d1c6" : "1px solid transparent",
                        padding: "14px 4px",
                        minHeight: 52,
                        display: "inline-flex",
                        alignItems: "center",
                        opacity: isActive ? 1 : 0.88,
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
                    <p style={{ ...LABEL, color: "#d8d1c6" }}>{article.category}</p>
                    <p style={{ ...BODY, color: "#e2dbd1" }}>{article.title}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <p style={{ ...BODY, color: "#d8d1c6" }}>{article.date.toUpperCase()}</p>
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
          {activeCategory ? (
            <div style={{ gridColumn: isMobile ? "auto" : "1 / span 3", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
              <p style={{ ...BODY, color: MUTED_TEXT, lineHeight: "1.55", maxWidth: 640 }}>
                Category pages are designed to be useful on their own, not just as filters. Each one brings together essays that solve a related problem, whether that is repositioning a company, planning a rebrand, structuring a launch, or improving how a website communicates value.
              </p>
              <p style={{ ...BODY, color: MUTED_TEXT, lineHeight: "1.55", maxWidth: 640 }}>
                If you are comparing articles, start with the most practical piece first and then move into the longer framework essays. That usually gives enough context to understand not just what to change, but why the change matters operationally.
              </p>
            </div>
          ) : null}
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
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    width={getImageDimensions(article.coverImage)?.width}
                    height={getImageDimensions(article.coverImage)?.height}
                    loading="lazy"
                    decoding="async"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : null}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <p style={{ ...LABEL, color: MUTED_TEXT }}>{article.category}</p>
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
                <p style={{ ...BODY, color: MUTED_TEXT, maxWidth: 304 }}>{article.excerpt}</p>
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
