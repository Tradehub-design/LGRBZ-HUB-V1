import type {
  MarketCode,
  PortfolioTransaction,
  TransactionSortKey,
} from "./contracts";

const ASX_PROVIDER_SUFFIX = ".AX";

export function normaliseTicker(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9.^=-]/g, "");
}

export function inferMarket(
  tickerValue: unknown,
  suppliedMarket?: unknown,
  country?: unknown,
): MarketCode {
  const ticker = normaliseTicker(tickerValue);
  const market = String(suppliedMarket ?? "")
    .trim()
    .toUpperCase();

  const countryValue = String(country ?? "")
    .trim()
    .toUpperCase();

  if (
    market === "ASX" ||
    market === "AU" ||
    market === "AUS" ||
    market === "AUSTRALIA" ||
    ticker.endsWith(ASX_PROVIDER_SUFFIX) ||
    countryValue === "AU" ||
    countryValue === "AUS" ||
    countryValue === "AUSTRALIA"
  ) {
    return "ASX";
  }

  if (
    market === "US" ||
    market === "USA" ||
    market === "NASDAQ" ||
    market === "NYSE" ||
    market === "AMEX" ||
    countryValue === "US" ||
    countryValue === "USA" ||
    countryValue === "UNITED STATES" ||
    countryValue === "UNITED STATES OF AMERICA"
  ) {
    return "US";
  }

  return "UNKNOWN";
}

export function displayTickerForMarket(
  tickerValue: unknown,
  market: MarketCode,
): string {
  const ticker = normaliseTicker(tickerValue);

  if (market === "ASX" && ticker.endsWith(ASX_PROVIDER_SUFFIX)) {
    return ticker.slice(0, -ASX_PROVIDER_SUFFIX.length);
  }

  return ticker;
}

export function quoteTickerForMarket(
  tickerValue: unknown,
  market: MarketCode,
): string {
  const ticker = normaliseTicker(tickerValue);

  if (!ticker) {
    return "";
  }

  if (market === "ASX") {
    return ticker.endsWith(ASX_PROVIDER_SUFFIX)
      ? ticker
      : `${ticker}${ASX_PROVIDER_SUFFIX}`;
  }

  return ticker;
}

export function createSecurityId(
  tickerValue: unknown,
  market: MarketCode,
): string {
  const ticker = displayTickerForMarket(tickerValue, market);

  if (!ticker) {
    return "";
  }

  return `${market}:${ticker}`;
}

export function createHoldingId(
  securityId: string,
  accountId: string,
): string {
  return `${normaliseIdentityPart(accountId)}::${normaliseIdentityPart(
    securityId,
  )}`;
}

export function normaliseIdentityPart(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_")
    .replace(/[^A-Z0-9:._-]/g, "");
}

export function createAccountId(
  platform: unknown,
  accountName?: unknown,
): string {
  const safePlatform =
    normaliseIdentityPart(platform) || "UNASSIGNED_PLATFORM";

  const safeAccount =
    normaliseIdentityPart(accountName) || "DEFAULT";

  return `${safePlatform}:${safeAccount}`;
}

export function createStableTransactionId(input: {
  source: unknown;
  sourceRow?: unknown;
  tradeDate: unknown;
  action: unknown;
  ticker?: unknown;
  quantity?: unknown;
  unitPrice?: unknown;
  netAmount?: unknown;
  platform?: unknown;
}): string {
  const parts = [
    input.source,
    input.sourceRow,
    input.tradeDate,
    input.action,
    input.ticker,
    input.quantity,
    input.unitPrice,
    input.netAmount,
    input.platform,
  ].map((part) =>
    String(part ?? "")
      .trim()
      .toUpperCase(),
  );

  const body = parts.join("|");
  const hash = fnv1a32(body);

  return `TX-${hash}`;
}

export function createSnapshotId(
  generatedAt: string,
  transactionIds: readonly string[],
): string {
  const orderedIds = [...transactionIds].sort();
  const hash = fnv1a32(
    `${generatedAt}|${orderedIds.join("|")}`,
  );

  return `SNAPSHOT-${hash}`;
}

function fnv1a32(value: string): string {
  let hash = 0x811c9dc5;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);

    hash =
      Math.imul(hash, 0x01000193) >>> 0;
  }

  return hash.toString(16).padStart(8, "0").toUpperCase();
}

function validDateTimestamp(value: string): number {
  const timestamp = Date.parse(value);

  return Number.isFinite(timestamp)
    ? timestamp
    : Number.MAX_SAFE_INTEGER;
}

export function transactionSortKey(
  transaction: PortfolioTransaction,
): TransactionSortKey {
  return {
    tradeDate: transaction.tradeDate,
    sourceRow:
      typeof transaction.sourceRow === "number"
        ? transaction.sourceRow
        : Number.MAX_SAFE_INTEGER,
    id: transaction.id,
  };
}

export function compareTransactionSortKeys(
  left: TransactionSortKey,
  right: TransactionSortKey,
): number {
  const dateDifference =
    validDateTimestamp(left.tradeDate) -
    validDateTimestamp(right.tradeDate);

  if (dateDifference !== 0) {
    return dateDifference;
  }

  const rowDifference = left.sourceRow - right.sourceRow;

  if (rowDifference !== 0) {
    return rowDifference;
  }

  return left.id.localeCompare(right.id);
}

export function compareTransactions(
  left: PortfolioTransaction,
  right: PortfolioTransaction,
): number {
  return compareTransactionSortKeys(
    transactionSortKey(left),
    transactionSortKey(right),
  );
}

export function sortTransactionsDeterministically(
  transactions: readonly PortfolioTransaction[],
): PortfolioTransaction[] {
  return [...transactions].sort(compareTransactions);
}
