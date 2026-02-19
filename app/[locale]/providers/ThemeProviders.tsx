"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

export const ThemeProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
};