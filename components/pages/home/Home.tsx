import { useTranslations } from "next-intl";

import { NumberTicker } from "@/components/ui/magic/number-ticker";
import { SearchTrips } from "../../shared/trip/SearchTrips";

export const Home = () => {
  const t = useTranslations("Pages.Home");

  return (
    <section className="flex flex-col items-center justify-center w-full px-4 my-20">
      <div className="flex flex-col items-center justify-center max-w-6xl">
        {/* Additional SEO-friendly content */}
        <div className="hidden text-center max-w-3xl mb-8">
          <p className="text-muted-foreground">
            Популярные направления: Ташкент - Самарканд, Ташкент - Бухара, Ташкент - Фергана, Самарканд - Бухара.
            Бронируйте поездки онлайн за несколько минут с гарантией безопасности и комфорта.
          </p>
        </div>

        <h1 className="title-1 text-center">{t("Title")}</h1>
        <p className="subtitle-text my-8 text-center">
          {t("Subtitle")} <span className="link">Yo'ldosh</span>
        </p>
        <SearchTrips />
        <div className="flex items-center justify-center flex-wrap mt-16 gap-12">
          <div className="flex flex-col items-center">
            <NumberTicker
              value={100}
              className="text-4xl font-bold tracking-tighter whitespace-pre-wrap text-emerald-500"
            />
            <h3 className="text-sm text-muted-foreground">{t("Trips")}</h3>
          </div>
          <div className="flex flex-col items-center">
            <NumberTicker
              value={100}
              className="text-4xl font-bold tracking-tighter whitespace-pre-wrap text-emerald-500"
            />
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
