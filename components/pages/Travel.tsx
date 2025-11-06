import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";

export const Travel = () => {
    const t = useTranslations("Pages.Travel")

    return (
        <section className="flex flex-col items-center justify-center w-full px-4 sm:px-8 bg-teal-500">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between my-20 gap-4 w-full max-w-6xl h-full">
                <div className="flex flex-col items-center md:items-start justify-start w-full h-full gap-6">
                    <h1 className="title-2 text-white w-full max-w-[450px]">{t("Title")}</h1>
                    <p className="text-white w-full max-w-[450px]">{t("Description")}</p>
                    <p className="text-white/80 italic">{t("Subtitle")}</p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                        <Button className="py-6">
                            <Image src="/apple.png" alt="apple" width={28} height={28} className="invert select-none" />
                            {t("AppStore")}
                        </Button>
                        <Button className="py-6">
                            <Image src="/play.png" alt="play" width={28} height={28} className="select-none" />
                            {t("GooglePlay")}
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col items-center md:items-end justify-center w-full h-full">
                    <Image src="/image.png" alt="image" width={300} height={300} className="object-contain" />
                </div>
            </div>
        </section>
    );
};