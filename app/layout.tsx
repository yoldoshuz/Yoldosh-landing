import { Metadata } from "next";
import { Inter } from "next/font/google";

import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProviders } from "./providers/ThemeProviders";

import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";

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
      </body>
    </html>
  );
};
