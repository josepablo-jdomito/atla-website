import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? process.env.SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "Missing SANITY_STUDIO_PROJECT_ID/SANITY_PROJECT_ID or SANITY_STUDIO_DATASET/SANITY_DATASET for Studio CLI config.",
  );
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    appId: "j7a4ksjij031hoy475t6ti1n",
  },
});
