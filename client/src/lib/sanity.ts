import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || "2025-03-01";
const dataset = import.meta.env.VITE_SANITY_DATASET;
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;

export const hasSanityConfig = Boolean(projectId && dataset);

export const sanityClient = hasSanityConfig
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function urlForImage(source: unknown) {
  if (!builder || !source) {
    return null;
  }

  return builder.image(source);
}

export const studioUrl =
  import.meta.env.VITE_SANITY_STUDIO_URL || "https://sanity.io/manage";
