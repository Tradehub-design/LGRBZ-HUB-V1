import type {
  CurrencyCode as StoreCurrencyCode,
  LedgerRow,
} from "@/store/portfolioStore";

import type {
  CurrencyCode,
  MarketCode,
  TransactionSource,
} from "../contracts";

import type {
  RawPortfolioTransaction,
} from "../raw-transaction";

import {
  finiteNumber,
} from "../money";

import {
  inferMarket,
  normaliseTicker,
} from "../identity";

const SUPPORTED_ENGINE_CURRENCIES:
  readonly CurrencyCode[] = [
    "AUD",
    "USD",
    "NZD",
    "GBP",
    "EUR",
    "CAD",
    "JPY",
    "HKD",
    "SGD",
    "CHF",
    "CNY",
  ];

function text(
  value: unknown,
  fallback = "",
): string {
  const resolved = String(value ?? "")
    .replace(/\u00a0/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  return resolved || fallback;
}

function positive(
  ...values: unknown[]
): number {
  for (const value of values) {
    const parsed = finiteNumber(
      value,
      Number.NaN,
    );

    if (
      Number.isFinite(parsed) &&
      parsed > 0
    ) {
      return Math.abs(parsed);
    }
  }

  return 0;
}

function nonNegative(
  ...values: unknown[]
): number {
  for (const value of values) {
    const parsed = finiteNumber(
      value,
      Number.NaN,
    );

    if (
      Number.isFinite(parsed) &&
      parsed >= 0
    ) {
      return Math.abs(parsed);
    }
  }

  return 0;
}

function normaliseStoreCurrency(
  value: unknown,
  market: MarketCode,
): CurrencyCode {
  const currency =
    text(value).toUpperCase();

  const supportedCurrencies:
    readonly string[] =
      SUPPORTED_ENGINE_CURRENCIES;

  if (
    supportedCurrencies.includes(
      currency,
    )
  ) {
    return currency as CurrencyCode;
  }

  if (market === "US") {
    return "USD";
  }

  return "AUD";
}

function normaliseSource(
  value: unknown,
): TransactionSource {
  const source =
    text(value)
      .toLowerCase()
      .replace(/[_\s]+/g, "-");

  if (
    source.includes("excel") ||
    source.includes("master") ||
    source.includes("import")
  ) {
    return "excel-seed";
  }

  if (
    source.includes("broker") ||
    source.includes("sync") ||
    source.includes("api")
  ) {
    return "broker-sync";
  }

  if (
    source.includes("system")
  ) {
    return "system";
  }

  return "manual";
}

function resolveTicker(
  row: LedgerRow,
): string {
  return normaliseTicker(
    row.ticker ??
    row.assetTicker ??
    row.raw?.ticker ??
    row.raw?.symbol ??
    row.raw?.code,
  );
}

function resolveMarket(
  row: LedgerRow,
  ticker: string,
): MarketCode {
  return inferMarket(
    ticker,
    row.exchange ??
    row.raw?.exchange ??
    row.raw?.market,
    row.country ??
    row.raw?.country,
  );
}

function resolveFxRateToAud(
  row: LedgerRow,
  currency: CurrencyCode,
): number {
  if (currency === "AUD") {
    return 1;
  }

  const explicitFxRate = positive(
    row.fxRateToAud,
    row.raw?.fxRateToAud,
    row.raw?.fxRate,
    row.raw?.exchangeRate,
  );

  if (explicitFxRate > 0) {
    return explicitFxRate;
  }

  const localPrice = positive(
    row.price,
  );

  const audPrice = positive(
    row.priceAud,
  );

  if (
    localPrice > 0 &&
    audPrice > 0
  ) {
    return audPrice / localPrice;
  }

  const localAmount = positive(
    row.total,
    row.amount,
  );

  const audAmount = positive(
    row.totalAud,
    row.amountAud,
  );

  if (
    localAmount > 0 &&
    audAmount > 0
  ) {
    return audAmount / localAmount;
  }

  return 0;
}

function resolveUnitPrice(
  row: LedgerRow,
  currency: CurrencyCode,
  fxRateToAud: number,
): number {
  const localPrice = positive(
    row.price,
    row.raw?.price,
    row.raw?.unitPrice,
  );

  if (localPrice > 0) {
    return localPrice;
  }

  const audPrice = positive(
    row.priceAud,
    row.raw?.priceAud,
  );

  if (
    audPrice > 0 &&
    currency === "AUD"
  ) {
    return audPrice;
  }

  if (
    audPrice > 0 &&
    fxRateToAud > 0
  ) {
    return audPrice / fxRateToAud;
  }

  return 0;
}

function resolveFeesLocal(
  row: LedgerRow,
  currency: CurrencyCode,
  fxRateToAud: number,
): number {
  const localFees = nonNegative(
    row.fees,
    row.fiatFees,
    row.raw?.fees,
    row.raw?.brokerage,
    row.raw?.commission,
  );

  if (localFees > 0) {
    return localFees;
  }

  const feesAud = nonNegative(
    row.feesAud,
    row.raw?.feesAud,
  );

  if (currency === "AUD") {
    return feesAud;
  }

  if (
    feesAud > 0 &&
    fxRateToAud > 0
  ) {
    return feesAud / fxRateToAud;
  }

  return 0;
}

function resolveNetAmountLocal(
  row: LedgerRow,
  currency: CurrencyCode,
  fxRateToAud: number,
): number {
  const directLocalAmount = positive(
    row.totalFeesIncluded,
    row.total,
    row.amount,
    row.raw?.netAmount,
    row.raw?.total,
    row.raw?.amount,
  );

  if (directLocalAmount > 0) {
    return directLocalAmount;
  }

  const audAmount = positive(
    row.totalFeesIncludedAud,
    row.totalAud,
    row.amountAud,
    row.raw?.netAmountAud,
    row.raw?.totalAud,
  );

  if (currency === "AUD") {
    return audAmount;
  }

  if (
    audAmount > 0 &&
    fxRateToAud > 0
  ) {
    return audAmount / fxRateToAud;
  }

  return 0;
}

function resolveGrossAmountLocal(
  row: LedgerRow,
  quantity: number,
  unitPrice: number,
  fees: number,
  netAmount: number,
): number {
  const explicitGross = positive(
    row.grossAmount,
    row.raw?.grossAmount,
    row.raw?.gross,
    row.raw?.consideration,
  );

  if (explicitGross > 0) {
    return explicitGross;
  }

  const calculatedGross =
    quantity > 0 && unitPrice > 0
      ? quantity * unitPrice
      : 0;

  if (calculatedGross > 0) {
    return calculatedGross;
  }

  const action =
    text(row.action).toLowerCase();

  if (
    action.includes("buy") &&
    netAmount > fees
  ) {
    return netAmount - fees;
  }

  if (
    action.includes("sell") &&
    netAmount > 0
  ) {
    return netAmount + fees;
  }

  return netAmount;
}

function resolveTransactionDate(
  row: LedgerRow,
): unknown {
  return (
    row.date ??
    row.tradeDate ??
    row.transactionDate ??
    row.raw?.date ??
    row.raw?.tradeDate ??
    row.raw?.transactionDate
  );
}

function resolveName(
  row: LedgerRow,
  ticker: string,
): string {
  return text(
    row.company ??
    row.name ??
    row.raw?.company ??
    row.raw?.companyName ??
    row.raw?.securityName,
    ticker,
  );
}

function resolveAccountName(
  row: LedgerRow,
): string {
  return text(
    row.accountName ??
    row.account ??
    row.raw?.accountName ??
    row.raw?.account,
    "Default",
  );
}

function resolvePlatform(
  row: LedgerRow,
): string {
  return text(
    row.platform ??
    row.raw?.platform ??
    row.raw?.broker,
    "Manual",
  );
}

function resolveAction(
  row: LedgerRow,
): unknown {
  return (
    row.action ??
    row.type ??
    row.raw?.action ??
    row.raw?.type ??
    row.raw?.transactionType
  );
}

export function ledgerRowToRawPortfolioTransaction(
  row: LedgerRow,
  index = 0,
): RawPortfolioTransaction {
  const ticker =
    resolveTicker(row);

  const market =
    resolveMarket(
      row,
      ticker,
    );

  const currency =
    normaliseStoreCurrency(
      row.currency as StoreCurrencyCode,
      market,
    );

  const fxRateToAud =
    resolveFxRateToAud(
      row,
      currency,
    );

  const quantity =
    positive(
      row.quantity,
      row.raw?.quantity,
      row.raw?.units,
      row.raw?.shares,
    );

  const unitPrice =
    resolveUnitPrice(
      row,
      currency,
      fxRateToAud,
    );

  const fees =
    resolveFeesLocal(
      row,
      currency,
      fxRateToAud,
    );

  const netAmount =
    resolveNetAmountLocal(
      row,
      currency,
      fxRateToAud,
    );

  const grossAmount =
    resolveGrossAmountLocal(
      row,
      quantity,
      unitPrice,
      fees,
      netAmount,
    );

  const sourceRow =
    positive(
      row.sourceRow,
      row.rowNumber,
      row.raw?.sourceRow,
      index + 1,
    );

  const platform =
    resolvePlatform(row);

  const accountName =
    resolveAccountName(row);

  return {
    id:
      text(row.id) ||
      undefined,

    source:
      normaliseSource(
        row.source,
      ),

    sourceRow,

    status:
      row.status ??
      row.raw?.status ??
      "posted",

    action:
      resolveAction(row),

    tradeDate:
      resolveTransactionDate(row),

    settlementDate:
      row.settlementDate ??
      row.raw?.settlementDate,

    ticker,

    symbol:
      ticker,

    market,

    exchange:
      row.exchange ??
      row.raw?.exchange ??
      market,

    country:
      row.country ??
      row.raw?.country,

    name:
      resolveName(
        row,
        ticker,
      ),

    accountId:
      row.accountId ??
      row.raw?.accountId,

    accountName,

    platform,

    currency,

    quantity,

    unitPrice,

    fees,

    grossAmount,

    netAmount,

    fxRateToAud,

    assetClass:
      text(
        row.assetClass ??
        row.raw?.assetClass,
        "Equity",
      ),

    sector:
      text(
        row.sector ??
        row.raw?.sector,
        "Unclassified",
      ),

    industry:
      text(
        row.industry ??
        row.raw?.industry,
        "Unclassified",
      ),

    strategy:
      text(
        row.strategy ??
        row.raw?.strategy,
        "Unclassified",
      ),

    notes:
      row.notes ??
      row.raw?.notes ??
      "",

    frankingPercent:
      row.frankingPercent ??
      row.franking ??
      row.raw?.frankingPercent ??
      row.raw?.franking,

    frankingCreditAud:
      row.frankingCreditAud ??
      row.raw?.frankingCreditAud,

    withholdingTaxAud:
      row.withholdingTaxAud ??
      row.raw?.withholdingTaxAud,

    ratioNumerator:
      row.ratioNumerator ??
      row.raw?.ratioNumerator,

    ratioDenominator:
      row.ratioDenominator ??
      row.raw?.ratioDenominator,

    splitRatio:
      row.splitRatio ??
      row.raw?.splitRatio,

    createdAt:
      row.createdAt ??
      row.raw?.createdAt,

    updatedAt:
      row.updatedAt ??
      row.raw?.updatedAt,

    raw: Object.freeze({
      ...row.raw,
      ...row,
    }),
  };
}

export function ledgerRowsToRawPortfolioTransactions(
  rows: readonly LedgerRow[],
): RawPortfolioTransaction[] {
  return rows.map(
    (
      row,
      index,
    ) =>
      ledgerRowToRawPortfolioTransaction(
        row,
        index,
      ),
  );
}
