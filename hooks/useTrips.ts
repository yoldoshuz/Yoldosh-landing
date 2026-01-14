import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { SearchParams } from "@/types";

export const tripsApi = {
  searchTrips: async (params: SearchParams) => {
    // Чистим параметры, но оставляем 0 и false (если нужны boolean флаги как строки)
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== null && v !== "" && v !== undefined && v !== "undefined")
    );
    const response = await api.get("/public/trips/search", { params: cleanedParams });
    return response.data;
  },

  getTripDetails: async (tripId: string) => {
    const response = await api.get(`/public/trips/details/${tripId}`);
    return response.data;
  },

  getPopularTrips: async (limit: number = 10) => {
    const response = await api.get("/public/trips/popular", {
      params: { limit },
    });
    return response.data;
  },
};

export const useSearchTrips = (params: SearchParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["trips", "search", params],
    queryFn: () => tripsApi.searchTrips(params),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });
};

export const useTripDetails = (tripId: string) => {
  return useQuery({
    queryKey: ["trips", "details", tripId],
    queryFn: () => tripsApi.getTripDetails(tripId),
    staleTime: 10 * 60 * 1000,
    enabled: !!tripId,
  });
};

export const usePopularTrips = (limit: number = 10) => {
  return useQuery({
    queryKey: ["trips", "popular", limit],
    queryFn: () => tripsApi.getPopularTrips(limit),
    staleTime: 15 * 60 * 1000,
  });
};