// Refreshes app/lib/city-snapshot.json and app/lib/route-snapshot.json from
// the live trips API.
//
// Both snapshots are append-only: a city / city pair is added the first time
// it shows up on a live trip and never removed. One trip is enough for the
// /routes/{a}-{b} page to stay resolvable and listed in sitemap-trips.xml
// forever, even after its last trip departs.
//
//   node scripts/snapshot-cities.mjs

import { readFileSync, writeFileSync } from "node:fs";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.yoldosh.uz/api/v1";
const PAGE_SIZE = 100; // API rejects anything larger
const FILE = new URL("../app/lib/city-snapshot.json", import.meta.url);
const ROUTES_FILE = new URL("../app/lib/route-snapshot.json", import.meta.url);

const fetchPage = (page) =>
  fetch(`${API_URL}/public/trips/popular?page=${page}&limit=${PAGE_SIZE}`).then((r) => r.json());

const existing = JSON.parse(readFileSync(FILE, "utf8"));
const byId = new Map(existing.map((c) => [c.id, c]));
const names = new Set(existing.map((c) => c.name));
const routes = new Set(JSON.parse(readFileSync(ROUTES_FILE, "utf8")).map((r) => r.join("|")));
const routesBefore = routes.size;

const first = await fetchPage(1);
const totalPages = first?.data?.totalPages ?? 1;
const rest = await Promise.all(Array.from({ length: totalPages - 1 }, (_, i) => fetchPage(i + 2)));

let added = 0;
for (const page of [first, ...rest]) {
  for (const trip of page?.data?.trips ?? []) {
    const from = trip.from_location?.city?.trim();
    const to = trip.to_location?.city?.trim();
    if (from && to && from !== to) routes.add(`${from}|${to}`);
    for (const side of ["from", "to"]) {
      const id = trip[`${side}_city_id`];
      const loc = trip[`${side}_location`];
      if (!id || !loc?.city || !loc?.coordinates || byId.has(id)) continue;
      const name = loc.city.trim();
      if (names.has(name)) continue;
      byId.set(id, { id, name, lat: loc.coordinates.latitude, lon: loc.coordinates.longitude });
      names.add(name);
      added++;
    }
  }
}

const sorted = [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
writeFileSync(FILE, JSON.stringify(sorted, null, 2) + "\n");
console.log(`city-snapshot: ${sorted.length} cities (+${added})`);

const sortedRoutes = [...routes].sort().map((r) => r.split("|"));
// One [from, to] pair per line keeps diffs readable.
writeFileSync(ROUTES_FILE, "[\n" + sortedRoutes.map((r) => "  " + JSON.stringify(r)).join(",\n") + "\n]\n");
console.log(`route-snapshot: ${sortedRoutes.length} routes (+${sortedRoutes.length - routesBefore})`);
