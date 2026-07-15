import type {
  MarketDataExchange,
  MarketDataProviderId,
  NormalisedMarketQuote,
  QuoteFreshness,
} from "../marketDataTypes";

export type LiveDividendHolding = {
  symbol: string;
  name: string;

  quantity: number;

  averageCostPerShare: number | null;
  costBasis: number | null;

  annualDividendPerShare: number | null;
  trailingDividendPerShare: number | null;

  declaredDividendPerShare: number | null;

  dividendFrequency: number | null;

  nextExDividendDate: string | null;
  nextRecordDate: string | null;
  nextPaymentDate: string | null;

  sector: string;
  industry: string;

  currency: string;
  exchange: MarketDataExchange;

  original: unknown;
};

export type LiveDividendEvent = {
  id: string;

  symbol: string;
  name: string;

  eventType:
    | "EX_DIVIDEND"
    | "RECORD_DATE"
    | "PAYMENT"
    | "ANNOUNCEMENT"
    | "FORECAST"
    | "UNKNOWN";

  status:
    | "ANNOUNCED"
    | "EXPECTED"
    | "FORECAST"
    | "PAID"
    | "UNKNOWN";

  exDividendDate: string | null;
  recordDate: string | null;
  paymentDate: string | null;

  dividendPerShare: number | null;

  quantity: number | null;

  grossPayment: number | null;

  currency: string;

  source: string | null;

  confidenceScore: number | null;

  original: unknown;
};

export type LiveDividendHoldingValuation = {
  symbol: string;
  name: string;

  quantity: number;

  livePrice: number | null;
  liveMarketValue: number | null;

  averageCostPerShare: number | null;
  costBasis: number | null;

  annualDividendPerShare: number | null;
  trailingDividendPerShare: number | null;

  annualIncome: number | null;
  trailingAnnualIncome: number | null;

  forwardYield: number | null;
  trailingYield: number | null;
  yieldOnCost: number | null;

  nextDividendPerShare: number | null;
  nextPaymentValue: number | null;

  nextExDividendDate: string | null;
  nextRecordDate: string | null;
  nextPaymentDate: string | null;

  incomeWeight: number;
  portfolioWeight: number;

  sector: string;
  industry: string;

  currency: string;
  exchange: MarketDataExchange;

  provider: MarketDataProviderId | null;
  freshness: QuoteFreshness | null;

  quoteQualityScore: number | null;
  quoteConfidenceScore: number | null;

  quoteTimestamp: string | null;

  delayed: boolean;
  stale: boolean;
  expired: boolean;
  usable: boolean;

  quote: NormalisedMarketQuote | null;

  original: unknown;
};

export type LiveDividendEventValuation = LiveDividendEvent & {
  resolvedQuantity: number;

  calculatedGrossPayment: number | null;

  priceAtValuation: number | null;

  paymentYieldOnCurrentPrice: number | null;

  provider: MarketDataProviderId | null;
  freshness: QuoteFreshness | null;

  quoteQualityScore: number | null;

  pricingAvailable: boolean;
};

export type LiveDividendMonthlyBucket = {
  month: string;
  label: string;

  announcedIncome: number;
  expectedIncome: number;
  forecastIncome: number;
  paidIncome: number;

  totalIncome: number;

  paymentCount: number;
  symbolCount: number;

  symbols: string[];
};

export type LiveDividendSectorBucket = {
  sector: string;

  annualIncome: number;
  marketValue: number;

  incomeWeight: number;
  marketValueWeight: number;

  holdingCount: number;
};

export type LiveDividendValuationSummary = {
  generatedAt: string;

  holdings: LiveDividendHoldingValuation[];
  events: LiveDividendEventValuation[];

  totals: {
    holdingCount: number;
    dividendHoldingCount: number;
    pricedHoldingCount: number;
    unpricedHoldingCount: number;

    pricingCoveragePercent: number;
    dividendRateCoveragePercent: number;

    liveMarketValue: number;
    costBasis: number;

    forwardAnnualIncome: number;
    trailingAnnualIncome: number;

    monthlyRunRate: number;
    quarterlyRunRate: number;

    forwardPortfolioYield: number | null;
    trailingPortfolioYield: number | null;
    portfolioYieldOnCost: number | null;

    nextThirtyDayIncome: number;
    nextNinetyDayIncome: number;
    nextTwelveMonthEventIncome: number;

    announcedIncome: number;
    expectedIncome: number;
    forecastIncome: number;
    paidIncome: number;

    delayedHoldingCount: number;
    staleHoldingCount: number;
    expiredHoldingCount: number;

    averageQuoteQualityScore: number;
    averageQuoteConfidenceScore: number;

    largestIncomeWeight: number;
    topFiveIncomeWeight: number;
  };

  nextPayment: LiveDividendEventValuation | null;

  monthlyIncome: LiveDividendMonthlyBucket[];
  sectorIncome: LiveDividendSectorBucket[];

  providerDistribution: Array<{
    provider: string;
    holdingCount: number;
    annualIncome: number;
    incomeWeight: number;
  }>;

  warnings: string[];
};

type UnknownRecord = Record<string, unknown>;

function record(
  value: unknown
): UnknownRecord {
  return (
    value &&
    typeof value === "object"
      ? value
      : {}
  ) as UnknownRecord;
}

function text(
  source: UnknownRecord,
  keys: string[]
): string {
  for (const key of keys) {
    const value = source[key];

    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return "";
}

function numeric(
  source: UnknownRecord,
  keys: string[]
): number | null {
  for (const key of keys) {
    const raw = source[key];

    if (
      raw === null ||
      raw === undefined ||
      raw === ""
    ) {
      continue;
    }

    const parsed = Number(raw);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function dateText(
  source: UnknownRecord,
  keys: string[]
): string | null {
  const value = text(
    source,
    keys
  );

  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toISOString();
}

function normaliseSymbol(
  value: string
): string {
  return value
    .trim()
    .toUpperCase();
}

function safePercent(
  numerator: number,
  denominator: number
): number | null {
  if (
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator) ||
    denominator === 0
  ) {
    return null;
  }

  return (
    numerator /
    denominator
  ) * 100;
}

function average(
  values: number[]
): number {
  if (values.length === 0) {
    return 0;
  }

  return (
    values.reduce(
      (
        total,
        value
      ) =>
        total +
        value,
      0
    ) /
    values.length
  );
}

function inferExchange(
  symbol: string,
  source: UnknownRecord
): MarketDataExchange {
  const explicit = text(
    source,
    [
      "exchange",
      "market",
      "listingExchange",
    ]
  ).toUpperCase();

  const supported: MarketDataExchange[] = [
    "ASX",
    "NASDAQ",
    "NYSE",
    "NYSE_ARCA",
    "AMEX",
    "TSX",
    "LSE",
    "NZX",
    "HKEX",
    "TSE",
    "CRYPTO",
    "FOREX",
    "OTC",
    "UNKNOWN",
  ];

  if (
    supported.includes(
      explicit as MarketDataExchange
    )
  ) {
    return explicit as MarketDataExchange;
  }

  if (symbol.endsWith(".AX")) {
    return "ASX";
  }

  if (symbol.endsWith(".L")) {
    return "LSE";
  }

  if (symbol.endsWith(".TO")) {
    return "TSX";
  }

  if (symbol.endsWith(".NZ")) {
    return "NZX";
  }

  if (symbol.endsWith(".HK")) {
    return "HKEX";
  }

  return "UNKNOWN";
}

function inferCurrency(
  exchange: MarketDataExchange,
  source: UnknownRecord
): string {
  const explicit = text(
    source,
    [
      "currency",
      "paymentCurrency",
      "tradingCurrency",
      "localCurrency",
    ]
  ).toUpperCase();

  if (explicit) {
    return explicit;
  }

  const currencies: Partial<
    Record<MarketDataExchange, string>
  > = {
    ASX: "AUD",
    NASDAQ: "USD",
    NYSE: "USD",
    NYSE_ARCA: "USD",
    AMEX: "USD",
    TSX: "CAD",
    LSE: "GBP",
    NZX: "NZD",
    HKEX: "HKD",
    TSE: "JPY",
    OTC: "USD",
  };

  return (
    currencies[exchange] ||
    "AUD"
  );
}

function normaliseStatus(
  value: string
): LiveDividendEvent["status"] {
  const status = value
    .trim()
    .toUpperCase()
    .replaceAll(" ", "_");

  if (
    status.includes("PAID")
  ) {
    return "PAID";
  }

  if (
    status.includes("ANNOUN")
  ) {
    return "ANNOUNCED";
  }

  if (
    status.includes("EXPECT")
  ) {
    return "EXPECTED";
  }

  if (
    status.includes("FORECAST") ||
    status.includes("PROJECT")
  ) {
    return "FORECAST";
  }

  return "UNKNOWN";
}

function normaliseEventType(
  value: string
): LiveDividendEvent["eventType"] {
  const type = value
    .trim()
    .toUpperCase()
    .replaceAll(" ", "_")
    .replaceAll("-", "_");

  if (
    type.includes("EX_DATE") ||
    type.includes("EX_DIVIDEND")
  ) {
    return "EX_DIVIDEND";
  }

  if (
    type.includes("RECORD")
  ) {
    return "RECORD_DATE";
  }

  if (
    type.includes("PAYMENT") ||
    type.includes("PAY_DATE")
  ) {
    return "PAYMENT";
  }

  if (
    type.includes("ANNOUNC")
  ) {
    return "ANNOUNCEMENT";
  }

  if (
    type.includes("FORECAST") ||
    type.includes("EXPECTED")
  ) {
    return "FORECAST";
  }

  return "UNKNOWN";
}

export function normaliseLiveDividendHolding(
  value: unknown
): LiveDividendHolding | null {
  const source = record(value);

  const symbol = normaliseSymbol(
    text(
      source,
      [
        "symbol",
        "ticker",
        "code",
        "asset",
        "instrument",
      ]
    )
  );

  if (!symbol) {
    return null;
  }

  const exchange = inferExchange(
    symbol,
    source
  );

  const quantity =
    numeric(
      source,
      [
        "quantity",
        "units",
        "shares",
        "openQuantity",
        "remainingQuantity",
      ]
    ) ||
    0;

  const costBasis = numeric(
    source,
    [
      "costBaseAud",
      "costBasis",
      "costBasisAud",
      "totalCost",
      "investedAmount",
      "bookValue",
    ]
  );

  const averageCostPerShare =
    numeric(
      source,
      [
        "averageCost",
        "averagePrice",
        "averageCostPerShare",
        "costPerShare",
      ]
    ) ||
    (
      costBasis !== null &&
      quantity !== 0
        ? costBasis /
          quantity
        : null
    );

  return {
    symbol,

    name:
      text(
        source,
        [
          "name",
          "companyName",
          "securityName",
          "description",
        ]
      ) ||
      symbol,

    quantity,

    averageCostPerShare,
    costBasis,

    annualDividendPerShare:
      numeric(
        source,
        [
          "annualDividendPerShare",
          "forwardAnnualDividend",
          "forwardDividendPerShare",
          "annualDividend",
          "dividendAnnualised",
          "annualizedDividend",
        ]
      ),

    trailingDividendPerShare:
      numeric(
        source,
        [
          "trailingDividendPerShare",
          "trailingAnnualDividend",
          "ttmDividendPerShare",
          "dividendPerShareTtm",
        ]
      ),

    declaredDividendPerShare:
      numeric(
        source,
        [
          "declaredDividendPerShare",
          "nextDividendPerShare",
          "lastDividendPerShare",
          "dividendAmount",
        ]
      ),

    dividendFrequency:
      numeric(
        source,
        [
          "dividendFrequency",
          "paymentsPerYear",
          "frequencyPerYear",
        ]
      ),

    nextExDividendDate:
      dateText(
        source,
        [
          "nextExDividendDate",
          "exDividendDate",
          "exDate",
        ]
      ),

    nextRecordDate:
      dateText(
        source,
        [
          "nextRecordDate",
          "recordDate",
        ]
      ),

    nextPaymentDate:
      dateText(
        source,
        [
          "nextPaymentDate",
          "paymentDate",
          "payDate",
        ]
      ),

    sector:
      text(
        source,
        [
          "sector",
          "gicsSector",
          "assetClass",
        ]
      ) ||
      "Unclassified",

    industry:
      text(
        source,
        [
          "industry",
          "gicsIndustry",
          "subIndustry",
        ]
      ) ||
      "Unclassified",

    currency:
      inferCurrency(
        exchange,
        source
      ),

    exchange,

    original:
      value,
  };
}

export function normaliseLiveDividendEvent(
  value: unknown,
  index = 0
): LiveDividendEvent | null {
  const source = record(value);

  const symbol = normaliseSymbol(
    text(
      source,
      [
        "symbol",
        "ticker",
        "code",
        "asset",
      ]
    )
  );

  if (!symbol) {
    return null;
  }

  const exchange = inferExchange(
    symbol,
    source
  );

  const paymentDate = dateText(
    source,
    [
      "paymentDate",
      "payDate",
      "date",
      "expectedPaymentDate",
      "forecastPaymentDate",
    ]
  );

  const statusValue = text(
    source,
    [
      "status",
      "dividendStatus",
      "eventStatus",
      "confidenceType",
    ]
  );

  const typeValue = text(
    source,
    [
      "eventType",
      "type",
      "dateType",
      "calendarType",
    ]
  );

  return {
    id:
      text(
        source,
        [
          "id",
          "eventId",
          "dividendId",
        ]
      ) ||
      [
        symbol,
        paymentDate ||
          "undated",
        index,
      ].join("-"),

    symbol,

    name:
      text(
        source,
        [
          "name",
          "companyName",
          "securityName",
        ]
      ) ||
      symbol,

    eventType:
      normaliseEventType(
        typeValue
      ),

    status:
      normaliseStatus(
        statusValue
      ),

    exDividendDate:
      dateText(
        source,
        [
          "exDividendDate",
          "exDate",
        ]
      ),

    recordDate:
      dateText(
        source,
        [
          "recordDate",
        ]
      ),

    paymentDate,

    dividendPerShare:
      numeric(
        source,
        [
          "dividendPerShare",
          "amountPerShare",
          "dividendAmount",
          "amount",
          "cashAmount",
        ]
      ),

    quantity:
      numeric(
        source,
        [
          "quantity",
          "units",
          "shares",
          "eligibleQuantity",
        ]
      ),

    grossPayment:
      numeric(
        source,
        [
          "grossPayment",
          "grossAmount",
          "expectedCashflow",
          "paymentValue",
          "totalAmount",
          "income",
        ]
      ),

    currency:
      inferCurrency(
        exchange,
        source
      ),

    source:
      text(
        source,
        [
          "source",
          "provider",
          "dataProvider",
        ]
      ) ||
      null,

    confidenceScore:
      numeric(
        source,
        [
          "confidenceScore",
          "forecastConfidence",
          "confidence",
        ]
      ),

    original:
      value,
  };
}

function monthKey(
  dateValue: string | null
): string | null {
  if (!dateValue) {
    return null;
  }

  const date = new Date(dateValue);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return [
    date.getUTCFullYear(),
    String(
      date.getUTCMonth() +
      1
    ).padStart(
      2,
      "0"
    ),
  ].join("-");
}

function monthLabel(
  key: string
): string {
  const date = new Date(
    `${key}-01T00:00:00.000Z`
  );

  return new Intl.DateTimeFormat(
    "en-AU",
    {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }
  ).format(date);
}

export function calculateLiveDividendValuation({
  holdings,
  events,
  quoteBySymbol,
  now = new Date(),
}: {
  holdings: LiveDividendHolding[];

  events: LiveDividendEvent[];

  quoteBySymbol: Record<
    string,
    NormalisedMarketQuote | null
  >;

  now?: Date;
}): LiveDividendValuationSummary {
  const holdingsBySymbol =
    new Map(
      holdings.map(
        (
          holding
        ) => [
          holding.symbol,
          holding,
        ]
      )
    );

  const initialHoldings =
    holdings.map(
      (
        holding
      ): LiveDividendHoldingValuation => {
        const quote =
          quoteBySymbol[
            holding.symbol
          ] ||
          null;

        const livePrice =
          quote?.price ??
          null;

        const liveMarketValue =
          livePrice !== null
            ? livePrice *
              holding.quantity
            : null;

        const annualDividendPerShare =
          holding.annualDividendPerShare ??
          (
            holding.declaredDividendPerShare !==
              null &&
            holding.dividendFrequency !==
              null
              ? holding.declaredDividendPerShare *
                holding.dividendFrequency
              : null
          );

        const trailingDividendPerShare =
          holding.trailingDividendPerShare ??
          annualDividendPerShare;

        const annualIncome =
          annualDividendPerShare !==
          null
            ? annualDividendPerShare *
              holding.quantity
            : null;

        const trailingAnnualIncome =
          trailingDividendPerShare !==
          null
            ? trailingDividendPerShare *
              holding.quantity
            : null;

        const nextDividendPerShare =
          holding.declaredDividendPerShare ??
          (
            annualDividendPerShare !==
              null &&
            holding.dividendFrequency &&
            holding.dividendFrequency >
              0
              ? annualDividendPerShare /
                holding.dividendFrequency
              : null
          );

        const nextPaymentValue =
          nextDividendPerShare !==
          null
            ? nextDividendPerShare *
              holding.quantity
            : null;

        return {
          symbol:
            holding.symbol,

          name:
            holding.name,

          quantity:
            holding.quantity,

          livePrice,
          liveMarketValue,

          averageCostPerShare:
            holding.averageCostPerShare,

          costBasis:
            holding.costBasis,

          annualDividendPerShare,
          trailingDividendPerShare,

          annualIncome,
          trailingAnnualIncome,

          forwardYield:
            livePrice !==
              null &&
            annualDividendPerShare !==
              null
              ? safePercent(
                  annualDividendPerShare,
                  livePrice
                )
              : null,

          trailingYield:
            livePrice !==
              null &&
            trailingDividendPerShare !==
              null
              ? safePercent(
                  trailingDividendPerShare,
                  livePrice
                )
              : null,

          yieldOnCost:
            holding.costBasis !==
              null &&
            annualIncome !==
              null
              ? safePercent(
                  annualIncome,
                  holding.costBasis
                )
              : holding.averageCostPerShare !==
                  null &&
                annualDividendPerShare !==
                  null
                ? safePercent(
                    annualDividendPerShare,
                    holding.averageCostPerShare
                  )
                : null,

          nextDividendPerShare,
          nextPaymentValue,

          nextExDividendDate:
            holding.nextExDividendDate,

          nextRecordDate:
            holding.nextRecordDate,

          nextPaymentDate:
            holding.nextPaymentDate,

          incomeWeight: 0,
          portfolioWeight: 0,

          sector:
            holding.sector,

          industry:
            holding.industry,

          currency:
            holding.currency,

          exchange:
            holding.exchange,

          provider:
            quote?.provider ||
            null,

          freshness:
            quote?.freshness ||
            null,

          quoteQualityScore:
            quote?.qualityScore ??
            null,

          quoteConfidenceScore:
            quote?.confidenceScore ??
            null,

          quoteTimestamp:
            quote?.quoteTimestamp ||
            null,

          delayed:
            quote?.isDelayed ||
            false,

          stale:
            quote?.isStale ||
            false,

          expired:
            quote?.isExpired ||
            false,

          usable:
            quote?.isUsable ||
            false,

          quote,

          original:
            holding.original,
        };
      }
    );

  const forwardAnnualIncome =
    initialHoldings.reduce(
      (
        total,
        holding
      ) =>
        total +
        (
          holding.annualIncome ||
          0
        ),
      0
    );

  const liveMarketValue =
    initialHoldings.reduce(
      (
        total,
        holding
      ) =>
        total +
        (
          holding.liveMarketValue ||
          0
        ),
      0
    );

  const costBasis =
    initialHoldings.reduce(
      (
        total,
        holding
      ) =>
        total +
        (
          holding.costBasis ||
          0
        ),
      0
    );

  const valuedHoldings =
    initialHoldings.map(
      (
        holding
      ) => ({
        ...holding,

        incomeWeight:
          forwardAnnualIncome > 0 &&
          holding.annualIncome !==
            null
            ? (
                holding.annualIncome /
                forwardAnnualIncome
              ) *
              100
            : 0,

        portfolioWeight:
          liveMarketValue > 0 &&
          holding.liveMarketValue !==
            null
            ? (
                holding.liveMarketValue /
                liveMarketValue
              ) *
              100
            : 0,
      })
    );

  const valuedEvents =
    events.map(
      (
        event
      ): LiveDividendEventValuation => {
        const holding =
          holdingsBySymbol.get(
            event.symbol
          );

        const quote =
          quoteBySymbol[
            event.symbol
          ] ||
          null;

        const resolvedQuantity =
          event.quantity ??
          holding?.quantity ??
          0;

        const calculatedGrossPayment =
          event.grossPayment ??
          (
            event.dividendPerShare !==
              null
              ? event.dividendPerShare *
                resolvedQuantity
              : null
          );

        return {
          ...event,

          resolvedQuantity,

          calculatedGrossPayment,

          priceAtValuation:
            quote?.price ??
            null,

          paymentYieldOnCurrentPrice:
            quote?.price &&
            event.dividendPerShare !==
              null
              ? safePercent(
                  event.dividendPerShare,
                  quote.price
                )
              : null,

          provider:
            quote?.provider ||
            null,

          freshness:
            quote?.freshness ||
            null,

          quoteQualityScore:
            quote?.qualityScore ??
            null,

          pricingAvailable:
            Boolean(
              quote
            ),
        };
      }
    );

  const futureEvents =
    valuedEvents
      .filter(
        (
          event
        ) =>
          event.paymentDate &&
          new Date(
            event.paymentDate
          ).getTime() >=
            now.getTime()
      )
      .sort(
        (
          left,
          right
        ) =>
          new Date(
            left.paymentDate ||
            0
          ).getTime() -
          new Date(
            right.paymentDate ||
            0
          ).getTime()
      );

  const dayMs =
    86_400_000;

  const incomeWithinDays =
    (
      days: number
    ) =>
      futureEvents
        .filter(
          (
            event
          ) => {
            if (!event.paymentDate) {
              return false;
            }

            const timestamp =
              new Date(
                event.paymentDate
              ).getTime();

            return (
              timestamp <=
              now.getTime() +
                days *
                dayMs
            );
          }
        )
        .reduce(
          (
            total,
            event
          ) =>
            total +
            (
              event.calculatedGrossPayment ||
              0
            ),
          0
        );

  const statusIncome =
    (
      status:
        LiveDividendEvent["status"]
    ) =>
      valuedEvents
        .filter(
          (
            event
          ) =>
            event.status ===
            status
        )
        .reduce(
          (
            total,
            event
          ) =>
            total +
            (
              event.calculatedGrossPayment ||
              0
            ),
          0
        );

  const monthlyMap =
    new Map<
      string,
      LiveDividendMonthlyBucket
    >();

  for (const event of valuedEvents) {
    const key = monthKey(
      event.paymentDate
    );

    if (!key) {
      continue;
    }

    const current =
      monthlyMap.get(
        key
      ) || {
        month: key,
        label:
          monthLabel(
            key
          ),

        announcedIncome: 0,
        expectedIncome: 0,
        forecastIncome: 0,
        paidIncome: 0,

        totalIncome: 0,

        paymentCount: 0,
        symbolCount: 0,

        symbols: [],
      };

    const amount =
      event.calculatedGrossPayment ||
      0;

    if (
      event.status ===
      "ANNOUNCED"
    ) {
      current.announcedIncome +=
        amount;
    } else if (
      event.status ===
      "EXPECTED"
    ) {
      current.expectedIncome +=
        amount;
    } else if (
      event.status ===
      "FORECAST"
    ) {
      current.forecastIncome +=
        amount;
    } else if (
      event.status ===
      "PAID"
    ) {
      current.paidIncome +=
        amount;
    } else {
      current.forecastIncome +=
        amount;
    }

    current.totalIncome +=
      amount;

    current.paymentCount +=
      1;

    if (
      !current.symbols.includes(
        event.symbol
      )
    ) {
      current.symbols.push(
        event.symbol
      );
    }

    current.symbolCount =
      current.symbols.length;

    monthlyMap.set(
      key,
      current
    );
  }

  const sectorMap =
    new Map<
      string,
      LiveDividendSectorBucket
    >();

  for (const holding of valuedHoldings) {
    const sector =
      holding.sector ||
      "Unclassified";

    const current =
      sectorMap.get(
        sector
      ) || {
        sector,

        annualIncome: 0,
        marketValue: 0,

        incomeWeight: 0,
        marketValueWeight: 0,

        holdingCount: 0,
      };

    current.annualIncome +=
      holding.annualIncome ||
      0;

    current.marketValue +=
      holding.liveMarketValue ||
      0;

    current.holdingCount +=
      1;

    sectorMap.set(
      sector,
      current
    );
  }

  const sectorIncome =
    Array.from(
      sectorMap.values()
    )
      .map(
        (
          sector
        ) => ({
          ...sector,

          incomeWeight:
            forwardAnnualIncome > 0
              ? (
                  sector.annualIncome /
                  forwardAnnualIncome
                ) *
                100
              : 0,

          marketValueWeight:
            liveMarketValue > 0
              ? (
                  sector.marketValue /
                  liveMarketValue
                ) *
                100
              : 0,
        })
      )
      .sort(
        (
          left,
          right
        ) =>
          right.annualIncome -
          left.annualIncome
      );

  const providerMap =
    new Map<
      string,
      {
        provider: string;
        holdingCount: number;
        annualIncome: number;
        incomeWeight: number;
      }
    >();

  for (const holding of valuedHoldings) {
    const provider =
      holding.provider ||
      "UNPRICED";

    const current =
      providerMap.get(
        provider
      ) || {
        provider,
        holdingCount: 0,
        annualIncome: 0,
        incomeWeight: 0,
      };

    current.holdingCount +=
      1;

    current.annualIncome +=
      holding.annualIncome ||
      0;

    providerMap.set(
      provider,
      current
    );
  }

  const providerDistribution =
    Array.from(
      providerMap.values()
    )
      .map(
        (
          provider
        ) => ({
          ...provider,

          incomeWeight:
            forwardAnnualIncome > 0
              ? (
                  provider.annualIncome /
                  forwardAnnualIncome
                ) *
                100
              : 0,
        })
      )
      .sort(
        (
          left,
          right
        ) =>
          right.annualIncome -
          left.annualIncome
      );

  const pricedHoldings =
    valuedHoldings.filter(
      (
        holding
      ) =>
        holding.livePrice !==
        null
    );

  const dividendHoldings =
    valuedHoldings.filter(
      (
        holding
      ) =>
        holding.annualIncome !==
        null
    );

  const sortedIncomeWeights =
    [...valuedHoldings].sort(
      (
        left,
        right
      ) =>
        right.incomeWeight -
        left.incomeWeight
    );

  const topFiveIncomeWeight =
    sortedIncomeWeights
      .slice(
        0,
        5
      )
      .reduce(
        (
          total,
          holding
        ) =>
          total +
          holding.incomeWeight,
        0
      );

  const delayedHoldingCount =
    valuedHoldings.filter(
      (
        holding
      ) =>
        holding.delayed
    ).length;

  const staleHoldingCount =
    valuedHoldings.filter(
      (
        holding
      ) =>
        holding.stale
    ).length;

  const expiredHoldingCount =
    valuedHoldings.filter(
      (
        holding
      ) =>
        holding.expired
    ).length;

  const warnings: string[] = [];

  const missingPriceCount =
    valuedHoldings.length -
    pricedHoldings.length;

  const missingDividendRateCount =
    valuedHoldings.length -
    dividendHoldings.length;

  if (missingPriceCount > 0) {
    warnings.push(
      `${missingPriceCount} dividend holding${
        missingPriceCount === 1
          ? ""
          : "s"
      } could not be live-priced.`
    );
  }

  if (missingDividendRateCount > 0) {
    warnings.push(
      `${missingDividendRateCount} holding${
        missingDividendRateCount === 1
          ? ""
          : "s"
      } do not have a usable annual dividend rate.`
    );
  }

  if (delayedHoldingCount > 0) {
    warnings.push(
      `${delayedHoldingCount} dividend holding${
        delayedHoldingCount === 1
          ? ""
          : "s"
      } use delayed pricing.`
    );
  }

  if (staleHoldingCount > 0) {
    warnings.push(
      `${staleHoldingCount} dividend holding${
        staleHoldingCount === 1
          ? ""
          : "s"
      } use stale pricing.`
    );
  }

  if (expiredHoldingCount > 0) {
    warnings.push(
      `${expiredHoldingCount} dividend holding${
        expiredHoldingCount === 1
          ? ""
          : "s"
      } have expired pricing.`
    );
  }

  if (
    sortedIncomeWeights[0] &&
    sortedIncomeWeights[0].incomeWeight >
      30
  ) {
    warnings.push(
      `${sortedIncomeWeights[0].symbol} contributes ${sortedIncomeWeights[0].incomeWeight.toFixed(
        1
      )}% of projected annual dividend income.`
    );
  }

  if (topFiveIncomeWeight > 80) {
    warnings.push(
      `The five largest income contributors represent ${topFiveIncomeWeight.toFixed(
        1
      )}% of projected annual dividend income.`
    );
  }

  const trailingAnnualIncome =
    valuedHoldings.reduce(
      (
        total,
        holding
      ) =>
        total +
        (
          holding.trailingAnnualIncome ||
          0
        ),
      0
    );

  return {
    generatedAt:
      new Date()
        .toISOString(),

    holdings:
      valuedHoldings,

    events:
      valuedEvents,

    totals: {
      holdingCount:
        valuedHoldings.length,

      dividendHoldingCount:
        dividendHoldings.length,

      pricedHoldingCount:
        pricedHoldings.length,

      unpricedHoldingCount:
        missingPriceCount,

      pricingCoveragePercent:
        valuedHoldings.length > 0
          ? (
              pricedHoldings.length /
              valuedHoldings.length
            ) *
            100
          : 100,

      dividendRateCoveragePercent:
        valuedHoldings.length > 0
          ? (
              dividendHoldings.length /
              valuedHoldings.length
            ) *
            100
          : 100,

      liveMarketValue,
      costBasis,

      forwardAnnualIncome,
      trailingAnnualIncome,

      monthlyRunRate:
        forwardAnnualIncome /
        12,

      quarterlyRunRate:
        forwardAnnualIncome /
        4,

      forwardPortfolioYield:
        safePercent(
          forwardAnnualIncome,
          liveMarketValue
        ),

      trailingPortfolioYield:
        safePercent(
          trailingAnnualIncome,
          liveMarketValue
        ),

      portfolioYieldOnCost:
        safePercent(
          forwardAnnualIncome,
          costBasis
        ),

      nextThirtyDayIncome:
        incomeWithinDays(
          30
        ),

      nextNinetyDayIncome:
        incomeWithinDays(
          90
        ),

      nextTwelveMonthEventIncome:
        incomeWithinDays(
          365
        ),

      announcedIncome:
        statusIncome(
          "ANNOUNCED"
        ),

      expectedIncome:
        statusIncome(
          "EXPECTED"
        ),

      forecastIncome:
        statusIncome(
          "FORECAST"
        ),

      paidIncome:
        statusIncome(
          "PAID"
        ),

      delayedHoldingCount,
      staleHoldingCount,
      expiredHoldingCount,

      averageQuoteQualityScore:
        average(
          pricedHoldings
            .map(
              (
                holding
              ) =>
                holding.quoteQualityScore
            )
            .filter(
              (
                value
              ): value is number =>
                value !==
                null
            )
        ),

      averageQuoteConfidenceScore:
        average(
          pricedHoldings
            .map(
              (
                holding
              ) =>
                holding.quoteConfidenceScore
            )
            .filter(
              (
                value
              ): value is number =>
                value !==
                null
            )
        ),

      largestIncomeWeight:
        sortedIncomeWeights[0]
          ?.incomeWeight ||
        0,

      topFiveIncomeWeight,
    },

    nextPayment:
      futureEvents[0] ||
      null,

    monthlyIncome:
      Array.from(
        monthlyMap.values()
      ).sort(
        (
          left,
          right
        ) =>
          left.month.localeCompare(
            right.month
          )
      ),

    sectorIncome,

    providerDistribution,

    warnings:
      Array.from(
        new Set(
          warnings
        )
      ),
  };
}
