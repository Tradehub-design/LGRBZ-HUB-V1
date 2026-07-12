export type HoldingsV2SortDirection =
  | "asc"
  | "desc";

export type HoldingsV2SortKey =
  | "symbol"
  | "name"
  | "quantity"
  | "averageCost"
  | "currentPrice"
  | "marketValue"
  | "costBase"
  | "unrealisedGainLoss"
  | "unrealisedGainLossPercent"
  | "dailyGainLoss"
  | "dailyGainLossPercent"
  | "portfolioWeight"
  | "sector"
  | "currency"
  | "lastUpdated";

export type HoldingsV2ViewMode =
  | "table"
  | "cards"
  | "compact";

export type HoldingsV2Density =
  | "compact"
  | "comfortable"
  | "spacious";

export type HoldingsV2RiskLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "UNKNOWN";

export type HoldingsV2PositionStatus =
  | "OPEN"
  | "CLOSED"
  | "PARTIAL"
  | "UNKNOWN";

export type HoldingsV2PriceStatus =
  | "LIVE"
  | "DELAYED"
  | "MANUAL"
  | "STALE"
  | "MISSING"
  | "UNKNOWN";

export type HoldingsV2Record = {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  sector: string;
  industry: string;

  quantity: number;
  averageCost: number;
  currentPrice: number | null;
  previousClose: number | null;

  costBase: number;
  marketValue: number | null;

  unrealisedGainLoss: number | null;
  unrealisedGainLossPercent: number | null;

  realisedGainLoss: number | null;

  dailyGainLoss: number | null;
  dailyGainLossPercent: number | null;

  portfolioWeight: number | null;

  dividendsReceived: number | null;
  annualDividendIncome: number | null;
  dividendYield: number | null;

  targetPrice: number | null;
  targetUpsidePercent: number | null;

  riskLevel: HoldingsV2RiskLevel;
  status: HoldingsV2PositionStatus;
  priceStatus: HoldingsV2PriceStatus;

  strategy: string;
  tags: string[];
  account: string;
  broker: string;

  openedAt: string | null;
  lastTransactionAt: string | null;
  priceUpdatedAt: string | null;
  lastUpdated: string | null;

  notes: string;

  raw: unknown;
};

export type HoldingsV2Summary = {
  totalHoldings: number;
  openHoldings: number;

  totalQuantity: number;

  totalCostBase: number;
  totalMarketValue: number | null;

  totalUnrealisedGainLoss: number | null;
  totalUnrealisedGainLossPercent: number | null;

  totalRealisedGainLoss: number | null;

  totalDailyGainLoss: number | null;
  totalDailyGainLossPercent: number | null;

  totalDividendsReceived: number | null;
  annualDividendIncome: number | null;

  profitableHoldings: number;
  losingHoldings: number;
  missingPriceCount: number;
  stalePriceCount: number;

  largestPosition: HoldingsV2Record | null;
  largestWinner: HoldingsV2Record | null;
  largestLoser: HoldingsV2Record | null;

  baseCurrency: string;
  asOf: string | null;
};

export type HoldingsV2FilterState = {
  search: string;
  sectors: string[];
  industries: string[];
  currencies: string[];
  exchanges: string[];
  accounts: string[];
  brokers: string[];
  riskLevels: HoldingsV2RiskLevel[];
  priceStatuses: HoldingsV2PriceStatus[];
  positionStatuses: HoldingsV2PositionStatus[];

  profitableOnly: boolean;
  losingOnly: boolean;
  missingPricesOnly: boolean;
  stalePricesOnly: boolean;

  minimumMarketValue: number | null;
  maximumMarketValue: number | null;

  minimumWeight: number | null;
  maximumWeight: number | null;

  tags: string[];
};

export type HoldingsV2ColumnKey =
  | "symbol"
  | "quantity"
  | "averageCost"
  | "currentPrice"
  | "marketValue"
  | "costBase"
  | "unrealisedGainLoss"
  | "dailyGainLoss"
  | "portfolioWeight"
  | "sector"
  | "currency"
  | "account"
  | "risk"
  | "priceStatus"
  | "actions";

export type HoldingsV2ColumnVisibility =
  Record<
    HoldingsV2ColumnKey,
    boolean
  >;

export type HoldingsV2ColumnWidth =
  Partial<
    Record<
      HoldingsV2ColumnKey,
      number
    >
  >;

export type HoldingsV2Preferences = {
  version: number;
  density: HoldingsV2Density;
  viewMode: HoldingsV2ViewMode;

  sortKey: HoldingsV2SortKey;
  sortDirection: HoldingsV2SortDirection;

  pageSize: number;

  columnVisibility: HoldingsV2ColumnVisibility;
  columnOrder: HoldingsV2ColumnKey[];
  columnWidths: HoldingsV2ColumnWidth;

  showSummary: boolean;
  showFilters: boolean;
  showClosedPositions: boolean;
  stickyHeader: boolean;
  compactNumbers: boolean;
  reduceMotion: boolean;

  updatedAt: string;
};

export type HoldingsV2AdaptedResult = {
  holdings: HoldingsV2Record[];
  summary: HoldingsV2Summary;
  warnings: string[];
};

export type HoldingsV2SourceBundle = {
  holdings?: unknown[];
  positions?: unknown[];
  portfolio?: unknown;
  snapshot?: unknown;
  dashboard?: unknown;
  transactions?: unknown[];
  prices?: unknown[];
  metadata?: unknown;
};

export type HoldingsV2SelectionState = {
  selectedIds: Set<string>;
  focusedId: string | null;
};

export type HoldingsV2Pagination = {
  page: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
  start: number;
  end: number;
  rows: HoldingsV2Record[];
};

export type HoldingsV2MetricTone =
  | "positive"
  | "negative"
  | "neutral"
  | "warning"
  | "info";

export type HoldingsV2SummaryMetric = {
  id: string;
  label: string;
  value: number | string | null;
  format:
    | "currency"
    | "percentage"
    | "number"
    | "text";
  currency?: string;
  decimals?: number;
  subtitle?: string;
  comparison?: number | null;
  tone?: HoldingsV2MetricTone;
};
