import { defineArrayMember, defineField, defineType } from "sanity";

export const journalArticleType = defineType({
  name: "journalArticle",
  title: "Journal Article",
  type: "document",
  groups: [
    { name: "editorial", title: "Editorial", default: true },
    { name: "media", title: "Media" },
    { name: "seo", title: "SEO" },
    { name: "relationships", title: "Relationships" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "editorial",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "editorial",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "primaryCategory",
      title: "Primary category",
      type: "reference",
      group: "relationships",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "relationships",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "editorial",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated at",
      type: "datetime",
      group: "editorial",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      group: "editorial",
      rows: 3,
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introParagraphs",
      title: "Intro paragraphs",
      type: "array",
      group: "editorial",
      of: [defineArrayMember({ type: "text", rows: 4 })],
    }),
    defineField({
      name: "bodySections",
      title: "Body sections",
      type: "array",
      group: "editorial",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "paragraphs",
              title: "Paragraphs",
              type: "array",
              of: [defineArrayMember({ type: "text", rows: 4 })],
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "wideImage",
              title: "Wide image",
              type: "image",
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: {
              title: "paragraphs.0",
              media: "image",
            },
            prepare({ title, media }) {
              return {
                title: title || "Body section",
                media,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      group: "relationships",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "sourceName",
      title: "Source name",
      type: "string",
      group: "relationships",
    }),
    defineField({
      name: "relatedArticles",
      title: "Related articles",
      type: "array",
      group: "relationships",
      of: [defineArrayMember({ type: "reference", to: [{ type: "journalArticle" }] })],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "primaryCategory.title",
      media: "coverImage",
    },
  },
});
