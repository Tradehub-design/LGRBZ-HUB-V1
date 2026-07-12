import type {
  ComponentType,
  ReactNode,
} from "react";

export type DashboardMetricTone =
  | "positive"
  | "negative"
  | "warning"
  | "neutral"
  | "info";

export type DashboardTrendDirection =
  | "up"
  | "down"
  | "flat";

export type DashboardMetricFormat =
  | "currency"
  | "percentage"
  | "number"
  | "text";

export type DashboardExecutiveMetric = {
  id: string;
  label: string;
  value: number | string | null;
  format: DashboardMetricFormat;
  currency?: string;
  decimals?: number;
  subtitle?: string;
  comparisonLabel?: string;
  comparisonValue?: number | null;
  trend?: DashboardTrendDirection;
  tone?: DashboardMetricTone;
  icon?: ComponentType<{
    className?: string;
  }>;
  loading?: boolean;
  unavailableLabel?: string;
  onClick?: () => void;
};

export type DashboardQuickAction = {
  id: string;
  label: string;
  description?: string;
  href?: string;
  icon?: ComponentType<{
    className?: string;
  }>;
  tone?:
    | "primary"
    | "secondary"
    | "danger";
  disabled?: boolean;
  onClick?: () => void;
};

export type DashboardAlertTone =
  | "critical"
  | "warning"
  | "info"
  | "success";

export type DashboardAlertItem = {
  id: string;
  title: string;
  message: string;
  tone: DashboardAlertTone;
  timestamp?: string | null;
  href?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export type DashboardTransactionItem = {
  id: string;
  date: string;
  symbol: string;
  name?: string;
  type: string;
  quantity?: number | null;
  amount?: number | null;
  fees?: number | null;
  currency?: string;
};

export type DashboardDividendItem = {
  id: string;
  symbol: string;
  name?: string;
  exDate?: string | null;
  paymentDate?: string | null;
  amount?: number | null;
  currency?: string;
  status?: string;
};

export type DashboardWatchlistHighlight = {
  id: string;
  symbol: string;
  name?: string;
  price?: number | null;
  changePercent?: number | null;
  targetPrice?: number | null;
  currency?: string;
  signal?: string;
};

export type DashboardMarketItem = {
  id: string;
  symbol: string;
  name: string;
  value?: number | null;
  changePercent?: number | null;
  status?: string;
};

export type DashboardAllocationItem = {
  id: string;
  label: string;
  value: number;
  percentage: number;
  currency?: string;
};

export type DashboardExecutiveSnapshot = {
  asOf: string | null;
  portfolioValue: number | null;
  dailyGainLoss: number | null;
  dailyGainLossPercent: number | null;
  totalReturn: number | null;
  totalReturnPercent: number | null;
  availableCash: number | null;
  investedCapital: number | null;
  unrealisedGainLoss: number | null;
  realisedGainLoss: number | null;
  dividendIncome: number | null;
  portfolioHealthScore: number | null;
  riskScore: number | null;
  currency: string;
};

export type DashboardExecutiveShellProps = {
  title?: string;
  subtitle?: string;
  asOf?: string | null;
  loading?: boolean;
  error?: string | null;
  metrics?: DashboardExecutiveMetric[];
  quickActions?: DashboardQuickAction[];
  alerts?: DashboardAlertItem[];
  children?: ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
};

export type DashboardSectionSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "full";

export type DashboardSectionCardProps = {
  id?: string;
  title: string;
  eyebrow?: string;
  description?: string;
  icon?: ComponentType<{
    className?: string;
  }>;
  action?: ReactNode;
  children: ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  size?: DashboardSectionSize;
  className?: string;
  contentClassName?: string;
};

export type DashboardDataQuality = {
  transactionCount: number;
  holdingCount: number;
  missingPriceCount: number;
  stalePriceCount: number;
  missingSectorCount: number;
  missingCurrencyCount: number;
  lastLedgerUpdate: string | null;
};
