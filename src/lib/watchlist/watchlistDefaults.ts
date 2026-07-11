import {
  WatchlistFilters,
  WatchlistSecurity,
  WatchlistState,
} from "@/lib/watchlist/watchlistTypes";

function nowIso() {
  return new Date().toISOString();
}

export const defaultWatchlistFilters:
  WatchlistFilters = {
    search: "",
    exchange: "ALL",
    sector: "ALL",
    rating: "ALL",
    performance: "ALL",
    tags: [],
  };

export const seedWatchlistSecurities:
  WatchlistSecurity[] = [
    {
      id: "watch-cba",
      symbol: "CBA",
      name: "Commonwealth Bank of Australia",
      exchange: "ASX",
      currency: "AUD",
      sector: "Financials",
      industry: "Banks",
      price: 0,
      previousClose: 0,
      change: 0,
      changePercent: 0,
      dayHigh: 0,
      dayLow: 0,
      fiftyTwoWeekHigh: 0,
      fiftyTwoWeekLow: 0,
      volume: 0,
      averageVolume: 0,
      marketCapitalisation: 0,
      targetPrice: null,
      analystRating: "Unrated",
      note: "",
      tags: ["Core"],
      alertCount: 0,
      addedAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: "watch-bhp",
      symbol: "BHP",
      name: "BHP Group",
      exchange: "ASX",
      currency: "AUD",
      sector: "Materials",
      industry: "Diversified Mining",
      price: 0,
      previousClose: 0,
      change: 0,
      changePercent: 0,
      dayHigh: 0,
      dayLow: 0,
      fiftyTwoWeekHigh: 0,
      fiftyTwoWeekLow: 0,
      volume: 0,
      averageVolume: 0,
      marketCapitalisation: 0,
      targetPrice: null,
      analystRating: "Unrated",
      note: "",
      tags: ["Income"],
      alertCount: 0,
      addedAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: "watch-aapl",
      symbol: "AAPL",
      name: "Apple",
      exchange: "NASDAQ",
      currency: "USD",
      sector: "Technology",
      industry: "Consumer Electronics",
      price: 0,
      previousClose: 0,
      change: 0,
      changePercent: 0,
      dayHigh: 0,
      dayLow: 0,
      fiftyTwoWeekHigh: 0,
      fiftyTwoWeekLow: 0,
      volume: 0,
      averageVolume: 0,
      marketCapitalisation: 0,
      targetPrice: null,
      analystRating: "Unrated",
      note: "",
      tags: ["Growth"],
      alertCount: 0,
      addedAt: nowIso(),
      updatedAt: nowIso(),
    },
  ];

export const defaultWatchlistState:
  WatchlistState = {
    version: 1,
    groups: [
      {
        id: "watchlist-main",
        name: "Main Watchlist",
        description:
          "Primary securities under active review.",
        colour: "slate",
        isDefault: true,
        createdAt: nowIso(),
        updatedAt: nowIso(),
        securityIds:
          seedWatchlistSecurities.map(
            (security) => security.id
          ),
      },
    ],
    securities:
      seedWatchlistSecurities,
    activeGroupId: "watchlist-main",
    viewMode: "table",
    sortKey: "symbol",
    sortDirection: "asc",
  };
