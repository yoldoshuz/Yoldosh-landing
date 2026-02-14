import { Gauge, Globe2, HandCoins, Leaf, MessageCircle, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

export const WhyUs = () => {
  const t = useTranslations("Pages.WhyUs");

  const features = [
    {
      title: t("Cards.title1"),
      description: t("Cards.description1"),
      icon: <ShieldCheck />,
    },
    {
      title: t("Cards.title2"),
      description: t("Cards.description2"),
      icon: <Gauge />,
    },
    {
      title: t("Cards.title3"),
      description: t("Cards.description3"),
      icon: <HandCoins />,
    },
    {
      title: t("Cards.title4"),
      description: t("Cards.description4"),
      icon: <Globe2 />,
    },
    {
      title: t("Cards.title5"),
      description: t("Cards.description5"),
      icon: <Users />,
    },
    {
      title: t("Cards.title6"),
      description: t("Cards.description6"),
      icon: <MessageCircle />,
    },
    {
      title: t("Cards.title7"),
      description: t("Cards.description7"),
      icon: <RefreshCw />,
    },
    {
      title: t("Cards.title8"),
      description: t("Cards.description8"),
      icon: <Leaf />,
    },
  ];
  return (
    <section className="flex flex-col items-center justify-center w-full px-4 my-20">
      <h3 className="title-2 sm:text-center! text-start!">{t("Title")}</h3>
      <p className="subtitle-text sm:text-center! text-start! my-4">{t("Subtitle")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 relative z-0 py-10 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </section>
  );
};

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col border-l lg:border-r py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-linear-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-linear-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">{icon}</div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-emerald-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">{description}</p>
    </div>
  );
};
