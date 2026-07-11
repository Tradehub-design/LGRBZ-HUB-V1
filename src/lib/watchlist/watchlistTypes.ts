export type WatchlistSortKey =
  | "symbol"
  | "name"
  | "price"
  | "changePercent"
  | "marketValue"
  | "addedAt";

export type WatchlistSortDirection =
  | "asc"
  | "desc";

export type WatchlistViewMode =
  | "table"
  | "cards"
  | "compact";

export type WatchlistSecurity = {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  sector: string;
  industry: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  volume: number;
  averageVolume: number;
  marketCapitalisation: number;
  targetPrice: number | null;
  analystRating: string;
  note: string;
  tags: string[];
  alertCount: number;
  addedAt: string;
  updatedAt: string;
};

export type WatchlistGroup = {
  id: string;
  name: string;
  description: string;
  colour: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  securityIds: string[];
};

export type WatchlistState = {
  version: number;
  groups: WatchlistGroup[];
  securities: WatchlistSecurity[];
  activeGroupId: string;
  viewMode: WatchlistViewMode;
  sortKey: WatchlistSortKey;
  sortDirection: WatchlistSortDirection;
};

export type WatchlistFilters = {
  search: string;
  exchange: string;
  sector: string;
  rating: string;
  performance: "ALL" | "GAINERS" | "LOSERS" | "UNCHANGED";
  tags: string[];
};

export type WatchlistSummary = {
  totalSecurities: number;
  gainers: number;
  losers: number;
  unchanged: number;
  averageChangePercent: number;
  totalMarketCapitalisation: number;
  alerts: number;
};
