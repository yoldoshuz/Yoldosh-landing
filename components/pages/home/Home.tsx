import { useTranslations } from "next-intl";

import { Suspense } from "react";
import { SearchTrips } from "../../shared/trip/SearchTrips";
import { Headset, Loader2, MapPin, User } from "lucide-react";
import { NumberTicker } from "@/components/ui/magic/number-ticker";

export const Home = () => {
  const t = useTranslations("Pages.Home");

  return (
    <section className="flex flex-col items-center justify-center w-full px-4 my-20">
      <div className="flex flex-col items-center justify-center max-w-6xl">
        {/* SEO-оптимизированный контент */}
        <h1 className="title-1 text-center">{t("Title")}</h1>

        {/* Видимый SEO-контент для поисковиков */}
        <div className="text-center max-w-3xl my-4">
          <p className="subtitle-text">
            {t("Subtitle")} <span className="link"> Yo'ldosh</span>
          </p>

          {/* Дополнительный SEO-текст (можно скрыть визуально, но оставить для поисковиков) */}
          <div className="sr-only">
            <p>
              Сервис совместных поездок Yoldosh предлагает безопасные и экономичные
              междугородние поездки по Узбекистану. Популярные направления:
              Ташкент - Самарканд, Ташкент - Бухара, Ташкент - Фергана,
              Самарканд - Бухара. Бронируйте поездки онлайн за несколько минут
              с гарантией безопасности и комфорта. Проверенные водители,
              низкие цены, круглосуточная поддержка.
            </p>
          </div>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="size-8 animate-spin text-emerald-500" />
          </div>
        }>
          <SearchTrips />
        </Suspense>

        <div className="flex items-center justify-center flex-wrap mt-16 gap-18">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-1">
              <MapPin className="size-8 text-4xl font-bold text-emerald-500" strokeWidth={3} />
              <NumberTicker
                value={100}
                className="text-4xl font-bold tracking-tighter whitespace-pre-wrap text-emerald-500"
              />
            </div>
            <h2 className="text-sm text-muted-foreground">{t("Trips")}</h2>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-1">
              <User className="size-8 text-4xl font-bold text-emerald-500" strokeWidth={3} />
              <NumberTicker
                value={100}
                className="text-4xl font-bold tracking-tighter whitespace-pre-wrap text-emerald-500"
              />
            </div>
            <h2 className="text-sm text-muted-foreground">{t("Drivers")}</h2>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-2">
              <Headset className="size-8 text-4xl font-bold text-emerald-500" strokeWidth={3} />
              <p className="text-4xl font-bold text-emerald-500" aria-label="Круглосуточная поддержка">24/7</p>
            </div>
            <h2 className="text-sm text-muted-foreground">{t("Support")}</h2>
          </div>
        </div>
      </div>
    </section>
  );
};