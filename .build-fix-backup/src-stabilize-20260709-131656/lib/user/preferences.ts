export type UserPreferences = {
  currency: string;
  defaultCurrency: string;
  theme: "light" | "dark" | "system";
  compactMode: boolean;
  dashboardDensity: "Comfortable" | "Compact";
  defaultStartPage: string;
  showDemoWarnings: boolean;
  showLivePrices: boolean;
  defaultDashboardRange: "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "ALL";
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  currency: "AUD",
  defaultCurrency: "AUD",
  theme: "system",
  compactMode: false,
  dashboardDensity: "Comfortable",
  defaultStartPage: "Dashboard",
  showDemoWarnings: true,
  showLivePrices: true,
  defaultDashboardRange: "1M",
};
