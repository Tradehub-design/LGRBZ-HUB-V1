#!/usr/bin/env bash
set -e

echo "🔧 Rebuilding settings store cleanly..."

cat > src/store/settingsStore.ts <<'TS'
import { create } from "zustand";

export type UserSettings = {
  currency: string;
  theme: "light" | "dark" | "system";
  density: "comfortable" | "compact";
  defaultPage: string;
  showDemoWarnings: boolean;
};

export type SettingsState = {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  settings: UserSettings;
  update: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
  reset: () => void;
};

const defaultSettings: UserSettings = {
  currency: "AUD",
  theme: "system",
  density: "comfortable",
  defaultPage: "dashboard",
  showDemoWarnings: true,
};

export const useSettingsStore = create<SettingsState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    })),

  settings: defaultSettings,

  update: (key, value) =>
    set((state) => ({
      settings: {
        ...state.settings,
        [key]: value,
      },
    })),

  reset: () =>
    set({
      settings: defaultSettings,
      sidebarCollapsed: false,
    }),
}));
TS

npm run build
