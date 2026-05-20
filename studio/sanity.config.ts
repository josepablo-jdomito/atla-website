import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "../sanity/schemaTypes";

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

export default defineConfig({
  name: "default",
  title: "Atla Studio",
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
