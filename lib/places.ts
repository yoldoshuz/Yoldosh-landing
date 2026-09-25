/**
 * Place lookup for the trip search.
 *
 * Wraps the Google Places autocomplete the landing already loads, so the app
 * screens deal in a plain `{ name, lat, lng }` and never touch the SDK's own
 * shapes. Everything is feature-detected: if the script has not landed yet the
 * helpers resolve empty rather than throwing.
 */

export interface Place {
  name: string;
  /** Second line in the list — district, region, and so on. */
  detail?: string;
  lat?: number;
  lng?: number;
}

export interface PlaceSuggestion extends Place {
  /** Opaque handle used to fetch coordinates only for the one that is picked. */
  resolve: () => Promise<Place>;
}

/* eslint-disable @typescript-eslint/no-explicit-any -- the Maps SDK ships no types here */

const places = async () => {
  const google = (window as any).google;
  if (!google?.maps?.importLibrary) return null;
  return google.maps.importLibrary("places");
};

/**
 * Autocomplete, restricted to Uzbekistan — the product does not operate
 * anywhere else, and unrestricted results made the list mostly noise.
 */
export const fetchPlaceSuggestions = async (input: string): Promise<PlaceSuggestion[]> => {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const lib = await places();
  if (!lib) return [];

  const { suggestions } = await lib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
    input: trimmed,
    includedRegionCodes: ["uz"],
    includedPrimaryTypes: ["locality", "administrative_area_level_1", "route", "street_address"],
  });

  return (suggestions ?? []).map((suggestion: any): PlaceSuggestion => {
    const prediction = suggestion.placePrediction;
    const name = prediction?.mainText?.text ?? prediction?.text?.text ?? "";
    const detail = prediction?.secondaryText?.text ?? undefined;

    return {
      name,
      detail,
      resolve: async () => {
        try {
          const place = await prediction.toPlace();
          await place.fetchFields({ fields: ["displayName", "location"] });
          return {
            name: place.displayName ?? name,
            detail,
            lat: place.location?.lat(),
            lng: place.location?.lng(),
          };
        } catch {
          // Without coordinates the caller cannot search, but returning the
          // name keeps the field filled instead of clearing what was tapped.
          return { name, detail };
        }
      },
    };
  });
};

/** Turns the device's position into something a person recognises. */
export const reverseGeocode = async (lat: number, lng: number): Promise<Place> => {
  const google = (window as any).google;
  const fallback: Place = { name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, lat, lng };

  if (!google?.maps?.Geocoder) return fallback;

  try {
    const { results } = await new google.maps.Geocoder().geocode({ location: { lat, lng } });
    const best = results?.[0];
    if (!best) return fallback;

    const locality = best.address_components?.find((c: any) => c.types?.includes("locality"));
    return {
      name: locality?.long_name ?? best.formatted_address ?? fallback.name,
      detail: best.formatted_address,
      lat,
      lng,
    };
  } catch {
    return fallback;
  }
};

/** The browser's geolocation prompt, as a promise. */
export const currentPosition = (): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("geolocation unavailable"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: false, timeout: 10_000 });
  });

/* --------------------------------------------------------------- recents */

const RECENTS_KEY = "yoldosh.recentPlaces";
const RECENTS_MAX = 8;

export const getRecentPlaces = (): Place[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((p) => p && typeof p.name === "string") : [];
  } catch {
    return [];
  }
};

export const rememberPlace = (place: Place) => {
  if (typeof window === "undefined" || !place.name) return;
  try {
    const next = [place, ...getRecentPlaces().filter((p) => p.name !== place.name)].slice(0, RECENTS_MAX);
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  } catch {
    /* private mode — recents simply are not remembered */
  }
};
