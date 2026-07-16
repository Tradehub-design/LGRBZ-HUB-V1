import type {
  PortfolioHolding,
  PortfolioSnapshot,
  QuoteSnapshot,
} from "../contracts";

export type PricingSourceSummary = {
  live: number;
  cached: number;
  previousClose: number;
  transactionFallback: number;
  unavailable: number;
  total: number;
};

export function selectLiveQuotes(
  snapshot: PortfolioSnapshot,
): Record<string, QuoteSnapshot> {
  return snapshot.quotes;
}

export function selectHoldingQuote(
  snapshot: PortfolioSnapshot,
  securityId: string,
): QuoteSnapshot | null {
  return (
    snapshot.quotes[
      securityId
    ] ??
    null
  );
}

export function selectLivePricedHoldings(
  snapshot: PortfolioSnapshot,
): PortfolioHolding[] {
  return snapshot.openHoldings.filter(
    (holding) =>
      holding.valuation.quoteSource ===
      "LIVE",
  );
}

export function selectCachedPricedHoldings(
  snapshot: PortfolioSnapshot,
): PortfolioHolding[] {
  return snapshot.openHoldings.filter(
    (holding) =>
      holding.valuation.quoteSource ===
      "CACHE",
  );
}

export function selectPreviousCloseHoldings(
  snapshot: PortfolioSnapshot,
): PortfolioHolding[] {
  return snapshot.openHoldings.filter(
    (holding) =>
      holding.valuation.quoteSource ===
      "PREVIOUS_CLOSE",
  );
}

export function selectTransactionFallbackHoldings(
  snapshot: PortfolioSnapshot,
): PortfolioHolding[] {
  return snapshot.openHoldings.filter(
    (holding) =>
      holding.valuation.quoteSource ===
      "TRANSACTION_FALLBACK",
  );
}

export function selectUnpricedHoldings(
  snapshot: PortfolioSnapshot,
): PortfolioHolding[] {
  return snapshot.openHoldings.filter(
    (holding) =>
      holding.valuation.quoteSource ===
        "UNAVAILABLE" ||
      holding.valuation.marketPriceLocal <= 0,
  );
}

export function selectPricingCoveragePercent(
  snapshot: PortfolioSnapshot,
): number {
  const openCount =
    snapshot.openHoldings.length;

  if (openCount === 0) {
    return 100;
  }

  const pricedCount =
    snapshot.openHoldings.filter(
      (holding) =>
        holding.valuation
          .marketPriceLocal > 0 &&
        holding.valuation
          .quoteSource !==
          "UNAVAILABLE",
    ).length;

  return (
    pricedCount /
    openCount
  ) * 100;
}

export function selectQuoteSourceCounts(
  snapshot: PortfolioSnapshot,
): Record<string, number> {
  return snapshot.openHoldings.reduce<
    Record<string, number>
  >(
    (
      counts,
      holding,
    ) => {
      const source =
        holding.valuation.quoteSource;

      counts[source] =
        (
          counts[source] ??
          0
        ) +
        1;

      return counts;
    },
    {},
  );
}

export function selectPricingSourceSummary(
  snapshot: PortfolioSnapshot,
): PricingSourceSummary {
  const counts =
    selectQuoteSourceCounts(
      snapshot,
    );

  return {
    live:
      counts.LIVE ?? 0,

    cached:
      counts.CACHE ?? 0,

    previousClose:
      counts.PREVIOUS_CLOSE ?? 0,

    transactionFallback:
      counts.TRANSACTION_FALLBACK ??
      0,

    unavailable:
      counts.UNAVAILABLE ?? 0,

    total:
      snapshot.openHoldings.length,
  };
}

export function selectProviderFailureProtectedHoldings(
  snapshot: PortfolioSnapshot,
): PortfolioHolding[] {
  return snapshot.openHoldings.filter(
    (holding) =>
      holding.valuation.quoteSource ===
        "CACHE" &&
      holding.valuation.quoteQuality ===
        "STALE" &&
      holding.valuation.quoteProvider.includes(
        "LAST_KNOWN_VALID",
      ),
  );
}
