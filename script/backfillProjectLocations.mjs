import { createClient } from "@sanity/client";

const PROJECT_ID = process.env.SANITY_JOURNAL_PROJECT_ID || "dvufm78f";
const DATASET = process.env.SANITY_JOURNAL_DATASET || "production";
const API_VERSION = process.env.SANITY_JOURNAL_API_VERSION || "2026-03-12";
const TOKEN =
  process.env.SANITY_TOKEN ||
  process.env.SANITY_JOURNAL_WRITE_TOKEN ||
  process.env.SANITY_JOURNAL_READ_TOKEN;
const IS_DRY_RUN = process.argv.includes("--dry-run");

const LOCATION_DATA = {
  "the-curated-outfit": { region: "Asia", country: "Indonesia", locationName: "Denpasar, Indonesia", latitude: -8.6705, longitude: 115.2126 },
  "casa-colora": { region: "America", country: "Mexico", locationName: "Monterrey, Mexico", latitude: 25.6866, longitude: -100.3161 },
  vyv: { region: "America", country: "United States", locationName: "Miami, United States", latitude: 25.7617, longitude: -80.1918 },
  "arc-studio": { region: "Middle East", country: "United Arab Emirates", locationName: "Abu Dhabi, United Arab Emirates", latitude: 24.4539, longitude: 54.3773 },
  "tequila-unido": { region: "America", country: "United States", locationName: "Houston, United States", latitude: 29.7604, longitude: -95.3698 },
  rustico: { region: "America", country: "Mexico", locationName: "Cabo San Lucas, Mexico", latitude: 22.8905, longitude: -109.9167 },
  "angeles-wellness": { region: "America", country: "United States", locationName: "Los Angeles, United States", latitude: 34.0522, longitude: -118.2437 },
  "anything-ai": { region: "America", country: "United States", locationName: "New York City, United States", latitude: 40.7128, longitude: -74.006 },
  atla: { region: "America", country: "United States", locationName: "Austin, United States", latitude: 30.2672, longitude: -97.7431 },
  "pax-and-beneficia": { region: "America", country: "United States", locationName: "Dallas, United States", latitude: 32.7767, longitude: -96.797 },
  reggie: { region: "America", country: "United States", locationName: "San Diego, United States", latitude: 32.7157, longitude: -117.1611 },
  tigretigre: { region: "America", country: "Mexico", locationName: "San Luis Potosi, Mexico", latitude: 22.1565, longitude: -100.9855 },
  "alma-brava": { region: "America", country: "Mexico", locationName: "Oaxaca, Mexico", latitude: 17.0732, longitude: -96.7266 },
  "hanks-leather": { region: "America", country: "United States", locationName: "Albany, United States", latitude: 42.6526, longitude: -73.7562 },
  "bovi-health": { region: "America", country: "United States", locationName: "Charlotte, United States", latitude: 35.2271, longitude: -80.8431 },
  "the-bridge": { region: "Asia", country: "Indonesia", locationName: "Denpasar, Indonesia", latitude: -8.6705, longitude: 115.2126 },
  "shop-latinx": { region: "America", country: "United States", locationName: "Santa Monica, United States", latitude: 34.0195, longitude: -118.4912 },
  "conscious-care-co": { region: "America", country: "Canada", locationName: "Toronto, Canada", latitude: 43.6532, longitude: -79.3832 },
  oxylife: { region: "Middle East", country: "United Arab Emirates", locationName: "Dubai, United Arab Emirates", latitude: 25.2048, longitude: 55.2708 },
  "pathize-health": { region: "America", country: "United States", locationName: "Los Angeles, United States", latitude: 34.0522, longitude: -118.2437 },
  ando: { region: "America", country: "United States", locationName: "New York City, United States", latitude: 40.7128, longitude: -74.006 },
  puppypy: { region: "America", country: "United States", locationName: "Los Angeles, United States", latitude: 34.0522, longitude: -118.2437 },
  "peachy-patients": { region: "America", country: "United States", locationName: "Los Angeles, United States", latitude: 34.0522, longitude: -118.2437 },
  huemac: { region: "America", country: "Mexico", locationName: "Queretaro, Mexico", latitude: 20.5888, longitude: -100.3899 },
  "castro-capital": { region: "America", country: "Mexico", locationName: "San Luis Potosi, Mexico", latitude: 22.1565, longitude: -100.9855 },
};

if (!TOKEN && !IS_DRY_RUN) {
  throw new Error("Missing Sanity write token. Set SANITY_TOKEN or SANITY_JOURNAL_WRITE_TOKEN.");
}

const client = TOKEN ? createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: TOKEN,
  useCdn: false,
}) : null;

const docs = client
  ? await client.fetch(
      `*[_type == "project" && defined(slug.current)]{_id, title, "slug": slug.current}`
    )
  : Object.entries(LOCATION_DATA).map(([slug, value]) => ({ _id: slug, slug, title: slug }));

const patches = docs
  .map((doc) => {
    const location = LOCATION_DATA[doc.slug];
    if (!location) return null;

    return {
      id: doc._id,
      slug: doc.slug,
      title: doc.title,
      patch: {
        region: location.region,
        country: location.country,
        locationName: location.locationName,
        coordinates: {
          _type: "geopoint",
          lat: location.latitude,
          lng: location.longitude,
        },
      },
    };
  })
  .filter(Boolean);

if (IS_DRY_RUN) {
  console.log(JSON.stringify({ dryRun: true, count: patches.length, patches }, null, 2));
  process.exit(0);
}

for (const entry of patches) {
  await client.patch(entry.id).set(entry.patch).commit();
  console.log(`Updated ${entry.title} (${entry.slug})`);
}

console.log(`Backfilled ${patches.length} project locations in Sanity.`);
