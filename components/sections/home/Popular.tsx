"use client"

import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { usePopularTrips } from "@/hooks/useTrips";

import { Button } from "../../ui/button";
import { ChevronRight } from "lucide-react";
import { Separator } from "../../ui/separator";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export const Popular = () => {
    const t = useTranslations("Pages.Popular");
    const plugin = useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    );
    
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
                plugins={[plugin.current]}
                className="relative flex flex-col items-center justify-center gap-6 mt-10 w-full max-w-6xl overflow-hidden"
                opts={{
                    align: "start",
                    loop: true,
                }}
            >
                <CarouselContent className="flex -ml-2 sm:-ml-3 md:-ml-4 px-2 sm:px-3 md:px-4">
                    {popularTrips?.data.trips.map((item: any) => (
                        <CarouselItem
                            key={item.id}
                            className="pl-2 sm:pl-3 md:pl-4 basis-1/4 sm:basis-1/4 box-border"
                        >
                            <Link
                                href={`/trips/${item.id}`}
                                className="flex flex-col w-full h-full bg-white rounded-xl border hover:border-green-500 smooth overflow-hidden group select-none cursor-pointer"
                                tabIndex={0}
                                aria-label={`${item.from} → ${item.to}`}
                            >

                                <div className="flex flex-col gap-3 p-5">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className="size-3 rounded-full border-2 border-green-500" />
                                            <h1 className="font-semibold">{item.from}</h1>
                                        </div>
                                        <div className="w-0.5 h-6 bg-neutral-300 ml-1" />
                                        <div className="flex items-center gap-3">
                                            <span className="size-3 rounded-full bg-muted-foreground" />
                                            <h1 className="font-semibold">{item.to}</h1>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between w-full mt-2">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground">{t("From")}</span>
                                            <h1 className="text-xl font-bold">
                                                {item.price.toLocaleString()}{" "}
                                                <span className="text-xs text-muted-foreground font-normal">
                                                    {t("Sum")}
                                                </span>
                                            </h1>
                                        </div>
                                        <Button
                                            variant="secondary"
                                            className="rounded-full p-2 bg-green-500 text-white hover:bg-green-600 transition-colors"
                                        >
                                            <ChevronRight />
                                        </Button>
                                    </div>
                                </div>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Стрелки адаптивно позиционируются */}
                <CarouselPrevious className="hidden sm:flex left-2 md:-left-10" />
                <CarouselNext className="hidden sm:flex right-2 md:-right-10" />
            </Carousel>
        </section>
    );
};
