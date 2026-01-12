import React, { use } from "react";
import { Locale, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { AlertTriangle, Eye, Lock, Shield } from "lucide-react";

export const Help = () => {
  const t = useTranslations("Pages.Help");

  return (
    <section className="relative min-h-screen w-full bg-linear-to-br from-teal-500 via-emerald-500 to-emerald-500 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Illustration */}
          <div className="relative order-2 lg:order-1">
            <div className="relative w-full aspect-square max-w-lg mx-auto lg:block">
              {/* Main shield illustration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-52 h-58 sm:w-64 sm:h-72">
                  {/* Shield background */}
                  <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-2xl">
                    <defs>
                      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 0.9 }} />
                        <stop offset="100%" style={{ stopColor: "#ffffff", stopOpacity: 0.7 }} />
                      </linearGradient>
                    </defs>
                    <path
                      d="M100 10 L180 40 L180 100 Q180 160 100 210 Q20 160 20 100 L20 40 Z"
                      fill="url(#shieldGradient)"
                      stroke="#14b8a6"
                      strokeWidth="3"
                    />
                  </svg>

                  {/* Check mark */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="size-24 sm:size-32">
                      <path
                        d="M20 50 L40 70 L80 30"
                        fill="none"
                        stroke="#14b8a6"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-pulse"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Floating security icons */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl">
                <Lock className="size-6 sm:size-8 text-emerald-600" />
              </div>
              <div className="absolute bottom-4 left-8 bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl">
                <Eye className="size-6 sm:size-8 text-emerald-600" />
              </div>

              <div className="absolute top-1/4 -left-2 bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl">
                <AlertTriangle className="size-6 sm:size-8 text-amber-500" />
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="order-1 lg:order-2 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                <Shield className="w-5 h-5 text-white" />
                <span className="text-white font-medium text-sm">{t("Security")}</span>
              </div>

              <h2 className="title-2 text-white leading-tight">{t("Title")}</h2>

              <p className="text-base text-white/90 leading-relaxed">
                {t("Subtitle")
                  .split("Yo'ldosh")
                  .map((part, i, arr) =>
                    i === arr.length - 1 ? (
                      part
                    ) : (
                      <React.Fragment key={i}>
                        {part}
                        <span className="font-bold">Yo'ldosh</span>
                      </React.Fragment>
                    )
                  )}
              </p>
            </div>

            {/* Tips */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">{t("Protect.Title")}</h3>

              <div className="space-y-3">
                {["1", "2", "3", "4"].map((num, index) => (
                  <div
                    key={num}
                    className="flex items-start gap-3 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center mt-0.5">
                      <span className="text-emerald-600 font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-white/95 text-base leading-relaxed">{t(`Protect.${num}`)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom message */}
            <div className="pt-6 border-t border-white/20">
              <h3 className="text-xl font-bold text-white">{t("Security")}</h3>
              <p className="text-white/90 text-lg">
                {t("BeCareful")
                  .split("Yo'ldosh")
                  .map((part, i, arr) =>
                    i === arr.length - 1 ? (
                      part
                    ) : (
                      <React.Fragment key={i}>
                        {part}
                        <span className="font-semibold text-white">Yo'ldosh</span>
                      </React.Fragment>
                    )
                  )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
