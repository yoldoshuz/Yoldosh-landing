import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, toList } from "@/lib/api";
import type { AppBooking, AppTrip, CreateTripPayload, TripSearchQuery } from "@/types/api";
import { qk } from "./keys";

interface TripPage {
  trips: AppTrip[];
  total: number;
  currentPage: number;
  totalPages: number;
}

const stripEmpty = (params: object) =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""));

export const appTripsApi = {
  search: async (params: TripSearchQuery & { page?: number }) => {
    const { data } = await api.get("/trip/search", { params: stripEmpty(params) });
    return { ...data.data, trips: toList<AppTrip>(data.data?.trips) } as TripPage;
  },
  details: async (tripId: string) => {
    const { data } = await api.get(`/trip/${tripId}`);
    return (data.data?.trip ?? data.data) as AppTrip;
  },
  create: async (payload: CreateTripPayload) => {
    const { data } = await api.post("/trip", payload);
    return (data.data?.trip ?? data.data) as AppTrip;
  },
  update: async ({ tripId, ...payload }: Partial<CreateTripPayload> & { tripId: string }) =>
    (await api.patch(`/trip/${tripId}`, payload)).data,
  cancel: async ({ tripId, cancellationReason }: { tripId: string; cancellationReason: string }) =>
    (await api.patch(`/trip/${tripId}/cancel`, { cancellationReason })).data,
  start: async (tripId: string) => (await api.post(`/trip/${tripId}/start`)).data,
  complete: async (tripId: string) => (await api.post(`/trip/${tripId}/complete`)).data,
  report: async ({ tripId, reason, description }: { tripId: string; reason: string; description: string }) =>
    (await api.post(`/trip/${tripId}/report`, { reason, description })).data,
  myActivity: async (role: "driver" | "passenger", page = 1, limit = 10) => {
    const { data } = await api.get("/trip/my-activity", { params: { role, page, limit } });
    return { ...data.data, trips: toList<AppTrip>(data.data?.trips) } as TripPage;
  },
  tripBookings: async (tripId: string, status?: string) => {
    const { data } = await api.get(`/trip/${tripId}/bookings`, { params: stripEmpty({ status }) });
    return toList<AppBooking>(data.data?.bookings ?? data.data);
  },
  priceHint: async (from_address: string, to_address: string) => {
    const { data } = await api.get("/trip/req-price", { params: { from_address, to_address } });
    return data.data as { min_price?: number; max_price?: number; average_price?: number; confidence?: string };
  },
};

export const useAppTripSearch = (params: TripSearchQuery | null) =>
  useInfiniteQuery({
    queryKey: qk.tripSearch(params),
    enabled: Boolean(params),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => appTripsApi.search({ ...(params as TripSearchQuery), page: pageParam }),
    getNextPageParam: (last) =>
      last.currentPage && last.totalPages && last.currentPage < last.totalPages ? last.currentPage + 1 : undefined,
    retry: false,
  });

export const useAppTrip = (tripId?: string) =>
  useQuery({ queryKey: qk.trip(tripId ?? ""), queryFn: () => appTripsApi.details(tripId!), enabled: Boolean(tripId) });

export const useMyActivity = (role: "driver" | "passenger") =>
  useInfiniteQuery({
    queryKey: qk.myActivity(role),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => appTripsApi.myActivity(role, pageParam),
    getNextPageParam: (last) =>
      last.currentPage && last.totalPages && last.currentPage < last.totalPages ? last.currentPage + 1 : undefined,
  });

export const useTripBookings = (tripId?: string, status?: string) =>
  useQuery({
    queryKey: qk.tripBookings(tripId ?? "", status),
    queryFn: () => appTripsApi.tripBookings(tripId!, status),
    enabled: Boolean(tripId),
  });

export const usePriceHint = (from?: string, to?: string) =>
  useQuery({
    queryKey: qk.priceHint(from ?? "", to ?? ""),
    queryFn: () => appTripsApi.priceHint(from!, to!),
    enabled: Boolean(from && to),
    retry: false,
  });

const useTripMutation = <TVars,>(mutationFn: (vars: TVars) => Promise<unknown>) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["app", "trips"] }),
  });
};

/** Typed separately from the others — callers navigate to the created trip. */
export const useCreateTrip = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: appTripsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["app", "trips"] }),
  });
};

export const useUpdateTrip = () => useTripMutation(appTripsApi.update);
export const useCancelTrip = () => useTripMutation(appTripsApi.cancel);
export const useStartTrip = () => useTripMutation(appTripsApi.start);
export const useCompleteTrip = () => useTripMutation(appTripsApi.complete);
export const useReportTrip = () => useMutation({ mutationFn: appTripsApi.report });
