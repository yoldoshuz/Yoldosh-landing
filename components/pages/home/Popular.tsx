"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { usePopularTrips } from "@/hooks/useTrips";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";

export const Popular = () => {
  const locale = useLocale();
  const t = useTranslations("Pages.Popular");
  const {
    data: popularData,
    fetchNextPage: fetchNextPopular,
    hasNextPage: hasNextPopular,
    isFetchingNextPage: popularLoadingMore,
    isLoading: isPopularLoading,
  } = usePopularTrips();

  const popularTrips = popularData?.pages?.flatMap((p: any) => p?.data?.trips || []) || [];

  return (
    <>
      {popularTrips?.length > 0 && (
        <section
          className="flex flex-col items-center justify-center w-full px-4 bg-neutral-100 py-12"
          aria-labelledby="popular-title"
        >
          <div className="flex flex-col items-center text-center gap-4">
            <h2 id="popular-title" className="title-2 text-3xl font-bold">
              {t("Title")}
            </h2>
          </div>

          <Carousel
            className="mt-10 w-full max-w-6xl"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {popularTrips?.map((item: any) => (
                <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                  <Link
                    href={`/trips?from_lat=${item.from_location.coordinates.latitude}&from_lon=${item.from_location.coordinates.longitude}&to_lat=${item.to_location.coordinates.latitude}&to_lon=${item.to_location.coordinates.longitude}&seats=1`}
                    className="flex flex-col w-full h-full overflow-hidden group select-none cursor-pointer"
                    tabIndex={0}
                    aria-label={`${item.from_location.city} → ${item.to_location.city}`}
                  >
                    <Card className="flex flex-col gap-3 p-5 bg-white rounded-2xl border hover:border-emerald-500 smooth shadow-none">
                      <CardContent className="flex flex-col gap-0 px-0!">
                        <div className="flex items-center gap-3">
                          <Image src="/assets/location-green.svg" alt="location" width={22} height={22} />
                          <div>
                            <p className="text-base font-bold">{item.from_location.city}</p>
                            <p className="text-sm text-muted-foreground">{item.from_location.address}</p>
                          </div>
                        </div>
                        <span className="border-black border-l-2 border-dashed h-6 ml-2.25" />
                        <div className="flex items-center gap-3">
                          <Image src="/assets/location-red.svg" alt="location" width={22} height={22} />
                          <div>
                            <p className="text-base font-bold">{item.to_location.city}</p>
                            <p className="text-sm text-muted-foreground">{item.to_location.address}</p>
                          </div>
                        </div>
                      </CardContent>

                      <Separator />

                      <div className="flex items-center justify-between w-full mt-2">
                        <div className="flex flex-col">
                          <p className="text-xs text-muted-foreground">{t("From")}</p>
                          <p className="text-xl font-bold">{item.price.price_per_person.toLocaleString()} UZS</p>
                        </div>
                        <Button
                          variant="secondary"
                          className="rounded-full px-2! bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                        >
                          <ChevronRight className="size-5" />
                        </Button>
                      </div>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Стрелки адаптивно позиционируются */}
            <CarouselPrevious className="hidden lg:flex left-2 md:-left-10" />
            <CarouselNext className="hidden lg:flex right-2 md:-right-10" />
          </Carousel>
        </section>
      )}
    </>
  );
};
