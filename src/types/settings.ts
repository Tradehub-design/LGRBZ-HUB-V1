export type ThemeMode = "dark" | "light" | "system";

export type DisplayCurrency = "AUD" | "USD";

export type LayoutDensity = "comfortable" | "compact";

export type UserRole = "Owner" | "Member" | "Viewer";

export type AppUser = {
  id: string;
  name: "Kieren Chan" | "Sam Thomas" | "Tom Flitcroft" | string;
  email?: string;
  role: UserRole;
  avatar?: string;
};

export type AppSettings = {
  theme: ThemeMode;
  displayCurrency: DisplayCurrency;
  density: LayoutDensity;
  enableAnimations: boolean;
  enableOfflineMode: boolean;
  enableBiometrics: boolean;
  defaultFinancialYear: string;
};
