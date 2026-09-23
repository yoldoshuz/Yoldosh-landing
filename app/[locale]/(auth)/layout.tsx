import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

/**
 * No shell, no guard — this is the one authenticated-area route a signed-out
 * visitor is allowed to reach.
 */
const AuthLayout = ({ children }: { children: ReactNode }) => (
  <main data-app-root data-app-scroll id="main-content" role="main" className="min-h-screen bg-neutral-50">
    {children}
  </main>
);

export default AuthLayout;
