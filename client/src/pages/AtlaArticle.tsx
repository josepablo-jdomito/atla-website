import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { trackEvent, useScrollDepthTracking } from "@/hooks/use-analytics";
import { JournalPortableText } from "@/components/journal/JournalPortableText";
import { PageError, PageShell, PageSkeleton } from "@/components/site/PageShell";
import { SeoHead } from "@/components/seo/SeoHead";
import NotFound from "@/pages/not-found";
import { fetchJournalArticle, fetchJournalArticles } from "@/lib/journalApi";
import { articleBodyText, articleDescription, buildArticleBreadcrumb, buildBlogPostingSchema } from "@/lib/journalSeo";
import { formatJournalMetaTitle } from "@/lib/seoSchema";
import { getImageDimensions } from "@shared/imageDelivery";
import { ownCovers } from "@/lib/journalCovers";
import { DEFAULT_OG_IMAGE_URL } from "@shared/siteSeo";

export default function AtlaArticle() {
  const [, params] = useRoute("/journal/:slug");
  const slug = params?.slug ?? "";
  const {
    data: articleData,
    isPending: isArticlePending,
    isError: articleFailed,
    refetch: refetchArticle,
  } = useQuery({
    queryKey: ["/api/journal", slug],
    queryFn: () => fetchJournalArticle(slug),
  });
  const {
    data: articlesData,
    isPending: areArticlesPending,
    isError: articlesFailed,
    refetch: refetchArticles,
  } = useQuery({
    queryKey: ["/api/journal"],
    queryFn: fetchJournalArticles,
  });
  const articles = useMemo(() => articlesData ?? [], [articlesData]);
  // Only a cover no other article shares is shown (see journalCovers.ts).
  const covers = useMemo(() => ownCovers(articles), [articles]);
  const article = useMemo(
    () => articleData ?? articles.find((item) => item.slug === slug) ?? null,
    [articleData, articles, slug],
  );
  useScrollDepthTracking(article?.slug ?? "", article?.category, "journal_article");

  // Loading keeps the header and footer (states report 6).
  if (!slug || (!article && (isArticlePending || areArticlesPending))) {
    return (
      <PageShell>
        <PageSkeleton rows={1} />
      </PageShell>
    );
  }

  // A failure to load says so, with Try again, instead of "page not found" (a missing slug comes back
  // as null from fetchJournalArticle, not as an error).
  if (!article && (articlesFailed || articleFailed)) {
    return (
      <PageShell>
        <PageError
          onRetry={() => {
            void refetchArticle();
            void refetchArticles();
          }}
        />
      </PageShell>
    );
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
  // A cover shared with other articles is the placeholder, not this article's picture (journalCovers.ts).
  const articleImage = covers.get(article.slug) || fallbackBodyImage;
  const showHero = articleImage !== DEFAULT_OG_IMAGE_URL;
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
          <p className="site-label">
            {article.category} · {article.date}
          </p>
          <h1 className="page-intro__title">{article.title}</h1>
        </header>

        {showHero ? (
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
                <dt className="site-label">Source:</dt>
                <dd>{article.sourceName || "Atla Journal"}</dd>
              </div>
              <div>
                <dt className="site-label">Author:</dt>
                <dd>{article.authorName || "Atla"}</dd>
              </div>
            </dl>
          )}
        </div>

        <section className="page-section article-more" aria-labelledby="article-more">
          <h2 id="article-more" className="site-section-title">
            More from the journal
          </h2>
          <div className="page-section__body">
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
                  {covers.has(item.slug) ? (
                    <div className="journal-card__media">
                      <img
                        src={covers.get(item.slug)}
                        alt={item.title}
                        width={getImageDimensions(covers.get(item.slug)!)?.width}
                        height={getImageDimensions(covers.get(item.slug)!)?.height}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ) : null}
                  <div className="journal-card__text">
                    <p className="site-label">{item.category}</p>
                    <h3 className="site-item-title journal-card__title">{item.title}</h3>
                    <p className="journal-card__excerpt">{item.excerpt}</p>
                    <p className="journal-card__date">{item.date}</p>
                  </div>
                </a>
              ))}
            </div>
            <div className="longform-actions">
              {article.categorySlug ? (
                <a href={`/journal/category/${article.categorySlug}`} className="site-action">
                  More in {article.category}
                </a>
              ) : null}
              <a href="/journal" className="site-text-button">
                Browse all journal articles
              </a>
            </div>
          </div>
        </section>
      </article>
    </PageShell>
  );
}
