"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/QueryProvider";
import { SettingsHydrationProvider } from "@/providers/SettingsHydrationProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <SettingsHydrationProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </SettingsHydrationProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
