import type {
  HoldingsVisualPosition,
} from "./holdingsVisualModels";

export type HoldingsPerformanceFilter =
  | "ALL"
  | "PROFITABLE"
  | "LOSING"
  | "FLAT"
  | "OUTPERFORMERS"
  | "UNDERPERFORMERS";

export type HoldingsIncomeFilter =
  | "ALL"
  | "DIVIDEND"
  | "NO_DIVIDEND"
  | "HIGH_YIELD";

export type HoldingsQuoteFilter =
  | "ALL"
  | "PRICED"
  | "LIVE"
  | "DELAYED"
  | "STALE"
  | "ESTIMATED";

export type HoldingsSortDirection =
  | "ASC"
  | "DESC";

export type HoldingsSortKey =
  | "SYMBOL"
  | "NAME"
  | "MARKET_VALUE"
  | "WEIGHT"
  | "DAILY_CHANGE"
  | "TOTAL_RETURN"
  | "GAIN_LOSS"
  | "DIVIDEND_YIELD"
  | "ANNUAL_INCOME"
  | "SECTOR"
  | "COUNTRY"
  | "QUOTE_QUALITY";

export type HoldingsColumnKey =
  | "RANK"
  | "HOLDING"
  | "QUANTITY"
  | "MARKET_VALUE"
  | "WEIGHT"
  | "DAILY_CHANGE"
  | "TOTAL_RETURN"
  | "GAIN_LOSS"
  | "DIVIDEND_YIELD"
  | "ANNUAL_INCOME"
  | "SECTOR"
  | "COUNTRY"
  | "QUOTE_STATUS";

export type HoldingsTableFilters = {
  search: string;

  sectors: string[];
  countries: string[];

  performance:
    HoldingsPerformanceFilter;

  income:
    HoldingsIncomeFilter;

  quote:
    HoldingsQuoteFilter;
};

export type HoldingsTableState = {
  filters:
    HoldingsTableFilters;

  sortKey:
    HoldingsSortKey;

  sortDirection:
    HoldingsSortDirection;

  page: number;
  pageSize: number;

  visibleColumns:
    HoldingsColumnKey[];
};

export type HoldingsTableResult = {
  rows:
    HoldingsVisualPosition[];

  allFilteredRows:
    HoldingsVisualPosition[];

  page: number;
  pageSize: number;
  totalPages: number;

  totalRows: number;
  filteredRows: number;

  startIndex: number;
  endIndex: number;

  activeFilterCount: number;

  availableSectors: string[];
  availableCountries: string[];
};

export const defaultHoldingsColumns:
  HoldingsColumnKey[] = [
    "RANK",
    "HOLDING",
    "QUANTITY",
    "MARKET_VALUE",
    "WEIGHT",
    "DAILY_CHANGE",
    "TOTAL_RETURN",
    "GAIN_LOSS",
    "DIVIDEND_YIELD",
    "ANNUAL_INCOME",
    "SECTOR",
    "COUNTRY",
    "QUOTE_STATUS",
  ];
