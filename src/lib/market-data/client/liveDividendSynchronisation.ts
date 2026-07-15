import type {
  MarketDataExchange,
  MarketDataProviderId,
  NormalisedMarketQuote,
  QuoteFreshness,
} from "../marketDataTypes";

export type DividendFrequency =
  | "WEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "SEMI_ANNUAL"
  | "ANNUAL"
  | "IRREGULAR"
  | "UNKNOWN";

export type DividendEventStatus =
  | "ANNOUNCED"
  | "EXPECTED"
  | "FORECAST"
  | "PAID"
  | "CANCELLED"
  | "SUSPENDED"
  | "UNKNOWN";

export type LiveDividendSourceHolding = {
  symbol: string;
  name: string;

  quantity: number;

  costBasis: number | null;
  averageCost: number | null;

  sector: string;
  industry: string;
  country: string;

  currency: string;
  exchange: MarketDataExchange;

  annualDividendPerShare: number | null;
  trailingDividendPerShare: number | null;

  dividendFrequency: DividendFrequency;

  lastDividendAmount: number | null;
  previousDividendAmount: number | null;

  dividendGrowthRate: number | null;

  nextExDividendDate: string | null;
  nextRecordDate: string | null;
  nextPaymentDate: string | null;

  original: unknown;
};

export type LiveDividendSourceEvent = {
  id: string;

  symbol: string;
  name: string;

  status: DividendEventStatus;
  frequency: DividendFrequency;

  exDividendDate: string | null;
  recordDate: string | null;
  paymentDate: string | null;
  announcedDate: string | null;

  amountPerShare: number;
  quantity: number | null;

  grossAmount: number | null;
  netAmount: number | null;

  currency: string;

  confidenceScore: number | null;

  source: string;
  original: unknown;
};

export type LiveDividendHoldingResult = {
  symbol: string;
  name: string;

  quantity: number;

  livePrice: number | null;
  liveMarketValue: number | null;

  costBasis: number | null;
  averageCost: number | null;

  annualDividendPerShare: number;
  annualIncome: number;
  monthlyIncome: number;
  quarterlyIncome: number;

  currentYield: number | null;
  forwardYield: number | null;
  yieldOnCost: number | null;

  incomeContributionPercent: number;
  portfolioWeight: number;

  lastDividendAmount: number | null;
  previousDividendAmount: number | null;

  dividendGrowthRate: number | null;
  inferredGrowthRate: number | null;

  nextExDividendDate: string | null;
  nextRecordDate: string | null;
  nextPaymentDate: string | null;

  nextPaymentAmount: number | null;

  dividendFrequency: DividendFrequency;

  sector: string;
  industry: string;
  country: string;

  currency: string;
  exchange: MarketDataExchange;

  provider: MarketDataProviderId | null;
  freshness: QuoteFreshness | null;

  qualityScore: number | null;
  marketState: string | null;

  delayed: boolean;
  stale: boolean;
  expired: boolean;

  confidenceScore: number;
  riskScore: number;

  suspended: boolean;
  dividendCut: boolean;
  dividendIncrease: boolean;
  missingDividendData: boolean;

  warnings: string[];

  quote: NormalisedMarketQuote | null;
  original: unknown;
};

export type LiveDividendCalendarResult = {
  id: string;

  symbol: string;
  name: string;

  status: DividendEventStatus;
  frequency: DividendFrequency;

  exDividendDate: string | null;
  recordDate: string | null;
  paymentDate: string | null;
  announcedDate: string | null;

  amountPerShare: number;
  quantity: number;

  projectedGrossAmount: number;
  projectedNetAmount: number;

  currency: string;

  daysUntilExDividend: number | null;
  daysUntilPayment: number | null;

  monthKey: string | null;

  confidenceScore: number;

  source: string;
  original: unknown;
};

export type LiveDividendMonthlyBucket = {
  monthKey: string;
  label: string;

  paymentCount: number;
  symbolCount: number;

  announcedAmount: number;
  expectedAmount: number;
  forecastAmount: number;
  paidAmount: number;

  totalAmount: number;

  events: LiveDividendCalendarResult[];
};

export type LiveDividendSectorBucket = {
  sector: string;

  holdingCount: number;
  annualIncome: number;

  incomeWeight: number;
  marketValue: number;
  portfolioWeight: number;

  averageCurrentYield: number;
  averageYieldOnCost: number;
};

export type LiveDividendSynchronisationResult = {
  generatedAt: string;

  holdings: LiveDividendHoldingResult[];
  calendar: LiveDividendCalendarResult[];
  monthlyIncome: LiveDividendMonthlyBucket[];
  sectorIncome: LiveDividendSectorBucket[];

  totals: {
    holdingCount: number;
    dividendHoldingCount: number;
    missingDividendHoldingCount: number;

    liveMarketValue: number;
    costBasis: number;

    projectedAnnualIncome: number;
    projectedMonthlyIncome: number;
    projectedQuarterlyIncome: number;

    incomeNext7Days: number;
    incomeNext30Days: number;
    incomeNext90Days: number;
    incomeNext365Days: number;

    currentPortfolioYield: number | null;
    forwardPortfolioYield: number | null;
    portfolioYieldOnCost: number | null;

    averageDividendGrowthRate: number;
    weightedDividendGrowthRate: number;

    announcedEventCount: number;
    expectedEventCount: number;
    forecastEventCount: number;
    paidEventCount: number;

    suspendedHoldingCount: number;
    dividendCutCount: number;
    dividendIncreaseCount: number;

    stalePriceCount: number;
    delayedPriceCount: number;
    expiredPriceCount: number;

    averageForecastConfidence: number;
    dividendHealthScore: number;
  };

  nextDividend: LiveDividendCalendarResult | null;

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

function numberValue(
  source: UnknownRecord,
  keys: string[]
): number | null {
  for (const key of keys) {
    const raw = source[key];

    if (
      raw === undefined ||
      raw === null ||
      raw === ""
    ) {
      continue;
    }

    const value = Number(raw);

    if (Number.isFinite(value)) {
      return value;
    }
  }

  return null;
}

function booleanValue(
  source: UnknownRecord,
  keys: string[]
): boolean | null {
  for (const key of keys) {
    const raw = source[key];

    if (typeof raw === "boolean") {
      return raw;
    }

    if (typeof raw === "string") {
      const normalised =
        raw.trim().toLowerCase();

      if (
        [
          "true",
          "yes",
          "1",
          "active",
          "suspended",
        ].includes(normalised)
      ) {
        return true;
      }

      if (
        [
          "false",
          "no",
          "0",
          "inactive",
        ].includes(normalised)
      ) {
        return false;
      }
    }
  }

  return null;
}

function normaliseSymbol(
  value: string
): string {
  return value
    .trim()
    .toUpperCase();
}

function parseDate(
  value: unknown
): string | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const date =
    value instanceof Date
      ? value
      : new Date(
          String(value)
        );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return date.toISOString();
}

function dateOnly(
  value: string | null
): string | null {
  if (!value) {
    return null;
  }

  return value.slice(
    0,
    10
  );
}

function inferExchange(
  symbol: string,
  source: UnknownRecord
): MarketDataExchange {
  const explicit =
    text(
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
  symbol: string,
  source: UnknownRecord,
  exchange: MarketDataExchange
): string {
  const explicit =
    text(
      source,
      [
        "currency",
        "tradingCurrency",
        "dividendCurrency",
        "localCurrency",
      ]
    ).toUpperCase();

  if (explicit) {
    return explicit;
  }

  const byExchange: Partial<
    Record<
      MarketDataExchange,
      string
    >
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

  if (symbol.endsWith("-USD")) {
    return "USD";
  }

  return byExchange[exchange] || "AUD";
}

function normaliseFrequency(
  value: unknown
): DividendFrequency {
  const normalised =
    String(
      value || ""
    )
      .trim()
      .toUpperCase()
      .replace(
        /[\s-]+/g,
        "_"
      );

  if (
    [
      "WEEKLY",
      "52",
    ].includes(normalised)
  ) {
    return "WEEKLY";
  }

  if (
    [
      "MONTHLY",
      "12",
    ].includes(normalised)
  ) {
    return "MONTHLY";
  }

  if (
    [
      "QUARTERLY",
      "QUARTER",
      "4",
    ].includes(normalised)
  ) {
    return "QUARTERLY";
  }

  if (
    [
      "SEMI_ANNUAL",
      "SEMIANNUAL",
      "HALF_YEARLY",
      "HALF_YEAR",
      "BIANNUAL",
      "2",
    ].includes(normalised)
  ) {
    return "SEMI_ANNUAL";
  }

  if (
    [
      "ANNUAL",
      "YEARLY",
      "1",
    ].includes(normalised)
  ) {
    return "ANNUAL";
  }

  if (
    [
      "IRREGULAR",
      "SPECIAL",
    ].includes(normalised)
  ) {
    return "IRREGULAR";
  }

  return "UNKNOWN";
}

function paymentsPerYear(
  frequency: DividendFrequency
): number {
  if (frequency === "WEEKLY") {
    return 52;
  }

  if (frequency === "MONTHLY") {
    return 12;
  }

  if (frequency === "QUARTERLY") {
    return 4;
  }

  if (frequency === "SEMI_ANNUAL") {
    return 2;
  }

  if (frequency === "ANNUAL") {
    return 1;
  }

  return 0;
}

function normaliseEventStatus(
  value: unknown
): DividendEventStatus {
  const normalised =
    String(
      value || ""
    )
      .trim()
      .toUpperCase()
      .replace(
        /[\s-]+/g,
        "_"
      );

  if (
    [
      "ANNOUNCED",
      "DECLARED",
      "CONFIRMED",
    ].includes(normalised)
  ) {
    return "ANNOUNCED";
  }

  if (
    [
      "EXPECTED",
      "ESTIMATED",
      "PROJECTED",
    ].includes(normalised)
  ) {
    return "EXPECTED";
  }

  if (
    [
      "FORECAST",
      "FORECASTED",
      "MODELLED",
      "MODELED",
    ].includes(normalised)
  ) {
    return "FORECAST";
  }

  if (
    [
      "PAID",
      "RECEIVED",
      "COMPLETED",
    ].includes(normalised)
  ) {
    return "PAID";
  }

  if (
    [
      "CANCELLED",
      "CANCELED",
      "WITHDRAWN",
    ].includes(normalised)
  ) {
    return "CANCELLED";
  }

  if (
    [
      "SUSPENDED",
      "PAUSED",
    ].includes(normalised)
  ) {
    return "SUSPENDED";
  }

  return "UNKNOWN";
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

function round(
  value: number,
  digits = 4
): number {
  const multiplier =
    10 ** digits;

  return (
    Math.round(
      value *
      multiplier
    ) /
    multiplier
  );
}

function daysFromNow(
  value: string | null,
  now: Date
): number | null {
  if (!value) {
    return null;
  }

  const timestamp =
    new Date(value)
      .getTime();

  if (
    Number.isNaN(timestamp)
  ) {
    return null;
  }

  return Math.ceil(
    (
      timestamp -
      now.getTime()
    ) /
    86_400_000
  );
}

function monthKey(
  value: string | null
): string | null {
  if (!value) {
    return null;
  }

  return value.slice(
    0,
    7
  );
}

function monthLabel(
  key: string
): string {
  const date =
    new Date(
      `${key}-01T00:00:00.000Z`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return key;
  }

  return new Intl.DateTimeFormat(
    "en-AU",
    {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }
  ).format(date);
}

export function normaliseLiveDividendHolding(
  value: unknown
): LiveDividendSourceHolding | null {
  const source =
    record(value);

  const symbol =
    normaliseSymbol(
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

  const exchange =
    inferExchange(
      symbol,
      source
    );

  const quantity =
    numberValue(
      source,
      [
        "quantity",
        "units",
        "shares",
        "openQuantity",
        "remainingQuantity",
      ]
    ) || 0;

  const costBasis =
    numberValue(
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

  const averageCost =
    numberValue(
      source,
      [
        "averageCost",
        "averageBuyPrice",
        "avgCost",
        "unitCost",
      ]
    ) ??
    (
      costBasis !== null &&
      quantity !== 0
        ? costBasis /
          quantity
        : null
    );

  const frequency =
    normaliseFrequency(
      text(
        source,
        [
          "dividendFrequency",
          "frequency",
          "paymentFrequency",
          "distributionFrequency",
        ]
      )
    );

  const lastDividendAmount =
    numberValue(
      source,
      [
        "lastDividendAmount",
        "lastDividend",
        "latestDividend",
        "dividendPerShare",
        "distributionPerUnit",
      ]
    );

  const annualDividendPerShare =
    numberValue(
      source,
      [
        "annualDividendPerShare",
        "forwardAnnualDividendRate",
        "annualDividend",
        "annualDistributionPerUnit",
        "dividendRate",
      ]
    );

  const trailingDividendPerShare =
    numberValue(
      source,
      [
        "trailingAnnualDividendRate",
        "trailingDividendPerShare",
        "trailingDividend",
      ]
    );

  const inferredAnnual =
    annualDividendPerShare ??
    trailingDividendPerShare ??
    (
      lastDividendAmount !== null &&
      paymentsPerYear(
        frequency
      ) > 0
        ? lastDividendAmount *
          paymentsPerYear(
            frequency
          )
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

    costBasis,
    averageCost,

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

    country:
      text(
        source,
        [
          "country",
          "domicile",
          "region",
        ]
      ) ||
      "Unknown",

    currency:
      inferCurrency(
        symbol,
        source,
        exchange
      ),

    exchange,

    annualDividendPerShare:
      inferredAnnual,

    trailingDividendPerShare,

    dividendFrequency:
      frequency,

    lastDividendAmount,

    previousDividendAmount:
      numberValue(
        source,
        [
          "previousDividendAmount",
          "priorDividendAmount",
          "previousDividend",
        ]
      ),

    dividendGrowthRate:
      numberValue(
        source,
        [
          "dividendGrowthRate",
          "dividendGrowth",
          "distributionGrowthRate",
          "fiveYearDividendGrowthRate",
        ]
      ),

    nextExDividendDate:
      parseDate(
        text(
          source,
          [
            "nextExDividendDate",
            "exDividendDate",
            "exDate",
          ]
        )
      ),

    nextRecordDate:
      parseDate(
        text(
          source,
          [
            "nextRecordDate",
            "recordDate",
          ]
        )
      ),

    nextPaymentDate:
      parseDate(
        text(
          source,
          [
            "nextPaymentDate",
            "paymentDate",
            "payDate",
          ]
        )
      ),

    original:
      value,
  };
}

export function normaliseLiveDividendEvent(
  value: unknown,
  index = 0
): LiveDividendSourceEvent | null {
  const source =
    record(value);

  const symbol =
    normaliseSymbol(
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

  const amountPerShare =
    numberValue(
      source,
      [
        "amountPerShare",
        "dividendPerShare",
        "distributionPerUnit",
        "rate",
        "dividendAmount",
        "amount",
      ]
    ) || 0;

  const paymentDate =
    parseDate(
      text(
        source,
        [
          "paymentDate",
          "payDate",
          "date",
        ]
      )
    );

  const exDividendDate =
    parseDate(
      text(
        source,
        [
          "exDividendDate",
          "exDate",
        ]
      )
    );

  const status =
    normaliseEventStatus(
      text(
        source,
        [
          "status",
          "eventStatus",
          "type",
          "classification",
        ]
      )
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
        dateOnly(
          paymentDate
        ) ||
          dateOnly(
            exDividendDate
          ) ||
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
          "description",
        ]
      ) ||
      symbol,

    status,

    frequency:
      normaliseFrequency(
        text(
          source,
          [
            "frequency",
            "dividendFrequency",
            "paymentFrequency",
          ]
        )
      ),

    exDividendDate,

    recordDate:
      parseDate(
        text(
          source,
          [
            "recordDate",
          ]
        )
      ),

    paymentDate,

    announcedDate:
      parseDate(
        text(
          source,
          [
            "announcedDate",
            "declarationDate",
            "declaredDate",
          ]
        )
      ),

    amountPerShare,

    quantity:
      numberValue(
        source,
        [
          "quantity",
          "units",
          "shares",
        ]
      ),

    grossAmount:
      numberValue(
        source,
        [
          "grossAmount",
          "projectedGrossAmount",
          "cashAmount",
          "totalAmount",
        ]
      ),

    netAmount:
      numberValue(
        source,
        [
          "netAmount",
          "projectedNetAmount",
          "receivedAmount",
        ]
      ),

    currency:
      text(
        source,
        [
          "currency",
          "dividendCurrency",
        ]
      ).toUpperCase() ||
      "AUD",

    confidenceScore:
      numberValue(
        source,
        [
          "confidenceScore",
          "forecastConfidence",
          "confidence",
        ]
      ),

    source:
      text(
        source,
        [
          "source",
          "provider",
          "dataSource",
        ]
      ) ||
      "PORTFOLIO",

    original:
      value,
  };
}

function holdingConfidence({
  holding,
  quote,
  annualDividendPerShare,
  nextPaymentDate,
  suspended,
}: {
  holding: LiveDividendSourceHolding;
  quote: NormalisedMarketQuote | null;
  annualDividendPerShare: number;
  nextPaymentDate: string | null;
  suspended: boolean;
}): number {
  let score = 45;

  if (annualDividendPerShare > 0) {
    score += 15;
  }

  if (
    holding.lastDividendAmount !==
    null
  ) {
    score += 8;
  }

  if (
    holding.previousDividendAmount !==
    null
  ) {
    score += 7;
  }

  if (
    holding.dividendFrequency !==
    "UNKNOWN"
  ) {
    score += 7;
  }

  if (nextPaymentDate) {
    score += 8;
  }

  if (quote?.isUsable) {
    score += 8;
  }

  if (quote?.isDelayed) {
    score -= 4;
  }

  if (quote?.isStale) {
    score -= 10;
  }

  if (quote?.isExpired) {
    score -= 20;
  }

  if (suspended) {
    score = Math.min(
      score,
      20
    );
  }

  return Math.max(
    0,
    Math.min(
      100,
      score
    )
  );
}

function holdingRiskScore({
  missingDividendData,
  suspended,
  dividendCut,
  quote,
  frequency,
}: {
  missingDividendData: boolean;
  suspended: boolean;
  dividendCut: boolean;
  quote: NormalisedMarketQuote | null;
  frequency: DividendFrequency;
}): number {
  let score = 10;

  if (missingDividendData) {
    score += 25;
  }

  if (suspended) {
    score += 50;
  }

  if (dividendCut) {
    score += 25;
  }

  if (quote?.isStale) {
    score += 10;
  }

  if (quote?.isExpired) {
    score += 20;
  }

  if (frequency === "IRREGULAR") {
    score += 10;
  }

  if (frequency === "UNKNOWN") {
    score += 15;
  }

  return Math.max(
    0,
    Math.min(
      100,
      score
    )
  );
}

function createSyntheticEvent(
  holding: LiveDividendSourceHolding,
  result: LiveDividendHoldingResult
): LiveDividendSourceEvent | null {
  if (
    !holding.nextPaymentDate ||
    result.annualDividendPerShare <= 0
  ) {
    return null;
  }

  const frequencyCount =
    paymentsPerYear(
      holding.dividendFrequency
    );

  const amountPerShare =
    holding.lastDividendAmount ??
    (
      frequencyCount > 0
        ? result.annualDividendPerShare /
          frequencyCount
        : result.annualDividendPerShare
    );

  return {
    id:
      [
        "synthetic",
        holding.symbol,
        dateOnly(
          holding.nextPaymentDate
        ),
      ].join("-"),

    symbol:
      holding.symbol,

    name:
      holding.name,

    status:
      "EXPECTED",

    frequency:
      holding.dividendFrequency,

    exDividendDate:
      holding.nextExDividendDate,

    recordDate:
      holding.nextRecordDate,

    paymentDate:
      holding.nextPaymentDate,

    announcedDate:
      null,

    amountPerShare,

    quantity:
      holding.quantity,

    grossAmount:
      amountPerShare *
      holding.quantity,

    netAmount:
      null,

    currency:
      holding.currency,

    confidenceScore:
      result.confidenceScore,

    source:
      "HOLDING_FORECAST",

    original:
      holding.original,
  };
}

function monthlyBuckets(
  events: LiveDividendCalendarResult[]
): LiveDividendMonthlyBucket[] {
  const rows =
    new Map<
      string,
      LiveDividendMonthlyBucket
    >();

  for (const event of events) {
    const key =
      event.monthKey;

    if (!key) {
      continue;
    }

    const current =
      rows.get(key) || {
        monthKey:
          key,

        label:
          monthLabel(
            key
          ),

        paymentCount:
          0,

        symbolCount:
          0,

        announcedAmount:
          0,

        expectedAmount:
          0,

        forecastAmount:
          0,

        paidAmount:
          0,

        totalAmount:
          0,

        events:
          [],
      };

    current.paymentCount += 1;
    current.events.push(event);

    if (
      event.status ===
      "ANNOUNCED"
    ) {
      current.announcedAmount +=
        event.projectedNetAmount;
    }

    if (
      event.status ===
      "EXPECTED"
    ) {
      current.expectedAmount +=
        event.projectedNetAmount;
    }

    if (
      event.status ===
      "FORECAST"
    ) {
      current.forecastAmount +=
        event.projectedNetAmount;
    }

    if (
      event.status ===
      "PAID"
    ) {
      current.paidAmount +=
        event.projectedNetAmount;
    }

    current.totalAmount +=
      event.projectedNetAmount;

    rows.set(
      key,
      current
    );
  }

  return Array.from(
    rows.values()
  )
    .map(
      (
        bucket
      ) => ({
        ...bucket,

        symbolCount:
          new Set(
            bucket.events.map(
              (
                event
              ) =>
                event.symbol
            )
          ).size,

        events:
          [...bucket.events].sort(
            (
              left,
              right
            ) =>
              new Date(
                left.paymentDate ||
                "9999-12-31"
              ).getTime() -
              new Date(
                right.paymentDate ||
                "9999-12-31"
              ).getTime()
          ),
      })
    )
    .sort(
      (
        left,
        right
      ) =>
        left.monthKey.localeCompare(
          right.monthKey
        )
    );
}

function sectorBuckets(
  holdings: LiveDividendHoldingResult[],
  totalAnnualIncome: number,
  totalMarketValue: number
): LiveDividendSectorBucket[] {
  const rows =
    new Map<
      string,
      LiveDividendSectorBucket
    >();

  for (const holding of holdings) {
    const key =
      holding.sector ||
      "Unclassified";

    const current =
      rows.get(key) || {
        sector:
          key,

        holdingCount:
          0,

        annualIncome:
          0,

        incomeWeight:
          0,

        marketValue:
          0,

        portfolioWeight:
          0,

        averageCurrentYield:
          0,

        averageYieldOnCost:
          0,
      };

    current.holdingCount += 1;
    current.annualIncome +=
      holding.annualIncome;
    current.marketValue +=
      holding.liveMarketValue ||
      0;

    rows.set(
      key,
      current
    );
  }

  return Array.from(
    rows.values()
  )
    .map(
      (
        bucket
      ) => {
        const matching =
          holdings.filter(
            (
              holding
            ) =>
              holding.sector ===
              bucket.sector
          );

        return {
          ...bucket,

          incomeWeight:
            totalAnnualIncome > 0
              ? (
                  bucket.annualIncome /
                  totalAnnualIncome
                ) *
                100
              : 0,

          portfolioWeight:
            totalMarketValue > 0
              ? (
                  bucket.marketValue /
                  totalMarketValue
                ) *
                100
              : 0,

          averageCurrentYield:
            average(
              matching
                .map(
                  (
                    holding
                  ) =>
                    holding.currentYield
                )
                .filter(
                  (
                    value
                  ): value is number =>
                    value !== null
                )
            ),

          averageYieldOnCost:
            average(
              matching
                .map(
                  (
                    holding
                  ) =>
                    holding.yieldOnCost
                )
                .filter(
                  (
                    value
                  ): value is number =>
                    value !== null
                )
            ),
        };
      }
    )
    .sort(
      (
        left,
        right
      ) =>
        right.annualIncome -
        left.annualIncome
    );
}

export function calculateLiveDividendSynchronisation({
  holdings,
  events,
  quoteBySymbol,
  now = new Date(),
}: {
  holdings: LiveDividendSourceHolding[];
  events: LiveDividendSourceEvent[];

  quoteBySymbol: Record<
    string,
    NormalisedMarketQuote | null
  >;

  now?: Date;
}): LiveDividendSynchronisationResult {
  const preliminary =
    holdings.map(
      (
        holding
      ): LiveDividendHoldingResult => {
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
            ? holding.quantity *
              livePrice
            : null;

        const frequencyCount =
          paymentsPerYear(
            holding.dividendFrequency
          );

        const annualDividendPerShare =
          holding.annualDividendPerShare ??
          holding.trailingDividendPerShare ??
          (
            holding.lastDividendAmount !==
              null &&
            frequencyCount > 0
              ? holding.lastDividendAmount *
                frequencyCount
              : 0
          );

        const annualIncome =
          annualDividendPerShare *
          holding.quantity;

        const monthlyIncome =
          annualIncome /
          12;

        const quarterlyIncome =
          annualIncome /
          4;

        const currentYield =
          livePrice !== null &&
          livePrice > 0
            ? safePercent(
                annualDividendPerShare,
                livePrice
              )
            : null;

        const forwardYield =
          currentYield;

        const yieldOnCost =
          holding.averageCost !==
            null &&
          holding.averageCost > 0
            ? safePercent(
                annualDividendPerShare,
                holding.averageCost
              )
            : holding.costBasis !==
                null &&
              holding.costBasis > 0
              ? safePercent(
                  annualIncome,
                  holding.costBasis
                )
              : null;

        const inferredGrowthRate =
          holding.lastDividendAmount !==
            null &&
          holding.previousDividendAmount !==
            null &&
          holding.previousDividendAmount !==
            0
            ? safePercent(
                holding.lastDividendAmount -
                  holding.previousDividendAmount,
                holding.previousDividendAmount
              )
            : null;

        const growthRate =
          holding.dividendGrowthRate ??
          inferredGrowthRate;

        const dividendCut =
          inferredGrowthRate !==
            null &&
          inferredGrowthRate <
            -0.1;

        const dividendIncrease =
          inferredGrowthRate !==
            null &&
          inferredGrowthRate >
            0.1;

        const explicitSuspended =
          booleanValue(
            record(
              holding.original
            ),
            [
              "dividendSuspended",
              "suspended",
              "distributionSuspended",
            ]
          );

        const statusText =
          text(
            record(
              holding.original
            ),
            [
              "dividendStatus",
              "distributionStatus",
              "status",
            ]
          )
            .toUpperCase();

        const suspended =
          explicitSuspended ===
            true ||
          statusText.includes(
            "SUSPEND"
          ) ||
          statusText.includes(
            "CANCEL"
          );

        const missingDividendData =
          annualDividendPerShare <=
          0;

        const nextPaymentAmount =
          holding.nextPaymentDate &&
          annualDividendPerShare > 0
            ? (
                holding.lastDividendAmount ??
                (
                  frequencyCount > 0
                    ? annualDividendPerShare /
                      frequencyCount
                    : annualDividendPerShare
                )
              ) *
              holding.quantity
            : null;

        const confidenceScore =
          holdingConfidence({
            holding,
            quote,
            annualDividendPerShare,
            nextPaymentDate:
              holding.nextPaymentDate,
            suspended,
          });

        const riskScore =
          holdingRiskScore({
            missingDividendData,
            suspended,
            dividendCut,
            quote,
            frequency:
              holding.dividendFrequency,
          });

        const warnings: string[] = [];

        if (missingDividendData) {
          warnings.push(
            "No annual dividend rate is available."
          );
        }

        if (suspended) {
          warnings.push(
            "Dividend appears suspended or cancelled."
          );
        }

        if (dividendCut) {
          warnings.push(
            "Latest dividend appears lower than the previous dividend."
          );
        }

        if (quote?.isDelayed) {
          warnings.push(
            "Current yield uses delayed market pricing."
          );
        }

        if (quote?.isStale) {
          warnings.push(
            "Current yield uses stale market pricing."
          );
        }

        if (quote?.isExpired) {
          warnings.push(
            "Current yield uses an expired market quote."
          );
        }

        if (
          !holding.nextPaymentDate &&
          annualIncome > 0
        ) {
          warnings.push(
            "The next payment date is not currently available."
          );
        }

        return {
          symbol:
            holding.symbol,

          name:
            holding.name,

          quantity:
            holding.quantity,

          livePrice,
          liveMarketValue,

          costBasis:
            holding.costBasis,

          averageCost:
            holding.averageCost,

          annualDividendPerShare,
          annualIncome,
          monthlyIncome,
          quarterlyIncome,

          currentYield,
          forwardYield,
          yieldOnCost,

          incomeContributionPercent:
            0,

          portfolioWeight:
            0,

          lastDividendAmount:
            holding.lastDividendAmount,

          previousDividendAmount:
            holding.previousDividendAmount,

          dividendGrowthRate:
            growthRate,

          inferredGrowthRate,

          nextExDividendDate:
            holding.nextExDividendDate,

          nextRecordDate:
            holding.nextRecordDate,

          nextPaymentDate:
            holding.nextPaymentDate,

          nextPaymentAmount,

          dividendFrequency:
            holding.dividendFrequency,

          sector:
            holding.sector,

          industry:
            holding.industry,

          country:
            holding.country,

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

          qualityScore:
            quote?.qualityScore ??
            null,

          marketState:
            quote?.marketState ||
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

          confidenceScore,
          riskScore,

          suspended,
          dividendCut,
          dividendIncrease,
          missingDividendData,

          warnings:
            Array.from(
              new Set(
                warnings
              )
            ),

          quote,

          original:
            holding.original,
        };
      }
    );

  const projectedAnnualIncome =
    preliminary.reduce(
      (
        total,
        holding
      ) =>
        total +
        holding.annualIncome,
      0
    );

  const liveMarketValue =
    preliminary.reduce(
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
    preliminary.reduce(
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

  const holdingResults =
    preliminary.map(
      (
        holding
      ) => ({
        ...holding,

        incomeContributionPercent:
          projectedAnnualIncome > 0
            ? (
                holding.annualIncome /
                projectedAnnualIncome
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

  const holdingMap =
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

  const resultMap =
    new Map(
      holdingResults.map(
        (
          holding
        ) => [
          holding.symbol,
          holding,
        ]
      )
    );

  const suppliedEventSymbols =
    new Set(
      events.map(
        (
          event
        ) =>
          event.symbol
      )
    );

  const syntheticEvents =
    holdings
      .filter(
        (
          holding
        ) =>
          !suppliedEventSymbols.has(
            holding.symbol
          )
      )
      .map(
        (
          holding
        ) => {
          const result =
            resultMap.get(
              holding.symbol
            );

          return result
            ? createSyntheticEvent(
                holding,
                result
              )
            : null;
        }
      )
      .filter(
        (
          event
        ): event is LiveDividendSourceEvent =>
          Boolean(event)
      );

  const combinedEvents =
    [
      ...events,
      ...syntheticEvents,
    ];

  const calendar =
    combinedEvents
      .map(
        (
          event
        ): LiveDividendCalendarResult => {
          const holding =
            holdingMap.get(
              event.symbol
            );

          const result =
            resultMap.get(
              event.symbol
            );

          const quantity =
            event.quantity ??
            holding?.quantity ??
            0;

          const projectedGrossAmount =
            event.grossAmount ??
            (
              event.amountPerShare *
              quantity
            );

          const projectedNetAmount =
            event.netAmount ??
            projectedGrossAmount;

          const confidenceScore =
            event.confidenceScore ??
            result?.confidenceScore ??
            (
              event.status ===
              "ANNOUNCED"
                ? 92
                : event.status ===
                  "EXPECTED"
                  ? 75
                  : event.status ===
                    "FORECAST"
                    ? 58
                    : 45
            );

          return {
            id:
              event.id,

            symbol:
              event.symbol,

            name:
              event.name,

            status:
              event.status,

            frequency:
              event.frequency,

            exDividendDate:
              event.exDividendDate,

            recordDate:
              event.recordDate,

            paymentDate:
              event.paymentDate,

            announcedDate:
              event.announcedDate,

            amountPerShare:
              event.amountPerShare,

            quantity,

            projectedGrossAmount,

            projectedNetAmount,

            currency:
              event.currency ||
              holding?.currency ||
              "AUD",

            daysUntilExDividend:
              daysFromNow(
                event.exDividendDate,
                now
              ),

            daysUntilPayment:
              daysFromNow(
                event.paymentDate,
                now
              ),

            monthKey:
              monthKey(
                event.paymentDate
              ),

            confidenceScore:
              Math.max(
                0,
                Math.min(
                  100,
                  confidenceScore
                )
              ),

            source:
              event.source,

            original:
              event.original,
          };
        }
      )
      .filter(
        (
          event
        ) =>
          event.status !==
            "CANCELLED" &&
          event.status !==
            "SUSPENDED"
      )
      .sort(
        (
          left,
          right
        ) =>
          new Date(
            left.paymentDate ||
            "9999-12-31"
          ).getTime() -
          new Date(
            right.paymentDate ||
            "9999-12-31"
          ).getTime()
      );

  const futureCalendar =
    calendar.filter(
      (
        event
      ) =>
        event.daysUntilPayment !==
          null &&
        event.daysUntilPayment >=
          0
    );

  const incomeWithinDays =
    (
      days: number
    ) =>
      futureCalendar
        .filter(
          (
            event
          ) =>
            event.daysUntilPayment !==
              null &&
            event.daysUntilPayment <=
              days
        )
        .reduce(
          (
            total,
            event
          ) =>
            total +
            event.projectedNetAmount,
          0
        );

  const growthValues =
    holdingResults
      .map(
        (
          holding
        ) =>
          holding.dividendGrowthRate
      )
      .filter(
        (
          value
        ): value is number =>
          value !== null
      );

  const weightedGrowth =
    projectedAnnualIncome > 0
      ? holdingResults.reduce(
          (
            total,
            holding
          ) =>
            total +
            (
              (
                holding.dividendGrowthRate ||
                0
              ) *
              holding.annualIncome
            ) /
            projectedAnnualIncome,
          0
        )
      : 0;

  const averageForecastConfidence =
    average(
      [
        ...holdingResults.map(
          (
            holding
          ) =>
            holding.confidenceScore
        ),
        ...futureCalendar.map(
          (
            event
          ) =>
            event.confidenceScore
        ),
      ]
    );

  const suspendedHoldingCount =
    holdingResults.filter(
      (
        holding
      ) =>
        holding.suspended
    ).length;

  const dividendCutCount =
    holdingResults.filter(
      (
        holding
      ) =>
        holding.dividendCut
    ).length;

  const missingDividendHoldingCount =
    holdingResults.filter(
      (
        holding
      ) =>
        holding.missingDividendData
    ).length;

  const stalePriceCount =
    holdingResults.filter(
      (
        holding
      ) =>
        holding.stale
    ).length;

  const expiredPriceCount =
    holdingResults.filter(
      (
        holding
      ) =>
        holding.expired
    ).length;

  const delayedPriceCount =
    holdingResults.filter(
      (
        holding
      ) =>
        holding.delayed
    ).length;

  let dividendHealthScore =
    averageForecastConfidence;

  dividendHealthScore -=
    suspendedHoldingCount *
    12;

  dividendHealthScore -=
    dividendCutCount *
    6;

  dividendHealthScore -=
    missingDividendHoldingCount *
    4;

  dividendHealthScore -=
    stalePriceCount *
    2;

  dividendHealthScore -=
    expiredPriceCount *
    5;

  dividendHealthScore =
    Math.max(
      0,
      Math.min(
        100,
        dividendHealthScore
      )
    );

  const warnings: string[] = [];

  if (
    missingDividendHoldingCount >
    0
  ) {
    warnings.push(
      `${missingDividendHoldingCount} holding${
        missingDividendHoldingCount ===
        1
          ? ""
          : "s"
      } have no usable dividend rate.`
    );
  }

  if (
    suspendedHoldingCount >
    0
  ) {
    warnings.push(
      `${suspendedHoldingCount} holding${
        suspendedHoldingCount ===
        1
          ? ""
          : "s"
      } appear to have suspended dividends.`
    );
  }

  if (
    dividendCutCount >
    0
  ) {
    warnings.push(
      `${dividendCutCount} holding${
        dividendCutCount ===
        1
          ? ""
          : "s"
      } show a possible dividend reduction.`
    );
  }

  if (
    stalePriceCount >
    0
  ) {
    warnings.push(
      `${stalePriceCount} current-yield calculation${
        stalePriceCount ===
        1
          ? ""
          : "s"
      } use stale market pricing.`
    );
  }

  if (
    expiredPriceCount >
    0
  ) {
    warnings.push(
      `${expiredPriceCount} current-yield calculation${
        expiredPriceCount ===
        1
          ? ""
          : "s"
      } use expired market pricing.`
    );
  }

  if (
    futureCalendar.length ===
    0 &&
    projectedAnnualIncome >
    0
  ) {
    warnings.push(
      "Projected annual income exists, but no future payment dates are currently available."
    );
  }

  const currentPortfolioYield =
    safePercent(
      projectedAnnualIncome,
      liveMarketValue
    );

  const portfolioYieldOnCost =
    safePercent(
      projectedAnnualIncome,
      costBasis
    );

  return {
    generatedAt:
      now.toISOString(),

    holdings:
      holdingResults,

    calendar,

    monthlyIncome:
      monthlyBuckets(
        calendar
      ),

    sectorIncome:
      sectorBuckets(
        holdingResults,
        projectedAnnualIncome,
        liveMarketValue
      ),

    totals: {
      holdingCount:
        holdingResults.length,

      dividendHoldingCount:
        holdingResults.filter(
          (
            holding
          ) =>
            holding.annualIncome >
            0
        ).length,

      missingDividendHoldingCount,

      liveMarketValue,
      costBasis,

      projectedAnnualIncome,

      projectedMonthlyIncome:
        projectedAnnualIncome /
        12,

      projectedQuarterlyIncome:
        projectedAnnualIncome /
        4,

      incomeNext7Days:
        incomeWithinDays(
          7
        ),

      incomeNext30Days:
        incomeWithinDays(
          30
        ),

      incomeNext90Days:
        incomeWithinDays(
          90
        ),

      incomeNext365Days:
        incomeWithinDays(
          365
        ),

      currentPortfolioYield,

      forwardPortfolioYield:
        currentPortfolioYield,

      portfolioYieldOnCost,

      averageDividendGrowthRate:
        round(
          average(
            growthValues
          ),
          2
        ),

      weightedDividendGrowthRate:
        round(
          weightedGrowth,
          2
        ),

      announcedEventCount:
        calendar.filter(
          (
            event
          ) =>
            event.status ===
            "ANNOUNCED"
        ).length,

      expectedEventCount:
        calendar.filter(
          (
            event
          ) =>
            event.status ===
            "EXPECTED"
        ).length,

      forecastEventCount:
        calendar.filter(
          (
            event
          ) =>
            event.status ===
            "FORECAST"
        ).length,

      paidEventCount:
        calendar.filter(
          (
            event
          ) =>
            event.status ===
            "PAID"
        ).length,

      suspendedHoldingCount,

      dividendCutCount,

      dividendIncreaseCount:
        holdingResults.filter(
          (
            holding
          ) =>
            holding.dividendIncrease
        ).length,

      stalePriceCount,
      delayedPriceCount,
      expiredPriceCount,

      averageForecastConfidence:
        round(
          averageForecastConfidence,
          2
        ),

      dividendHealthScore:
        round(
          dividendHealthScore,
          2
        ),
    },

    nextDividend:
      futureCalendar[0] ||
      null,

    warnings:
      Array.from(
        new Set(
          warnings
        )
      ),
  };
}
