import { Suspense } from "react";
import { Headset, Loader2, MapPin, User } from "lucide-react";
import { useTranslations } from "next-intl";

import { SearchTrips } from "../../shared/trip/SearchTrips";

export const Home = () => {
  const t = useTranslations("Pages.Home");

  return (
    <section className="flex flex-col items-center justify-center w-full px-4 my-20">
      <div className="flex flex-col items-center justify-center max-w-6xl">
        {/* SEO-оптимизированный контент */}
        <h1 className="title-1 text-center">{t("Title")}</h1>

        {/* Видимый SEO-контент для поисковиков */}
        <div className="text-center max-w-3xl my-4">
          {/* Дополнительный SEO-текст (можно скрыть визуально, но оставить для поисковиков) */}
          <div className="sr-only">
            <p>
              Сервис совместных поездок Yoldosh предлагает безопасные и экономичные междугородние поездки по
              Узбекистану. Популярные направления: Ташкент - Самарканд, Ташкент - Бухара, Ташкент - Фергана, Самарканд -
              Бухара. Бронируйте поездки онлайн за несколько минут с гарантией безопасности и комфорта. Проверенные
              водители, низкие цены, круглосуточная поддержка.
            </p>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="size-8 animate-spin text-emerald-500" />
            </div>
          }
        >
          <SearchTrips />
        </Suspense>
      </div>
    </section>
  );
};
