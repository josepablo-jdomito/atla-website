import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ORGANIZATION_LOGO_URL,
  ORGANIZATION_NAME,
  SITE_ORIGIN,
} from "@shared/siteSeo";
import { useRoute } from "wouter";
import { trackEvent, useScrollDepthTracking } from "@/hooks/use-analytics";
import { JournalPortableText } from "@/components/journal/JournalPortableText";
import { AtlaNav } from "@/components/atla/AtlaNav";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { SeoHead } from "@/components/seo/SeoHead";
import NotFound from "@/pages/not-found";
import { fetchJournalArticle, fetchJournalArticles } from "@/lib/journalApi";
import { articleBodyText, articleDescription, articlePublishedIso } from "@/lib/journalSeo";
import { useIsMobile } from "@/hooks/use-mobile";

const BODY: React.CSSProperties = {
  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: 0.28,
  lineHeight: "1.1",
  color: "#222",
  margin: 0,
};

const LABEL: React.CSSProperties = {
  ...BODY,
  color: "#8e8e8e",
};

export default function AtlaArticle() {
  const [, params] = useRoute("/journal/:slug");
  const isMobile = useIsMobile();
  const slug = params?.slug ?? "";
  const { data: articleData, isPending: isArticlePending } = useQuery({
    queryKey: ["/api/journal", slug],
    queryFn: () => fetchJournalArticle(slug),
  });
  const { data: articlesData, isPending: areArticlesPending } = useQuery({
    queryKey: ["/api/journal"],
    queryFn: fetchJournalArticles,
  });
  const articles = useMemo(() => articlesData ?? [], [articlesData]);
  const article = useMemo(
    () => articleData ?? articles.find((item) => item.slug === slug) ?? null,
    [articleData, articles, slug],
  );
  useScrollDepthTracking(article?.slug ?? "", article?.category, "journal_article");

  if (!slug || (!article && (isArticlePending || areArticlesPending))) {
    return null;
  }

  if (!article) {
    return <NotFound />;
  }

  const otherNews = articles.filter((item) => item.slug !== article.slug).slice(0, 2);
  const articleText = articleBodyText(article);
  const description = articleDescription(article);
  const canonicalPath = `/journal/${article.slug}`;
  const robots = articleText.length >= 280 ? "index,follow" : "noindex,follow";
  const articleImage = article.coverImage || article.heroImage || "";
  const hasPortableTextBody = article.body.length > 0;
  const hasLegacyBody = article.introParagraphs.length > 0 || article.bodySections.some(
    (section) => section.paragraphs.length > 0 || Boolean(section.image) || Boolean(section.wideImage),
  );

  const articleSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description,
    articleSection: article.category,
    datePublished: article.publishedAt || articlePublishedIso(article.date),
    author: {
      "@type": "Organization",
      name: article.authorName || ORGANIZATION_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
      logo: {
        "@type": "ImageObject",
        url: ORGANIZATION_LOGO_URL,
      },
    },
    mainEntityOfPage: `${SITE_ORIGIN}${canonicalPath}`,
    articleBody: articleText || description,
  };

  if (articleImage) {
    articleSchema.image = [articleImage];
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Journal",
        item: `${SITE_ORIGIN}/journal`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: article.title,
        item: `${SITE_ORIGIN}${canonicalPath}`,
      },
    ],
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa" }}>
      <SeoHead
        title={article.seoTitle || article.title}
        description={description}
        pathname={canonicalPath}
        image={articleImage || undefined}
        type="article"
        robots={robots}
        structuredData={[articleSchema, breadcrumbSchema]}
      />
      <div className="atla-dark-surface">
      <main style={{ width: "100%", position: "relative" }}>
        <AtlaNav />

        <section
          style={{
            padding: isMobile ? "60px 10px 0" : "60px 20px 0",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 10,
            alignItems: "start",
          }}
        >
          {isMobile && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {articleImage ? (
                <div style={{ width: "100%", aspectRatio: "370 / 400", overflow: "hidden", backgroundColor: "#efefef" }}>
                  <img src={articleImage} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ) : null}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <h1
                  style={{
                    fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
                    fontSize: 40,
                    fontWeight: 400,
                    lineHeight: "1.1",
                    color: "#222",
                    margin: 0,
                  }}
                >
                  {article.title}
                </h1>
                <p style={{ ...LABEL, fontSize: 12 }}>{article.category}</p>
                <p style={{ ...LABEL, fontSize: 12 }}>{article.date.toUpperCase()}</p>
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 40, minWidth: 0 }}>
            {!isMobile && articleImage ? <div style={{ height: 450 }} /> : null}

            {hasPortableTextBody ? (
              <JournalPortableText value={article.body} />
            ) : (
              <>
                {article.introParagraphs.length > 0 && (
                  <div style={{ maxWidth: 620, display: "flex", flexDirection: "column", gap: 20 }}>
                    {article.introParagraphs.map((paragraph) => (
                      <p key={paragraph} style={BODY}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

                {article.bodySections.map((section, index) => (
                  <div key={`${article.slug}-${index}`} style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 620 }}>
                    {section.paragraphs.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: section.image || section.wideImage ? "0 0 20px" : 0 }}>
                        {section.paragraphs.map((paragraph) => (
                          <p key={paragraph} style={BODY}>
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    )}
                    {section.image && (
                      <div style={{ width: "100%", minHeight: 400 }}>
                        <img src={section.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      </div>
                    )}
                    {section.wideImage && (
                      <div style={{ width: "100%", minHeight: 400 }}>
                        <img src={section.wideImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}

            {!hasPortableTextBody && !hasLegacyBody ? null : (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 40, maxWidth: 620 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                  <p style={LABEL}>Source:</p>
                  <p style={BODY}>{article.sourceName || "Atla Journal"}</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                  <p style={LABEL}>Author:</p>
                  <p style={BODY}>{article.authorName || "Atla"}</p>
                </div>
              </div>
            )}
          </div>

          {!isMobile && (
            <div style={{ position: "sticky", top: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {articleImage ? (
                <div style={{ width: "100%", aspectRatio: "575 / 400", overflow: "hidden", backgroundColor: "#efefef" }}>
                  <img src={articleImage} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ) : null}
              <div style={{ paddingTop: articleImage ? 20 : 0, display: "flex", flexDirection: "column", gap: 4 }}>
                <h1
                  style={{
                    fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
                    fontSize: 64,
                    fontWeight: 400,
                    lineHeight: "1.1",
                    color: "#222",
                    margin: 0,
                  }}
                >
                  {article.title}
                </h1>
                <p style={LABEL}>{article.category}</p>
                <p style={LABEL}>{article.date.toUpperCase()}</p>
              </div>
            </div>
          )}
        </section>

        <section style={{ padding: isMobile ? "100px 10px" : "200px 20px", minHeight: 500 }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
            <div />
            <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
              <p
                style={{
                  fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: 0.48,
                  lineHeight: "1.2",
                  textTransform: "uppercase",
                  color: "#222",
                  margin: 0,
                }}
              >
                Other news
              </p>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 64 : 10 }}>
                {otherNews.map((item) => (
                  <a
                    key={item.slug}
                    href={`/journal/${item.slug}`}
                    className="atla-card"
                    onClick={() =>
                      trackEvent("journal_cta_click", {
                        page: canonicalPath,
                        article_slug: item.slug,
                        article_category: item.category,
                        cta_type: "related_article",
                      })}
                    style={{ textDecoration: "none", color: "#222", display: "flex", flexDirection: "column", gap: 20 }}
                  >
                    <div style={{ width: "100%", aspectRatio: "282.5 / 246.54", overflow: "hidden", backgroundColor: "#efefef" }}>
                      {item.coverImage ? (
                        <img src={item.coverImage} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      ) : null}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <p style={{ ...LABEL, fontSize: 12 }}>{item.category}</p>
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
                        {item.title}
                      </h2>
                      <p style={{ ...LABEL, maxWidth: 226 }}>{item.excerpt}</p>
                      <p style={BODY}>{item.date}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      </div>
      <AtlaFooter />
    </div>
  );
}
