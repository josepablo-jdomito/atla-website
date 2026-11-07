import { defineArrayMember, defineField, defineType } from "sanity";
import { DISCIPLINES, MAX_SEARCH_TERMS, SECTORS, STAGES } from "../../shared/projectFacets";

const DEPRECATED_FACET = {
  reason: "Replaced by Sector, Disciplines, Stage and Search terms (2026-11-05). Kept until the migration runs; the site no longer reads it.",
};
const asOptions = (values: readonly string[]) => values.map((value) => ({ title: value, value }));

function isValidVimeoUrl(value: string) {
  return /^(https?:\/\/)?(www\.)?(vimeo\.com\/\d+|player\.vimeo\.com\/video\/\d+)([/?#].*)?$/i.test(value.trim());
}

function extractVimeoUrlFromEmbedCode(value: string) {
  const iframeSrc = value
    .match(/<iframe[^>]+src=["']([^"']+)["']/i)?.[1]
    ?.trim()
    .replace(/&amp;/gi, "&");
  if (iframeSrc && isValidVimeoUrl(iframeSrc)) return iframeSrc;
  if (isValidVimeoUrl(value)) return value.trim();
  return "";
}

export const projectType = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
    { name: "taxonomy", title: "Taxonomy" },
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
      name: "client",
      title: "Client",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      group: "content",
      validation: (rule) =>
        rule
          .required()
          .integer()
          .min(1990)
          .max(new Date().getFullYear() + 1),
    }),
    defineField({
      name: "sector",
      title: "Sector",
      type: "string",
      group: "taxonomy",
      description: "Who the brand serves. One value.",
      options: { list: asOptions(SECTORS) },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "disciplines",
      title: "Disciplines",
      type: "array",
      group: "taxonomy",
      description: "What Atla delivered, as the images show it. The first one is the lead. Brand Identity goes on every project.",
      of: [defineArrayMember({ type: "string" })],
      options: { list: asOptions(DISCIPLINES), layout: "grid" },
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: "stage",
      title: "Stage",
      type: "string",
      group: "taxonomy",
      description: "Why the client came.",
      initialValue: STAGES[0],
      options: { list: asOptions(STAGES), layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "taxonomy",
      deprecated: DEPRECATED_FACET,
    }),
    defineField({
      name: "industry",
      title: "Industry",
      type: "string",
      group: "taxonomy",
      deprecated: DEPRECATED_FACET,
      options: {
        list: [
          { title: "Hospitality", value: "Hospitality" },
          { title: "Food & Beverage", value: "Food & Beverage" },
          { title: "Consumer Goods", value: "Consumer Goods" },
          { title: "SaaS", value: "SaaS" },
          { title: "Digital", value: "Digital" },
        ],
      },
    }),
    defineField({
      name: "region",
      title: "Region",
      type: "string",
      group: "taxonomy",
      deprecated: DEPRECATED_FACET,
      options: {
        list: [
          { title: "America", value: "America" },
          { title: "Europe", value: "Europe" },
          { title: "Asia", value: "Asia" },
          { title: "Middle East", value: "Middle East" },
        ],
      },
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      group: "taxonomy",
      description:
        "Where the client is. Place on the site derives from it: United States, Mexico, United States & Mexico, United Arab Emirates (Middle East), anything else is International.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "locationName",
      title: "Location Name",
      type: "string",
      group: "taxonomy",
      description: "City or exact place label shown in map views (for example: Austin, US).",
    }),
    defineField({
      name: "coordinates",
      title: "Coordinates",
      type: "geopoint",
      group: "taxonomy",
      description: "Exact latitude and longitude used for map/globe placement.",
    }),
    defineField({
      name: "searchTerms",
      title: "Search terms",
      type: "array",
      group: "taxonomy",
      description:
        "Hidden. Product and category nouns a prospect types that the facets do not contain (mezcal, pilates, hotel). Each must name something visible in the images or stated in the description. Lowercase, at most 8.",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) =>
        rule.max(MAX_SEARCH_TERMS).custom((terms) => {
          if (!Array.isArray(terms)) return true;
          const bad = terms.filter(
            (term) => typeof term !== "string" || term !== term.toLowerCase() || term.trim().length < 2 || term.trim().length > 30,
          );
          return bad.length === 0 ? true : `Lowercase, 2 to 30 characters: ${bad.join(", ")}`;
        }),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "taxonomy",
      deprecated: DEPRECATED_FACET,
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      group: "taxonomy",
      deprecated: DEPRECATED_FACET,
      of: [defineArrayMember({ type: "string" })],
      description: "Optional service labels shown on the project page.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "content",
      rows: 3,
    }),
    defineField({
      name: "caseStudy",
      title: "Case study body",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
        }),
      ],
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      group: "media",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "Gallery images",
      type: "array",
      group: "media",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: "mediaItems",
      title: "Media sequence",
      type: "array",
      group: "media",
      description:
        "Use this to control the exact project media order. Mix high-quality photos and uploaded MP4s in the same sequence.",
      of: [
        defineArrayMember({
          type: "object",
          name: "projectMediaItem",
          title: "Media item",
          fields: [
            defineField({
              name: "mediaType",
              title: "Type",
              type: "string",
              initialValue: "image",
              options: {
                layout: "radio",
                list: [
                  { title: "Photo", value: "image" },
                  { title: "Video", value: "video" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "image",
              title: "Photo",
              type: "image",
              options: { hotspot: true },
              hidden: ({ parent }) => (parent as { mediaType?: string } | undefined)?.mediaType === "video",
              validation: (rule) =>
                rule.custom((value, context) => {
                  const parent = context.parent as { mediaType?: string } | undefined;
                  if (parent?.mediaType !== "video" && !value) return "Add a photo.";
                  return true;
                }),
            }),
            defineField({
              name: "file",
              title: "Video file",
              type: "file",
              options: {
                accept: "video/mp4,video/webm,video/quicktime",
              },
              hidden: ({ parent }) => (parent as { mediaType?: string } | undefined)?.mediaType !== "video",
              validation: (rule) =>
                rule.custom((value, context) => {
                  const parent = context.parent as { mediaType?: string } | undefined;
                  if (parent?.mediaType === "video" && !value) return "Add a video file.";
                  return true;
                }),
            }),
            defineField({
              name: "poster",
              title: "Video poster image",
              type: "image",
              options: { hotspot: true },
              hidden: ({ parent }) => (parent as { mediaType?: string } | undefined)?.mediaType !== "video",
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
          preview: {
            select: {
              mediaType: "mediaType",
              title: "title",
              image: "image",
              poster: "poster",
              fileName: "file.asset.originalFilename",
            },
            prepare(selection) {
              const isVideo = selection.mediaType === "video";
              return {
                title: selection.title || selection.fileName || (isVideo ? "Video" : "Photo"),
                subtitle: isVideo ? "Uploaded video" : "Photo",
                media: isVideo ? selection.poster : selection.image,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "vimeoVideos",
      title: "Vimeo videos",
      type: "array",
      group: "media",
      description: "Paste Vimeo embed code (<iframe ...>) or Vimeo URL. Both render as embeds on the project page.",
      of: [
        defineArrayMember({
          type: "object",
          name: "vimeoVideo",
          title: "Vimeo video",
          fields: [
            defineField({
              name: "url",
              title: "Vimeo URL",
              type: "url",
              hidden: ({ parent }) =>
                typeof parent === "object" &&
                parent !== null &&
                typeof (parent as Record<string, unknown>).embedCode === "string" &&
                (parent as Record<string, string>).embedCode.trim().length > 0,
              validation: (rule) =>
                rule.custom((value, context) => {
                  const parent = context.parent as { embedCode?: string } | undefined;
                  const hasEmbed = typeof parent?.embedCode === "string" && parent.embedCode.trim().length > 0;
                  if (!value && !hasEmbed) {
                    return "Add a Vimeo URL or paste embed code.";
                  }
                  if (typeof value === "string" && value.trim().length > 0 && !isValidVimeoUrl(value)) {
                    return "Use a valid Vimeo URL.";
                  }

                  return true;
                }),
            }),
            defineField({
              name: "embedCode",
              title: "Vimeo embed code",
              type: "text",
              rows: 4,
              validation: (rule) =>
                rule.custom((value, context) => {
                  const parent = context.parent as { url?: string } | undefined;
                  const hasUrl = typeof parent?.url === "string" && parent.url.trim().length > 0;
                  if (!value && !hasUrl) {
                    return "Paste Vimeo embed code or provide a Vimeo URL.";
                  }
                  if (typeof value === "string" && value.trim().length > 0 && !extractVimeoUrlFromEmbedCode(value)) {
                    return "Embed code must include a valid Vimeo iframe src.";
                  }
                  return true;
                }),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "url",
              embedCode: "embedCode",
            },
            prepare(selection) {
              const derivedFromEmbed = typeof selection.embedCode === "string"
                ? extractVimeoUrlFromEmbedCode(selection.embedCode)
                : "";
              return {
                title: selection.title || "Vimeo video",
                subtitle: selection.subtitle || derivedFromEmbed || "Embed code",
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "videoFiles",
      title: "Uploaded videos",
      type: "array",
      group: "media",
      description:
        "High-quality project videos uploaded as original files. Use MP4 for broad playback; add a poster image for premium loading and sharing quality.",
      of: [
        defineArrayMember({
          type: "object",
          name: "projectVideoFile",
          title: "Uploaded video",
          fields: [
            defineField({
              name: "file",
              title: "Video file",
              type: "file",
              options: {
                accept: "video/mp4,video/webm,video/quicktime",
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "poster",
              title: "Poster image",
              type: "image",
              options: { hotspot: true },
              description: "Still frame shown before playback. Upload this at the same visual quality as portfolio images.",
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
          preview: {
            select: {
              title: "title",
              fileName: "file.asset.originalFilename",
              media: "poster",
            },
            prepare(selection) {
              return {
                title: selection.title || selection.fileName || "Uploaded video",
                subtitle: "Original video file",
                media: selection.media,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "content",
      initialValue: false,
    }),
    defineField({
      name: "homeOrder",
      title: "Home order (featured only, 1 = first)",
      type: "number",
      group: "content",
      validation: (Rule) => Rule.integer().min(1),
      hidden: ({ document }) => !document?.featured,
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
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "client",
      media: "coverImage",
    },
  },
});
