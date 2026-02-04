import { useQuery } from '@tanstack/react-query';
import { tripsApi, type SearchParams } from '@/lib/api';

export const useSearchTrips = (params: SearchParams, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['trips', 'search', params],
        queryFn: () => tripsApi.searchTrips(params),
        enabled,
        staleTime: 5 * 60 * 1000, // 5 минут
        gcTime: 10 * 60 * 1000, // 10 минут (cacheTime устарел в v5)
    });
};

export const useTripDetails = (tripId: string) => {
    return useQuery({
        queryKey: ['trips', 'details', tripId],
        queryFn: () => tripsApi.getTripDetails(tripId),
        staleTime: 10 * 60 * 1000, // 10 минут
        enabled: !!tripId,
    });
};

export const usePopularTrips = (limit: number = 10) => {
    return useQuery({
        queryKey: ['trips', 'popular', limit],
        queryFn: () => tripsApi.getPopularTrips(limit),
        staleTime: 15 * 60 * 1000, // 15 минут
    });
};