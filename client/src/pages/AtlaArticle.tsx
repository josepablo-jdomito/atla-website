import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { AtlaNav } from "@/components/atla/AtlaNav";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { SeoHead } from "@/components/seo/SeoHead";
import { journalArticles } from "@/data/atlaContent";
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
  const slug = params?.slug ?? journalArticles[0].slug;
  const { data: articleData } = useQuery({
    queryKey: ["/api/journal", slug],
    queryFn: () => fetchJournalArticle(slug),
  });
  const { data: articlesData } = useQuery({
    queryKey: ["/api/journal"],
    queryFn: fetchJournalArticles,
  });
  const articles = useMemo(
    () => (articlesData && articlesData.length > 0 ? articlesData : journalArticles),
    [articlesData],
  );
  const article = useMemo(
    () => articleData ?? articles.find((item) => item.slug === slug) ?? articles[0],
    [articleData, articles, slug],
  );

  const otherNews = articles.filter((item) => item.slug !== article.slug).slice(0, 2);
  const articleText = articleBodyText(article);
  const description = articleDescription(article);
  const canonicalPath = `/journal/${article.slug}`;
  const robots = articleText.length >= 280 ? "index,follow" : "noindex,follow";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description,
    image: [article.coverImage],
    articleSection: article.category,
    datePublished: articlePublishedIso(article.date),
    author: {
      "@type": "Organization",
      name: "Atla",
    },
    publisher: {
      "@type": "Organization",
      name: "Atla",
    },
    mainEntityOfPage: `https://atla-website.vercel.app${canonicalPath}`,
    articleBody: articleText || description,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Journal",
        item: "https://atla-website.vercel.app/journal",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: article.title,
        item: `https://atla-website.vercel.app${canonicalPath}`,
      },
    ],
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa" }}>
      <SeoHead
        title={article.seoTitle || article.title}
        description={description}
        pathname={canonicalPath}
        image={article.coverImage}
        type="article"
        robots={robots}
        structuredData={[articleSchema, breadcrumbSchema]}
      />
      <div style={{ width: "100%", position: "relative" }}>
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
              <div style={{ width: "100%", aspectRatio: "370 / 400", overflow: "hidden" }}>
                <img src={article.coverImage} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
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
            {!isMobile && <div style={{ height: 450 }} />}
            {article.introParagraphs.length > 0 && (
              <div style={{ maxWidth: 460, display: "flex", flexDirection: "column", gap: 20 }}>
                {article.introParagraphs.map((paragraph) => (
                  <p key={paragraph} style={BODY}>
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {article.bodySections.map((section, index) => (
              <div key={`${article.slug}-${index}`} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {section.paragraphs.length > 0 && (
                  <div style={{ maxWidth: 460, display: "flex", flexDirection: "column", gap: 20, padding: section.image || section.wideImage ? "0 0 20px" : 0 }}>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} style={BODY}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
                {section.image && (
                  <div style={{ width: isMobile ? "100%" : 460, minHeight: 400 }}>
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

            <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 40, maxWidth: 460 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                <p style={LABEL}>Source:</p>
                <p style={BODY}>{article.sourceName || "Atla Journal"}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                <p style={LABEL}>Author:</p>
                <p style={BODY}>{article.authorName || "Atla"}</p>
              </div>
            </div>
          </div>

          {!isMobile && (
          <div style={{ position: "sticky", top: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ width: "100%", aspectRatio: "575 / 400", overflow: "hidden" }}>
              <img src={article.coverImage} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ paddingTop: 20, display: "flex", flexDirection: "column", gap: 4 }}>
              <h1
                style={{
                  fontFamily: "'ABC Synt Variable Unlicensed Trial', Helvetica, sans-serif",
                  fontSize: isMobile ? 44 : 64,
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
                  <a key={item.slug} href={`/journal/${item.slug}`} className="atla-card" style={{ textDecoration: "none", color: "#222", display: "flex", flexDirection: "column", gap: 20 }}>
                    <div style={{ width: "100%", aspectRatio: "282.5 / 246.54", overflow: "hidden" }}>
                      <img src={item.coverImage} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
      </div>

      <AtlaFooter />
    </div>
  );
}
