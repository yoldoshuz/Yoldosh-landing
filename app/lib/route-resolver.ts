// Route slug resolver — translates any URL slug variant into a canonical
// city pair. Two flavors:
//
//   - resolveRouteSync(slug): seed-only lookup. Synchronous, deterministic,
//     used by generateStaticParams + sitemap to enumerate top pairs at
//     build time without touching the network.
//
//   - resolveRoute(slug): seed + live API catalog. Asynchronous, falls back
//     to the live catalog so long-tail cities (Qorasuv, Jalaquduq, etc.)
//     also resolve.
//
// Distance / duration policy:
//   - Trust API trip.duration when present (real route timing).
//   - Trust API trip.distance when > 0; otherwise fall back to haversine.
//   - The /[route] page samples a few live trips and feeds the averages
//     back into the rendered metadata via resolveRouteWithLiveStats().

import { CITIES, City, CITY_BY_ALIAS, CITY_BY_KEY, normalizeForLookup, POPULAR_CITIES } from "./cities";
import { getCityCatalog } from "./city-catalog";

export interface ResolvedRoute {
  fromCity: City;
  toCity: City;
  canonicalSlug: string;
  distanceKm: number;
  durationH: number;
  isCanonical: boolean;
  inputSlug: string;
  /** Source of the distance value used (api/haversine). */
  distanceSource: "api" | "haversine";
  /** Source of the duration value used (api/estimated). */
  durationSource: "api" | "estimated";
}

const EARTH_RADIUS_KM = 6371;
const ROAD_FACTOR = 1.25;
const AVG_SPEED_KMH = 75;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function haversineKm(a: City, b: City): number {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const x = sinLat * sinLat + sinLon * sinLon * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return EARTH_RADIUS_KM * c;
}

export function roundDistance(km: number): number {
  if (km < 50) return Math.round(km / 5) * 5;
  if (km < 200) return Math.round(km / 10) * 10;
  return Math.round(km / 20) * 20;
}

export function estimateDurationH(distanceKm: number): number {
  return Math.max(1, Math.round(distanceKm / AVG_SPEED_KMH));
}

/**
 * Splits a slug into two city aliases, trying every possible split position
 * to handle multi-word names like "denov-tumani" or "qoʻrgʻontepa-toshkent".
 */
function splitToCities(slug: string, byAlias: Map<string, City>): { from: City; to: City } | null {
  const normalized = normalizeForLookup(slug);
  if (!normalized) return null;
  const parts = normalized.split("-").filter(Boolean);
  if (parts.length < 2) return null;

  for (let i = 1; i < parts.length; i++) {
    const fromKey = parts.slice(0, i).join("-");
    const toKey = parts.slice(i).join("-");
    const from = byAlias.get(fromKey);
    const to = byAlias.get(toKey);
    if (from && to && from.key !== to.key) return { from, to };
  }
  return null;
}

function buildResolved(
  from: City,
  to: City,
  inputSlug: string,
  overrideDistanceKm?: number,
  overrideDurationH?: number
): ResolvedRoute {
  const canonicalSlug = `${from.key}-${to.key}`;
  const normalized = normalizeForLookup(inputSlug);

  let distanceKm: number;
  let distanceSource: "api" | "haversine";
  if (overrideDistanceKm && overrideDistanceKm > 0) {
    distanceKm = roundDistance(overrideDistanceKm);
    distanceSource = "api";
  } else {
    distanceKm = roundDistance(haversineKm(from, to) * ROAD_FACTOR);
    distanceSource = "haversine";
  }

  let durationH: number;
  let durationSource: "api" | "estimated";
  if (overrideDurationH && overrideDurationH > 0) {
    durationH = Math.max(1, Math.round(overrideDurationH));
    durationSource = "api";
  } else {
    durationH = estimateDurationH(distanceKm);
    durationSource = "estimated";
  }

  return {
    fromCity: from,
    toCity: to,
    canonicalSlug,
    distanceKm,
    durationH,
    isCanonical: normalized === canonicalSlug,
    inputSlug: normalized,
    distanceSource,
    durationSource,
  };
}

/** Sync seed-only resolver. Use from generateStaticParams + sitemap. */
export function resolveRouteSync(slug: string): ResolvedRoute | null {
  const pair = splitToCities(slug, CITY_BY_ALIAS);
  if (!pair) return null;
  return buildResolved(pair.from, pair.to, slug);
}

/** Async resolver that consults both the seed and the live API catalog. */
export async function resolveRoute(slug: string): Promise<ResolvedRoute | null> {
  const seed = resolveRouteSync(slug);
  if (seed) return seed;
  const { byAlias } = await getCityCatalog();
  const pair = splitToCities(slug, byAlias);
  if (!pair) return null;
  return buildResolved(pair.from, pair.to, slug);
}

/**
 * Wraps resolveRoute with optional live trip statistics — if `liveStats`
 * provides a non-zero distance or duration sampled from real trips, those
 * values supersede the haversine fallback. Used by the /[route] page so
 * the rendered metadata reflects actual route data when available.
 */
export async function resolveRouteWithLiveStats(
  slug: string,
  liveStats?: { distanceKm?: number; durationH?: number }
): Promise<ResolvedRoute | null> {
  const base = await resolveRoute(slug);
  if (!base) return null;
  if (!liveStats) return base;
  return buildResolved(base.fromCity, base.toCity, slug, liveStats.distanceKm, liveStats.durationH);
}

/**
 * Generates static params for the top popular intercity pairs (build-time).
 * Seed-only — no network calls during prerender.
 */
export function listPopularRouteSlugs(): string[] {
  const slugs = new Set<string>();
  for (const from of POPULAR_CITIES) {
    for (const to of POPULAR_CITIES) {
      if (from.key === to.key) continue;
      slugs.add(`${from.key}-${to.key}`);
    }
  }
  const tashkent = CITY_BY_KEY.get("tashkent");
  if (tashkent) {
    for (const city of CITIES) {
      if (city.key === tashkent.key) continue;
      slugs.add(`${tashkent.key}-${city.key}`);
      slugs.add(`${city.key}-${tashkent.key}`);
    }
  }
  return Array.from(slugs);
}

/**
 * Resolves a city by display name or alias.
 * Sync variant — seed only — used at build time.
 */
export function resolveCitySync(name: string): City | null {
  const normalized = normalizeForLookup(name);
  if (!normalized) return null;
  return CITY_BY_ALIAS.get(normalized) ?? null;
}

/** Async variant — seed + live catalog. Used by sitemap generation. */
export async function resolveCity(name: string): Promise<City | null> {
  const seed = resolveCitySync(name);
  if (seed) return seed;
  const normalized = normalizeForLookup(name);
  if (!normalized) return null;
  const { byAlias } = await getCityCatalog();
  return byAlias.get(normalized) ?? null;
}

export function buildRouteSlug(from: City, to: City): string {
  return `${from.key}-${to.key}`;
}
