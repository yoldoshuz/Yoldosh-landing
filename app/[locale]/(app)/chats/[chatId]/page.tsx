import { setRequestLocale } from "next-intl/server";

import { ChatScreen } from "@/components/app/pages/ChatScreen";

type ChatPageProps = { params: Promise<{ locale: string; chatId: string }> };

const Page = async ({ params }: ChatPageProps) => {
  const { locale, chatId } = await params;
  setRequestLocale(locale);
  return <ChatScreen chatId={chatId} />;
};

export default Page;
