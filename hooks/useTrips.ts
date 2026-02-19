import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { SearchParams } from "@/types";

const FIVE_MIN = 5 * 60 * 1000;

export const tripsApi = {
  searchTrips: async (params: SearchParams) => {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== null && v !== "" && v !== undefined && v !== "undefined")
    );

    const response = await api.get("/public/trips/search", {
      params: cleanedParams,
    });

    return response.data;
  },

  getTripDetails: async (tripId: string) => {
    const response = await api.get(`/public/trips/details/${tripId}`);
    return response.data;
  },

  getPopularTrips: async (limit: number = 10, page: number = 1) => {
    const response = await api.get("/public/trips/popular", {
      params: { limit, page },
    });
    return response.data;
  },
};
export const useSearchTrips = (params: SearchParams, enabled: boolean) => {
  return useInfiniteQuery({
    queryKey: ["trips", "search", params],
    enabled,
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const res = await tripsApi.searchTrips({
        ...params,
        page: pageParam,
      });
      return res;
    },

    getNextPageParam: (lastPage) => {
      const page = lastPage?.data?.page;
      const total = lastPage?.data?.totalPages;

      if (!page || !total) return undefined;
      if (page >= total) return undefined;

      return page + 1;
    },

    staleTime: FIVE_MIN,
    gcTime: FIVE_MIN * 2,
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

export const usePopularTrips = (enabled?: boolean) => {
  return useInfiniteQuery({
    queryKey: ["trips", "popular"],
    enabled,
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const res = await tripsApi.getPopularTrips(10, pageParam);
      return res;
    },

    getNextPageParam: (lastPage) => {
      const page = lastPage?.data?.page;
      const total = lastPage?.data?.totalPages;

      if (!page || !total) return undefined;
      if (page >= total) return undefined;

      return page + 1;
    },

    staleTime: FIVE_MIN,
  });
};
