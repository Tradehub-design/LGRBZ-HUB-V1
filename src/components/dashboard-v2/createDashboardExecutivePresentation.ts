import {
  Activity,
  Banknote,
  CircleDollarSign,
  HeartPulse,
  Landmark,
  ListPlus,
  PieChart,
  ReceiptText,
  Search,
  ShieldAlert,
  TrendingUp,
  Upload,
  WalletCards,
} from "lucide-react";
import {
  dashboardToneFromValue,
} from "./dashboardV2Formatters";
import {
  DashboardAlertItem,
  DashboardExecutiveMetric,
  DashboardExecutiveSnapshot,
  DashboardQuickAction,
} from "./dashboardV2Types";

export function createDashboardExecutiveMetrics(
  snapshot: DashboardExecutiveSnapshot,
  loading = false
): DashboardExecutiveMetric[] {
  return [
    {
      id:
        "portfolio-value",
      label:
        "Portfolio Value",
      value:
        snapshot.portfolioValue,
      format:
        "currency",
      currency:
        snapshot.currency,
      decimals: 0,
      subtitle:
        "Current market value",
      tone:
        "neutral",
      icon:
        WalletCards,
      loading,
    },
    {
      id:
        "daily-gain-loss",
      label:
        "Today",
      value:
        snapshot.dailyGainLoss,
      format:
        "currency",
      currency:
        snapshot.currency,
      decimals: 0,
      subtitle:
        "Daily gain / loss",
      comparisonValue:
        snapshot.dailyGainLossPercent,
      comparisonLabel:
        "today",
      trend:
        (
          snapshot.dailyGainLoss ??
          0
        ) > 0
          ? "up"
          : (
                snapshot.dailyGainLoss ??
                0
              ) < 0
            ? "down"
            : "flat",
      tone:
        dashboardToneFromValue(
          snapshot.dailyGainLoss
        ),
      icon:
        TrendingUp,
      loading,
    },
    {
      id:
        "total-return",
      label:
        "Total Return",
      value:
        snapshot.totalReturn,
      format:
        "currency",
      currency:
        snapshot.currency,
      decimals: 0,
      subtitle:
        "Since inception",
      comparisonValue:
        snapshot.totalReturnPercent,
      comparisonLabel:
        "total",
      trend:
        (
          snapshot.totalReturn ??
          0
        ) > 0
          ? "up"
          : (
                snapshot.totalReturn ??
                0
              ) < 0
            ? "down"
            : "flat",
      tone:
        dashboardToneFromValue(
          snapshot.totalReturn
        ),
      icon:
        Activity,
      loading,
    },
    {
      id:
        "available-cash",
      label:
        "Available Cash",
      value:
        snapshot.availableCash,
      format:
        "currency",
      currency:
        snapshot.currency,
      decimals: 0,
      subtitle:
        "Ready to invest",
      tone:
        "info",
      icon:
        Banknote,
      loading,
    },
    {
      id:
        "dividend-income",
      label:
        "Dividend Income",
      value:
        snapshot.dividendIncome,
      format:
        "currency",
      currency:
        snapshot.currency,
      decimals: 0,
      subtitle:
        "Recorded income",
      tone:
        "positive",
      icon:
        CircleDollarSign,
      loading,
    },
    {
      id:
        "health-score",
      label:
        "Portfolio Health",
      value:
        snapshot.portfolioHealthScore,
      format:
        "number",
      decimals: 0,
      subtitle:
        "Score out of 100",
      tone:
        (
          snapshot.portfolioHealthScore ??
          0
        ) >= 75
          ? "positive"
          : (
                snapshot.portfolioHealthScore ??
                0
              ) >= 50
            ? "warning"
            : "negative",
      icon:
        HeartPulse,
      loading,
    },
    {
      id:
        "risk-score",
      label:
        "Risk Score",
      value:
        snapshot.riskScore,
      format:
        "number",
      decimals: 0,
      subtitle:
        "Lower is better",
      tone:
        (
          snapshot.riskScore ??
          0
        ) <= 35
          ? "positive"
          : (
                snapshot.riskScore ??
                0
              ) <= 65
            ? "warning"
            : "negative",
      icon:
        ShieldAlert,
      loading,
    },
  ];
}

export function createDashboardQuickActions():
  DashboardQuickAction[] {
  return [
    {
      id:
        "add-transaction",
      label:
        "Add Transaction",
      description:
        "Record a buy, sell, dividend or fee.",
      href:
        "/transactions",
      icon:
        ListPlus,
      tone:
        "primary",
    },
    {
      id:
        "import-centre",
      label:
        "Import Centre",
      description:
        "Review the one-time workbook import tools.",
      href:
        "/import-centre",
      icon:
        Upload,
      tone:
        "secondary",
    },
    {
      id:
        "holdings",
      label:
        "View Holdings",
      description:
        "Review current positions and cost bases.",
      href:
        "/holdings",
      icon:
        Landmark,
      tone:
        "secondary",
    },
    {
      id:
        "allocation",
      label:
        "Portfolio Allocation",
      description:
        "Inspect sector, currency and asset exposure.",
      href:
        "/portfolio-allocation",
      icon:
        PieChart,
      tone:
        "secondary",
    },
    {
      id:
        "reports",
      label:
        "Generate Reports",
      description:
        "Open portfolio and performance reporting.",
      href:
        "/reports",
      icon:
        ReceiptText,
      tone:
        "secondary",
    },
    {
      id:
        "research",
      label:
        "Research",
      description:
        "Open investment research and watchlist tools.",
      href:
        "/research",
      icon:
        Search,
      tone:
        "secondary",
    },
  ];
}

export function createDashboardDataAlerts({
  transactionCount,
  holdingCount,
  missingPriceCount,
  stalePriceCount,
  missingSectorCount,
  missingCurrencyCount,
  lastLedgerUpdate,
}: {
  transactionCount: number;
  holdingCount: number;
  missingPriceCount: number;
  stalePriceCount: number;
  missingSectorCount: number;
  missingCurrencyCount: number;
  lastLedgerUpdate: string | null;
}): DashboardAlertItem[] {
  const alerts:
    DashboardAlertItem[] = [];

  if (
    transactionCount ===
    0
  ) {
    alerts.push({
      id:
        "no-transactions",
      title:
        "No transactions available",
      message:
        "Add or import transactions to populate the portfolio dashboard.",
      tone:
        "critical",
      href:
        "/transactions",
    });
  }

  if (
    transactionCount > 0 &&
    holdingCount === 0
  ) {
    alerts.push({
      id:
        "no-holdings",
      title:
        "No active holdings",
      message:
        "The ledger contains transactions but no open portfolio positions.",
      tone:
        "info",
      href:
        "/holdings",
    });
  }

  if (
    missingPriceCount >
    0
  ) {
    alerts.push({
      id:
        "missing-prices",
      title:
        "Missing market prices",
      message: `${missingPriceCount} holding${
        missingPriceCount ===
        1
          ? ""
          : "s"
      } cannot be fully valued.`,
      tone:
        "warning",
      href:
        "/live-prices",
    });
  }

  if (
    stalePriceCount >
    0
  ) {
    alerts.push({
      id:
        "stale-prices",
      title:
        "Stale market prices",
      message: `${stalePriceCount} holding${
        stalePriceCount ===
        1
          ? ""
          : "s"
      } require a price refresh.`,
      tone:
        "warning",
      href:
        "/live-prices",
    });
  }

  if (
    missingSectorCount >
    0
  ) {
    alerts.push({
      id:
        "missing-sectors",
      title:
        "Sector classifications missing",
      message: `${missingSectorCount} holding${
        missingSectorCount ===
        1
          ? ""
          : "s"
      } reduce allocation accuracy.`,
      tone:
        "info",
      href:
        "/holdings",
    });
  }

  if (
    missingCurrencyCount >
    0
  ) {
    alerts.push({
      id:
        "missing-currencies",
      title:
        "Currency information missing",
      message: `${missingCurrencyCount} record${
        missingCurrencyCount ===
        1
          ? ""
          : "s"
      } need a valid currency.`,
      tone:
        "warning",
      href:
        "/transactions",
    });
  }

  if (
    alerts.length ===
    0
  ) {
    alerts.push({
      id:
        "data-clear",
      title:
        "Portfolio data checks passed",
      message:
        "No critical ledger, pricing or classification issues were detected.",
      tone:
        "success",
      timestamp:
        lastLedgerUpdate,
    });
  }

  return alerts;
}
