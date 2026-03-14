import { defineField, defineType } from "sanity";

export const seoType = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "SEO title",
      type: "string",
      validation: (rule) => rule.max(70).warning("Keep SEO titles under roughly 60-65 characters."),
    }),
    defineField({
      name: "description",
      title: "SEO description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(160).warning("Keep meta descriptions under roughly 155-160 characters."),
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL override",
      type: "url",
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph image override",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "noindex",
      title: "Noindex",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
