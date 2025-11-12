"use client"

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { tripItems } from "@/constants";
import * as React from "react";

export const Popular = () => {
    const t = useTranslations("Pages.Popular");
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    );

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
                    {tripItems().map((item) => (
                        <CarouselItem
                            key={item.id}
                            className="pl-2 sm:pl-3 md:pl-4 basis-1/3 sm:basis-1/2 lg:basis-1/3 box-border"
                        >
                            <div
                                className="flex flex-col w-full h-full bg-white rounded-xl border hover:border-teal-500 smooth overflow-hidden group select-none cursor-pointer"
                                tabIndex={0}
                                aria-label={`${item.from} → ${item.to}`}
                            >
                                <div className="overflow-hidden relative">
                                    <Image
                                        src={item.image}
                                        alt={`${item.from} to ${item.to}`}
                                        width={300}
                                        height={300}
                                        className="object-cover w-full h-48 md:h-56 transition-transform duration-500 ease-in-out transform group-hover:scale-110"
                                        draggable={false}
                                    />
                                </div>

                                <div className="flex flex-col gap-3 p-5">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className="size-3 rounded-full border-2 border-teal-500" />
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
                                            className="rounded-full p-2 bg-teal-500 text-white hover:bg-teal-600 transition-colors"
                                        >
                                            <ChevronRight />
                                        </Button>
                                    </div>
                                </div>
                            </div>
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
