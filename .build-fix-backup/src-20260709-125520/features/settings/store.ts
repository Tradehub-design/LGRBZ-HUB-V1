"use client";

import { create } from "zustand";
import type {
  CurrencyPreference,
  DateFormatPreference,
  ThemeMode,
} from "./types";
import { userPreferences } from "./mock-data";

type SettingsStore = {
  theme: ThemeMode;
  baseCurrency: CurrencyPreference;
  dateFormat: DateFormatPreference;
  compactMode: boolean;
  showDividends: boolean;
  showTaxEstimates: boolean;
  enablePriceAlerts: boolean;
  enableEmailReports: boolean;

  setTheme: (theme: ThemeMode) => void;
  setBaseCurrency: (currency: CurrencyPreference) => void;
  setDateFormat: (format: DateFormatPreference) => void;
  toggleCompactMode: () => void;
  toggleShowDividends: () => void;
  toggleShowTaxEstimates: () => void;
  togglePriceAlerts: () => void;
  toggleEmailReports: () => void;
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  ...userPreferences,

  setTheme: (theme) => set({ theme }),
  setBaseCurrency: (baseCurrency) => set({ baseCurrency }),
  setDateFormat: (dateFormat) => set({ dateFormat }),
  toggleCompactMode: () => set((state) => ({ compactMode: !state.compactMode })),
  toggleShowDividends: () =>
    set((state) => ({ showDividends: !state.showDividends })),
  toggleShowTaxEstimates: () =>
    set((state) => ({ showTaxEstimates: !state.showTaxEstimates })),
  togglePriceAlerts: () =>
    set((state) => ({ enablePriceAlerts: !state.enablePriceAlerts })),
  toggleEmailReports: () =>
    set((state) => ({ enableEmailReports: !state.enableEmailReports })),
}));
