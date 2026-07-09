export type ThemeMode = "Light" | "Dark" | "System";
export type CurrencyPreference = "AUD" | "USD" | "CNY";
export type DateFormatPreference = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";

export type UserPreferences = {
  theme: ThemeMode;
  baseCurrency: CurrencyPreference;
  dateFormat: DateFormatPreference;
  compactMode: boolean;
  showDividends: boolean;
  showTaxEstimates: boolean;
  enablePriceAlerts: boolean;
  enableEmailReports: boolean;
};
