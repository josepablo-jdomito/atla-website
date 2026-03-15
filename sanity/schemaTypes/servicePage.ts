import { defineArrayMember, defineField, defineType } from "sanity";

const SERVICE_VERTICAL_OPTIONS = [
  { title: "Hospitality", value: "Hospitality" },
  { title: "Consumer", value: "Consumer" },
  { title: "Tech", value: "Tech" },
  { title: "Premium", value: "Premium" },
  { title: "Social Impact", value: "Social Impact" },
];

export const servicePageType = defineType({
  name: "servicePage",
  title: "Service Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "vertical",
      title: "Vertical",
      type: "string",
      group: "content",
      options: {
        list: SERVICE_VERTICAL_OPTIONS,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "content",
      initialValue: "draft",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Published", value: "published" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      group: "content",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
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
      ],
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
    defineField({
      name: "primaryKeyword",
      title: "Primary keyword",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "ctaText",
      title: "CTA text",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "ctaLink",
      title: "CTA link",
      type: "string",
      group: "content",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "vertical",
    },
  },
});
