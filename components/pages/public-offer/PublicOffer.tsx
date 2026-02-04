import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";

export const PublicOffer = () => {
    const t = useTranslations("Pages.PublicOffer");

    return (
        <article className="container mx-auto px-3 sm:px-6 py-12 max-w-4xl text-sm leading-relaxed text-neutral-900 bg-white">
            {/* ЗАГОЛОВОК */}
            <header className="mb-6">
                <h2 className="text-center text-2xl font-bold">
                    {t("title")}
                </h2>
                <h3 className="text-center text-base mb-3">
                    {t("subtitle")}
                </h3>
                <p className="text-neutral-600">
                    {t("date")} · {t("city")}
                </p>
            </header>

            {/* ВСТУПЛЕНИЕ */}
            <section className="section-padding">
                <p>{t("intro")}</p>
            </section>

            {/* 1. ТЕРМИНЫ И ОПРЕДЕЛЕНИЯ */}
            <section className="section-padding section-text">
                <h2 className="section-title">
                    {t("terms.title")}
                </h2>
                <p>{t("terms.1")}</p>
                <p>{t("terms.2")}</p>
                <p>{t("terms.3")}</p>
                <p>{t("terms.4")}</p>
                <p>{t("terms.5")}</p>
                <p>{t("terms.6")}</p>
                <p>{t("terms.7")}</p>
                <p>{t("terms.8")}</p>
                <p>{t("terms.9")}</p>
            </section>

            {/* 2. ПРЕДМЕТ ДОГОВОРА */}
            <section className="section-padding section-text">
                <h2 className="section-title">
                    {t("subject.title")}
                </h2>
                <p>{t("subject.1")}</p>
                <p>{t("subject.2")}</p>
                <p>{t("subject.3")}</p>
            </section>

            {/* 3. ПОРЯДОК АКЦЕПТА ОФЕРТЫ */}
            <section className="section-padding section-text">
                <h2 className="section-title">
                    {t("acceptance.title")}
                </h2>
                <p>{t("acceptance.1")}</p>
                <p className="section-subtitle">{t("acceptance.2")}</p>
                <ul className="section-subsection">
                    <li>{t("acceptance.2_1")}</li>
                    <li>{t("acceptance.2_2")}</li>
                </ul>
                <p>{t("acceptance.3")}</p>
                <p className="section-subtitle">{t("acceptance.4")}</p>
                <ul className="section-subsection">
                    <li>{t("acceptance.4_1")}</li>
                    <li>{t("acceptance.4_2")}</li>
                    <li>{t("acceptance.4_3")}</li>
                    <li>{t("acceptance.4_4")}</li>
                </ul>
            </section>

            {/* 4. ПРАВА И ОБЯЗАННОСТИ СТОРОН */}
            <section className="section-padding section-text">
                <h2 className="section-title">
                    {t("rights.title")}
                </h2>
                <h3 className="section-subtitle">
                    {t("rights.executorObliges")}
                </h3>
                <ul className="section-subsection">
                    <li>{t("rights.executorObliges1")}</li>
                    <li>{t("rights.executorObliges2")}</li>
                    <li>{t("rights.executorObliges3")}</li>
                    <li>{t("rights.executorObliges4")}</li>
                    <li>{t("rights.executorObliges5")}</li>
                </ul>
                <h3 className="section-subtitle">
                    {t("rights.executorRights")}
                </h3>
                <ul className="section-subsection">
                    <li>{t("rights.executorRights1")}</li>
                    <li>{t("rights.executorRights2")}</li>
                    <li>{t("rights.executorRights3")}</li>
                    <li>{t("rights.executorRights4")}</li>
                    <li>{t("rights.executorRights5")}</li>
                </ul>
                <h3 className="section-subtitle">
                    {t("rights.userPassengerObliges")}
                </h3>
                <ul className="section-subsection">
                    <li>{t("rights.userPassengerObliges1")}</li>
                    <li>{t("rights.userPassengerObliges2")}</li>
                    <li>{t("rights.userPassengerObliges3")}</li>
                    <li>{t("rights.userPassengerObliges4")}</li>
                    <li>{t("rights.userPassengerObliges5")}</li>
                </ul>
                <h3 className="section-subtitle">
                    {t("rights.userDriverObliges")}
                </h3>
                <ul className="section-subsection">
                    <li>{t("rights.userDriverObliges1")}</li>
                    <li>{t("rights.userDriverObliges2")}</li>
                    <li>{t("rights.userDriverObliges3")}</li>
                    <li>{t("rights.userDriverObliges4")}</li>
                    <li>{t("rights.userDriverObliges5")}</li>
                    <li>{t("rights.userDriverObliges6")}</li>
                    <li>{t("rights.userDriverObliges7")}</li>
                    <li>{t("rights.userDriverObliges8")}</li>
                    <li>{t("rights.userDriverObliges9")}</li>
                </ul>
                <h3 className="section-subtitle">
                    {t("rights.userRights")}
                </h3>
                <ul className="section-subsection">
                    <li>{t("rights.userRights1")}</li>
                    <li>{t("rights.userRights2")}</li>
                    <li>{t("rights.userRights3")}</li>
                </ul>
            </section>

            {/* 5. СТОИМОСТЬ УСЛУГ И ПОРЯДОК РАСЧЕТОВ */}
            <section className="section-padding section-text">
                <h2 className="section-title">
                    {t("pricing.title")}
                </h2>
                <p>{t("pricing.1")}</p>
                <p>{t("pricing.2")}</p>
                <p>{t("pricing.3")}</p>
                <p>{t("pricing.4")}</p>
                <p>{t("pricing.5")}</p>
                <p>{t("pricing.6")}</p>
                <p>{t("pricing.7")}</p>
                <p>{t("pricing.8")}</p>
                <p>{t("pricing.9")}</p>
            </section>

            {/* 6. ПРАВИЛА ИСПОЛЬЗОВАНИЯ И ОТВЕТСТВЕННОСТЬ */}
            <section className="section-padding section-text">
                <h2 className="section-title">
                    {t("liability.title")}
                </h2>
                <p className="section-subtitle">{t("liability.1")}</p>
                <ul className="section-subsection">
                    <li>{t("liability.1_1")}</li>
                    <li>{t("liability.1_2")}</li>
                    <li>{t("liability.1_3")}</li>
                    <li>{t("liability.1_4")}</li>
                    <li>{t("liability.1_5")}</li>
                    <li>{t("liability.1_6")}</li>
                    <li>{t("liability.1_7")}</li>
                    <li>{t("liability.1_8")}</li>
                </ul>
                <p className="section-subtitle">{t("liability.2")}</p>
                <ul className="section-subsection">
                    <li>{t("liability.2_1")}</li>
                    <li>{t("liability.2_2")}</li>
                    <li>{t("liability.2_3")}</li>
                </ul>
                <p>{t("liability.3")}</p>
                <p>{t("liability.4")}</p>
                <p>{t("liability.5")}</p>
                <p>{t("liability.6")}</p>
                <p>{t("liability.7")}</p>
            </section>

            {/* 7. КОНФИДЕНЦИАЛЬНОСТЬ И ПЕРСОНАЛЬНЫЕ ДАННЫЕ */}
            <section className="section-padding section-text">
                <h2 className="section-title">
                    {t("privacy.title")}
                </h2>
                <p>{t("privacy.1")}</p>
                <p>{t("privacy.2")}</p>
                <p>{t("privacy.3")}</p>
            </section>

            {/* 8. РАЗРЕШЕНИЕ СПОРОВ */}
            <section className="section-padding section-text">
                <h2 className="section-title">
                    {t("disputes.title")}
                </h2>
                <p>{t("disputes.1")}</p>
                <p>{t("disputes.2")}</p>
                <p>{t("disputes.3")}</p>
                <p>{t("disputes.4")}</p>
            </section>

            {/* 9. СРОК ДЕЙСТВИЯ И РАСТОРЖЕНИЕ */}
            <section className="section-padding section-text">
                <h2 className="section-title">
                    {t("termination.title")}
                </h2>
                <p>{t("termination.1")}</p>
                <p>{t("termination.2")}</p>
                <p>{t("termination.3")}</p>
                <p>{t("termination.4")}</p>
                <p>{t("termination.5")}</p>
            </section>

            {/* 10. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ */}
            <section className="section-padding section-text">
                <h2 className="section-title">
                    {t("final.title")}
                </h2>
                <ul className="space-y-4">
                    <li>{t("final.1")}</li>
                    <li>{t("final.2")}</li>
                    <li>{t("final.3")}</li>
                    <li>{t("final.4")}</li>
                    <li>{t("final.5")}</li>
                    <li>{t("final.6")}</li>
                </ul>
            </section>

            <Separator />

            {/* РЕКВИЗИТЫ ИСПОЛНИТЕЛЯ */}
            <section className="section-padding section-text mt-10 text-end">
                <h2 className="section-title">
                    {t("requisites.title")}
                </h2>
                <p className="section-subtitle">{t("requisites.company")}</p>
                <p>{t("requisites.address")}</p>
                <p>{t("requisites.inn")}</p>
                <p>{t("requisites.account")}</p>
                <p>{t("requisites.bank")}</p>
                <p>{t("requisites.mfo")}</p>
                <p>{t("requisites.phone")}</p>
                <p>{t("requisites.email")}</p>
                <p>{t("requisites.director")}</p>
            </section>
        </article>
    );
};