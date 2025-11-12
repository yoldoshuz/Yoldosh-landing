"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSearchTrips } from "@/hooks/useTrips";
import { TripCard } from "@/components/shared/TripCard";
import { SearchFilters } from "@/components/shared/SearchFilter";
import { Loader2 } from "lucide-react";

function TripsSearchContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState({
        from_region_id: parseInt(searchParams.get("from") || "0"),
        to_region_id: parseInt(searchParams.get("to") || "0"),
        departure_date: searchParams.get("date") || undefined,
        seats: parseInt(searchParams.get("seats") || "1"),
        page: 1,
        limit: 12,
    });

    const { data, isLoading, error } = useSearchTrips(
        filters,
        filters.from_region_id > 0 && filters.to_region_id > 0
    );

    const handleSearch = (newFilters: Partial<typeof filters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="size-8 animate-spin text-teal-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-red-500">
                    Error loading trips. Please try again.
                </div>
            </div>
        );
    }

    const trips = data?.data?.trips || [];
    const hasFilters = filters.from_region_id > 0 && filters.to_region_id > 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <SearchFilters onSearch={handleSearch} initialFilters={filters} />

            <div className="mt-8">
                {!hasFilters ? (
                    <div className="text-center text-muted-foreground py-12">
                        Please select departure and arrival locations to search for trips.
                    </div>
                ) : trips.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                        No trips found. Try adjusting your search criteria.
                    </div>
                ) : (
                    <>
                        <div className="mb-6 text-lg font-semibold">
                            Found {data?.data.total} trips
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trips.map((trip) => (
                                <TripCard
                                    key={trip.id}
                                    trip={trip}
                                    onClick={() => router.push(`/trips/${trip.id}`)}
                                />
                            ))}
                        </div>

                        {data!.data.totalPages > 1 && (
                            <div className="mt-8 flex justify-center gap-2">
                                {Array.from({ length: data!.data.totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() =>
                                            setFilters((prev) => ({ ...prev, page: i + 1 }))
                                        }
                                        className={`px-4 py-2 rounded ${filters.page === i + 1
                                            ? "bg-teal-500 text-white"
                                            : "bg-gray-200"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default function TripsSearchPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="size-8 animate-spin text-teal-500" />
            </div>
        }>
            <TripsSearchContent />
        </Suspense>
    );
}