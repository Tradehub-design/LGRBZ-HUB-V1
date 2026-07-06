import type { NavGroup } from "@/types/navigation";
import type { AppUser, AppSettings } from "@/types/settings";

export const APP_NAME = "LGRBZ";
export const APP_DESCRIPTION = "Premium portfolio operating system for stocks, ETFs, crypto, dividends, tax and investor reporting.";

export const DEFAULT_USERS: AppUser[] = [
  {
    id: "kieren-chan",
    name: "Kieren Chan",
    role: "Owner",
  },
  {
    id: "sam-thomas",
    name: "Sam Thomas",
    role: "Member",
  },
  {
    id: "tom-flitcroft",
    name: "Tom Flitcroft",
    role: "Member",
  },
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
    id: "portfolio",
    label: "Portfolio",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/dashboard",
        icon: "LayoutDashboard",
        description: "Portfolio overview, allocation, returns and risk.",
      },
      {
        id: "holdings",
        label: "Holdings",
        href: "/holdings",
        icon: "BriefcaseBusiness",
        description: "Open, closed and sold holdings.",
      },
      {
        id: "transactions",
        label: "Transactions",
        href: "/transactions",
        icon: "ArrowLeftRight",
        description: "Master ledger and transaction audit.",
      },
      {
        id: "analysis",
        label: "Analysis",
        href: "/analysis",
        icon: "ChartNoAxesCombined",
        description: "Performance, sectors, currency and attribution.",
      },
    ],
  },
  {
    id: "planning",
    label: "Planning",
    items: [
      {
        id: "calendar",
        label: "Calendar",
        href: "/calendar",
        icon: "CalendarDays",
        description: "Purchases, sales, dividends and portfolio replay.",
      },
      {
        id: "dividends",
        label: "Dividends",
        href: "/dividends",
        icon: "BadgeDollarSign",
        description: "Income history and dividend calendar.",
      },
      {
        id: "forecast",
        label: "Forecast",
        href: "/forecast",
        icon: "TrendingUp",
        description: "Growth, what-if and dividend lifestyle tools.",
      },
      {
        id: "tax",
        label: "Tax",
        href: "/tax",
        icon: "ReceiptText",
        description: "FY summaries, CGT, dividends and member split.",
      },
    ],
  },
  {
    id: "intelligence",
    label: "Intelligence",
    items: [
      {
        id: "research",
        label: "Research",
        href: "/research",
        icon: "Search",
        description: "Watchlist, company research and AI compare.",
      },
      {
        id: "minutes",
        label: "Minutes",
        href: "/minutes",
        icon: "NotebookPen",
        description: "Meeting notes, attendees and decisions.",
      },
      {
        id: "import",
        label: "Import",
        href: "/import",
        icon: "UploadCloud",
        description: "Upload transactions, holdings and broker exports.",
      },
      {
        id: "reports",
        label: "Reports",
        href: "/reports",
        icon: "FileDown",
        description: "Summary and detailed PDF investor reports.",
      },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      {
        id: "accounts",
        label: "Accounts",
        href: "/accounts",
        icon: "WalletCards",
        description: "Broker, cash and crypto account details.",
      },
      {
        id: "settings",
        label: "Settings",
        href: "/settings",
        icon: "Settings",
        description: "Theme, currency, mobile, offline and app controls.",
      },
    ],
  },
];

export const FINANCIAL_YEARS = [
  "All",
  "FY2022",
  "FY2023",
  "FY2024",
  "FY2025",
  "FY2026",
  "FY2027",
];

export const SUPPORTED_CURRENCIES = ["AUD", "USD"] as const;

export const RISK_LEVELS = ["Low Risk", "Medium Risk", "High Risk", "Dividend", "Unrated"] as const;
