import Link from 'next/link';
import { useTranslations } from 'next-intl';

export const HowItWorks = () => {
    const t = useTranslations("Pages.HowItWorks")

    return (
        <section className="flex flex-col items-center justify-center w-full px-4 bg-neutral-100">
            <div className="flex flex-col items-center justify-center my-20 gap-4">
                <h1 className="title-2">{t("Title")}</h1>
                <h3 className="subtitle-text text-center">{t("Subtitle")}</h3>
                <div className="flex grow flex-wrap items-center justify-center gap-12 mt-12">
                    <div className="flex flex-col items-start gap-4 max-w-[350px] p-8 card">
                        <h1 className="font-bold text-2xl">{t("Features.1.Title")}</h1>
                        <p className="text-muted-foreground">{t("Features.1.Description")}</p>
                        <Link href="" className='link'>{t("Features.Button")}</Link>
                    </div>
                    <div className="flex flex-col items-start gap-4 max-w-[350px] p-8 card">
                        <h1 className="font-bold text-2xl">{t("Features.2.Title")}</h1>
                        <p className="text-muted-foreground">{t("Features.2.Description")}</p>
                        <Link href="" className='link'>{t("Features.Button")}</Link>
                    </div>
                    <div className="flex flex-col items-start gap-4 max-w-[350px] p-8 card">
                        <h1 className="font-bold text-2xl">{t("Features.3.Title")}</h1>
                        <p className="text-muted-foreground">{t("Features.3.Description")}</p>
                        <Link href="" className='link'>{t("Features.Button")}</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};