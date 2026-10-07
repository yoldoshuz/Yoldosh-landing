// Refreshes app/lib/city-snapshot.json from the live trips API.
//
// The snapshot is append-only: cities are added when they show up on live
// trips and never removed. That keeps every /routes/{a}-{b} URL Google has
// ever crawled resolvable even after the last trip for that city departs.
//
//   node scripts/snapshot-cities.mjs

import { readFileSync, writeFileSync } from "node:fs";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.yoldosh.uz/api/v1";
const PAGE_SIZE = 100; // API rejects anything larger
const FILE = new URL("../app/lib/city-snapshot.json", import.meta.url);

const fetchPage = (page) =>
  fetch(`${API_URL}/public/trips/popular?page=${page}&limit=${PAGE_SIZE}`).then((r) => r.json());

const existing = JSON.parse(readFileSync(FILE, "utf8"));
const byId = new Map(existing.map((c) => [c.id, c]));
const names = new Set(existing.map((c) => c.name));

const first = await fetchPage(1);
const totalPages = first?.data?.totalPages ?? 1;
const rest = await Promise.all(Array.from({ length: totalPages - 1 }, (_, i) => fetchPage(i + 2)));

let added = 0;
for (const page of [first, ...rest]) {
  for (const trip of page?.data?.trips ?? []) {
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
