"use client";

import { ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "./AppSidebar";
import { AuthGuard } from "./AuthGuard";
import { BottomNav } from "./BottomNav";

export const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <AuthGuard>
      <div data-app-root className="min-h-screen bg-app-bg">
        <AppSidebar />

        {/* `lg:pl-72` clears the fixed sidebar; the bottom padding clears the
            floating tab bar plus the iOS home indicator. */}
        <div
          data-app-scroll
          className="flex min-h-screen flex-col pb-28 lg:pb-10 lg:pl-72 has-[[data-fullscreen]]:pb-0"
        >
          {children}
        </div>

        <BottomNav />
        <Toaster position="top-center" richColors />
      </div>
    </AuthGuard>
  );
};
