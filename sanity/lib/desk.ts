import type { StructureBuilder } from 'sanity/structure'
import { DocumentIcon, TagIcon, CogIcon, ComposeIcon, StarIcon } from '@sanity/icons'

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('welove Studio')
    .items([
      S.listItem()
        .title('Posts')
        .icon(ComposeIcon)
        .child(
          S.list()
            .title('Posts')
            .items([
              S.listItem()
                .title('All Posts')
                .child(
                  S.documentTypeList('post')
                    .title('All Posts')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('By Status')
                .child(
                  S.list()
                    .title('Posts by Status')
                    .items([
                      statusFilter(S, 'Drafts', 'draft'),
                      statusFilter(S, 'In Review', 'inReview'),
                      statusFilter(S, 'Scheduled', 'scheduled'),
                      statusFilter(S, 'Published', 'published'),
                    ])
                ),
              S.listItem()
                .title('By Category')
                .child(
                  S.documentTypeList('category')
                    .title('Select Category')
                    .child((categoryId) =>
                      S.documentList()
                        .title('Posts')
                        .filter('_type == "post" && category._ref == $categoryId')
                        .params({ categoryId })
                        .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                    )
                ),
              S.listItem()
                .title('By Brand')
                .child(
                  S.documentTypeList('brand')
                    .title('Select Brand')
                    .child((brandId) =>
                      S.documentList()
                        .title('Posts')
                        .filter('_type == "post" && brand._ref == $brandId')
                        .params({ brandId })
                        .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                    )
                ),
              S.listItem()
                .title('Sponsored')
                .child(
                  S.documentList()
                    .title('Sponsored Posts')
                    .filter('_type == "post" && isSponsored == true')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),
            ])
        ),

      S.listItem()
        .title('Brands')
        .icon(StarIcon)
        .child(
          S.list()
            .title('Brands')
            .items([
              S.listItem()
                .title('All Brands')
                .child(
                  S.documentTypeList('brand')
                    .title('All Brands')
                    .defaultOrdering([{ field: 'name', direction: 'asc' }])
                ),
              S.listItem()
                .title('Featured')
                .child(
                  S.documentList()
                    .title('Featured Brands')
                    .filter('_type == "brand" && isFeatured == true')
                    .defaultOrdering([{ field: 'name', direction: 'asc' }])
                ),
            ])
        ),

      S.listItem()
        .title('Categories')
        .icon(TagIcon)
        .child(
          S.documentTypeList('category')
            .title('Categories')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
        ),

      S.divider(),

      S.listItem()
        .title('Homepage')
        .icon(CogIcon)
        .child(
          S.editor()
            .id('homepageConfig')
            .schemaType('homepageConfig')
            .documentId('homepageConfig')
            .title('Homepage Configuration')
        ),
    ])

function statusFilter(S: StructureBuilder, title: string, status: string) {
  return S.listItem()
    .title(title)
    .child(
      S.documentList()
        .title(title)
        .filter('_type == "post" && status == $status')
        .params({ status })
        .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
    )
}
