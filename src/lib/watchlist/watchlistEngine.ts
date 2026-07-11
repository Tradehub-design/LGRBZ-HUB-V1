import {
  WatchlistFilters,
  WatchlistSecurity,
  WatchlistSortDirection,
  WatchlistSortKey,
  WatchlistSummary,
} from "@/lib/watchlist/watchlistTypes";

export function filterWatchlistSecurities(
  securities: WatchlistSecurity[],
  filters: WatchlistFilters
) {
  const search =
    filters.search
      .trim()
      .toLowerCase();

  return securities.filter(
    (security) => {
      if (
        search &&
        ![
          security.symbol,
          security.name,
          security.exchange,
          security.sector,
          security.industry,
          security.note,
          ...security.tags,
        ].some((value) =>
          String(value)
            .toLowerCase()
            .includes(search)
        )
      ) {
        return false;
      }

      if (
        filters.exchange !== "ALL" &&
        security.exchange !==
          filters.exchange
      ) {
        return false;
      }

      if (
        filters.sector !== "ALL" &&
        security.sector !==
          filters.sector
      ) {
        return false;
      }

      if (
        filters.rating !== "ALL" &&
        security.analystRating !==
          filters.rating
      ) {
        return false;
      }

      if (
        filters.performance ===
          "GAINERS" &&
        security.changePercent <= 0
      ) {
        return false;
      }

      if (
        filters.performance ===
          "LOSERS" &&
        security.changePercent >= 0
      ) {
        return false;
      }

      if (
        filters.performance ===
          "UNCHANGED" &&
        security.changePercent !== 0
      ) {
        return false;
      }

      if (
        filters.tags.length > 0 &&
        !filters.tags.every((tag) =>
          security.tags.includes(tag)
        )
      ) {
        return false;
      }

      return true;
    }
  );
}

function comparableValue(
  security: WatchlistSecurity,
  key: WatchlistSortKey
) {
  if (key === "marketValue") {
    return security.marketCapitalisation;
  }

  if (key === "addedAt") {
    return (
      new Date(
        security.addedAt
      ).getTime() || 0
    );
  }

  if (
    key === "price" ||
    key === "changePercent"
  ) {
    return security[key];
  }

  return String(
    security[key] ?? ""
  ).toLowerCase();
}

export function sortWatchlistSecurities(
  securities: WatchlistSecurity[],
  key: WatchlistSortKey,
  direction: WatchlistSortDirection
) {
  return securities
    .map((security, index) => ({
      security,
      index,
    }))
    .sort((left, right) => {
      const a =
        comparableValue(
          left.security,
          key
        );

      const b =
        comparableValue(
          right.security,
          key
        );

      let result = 0;

      if (
        typeof a === "number" &&
        typeof b === "number"
      ) {
        result = a - b;
      } else {
        result = String(a).localeCompare(
          String(b),
          "en-AU",
          {
            numeric: true,
            sensitivity: "base",
          }
        );
      }

      if (result === 0) {
        return (
          left.index -
          right.index
        );
      }

      return direction === "asc"
        ? result
        : -result;
    })
    .map(
      (entry) => entry.security
    );
}

export function calculateWatchlistSummary(
  securities: WatchlistSecurity[]
): WatchlistSummary {
  const gainers =
    securities.filter(
      (security) =>
        security.changePercent > 0
    ).length;

  const losers =
    securities.filter(
      (security) =>
        security.changePercent < 0
    ).length;

  const unchanged =
    securities.length -
    gainers -
    losers;

  const averageChangePercent =
    securities.length === 0
      ? 0
      : securities.reduce(
          (sum, security) =>
            sum +
            security.changePercent,
          0
        ) / securities.length;

  return {
    totalSecurities:
      securities.length,
    gainers,
    losers,
    unchanged,
    averageChangePercent,
    totalMarketCapitalisation:
      securities.reduce(
        (sum, security) =>
          sum +
          security.marketCapitalisation,
        0
      ),
    alerts: securities.reduce(
      (sum, security) =>
        sum +
        security.alertCount,
      0
    ),
  };
}

export function getWatchlistFilterOptions(
  securities: WatchlistSecurity[]
) {
  return {
    exchanges: Array.from(
      new Set(
        securities
          .map(
            (security) =>
              security.exchange
          )
          .filter(Boolean)
      )
    ).sort(),
    sectors: Array.from(
      new Set(
        securities
          .map(
            (security) =>
              security.sector
          )
          .filter(Boolean)
      )
    ).sort(),
    ratings: Array.from(
      new Set(
        securities
          .map(
            (security) =>
              security.analystRating
          )
          .filter(Boolean)
      )
    ).sort(),
    tags: Array.from(
      new Set(
        securities.flatMap(
          (security) =>
            security.tags
        )
      )
    ).sort(),
  };
}
