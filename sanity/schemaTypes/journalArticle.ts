import { defineArrayMember, defineField, defineType } from "sanity";

export const journalArticleType = defineType({
  name: "journalArticle",
  title: "Journal Article",
  type: "document",
  groups: [
    { name: "editorial", title: "Editorial", default: true },
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
      name: "category",
      title: "Category",
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
      description: "The article appears on the site when this date is set and is not in the future.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated at",
      type: "datetime",
      group: "editorial",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "editorial",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Published", value: "published" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
      description: "Editorial flag. Site visibility is still controlled by the published date.",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      group: "editorial",
      rows: 3,
      description: "Used on journal cards and as the default meta description.",
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      group: "editorial",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Blockquote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (rule) =>
                      rule.required().uri({
                        allowRelative: true,
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  }),
                  defineField({
                    name: "blank",
                    title: "Open in new tab",
                    type: "boolean",
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
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
      name: "noIndex",
      title: "No index",
      type: "boolean",
      group: "seo",
      initialValue: false,
      description: "Exclude this article from indexable journal listings and sitemap generation.",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      group: "seo",
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category.title",
    },
  },
});
