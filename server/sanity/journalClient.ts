import { createClient } from "@sanity/client";

function readJournalSanityEnv() {
  return {
    projectId: process.env.SANITY_JOURNAL_PROJECT_ID,
    dataset: process.env.SANITY_JOURNAL_DATASET,
    apiVersion: process.env.SANITY_JOURNAL_API_VERSION || "2026-03-12",
    token: process.env.SANITY_JOURNAL_READ_TOKEN,
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

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: token ? false : true,
  });
}
