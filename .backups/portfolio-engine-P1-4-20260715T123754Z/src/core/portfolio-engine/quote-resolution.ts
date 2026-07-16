import type {
  CurrencyCode,
  PortfolioTransaction,
  QuoteSnapshot,
  SecurityIdentity,
} from "./contracts";

import {
  roundMoney,
} from "./money";

export type ResolvedQuote = QuoteSnapshot & {
  fxRateToAud: number;
};

export type QuoteResolutionInput = {
  security: SecurityIdentity;
  currency: CurrencyCode;
  transactions: readonly PortfolioTransaction[];
  suppliedQuote?: QuoteSnapshot;
  fxRateToAud?: number;
  generatedAt: string;
};

function latestSecurityTrade(
  transactions: readonly PortfolioTransaction[],
  securityId: string,
): PortfolioTransaction | undefined {
  return [...transactions]
    .filter(
      (transaction) =>
        transaction.security?.securityId === securityId &&
        (
          transaction.action === "BUY" ||
          transaction.action === "SELL" ||
          transaction.action === "DIVIDEND_REINVESTMENT" ||
          transaction.action === "TRANSFER_IN"
        ) &&
        transaction.amounts.unitPrice > 0,
    )
    .sort((left, right) => {
      const dateDifference =
        Date.parse(right.tradeDate) -
        Date.parse(left.tradeDate);

      if (dateDifference !== 0) {
        return dateDifference;
      }

      return right.id.localeCompare(left.id);
    })[0];
}

function validPositiveNumber(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value > 0
  );
}

function validFxRate(
  value: unknown,
  currency: CurrencyCode,
): number {
  if (currency === "AUD") {
    return 1;
  }

  return validPositiveNumber(value)
    ? value
    : 0;
}

export function resolveHoldingQuote(
  input: QuoteResolutionInput,
): ResolvedQuote {
  const supplied = input.suppliedQuote;

  const suppliedFxRate =
    validFxRate(
      input.fxRateToAud,
      input.currency,
    );

  if (
    supplied &&
    validPositiveNumber(supplied.price)
  ) {
    return {
      ...supplied,

      price:
        roundMoney(supplied.price),

      previousClose:
        validPositiveNumber(
          supplied.previousClose,
        )
          ? roundMoney(
              supplied.previousClose,
            )
          : null,

      fxRateToAud:
        suppliedFxRate,
    };
  }

  const latestTrade =
    latestSecurityTrade(
      input.transactions,
      input.security.securityId,
    );

  if (
    latestTrade &&
    validPositiveNumber(
      latestTrade.amounts.unitPrice,
    )
  ) {
    return {
      securityId:
        input.security.securityId,

      ticker:
        input.security.ticker,

      quoteTicker:
        input.security.quoteTicker,

      market:
        input.security.market,

      currency:
        latestTrade.currency,

      price:
        roundMoney(
          latestTrade.amounts.unitPrice,
        ),

      previousClose: null,

      source:
        "TRANSACTION_FALLBACK",

      quality:
        "FALLBACK",

      provider:
        "portfolio-transaction-ledger",

      quotedAt:
        `${latestTrade.tradeDate}T00:00:00.000Z`,

      receivedAt:
        input.generatedAt,

      cacheExpiresAt:
        null,

      error:
        "No valid live, cached or previous-close quote was supplied. Latest transaction price was used.",

      fxRateToAud:
        latestTrade.amounts.fxRateToAud,
    };
  }

  return {
    securityId:
      input.security.securityId,

    ticker:
      input.security.ticker,

    quoteTicker:
      input.security.quoteTicker,

    market:
      input.security.market,

    currency:
      input.currency,

    price: 0,

    previousClose: null,

    source:
      "UNAVAILABLE",

    quality:
      "UNAVAILABLE",

    provider:
      "unavailable",

    quotedAt:
      null,

    receivedAt:
      input.generatedAt,

    cacheExpiresAt:
      null,

    error:
      "No quote or transaction-derived price is available.",

    fxRateToAud:
      suppliedFxRate,
  };
}

export function quotePriority(
  quote: QuoteSnapshot,
): number {
  switch (quote.source) {
    case "LIVE":
      return 5;

    case "CACHE":
      return 4;

    case "PREVIOUS_CLOSE":
      return 3;

    case "TRANSACTION_FALLBACK":
      return 2;

    case "UNAVAILABLE":
      return 1;
  }
}

export function selectBestQuote(
  quotes: readonly QuoteSnapshot[],
): QuoteSnapshot | undefined {
  return [...quotes]
    .filter(
      (quote) =>
        Number.isFinite(quote.price) &&
        quote.price > 0,
    )
    .sort(
      (left, right) =>
        quotePriority(right) -
        quotePriority(left),
    )[0];
}
