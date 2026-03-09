import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'savedProject',
  title: 'Saved Project',
  type: 'document',
  fields: [
    defineField({
      name: 'user_id',
      title: 'User ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'project_id',
      title: 'Project ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'created_at',
      title: 'Created At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'project_id',
      subtitle: 'user_id',
    },
  },
})
