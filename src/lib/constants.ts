import type { NavGroup } from "@/types/navigation";
import type { AppSettings, AppUser } from "@/types/settings";

export const APP_NAME = "LGRBZ";
export const APP_DESCRIPTION =
  "Professional portfolio management system for stocks, ETFs, crypto, dividends, tax and investor reporting.";

export const DEFAULT_USERS: AppUser[] = [
  { id: "owner", name: "LGRBZ", role: "Owner" },
];

export const DEFAULT_SETTINGS: AppSettings = {
  theme: "dark",
  displayCurrency: "AUD",
  density: "comfortable",
  enableAnimations: true,
  enableOfflineMode: true,
  enableBiometrics: false,
  defaultFinancialYear: "FY2026",
};

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "main",
    label: "Portfolio",
    items: [
      { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard", description: "Executive summary." },
      { id: "holdings", label: "Holdings", href: "/holdings", icon: "BriefcaseBusiness", description: "Current positions." },
      { id: "transactions", label: "Transactions", href: "/transactions", icon: "ArrowLeftRight", description: "Source ledger." },
      { id: "import-centre", label: "Import Centre", href: "/import-centre", icon: "UploadCloud", description: "One-time workbook import." },
      { id: "analytics", label: "Analytics", href: "/analytics", icon: "ChartNoAxesCombined", description: "Portfolio analysis." },
      { id: "dividends", label: "Dividends", href: "/dividends", icon: "BadgeDollarSign", description: "Income history." },
      { id: "dividend-forecast", label: "Dividend Forecast", href: "/dividend-forecast", icon: "TrendingUp", description: "Projected income." },
      { id: "portfolio-allocation", label: "Portfolio Allocation", href: "/portfolio-allocation", icon: "PieChart", description: "Asset allocation." },
      { id: "portfolio-health", label: "Portfolio Health", href: "/portfolio-health", icon: "Activity", description: "Risk and health score." },
      { id: "performance-attribution", label: "Performance Attribution", href: "/performance-attribution", icon: "BarChart3", description: "Return drivers." },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    items: [
      { id: "goals", label: "Goals", href: "/goals", icon: "Target", description: "Investment goals." },
      { id: "watchlist", label: "Watchlist", href: "/watchlist", icon: "Eye", description: "Watchlist highlights." },
      { id: "reports", label: "Reports", href: "/reports", icon: "FileDown", description: "Investor reports." },
      { id: "tax", label: "Tax Centre", href: "/tax", icon: "ReceiptText", description: "Tax and CGT." },
      { id: "business-model", label: "Business Model", href: "/business-model", icon: "Calculator", description: "Risk profile model." },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      { id: "broker-sync", label: "Broker Sync", href: "/broker-sync", icon: "RefreshCcw", description: "Broker imports." },
      { id: "live-prices", label: "Live Prices", href: "/live-prices", icon: "LineChart", description: "Market prices." },
      { id: "settings", label: "Settings", href: "/settings", icon: "Settings", description: "Preferences." },
    ],
  },
];

export const FINANCIAL_YEARS = ["All", "FY2022", "FY2023", "FY2024", "FY2025", "FY2026", "FY2027"];
export const SUPPORTED_CURRENCIES = ["AUD", "USD"] as const;
export const RISK_LEVELS = ["Low Risk", "Medium Risk", "High Risk", "Dividend", "Unrated"] as const;
