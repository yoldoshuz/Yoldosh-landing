import { useTranslations } from 'next-intl';

export const AboutUs = () => {
    const t = useTranslations("Pages.About");

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <article className="prose prose-lg dark:prose-invert max-w-none">
                <h1 className="text-4xl font-bold mb-6">{t("title")}</h1>

                <p className="text-lg text-muted-foreground mb-8">
                    {t("intro")}
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">{t("problem.title")}</h2>
                    <p className="mb-4">{t("problem.content")}</p>
                    <p>{t("problem.solution")}</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">{t("howItWorks.title")}</h2>
                    <p className="mb-4">{t("howItWorks.intro")}</p>

                    <h3 className="text-xl font-semibold mb-3">{t("howItWorks.passengers.title")}</h3>
                    <p className="mb-4">{t("howItWorks.passengers.content")}</p>

                    <h3 className="text-xl font-semibold mb-3">{t("howItWorks.drivers.title")}</h3>
                    <p className="mb-4">{t("howItWorks.drivers.registration")}</p>
                    <p>{t("howItWorks.drivers.benefits")}</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">{t("guarantee.title")}</h2>
                    <p className="mb-4">{t("guarantee.content")}</p>
                    <p>{t("guarantee.benefit")}</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">{t("payment.title")}</h2>
                    <p className="mb-4">{t("payment.methods")}</p>
                    <p>{t("payment.cash")}</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">{t("loyalty.title")}</h2>
                    <p className="mb-4">{t("loyalty.content")}</p>
                    <p>{t("loyalty.campaigns")}</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">{t("geography.title")}</h2>
                    <p className="mb-4">{t("geography.content")}</p>
                    <p>{t("geography.apps")}</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">{t("mission.title")}</h2>
                    <p className="mb-4">{t("mission.content")}</p>
                    <p>{t("mission.guarantees")}</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">{t("future.title")}</h2>
                    <p>{t("future.content")}</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">{t("notTaxi.title")}</h2>
                    <p>{t("notTaxi.content")}</p>
                </section>

                <div className="mt-12 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-lg font-medium">{t("conclusion")}</p>
                </div>
            </article>
        </div>
    );
};