/**
 * Raw transaction values accepted by the Portfolio Engine boundary.
 *
 * This contract is intentionally permissive because data may originate from:
 *
 * - the one-time master Excel workbook;
 * - manually entered transactions;
 * - broker synchronisation;
 * - previously persisted application records.
 *
 * No RawPortfolioTransaction is allowed to flow directly into holdings or
 * valuation calculations. It must first pass through normalisation and
 * validation.
 */

export type RawTransactionRecord = Readonly<Record<string, unknown>>;

export type RawPortfolioTransaction = {
  id?: unknown;
  transactionId?: unknown;
  externalId?: unknown;

  source?: unknown;
  sourceRow?: unknown;
  row?: unknown;

  status?: unknown;
  action?: unknown;
  type?: unknown;
  transactionType?: unknown;
  side?: unknown;

  tradeDate?: unknown;
  transactionDate?: unknown;
  date?: unknown;
  settlementDate?: unknown;

  ticker?: unknown;
  symbol?: unknown;
  code?: unknown;
  stock?: unknown;

  market?: unknown;
  exchange?: unknown;
  country?: unknown;

  quoteTicker?: unknown;
  securityId?: unknown;
  isin?: unknown;

  name?: unknown;
  securityName?: unknown;
  companyName?: unknown;
  description?: unknown;

  accountId?: unknown;
  accountName?: unknown;
  account?: unknown;
  portfolio?: unknown;

  platform?: unknown;
  broker?: unknown;
  brokeragePlatform?: unknown;

  currency?: unknown;
  tradeCurrency?: unknown;

  quantity?: unknown;
  units?: unknown;
  shares?: unknown;
  volume?: unknown;

  unitPrice?: unknown;
  price?: unknown;
  sharePrice?: unknown;

  fees?: unknown;
  fee?: unknown;
  brokerage?: unknown;
  commission?: unknown;

  grossAmount?: unknown;
  gross?: unknown;
  consideration?: unknown;

  netAmount?: unknown;
  net?: unknown;
  amount?: unknown;
  total?: unknown;

  fxRateToAud?: unknown;
  fxRate?: unknown;
  exchangeRate?: unknown;

  assetClass?: unknown;
  sector?: unknown;
  industry?: unknown;
  strategy?: unknown;

  frankingPercent?: unknown;
  franking?: unknown;
  frankingCreditAud?: unknown;
  withholdingTaxAud?: unknown;
  tax?: unknown;
  deductibleFeeAud?: unknown;

  ratioNumerator?: unknown;
  ratioDenominator?: unknown;
  splitRatio?: unknown;

  notes?: unknown;
  note?: unknown;
  memo?: unknown;
  tags?: unknown;

  createdAt?: unknown;
  updatedAt?: unknown;

  raw?: RawTransactionRecord;

  [key: string]: unknown;
};

export type RawTransactionFieldMap = {
  id: readonly string[];
  externalId: readonly string[];
  source: readonly string[];
  sourceRow: readonly string[];
  status: readonly string[];
  action: readonly string[];
  tradeDate: readonly string[];
  settlementDate: readonly string[];
  ticker: readonly string[];
  market: readonly string[];
  country: readonly string[];
  quoteTicker: readonly string[];
  securityId: readonly string[];
  isin: readonly string[];
  name: readonly string[];
  accountId: readonly string[];
  accountName: readonly string[];
  platform: readonly string[];
  currency: readonly string[];
  quantity: readonly string[];
  unitPrice: readonly string[];
  fees: readonly string[];
  grossAmount: readonly string[];
  netAmount: readonly string[];
  fxRateToAud: readonly string[];
  assetClass: readonly string[];
  sector: readonly string[];
  industry: readonly string[];
  strategy: readonly string[];
  frankingPercent: readonly string[];
  frankingCreditAud: readonly string[];
  withholdingTaxAud: readonly string[];
  deductibleFeeAud: readonly string[];
  ratioNumerator: readonly string[];
  ratioDenominator: readonly string[];
  notes: readonly string[];
  tags: readonly string[];
  createdAt: readonly string[];
  updatedAt: readonly string[];
};

export const RAW_TRANSACTION_FIELD_MAP: RawTransactionFieldMap = {
  id: [
    "id",
    "transactionId",
    "transaction_id",
    "tradeId",
    "trade_id",
  ],

  externalId: [
    "externalId",
    "external_id",
    "brokerTransactionId",
    "broker_transaction_id",
    "reference",
    "referenceId",
  ],

  source: [
    "source",
    "transactionSource",
    "transaction_source",
  ],

  sourceRow: [
    "sourceRow",
    "source_row",
    "row",
    "rowNumber",
    "row_number",
  ],

  status: [
    "status",
    "transactionStatus",
    "transaction_status",
  ],

  action: [
    "action",
    "type",
    "transactionType",
    "transaction_type",
    "side",
    "activity",
  ],

  tradeDate: [
    "tradeDate",
    "trade_date",
    "transactionDate",
    "transaction_date",
    "date",
    "executedAt",
    "executed_at",
  ],

  settlementDate: [
    "settlementDate",
    "settlement_date",
    "settledAt",
    "settled_at",
  ],

  ticker: [
    "ticker",
    "symbol",
    "code",
    "stock",
    "securityCode",
    "security_code",
    "instrument",
  ],

  market: [
    "market",
    "exchange",
    "listingExchange",
    "listing_exchange",
  ],

  country: [
    "country",
    "domicile",
    "listingCountry",
    "listing_country",
  ],

  quoteTicker: [
    "quoteTicker",
    "quote_ticker",
    "providerTicker",
    "provider_ticker",
  ],

  securityId: [
    "securityId",
    "security_id",
    "instrumentId",
    "instrument_id",
  ],

  isin: [
    "isin",
    "ISIN",
  ],

  name: [
    "name",
    "securityName",
    "security_name",
    "companyName",
    "company_name",
    "description",
  ],

  accountId: [
    "accountId",
    "account_id",
    "portfolioId",
    "portfolio_id",
  ],

  accountName: [
    "accountName",
    "account_name",
    "account",
    "portfolio",
    "portfolioName",
    "portfolio_name",
  ],

  platform: [
    "platform",
    "broker",
    "brokeragePlatform",
    "brokerage_platform",
    "provider",
  ],

  currency: [
    "currency",
    "tradeCurrency",
    "trade_currency",
    "currencyCode",
    "currency_code",
  ],

  quantity: [
    "quantity",
    "units",
    "shares",
    "volume",
    "qty",
  ],

  unitPrice: [
    "unitPrice",
    "unit_price",
    "price",
    "sharePrice",
    "share_price",
    "tradePrice",
    "trade_price",
  ],

  fees: [
    "fees",
    "fee",
    "brokerage",
    "commission",
    "transactionFee",
    "transaction_fee",
  ],

  grossAmount: [
    "grossAmount",
    "gross_amount",
    "gross",
    "consideration",
    "tradeValue",
    "trade_value",
  ],

  netAmount: [
    "netAmount",
    "net_amount",
    "net",
    "amount",
    "total",
    "cashAmount",
    "cash_amount",
  ],

  fxRateToAud: [
    "fxRateToAud",
    "fx_rate_to_aud",
    "fxRate",
    "fx_rate",
    "exchangeRate",
    "exchange_rate",
  ],

  assetClass: [
    "assetClass",
    "asset_class",
    "assetType",
    "asset_type",
  ],

  sector: [
    "sector",
    "gicsSector",
    "gics_sector",
  ],

  industry: [
    "industry",
    "gicsIndustry",
    "gics_industry",
  ],

  strategy: [
    "strategy",
    "investmentStrategy",
    "investment_strategy",
  ],

  frankingPercent: [
    "frankingPercent",
    "franking_percent",
    "franking",
    "frankedPercent",
    "franked_percent",
  ],

  frankingCreditAud: [
    "frankingCreditAud",
    "franking_credit_aud",
    "frankingCredit",
    "franking_credit",
  ],

  withholdingTaxAud: [
    "withholdingTaxAud",
    "withholding_tax_aud",
    "withholdingTax",
    "withholding_tax",
    "tax",
  ],

  deductibleFeeAud: [
    "deductibleFeeAud",
    "deductible_fee_aud",
    "deductibleFee",
    "deductible_fee",
  ],

  ratioNumerator: [
    "ratioNumerator",
    "ratio_numerator",
    "splitNumerator",
    "split_numerator",
  ],

  ratioDenominator: [
    "ratioDenominator",
    "ratio_denominator",
    "splitDenominator",
    "split_denominator",
  ],

  notes: [
    "notes",
    "note",
    "memo",
    "comment",
    "comments",
  ],

  tags: [
    "tags",
    "labels",
  ],

  createdAt: [
    "createdAt",
    "created_at",
  ],

  updatedAt: [
    "updatedAt",
    "updated_at",
  ],
};

export function readRawField(
  record: RawPortfolioTransaction,
  aliases: readonly string[],
): unknown {
  for (const alias of aliases) {
    if (!Object.prototype.hasOwnProperty.call(record, alias)) {
      continue;
    }

    const value = record[alias];

    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value === "string" && value.trim() === "") {
      continue;
    }

    return value;
  }

  return undefined;
}

export function copyRawRecord(
  record: RawPortfolioTransaction,
): RawTransactionRecord {
  const copy: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(record)) {
    if (key === "raw") {
      continue;
    }

    copy[key] = value;
  }

  if (record.raw) {
    for (const [key, value] of Object.entries(record.raw)) {
      if (!(key in copy)) {
        copy[key] = value;
      }
    }
  }

  return Object.freeze(copy);
}
