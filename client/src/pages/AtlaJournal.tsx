import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AtlaNav } from "@/components/atla/AtlaNav";
import { AtlaFooter } from "@/components/atla/AtlaFooter";
import { SeoHead } from "@/components/seo/SeoHead";
import { journalArticles } from "@/data/atlaContent";
import { fetchJournalArticles } from "@/lib/journalApi";
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

export default function AtlaJournal() {
  const isMobile = useIsMobile();
  const { data } = useQuery({
    queryKey: ["/api/journal"],
    queryFn: fetchJournalArticles,
  });
  const articles = useMemo(
    () => (data && data.length > 0 ? data : journalArticles),
    [data],
  );
  const featured = articles.slice(0, 3);
  const cards = articles.slice(0, 6);
  const heroArticle = articles[0];
  const pageDescription =
    "Atla Journal publishes essays, studio notes, and articles on branding, digital craft, motion, and visual storytelling.";
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Atla Journal",
    description: pageDescription,
    url: "https://atla-website.vercel.app/journal",
    publisher: {
      "@type": "Organization",
      name: "Atla",
    },
    blogPost: cards.map((article) => ({
      "@type": "BlogPosting",
      headline: article.title,
      url: `https://atla-website.vercel.app/journal/${article.slug}`,
      image: article.coverImage,
      description: articleDescription(article),
      datePublished: articlePublishedIso(article.date),
      articleSection: article.category,
    })),
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", backgroundColor: "#fafafa" }}>
      <SeoHead
        title="Journal"
        description={pageDescription}
        pathname="/journal"
        image={articles[0]?.coverImage}
        structuredData={collectionSchema}
      />
      <div style={{ width: "100%", position: "relative" }}>
        <div style={{ position: "relative", minHeight: 750, backgroundColor: "#222", overflow: "hidden" }}>
          <img
            src={heroArticle?.heroImage || heroArticle?.coverImage}
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.64 }}
          />
          <AtlaNav inverted />

          <div className="atla-enter" style={{ padding: isMobile ? "80px 10px 40px" : "100px 20px 20px", minHeight: 750, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
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
              We document ideas in motion — from digital craft to visual storytelling. Here you’ll find essays, process notes, and studio reflections.
            </h1>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))", gap: 20 }}>
              {(isMobile ? featured.slice(0, 1) : featured).map((article) => (
                <a key={article.slug} href={`/journal/${article.slug}`} className="atla-card" style={{ color: "#fafafa", textDecoration: "none", display: "flex", flexDirection: "column", gap: 32 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <p style={{ ...BODY, color: "#fafafa" }}>{article.title}</p>
                    <p style={{ ...BODY, color: "#fafafa" }}>{article.category}</p>
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

        <div style={{ padding: isMobile ? "100px 10px" : "200px 20px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))", gap: isMobile ? 64 : 20, rowGap: isMobile ? 64 : 80 }}>
          {cards.map((article) => (
            <a key={article.slug} href={`/journal/${article.slug}`} className="atla-card" style={{ textDecoration: "none", color: "#222", display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ width: "100%", aspectRatio: "380 / 331.63", overflow: "hidden" }}>
                <img src={article.coverImage} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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
                  {article.title}
                </h2>
                <p style={{ ...BODY, color: "#8e8e8e", maxWidth: 304 }}>{article.excerpt}</p>
                <p style={{ ...BODY, paddingTop: 10 }}>{article.date}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <AtlaFooter />
    </div>
  );
}
