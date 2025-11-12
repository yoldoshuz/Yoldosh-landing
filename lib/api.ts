import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Типы
export interface Trip {
    id: string;
    from_location: {
        address: string;
        coordinates: { longitude: number; latitude: number };
        region: {
            id: number;
            nameRu: string;
            nameUz: string;
            nameOz: string;
        };
    };
    to_location: {
        address: string;
        coordinates: { longitude: number; latitude: number };
        region: {
            id: number;
            nameRu: string;
            nameUz: string;
            nameOz: string;
        };
    };
    departure_ts: string;
    seats_available: number;
    price: {
        amount: number;
        currency: string;
    };
    driver: {
        id: string;
        firstName: string;
        lastName?: string;
        avatar?: string;
        rating: number;
    };
    car: {
        id: string;
        color: string;
        modelDetails: {
            make: string;
            model: string;
        };
    };
    max_two_back: boolean;
    comment?: string;
    distance?: number;
    duration?: number;
}

export interface SearchParams {
    from_region_id: number;
    to_region_id: number;
    departure_date?: string;
    seats?: number;
    page?: number;
    limit?: number;
}

export interface SearchResponse {
    success: boolean;
    data: {
        trips: Trip[];
        total: number;
        totalPages: number;
        currentPage: number;
    };
}

export interface TripDetailsResponse {
    success: boolean;
    data: {
        trip: Trip;
    };
}

export interface PopularTripsResponse {
    success: boolean;
    data: {
        trips: Array<{
            id: string;
            from: string;
            to: string;
            fromRegion: any;
            toRegion: any;
            price: number;
            departure: string;
            seats: number;
            driver: any;
        }>;
    };
}

// API методы
export const tripsApi = {
    searchTrips: async (params: SearchParams): Promise<SearchResponse> => {
        const response = await api.get('/public/trips/search', { params });
        return response.data;
    },

    getTripDetails: async (tripId: string): Promise<TripDetailsResponse> => {
        const response = await api.get(`/public/trips/${tripId}`);
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