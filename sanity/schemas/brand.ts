import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'brand',
  title: 'Brand',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Brand Name',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'One-line description of the brand.',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'Editorial description. 2–4 sentences.',
      validation: (Rule) => Rule.max(600),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Square logo or mark. Used on profile and cards.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'Hero image for the brand profile page.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),

    // ── Metadata ──────────────────────────────
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
    defineField({
      name: 'headquarters',
      title: 'Headquarters',
      type: 'string',
      description: 'e.g. "New York, NY" or "London, UK"',
    }),
    defineField({
      name: 'founded',
      title: 'Founded',
      type: 'string',
      description: 'e.g. "2018" or "July 2018"',
    }),
    defineField({
      name: 'founders',
      title: 'Founders',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'industry',
      title: 'Industry',
      type: 'string',
      options: {
        list: [
          { title: 'Branding & Identity', value: 'branding' },
          { title: 'Hospitality', value: 'hospitality' },
          { title: 'CPG & Packaging', value: 'cpg' },
          { title: 'Wellness & Health', value: 'wellness' },
          { title: 'SaaS & Technology', value: 'saas' },
          { title: 'Fashion & Lifestyle', value: 'fashion' },
          { title: 'Beauty', value: 'beauty' },
          { title: 'Food & Beverage', value: 'food' },
          { title: 'Tech', value: 'tech' },
          { title: 'Architecture & Interiors', value: 'architecture' },
          { title: 'Media & Publishing', value: 'media' },
        ],
      },
    }),

    // ── Socials ───────────────────────────────
    defineField({
      name: 'socials',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
        defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
        defineField({ name: 'twitter', title: 'X / Twitter', type: 'url' }),
        defineField({ name: 'pinterest', title: 'Pinterest', type: 'url' }),
        defineField({ name: 'behance', title: 'Behance', type: 'url' }),
        defineField({ name: 'dribbble', title: 'Dribbble', type: 'url' }),
      ],
    }),

    // ── Categories ────────────────────────────
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),

    // ── Editorial ─────────────────────────────
    defineField({
      name: 'isFeatured',
      title: 'Featured Brand',
      type: 'boolean',
      initialValue: false,
      description: 'Show in featured sections.',
    }),
    defineField({
      name: 'spottedBy',
      title: 'Spotted By',
      type: 'string',
      description: 'Name of the person who submitted/curated this brand.',
    }),

    // ── SEO ───────────────────────────────────
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
      title: 'Name (A-Z)',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'tagline',
      media: 'logo',
    },
  },
})
