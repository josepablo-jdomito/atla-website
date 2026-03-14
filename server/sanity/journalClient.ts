import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_JOURNAL_PROJECT_ID;
const dataset = process.env.SANITY_JOURNAL_DATASET;
const apiVersion = process.env.SANITY_JOURNAL_API_VERSION || "2026-03-12";
const token = process.env.SANITY_JOURNAL_READ_TOKEN;

export function isJournalSanityConfigured() {
  return Boolean(projectId && dataset);
}

export function getJournalSanityClient() {
  if (!projectId || !dataset) {
    throw new Error("Sanity journal env vars are not configured");
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: token ? false : true,
  });
}
