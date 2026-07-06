"use client";

import { create } from "zustand";
import type { AppSettings, AppUser } from "@/types/settings";
import { DEFAULT_SETTINGS, DEFAULT_USERS } from "@/lib/constants";
import { safeLocalStorageGet, safeLocalStorageSet } from "@/lib/storage";

type SettingsState = {
  settings: AppSettings;
  users: AppUser[];
  activeUserId: string;
  sidebarCollapsed: boolean;
  hydrated: boolean;
  setHydrated: () => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  setTheme: (theme: AppSettings["theme"]) => void;
  setDisplayCurrency: (currency: AppSettings["displayCurrency"]) => void;
  setActiveUser: (userId: string) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  resetSettings: () => void;
};

const STORAGE_KEY = "lgrbz-settings-v1";

type PersistedSettings = {
  settings: AppSettings;
  users: AppUser[];
  activeUserId: string;
  sidebarCollapsed: boolean;
};

const getInitialState = (): PersistedSettings => {
  return safeLocalStorageGet<PersistedSettings>(STORAGE_KEY, {
    settings: DEFAULT_SETTINGS,
    users: DEFAULT_USERS,
    activeUserId: DEFAULT_USERS[0]?.id ?? "kieren-chan",
    sidebarCollapsed: false,
  });
};

export const useSettingsStore = create<SettingsState>((set, get) => {
  const initial = getInitialState();

  const persist = () => {
    const state = get();
    safeLocalStorageSet<PersistedSettings>(STORAGE_KEY, {
      settings: state.settings,
      users: state.users,
      activeUserId: state.activeUserId,
      sidebarCollapsed: state.sidebarCollapsed,
    });
  };

  return {
    settings: initial.settings,
    users: initial.users,
    activeUserId: initial.activeUserId,
    sidebarCollapsed: initial.sidebarCollapsed,
    hydrated: false,

    setHydrated: () => set({ hydrated: true }),

    updateSettings: (updates) => {
      set((state) => ({
        settings: {
          ...state.settings,
          ...updates,
        },
      }));
      persist();
    },

    setTheme: (theme) => {
      set((state) => ({
        settings: {
          ...state.settings,
          theme,
        },
      }));
      persist();
    },

    setDisplayCurrency: (currency) => {
      set((state) => ({
        settings: {
          ...state.settings,
          displayCurrency: currency,
        },
      }));
      persist();
    },

    setActiveUser: (userId) => {
      set({ activeUserId: userId });
      persist();
    },

    toggleSidebar: () => {
      set((state) => ({
        sidebarCollapsed: !state.sidebarCollapsed,
      }));
      persist();
    },

    setSidebarCollapsed: (collapsed) => {
      set({ sidebarCollapsed: collapsed });
      persist();
    },

    resetSettings: () => {
      set({
        settings: DEFAULT_SETTINGS,
        users: DEFAULT_USERS,
        activeUserId: DEFAULT_USERS[0]?.id ?? "kieren-chan",
        sidebarCollapsed: false,
      });
      persist();
    },
  };
});
