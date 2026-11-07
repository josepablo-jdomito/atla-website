import { describe, expect, it } from "vitest";
import { toProjectListItem, type ProjectListItem } from "./projectList.ts";

describe("toProjectListItem (the lite /api/projects row)", () => {
  const full = {
    id: "p1",
    slug: "rustico",
    title: "Rústico",
    client: "Rústico",
    year: 2025,
    category: "Food",
    region: "America",
    country: "Mexico",
    sector: "Food & Drink",
    disciplines: ["Brand Identity"],
    stage: "New brand",
    place: "Mexico",
    searchTerms: ["bakery"],
    coverImage: "https://cdn.sanity.io/images/x/y/a-10x10.png",
    coverFocal: null,
    coverColor: "#ffffff",
    images: ["https://cdn.sanity.io/images/x/y/b-10x10.png"],
    videos: [],
    featured: true,
    homeOrder: 1,
    status: "published",
    body: "Long story",
    description: "A long description",
    tags: ["Branding"],
    createdAt: "2024-01-01T00:00:00Z",
    mediaItems: [],
    videoFiles: [],
  } as unknown as ProjectListItem & Record<string, unknown>;

  it("drops the long text and the per-request fields, keeps what the wall and next/related read", () => {
    const item = toProjectListItem(full) as Record<string, unknown>;
    for (const key of ["body", "description", "tags", "createdAt", "mediaItems", "videoFiles"]) expect(item, key).not.toHaveProperty(key);
    for (const key of ["slug", "title", "client", "year", "category", "sector", "disciplines", "coverImage", "images", "videos", "featured", "homeOrder"]) {
      expect(item, key).toHaveProperty(key);
    }
  });

  it("serializes the same way every time (a stable body, so the ETag can match)", () => {
    expect(JSON.stringify(toProjectListItem(full))).toBe(JSON.stringify(toProjectListItem({ ...full })));
  });
});
