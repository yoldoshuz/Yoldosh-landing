"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { usePopularTrips, useSearchTrips } from "@/hooks/useTrips";
import { Button } from "@/components/ui/button";
import { FilterSidebar } from "./FilterSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, LayoutGrid, List } from "lucide-react";
import { TripCard } from "@/components/shared/trip/TripCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SearchTrips } from "@/components/shared/trip/SearchTrips";

export const SearchPage = () => {
  const t = useTranslations("Pages.Trips");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // 1. Инициализация фильтров из URL
  const [filters, setFilters] = useState<any>({
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
    from_lat: searchParams.get("from_lat") || undefined,
    from_lon: searchParams.get("from_lon") || undefined,
    to_lat: searchParams.get("to_lat") || undefined,
    to_lon: searchParams.get("to_lon") || undefined,

    departure_date: searchParams.get("date") || undefined,
    seats: parseInt(searchParams.get("seats") || "1"),
    page: 1,
    limit: 10,
    sort_by: searchParams.get("sort_by") || undefined,
    sort_order: searchParams.get("sort_order") || undefined,
    smoking_allowed: searchParams.get("smoking_allowed") === "true" ? true : undefined,
    pets_allowed: searchParams.get("pets_allowed") === "true" ? true : undefined,
    music_allowed: searchParams.get("music_allowed") === "true" ? true : undefined,
    talkative: searchParams.get("talkative") === "true" ? true : undefined,
    conditioner: searchParams.get("conditioner") === "true" ? true : undefined,
    max_two_back: searchParams.get("max_two_back") === "true" ? true : undefined,
    garage: searchParams.get("garage") || undefined,
  });

  // 2. Флаг: Был ли произведен поиск? (Проверяем текстовые поля)
  const hasSearchQuery = 
    (!!searchParams.get("from") && !!searchParams.get("to")) || 
    (!!searchParams.get("from_lat") && !!searchParams.get("to_lat"));

  // 3. Запросы
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchTrips(filters, hasSearchQuery);

  const { data: popularData, isLoading: isPopularLoading } = usePopularTrips(10);

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);

    if (hasSearchQuery) {
      const params = new URLSearchParams();
      Object.entries(updated).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, String(value));
        }
      });
      router.replace(`/trips?${params.toString()}`, { scroll: false });
    }
  };

  const trips = searchResults?.data?.trips || [];
  const totalPages = searchResults?.data?.totalPages || 0;
  const totalFound = searchResults?.data?.total || 0;
  const popularTrips = popularData?.data?.trips || [];

  useEffect(() => {
    const nextFilters = {
      from: searchParams.get("from") || "",
      to: searchParams.get("to") || "",
      from_lat: searchParams.get("from_lat") || undefined,
      from_lon: searchParams.get("from_lon") || undefined,
      to_lat: searchParams.get("to_lat") || undefined,
      to_lon: searchParams.get("to_lon") || undefined,
      departure_date: searchParams.get("date") || undefined,
      seats: parseInt(searchParams.get("seats") || "1"),
      page: Number(searchParams.get("page") || 1),
      limit: 10,
      sort_by: searchParams.get("sort_by") || undefined,
      sort_order: searchParams.get("sort_order") || undefined,
      smoking_allowed: searchParams.get("smoking_allowed") === "true" ? true : undefined,
      pets_allowed: searchParams.get("pets_allowed") === "true" ? true : undefined,
      music_allowed: searchParams.get("music_allowed") === "true" ? true : undefined,
      talkative: searchParams.get("talkative") === "true" ? true : undefined,
      conditioner: searchParams.get("conditioner") === "true" ? true : undefined,
      max_two_back: searchParams.get("max_two_back") === "true" ? true : undefined,
      garage: searchParams.get("garage") || undefined,
    };

    setFilters(nextFilters);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl min-h-screen">
      <div className="flex mb-8 z-30 top-24">
        <SearchTrips />
      </div>

      {!hasSearchQuery ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t("PopularTrips")}</h2>
            <div className="flex gap-1 bg-neutral-100 p-1 rounded-lg self-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "h-8 px-2 rounded-md transition-all",
                  viewMode === "grid" && "bg-white shadow-sm text-emerald-600"
                )}
              >
                <LayoutGrid className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={cn(
                  "h-8 px-2 rounded-md transition-all",
                  viewMode === "list" && "bg-white shadow-sm text-emerald-600"
                )}
              >
                <List className="size-4" />
              </Button>
            </div>
          </div>

          {isPopularLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div
              className={cn(
                "grid gap-4",
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}
            >
              {popularTrips.map((trip: any) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onClick={() => router.push(`/trips/${trip.id}`)}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 px-2">
          <div className="hidden lg:block w-72 shrink-0">
            <FilterSidebar filters={filters} onChange={updateFilters} />
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div className="text-xl font-bold flex justify-between w-full">
                {isSearchLoading ? (
                  <span className="animate-pulse bg-neutral-200 h-6 w-32 rounded" />
                ) : (
                  <div className="flex flex-col items-start">
                    <p>{totalFound} {t("Found")}</p>
                    {filters.from && filters.to && (
                      <span className="text-muted-foreground font-normal text-base">
                        {filters.from} &rarr; {filters.to}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-center">
                  <div className="bg-neutral-100 p-1 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "h-8 px-2 rounded-md transition-all",
                        viewMode === "grid" && "bg-white shadow-sm text-emerald-600"
                      )}
                    >
                      <LayoutGrid className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "h-8 px-2 rounded-md transition-all",
                        viewMode === "list" && "bg-white shadow-sm text-emerald-600"
                      )}
                    >
                      <List className="size-4" />
                    </Button>
                  </div>
                </div>

              </div>
            </div>

            {isSearchLoading ? (
              <div className={cn("grid gap-4", viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-60 w-full rounded-2xl" />
                ))}
              </div>
            ) : searchError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{t("Error")}</AlertDescription>
              </Alert>
            ) : trips.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  <LayoutGrid className="size-8 text-neutral-300" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">{t("NotFound")}</h3>
                <p className="text-muted-foreground text-center max-w-sm mt-2">{t("NotFoundTitle")}</p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() =>
                    updateFilters({
                      smoking_allowed: undefined,
                      pets_allowed: undefined,
                      music_allowed: undefined,
                      talkative: undefined,
                      conditioner: undefined,
                      garage: undefined,
                      max_two_back: undefined
                    })
                  }
                >
                  {t("ResetFilters")}
                </Button>
              </div>
            ) : (
              <div
                className={cn(
                  "grid gap-4",
                  viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
                )}
              >
                {trips.map((trip: any) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onClick={() => router.push(`/trips/${trip.id}`)}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-10 flex justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={filters.page === 1}
                  onClick={() => updateFilters({ page: filters.page - 1 })}
                >
                  Prev
                </Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={filters.page === i + 1 ? "default" : "outline"}
                    className={cn(filters.page === i + 1 && "bg-emerald-500 hover:bg-emerald-600")}
                    onClick={() => updateFilters({ page: i + 1 })}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  disabled={filters.page === totalPages}
                  onClick={() => updateFilters({ page: filters.page + 1 })}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      )
      }
    </div >
  );
};