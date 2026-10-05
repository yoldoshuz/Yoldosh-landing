import { toDepartureDate } from "@/components/app/kit";
import type { SearchValue } from "@/components/app/SearchFields";
import type { SearchFilters } from "@/components/app/sheets/SearchFilterSheet";
import type { TripSearchQuery } from "@/types/api";

/** A search as the results screen holds it: names for the header, coordinates for the API. */
export interface SearchRoute {
  from: string;
  to: string;
  fromLat: number;
  fromLon: number;
  toLat: number;
  toLon: number;
  seats: number;
  date?: Date;
}

export const toRoute = (value: SearchValue): SearchRoute => ({
  from: value.from!.name,
  to: value.to!.name,
  fromLat: value.from!.lat!,
  fromLon: value.from!.lng!,
  toLat: value.to!.lat!,
  toLon: value.to!.lng!,
  seats: value.seats,
  date: value.date,
});

/** `YYYY-MM-DD`, built locally so the day cannot slide across a timezone. */
const toDayParam = (date?: Date) => {
  if (!date) return undefined;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

/** The results screen's URL for a search. */
export const searchResultsUrl = (locale: string, value: SearchValue) => {
  const params = new URLSearchParams({
    from: value.from!.name,
    from_lat: String(value.from!.lat),
    from_lon: String(value.from!.lng),
    to: value.to!.name,
    to_lat: String(value.to!.lat),
    to_lon: String(value.to!.lng),
    seats: String(value.seats),
  });
  const day = toDayParam(value.date);
  if (day) params.set("date", day);

  // A filled-in path the localized router cannot resolve through `pathnames`,
  // so the locale is prefixed by hand.
  return `/${locale}/search/results?${params.toString()}`;
};

/**
 * The request for a route, a day and a set of filters. One builder for both
 * the results screen and the "Найти" button's prefetch, so the two land on
 * the same query key and the screen picks up the request already in flight.
 */
export const buildTripQuery = (route: SearchRoute, day: Date | undefined, filters: SearchFilters): TripSearchQuery => {
  const amenities = filters.amenities;
  return {
    from_latitude: route.fromLat,
    from_longitude: route.fromLon,
    to_latitude: route.toLat,
    to_longitude: route.toLon,
    departure_date: toDepartureDate(day),
    requested_seats: route.seats,
    // The API rejects sorting by price and time together, which is why the
    // sheet offers the four options as one exclusive choice.
    sort_by_price: filters.sort === "cheapest" || filters.sort === "expensive" ? filters.sort : undefined,
    sort_by_time: filters.sort === "earliest" || filters.sort === "latest" ? filters.sort : undefined,
    garage: filters.garage,
    conditioner: amenities.conditioner,
    smoking_allowed: amenities.smoking_allowed,
    door_pickup: amenities.door_pickup,
    food_stop: amenities.food_stop,
    // The one flag the endpoint takes as a string rather than a boolean.
    parcels_allowed: amenities.parcels_allowed ? "true" : undefined,
    // Larger than a screenful: forecast trips are dropped from each page
    // (see `realTrips`), so a page can shrink well below what was asked.
    limit: 20,
  };
};
