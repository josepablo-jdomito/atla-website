import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homepageConfig',
  title: 'Homepage Configuration',
  type: 'document',
  fields: [
    defineField({
      name: 'featuredPost',
      title: 'Featured Post',
      type: 'reference',
      to: [{ type: 'post' }],
      options: { filter: 'status == "published"' },
    }),
    defineField({
      name: 'editorsPicks',
      title: "Editor's Picks",
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'post' }],
          options: { filter: 'status == "published"' },
        },
      ],
      validation: (Rule) => Rule.max(6).unique(),
    }),
    defineField({
      name: 'inFeedCardFrequency',
      title: 'In-Feed CTA Frequency',
      description: 'Insert a CTA card every N posts',
      type: 'number',
      initialValue: 12,
      validation: (Rule) => Rule.required().min(4).max(50).integer(),
    }),
    defineField({
      name: 'newsletterBlockCopy',
      title: 'Newsletter Block Copy',
      type: 'text',
      rows: 3,
      initialValue: 'The best work we publish. Once a week. No noise.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Homepage Configuration' }
    },
  },
})
