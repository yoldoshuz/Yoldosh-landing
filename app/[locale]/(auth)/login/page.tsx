import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";

import { LoginScreen } from "@/components/app/pages/LoginScreen";
import type { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense fallback={null}>
      <LoginScreen />
    </Suspense>
  );
};

export default Page;
