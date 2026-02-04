import { useLocale } from 'next-intl';
import { LanguageSwitcherSelect } from './LanguageSwitcherSelect';

export const LanguageSwitcher = () => {
    const locale = useLocale();

    return (
        <LanguageSwitcherSelect
            defaultValue={locale}
            items={[
                {
                    value: 'uz',
                    label: "O'zbekcha",
                },
                {
                    value: 'ru',
                    label: "Русский",
                },
                {
                    value: 'en',
                    label: "English",
                }
            ]}
        />
    );
};