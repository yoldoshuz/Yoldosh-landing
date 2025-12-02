import { useTranslations } from "next-intl";
import { SearchTrips } from "../../shared/trip/SearchTrips";

export const Home = () => {
    const t = useTranslations("Pages.Home");

    return (
        <section className="flex flex-col items-center justify-center w-full px-4 my-20">
            <div className="flex flex-col items-center justify-center max-w-6xl">
                <h1 className="title-1 text-center">{t("Title")}</h1>
                <p className="subtitle-text my-8 text-center">
                    {t("Subtitle")} <span className="link">Yo'ldosh</span>
                </p>
                <SearchTrips />
                <div className="flex items-center justify-center flex-wrap mt-16 gap-12">
                    <div className="flex flex-col items-center">
                        <h1 className="text-4xl font-bold text-emerald-500">100+</h1>
                        <h3 className="text-sm text-muted-foreground">{t("Trips")}</h3>
                    </div>
                    <div className="flex flex-col items-center">
                        <h1 className="text-4xl font-bold text-emerald-500">100+</h1>
                        <h3 className="text-sm text-muted-foreground">{t("Drivers")}</h3>
                    </div>
                    <div className="flex flex-col items-center">
                        <h1 className="text-4xl font-bold text-emerald-500">24/7</h1>
                        <h3 className="text-sm text-muted-foreground">{t("Support")}</h3>
                    </div>
                </div>
            </div>
        </section>
    );
};