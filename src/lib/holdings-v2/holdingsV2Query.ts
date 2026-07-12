import {
  HoldingsV2FilterState,
  HoldingsV2Pagination,
  HoldingsV2Record,
  HoldingsV2SortDirection,
  HoldingsV2SortKey,
} from "./holdingsV2Types";

export const defaultHoldingsV2Filters:
  HoldingsV2FilterState = {
    search: "",
    sectors: [],
    industries: [],
    currencies: [],
    exchanges: [],
    accounts: [],
    brokers: [],
    riskLevels: [],
    priceStatuses: [],
    positionStatuses: [
      "OPEN",
      "PARTIAL",
      "UNKNOWN",
    ],

    profitableOnly: false,
    losingOnly: false,
    missingPricesOnly: false,
    stalePricesOnly: false,

    minimumMarketValue: null,
    maximumMarketValue: null,

    minimumWeight: null,
    maximumWeight: null,

    tags: [],
  };

function includesSearch(
  holding: HoldingsV2Record,
  search: string
) {
  const query =
    search
      .trim()
      .toLowerCase();

  if (!query) {
    return true;
  }

  const haystack = [
    holding.symbol,
    holding.name,
    holding.exchange,
    holding.currency,
    holding.sector,
    holding.industry,
    holding.account,
    holding.broker,
    holding.strategy,
    holding.notes,
    ...holding.tags,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(
    query
  );
}

function includesSelected(
  value: string,
  selected: string[]
) {
  return (
    selected.length ===
      0 ||
    selected.includes(
      value
    )
  );
}

export function filterHoldingsV2(
  holdings: HoldingsV2Record[],
  filters: HoldingsV2FilterState
) {
  return holdings.filter(
    (holding) => {
      if (
        !includesSearch(
          holding,
          filters.search
        )
      ) {
        return false;
      }

      if (
        !includesSelected(
          holding.sector,
          filters.sectors
        )
      ) {
        return false;
      }

      if (
        !includesSelected(
          holding.industry,
          filters.industries
        )
      ) {
        return false;
      }

      if (
        !includesSelected(
          holding.currency,
          filters.currencies
        )
      ) {
        return false;
      }

      if (
        !includesSelected(
          holding.exchange,
          filters.exchanges
        )
      ) {
        return false;
      }

      if (
        !includesSelected(
          holding.account,
          filters.accounts
        )
      ) {
        return false;
      }

      if (
        !includesSelected(
          holding.broker,
          filters.brokers
        )
      ) {
        return false;
      }

      if (
        filters.riskLevels.length >
          0 &&
        !filters.riskLevels.includes(
          holding.riskLevel
        )
      ) {
        return false;
      }

      if (
        filters.priceStatuses.length >
          0 &&
        !filters.priceStatuses.includes(
          holding.priceStatus
        )
      ) {
        return false;
      }

      if (
        filters.positionStatuses.length >
          0 &&
        !filters.positionStatuses.includes(
          holding.status
        )
      ) {
        return false;
      }

      if (
        filters.profitableOnly &&
        (
          holding.unrealisedGainLoss ??
          0
        ) <= 0
      ) {
        return false;
      }

      if (
        filters.losingOnly &&
        (
          holding.unrealisedGainLoss ??
          0
        ) >= 0
      ) {
        return false;
      }

      if (
        filters.missingPricesOnly &&
        holding.currentPrice !==
          null
      ) {
        return false;
      }

      if (
        filters.stalePricesOnly &&
        holding.priceStatus !==
          "STALE"
      ) {
        return false;
      }

      if (
        filters.minimumMarketValue !==
          null &&
        (
          holding.marketValue ??
          0
        ) <
          filters.minimumMarketValue
      ) {
        return false;
      }

      if (
        filters.maximumMarketValue !==
          null &&
        (
          holding.marketValue ??
          0
        ) >
          filters.maximumMarketValue
      ) {
        return false;
      }

      if (
        filters.minimumWeight !==
          null &&
        (
          holding.portfolioWeight ??
          0
        ) <
          filters.minimumWeight
      ) {
        return false;
      }

      if (
        filters.maximumWeight !==
          null &&
        (
          holding.portfolioWeight ??
          0
        ) >
          filters.maximumWeight
      ) {
        return false;
      }

      if (
        filters.tags.length >
          0 &&
        !filters.tags.every(
          (tag) =>
            holding.tags.includes(
              tag
            )
        )
      ) {
        return false;
      }

      return true;
    }
  );
}

function sortValue(
  holding: HoldingsV2Record,
  key: HoldingsV2SortKey
): string | number {
  if (
    key === "symbol"
  ) {
    return holding.symbol;
  }

  if (
    key === "name"
  ) {
    return holding.name;
  }

  if (
    key === "sector"
  ) {
    return holding.sector;
  }

  if (
    key === "currency"
  ) {
    return holding.currency;
  }

  if (
    key === "lastUpdated"
  ) {
    return holding.lastUpdated
      ? new Date(
          holding.lastUpdated
        ).getTime()
      : 0;
  }

  return (
    holding[key] ??
    Number.NEGATIVE_INFINITY
  ) as number;
}

export function sortHoldingsV2(
  holdings: HoldingsV2Record[],
  key: HoldingsV2SortKey,
  direction: HoldingsV2SortDirection
) {
  const multiplier =
    direction ===
    "asc"
      ? 1
      : -1;

  return [
    ...holdings,
  ].sort(
    (
      left,
      right
    ) => {
      const leftValue =
        sortValue(
          left,
          key
        );

      const rightValue =
        sortValue(
          right,
          key
        );

      if (
        typeof leftValue ===
          "string" &&
        typeof rightValue ===
          "string"
      ) {
        return leftValue.localeCompare(
          rightValue,
          "en-AU",
          {
            sensitivity:
              "base",
          }
        ) *
          multiplier;
      }

      return (
        Number(
          leftValue
        ) -
        Number(
          rightValue
        )
      ) *
        multiplier;
    }
  );
}

export function paginateHoldingsV2(
  holdings: HoldingsV2Record[],
  page: number,
  pageSize: number
): HoldingsV2Pagination {
  const safePageSize =
    Math.max(
      1,
      pageSize
    );

  const totalRows =
    holdings.length;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalRows /
          safePageSize
      )
    );

  const safePage =
    Math.min(
      totalPages,
      Math.max(
        1,
        page
      )
    );

  const startIndex =
    (
      safePage -
      1
    ) *
    safePageSize;

  const rows =
    holdings.slice(
      startIndex,
      startIndex +
        safePageSize
    );

  return {
    page:
      safePage,
    pageSize:
      safePageSize,
    totalRows,
    totalPages,
    start:
      totalRows ===
      0
        ? 0
        : startIndex +
          1,
    end:
      Math.min(
        totalRows,
        startIndex +
          safePageSize
      ),
    rows,
  };
}

export function countActiveHoldingsV2Filters(
  filters: HoldingsV2FilterState
) {
  let count = 0;

  if (
    filters.search.trim()
  ) {
    count += 1;
  }

  const arrays = [
    filters.sectors,
    filters.industries,
    filters.currencies,
    filters.exchanges,
    filters.accounts,
    filters.brokers,
    filters.riskLevels,
    filters.priceStatuses,
    filters.tags,
  ];

  arrays.forEach(
    (values) => {
      if (
        values.length >
        0
      ) {
        count += 1;
      }
    }
  );

  if (
    filters.positionStatuses.length !==
      3 ||
    filters.positionStatuses.includes(
      "CLOSED"
    )
  ) {
    count += 1;
  }

  if (
    filters.profitableOnly
  ) {
    count += 1;
  }

  if (
    filters.losingOnly
  ) {
    count += 1;
  }

  if (
    filters.missingPricesOnly
  ) {
    count += 1;
  }

  if (
    filters.stalePricesOnly
  ) {
    count += 1;
  }

  if (
    filters.minimumMarketValue !==
    null
  ) {
    count += 1;
  }

  if (
    filters.maximumMarketValue !==
    null
  ) {
    count += 1;
  }

  if (
    filters.minimumWeight !==
    null
  ) {
    count += 1;
  }

  if (
    filters.maximumWeight !==
    null
  ) {
    count += 1;
  }

  return count;
}

export function uniqueHoldingsV2Values(
  holdings: HoldingsV2Record[],
  selector: (
    holding: HoldingsV2Record
  ) => string
) {
  return Array.from(
    new Set(
      holdings
        .map(
          selector
        )
        .filter(Boolean)
    )
  ).sort(
    (
      left,
      right
    ) =>
      left.localeCompare(
        right,
        "en-AU"
      )
  );
}
