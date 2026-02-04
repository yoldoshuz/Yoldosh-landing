import { Metadata } from "next";
import { Inter } from "next/font/google";

import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Navbar } from "@/components/shared/Navbar";
import { QueryProvider } from "./providers/QueryProvider";
import { ThemeProviders } from "./providers/ThemeProviders";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yoldosh",
  description: "Your trip advisor!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} antialiased`}>
        <QueryProvider>
          <NextIntlClientProvider>
            <ThemeProviders>
              <main className="flex flex-col">
                <div className="mb-16">
                  <Navbar />
                </div>
                {children}
              </main>
            </ThemeProviders>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
};
