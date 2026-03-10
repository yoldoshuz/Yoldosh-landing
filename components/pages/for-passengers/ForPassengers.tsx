"use client";

import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  Lock,
  MapPin,
  MessageCircle,
  Search,
  Shield,
  ShieldAlert,
  Star,
  UserCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";

export const ForPassengers = () => {
  const t = useTranslations("Pages.ForPassengers");

  const steps = [
    { key: "search", icon: <Search className="size-6" /> },
    { key: "choose", icon: <Star className="size-6" /> },
    { key: "chat", icon: <MessageCircle className="size-6" /> },
    { key: "book", icon: <CheckCircle2 className="size-6" /> },
  ];

  const safetyRules = [
    { key: "noprepay", icon: <Banknote className="size-5" />, color: "emerald" },
    { key: "cash", icon: <Lock className="size-5" />, color: "emerald" },
    { key: "data", icon: <Shield className="size-5" />, color: "emerald" },
    { key: "verify", icon: <UserCheck className="size-5" />, color: "emerald" },
  ];

  const tips = [
    { key: "reviews", icon: <Star className="size-5 fill-emerald-400 text-emerald-400" /> },
    { key: "contact", icon: <MessageCircle className="size-5" /> },
    { key: "children", icon: <UserCheck className="size-5" /> },
    { key: "parcels", icon: <ShieldAlert className="size-5" /> },
  ];

  const fraudSigns = [t("fraud.sign1"), t("fraud.sign2"), t("fraud.sign3")];

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-linear-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-80 h-80 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-teal-300 blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">
            <MapPin className="size-4" />
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

      {/* SAFETY */}
      <section className="bg-linear-to-br from-emerald-500 to-teal-500 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="size-7 text-emerald-200" />
            <h2 className="text-3xl font-bold">{t("safety.title")}</h2>
          </div>
          <p className="text-center text-white/80 mb-12">{t("safety.subtitle")}</p>
          <div className="grid sm:grid-cols-2 gap-5">
            {safetyRules.map((rule) => (
              <div key={rule.key} className="flex items-start gap-4 bg-white/15 backdrop-blur rounded-2xl p-5">
                <div className="flex items-center justify-center size-10 rounded-xl bg-white/20 shrink-0 text-white">
                  {rule.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{t(`safety.${rule.key}.title`)}</h3>
                  <p className="text-sm text-white/80 leading-relaxed">{t(`safety.${rule.key}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIPS */}
      <section className="bg-neutral-100">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-neutral-900 mb-2">{t("tips.title")}</h2>
          <p className="text-center text-muted-foreground mb-10">{t("tips.subtitle")}</p>
          <div className="grid sm:grid-cols-2 gap-4">
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
            {fraudSigns.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex items-center justify-center size-6 rounded-full bg-amber-200 text-amber-800 text-xs font-bold shrink-0 mt-0.5">
                  !
                </span>
                <span className="text-sm text-amber-800">{s}</span>
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
          <a
            href="#"
            className="flex items-center gap-2 bg-white text-emerald-700 font-bold px-6 py-3 rounded-full hover:bg-emerald-50 transition-colors"
          >
            {t("cta.download")}
          </a>
        </div>
      </section>
    </main>
  );
};
