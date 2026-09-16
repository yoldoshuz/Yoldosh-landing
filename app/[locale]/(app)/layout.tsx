import { ReactNode } from "react";
import { Metadata } from "next";

import { AppShell } from "@/components/app/AppShell";

/**
 * The signed-in surface is private by definition — keep every route under it
 * out of the index so none of it competes with the marketing pages.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

const AppLayout = ({ children }: { children: ReactNode }) => <AppShell>{children}</AppShell>;

export default AppLayout;
