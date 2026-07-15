"use client";

import {
  useMemo,
} from "react";
import type {
  DividendHolding,
  DividendTransaction,
} from "@/lib/dividend-data";
import {
  DividendCentreConnected,
} from "./DividendCentreConnected";

type UnknownRecord =
  Record<
    string,
    unknown
  >;

type Props = {
  holdings?: unknown;
  transactions?: unknown;
  portfolio?: unknown;
  dashboard?: unknown;
  snapshot?: unknown;
  data?: unknown;
  baseCurrency?: string;
};

type AdaptedPortfolioData = {
  holdings:
    DividendHolding[];
  transactions:
    DividendTransaction[];
};

function isRecord(
  value: unknown
): value is UnknownRecord {
  return (
    Boolean(
      value
    ) &&
    typeof value ===
      "object" &&
    !Array.isArray(
      value
    )
  );
}

function stringValue(
  value: unknown,
  fallback = ""
): string {
  if (
    typeof value ===
      "string"
  ) {
    return value;
  }

  if (
    typeof value ===
      "number" &&
    Number.isFinite(
      value
    )
  ) {
    return String(
      value
    );
  }

  return fallback;
}

function numberValue(
  value: unknown,
  fallback = 0
): number {
  if (
    typeof value ===
      "number"
  ) {
    return Number.isFinite(
      value
    )
      ? value
      : fallback;
  }

  if (
    typeof value ===
      "string"
  ) {
    const cleaned =
      value
        .trim()
        .replace(
          /,/g,
          ""
        )
        .replace(
          /[$£€¥]/g,
          ""
        )
        .replace(
          /%$/,
          ""
        );

    if (!cleaned) {
      return fallback;
    }

    const parsed =
      Number(
        cleaned
      );

    return Number.isFinite(
      parsed
    )
      ? parsed
      : fallback;
  }

  return fallback;
}

function nullableNumber(
  value: unknown
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const parsed =
    numberValue(
      value,
      Number.NaN
    );

  return Number.isFinite(
    parsed
  )
    ? parsed
    : null;
}

function firstDefined(
  record: UnknownRecord,
  keys: string[]
): unknown {
  for (
    const key of
    keys
  ) {
    const value =
      record[key];

    if (
      value !==
        undefined &&
      value !==
        null &&
      value !==
        ""
    ) {
      return value;
    }
  }

  return undefined;
}

function normaliseDate(
  value: unknown
): string {
  const raw =
    stringValue(
      value
    )
      .trim();

  if (!raw) {
    return "";
  }

  const isoMatch =
    raw.match(
      /^(\d{4})-(\d{1,2})-(\d{1,2})/
    );

  if (
    isoMatch
  ) {
    return [
      isoMatch[1],
      isoMatch[2].padStart(
        2,
        "0"
      ),
      isoMatch[3].padStart(
        2,
        "0"
      ),
    ].join(
      "-"
    );
  }

  const australianMatch =
    raw.match(
      /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/
    );

  if (
    australianMatch
  ) {
    return [
      australianMatch[3],
      australianMatch[2].padStart(
        2,
        "0"
      ),
      australianMatch[1].padStart(
        2,
        "0"
      ),
    ].join(
      "-"
    );
  }

  const parsed =
    new Date(
      raw
    );

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return raw;
  }

  return parsed
    .toISOString()
    .slice(
      0,
      10
    );
}

function normaliseCurrency(
  value: unknown,
  fallback = "AUD"
): string {
  const currency =
    stringValue(
      value,
      fallback
    )
      .trim()
      .toUpperCase();

  return (
    currency ||
    fallback
  );
}

function normaliseExchange(
  value: unknown
): string | null {
  const exchange =
    stringValue(
      value
    )
      .trim()
      .toUpperCase();

  if (!exchange) {
    return null;
  }

  const aliases:
    Record<
      string,
      string
    > = {
      AU:
        "ASX",
      AX:
        "ASX",
      AUS:
        "ASX",
      ASX:
        "ASX",
      NAS:
        "NASDAQ",
      NASDAQ:
        "NASDAQ",
      NYSE:
        "NYSE",
      US:
        "US",
      LSE:
        "LSE",
      LON:
        "LSE",
      TSX:
        "TSX",
      HKEX:
        "HKEX",
      HK:
        "HKEX",
      NZX:
        "NZX",
    };

  return (
    aliases[
      exchange
    ] ||
    exchange
  );
}

function normaliseSymbol(
  value: unknown,
  exchangeValue?: unknown
): string {
  let symbol =
    stringValue(
      value
    )
      .trim()
      .toUpperCase()
      .replace(
        /^\$/,
        ""
      )
      .replace(
        /\s+/g,
        ""
      );

  if (!symbol) {
    return "";
  }

  let exchange =
    normaliseExchange(
      exchangeValue
    );

  if (
    symbol.includes(
      ":"
    )
  ) {
    const [
      prefix,
      ...parts
    ] =
      symbol.split(
        ":"
      );

    const ticker =
      parts.join(
        ":"
      );

    if (
      ticker
    ) {
      symbol =
        ticker;

      exchange =
        exchange ||
        normaliseExchange(
          prefix
        );
    }
  }

  if (
    exchange ===
      "ASX" &&
    !symbol.endsWith(
      ".AX"
    )
  ) {
    symbol =
      `${symbol}.AX`;
  }

  if (
    exchange ===
      "LSE" &&
    !symbol.endsWith(
      ".L"
    )
  ) {
    symbol =
      `${symbol}.L`;
  }

  if (
    exchange ===
      "TSX" &&
    !symbol.endsWith(
      ".TO"
    )
  ) {
    symbol =
      `${symbol}.TO`;
  }

  if (
    exchange ===
      "HKEX" &&
    !symbol.endsWith(
      ".HK"
    )
  ) {
    symbol =
      `${symbol}.HK`;
  }

  if (
    exchange ===
      "NZX" &&
    !symbol.endsWith(
      ".NZ"
    )
  ) {
    symbol =
      `${symbol}.NZ`;
  }

  return symbol;
}

function readDirectArray(
  source: unknown,
  keys: string[]
): unknown[] {
  if (
    Array.isArray(
      source
    )
  ) {
    return source;
  }

  if (
    !isRecord(
      source
    )
  ) {
    return [];
  }

  for (
    const key of
    keys
  ) {
    const value =
      source[
        key
      ];

    if (
      Array.isArray(
        value
      )
    ) {
      return value;
    }
  }

  return [];
}

function readNestedArray(
  source: unknown,
  paths: string[][]
): unknown[] {
  for (
    const path of
    paths
  ) {
    let current:
      unknown =
      source;

    let matched =
      true;

    for (
      const segment of
      path
    ) {
      if (
        !isRecord(
          current
        )
      ) {
        matched =
          false;

        break;
      }

      current =
        current[
          segment
        ];
    }

    if (
      matched &&
      Array.isArray(
        current
      )
    ) {
      return current;
    }
  }

  return [];
}

function collectArrays(
  sources: unknown[],
  keys: string[],
  paths: string[][] = []
): unknown[] {
  const collected:
    unknown[] = [];

  for (
    const source of
    sources
  ) {
    collected.push(
      ...readDirectArray(
        source,
        keys
      )
    );

    if (
      paths.length >
      0
    ) {
      collected.push(
        ...readNestedArray(
          source,
          paths
        )
      );
    }
  }

  return collected;
}

function holdingCurrentPrice(
  record: UnknownRecord,
  quantity: number
): number | null {
  const direct =
    nullableNumber(
      firstDefined(
        record,
        [
          "currentPrice",
          "marketPrice",
          "lastPrice",
          "livePrice",
          "price",
          "quotePrice",
        ]
      )
    );

  if (
    direct !==
      null &&
    direct >
      0
  ) {
    return direct;
  }

  const marketValue =
    nullableNumber(
      firstDefined(
        record,
        [
          "marketValue",
          "marketValueAud",
          "value",
          "valueAud",
          "currentValue",
          "currentValueAud",
        ]
      )
    );

  if (
    marketValue !==
      null &&
    quantity >
      0
  ) {
    return (
      marketValue /
      quantity
    );
  }

  return null;
}

function holdingAverageCost(
  record: UnknownRecord,
  quantity: number
): number | null {
  const direct =
    nullableNumber(
      firstDefined(
        record,
        [
          "averageCost",
          "averageCostAud",
          "avgCost",
          "averagePrice",
          "costPrice",
          "costPerUnit",
          "unitCost",
        ]
      )
    );

  if (
    direct !==
      null
  ) {
    return direct;
  }

  const totalCost =
    nullableNumber(
      firstDefined(
        record,
        [
          "totalCost",
          "totalCostAud",
          "costBase",
          "costBaseAud",
          "investedValue",
          "investedValueAud",
        ]
      )
    );

  if (
    totalCost !==
      null &&
    quantity >
      0
  ) {
    return (
      totalCost /
      quantity
    );
  }

  return null;
}

function adaptHolding(
  value: unknown,
  index: number
): DividendHolding | null {
  if (
    !isRecord(
      value
    )
  ) {
    return null;
  }

  const exchange =
    normaliseExchange(
      firstDefined(
        value,
        [
          "exchange",
          "market",
          "listingExchange",
        ]
      )
    );

  const symbol =
    normaliseSymbol(
      firstDefined(
        value,
        [
          "symbol",
          "ticker",
          "assetTicker",
          "code",
          "securityCode",
        ]
      ),
      exchange
    );

  if (!symbol) {
    return null;
  }

  const quantity =
    numberValue(
      firstDefined(
        value,
        [
          "quantity",
          "remainingQuantity",
          "shares",
          "units",
          "holdingQuantity",
        ]
      )
    );

  if (
    quantity <=
    0
  ) {
    return null;
  }

  const currency =
    normaliseCurrency(
      firstDefined(
        value,
        [
          "currency",
          "tradingCurrency",
          "quoteCurrency",
        ]
      ),
      symbol.endsWith(
        ".AX"
      )
        ? "AUD"
        : "USD"
    );

  return {
    id:
      stringValue(
        firstDefined(
          value,
          [
            "id",
            "holdingId",
          ]
        ),
        `holding-${index}-${symbol}`
      ),

    symbol,

    exchange:
      exchange ||
      (
        symbol.endsWith(
          ".AX"
        )
          ? "ASX"
          : null
      ),

    currency,

    quantity,

    averageCost:
      holdingAverageCost(
        value,
        quantity
      ),

    currentPrice:
      holdingCurrentPrice(
        value,
        quantity
      ),

    openedAt:
      normaliseDate(
        firstDefined(
          value,
          [
            "openedAt",
            "purchaseDate",
            "firstPurchaseDate",
            "dateOpened",
          ]
        )
      ) ||
      null,

    closedAt:
      normaliseDate(
        firstDefined(
          value,
          [
            "closedAt",
            "saleDate",
            "dateClosed",
          ]
        )
      ) ||
      null,

    account:
      stringValue(
        firstDefined(
          value,
          [
            "account",
            "accountName",
            "portfolioAccount",
          ]
        )
      ) ||
      null,

    broker:
      stringValue(
        firstDefined(
          value,
          [
            "broker",
            "platform",
            "brokerName",
          ]
        )
      ) ||
      null,
  };
}

function transactionType(
  record: UnknownRecord
): string | null {
  const value =
    stringValue(
      firstDefined(
        record,
        [
          "type",
          "transactionType",
          "action",
          "category",
          "eventType",
        ]
      )
    )
      .trim();

  return (
    value ||
    null
  );
}

function isDividendTransactionType(
  value: string | null
): boolean {
  const normalised =
    (
      value ||
      ""
    )
      .trim()
      .toUpperCase();

  return (
    normalised.includes(
      "DIVIDEND"
    ) ||
    normalised.includes(
      "DISTRIBUTION"
    ) ||
    normalised.includes(
      "INCOME"
    )
  );
}

function transactionAmount(
  record: UnknownRecord,
  type: string | null
): number | null {
  const amount =
    nullableNumber(
      firstDefined(
        record,
        [
          "amountAud",
          "cashAmountAud",
          "netAmountAud",
          "totalAud",
          "totalFeesIncludedAud",
          "amount",
          "cashAmount",
          "netAmount",
          "total",
          "grossAmount",
          "value",
        ]
      )
    );

  if (
    amount ===
      null
  ) {
    return null;
  }

  return isDividendTransactionType(
    type
  )
    ? Math.abs(
        amount
      )
    : amount;
}

function transactionDividendPerShare(
  record: UnknownRecord,
  type: string | null
): number | null {
  const explicit =
    nullableNumber(
      firstDefined(
        record,
        [
          "dividendPerShare",
          "distributionPerUnit",
          "dividendRate",
          "rate",
          "cashRate",
        ]
      )
    );

  if (
    explicit !==
      null
  ) {
    return Math.abs(
      explicit
    );
  }

  if (
    !isDividendTransactionType(
      type
    )
  ) {
    return null;
  }

  const price =
    nullableNumber(
      firstDefined(
        record,
        [
          "price",
          "priceAud",
          "unitPrice",
          "transactionPrice",
        ]
      )
    );

  if (
    price !==
      null &&
    price >
      0
  ) {
    return price;
  }

  const amount =
    transactionAmount(
      record,
      type
    );

  const quantity =
    nullableNumber(
      firstDefined(
        record,
        [
          "quantity",
          "shares",
          "units",
          "eligibleQuantity",
        ]
      )
    );

  if (
    amount !==
      null &&
    quantity !==
      null &&
    quantity >
      0
  ) {
    return (
      amount /
      quantity
    );
  }

  return null;
}

function adaptTransaction(
  value: unknown,
  index: number
): DividendTransaction | null {
  if (
    !isRecord(
      value
    )
  ) {
    return null;
  }

  const exchange =
    normaliseExchange(
      firstDefined(
        value,
        [
          "exchange",
          "market",
          "listingExchange",
        ]
      )
    );

  const symbol =
    normaliseSymbol(
      firstDefined(
        value,
        [
          "symbol",
          "ticker",
          "assetTicker",
          "code",
          "securityCode",
        ]
      ),
      exchange
    );

  const date =
    normaliseDate(
      firstDefined(
        value,
        [
          "date",
          "transactionDate",
          "tradeDate",
          "paymentDate",
          "receivedAt",
          "settlementDate",
        ]
      )
    );

  if (
    !symbol ||
    !date
  ) {
    return null;
  }

  const type =
    transactionType(
      value
    );

  return {
    id:
      stringValue(
        firstDefined(
          value,
          [
            "id",
            "transactionId",
            "reference",
          ]
        ),
        `transaction-${index}-${symbol}-${date}`
      ),

    symbol,

    type,

    date,

    quantity:
      nullableNumber(
        firstDefined(
          value,
          [
            "quantity",
            "shares",
            "units",
            "eligibleQuantity",
          ]
        )
      ),

    amount:
      transactionAmount(
        value,
        type
      ),

    dividendPerShare:
      transactionDividendPerShare(
        value,
        type
      ),

    currency:
      normaliseCurrency(
        firstDefined(
          value,
          [
            "currency",
            "transactionCurrency",
            "cashCurrency",
          ]
        ),
        symbol.endsWith(
          ".AX"
        )
          ? "AUD"
          : "USD"
      ),

    note:
      stringValue(
        firstDefined(
          value,
          [
            "note",
            "notes",
            "description",
            "memo",
          ]
        )
      ) ||
      null,
  };
}

function adaptDividendRecord(
  value: unknown,
  index: number
): DividendTransaction | null {
  if (
    !isRecord(
      value
    )
  ) {
    return null;
  }

  const symbol =
    normaliseSymbol(
      firstDefined(
        value,
        [
          "symbol",
          "ticker",
          "assetTicker",
          "code",
        ]
      ),
      firstDefined(
        value,
        [
          "exchange",
          "market",
        ]
      )
    );

  const date =
    normaliseDate(
      firstDefined(
        value,
        [
          "date",
          "paymentDate",
          "receivedAt",
        ]
      )
    );

  if (
    !symbol ||
    !date
  ) {
    return null;
  }

  const amount =
    nullableNumber(
      firstDefined(
        value,
        [
          "amountAud",
          "amount",
          "cashAmount",
          "totalAud",
          "total",
        ]
      )
    );

  return {
    id:
      stringValue(
        firstDefined(
          value,
          [
            "id",
            "recordId",
          ]
        ),
        `dividend-record-${index}-${symbol}-${date}`
      ),

    symbol,

    type:
      "Cash Dividend",

    date,

    quantity:
      nullableNumber(
        firstDefined(
          value,
          [
            "quantity",
            "shares",
            "units",
          ]
        )
      ),

    amount:
      amount ===
        null
        ? null
        : Math.abs(
            amount
          ),

    dividendPerShare:
      transactionDividendPerShare(
        value,
        "Cash Dividend"
      ),

    currency:
      normaliseCurrency(
        firstDefined(
          value,
          [
            "currency",
            "transactionCurrency",
          ]
        ),
        "AUD"
      ),

    note:
      stringValue(
        firstDefined(
          value,
          [
            "note",
            "notes",
            "description",
          ]
        )
      ) ||
      "Received dividend imported from portfolio dividend records.",
  };
}

function holdingKey(
  holding: DividendHolding
): string {
  return [
    holding.id ||
      "",
    holding.symbol,
    holding.account ||
      "",
    holding.broker ||
      "",
  ].join(
    "|"
  );
}

function transactionKey(
  transaction: DividendTransaction
): string {
  return [
    transaction.id ||
      "",
    transaction.symbol,
    transaction.type ||
      "",
    transaction.date,
    transaction.amount ??
      "",
    transaction.dividendPerShare ??
      "",
  ].join(
    "|"
  );
}

function deduplicateHoldings(
  holdings: DividendHolding[]
): DividendHolding[] {
  const map =
    new Map<
      string,
      DividendHolding
    >();

  for (
    const holding of
    holdings
  ) {
    const key =
      holdingKey(
        holding
      );

    const existing =
      map.get(
        key
      );

    if (
      !existing ||
      holding.quantity >
        existing.quantity
    ) {
      map.set(
        key,
        holding
      );
    }
  }

  return Array.from(
    map.values()
  );
}

function deduplicateTransactions(
  transactions: DividendTransaction[]
): DividendTransaction[] {
  const map =
    new Map<
      string,
      DividendTransaction
    >();

  for (
    const transaction of
    transactions
  ) {
    const key =
      transactionKey(
        transaction
      );

    if (
      !map.has(
        key
      )
    ) {
      map.set(
        key,
        transaction
      );
    }
  }

  return Array.from(
    map.values()
  )
    .sort(
      (
        first,
        second
      ) =>
        first.date.localeCompare(
          second.date
        )
    );
}

function resolvePortfolioData(
  sources: unknown[],
  transactionSources: unknown[]
): AdaptedPortfolioData {
  const rawHoldings =
    collectArrays(
      sources,
      [
        "holdings",
        "positions",
        "portfolioHoldings",
        "openHoldings",
        "enhancedHoldings",
      ],
      [
        [
          "portfolio",
          "holdings",
        ],
        [
          "portfolio",
          "positions",
        ],
        [
          "replay",
          "holdings",
        ],
      ]
    );

  const rawTransactions =
    collectArrays(
      transactionSources,
      [
        "transactions",
        "ledger",
        "recentTransactions",
        "portfolioTransactions",
      ],
      [
        [
          "portfolio",
          "transactions",
        ],
        [
          "engine",
          "transactions",
        ],
      ]
    );

  const rawDividendRecords =
    collectArrays(
      transactionSources,
      [
        "dividendRecords",
        "receivedDividends",
      ],
      [
        [
          "dividends",
          "records",
        ],
        [
          "portfolio",
          "dividends",
        ],
        [
          "incomeMetrics",
          "records",
        ],
      ]
    );

  const adaptedHoldings =
    rawHoldings
      .map(
        adaptHolding
      )
      .filter(
        (
          holding
        ): holding is DividendHolding =>
          Boolean(
            holding
          )
      );

  const adaptedTransactions =
    rawTransactions
      .map(
        adaptTransaction
      )
      .filter(
        (
          transaction
        ): transaction is DividendTransaction =>
          Boolean(
            transaction
          )
      );

  const adaptedDividendRecords =
    rawDividendRecords
      .map(
        adaptDividendRecord
      )
      .filter(
        (
          transaction
        ): transaction is DividendTransaction =>
          Boolean(
            transaction
          )
      );

  return {
    holdings:
      deduplicateHoldings(
        adaptedHoldings
      ),

    transactions:
      deduplicateTransactions([
        ...adaptedTransactions,
        ...adaptedDividendRecords,
      ]),
  };
}

export function DividendCentreRouteBridge({
  holdings,
  transactions,
  portfolio,
  dashboard,
  snapshot,
  data,
  baseCurrency =
    "AUD",
}: Props) {
  const sources =
    useMemo(
      () => [
        holdings,
        portfolio,
        dashboard,
        snapshot,
        data,
      ],
      [
        holdings,
        portfolio,
        dashboard,
        snapshot,
        data,
      ]
    );

  const transactionSources =
    useMemo(
      () => [
        transactions,
        portfolio,
        dashboard,
        snapshot,
        data,
      ],
      [
        transactions,
        portfolio,
        dashboard,
        snapshot,
        data,
      ]
    );

  const resolved =
    useMemo(
      () =>
        resolvePortfolioData(
          sources,
          transactionSources
        ),
      [
        sources,
        transactionSources,
      ]
    );

  return (
    <DividendCentreConnected
      holdings={
        resolved.holdings
      }
      transactions={
        resolved.transactions
      }
      baseCurrency={
        baseCurrency
      }
    />
  );
}
