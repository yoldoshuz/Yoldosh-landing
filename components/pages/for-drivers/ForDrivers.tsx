"use client";

import {
  AlertTriangle,
  Car,
  CheckCircle2,
  Clock,
  CreditCard,
  MessageCircle,
  Shield,
  Star,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";
import { useTranslations } from "next-intl";

export const ForDrivers = () => {
  const t = useTranslations("Pages.ForDrivers");

  const steps = [
    { key: "profile", icon: <UserCheck className="size-6" /> },
    { key: "create", icon: <Car className="size-6" /> },
    { key: "booking", icon: <Users className="size-6" /> },
    { key: "payment", icon: <Wallet className="size-6" /> },
  ];

  const tips = [
    { key: "reviews", icon: <Star className="size-5 fill-emerald-400 text-emerald-400" /> },
    { key: "notify", icon: <MessageCircle className="size-5" /> },
    { key: "luggage", icon: <Car className="size-5" /> },
    { key: "breaks", icon: <Clock className="size-5" /> },
    { key: "safety", icon: <Shield className="size-5" /> },
    { key: "passengers", icon: <CheckCircle2 className="size-5" /> },
  ];

  const fraudWarnings = [t("fraud.1"), t("fraud.2"), t("fraud.3")];

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-linear-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-teal-300 blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">
            <Car className="size-4" />
            {t("hero.badge")}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight max-w-2xl">{t("hero.title")}</h1>
          <p className="text-white/85 text-lg max-w-xl leading-relaxed">{t("hero.subtitle")}</p>
          <div className="flex flex-wrap gap-6 justify-center mt-4">
            {["stat1", "stat2", "stat3"].map((k) => (
              <div key={k} className="flex flex-col items-center bg-white/15 backdrop-blur rounded-2xl px-6 py-4">
                <span className="text-3xl font-bold">{t(`hero.${k}.value`)}</span>
                <span className="text-white/75 text-sm mt-1">{t(`hero.${k}.label`)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-neutral-900 mb-2">{t("steps.title")}</h2>
        <p className="text-center text-muted-foreground mb-12">{t("steps.subtitle")}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.key}
              className="relative flex flex-col gap-4 bg-white rounded-3xl p-6 border hover:border-emerald-400 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-11 rounded-2xl bg-emerald-50 text-emerald-600">
                  {step.icon}
                </div>
                <span className="text-4xl font-black text-emerald-300 select-none">0{i + 1}</span>
              </div>
              <h3 className="font-bold text-lg text-neutral-900">{t(`steps.${step.key}.title`)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(`steps.${step.key}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-emerald-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 flex flex-col lg:flex-row gap-10 items-center">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm">
              <CreditCard className="size-4" />
              {t("pricing.badge")}
            </div>
            <h2 className="text-3xl font-bold">{t("pricing.title")}</h2>
            <p className="text-white/85 leading-relaxed">{t("pricing.desc")}</p>
            <p className="text-white/75 text-sm italic">{t("pricing.note")}</p>
          </div>
          <div className="flex-1 grid grid-cols-1 gap-4 w-full">
            {["rule1", "rule2", "rule3"].map((k) => (
              <div key={k} className="flex items-start gap-3 bg-white/15 backdrop-blur rounded-2xl p-4">
                <CheckCircle2 className="size-5 shrink-0 mt-0.5 text-emerald-200" />
                <p className="text-sm text-white/90">{t(`pricing.${k}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING TYPES */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-neutral-900 mb-2">{t("booking.title")}</h2>
        <p className="text-center text-muted-foreground mb-10">{t("booking.subtitle")}</p>
        <div className="grid sm:grid-cols-2 gap-6">
          {["instant", "manual"].map((type) => (
            <div
              key={type}
              className={`rounded-3xl p-8 border-2 ${type === "instant" ? "border-emerald-500 bg-emerald-50" : "border-neutral-200 bg-white"}`}
            >
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 ${type === "instant" ? "bg-emerald-500 text-white" : "bg-neutral-200 text-neutral-700"}`}
              >
                {t(`booking.${type}.badge`)}
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">{t(`booking.${type}.title`)}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t(`booking.${type}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TIPS */}
      <section className="bg-neutral-100">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-neutral-900 mb-2">{t("tips.title")}</h2>
          <p className="text-center text-muted-foreground mb-10">{t("tips.subtitle")}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tips.map((tip) => (
              <div key={tip.key} className="flex items-start gap-4 bg-white rounded-2xl p-5 border">
                <div className="flex items-center justify-center size-10 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                  {tip.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-1">{t(`tips.${tip.key}.title`)}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(`tips.${tip.key}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FRAUD WARNING */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="size-7 text-amber-500" />
            <h2 className="text-2xl font-bold text-amber-800">{t("fraud.title")}</h2>
          </div>
          <p className="text-amber-700 mb-6">{t("fraud.desc")}</p>
          <ul className="space-y-3">
            {fraudWarnings.map((w, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex items-center justify-center size-6 rounded-full bg-amber-200 text-amber-800 text-xs font-bold shrink-0 mt-0.5">
                  !
                </span>
                <span className="text-sm text-amber-800">{w}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-5 border-t border-amber-200">
            <p className="text-sm text-amber-700 font-medium">{t("fraud.contact")}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-linear-to-br from-emerald-500 to-teal-500 text-white">
        <div className="max-w-3xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-6">
          <h2 className="text-3xl font-bold">{t("cta.title")}</h2>
          <p className="text-white/85 text-lg">{t("cta.desc")}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="#"
              className="flex items-center gap-2 bg-white text-emerald-700 font-bold px-6 py-3 rounded-full hover:bg-emerald-50 transition-colors"
            >
              {t("cta.download")}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};
