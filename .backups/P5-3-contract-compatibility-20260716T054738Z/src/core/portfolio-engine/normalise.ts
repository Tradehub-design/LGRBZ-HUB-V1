import {
  PORTFOLIO_ENGINE_SCHEMA_VERSION,
  isSupportedCurrency,
  type AccountIdentity,
  type Classification,
  type CorporateActionMetadata,
  type CurrencyCode,
  type PortfolioTransaction,
  type SecurityIdentity,
  type TaxMetadata,
  type TransactionAmounts,
  type TransactionSource,
  type TransactionStatus,
  type ValidationIssue,
} from "./contracts";

import {
  actionRequiresQuantity,
  actionRequiresSecurity,
  actionRequiresUnitPrice,
  normaliseTransactionAction,
} from "./actions";

import {
  calculateBuyNetAmount,
  calculateGrossAmount,
  calculateSellNetAmount,
  decimalPlaces,
  finiteNumber,
  nonNegativeFiniteNumber,
  positiveFiniteNumber,
  roundMoney,
  roundQuantity,
} from "./money";

import {
  createAccountId,
  createSecurityId,
  createStableTransactionId,
  displayTickerForMarket,
  inferMarket,
  normaliseIdentityPart,
  normaliseTicker,
  quoteTickerForMarket,
} from "./identity";

import {
  normaliseTimestamp,
  optionalIsoDate,
  parseDateValue,
} from "./dates";

import {
  RAW_TRANSACTION_FIELD_MAP,
  copyRawRecord,
  readRawField,
  type RawPortfolioTransaction,
} from "./raw-transaction";

export type TransactionNormalisationContext = {
  source?: TransactionSource;
  generatedAt?: string;
  defaultCurrency?: CurrencyCode;
  defaultPlatform?: string;
  defaultAccountName?: string;
  defaultAssetClass?: string;
  defaultCountry?: string;
};

export type NormalisedTransactionResult =
  | {
      ok: true;
      transaction: PortfolioTransaction;
      issues: ValidationIssue[];
    }
  | {
      ok: false;
      transaction: null;
      issues: ValidationIssue[];
    };

function cleanText(
  value: unknown,
  fallback = "",
): string {
  const text = String(value ?? "")
    .replace(/\u00a0/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  return text || fallback;
}

function normaliseSource(
  value: unknown,
  fallback: TransactionSource,
): TransactionSource {
  const source = cleanText(value)
    .toLowerCase()
    .replace(/[_\s]+/g, "-");

  switch (source) {
    case "excel":
    case "excel-seed":
    case "workbook":
    case "master-workbook":
    case "master-excel":
    case "import":
      return "excel-seed";

    case "manual":
    case "user":
    case "user-entry":
      return "manual";

    case "broker":
    case "broker-sync":
    case "sync":
    case "api":
      return "broker-sync";

    case "system":
    case "generated":
      return "system";

    default:
      return fallback;
  }
}

function normaliseStatus(value: unknown): TransactionStatus {
  const status = cleanText(value, "posted").toLowerCase();

  switch (status) {
    case "posted":
    case "complete":
    case "completed":
    case "confirmed":
    case "settled":
    case "executed":
      return "posted";

    case "pending":
    case "open":
    case "processing":
    case "unsettled":
      return "pending";

    case "cancelled":
    case "canceled":
    case "void":
    case "deleted":
      return "cancelled";

    case "invalid":
    case "rejected":
    case "error":
      return "invalid";

    default:
      return "posted";
  }
}

function normaliseCurrency(
  value: unknown,
  market: ReturnType<typeof inferMarket>,
  fallback: CurrencyCode,
): CurrencyCode {
  const rawCurrency = cleanText(value).toUpperCase();

  const aliases: Record<string, CurrencyCode> = {
    "$": market === "US" ? "USD" : "AUD",
    "A$": "AUD",
    "AU$": "AUD",
    "AUD$": "AUD",
    "US$": "USD",
    "USD$": "USD",
    "NZ$": "NZD",
    "C$": "CAD",
    "HK$": "HKD",
    "S$": "SGD",
    "RMB": "CNY",
    "CNH": "CNY",
  };

  const aliased = aliases[rawCurrency] ?? rawCurrency;

  if (isSupportedCurrency(aliased)) {
    return aliased;
  }

  if (market === "ASX") {
    return "AUD";
  }

  if (market === "US") {
    return "USD";
  }

  return fallback;
}

function normaliseTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return Array.from(
      new Set(
        value
          .map((tag) => cleanText(tag))
          .filter(Boolean),
      ),
    );
  }

  const text = cleanText(value);

  if (!text) {
    return [];
  }

  return Array.from(
    new Set(
      text
        .split(/[,;|]/)
        .map((tag) => cleanText(tag))
        .filter(Boolean),
    ),
  );
}

function normalisePercent(value: unknown): number | undefined {
  if (
    value === undefined ||
    value === null ||
    cleanText(value) === ""
  ) {
    return undefined;
  }

  const text = cleanText(value).replace(/%$/, "");
  const parsed = finiteNumber(text, Number.NaN);

  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return Math.min(100, Math.max(0, roundMoney(parsed, 4)));
}

function parseRatio(
  numeratorValue: unknown,
  denominatorValue: unknown,
  splitRatioValue: unknown,
): {
  numerator?: number;
  denominator?: number;
} {
  let numerator = positiveFiniteNumber(
    numeratorValue,
    0,
  );

  let denominator = positiveFiniteNumber(
    denominatorValue,
    0,
  );

  if (
    numerator <= 0 ||
    denominator <= 0
  ) {
    const ratioText = cleanText(splitRatioValue);

    const match = ratioText.match(
      /^\s*(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)\s*$/,
    );

    if (match) {
      numerator = positiveFiniteNumber(match[1], 0);
      denominator = positiveFiniteNumber(match[2], 0);
    }
  }

  return {
    numerator:
      numerator > 0
        ? numerator
        : undefined,

    denominator:
      denominator > 0
        ? denominator
        : undefined,
  };
}

function pick(
  raw: RawPortfolioTransaction,
  key: keyof typeof RAW_TRANSACTION_FIELD_MAP,
): unknown {
  return readRawField(
    raw,
    RAW_TRANSACTION_FIELD_MAP[key],
  );
}

function resolveGrossAmount(input: {
  action: string;
  quantity: number;
  unitPrice: number;
  suppliedGross: unknown;
  suppliedNet: unknown;
  fees: number;
}): number {
  const suppliedGross = nonNegativeFiniteNumber(
    input.suppliedGross,
    0,
  );

  if (suppliedGross > 0) {
    return roundMoney(suppliedGross);
  }

  const calculatedGross = calculateGrossAmount(
    input.quantity,
    input.unitPrice,
  );

  if (calculatedGross > 0) {
    return calculatedGross;
  }

  const suppliedNet = nonNegativeFiniteNumber(
    input.suppliedNet,
    0,
  );

  if (suppliedNet <= 0) {
    return 0;
  }

  switch (input.action) {
    case "BUY":
    case "DIVIDEND_REINVESTMENT":
      return roundMoney(
        Math.max(0, suppliedNet - input.fees),
      );

    case "SELL":
      return roundMoney(
        suppliedNet + input.fees,
      );

    default:
      return suppliedNet;
  }
}

function resolveNetAmount(input: {
  action: string;
  grossAmount: number;
  suppliedNet: unknown;
  fees: number;
}): number {
  const suppliedNet = nonNegativeFiniteNumber(
    input.suppliedNet,
    0,
  );

  if (suppliedNet > 0) {
    return roundMoney(suppliedNet);
  }

  switch (input.action) {
    case "BUY":
    case "DIVIDEND_REINVESTMENT":
      return calculateBuyNetAmount(
        input.grossAmount,
        input.fees,
      );

    case "SELL":
      return calculateSellNetAmount(
        input.grossAmount,
        input.fees,
      );

    default:
      return roundMoney(input.grossAmount);
  }
}

function createSecurity(input: {
  tickerValue: unknown;
  marketValue: unknown;
  countryValue: unknown;
  quoteTickerValue: unknown;
  securityIdValue: unknown;
  nameValue: unknown;
  isinValue: unknown;
}): SecurityIdentity | null {
  const rawTicker = normaliseTicker(input.tickerValue);

  if (!rawTicker) {
    return null;
  }

  const market = inferMarket(
    rawTicker,
    input.marketValue,
    input.countryValue,
  );

  const ticker = displayTickerForMarket(
    rawTicker,
    market,
  );

  const inferredQuoteTicker = quoteTickerForMarket(
    ticker,
    market,
  );

  const suppliedSecurityId = cleanText(
    input.securityIdValue,
  );

  const securityId =
    suppliedSecurityId ||
    createSecurityId(ticker, market);

  return {
    securityId,
    ticker,
    market,
    quoteTicker:
      normaliseTicker(input.quoteTickerValue) ||
      inferredQuoteTicker,
    name: cleanText(input.nameValue, ticker),
    isin: cleanText(input.isinValue) || undefined,
  };
}

function createAccount(input: {
  accountIdValue: unknown;
  accountNameValue: unknown;
  platformValue: unknown;
  defaultPlatform: string;
  defaultAccountName: string;
}): AccountIdentity {
  const platform = cleanText(
    input.platformValue,
    input.defaultPlatform,
  );

  const accountName = cleanText(
    input.accountNameValue,
    input.defaultAccountName,
  );

  const suppliedAccountId = cleanText(
    input.accountIdValue,
  );

  return {
    accountId:
      suppliedAccountId ||
      createAccountId(platform, accountName),
    accountName,
    platform,
  };
}

function createClassification(input: {
  assetClassValue: unknown;
  sectorValue: unknown;
  industryValue: unknown;
  countryValue: unknown;
  strategyValue: unknown;
  defaultAssetClass: string;
  defaultCountry: string;
}): Classification {
  return {
    assetClass: cleanText(
      input.assetClassValue,
      input.defaultAssetClass,
    ),

    sector: cleanText(
      input.sectorValue,
      "Unclassified",
    ),

    industry: cleanText(
      input.industryValue,
      "Unclassified",
    ),

    country: cleanText(
      input.countryValue,
      input.defaultCountry,
    ),

    strategy: cleanText(
      input.strategyValue,
      "Unclassified",
    ),
  };
}

function createTaxMetadata(raw: RawPortfolioTransaction): TaxMetadata {
  const frankingCreditAud = nonNegativeFiniteNumber(
    pick(raw, "frankingCreditAud"),
    0,
  );

  const withholdingTaxAud = nonNegativeFiniteNumber(
    pick(raw, "withholdingTaxAud"),
    0,
  );

  const deductibleFeeAud = nonNegativeFiniteNumber(
    pick(raw, "deductibleFeeAud"),
    0,
  );

  return {
    frankingPercent: normalisePercent(
      pick(raw, "frankingPercent"),
    ),

    frankingCreditAud:
      frankingCreditAud > 0
        ? roundMoney(frankingCreditAud)
        : undefined,

    withholdingTaxAud:
      withholdingTaxAud > 0
        ? roundMoney(withholdingTaxAud)
        : undefined,

    deductibleFeeAud:
      deductibleFeeAud > 0
        ? roundMoney(deductibleFeeAud)
        : undefined,
  };
}

function createCorporateActionMetadata(
  raw: RawPortfolioTransaction,
): CorporateActionMetadata {
  const ratio = parseRatio(
    pick(raw, "ratioNumerator"),
    pick(raw, "ratioDenominator"),
    raw.splitRatio,
  );

  return {
    ratioNumerator: ratio.numerator,
    ratioDenominator: ratio.denominator,
  };
}

export function normalisePortfolioTransaction(
  raw: RawPortfolioTransaction,
  context: TransactionNormalisationContext = {},
): NormalisedTransactionResult {
  const issues: ValidationIssue[] = [];

  const generatedAt =
    context.generatedAt ??
    new Date().toISOString();

  const source = normaliseSource(
    pick(raw, "source"),
    context.source ?? "manual",
  );

  const actionResult = normaliseTransactionAction(
    pick(raw, "action"),
  );

  if (!actionResult.ok) {
    issues.push({
      code: "INVALID_ACTION",
      severity: "error",
      message: actionResult.reason,
      field: "action",
      suppliedValue: actionResult.originalValue,
    });

    return {
      ok: false,
      transaction: null,
      issues,
    };
  }

  const action = actionResult.action;

  const tradeDateResult = parseDateValue(
    pick(raw, "tradeDate"),
  );

  if (!tradeDateResult.ok) {
    issues.push({
      code: "INVALID_DATE",
      severity: "error",
      message: tradeDateResult.reason,
      field: "tradeDate",
      suppliedValue: tradeDateResult.originalValue,
    });

    return {
      ok: false,
      transaction: null,
      issues,
    };
  }

  const sourceRowValue = finiteNumber(
    pick(raw, "sourceRow"),
    0,
  );

  const sourceRow =
    sourceRowValue > 0
      ? Math.trunc(sourceRowValue)
      : undefined;

  const countryValue = pick(raw, "country");

  const security = createSecurity({
    tickerValue: pick(raw, "ticker"),
    marketValue: pick(raw, "market"),
    countryValue,
    quoteTickerValue: pick(raw, "quoteTicker"),
    securityIdValue: pick(raw, "securityId"),
    nameValue: pick(raw, "name"),
    isinValue: pick(raw, "isin"),
  });

  if (
    actionRequiresSecurity(action) &&
    !security
  ) {
    issues.push({
      code: "MISSING_TICKER",
      severity: "error",
      message: `${action} requires a security ticker.`,
      field: "ticker",
      suppliedValue: pick(raw, "ticker"),
    });
  }

  const defaultPlatform =
    context.defaultPlatform ?? "Unassigned";

  const defaultAccountName =
    context.defaultAccountName ?? "Default";

  const account = createAccount({
    accountIdValue: pick(raw, "accountId"),
    accountNameValue: pick(raw, "accountName"),
    platformValue: pick(raw, "platform"),
    defaultPlatform,
    defaultAccountName,
  });

  const classification = createClassification({
    assetClassValue: pick(raw, "assetClass"),
    sectorValue: pick(raw, "sector"),
    industryValue: pick(raw, "industry"),
    countryValue,
    strategyValue: pick(raw, "strategy"),
    defaultAssetClass:
      context.defaultAssetClass ?? "Equity",
    defaultCountry:
      context.defaultCountry ??
      (security?.market === "ASX"
        ? "Australia"
        : security?.market === "US"
          ? "United States"
          : "Unclassified"),
  });

  const currency = normaliseCurrency(
    pick(raw, "currency"),
    security?.market ?? "UNKNOWN",
    context.defaultCurrency ?? "AUD",
  );

  const rawQuantity = pick(raw, "quantity");
  const rawUnitPrice = pick(raw, "unitPrice");
  const rawFees = pick(raw, "fees");
  const rawGrossAmount = pick(raw, "grossAmount");
  const rawNetAmount = pick(raw, "netAmount");
  const rawFxRate = pick(raw, "fxRateToAud");

  const quantity = roundQuantity(
    Math.abs(finiteNumber(rawQuantity, 0)),
  );

  const unitPrice = roundMoney(
    Math.abs(finiteNumber(rawUnitPrice, 0)),
  );

  const fees = roundMoney(
    Math.abs(finiteNumber(rawFees, 0)),
  );

  let fxRateToAud = positiveFiniteNumber(
    rawFxRate,
    0,
  );

  if (currency === "AUD") {
    fxRateToAud = 1;
  }

  if (fxRateToAud <= 0) {
    issues.push({
      code: "MISSING_FX_RATE",
      severity:
        currency === "AUD"
          ? "warning"
          : "error",
      message:
        currency === "AUD"
          ? "AUD transaction FX rate defaulted to 1."
          : `${currency} transaction requires a valid FX rate to AUD.`,
      field: "fxRateToAud",
      suppliedValue: rawFxRate,
    });

    if (currency === "AUD") {
      fxRateToAud = 1;
    }
  }

  const grossAmount = resolveGrossAmount({
    action,
    quantity,
    unitPrice,
    suppliedGross: rawGrossAmount,
    suppliedNet: rawNetAmount,
    fees,
  });

  const netAmount = resolveNetAmount({
    action,
    grossAmount,
    suppliedNet: rawNetAmount,
    fees,
  });

  if (
    actionRequiresQuantity(action) &&
    quantity <= 0
  ) {
    issues.push({
      code: "INVALID_QUANTITY",
      severity: "error",
      message: `${action} requires a quantity greater than zero.`,
      field: "quantity",
      suppliedValue: rawQuantity,
    });
  }

  if (
    actionRequiresUnitPrice(action) &&
    unitPrice <= 0
  ) {
    issues.push({
      code: "INVALID_PRICE",
      severity: "error",
      message: `${action} requires a unit price greater than zero.`,
      field: "unitPrice",
      suppliedValue: rawUnitPrice,
    });
  }

  const amountRequiredActions = new Set([
    "BUY",
    "SELL",
    "DIVIDEND",
    "DIVIDEND_REINVESTMENT",
    "INTEREST",
    "DEPOSIT",
    "WITHDRAWAL",
    "FEE",
    "TAX",
    "TRANSFER_IN",
    "TRANSFER_OUT",
    "RETURN_OF_CAPITAL",
  ]);

  if (
    amountRequiredActions.has(action) &&
    grossAmount <= 0 &&
    netAmount <= 0
  ) {
    issues.push({
      code: "INVALID_NET_AMOUNT",
      severity: "error",
      message: `${action} requires a valid transaction amount.`,
      field: "netAmount",
      suppliedValue: rawNetAmount,
    });
  }

  const ratioMetadata =
    createCorporateActionMetadata(raw);

  if (
    (action === "SPLIT" ||
      action === "CONSOLIDATION") &&
    (
      !ratioMetadata.ratioNumerator ||
      !ratioMetadata.ratioDenominator
    )
  ) {
    issues.push({
      code: "INVALID_CORPORATE_ACTION",
      severity: "error",
      message:
        `${action} requires a valid numerator and denominator ratio.`,
      field: "splitRatio",
      suppliedValue: raw.splitRatio,
    });
  }

  const suppliedId = cleanText(
    pick(raw, "id"),
  );

  const stableId = createStableTransactionId({
    source,
    sourceRow,
    tradeDate: tradeDateResult.isoDate,
    action,
    ticker: security?.ticker,
    quantity,
    unitPrice,
    netAmount,
    platform: account.platform,
  });

  const id = suppliedId || stableId;

  const amounts: TransactionAmounts = {
    quantity,
    unitPrice,
    fees,
    grossAmount,
    netAmount,
    fxRateToAud: roundMoney(fxRateToAud),
    quantityPrecision: Math.min(
      10,
      Math.max(
        decimalPlaces(rawQuantity),
        decimalPlaces(quantity),
      ),
    ),
    moneyPrecision: Math.min(
      8,
      Math.max(
        2,
        decimalPlaces(rawUnitPrice),
        decimalPlaces(rawNetAmount),
      ),
    ),
  };

  const createdAt = normaliseTimestamp(
    pick(raw, "createdAt"),
    generatedAt,
  );

  const updatedAt = normaliseTimestamp(
    pick(raw, "updatedAt"),
    createdAt,
  );

  const transaction: PortfolioTransaction = {
    schemaVersion:
      PORTFOLIO_ENGINE_SCHEMA_VERSION,

    id,

    source,

    sourceRow,

    externalId:
      cleanText(pick(raw, "externalId")) ||
      undefined,

    status: normaliseStatus(
      pick(raw, "status"),
    ),

    action,

    tradeDate: tradeDateResult.isoDate,

    settlementDate: optionalIsoDate(
      pick(raw, "settlementDate"),
    ),

    security,

    account,

    classification,

    currency,

    amounts,

    tax: createTaxMetadata(raw),

    corporateAction: ratioMetadata,

    notes: cleanText(
      pick(raw, "notes"),
    ),

    tags: normaliseTags(
      pick(raw, "tags"),
    ),

    createdAt,

    updatedAt,

    raw: copyRawRecord(raw),
  };

  const transactionIssues = issues.map(
    (issue): ValidationIssue => ({
      ...issue,
      transactionId: issue.transactionId ?? id,
    }),
  );

  const containsError =
    transactionIssues.some(
      (issue) => issue.severity === "error",
    );

  if (containsError) {
    return {
      ok: false,
      transaction: null,
      issues: transactionIssues,
    };
  }

  return {
    ok: true,
    transaction,
    issues: transactionIssues,
  };
}

export function normalisePortfolioTransactions(
  rawTransactions: readonly RawPortfolioTransaction[],
  context: TransactionNormalisationContext = {},
): {
  transactions: PortfolioTransaction[];
  issues: ValidationIssue[];
  rejectedCount: number;
  acceptedCount: number;
} {
  const transactions: PortfolioTransaction[] = [];
  const issues: ValidationIssue[] = [];

  let rejectedCount = 0;

  rawTransactions.forEach((rawTransaction, index) => {
    const result = normalisePortfolioTransaction(
      rawTransaction,
      {
        ...context,
        source:
          context.source ??
          normaliseSource(
            pick(rawTransaction, "source"),
            "manual",
          ),
      },
    );

    if (result.ok) {
      transactions.push(result.transaction);
    } else {
      rejectedCount += 1;
    }

    issues.push(
      ...result.issues.map(
        (issue): ValidationIssue => ({
          ...issue,
          message:
            issue.message ||
            `Transaction row ${index + 1} is invalid.`,
        }),
      ),
    );
  });

  return {
    transactions,
    issues,
    rejectedCount,
    acceptedCount: transactions.length,
  };
}
