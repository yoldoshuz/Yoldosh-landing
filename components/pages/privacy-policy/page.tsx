import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";

export const PrivacyPolicy = () => {
  const t = useTranslations("Pages.PrivacyPolicy");

  return (
    <article className="container mx-auto px-3 sm:px-6 py-12 max-w-4xl text-sm leading-relaxed text-neutral-900 bg-white">
      {/* ЗАГОЛОВОК */}
      <header className="mb-6">
        <h2 className="text-center text-2xl font-bold">{t("title")}</h2>
        <h3 className="text-center text-base mb-3">{t("subtitle")}</h3>
        <p className="text-neutral-600 text-center">
          {t("effectiveDate")} <br />
          {t("lastUpdate")}
        </p>
      </header>

      <Separator className="my-6" />

      {/* 1. ОБЩИЕ ПОЛОЖЕНИЯ */}
      <section className="section-padding section-text">
        <h2 className="section-title">{t("general.title")}</h2>
        <p>{t("general.1")}</p>
        <p>{t("general.2")}</p>
        <p className="section-subtitle">{t("general.3")}</p>
        <ul className="section-subsection">
          <li>{t("general.3_1")}</li>
          <li>{t("general.3_2")}</li>
          <li>{t("general.3_3")}</li>
        </ul>
        <p>{t("general.4")}</p>
        <p>{t("general.5")}</p>
        <p>{t("general.6")}</p>
      </section>

      {/* 2. ТЕРМИНЫ И ОПРЕДЕЛЕНИЯ */}
      <section className="section-padding section-text">
        <h2 className="section-title">{t("definitions.title")}</h2>
        <p className="section-subtitle">{t("definitions.intro")}</p>
        <ul className="section-subsection">
          <li>{t("definitions.1")}</li>
          <li>{t("definitions.2")}</li>
          <li>{t("definitions.3")}</li>
          <li>{t("definitions.4")}</li>
          <li>{t("definitions.5")}</li>
          <li>{t("definitions.6")}</li>
          <li>{t("definitions.7")}</li>
        </ul>
      </section>

      {/* 3. КАКИЕ ПЕРСОНАЛЬНЫЕ ДАННЫЕ МЫ СОБИРАЕМ */}
      <section className="section-padding section-text">
        <h2 className="section-title">{t("collection.title")}</h2>
        
        <p className="section-subtitle">{t("collection.1")}</p>
        <ul className="section-subsection">
          {(t.raw("collection.1_list") as string[]).map((item, i) => (
             <li key={i}>{item}</li>
          ))}
        </ul>

        <p className="section-subtitle">{t("collection.2")}</p>
        <p className="font-medium mt-2">{t("collection.2_1")}</p>
        <ul className="section-subsection">
           {(t.raw("collection.2_1_list") as string[]).map((item, i) => (
             <li key={i}>{item}</li>
          ))}
        </ul>
        <p className="font-medium mt-2">{t("collection.2_2")}</p>
        <ul className="section-subsection">
           {(t.raw("collection.2_2_list") as string[]).map((item, i) => (
             <li key={i}>{item}</li>
          ))}
        </ul>

        <p className="section-subtitle">{t("collection.3")}</p>
        <ul className="section-subsection">
           {(t.raw("collection.3_list") as string[]).map((item, i) => (
             <li key={i}>{item}</li>
          ))}
        </ul>

        <p className="section-subtitle">{t("collection.4")}</p>
        <ul className="section-subsection">
           {(t.raw("collection.4_list") as string[]).map((item, i) => (
             <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      {/* 4. ЦЕЛИ ОБРАБОТКИ ПЕРСОНАЛЬНЫХ ДАННЫХ */}
      <section className="section-padding section-text">
        <h2 className="section-title">{t("purposes.title")}</h2>
        <p>{t("purposes.intro")}</p>

        <p className="section-subtitle">{t("purposes.1")}</p>
        <ul className="section-subsection">
           {(t.raw("purposes.1_list") as string[]).map((item, i) => <li key={i}>{item}</li>)}
        </ul>

        <p className="section-subtitle">{t("purposes.2")}</p>
        <ul className="section-subsection">
           {(t.raw("purposes.2_list") as string[]).map((item, i) => <li key={i}>{item}</li>)}
        </ul>

        <p className="section-subtitle">{t("purposes.3")}</p>
        <ul className="section-subsection">
           {(t.raw("purposes.3_list") as string[]).map((item, i) => <li key={i}>{item}</li>)}
        </ul>

        <p className="section-subtitle">{t("purposes.4")}</p>
        <ul className="section-subsection">
           {(t.raw("purposes.4_list") as string[]).map((item, i) => <li key={i}>{item}</li>)}
        </ul>

         <p className="section-subtitle">{t("purposes.5")}</p>
        <ul className="section-subsection">
           {(t.raw("purposes.5_list") as string[]).map((item, i) => <li key={i}>{item}</li>)}
        </ul>

         <p className="section-subtitle">{t("purposes.6")}</p>
        <ul className="section-subsection">
           {(t.raw("purposes.6_list") as string[]).map((item, i) => <li key={i}>{item}</li>)}
        </ul>

         <p className="section-subtitle">{t("purposes.7")}</p>
        <ul className="section-subsection">
           {(t.raw("purposes.7_list") as string[]).map((item, i) => <li key={i}>{item}</li>)}
        </ul>
        
        <p className="section-subtitle">{t("purposes.8")}</p>
        <ul className="section-subsection">
           {(t.raw("purposes.8_list") as string[]).map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </section>

      {/* 5. ПРАВОВЫЕ ОСНОВАНИЯ */}
      <section className="section-padding section-text">
        <h2 className="section-title">{t("grounds.title")}</h2>
        <p>{t("grounds.intro")}</p>
        <ul className="space-y-2 mt-2">
            <li>{t("grounds.1")}</li>
            <li>{t("grounds.2")}</li>
            <li>{t("grounds.3")}</li>
            <li>{t("grounds.4")}</li>
        </ul>
      </section>

      {/* 6. СПОСОБЫ И СРОКИ ОБРАБОТКИ */}
      <section className="section-padding section-text">
        <h2 className="section-title">{t("methods.title")}</h2>
        <p>{t("methods.1")}</p>
        <p>{t("methods.2")}</p>
        <p className="section-subtitle">{t("methods.3")}</p>
        <ul className="section-subsection">
            {(t.raw("methods.3_list") as string[]).map((item, i) => <li key={i}>{item}</li>)}
        </ul>
        <p className="mt-2">{t("methods.4")}</p>
        <p>{t("methods.5")}</p>
      </section>

      {/* 7. ПЕРЕДАЧА ДАННЫХ ТРЕТЬИМ ЛИЦАМ */}
      <section className="section-padding section-text">
        <h2 className="section-title">{t("transfer.title")}</h2>
        <p>{t("transfer.1")}</p>
        <p className="section-subtitle">{t("transfer.2")}</p>
        
        <p className="font-medium mt-2">{t("transfer.2_1")}</p>
        <ul className="section-subsection">
            {(t.raw("transfer.2_1_list") as string[]).map((item, i) => <li key={i}>{item}</li>)}
        </ul>

        <p className="font-medium mt-2">{t("transfer.2_2")}</p>
        <p>{t("transfer.2_2_desc")}</p>
        <ul className="section-subsection">
            {(t.raw("transfer.2_2_list") as string[]).map((item, i) => <li key={i}>{item}</li>)}
        </ul>

        <p className="font-medium mt-2">{t("transfer.2_3")}</p>
        <p>{t("transfer.2_3_desc")}</p>

        <p className="font-medium mt-2">{t("transfer.2_4")}</p>
        <p>{t("transfer.2_4_desc")}</p>

        <p className="mt-4">{t("transfer.3")}</p>
        <p>{t("transfer.4")}</p>
      </section>

      {/* 8. ЗАЩИТА ДАННЫХ */}
      <section className="section-padding section-text">
        <h2 className="section-title">{t("protection.title")}</h2>
        <p>{t("protection.1")}</p>
        <p className="section-subtitle">{t("protection.2")}</p>
        <ul className="section-subsection">
            {(t.raw("protection.2_list") as string[]).map((item, i) => <li key={i}>{item}</li>)}
        </ul>
        <p className="section-subtitle">{t("protection.3")}</p>
        <ul className="section-subsection">
            {(t.raw("protection.3_list") as string[]).map((item, i) => <li key={i}>{item}</li>)}
        </ul>
        <p className="mt-2">{t("protection.4")}</p>
        <p>{t("protection.5")}</p>
        <p>{t("protection.6")}</p>
        <p>{t("protection.7")}</p>
      </section>

       {/* 9. ПРАВА СУБЪЕКТОВ */}
       <section className="section-padding section-text">
        <h2 className="section-title">{t("rights.title")}</h2>
        <p>{t("rights.1")}</p>
        <ul className="space-y-2 mt-2">
            <li>{t("rights.1_1")}</li>
            <li>{t("rights.1_2")}</li>
            <li>
                {t("rights.1_3")}
                <ul className="section-subsection mt-1">
                    {(t.raw("rights.1_3_list") as string[]).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </li>
            <li>
                {t("rights.1_4")}
                <ul className="section-subsection mt-1">
                    {(t.raw("rights.1_4_list") as string[]).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </li>
            <li>{t("rights.1_5")}</li>
            <li>{t("rights.1_6")}</li>
        </ul>
        <p className="section-subtitle">{t("rights.2")}</p>
        <ul className="section-subsection">
            {(t.raw("rights.2_list") as string[]).map((item, i) => <li key={i}>{item}</li>)}
        </ul>
        <p className="mt-2">{t("rights.3")}</p>
        <p>{t("rights.4")}</p>
      </section>

      {/* 10. COOKIES */}
      <section className="section-padding section-text">
        <h2 className="section-title">{t("cookies.title")}</h2>
        <p>{t("cookies.1")}</p>
        <p>{t("cookies.2")}</p>
        <p className="section-subtitle">{t("cookies.3")}</p>
        <ul className="space-y-2 mt-2">
            <li>{t("cookies.3_1")}</li>
            <li>{t("cookies.3_2")}</li>
            <li>{t("cookies.3_3")}</li>
            <li>{t("cookies.3_4")}</li>
        </ul>
        <p className="mt-2">{t("cookies.4")}</p>
        <p className="section-subtitle">{t("cookies.5")}</p>
        <ul className="section-subsection">
            {(t.raw("cookies.5_list") as string[]).map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </section>

      {/* 11. НЕСОВЕРШЕННОЛЕТНИЕ */}
      <section className="section-padding section-text">
        <h2 className="section-title">{t("minors.title")}</h2>
        <p>{t("minors.1")}</p>
        <p>{t("minors.2")}</p>
        <p>{t("minors.3")}</p>
        <p>{t("minors.4")}</p>
      </section>

      {/* 12. ИЗМЕНЕНИЯ */}
      <section className="section-padding section-text">
        <h2 className="section-title">{t("changes.title")}</h2>
        <p>{t("changes.1")}</p>
        <p>{t("changes.2")}</p>
        <p>{t("changes.3")}</p>
        <p>{t("changes.4")}</p>
        <p>{t("changes.5")}</p>
        <p>{t("changes.6")}</p>
      </section>

       {/* 13. ЗАКОНОДАТЕЛЬСТВО */}
       <section className="section-padding section-text">
        <h2 className="section-title">{t("law.title")}</h2>
        <p>{t("law.1")}</p>
        <p>{t("law.2")}</p>
        <p>{t("law.3")}</p>
      </section>

      {/* 14. КОНТАКТЫ */}
      <section className="section-padding section-text">
        <h2 className="section-title">{t("contact.title")}</h2>
        <p>{t("contact.1")}</p>
        <div className="mt-4 pl-4 border-l-2 border-neutral-200">
            <p className="font-bold">{t("contact.company")}</p>
            <p>{t("contact.address")}</p>
            <p>{t("contact.email")}</p>
            <p>{t("contact.phone")}</p>
            <p>{t("contact.telegram")}</p>
            <p>{t("contact.workHours")}</p>
        </div>
        <p className="mt-4">{t("contact.2")}</p>
        <p>{t("contact.3")}</p>
      </section>

      {/* 15. ЗАКЛЮЧИТЕЛЬНЫЕ */}
      <section className="section-padding section-text">
        <h2 className="section-title">{t("final.title")}</h2>
        <p>{t("final.1")}</p>
        <p>{t("final.2")}</p>
        <p>{t("final.3")}</p>
        <p>{t("final.4")}</p>
        <ul className="section-subsection">
            {(t.raw("final.4_list") as string[]).map((item, i) => <li key={i}>{item}</li>)}
        </ul>
        
        <div className="mt-8 pt-4 border-t border-neutral-200 text-right">
             <p>{t("final.date")}</p>
             <p>{t("final.version")}</p>
             <p className="font-bold mt-2">{t("final.director")}</p>
        </div>
      </section>

    </article>
  );
};