import { defineType, defineField, defineArrayMember } from 'sanity'

const RESERVED_SLUGS = [
  'submit', 'advertise', 'newsletter', 'categories', 'category',
  'search', 'about', 'contact', 'privacy', 'terms', 'brand',
  'robots.txt', 'sitemap.xml', 'rss.xml', 'studio', 'api',
  'popular', 'editors-picks', 'submission-guidelines', 'media-kit',
  'brands', 'designer', 'directory', 'jobs', 'awards', 'login', 'projects',
  'signup', 'admin', 'dashboard', 'settings', 'profile', 'rss',
]

const SLUG_FORMAT_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export default defineType({
  name: 'post',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          if (!slug?.current) return 'Slug is required'
          if (RESERVED_SLUGS.includes(slug.current)) {
            return `"${slug.current}" is a reserved route. Choose a different slug.`
          }
          if (slug.current.includes('/')) {
            return 'Slug cannot contain slashes.'
          }
          if (!SLUG_FORMAT_REGEX.test(slug.current)) {
            return 'Slug must be lowercase with hyphens only (e.g. "brand-identity-redesign"). No uppercase, spaces, or special characters.'
          }
          if (slug.current.length < 3) {
            return 'Slug must be at least 3 characters.'
          }
          return true
        }),
    }),
    defineField({
      name: 'excerpt',
      title: 'Description',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required().max(2000),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Additional Categories',
      description: 'Optional extra categories for discovery and SEO pages.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'reference',
      to: [{ type: 'brand' }],
      description: 'The brand this post features. Creates a link to the brand profile.',
    }),
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      description: 'Optional explicit brand name for project cards/search when no brand reference is linked.',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'studio',
      title: 'Studio',
      type: 'string',
      description: 'Primary studio name for submissions and search.',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'designerCredits',
      title: 'Designers',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      validation: (Rule) => Rule.max(30).unique(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'topic',
      title: 'Topic',
      type: 'string',
      description: 'Primary topic used for related content matching.',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'series',
      title: 'Series',
      type: 'string',
      description: 'Optional editorial series name for grouping related projects.',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
          ],
        }),
      ],
      validation: (Rule) => Rule.max(30),
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Role',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'role' },
          },
        }),
      ],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Submitted', value: 'submitted' },
          { title: 'Review', value: 'review' },
          { title: 'Approved', value: 'approved' },
          { title: 'Published', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) =>
        Rule.required().custom((publishedAt, context) => {
          const status = (context.document as any)?.status
          if (status === 'published' && !publishedAt) {
            return 'A publish date is required for this status.'
          }
          return true
        }),
    }),
    defineField({
      name: 'saveCount',
      title: 'Save Count',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: 'viewCount',
      title: 'View Count',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: 'isFeaturedProject',
      title: 'Featured Project',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'post' }] }],
      validation: (Rule) => Rule.unique().max(8),
    }),
    defineField({
      name: 'isEditorsPick',
      title: "Editor's Pick",
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isSponsored',
      title: 'Sponsored Content',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'sponsorshipType',
      title: 'Sponsorship Type',
      type: 'string',
      hidden: ({ document }) => !document?.isSponsored,
      options: {
        list: [
          { title: 'Sponsored By', value: 'sponsoredBy' },
          { title: 'Partner Content', value: 'partnerContent' },
        ],
        layout: 'radio',
      },
      initialValue: 'sponsoredBy',
    }),
    defineField({
      name: 'sponsorName',
      title: 'Sponsor Name',
      type: 'string',
      hidden: ({ document }) => !document?.isSponsored,
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'sponsorLabel',
      title: 'Sponsor Label',
      type: 'string',
      hidden: ({ document }) => !document?.isSponsored,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          validation: (Rule) => Rule.max(70),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: 'ogImage',
          title: 'OG Image',
          type: 'image',
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Publish Date (Newest)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'status',
      media: 'coverImage',
    },
  },
})
