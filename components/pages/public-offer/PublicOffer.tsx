import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";

export const PublicOffer = () => {
    const t = useTranslations("Pages.PublicOffer");

    return (
        <article className="container mx-auto px-6 py-12 max-w-4xl text-sm leading-relaxed text-neutral-900 bg-white">
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
            <section className="mb-10 space-y-4">
                <p>{t("intro")}</p>
            </section>

            {/* 1. ТЕРМИНЫ И ОПРЕДЕЛЕНИЯ */}
            <section className="mb-10">
                <h2 className="text-center text-xl font-bold mb-4">
                    {t("terms.title")}
                </h2>

                <dl className="space-y-3">
                    <div>
                        {/* <dt className="font-medium">{t("terms.offerTitle")}</dt> */}
                        <dd className="text-neutral-700">{t("terms.1")}</dd>
                    </div>

                    <div>
                        {/* <dt className="font-medium">{t("terms.acceptanceTitle")}</dt> */}
                        <dd className="text-neutral-700">{t("terms.2")}</dd>
                    </div>

                    <div>
                        {/* <dt className="font-medium">{t("terms.userTitle")}</dt> */}
                        <dd className="text-neutral-700">{t("terms.3")}</dd>
                    </div>

                    <div>
                        {/* <dt className="font-medium">{t("terms.platformTitle")}</dt> */}
                        <dd className="text-neutral-700">{t("terms.4")}</dd>
                    </div>

                    <div>
                        {/* <dt className="font-medium">{t("terms.driverTitle")}</dt> */}
                        <dd className="text-neutral-700">{t("terms.5")}</dd>
                    </div>

                    <div>
                        {/* <dt className="font-medium">{t("terms.passengerTitle")}</dt> */}
                        <dd className="text-neutral-700">{t("terms.6")}</dd>
                    </div>

                    <div>
                        {/* <dt className="font-medium">{t("terms.tripTitle")}</dt> */}
                        <dd className="text-neutral-700">{t("terms.7")}</dd>
                    </div>

                    <div>
                        {/* <dt className="font-medium">{t("terms.verificationTitle")}</dt> */}
                        <dd className="text-neutral-700">{t("terms.8")}</dd>
                    </div>

                    <div>
                        {/* <dt className="font-medium">{t("terms.commissionTitle")}</dt> */}
                        <dd className="text-neutral-700">{t("terms.9")}</dd>
                    </div>
                </dl>
            </section>

            {/* 2. ПРЕДМЕТ ДОГОВОРА */}
            <section className="mb-10 space-y-4">
                <h2 className="text-center text-xl font-bold mb-4">
                    {t("subject.title")}
                </h2>
                <p>{t("subject.1")}</p>
                <p>{t("subject.2")}</p>
                <p>{t("subject.3")}</p>
            </section>

            {/* 3. ПОРЯДОК АКЦЕПТА ОФЕРТЫ */}
            <section className="mb-10 space-y-4">
                <h2 className="text-center text-xl font-bold mb-4">
                    {t("acceptance.title")}
                </h2>

                <p>{t("acceptance.1")}</p>
                <p>{t("acceptance.2")}</p>

                <ol className="list-decimal pl-5 space-y-2">
                    <li>{t("acceptance.2_1")}</li>
                    <li>{t("acceptance.2_2")}</li>
                </ol>

                <ul className="list-disc pl-5 space-y-1">
                    <li>{t("acceptance.3")}</li>
                    <li>{t("acceptance.4")}</li>
                    <li>{t("acceptance.4_1")}</li>
                    <li>{t("acceptance.4_2")}</li>
                    <li>{t("acceptance.4_3")}</li>
                    <li>{t("acceptance.4_4")}</li>
                </ul>
            </section>

            {/* 4. ПРАВА И ОБЯЗАННОСТИ СТОРОН */}
            <section className="mb-10">
                <h2 className="text-center text-xl font-bold mb-4">
                    {t("rights.title")}
                </h2>

                {/* Исполнитель обязуется */}
                <h3 className="font-medium mb-2 mt-6">
                    {t("rights.executorObliges")}
                </h3>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>{t("rights.executorObliges1")}</li>
                    <li>{t("rights.executorObliges2")}</li>
                    <li>{t("rights.executorObliges3")}</li>
                    <li>{t("rights.executorObliges4")}</li>
                    <li>{t("rights.executorObliges5")}</li>
                </ul>

                {/* Исполнитель имеет право */}
                <h3 className="font-medium mb-2 mt-6">
                    {t("rights.executorRights")}
                </h3>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>{t("rights.executorRights1")}</li>
                    <li>{t("rights.executorRights2")}</li>
                    <li>{t("rights.executorRights3")}</li>
                    <li>{t("rights.executorRights4")}</li>
                    <li>{t("rights.executorRights5")}</li>
                </ul>

                {/* Пользователь (пассажир) */}
                <h3 className="font-medium mb-2 mt-6">
                    {t("rights.userPassengerObliges")}
                </h3>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>{t("rights.userPassengerObliges1")}</li>
                    <li>{t("rights.userPassengerObliges2")}</li>
                    <li>{t("rights.userPassengerObliges3")}</li>
                    <li>{t("rights.userPassengerObliges4")}</li>
                    <li>{t("rights.userPassengerObliges5")}</li>
                </ul>

                {/* Водитель обязуется */}
                <h3 className="font-medium mb-2 mt-6">
                    {t("rights.userDriverObliges")}
                </h3>
                <ul className="list-disc pl-5 space-y-1">
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

                {/* Пользователь (общие обязанности) */}
                <h3 className="font-medium mb-2 mt-6">
                    {t("rights.userRights")}
                </h3>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>{t("rights.userRights1")}</li>
                    <li>{t("rights.userRights2")}</li>
                    <li>{t("rights.userRights3")}</li>
                </ul>
            </section>

            {/* 5. СТОИМОСТЬ УСЛУГ И ПОРЯДОК РАСЧЕТОВ */}
            <section className="mb-10 space-y-4">
                <h2 className="text-center text-xl font-bold mb-4">
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
            <section className="mb-10 space-y-4">
                <h2 className="text-center text-xl font-bold mb-4">
                    {t("liability.title")}
                </h2>

                <p className="font-medium mt-6">
                    {t("liability.1")}
                </p>

                <ul className="list-disc pl-5 space-y-1">
                    <li>{t("liability.1_1")}</li>
                    <li>{t("liability.1_2")}</li>
                    <li>{t("liability.1_3")}</li>
                    <li>{t("liability.1_4")}</li>
                    <li>{t("liability.1_5")}</li>
                    <li>{t("liability.1_6")}</li>
                    <li>{t("liability.1_7")}</li>
                    <li>{t("liability.1_8")}</li>
                </ul>

                <p className="font-medium mt-6">{t("liability.2")}</p>
                <ol className="list-decimal pl-5 space-y-1">
                    <li>{t("liability.2_1")}</li>
                    <li>{t("liability.2_2")}</li>
                    <li>{t("liability.2_3")}</li>
                </ol>

                <p className="font-medium mt-6">{t("liability.3")}</p>
                <p className="font-medium mt-6">{t("liability.4")}</p>
                <p className="font-medium mt-6">{t("liability.5")}</p>
                <p className="font-medium mt-6">{t("liability.6")}</p>
                <p className="font-medium mt-6">{t("liability.7")}</p>
            </section>

            {/* 7. КОНФИДЕНЦИАЛЬНОСТЬ И ПЕРСОНАЛЬНЫЕ ДАННЫЕ */}
            <section className="mb-10 space-y-4">
                <h2 className="text-center text-xl font-bold mb-4">
                    {t("privacy.title")}
                </h2>
                <p>{t("privacy.1")}</p>
                <p>{t("privacy.2")}</p>
                <p>{t("privacy.3")}</p>
            </section>

            {/* 8. РАЗРЕШЕНИЕ СПОРОВ */}
            <section className="mb-10 space-y-4">
                <h2 className="text-center text-xl font-bold mb-4">
                    {t("disputes.title")}
                </h2>
                <p>{t("disputes.1")}</p>
                <p>{t("disputes.2")}</p>
                <p>{t("disputes.3")}</p>
                <p>{t("disputes.4")}</p>
            </section>

            {/* 9. СРОК ДЕЙСТВИЯ И РАСТОРЖЕНИЕ */}
            <section className="mb-10 space-y-4">
                <h2 className="text-center text-xl font-bold mb-4">
                    {t("termination.title")}
                </h2>
                <p>{t("termination.1")}</p>
                <p>{t("termination.2")}</p>
                <p>{t("termination.3")}</p>
                <p>{t("termination.4")}</p>
                <p>{t("termination.5")}</p>
            </section>

            {/* 10. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ */}
            <section className="mb-10 space-y-4">
                <h2 className="text-center text-xl font-bold mb-4">
                    {t("final.title")}
                </h2>
                <ul className="list-disc pl-5 space-y-2">
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
            <section className="mt-12 space-y-2  rounded-lg text-end">
                <h2 className="text-center text-xl font-bold mb-4">
                    {t("requisites.title")}
                </h2>
                <p className="font-medium">{t("requisites.company")}</p>
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