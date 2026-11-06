import { createClient } from "@sanity/client";

function readJournalSanityEnv() {
  return {
    projectId:
      process.env.SANITY_JOURNAL_PROJECT_ID ||
      process.env.SANITY_PROJECT_ID ||
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset:
      process.env.SANITY_JOURNAL_DATASET ||
      process.env.SANITY_DATASET ||
      process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion:
      process.env.SANITY_JOURNAL_API_VERSION ||
      process.env.SANITY_API_VERSION ||
      "2026-03-12",
    token:
      process.env.SANITY_JOURNAL_READ_TOKEN ||
      process.env.SANITY_API_TOKEN ||
      process.env.SANITY_READ_TOKEN,
  };
}

export function isJournalSanityConfigured() {
  const { projectId, dataset } = readJournalSanityEnv();
  return Boolean(projectId && dataset);
}

export function getJournalSanityClient() {
  const { projectId, dataset, apiVersion, token } = readJournalSanityEnv();

  if (!projectId || !dataset) {
    throw new Error("Sanity journal env vars are not configured");
  }

  // Published reads go through Sanity's API CDN (apicdn.sanity.io: edge-cached, not billed as API
  // requests), token or not (JP, 2026-11-06). The site reads published documents only; the edge already
  // serves content up to 5 minutes old (server/routes.ts PUBLIC_CACHE). SANITY_USE_CDN=false goes to the
  // live API, for a script that must see an edit the moment it is published.
  const useCdn = !/^(false|0|no|off)$/i.test((process.env.SANITY_USE_CDN || "").trim());
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn,
    perspective: "published",
  });
}
