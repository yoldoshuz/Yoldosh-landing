"use client"

import Link from "next/link";
import Image from "next/image";

import { useTranslations } from "next-intl";
import { usePopularTrips } from "@/hooks/useTrips";

import { Button } from "../../ui/button";
import { ChevronRight } from "lucide-react";
import { Separator } from "../../ui/separator";
import {
    Card,
    CardContent
} from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export const Popular = () => {
    const locale = localStorage.getItem("locale");
    const t = useTranslations("Pages.Popular");
    const { data: popularTrips } = usePopularTrips();

    return (
        <section
            className="flex flex-col items-center justify-center w-full px-4 bg-neutral-100 py-20"
            aria-labelledby="popular-title"
        >
            <div className="flex flex-col items-center text-center gap-4">
                <h1 id="popular-title" className="title-2 text-3xl font-bold">
                    {t("Title")}
                </h1>
            </div>

            <Carousel
                className="mt-10 w-full max-w-6xl"
                opts={{
                    align: "start",
                    loop: true,
                }}
            >
                <CarouselContent>
                    {popularTrips?.data.trips.slice(0, 6).map((item: any) => (
                        <CarouselItem
                            key={item.id}
                            className="md:basis-1/2 lg:basis-1/3"
                        >
                            <Link
                                href={`/trips/${item.id}`}
                                className="flex flex-col w-full h-full overflow-hidden group select-none cursor-pointer"
                                tabIndex={0}
                                aria-label={`${item.from} → ${item.to}`}
                            >

                                <Card className="flex flex-col gap-3 p-5 bg-white rounded-xl border hover:border-emerald-500 smooth shadow-none">
                                    <CardContent className="flex flex-col gap-2 px-0!">
                                        <div className="flex items-center gap-3">
                                            <Image src="/location-green.svg" alt="location" width={18} height={18} />
                                            <div>
                                                <h1 className="text-lg font-bold">{item.from_location.address}</h1>
                                                <p className="text-muted-foreground text-xs">
                                                    {locale === "uz" && item.from_location.fromRegion.nameUz}
                                                    {locale === "ru" && item.from_location.fromRegion.nameRu}
                                                    {locale === "en" && item.from_location.fromRegion.nameEn}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-0.5 h-8 bg-neutral-300 ml-1.5" />
                                        <div className="flex items-center gap-3">
                                            <Image src="/location-red.svg" alt="location" width={18} height={18} />
                                            <div>
                                                <h1 className="text-lg font-bold">{item.to_location.address}</h1>
                                                <p className="text-muted-foreground text-xs">
                                                    {locale === "uz" && item.to_location.toRegion.nameUz}
                                                    {locale === "ru" && item.to_location.toRegion.nameRu}
                                                    {locale === "en" && item.to_location.toRegion.nameEn}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>

                                    <Separator />

                                    <div className="flex items-center justify-between w-full mt-2">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground">{t("From")}</span>
                                            <h1 className="text-xl font-bold">
                                                {item.price.final_price.toLocaleString()} UZS
                                            </h1>
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
    );
};
