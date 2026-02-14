import { Link } from '@/app/i18n/routing';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from "next-intl";

export const HowItWorks = () => {
  const t = useTranslations("Pages.HowItWorks");

  return (
    <section className="flex flex-col w-full max-w-6xl mx-auto px-4 bg-white">
      <div className="flex flex-col items-center justify-center my-12 gap-4">
        <div className="flex flex-col items-center justify-center sm:rounded-4xl rounded-2xl bg-emerald-600 text-white w-full py-8 px-6 gap-8">
          <h3 className="title-2">{t("Title")}</h3>
          <h3 className="text-neutral-200 text-start sm:text-center max-w-2xl">{t("Subtitle")}</h3>
          <Button className="text-base p-4! rounded-full bg-white text-emerald-600 font-bold hover:bg-neutral-200 cursor-pointer">
            <ArrowRight />
            {t("Share")}
          </Button>
        </div>
        <div className="flex flex-1 md:flex-row flex-col items-start justify-center gap-6 w-full mt-12 px-4">
          <div className="flex flex-col items-start gap-4 w-full">
            <h3 className="font-bold text-2xl">{t("Features.1.Title")}</h3>
            <p className="text-muted-foreground">{t("Features.1.Description")}</p>
          </div>
          <div className="flex flex-col items-start gap-4 w-full">
            <h3 className="font-bold text-2xl">{t("Features.2.Title")}</h3>
            <p className="text-muted-foreground">{t("Features.2.Description")}</p>
          </div>
          <div className="flex flex-col items-start gap-4 w-full">
            <h3 className="font-bold text-2xl">{t("Features.3.Title")}</h3>
            <p className="text-muted-foreground">{t("Features.3.Description")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
