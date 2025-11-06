import { useTranslations } from "next-intl";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";

export const Popular = () => {
    const t = useTranslations("Pages.Popular");

    return (
        <section className="flex flex-col items-center justify-center w-full px-4 bg-neutral-100 py-20">
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="title-2">{t("Title")}</h1>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8">
                <div className="flex flex-col w-full h-full card group">
                    <div className="overflow-hidden">
                        <Image
                            src="/city.jpg"
                            alt="city"
                            width={350}
                            height={75}
                            className="object-cover rounded-t-xl transition-transform duration-300 ease-in-out transform group-hover:scale-110"
                            draggable={false}
                        />
                    </div>
                    <div className="flex flex-col items-start justify-center gap-3 p-6">
                        <div className="flex items-center gap-3">
                            <span className="size-3 rounded-full border-2 border-teal-500" />
                            <h1 className="font-semibold">Tashkent</h1>
                        </div>
                        <div className="w-0.5 h-6 bg-neutral-300 ml-1" />
                        <div className="flex items-center gap-3">
                            <span className="size-3 rounded-full bg-muted-foreground" />
                            <h1 className="font-semibold">Samarkand</h1>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-0 justify-center">
                                <span className="text-xs text-muted-foreground">From</span>
                                <h1 className="text-xl font-bold">
                                    45 000 <span className="text-xs text-muted-foreground font-normal">sum</span>
                                </h1>
                            </div>
                            <Button className="btn-primary py-5 rounded-full"><ChevronRight /></Button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full h-full card group">
                    <div className="overflow-hidden">
                        <Image
                            src="/city.jpg"
                            alt="city"
                            width={350}
                            height={75}
                            className="object-cover rounded-t-xl transition-transform duration-300 ease-in-out transform group-hover:scale-110"
                            draggable={false}
                        />
                    </div>
                    <div className="flex flex-col items-start justify-center gap-3 p-6">
                        <div className="flex items-center gap-3">
                            <span className="size-3 rounded-full border-2 border-teal-500" />
                            <h1 className="font-semibold">Tashkent</h1>
                        </div>
                        <div className="w-0.5 h-6 bg-neutral-300 ml-1" />
                        <div className="flex items-center gap-3">
                            <span className="size-3 rounded-full bg-muted-foreground" />
                            <h1 className="font-semibold">Samarkand</h1>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-0 justify-center">
                                <span className="text-xs text-muted-foreground">From</span>
                                <h1 className="text-xl font-bold">
                                    45 000 <span className="text-xs text-muted-foreground font-normal">sum</span>
                                </h1>
                            </div>
                            <Button className="btn-primary py-5 rounded-full"><ChevronRight /></Button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full h-full card group">
                    <div className="overflow-hidden">
                        <Image
                            src="/city.jpg"
                            alt="city"
                            width={350}
                            height={75}
                            className="object-cover rounded-t-xl transition-transform duration-300 ease-in-out transform group-hover:scale-110"
                            draggable={false}
                        />
                    </div>
                    <div className="flex flex-col items-start justify-center gap-3 p-6">
                        <div className="flex items-center gap-3">
                            <span className="size-3 rounded-full border-2 border-teal-500" />
                            <h1 className="font-semibold">Tashkent</h1>
                        </div>
                        <div className="w-0.5 h-6 bg-neutral-300 ml-1" />
                        <div className="flex items-center gap-3">
                            <span className="size-3 rounded-full bg-muted-foreground" />
                            <h1 className="font-semibold">Samarkand</h1>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-0 justify-center">
                                <span className="text-xs text-muted-foreground">From</span>
                                <h1 className="text-xl font-bold">
                                    45 000 <span className="text-xs text-muted-foreground font-normal">sum</span>
                                </h1>
                            </div>
                            <Button className="btn-primary py-5 rounded-full"><ChevronRight /></Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};