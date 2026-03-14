import type { JSX } from "react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { sanityClient, urlForImage } from "./sanity";

export type SiteSettings = {
  title: string;
  tagline: string;
  intro: string;
  services: string[];
  contactEmail: string;
  studioLabel: string;
  offices: Array<{ city: string; label: string }>;
};

export type SanityProject = {
  _id: string;
  title: string;
  slug: string;
  client: string;
  year: number;
  category: string;
  description: string;
  body: unknown[];
  featured: boolean;
  coverImage?: {
    asset: unknown;
    alt?: string;
  };
  gallery?: Array<{
    _key: string;
    asset: unknown;
    alt?: string;
  }>;
  tags: string[];
};

export const fallbackSiteSettings: SiteSettings = {
  title: "Atla",
  tagline: "Design with intention",
  intro:
    "Atla is a design practice building identity systems, digital experiences, and campaigns for teams working across the US and Latin America.",
  services: ["Brand identity", "Digital design", "Campaign systems"],
  contactEmail: "hello@example.com",
  studioLabel: "Sanity Studio",
  offices: [
    { city: "Austin", label: "US" },
    { city: "CDMX", label: "MX" },
    { city: "Lima", label: "PE" },
  ],
};

const fallbackProjects: SanityProject[] = [
  {
    _id: "sample-1",
    title: "Atlas of Motion",
    slug: "atlas-of-motion",
    client: "Editorial Prototype",
    year: 2026,
    category: "Brand Identity",
    description: "A sample featured project shown until Sanity content is connected.",
    body: [
      {
        _type: "block",
        _key: "sample-1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "sample-1-span",
            text: "Connect your Sanity dataset to replace this placeholder with published content.",
            marks: [],
          },
        ],
        markDefs: [],
      },
    ],
    featured: true,
    coverImage: {
      asset: "/figmaAssets/media-2.png",
      alt: "Sample Atla project cover",
    },
    gallery: [
      { _key: "g1", asset: "/figmaAssets/media.png", alt: "Sample gallery image" },
      { _key: "g2", asset: "/figmaAssets/media-1.png", alt: "Sample gallery image" },
      { _key: "g3", asset: "/figmaAssets/media-3.png", alt: "Sample gallery image" },
    ],
    tags: ["sample", "sanity", "setup"],
  },
  {
    _id: "sample-2",
    title: "Field Notes",
    slug: "field-notes",
    client: "Web Study",
    year: 2025,
    category: "Web Design",
    description: "A second placeholder project used to keep the work grid populated.",
    body: [],
    featured: false,
    coverImage: {
      asset: "/figmaAssets/media-4.png",
      alt: "Sample web design cover",
    },
    gallery: [],
    tags: ["sample", "web"],
  },
];

const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  "title": coalesce(title, "Atla"),
  "tagline": coalesce(tagline, "Design with intention"),
  "intro": coalesce(intro, ""),
  "services": coalesce(services, []),
  "contactEmail": coalesce(contactEmail, ""),
  "studioLabel": coalesce(studioLabel, "Sanity Studio"),
  "offices": coalesce(offices, [])
}`;

const projectFields = `{
  _id,
  title,
  "slug": slug.current,
  client,
  year,
  category,
  description,
  body,
  featured,
  coverImage{
    asset,
    alt
  },
  "gallery": gallery[]{
    _key,
    asset,
    alt
  },
  "tags": coalesce(tags, [])
}`;

const publishedFilter = `defined(slug.current) && (!defined(status) || status == "published")`;

async function fetchPublishedProjects(): Promise<SanityProject[]> {
  if (!sanityClient) {
    return fallbackProjects;
  }

  return sanityClient.fetch<SanityProject[]>(
    `*[_type == "project" && ${publishedFilter}] | order(featured desc, year desc, _createdAt desc) ${projectFields}`,
  );
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (!sanityClient) {
    return fallbackSiteSettings;
  }

  const data = await sanityClient.fetch<Partial<SiteSettings> | null>(siteSettingsQuery);
  return {
    ...fallbackSiteSettings,
    ...data,
    services: data?.services?.length ? data.services : fallbackSiteSettings.services,
    offices: data?.offices?.length ? data.offices : fallbackSiteSettings.offices,
  };
}

export async function fetchProjects(): Promise<SanityProject[]> {
  return fetchPublishedProjects();
}

export async function fetchFeaturedProjects(): Promise<SanityProject[]> {
  if (!sanityClient) {
    return fallbackProjects.filter((project) => project.featured);
  }

  const featuredProjects = await sanityClient.fetch<SanityProject[]>(
    `*[_type == "project" && ${publishedFilter} && featured == true] | order(year desc, _createdAt desc) ${projectFields}`,
  );

  if (featuredProjects.length > 0) {
    return featuredProjects;
  }

  const publishedProjects = await fetchPublishedProjects();
  return publishedProjects.slice(0, 3);
}

export async function fetchProjectBySlug(slug: string): Promise<SanityProject | null> {
  if (!sanityClient) {
    return fallbackProjects.find((project) => project.slug === slug) || null;
  }

  return sanityClient.fetch<SanityProject | null>(
    `*[_type == "project" && slug.current == $slug && ${publishedFilter}][0] ${projectFields}`,
    { slug },
  );
}

export function resolveImageUrl(source: unknown, width = 1600) {
  if (typeof source === "string") {
    return source;
  }

  return urlForImage(source)?.width(width).fit("max").auto("format").url() || null;
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-base leading-7 text-[#444444] md:text-lg md:leading-8">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-web-desktop-h3 text-3xl leading-none text-[#111111] md:text-5xl">
        {children}
      </h2>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      return (
        <a className="underline decoration-[#ffc629] underline-offset-4" href={href}>
          {children}
        </a>
      );
    },
  },
};

export function renderPortableText(value: unknown[]): JSX.Element | null {
  if (!value?.length) {
    return null;
  }

  return <PortableText components={portableTextComponents} value={value as any} />;
}
