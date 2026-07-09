import { create } from "zustand";

export type UserSettings = {
  currency: string;
  displayCurrency: string;
  theme: "light" | "dark" | "system";
  density: "comfortable" | "compact";
  defaultPage: string;
  showDemoWarnings: boolean;
  enableAnimations: boolean;
  enableOfflineMode: boolean;
  animations: boolean;
  compactMode: boolean;
};

export type SettingsUser = {
  id: string;
  name: string;
};

export type SettingsState = {
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  users: SettingsUser[];
  activeUserId: string;
  settings: UserSettings;
  update: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
  reset: () => void;
};

const defaultSettings: UserSettings = {
  currency: "AUD",
  displayCurrency: "AUD",
  theme: "system",
  density: "comfortable",
  defaultPage: "dashboard",
  showDemoWarnings: true,
  enableAnimations: true,
  enableOfflineMode: false,
  animations: true,
  compactMode: false,
};

export const useSettingsStore = create<SettingsState>((set) => ({
  hydrated: false,
  setHydrated: (hydrated) => set({ hydrated }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  users: [{ id: "default", name: "Default User" }],
  activeUserId: "default",
  settings: defaultSettings,
  update: (key, value) =>
    set((state) => ({
      settings: { ...state.settings, [key]: value },
    })),
  reset: () => set({ settings: defaultSettings, sidebarCollapsed: false }),
}));
