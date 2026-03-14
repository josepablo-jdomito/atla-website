import { defineArrayMember, defineField, defineType } from "sanity";

export const seoSettingsType = defineType({
  name: "seoSettings",
  title: "SEO Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteUrl",
      title: "Site URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "defaultTitle",
      title: "Default title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleTemplate",
      title: "Title template",
      type: "string",
      description: "Example: %s | Atla",
    }),
    defineField({
      name: "defaultDescription",
      title: "Default description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "defaultOgImage",
      title: "Default Open Graph image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "organizationName",
      title: "Organization name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "organizationLogo",
      title: "Organization logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
    }),
    defineField({
      name: "twitterHandle",
      title: "Twitter/X handle",
      type: "string",
    }),
    defineField({
      name: "socialProfiles",
      title: "Social profiles",
      type: "array",
      of: [defineArrayMember({ type: "socialLink" })],
    }),
    defineField({
      name: "robotsDefault",
      title: "Default robots directive",
      type: "string",
      initialValue: "index,follow",
    }),
  ],
  preview: {
    select: {
      title: "defaultTitle",
      subtitle: "siteUrl",
    },
  },
});
