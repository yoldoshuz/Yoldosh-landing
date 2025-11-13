import React from "react";

import { Shield } from "lucide-react";
import { useTranslations } from "next-intl";

export const Help = () => {
    const t = useTranslations("Pages.Help");

    return (
        <section className="flex flex-col items-center justify-center w-full px-4 sm:px-8 bg-teal-500">
            <div className="flex flex-col my-20 gap-4 rounded-2xl shadow-xl border bg-white w-full max-w-4xl h-full px-6 sm:px-8 md:px-14 py-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-4">
                    <div className="bg-teal-200/50 p-3 rounded-2xl"><Shield className="text-teal-500 size-7" /></div>
                    <h1 className="title-3">{t("Title")}</h1>
                </div>
                <p className="mt-4 subtitle-text">{t("Subtitle").split("Yo'ldosh").map((part, i, arr) => i === arr.length - 1 ? part : <React.Fragment key={i}>{part}<span className="text-teal-500">Yo'ldosh</span></React.Fragment>)}</p>
                <div className="flex flex-col items-start justify-center gap-4 mt-8 bg-neutral-100 p-4 sm:px-6 rounded-xl">
                    <h1 className="title-4">{t("Protect.Title")}</h1>
                    <div className="flex items-center gap-3">
                        <span className="p-1 bg-teal-500 rounded-full" />
                        <p className="text-muted-foreground text-sm sm:text-base">
                            {t("Protect.1")}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="p-1 bg-teal-500 rounded-full" />
                        <p className="text-muted-foreground text-sm sm:text-base">
                            {t("Protect.2")}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="p-1 bg-teal-500 rounded-full" />
                        <p className="text-muted-foreground text-sm sm:text-base">
                            {t("Protect.3")}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="p-1 bg-teal-500 rounded-full" />
                        <p className="text-muted-foreground text-sm sm:text-base">
                            {t("Protect.4")}
                        </p>
                    </div>
                </div>
                <h3 className="title-4 mt-4">{t("Security")}</h3>
                <h3 className="subtitle-text mt-4">{t("BeCareful").split("Yo'ldosh").map((part, i, arr) => i === arr.length - 1 ? part : <React.Fragment key={i}>{part}<span className="text-teal-500">Yo'ldosh</span></React.Fragment>)}</h3>
            </div>
        </section>
    );
};