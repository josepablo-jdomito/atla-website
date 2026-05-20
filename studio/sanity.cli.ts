import { defineCliConfig } from "sanity/cli";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ??
  process.env.SANITY_PROJECT_ID ??
  process.env.SANITY_JOURNAL_PROJECT_ID ??
  "dvufm78f";
const dataset =
  process.env.SANITY_STUDIO_DATASET ??
  process.env.SANITY_DATASET ??
  process.env.SANITY_JOURNAL_DATASET ??
  "production";

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    appId: "j7a4ksjij031hoy475t6ti1n",
  },
});
