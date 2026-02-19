import { useTranslations } from "next-intl";

import { cardsItem, ourStats } from "@/constants";

export const AboutUs = () => {
  const t = useTranslations("Pages.About");

  return (
    <section>
      {/* HERO */}
      <div className="flex items-center justify-center h-56 w-full bg-emerald-500">
        <h3 className="font-bold text-3xl sm:text-5xl text-white">{t("heroTitle")}</h3>
      </div>

      {/* MISSION */}
      <section className="about-section">
        <h3 className="text-xl sm:text-2xl md:text-4xl font-normal sm:font-thin italic leading-8 sm:leading-10 md:leading-14 text-center">
          “{t("missionQuote")}”
        </h3>
        <p className="my-6 text-center text-lg sm:text-2xl text-muted-foreground font-light">{t("missionAuthor")}</p>

        <p className="mt-14 about-paragraph">{t("introText")}</p>
      </section>

      {/* ORIGIN */}
      <section className="bg-neutral-100 w-full">
        <article className="about-section">
          <h3 className="about-title">{t("originTitle")}</h3>

          <p className="mt-14 about-paragraph">{t("originText1")}</p>
          <p className="mt-10 about-paragraph">{t("originText2")}</p>

          <div className="mt-10 w-full py-12 px-6 sm:px-12 text-start sm:text-center text-white text-xl font-semibold bg-emerald-500 rounded-3xl">
            {t("originHighlight")}
          </div>

          <p className="mt-14 about-paragraph">{t("originText3")}</p>
          <p className="mt-10 about-paragraph">{t("originText4")}</p>
          <p className="mt-10 about-paragraph">{t("originText5")}</p>
        </article>
      </section>

      {/* STATS */}
      <section className="bg-white w-full">
        <article className="about-section">
          <h3 className="about-title">{t("statsTitle")}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-24 mt-14">
            {ourStats().map((stat, index) => (
              <div key={index} className="flex flex-col items-center justify-start gap-4">
                <h4 className="text-5xl font-bold text-emerald-500">{stat.title}</h4>
                <p className="text-center text-lg text-neutral-600">{stat.description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* IMPACT */}
      <section className="bg-neutral-100 w-full">
        <article className="about-section">
          <h3 className="about-title">{t("impactTitle")}</h3>

          <p className="mt-10 text-xl text-neutral-700">{t("impactText")}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-14">
            {cardsItem().map((card, index) => (
              <div key={index} className="flex flex-col items-center justify-start gap-4 bg-white p-8 rounded-3xl">
                <h4 className="text-2xl font-bold text-neutral-800">{card.title}</h4>
                <p className="text-start text-lg text-neutral-600">{card.description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </section>
  );
};
