"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, LayoutGrid, List } from "lucide-react";
import { useTranslations } from "next-intl";

import { SearchTrips } from "@/components/shared/trip/SearchTrips";
import { TripCard } from "@/components/shared/trip/TripCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePopularTrips, useSearchTrips } from "@/hooks/useTrips";
import { cn } from "@/lib/utils";
import { FilterSidebar } from "./FilterSidebar";

export const SearchPage = () => {
  const t = useTranslations("Pages.Trips");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // 1. Инициализация фильтров из URL
  const [filters, setFilters] = useState<any>({
    from_name: searchParams.get("from_name") || "",
    to_name: searchParams.get("to_name") || "",
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
  });

  // 2. Флаг: Был ли произведен поиск?
  const hasSearchQuery = !!filters.from_name && !!filters.to_name;

  // 3. Запросы
  // Запрашиваем поиск ТОЛЬКО если есть параметры поиска
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchTrips(filters, hasSearchQuery);

  // Запрашиваем популярное ТОЛЬКО если НЕТ поиска
  const { data: popularData, isLoading: isPopularLoading } = usePopularTrips(10); // enabled можно не трогать, react-query закэширует

  // Синхронизация URL при изменении фильтров (только если уже был поиск)
  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);

    // Если мы в режиме поиска, обновляем URL
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

  // Безопасный доступ к данным
  const trips = searchResults?.data?.trips || [];
  const totalPages = searchResults?.data?.totalPages || 0;
  const totalFound = searchResults?.data?.total || 0;

  // Популярные трипы (безопасный доступ)
  const popularTrips = popularData?.data?.trips || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl min-h-screen">
      {/* Блок поиска сверху */}
      <div className="sticky mb-8">
        <SearchTrips />
      </div>

      {/* Если нет поискового запроса -> Показываем Популярное */}
      {!hasSearchQuery ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t("PopularTrips")}</h2>
            {/* Переключатель вида */}
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
        /* Если ЕСТЬ запрос -> Показываем Лейаут с сайдбаром и результатами */
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Сайдбар (Только десктоп пока, мобилку можно скрыть или через drawer) */}
          <div className="hidden lg:block w-72 shrink-0">
            <FilterSidebar filters={filters} onChange={updateFilters} />
          </div>

          {/* Контентная область */}
          <div className="flex-1">
            {/* Хедер результатов */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {isSearchLoading ? (
                  <span className="animate-pulse bg-neutral-200 h-6 w-32 rounded" />
                ) : (
                  <span>
                    {totalFound} {t("Found")}
                  </span>
                )}
                {filters.from_name && filters.to_name && (
                  <span className="text-muted-foreground font-normal text-base ml-2">
                    {filters.from_name} &rarr; {filters.to_name}
                  </span>
                )}
              </h2>

              {/* Переключатель вида */}
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

            {/* Состояния загрузки и ошибок */}
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
              /* Пустое состояние */
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
                    })
                  }
                >
                  {t("ResetFilters")}
                </Button>
              </div>
            ) : (
              /* Список результатов */
              <div
                className={cn(
                  "grid gap-4",
                  viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
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

            {/* Пагинация */}
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
      )}
    </div>
  );
};
