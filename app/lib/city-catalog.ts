// Live city catalog assembled by aggregating the public trips API.
//
// Why this exists: the seed dictionary in cities.ts can only ever cover the
// cities we manually curate (with proper ru/uz/en display names + aliases).
// For long-tail destinations actually used by drivers (Qorasuv, Jalaquduq,
// Xo'jaobod, Kamashi, etc.) we paginate /public/trips/popular, collect the
// unique city UUIDs along with their names + coordinates, and merge into a
// runtime catalog. Cached for 24h so repeated requests don't hammer the API.

import { unstable_cache } from "next/cache";

import { City, normalizeForLookup, CITIES as SEED_CITIES } from "./cities";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.yoldosh.uz/api/v1";

// Cap the scan window. 10 × 500 = 5000 trips → enough to discover every
// active city without blowing the build budget. Stops early when API runs out.
const MAX_PAGES = 10;
const PAGE_SIZE = 500;

export interface CityHint {
  id: string;
  name: string;
  lat: number;
  lon: number;
  /** True if this hint originated from the seed dictionary. */
  fromSeed?: boolean;
}

interface ApiTrip {
  from_city_id?: string;
  to_city_id?: string;
  from_location?: { city?: string; coordinates?: { latitude: number; longitude: number } };
  to_location?: { city?: string; coordinates?: { latitude: number; longitude: number } };
  duration?: number;
  distance?: number;
}

interface ApiResponse {
  data?: {
    trips?: ApiTrip[];
    totalPages?: number;
  };
}

async function fetchTripsPage(page: number): Promise<ApiTrip[] | null> {
  try {
    const res = await fetch(`${API_URL}/public/trips/popular?page=${page}&limit=${PAGE_SIZE}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const json: ApiResponse = await res.json();
    return json?.data?.trips ?? [];
  } catch {
    return null;
  }
}

/**
 * Internal hint-gathering pass. Walks API pages and dedupes by city UUID.
 * This function is wrapped by unstable_cache so the work is amortized across
 * every consumer (sitemap, route page, etc.).
 */
async function gatherCityHints(): Promise<CityHint[]> {
  const hints = new Map<string, CityHint>();

  for (let page = 1; page <= MAX_PAGES; page++) {
    const trips = await fetchTripsPage(page);
    if (!trips || trips.length === 0) break;

    for (const trip of trips) {
      const sides: ("from" | "to")[] = ["from", "to"];
      for (const side of sides) {
        const id = trip[`${side}_city_id`];
        const loc = trip[`${side}_location`];
        if (!id || !loc?.city || !loc?.coordinates) continue;
        if (hints.has(id)) continue;
        hints.set(id, {
          id,
          name: loc.city.trim(),
          lat: loc.coordinates.latitude,
          lon: loc.coordinates.longitude,
        });
      }
    }
  }

  return Array.from(hints.values());
}

// 24h cache via Next's data cache. Survives ISR revalidations and module
// reloads, so the catalog is shared across requests in production.
const gatherCityHintsCached = unstable_cache(gatherCityHints, ["yoldosh-city-hints-v1"], {
  revalidate: 86400,
  tags: ["city-catalog"],
});

export interface CityCatalog {
  byKey: Map<string, City>;
  byAlias: Map<string, City>;
  allCities: City[];
}

/**
 * Combines the seed dictionary with live API hints into one catalog. Seed
 * cities are authoritative (they keep curated ru/uz/en names + alias lists);
 * API-only cities get inserted with the API-supplied Uzbek Latin name used
 * uniformly across all locales.
 */
export async function getCityCatalog(): Promise<CityCatalog> {
  const byKey = new Map<string, City>();
  const byAlias = new Map<string, City>();

  // Step 1: seed cities are inserted first and protect their slugs.
  for (const city of SEED_CITIES) {
    byKey.set(city.key, city);
    const variants = new Set<string>([
      city.key,
      ...city.aliases,
      normalizeForLookup(city.ru),
      normalizeForLookup(city.uz),
      normalizeForLookup(city.en),
    ]);
    for (const v of variants) {
      if (v && !byAlias.has(v)) byAlias.set(v, city);
    }
  }

  // Step 2: enrich with API-discovered cities (best-effort — silent on error).
  try {
    const hints = await gatherCityHintsCached();
    for (const hint of hints) {
      const normalized = normalizeForLookup(hint.name);
      if (!normalized) continue;

      // Already covered by a seed alias? Just confirm the alias lookup works.
      if (byAlias.has(normalized)) continue;

      // Key collision is unlikely (seed keys are curated Latin); fall back to
      // a numeric suffix in the rare case it happens.
      let key = normalized;
      let suffix = 2;
      while (byKey.has(key)) {
        key = `${normalized}-${suffix++}`;
      }

      const city: City = {
        key,
        ru: hint.name,
        uz: hint.name,
        en: hint.name,
        lat: hint.lat,
        lon: hint.lon,
        aliases: [normalized],
      };

      byKey.set(key, city);
      byAlias.set(key, city);
      if (!byAlias.has(normalized)) byAlias.set(normalized, city);
    }
  } catch (err) {
    console.error("[city-catalog] enrichment failed:", err);
  }

  return {
    byKey,
    byAlias,
    allCities: Array.from(byKey.values()),
  };
}
