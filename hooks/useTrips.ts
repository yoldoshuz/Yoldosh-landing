import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import {
    PopularTripsResponse,
    SearchParams,
    SearchResponse,
    TripDetailsResponse
} from '@/types';

export const tripsApi = {
    searchTrips: async (params: SearchParams): Promise<SearchResponse> => {
        const response = await api.get('/public/trips/search', { params });
        return response.data;
    },

    getTripDetails: async (tripId: string): Promise<TripDetailsResponse> => {
        const response = await api.get(`/public/trips/details/${tripId}`);
        return response.data;
    },

    getPopularTrips: async (limit: number = 10): Promise<PopularTripsResponse> => {
        const response = await api.get('/public/trips/popular', {
            params: { limit },
        });
        return response.data;
    },
};

export const regionsApi = {
    getAllRegions: async () => {
        const response = await api.get('/location/regions');
        return response.data;
    },
};

export const useSearchTrips = (params: SearchParams, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['trips', 'search', params],
        queryFn: () => tripsApi.searchTrips(params),
        enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

export const useTripDetails = (tripId: string) => {
    return useQuery({
        queryKey: ['trips', 'details', tripId],
        queryFn: () => tripsApi.getTripDetails(tripId),
        staleTime: 10 * 60 * 1000,
        enabled: !!tripId,
    });
};

export const usePopularTrips = (limit: number = 10) => {
    return useQuery({
        queryKey: ['trips', 'popular', limit],
        queryFn: () => tripsApi.getPopularTrips(limit),
        staleTime: 15 * 60 * 1000,
    });
};