import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { trackEvent, useScrollDepthTracking } from "@/hooks/use-analytics";
import { JournalPortableText } from "@/components/journal/JournalPortableText";
import { PageShell } from "@/components/site/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import NotFound from "@/pages/not-found";
import { fetchJournalArticle, fetchJournalArticles } from "@/lib/journalApi";
import { articleBodyText, articleDescription, buildArticleBreadcrumb, buildBlogPostingSchema } from "@/lib/journalSeo";
import { formatJournalMetaTitle } from "@/lib/seoSchema";
import { getImageDimensions } from "@shared/imageDelivery";
import { DEFAULT_OG_IMAGE_URL } from "@shared/siteSeo";

export default function AtlaArticle() {
  const [, params] = useRoute("/journal/:slug");
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

  const otherNews = articles
    .filter((item) => item.slug !== article.slug)
    .sort((left, right) => {
      const leftScore =
        Number(left.categorySlug === article.categorySlug) * 3 +
        Number(left.category === article.category) * 2;
      const rightScore =
        Number(right.categorySlug === article.categorySlug) * 3 +
        Number(right.category === article.category) * 2;
      return rightScore - leftScore;
    })
    .slice(0, 3);
  const articleText = articleBodyText(article);
  const description = articleDescription(article);
  const canonicalPath = `/journal/${article.slug}`;
  const robots = articleText.length >= 280 ? "index,follow" : "noindex,follow";
  const fallbackBodyImage =
    article.body.find((block) => block._type === "image" && typeof block.asset?.url === "string")?.asset?.url ||
    article.bodySections.find((section) => Boolean(section.image))?.image ||
    article.bodySections.find((section) => Boolean(section.wideImage))?.wideImage ||
    DEFAULT_OG_IMAGE_URL;
  const articleImage = article.coverImage || article.heroImage || fallbackBodyImage;
  const hasPortableTextBody = article.body.length > 0;
  const hasLegacyBody = article.introParagraphs.length > 0 || article.bodySections.some(
    (section) => section.paragraphs.length > 0 || Boolean(section.image) || Boolean(section.wideImage),
  );

  const articleSchema = buildBlogPostingSchema(article, {
    description,
    image: articleImage || undefined,
    articleBody: articleText || description,
  });
  const breadcrumbSchema = buildArticleBreadcrumb(article);

  return (
    <PageShell>
      <SeoHead
        title={formatJournalMetaTitle(article.seoTitle || article.title)}
        description={description}
        pathname={canonicalPath}
        image={articleImage || undefined}
        type="article"
        robots={robots}
        structuredData={[articleSchema, breadcrumbSchema]}
      />
      <article className="site-page-body article">
        <header className="page-intro article-intro">
          <p className="home-section-label">
            {article.category} · {article.date.toUpperCase()}
          </p>
          <h1 className="page-intro__title">{article.title}</h1>
        </header>

        {articleImage ? (
          <div className="article-hero">
            <img
              src={articleImage}
              alt={article.title}
              width={getImageDimensions(articleImage)?.width}
              height={getImageDimensions(articleImage)?.height}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        ) : null}

        <div className="article-body longform-prose">
          {hasPortableTextBody ? (
            <JournalPortableText value={article.body} />
          ) : (
            <>
              {article.introParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              {article.bodySections.map((section, index) => (
                <div key={`${article.slug}-${index}`} className="article-section">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.image && (
                    <img
                      className="article-figure"
                      src={section.image}
                      alt={`${article.title} editorial image ${index + 1}`}
                      width={getImageDimensions(section.image)?.width}
                      height={getImageDimensions(section.image)?.height}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  {section.wideImage && (
                    <img
                      className="article-figure"
                      src={section.wideImage}
                      alt={`${article.title} wide editorial image ${index + 1}`}
                      width={getImageDimensions(section.wideImage)?.width}
                      height={getImageDimensions(section.wideImage)?.height}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
              ))}
            </>
          )}

          {!hasPortableTextBody && !hasLegacyBody ? null : (
            <dl className="article-credits">
              <div>
                <dt className="home-section-label">Source:</dt>
                <dd>{article.sourceName || "Atla Journal"}</dd>
              </div>
              <div>
                <dt className="home-section-label">Author:</dt>
                <dd>{article.authorName || "Atla"}</dd>
              </div>
            </dl>
          )}
        </div>

        <section className="page-section article-more" aria-labelledby="article-more">
          <h2 id="article-more" className="home-section-label">
            Other news
          </h2>
          <div className="page-section__body">
            <p className="longform-text">
              Keep reading through related journal pieces, or jump into the broader archive to see how strategy,
              identity, digital craft, and category-specific thinking connect across the studio&apos;s writing.
            </p>
            <div className="journal-grid journal-grid--related">
              {otherNews.map((item) => (
                <a
                  key={item.slug}
                  href={`/journal/${item.slug}`}
                  className="journal-card"
                  onClick={() =>
                    trackEvent("journal_cta_click", {
                      page: canonicalPath,
                      article_slug: item.slug,
                      article_category: item.category,
                      cta_type: "related_article",
                    })}
                >
                  <div className="journal-card__media">
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        width={getImageDimensions(item.coverImage)?.width}
                        height={getImageDimensions(item.coverImage)?.height}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                  </div>
                  <div className="journal-card__text">
                    <p className="home-section-label">{item.category}</p>
                    <h3 className="journal-card__title">{item.title}</h3>
                    <p className="journal-card__excerpt">{item.excerpt}</p>
                    <p className="journal-card__date">{item.date}</p>
                  </div>
                </a>
              ))}
            </div>
            <div className="longform-actions">
              {article.categorySlug ? (
                <a href={`/journal/category/${article.categorySlug}`} className="longform-link longform-link--action">
                  More in {article.category}
                </a>
              ) : null}
              <a href="/journal" className="longform-link longform-link--action">
                Browse all journal articles
              </a>
            </div>
          </div>
        </section>
      </article>
    </PageShell>
  );
}
