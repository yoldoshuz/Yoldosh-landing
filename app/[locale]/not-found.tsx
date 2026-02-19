import { Headset, Home } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/app/i18n/routing";
import { Footer } from "@/components/shared/widgets/Footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const t = useTranslations("Pages.NotFound");

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 min-h-screen">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-5xl mb-4 font-bold">404</h2>
          <h2 className="text-2xl font-bold">{t("Title")}</h2>
          <p className="text-sm text-muted-foreground">{t("Description")}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link href="/">
            <Button className="btn-primary" size="sm">
              <Home />
              {t("Button")}
            </Button>
          </Link>
          <Button variant="secondary" size="sm">
            <Headset />
            {t("RequestError")}
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}
