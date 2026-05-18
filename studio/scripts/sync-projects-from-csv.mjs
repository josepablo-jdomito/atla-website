import { readFile } from "node:fs/promises";
import path from "node:path";
import { getCliClient } from "sanity/cli";

function parseArgs(argv) {
  const args = { csvPath: "", dryRun: true };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--csv" && argv[index + 1]) {
      args.csvPath = argv[index + 1];
      index += 1;
    } else if (token === "--write") {
      args.dryRun = false;
    } else if (token === "--dry-run") {
      args.dryRun = true;
    }
  }
  if (!args.csvPath) {
    throw new Error('Missing CSV path. Example: sanity exec scripts/sync-projects-from-csv.mjs --with-user-token -- --csv "/path/atla-projects.csv" --write');
  }
  return args;
}

function parseCsv(raw) {
  const rows = [];
  let current = "";
  let row = [];
  let inQuotes = false;

  for (let index = 0; index < raw.length; index += 1) {
    const char = raw[index];
    const next = raw[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(current);
      current = "";
      if (row.some((value) => value.trim().length > 0)) rows.push(row);
      row = [];
      continue;
    }

    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current);
    if (row.some((value) => value.trim().length > 0)) rows.push(row);
  }

  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((values) => {
    const item = {};
    for (let index = 0; index < headers.length; index += 1) {
      item[headers[index]] = (values[index] || "").trim();
    }
    return item;
  });
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function slugify(value) {
  return normalizeText(value).replace(/\s+/g, "-");
}

function normalizeRegion(value) {
  const text = normalizeText(value);
  if (!text) return "";
  if (text === "north america" || text === "south america" || text === "latam" || text === "america") return "America";
  if (text === "middle east") return "Middle East";
  if (text === "europe") return "Europe";
  if (text === "asia") return "Asia";
  return String(value || "").trim();
}

function normalizeCountry(value) {
  const text = normalizeText(value);
  if (!text) return "";
  if (text === "usa" || text === "us") return "United States";
  if (text === "uae") return "United Arab Emirates";
  if (text === "mexico") return "Mexico";
  if (text.includes("usa") && text.includes("mexico")) return "United States & Mexico";
  return String(value || "").trim();
}

function parseTags(value) {
  if (!value) return [];
  return Array.from(
    new Set(
      String(value)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

function parseServices(value) {
  if (!value) return [];
  return Array.from(
    new Set(
      String(value)
        .split(/\+|,|•|·/g)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

function arraysEqual(left = [], right = []) {
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return false;
  }
  return true;
}

const TITLE_ALIASES = {
  "atla branding agency": "atla",
  "acre hoteles": "rustico",
  "tigre tigre": "tigretigre",
  "hanks leather goods": "hanks-leather",
  "internet empires": "the-internet-empires",
  "welovedaily": "welove",
  "thebrandacademy": "the-brand-academy",
};

const CITY_COORDINATES = {
  "austin tx": { lat: 30.2672, lng: -97.7431 },
  "denver co": { lat: 39.7392, lng: -104.9903 },
  "los cabos": { lat: 22.8905, lng: -109.9167 },
  "abu dhabi": { lat: 24.4539, lng: 54.3773 },
  "bellevue wa": { lat: 47.6101, lng: -122.2015 },
  "new york city": { lat: 40.7128, lng: -74.006 },
  "queretaro": { lat: 20.5888, lng: -100.3899 },
  "charlotte nc": { lat: 35.2271, lng: -80.8431 },
  "san luis potosi": { lat: 22.1565, lng: -100.9855 },
  dubai: { lat: 25.2048, lng: 55.2708 },
  "new delhi": { lat: 28.6139, lng: 77.209 },
  "la saladita guerrero": { lat: 17.8762, lng: -101.7431 },
  monterrey: { lat: 25.6866, lng: -100.3161 },
  amsterdam: { lat: 52.3676, lng: 4.9041 },
  "upstate new york": { lat: 42.6526, lng: -73.7562 },
  "los angeles ca": { lat: 34.0522, lng: -118.2437 },
};

function inferCoordinates(cityRaw) {
  const normalized = normalizeText(cityRaw).replace(/\s+/g, " ");
  if (!normalized) return null;
  const withoutComma = normalized.replace(/,/g, "");
  return CITY_COORDINATES[normalized] || CITY_COORDINATES[withoutComma] || null;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const csv = await readFile(path.resolve(args.csvPath), "utf8");
  const rows = parseCsv(csv);

  const client = getCliClient({ apiVersion: "2026-03-12" });
  const projects = await client.fetch(
    `*[_type == "project" && defined(slug.current)]{
      _id, title, "slug": slug.current, year, category, region, country, locationName, tags, services, service, coordinates
    }`,
  );

  const byTitle = new Map();
  const bySlug = new Map();
  for (const project of projects) {
    byTitle.set(normalizeText(project.title), project);
    bySlug.set(project.slug, project);
  }

  const patches = [];
  const unmatched = [];

  for (const row of rows) {
    const csvTitle = row.Proyecto || "";
    const normalizedTitle = normalizeText(csvTitle);
    const slug = slugify(csvTitle);
    const aliasSlug = TITLE_ALIASES[normalizedTitle];
    const project = byTitle.get(normalizedTitle) || bySlug.get(slug) || (aliasSlug ? bySlug.get(aliasSlug) : undefined);

    if (!project) {
      unmatched.push(csvTitle);
      continue;
    }

    const patch = {};
    const year = Number.parseInt(String(row["Año"] || "").trim(), 10);
    if (Number.isFinite(year) && project.year !== year) patch.year = year;

    const category = String(row["Categoría"] || "").trim();
    if (category && project.category !== category) patch.category = category;

    const region = normalizeRegion(row["Región"]);
    if (region && project.region !== region) patch.region = region;

    const country = normalizeCountry(row["País"]);
    if (country && project.country !== country) patch.country = country;

    const locationName = String(row.Ciudad || "").trim();
    if (locationName && project.locationName !== locationName) patch.locationName = locationName;

    const tags = parseTags(row.Tags);
    const currentTags = Array.isArray(project.tags) ? project.tags.map((item) => String(item)) : [];
    if (tags.length > 0 && !arraysEqual(currentTags, tags)) patch.tags = tags;

    const services = parseServices(row.Servicio);
    const currentServices = Array.isArray(project.services) ? project.services.map((item) => String(item)) : [];
    if (services.length > 0 && !arraysEqual(currentServices, services)) patch.services = services;

    const service = services.join(" · ");
    if (service && project.service !== service) patch.service = service;

    const coordinates = inferCoordinates(locationName);
    if (coordinates) {
      const currentLat = typeof project.coordinates?.lat === "number" ? project.coordinates.lat : null;
      const currentLng = typeof project.coordinates?.lng === "number" ? project.coordinates.lng : null;
      if (currentLat !== coordinates.lat || currentLng !== coordinates.lng) {
        patch.coordinates = { _type: "geopoint", lat: coordinates.lat, lng: coordinates.lng };
      }
    }

    if (Object.keys(patch).length > 0) {
      patches.push({ id: project._id, slug: project.slug, title: project.title, patch });
    }
  }

  console.log(
    JSON.stringify(
      {
        csvRows: rows.length,
        sanityProjects: projects.length,
        matched: rows.length - unmatched.length,
        unmatched,
        patchCount: patches.length,
        dryRun: args.dryRun,
      },
      null,
      2,
    ),
  );

  if (args.dryRun) {
    console.log("\nPatch preview:");
    console.log(JSON.stringify(patches.slice(0, 8), null, 2));
    return;
  }

  for (const entry of patches) {
    await client.patch(entry.id).set(entry.patch).commit();
    console.log(`Updated ${entry.title} (${entry.slug})`);
  }

  console.log(`\nDone. Updated ${patches.length} projects.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
