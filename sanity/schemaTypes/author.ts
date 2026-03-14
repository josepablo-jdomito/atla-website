import { defineArrayMember, defineField, defineType } from "sanity";

export const authorType = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "jobTitle",
      title: "Job title",
      type: "string",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "sameAs",
      title: "Profile links",
      type: "array",
      of: [defineArrayMember({ type: "socialLink" })],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "jobTitle",
      media: "image",
    },
  },
});
