import { readFile } from "fs/promises";
import path from "path";
import { createClient } from "@sanity/client";
import { journalArticles } from "../client/src/data/atlaContent.ts";

type SeedEnv = {
  SANITY_JOURNAL_PROJECT_ID: string;
  SANITY_JOURNAL_DATASET: string;
  SANITY_JOURNAL_API_VERSION: string;
  SANITY_JOURNAL_READ_TOKEN: string;
};

function parseDotenv(content: string) {
  const env: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex);
    const rawValue = trimmed.slice(eqIndex + 1).trim();
    env[key] = rawValue.replace(/^"/, "").replace(/"$/, "");
  }
  return env;
}

async function loadEnv(): Promise<SeedEnv> {
  const envFile = path.resolve(".env.vercel.local");
  const file = await readFile(envFile, "utf8");
  const env = parseDotenv(file);

  if (!env.SANITY_JOURNAL_PROJECT_ID || !env.SANITY_JOURNAL_DATASET || !env.SANITY_JOURNAL_READ_TOKEN) {
    throw new Error("Missing Sanity env vars in .env.vercel.local");
  }

  return {
    SANITY_JOURNAL_PROJECT_ID: env.SANITY_JOURNAL_PROJECT_ID,
    SANITY_JOURNAL_DATASET: env.SANITY_JOURNAL_DATASET,
    SANITY_JOURNAL_API_VERSION: env.SANITY_JOURNAL_API_VERSION || "2026-03-12",
    SANITY_JOURNAL_READ_TOKEN: env.SANITY_JOURNAL_READ_TOKEN,
  };
}

async function fetchImageBuffer(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${url}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function uploadImage(client: ReturnType<typeof createClient>, url: string, filename: string) {
  const imageBuffer = await fetchImageBuffer(url);
  return client.assets.upload("image", imageBuffer, {
    filename,
  });
}

function publishedAtFromDateLabel(dateLabel: string) {
  const [month, year] = dateLabel.split(" ");
  const months: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  const monthNumber = months[month] || "01";
  return `${year}-${monthNumber}-01T12:00:00.000Z`;
}

async function main() {
  const env = await loadEnv();

  const client = createClient({
    projectId: env.SANITY_JOURNAL_PROJECT_ID,
    dataset: env.SANITY_JOURNAL_DATASET,
    apiVersion: env.SANITY_JOURNAL_API_VERSION,
    token: env.SANITY_JOURNAL_READ_TOKEN,
    useCdn: false,
  });

  const authorId = "author-atla-editorial";
  const categoryIds = new Map<string, string>();

  await client.createOrReplace({
    _id: authorId,
    _type: "author",
    name: "Atla Editorial",
    slug: { _type: "slug", current: "atla-editorial" },
    jobTitle: "Editorial Team",
    bio: "Editorial notes, essays, and reflections from the Atla studio.",
  });

  for (const article of journalArticles) {
    if (!categoryIds.has(article.category)) {
      const categoryId = `category-${article.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      categoryIds.set(article.category, categoryId);
      await client.createOrReplace({
        _id: categoryId,
        _type: "category",
        title: article.category,
        slug: { _type: "slug", current: article.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
        description: `${article.category} articles from Atla Journal.`,
      });
    }
  }

  for (const article of journalArticles) {
    const coverAsset = await uploadImage(client, article.coverImage, `${article.slug}-cover.jpg`);
    const heroAsset = article.heroImage === article.coverImage
      ? coverAsset
      : await uploadImage(client, article.heroImage, `${article.slug}-hero.jpg`);

    const bodySections = await Promise.all(
      article.bodySections.map(async (section, index) => {
        const imageAsset = section.image
          ? await uploadImage(client, section.image, `${article.slug}-image-${index}.jpg`)
          : null;
        const wideImageAsset = section.wideImage
          ? await uploadImage(client, section.wideImage, `${article.slug}-wide-${index}.jpg`)
          : null;

        return {
          _type: "object",
          paragraphs: section.paragraphs,
          ...(imageAsset
            ? {
                image: {
                  _type: "image",
                  asset: {
                    _type: "reference",
                    _ref: imageAsset._id,
                  },
                },
              }
            : {}),
          ...(wideImageAsset
            ? {
                wideImage: {
                  _type: "image",
                  asset: {
                    _type: "reference",
                    _ref: wideImageAsset._id,
                  },
                },
              }
            : {}),
        };
      }),
    );

    await client.createOrReplace({
      _id: `journal-${article.slug}`,
      _type: "journalArticle",
      title: article.title,
      slug: { _type: "slug", current: article.slug },
      primaryCategory: {
        _type: "reference",
        _ref: categoryIds.get(article.category),
      },
      tags: [article.category],
      publishedAt: article.publishedAt || publishedAtFromDateLabel(article.date),
      updatedAt: article.publishedAt || publishedAtFromDateLabel(article.date),
      excerpt: article.excerpt,
      heroImage: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: heroAsset._id,
        },
      },
      coverImage: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: coverAsset._id,
        },
      },
      introParagraphs: article.introParagraphs,
      bodySections,
      author: {
        _type: "reference",
        _ref: authorId,
      },
      sourceName: article.sourceName || "Atla Journal",
      seo: {
        _type: "seo",
        title: article.seoTitle || article.title,
        description: article.seoDescription || article.excerpt,
        noindex: false,
      },
    });
  }

  console.log(`Seeded ${journalArticles.length} journal articles to Sanity.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
