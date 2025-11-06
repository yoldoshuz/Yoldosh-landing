import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { CalendarSelect } from "@/components/shared/Calendar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Home = () => {
    const t = useTranslations("Pages.Home");

    return (
        <section className="flex flex-col items-center justify-center w-full px-4 my-20">
            <div className="flex flex-col items-center justify-center max-w-6xl">
                <h1 className="title-1 text-center">{t("Title")}</h1>
                <p className="subtitle-text my-8 text-center">
                    {t("Subtitle")} <span className="link">Yo'ldosh</span>
                </p>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-2 shadow-2xl border p-6 md:py-2 md:pl-8 md:pr-2 rounded-3xl md:rounded-full">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4">
                        <div className="flex items-center justify-center gap-2 w-full  border-b md:border-b-0 md:border-r py-1">
                            <div className="flex items-center justify-center size-6 border-2 border-teal-500 rounded-full p-2">
                                <span className="bg-teal-500 rounded-full p-1" />
                            </div>
                            <Input placeholder="From" className="border-none rounded-none shadow-none text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-center gap-2 w-full border-b md:border-b-0 md:border-r py-1">
                            <div className="flex items-center justify-center size-6 border-2 border-muted-foreground rounded-full p-2">
                                <span className="bg-muted-foreground rounded-full p-1" />
                            </div>
                            <Input placeholder="To" className="border-none rounded-none shadow-none text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-center gap-2 w-full  border-b md:border-b-0 md:border-r py-1">
                            <CalendarSelect />
                        </div>
                        <div className="flex items-center justify-center gap-2 w-full">
                            <Select>
                                <SelectTrigger className="bg-transparent border-none shadow-none w-full px-0">
                                    <SelectValue placeholder={
                                        <div className="flex items-center gap-4">
                                            <UserRound className="size-6" />
                                            {t("Passengers.Title")}
                                        </div>
                                    }>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">{t("Passengers.1")}</SelectItem>
                                    <SelectItem value="2">{t("Passengers.2")}</SelectItem>
                                    <SelectItem value="3">{t("Passengers.3")}</SelectItem>
                                    <SelectItem value="4">{t("Passengers.4")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-center gap-2 w-full h-full">
                            <Button className="btn-primary w-full py-6 md:py-10 rounded-2xl md:rounded-full text-xl">
                                {t("Search")}
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center flex-wrap mt-16 gap-12">
                    <div className="flex flex-col items-center">
                        <h1 className="text-4xl font-bold text-teal-500">50K+</h1>
                        <h3 className="text-sm text-muted-foreground">{t("Trips")}</h3>
                    </div>
                    <div className="flex flex-col items-center">
                        <h1 className="text-4xl font-bold text-teal-500">10K+</h1>
                        <h3 className="text-sm text-muted-foreground">{t("Drivers")}</h3>
                    </div>
                    <div className="flex flex-col items-center">
                        <h1 className="text-4xl font-bold text-teal-500">4.9</h1>
                        <h3 className="text-sm text-muted-foreground">{t("Rating")}</h3>
                    </div>
                    <div className="flex flex-col items-center">
                        <h1 className="text-4xl font-bold text-teal-500">24/7</h1>
                        <h3 className="text-sm text-muted-foreground">{t("Support")}</h3>
                    </div>
                </div>
            </div>
        </section>
    );
};