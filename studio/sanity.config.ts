import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "../sanity/schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? process.env.SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "Missing SANITY_STUDIO_PROJECT_ID/SANITY_PROJECT_ID or SANITY_STUDIO_DATASET/SANITY_DATASET for Studio config.",
  );
}

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
