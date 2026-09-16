import { ReactNode } from "react";

import { MarketingGuard } from "@/components/app/MarketingGuard";
import { Navbar } from "@/components/shared/widgets/Navbar";

/**
 * Public, indexable surface. Signed-in users never see it — `MarketingGuard`
 * bounces them into the app, the same way github.com/ swaps the marketing
 * splash for your feed once you have a session.
 */
const MarketingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <MarketingGuard>
      <div className="flex flex-col min-h-screen">
        <header className="shrink-0 mb-16">
          <Navbar />
        </header>
        <main className="flex-1" id="main-content" role="main">
          {children}
        </main>
      </div>
    </MarketingGuard>
  );
};

export default MarketingLayout;
