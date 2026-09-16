import { useLocale } from "next-intl";

import { LanguageSwitcherSelect } from "./LanguageSwitcherSelect";

export const LanguageSwitcher = ({ className }: { className?: string }) => {
  const locale = useLocale();

  return (
    <LanguageSwitcherSelect
      className={className}
      defaultValue={locale}
      items={[
        {
          value: "uz",
          label: "O'zbekcha",
        },
        {
          value: "ru",
          label: "Русский",
        },
        {
          value: "en",
          label: "English",
        },
      ]}
    />
  );
};
