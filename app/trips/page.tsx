"use client";

import { useState, Suspense } from "react";
import { usePopularTrips, useSearchTrips } from "@/hooks/useTrips";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, LayoutGrid, List, AlertCircle } from "lucide-react";
import { TripCard } from "@/components/shared/trip/TripCard";
import { SearchFilters } from "@/components/shared/trip/SearchFilter";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SearchPage = () => {
    const t = useTranslations("Pages.Trips");
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: popularTrips, isLoading: popularLoading, error: popularError } = usePopularTrips();

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [filters, setFilters] = useState({
        from_region_id: parseInt(searchParams.get("from") || "0"),
        to_region_id: parseInt(searchParams.get("to") || "0"),
        departure_date: searchParams.get("date") || undefined,
        seats: parseInt(searchParams.get("seats") || "1"),
        page: 1,
        limit: 12,
    });

    const hasFilters = filters.from_region_id > 0 && filters.to_region_id > 0;

    const { data, isLoading, error } = useSearchTrips(
        filters,
        hasFilters
    );

    const handleSearch = (newFilters: Partial<typeof filters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Skeleton className="h-48 w-full rounded-xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-72 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {t("Error")}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const trips = data?.data?.trips || [];

    return (
        <div className="container mx-auto px-4 py-8">
            <SearchFilters onSearch={handleSearch} initialFilters={filters} />

            <div className="mt-8">
                {!hasFilters ? (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">{t("PopularTrips")}</h2>
                            <div className="flex gap-2">
                                <Button
                                    className={viewMode === "grid" ? "btn-primary" : "bg-transparent hover:bg-emerald-500 cursor-pointer text-black hover:text-white"}
                                    size="icon-sm"
                                    onClick={() => setViewMode("grid")}
                                >
                                    <LayoutGrid className="size-4" />
                                </Button>
                                <Button
                                    className={viewMode === "list" ? "btn-primary" : "bg-transparent hover:bg-emerald-500 cursor-pointer text-black hover:text-white"}
                                    size="icon-sm"
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="size-4" />
                                </Button>
                            </div>
                        </div>

                        {popularLoading ? (
                            <div className={viewMode === "grid"
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                : "flex flex-col gap-4"
                            }>
                                {[...Array(6)].map((_, i) => (
                                    <Skeleton key={i} className="h-64 w-full rounded-xl" />
                                ))}
                            </div>
                        ) : popularError ? (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    {t("Error")}
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <div className={viewMode === "grid"
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                : "flex flex-col gap-4"
                            }>
                                {popularTrips?.data.trips.map((trip) => (
                                    <TripCard
                                        key={trip.id}
                                        trip={trip}
                                        onClick={() => router.push(`/trips/${trip.id}`)}
                                        viewMode={viewMode}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : trips.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-lg text-muted-foreground">
                            {t("NotFound")}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <div className="text-lg font-semibold">
                                {data?.data.total} {t("Found")}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    className={viewMode === "grid" ? "btn-primary" : "bg-transparent hover:bg-emerald-500 cursor-pointer text-black hover:text-white"}
                                    size="icon-sm"
                                    onClick={() => setViewMode("grid")}
                                >
                                    <LayoutGrid className="size-4" />
                                </Button>
                                <Button
                                    className={viewMode === "list" ? "btn-primary" : "bg-transparent hover:bg-emerald-500 cursor-pointer text-black hover:text-white"}
                                    size="icon-sm"
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="size-4" />
                                </Button>
                            </div>
                        </div>

                        <div className={viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            : "flex flex-col gap-4"
                        }>
                            {trips.map((trip) => (
                                <TripCard
                                    key={trip.id}
                                    trip={trip}
                                    onClick={() => router.push(`/trips/${trip.id}`)}
                                    viewMode={viewMode}
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
                                            ? "bg-emerald-500 text-white"
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

const Page = () => {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="size-8 animate-spin text-emerald-500" />
            </div>
        }>
            <SearchPage />
        </Suspense>
    );
};

export default Page;