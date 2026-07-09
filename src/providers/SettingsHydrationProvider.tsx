"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useSettingsStore } from "@/store/settingsStore";

type SettingsHydrationProviderProps = {
  children: ReactNode;
};

export function SettingsHydrationProvider({ children }: SettingsHydrationProviderProps) {
  const setHydrated = useSettingsStore((state) => state.setHydrated);

  useEffect(() => {
    setHydrated(true);
  }, [setHydrated]);

  return <>{children}</>;
}
