import type {
  HoldingsVisualPosition,
} from "./holdingsVisualModels";
import type {
  HoldingsSortDirection,
  HoldingsSortKey,
  HoldingsTableFilters,
  HoldingsTableResult,
} from "./holdingsTableModels";

function normalise(
  value: string
): string {
  return value
    .trim()
    .toLocaleLowerCase(
      "en-AU"
    );
}

function includesSearch(
  position:
    HoldingsVisualPosition,
  search: string
): boolean {
  const query =
    normalise(
      search
    );

  if (!query) {
    return true;
  }

  return [
    position.symbol,
    position.name,
    position.sector,
    position.industry,
    position.country,
    position.currency,
    position.quoteStatus,
  ].some(
    value =>
      normalise(
        value
      ).includes(
        query
      )
  );
}

function matchesPerformance(
  position:
    HoldingsVisualPosition,
  filter:
    HoldingsTableFilters["performance"]
): boolean {
  if (filter === "ALL") {
    return true;
  }

  const returnPercent =
    position.gainLossPercent ||
    0;

  if (filter === "PROFITABLE") {
    return position.gainLoss > 0;
  }

  if (filter === "LOSING") {
    return position.gainLoss < 0;
  }

  if (filter === "FLAT") {
    return position.gainLoss === 0;
  }

  if (filter === "OUTPERFORMERS") {
    return returnPercent >= 10;
  }

  return returnPercent <= -10;
}

function matchesIncome(
  position:
    HoldingsVisualPosition,
  filter:
    HoldingsTableFilters["income"]
): boolean {
  if (filter === "ALL") {
    return true;
  }

  if (filter === "DIVIDEND") {
    return (
      position.annualIncome > 0 ||
      (
        position.dividendYield ||
        0
      ) > 0
    );
  }

  if (filter === "NO_DIVIDEND") {
    return (
      position.annualIncome <= 0 &&
      (
        position.dividendYield ||
        0
      ) <= 0
    );
  }

  return (
    position.dividendYield ||
    0
  ) >= 4;
}

function matchesQuote(
  position:
    HoldingsVisualPosition,
  filter:
    HoldingsTableFilters["quote"]
): boolean {
  if (filter === "ALL") {
    return true;
  }

  const status =
    position.quoteStatus
      .toUpperCase();

  if (filter === "PRICED") {
    return (
      status.includes(
        "PRICED"
      ) ||
      status.includes(
        "LIVE"
      ) ||
      status.includes(
        "FRESH"
      )
    );
  }

  return status.includes(
    filter
  );
}

function sortValue(
  position:
    HoldingsVisualPosition,
  key:
    HoldingsSortKey
): string | number {
  if (key === "SYMBOL") {
    return position.symbol;
  }

  if (key === "NAME") {
    return position.name;
  }

  if (key === "MARKET_VALUE") {
    return position.marketValue;
  }

  if (key === "WEIGHT") {
    return position.portfolioWeight;
  }

  if (key === "DAILY_CHANGE") {
    return (
      position.dailyChangePercent ||
      0
    );
  }

  if (key === "TOTAL_RETURN") {
    return (
      position.gainLossPercent ||
      0
    );
  }

  if (key === "GAIN_LOSS") {
    return position.gainLoss;
  }

  if (key === "DIVIDEND_YIELD") {
    return (
      position.dividendYield ||
      0
    );
  }

  if (key === "ANNUAL_INCOME") {
    return position.annualIncome;
  }

  if (key === "SECTOR") {
    return position.sector;
  }

  if (key === "COUNTRY") {
    return position.country;
  }

  return (
    position.quoteQuality ||
    0
  );
}

function compare(
  left:
    HoldingsVisualPosition,
  right:
    HoldingsVisualPosition,
  key:
    HoldingsSortKey,
  direction:
    HoldingsSortDirection
): number {
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

  let comparison =
    0;

  if (
    typeof leftValue ===
      "number" &&
    typeof rightValue ===
      "number"
  ) {
    comparison =
      leftValue -
      rightValue;
  } else {
    comparison =
      String(
        leftValue
      ).localeCompare(
        String(
          rightValue
        ),
        "en-AU",
        {
          sensitivity:
            "base",
        }
      );
  }

  return direction ===
    "ASC"
      ? comparison
      : -comparison;
}

function activeFilterCount(
  filters:
    HoldingsTableFilters
): number {
  let count =
    0;

  if (
    filters.search.trim()
  ) {
    count += 1;
  }

  if (
    filters.sectors.length >
    0
  ) {
    count += 1;
  }

  if (
    filters.countries.length >
    0
  ) {
    count += 1;
  }

  if (
    filters.performance !==
    "ALL"
  ) {
    count += 1;
  }

  if (
    filters.income !==
    "ALL"
  ) {
    count += 1;
  }

  if (
    filters.quote !==
    "ALL"
  ) {
    count += 1;
  }

  return count;
}

export function createHoldingsTableResult({
  positions,
  filters,
  sortKey,
  sortDirection,
  page,
  pageSize,
}: {
  positions:
    readonly HoldingsVisualPosition[];

  filters:
    HoldingsTableFilters;

  sortKey:
    HoldingsSortKey;

  sortDirection:
    HoldingsSortDirection;

  page: number;
  pageSize: number;
}): HoldingsTableResult {
  const availableSectors =
    Array.from(
      new Set(
        positions.map(
          position =>
            position.sector
        )
      )
    )
      .filter(
        Boolean
      )
      .sort(
        (
          left,
          right
        ) =>
          left.localeCompare(
            right,
            "en-AU"
          )
      );

  const availableCountries =
    Array.from(
      new Set(
        positions.map(
          position =>
            position.country
        )
      )
    )
      .filter(
        Boolean
      )
      .sort(
        (
          left,
          right
        ) =>
          left.localeCompare(
            right,
            "en-AU"
          )
      );

  const filtered =
    positions.filter(
      position =>
        includesSearch(
          position,
          filters.search
        ) &&
        (
          filters.sectors.length ===
            0 ||
          filters.sectors.includes(
            position.sector
          )
        ) &&
        (
          filters.countries.length ===
            0 ||
          filters.countries.includes(
            position.country
          )
        ) &&
        matchesPerformance(
          position,
          filters.performance
        ) &&
        matchesIncome(
          position,
          filters.income
        ) &&
        matchesQuote(
          position,
          filters.quote
        )
    );

  const sorted =
    [...filtered].sort(
      (
        left,
        right
      ) =>
        compare(
          left,
          right,
          sortKey,
          sortDirection
        )
    );

  const safePageSize =
    Math.max(
      5,
      pageSize
    );

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        sorted.length /
        safePageSize
      )
    );

  const safePage =
    Math.min(
      Math.max(
        1,
        page
      ),
      totalPages
    );

  const startIndex =
    (
      safePage -
      1
    ) *
    safePageSize;

  const endIndex =
    Math.min(
      startIndex +
      safePageSize,
      sorted.length
    );

  return {
    rows:
      sorted.slice(
        startIndex,
        endIndex
      ),

    allFilteredRows:
      sorted,

    page:
      safePage,

    pageSize:
      safePageSize,

    totalPages,

    totalRows:
      positions.length,

    filteredRows:
      sorted.length,

    startIndex:
      sorted.length === 0
        ? 0
        : startIndex +
          1,

    endIndex,

    activeFilterCount:
      activeFilterCount(
        filters
      ),

    availableSectors,
    availableCountries,
  };
}

export function exportHoldingsCsv(
  rows:
    readonly HoldingsVisualPosition[]
): string {
  const headers = [
    "Symbol",
    "Name",
    "Quantity",
    "Market Value",
    "Cost Basis",
    "Portfolio Weight %",
    "Daily Change",
    "Daily Change %",
    "Gain Loss",
    "Gain Loss %",
    "Dividend Yield %",
    "Annual Income",
    "Sector",
    "Industry",
    "Country",
    "Currency",
    "Quote Status",
    "Quote Quality",
  ];

  const escape =
    (
      value:
        string |
        number |
        null
    ): string => {
      const text =
        value === null
          ? ""
          : String(
              value
            );

      return `"${text.replace(
        /"/g,
        '""'
      )}"`;
    };

  return [
    headers
      .map(
        escape
      )
      .join(
        ","
      ),

    ...rows.map(
      position =>
        [
          position.symbol,
          position.name,
          position.quantity,
          position.marketValue,
          position.costBasis,
          position.portfolioWeight,
          position.dailyChange,
          position.dailyChangePercent,
          position.gainLoss,
          position.gainLossPercent,
          position.dividendYield,
          position.annualIncome,
          position.sector,
          position.industry,
          position.country,
          position.currency,
          position.quoteStatus,
          position.quoteQuality,
        ]
          .map(
            escape
          )
          .join(
            ","
          )
    ),
  ].join(
    "\n"
  );
}
