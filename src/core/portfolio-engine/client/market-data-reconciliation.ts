import type {
  PortfolioHolding,
  PortfolioSnapshot,
  QuoteSnapshot,
  ValidationIssue,
} from "../contracts";

import {
  approximatelyEqual,
  multiplyMoney,
  roundMoney,
  sumFinite,
} from "../money";

export type MarketDataReconciliationResult = {
  valid: boolean;

  issues: ValidationIssue[];

  openHoldingCount: number;
  pricedHoldingCount: number;
  unavailableHoldingCount: number;

  liveHoldingCount: number;
  cachedHoldingCount: number;
  previousCloseHoldingCount: number;
  transactionFallbackHoldingCount: number;
  retainedHoldingCount: number;

  holdingMarketValueAud: number;
  portfolioMarketValueAud: number;

  holdingWeightPercent: number;
  pricingCoveragePercent: number;
};

function reconciliationIssue(input: {
  severity?: ValidationIssue["severity"];
  message: string;
  field: string;
  suppliedValue?: unknown;
}): ValidationIssue {
  return {
    code: "INCONSISTENT_AMOUNT",

    severity:
      input.severity ??
      "error",

    message:
      input.message,

    field:
      input.field,

    suppliedValue:
      input.suppliedValue,
  };
}

function isPositiveFinite(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value > 0
  );
}

function isUnavailable(
  holding: PortfolioHolding,
): boolean {
  return (
    holding.valuation.quoteSource ===
      "UNAVAILABLE" ||
    !isPositiveFinite(
      holding.valuation.marketPriceLocal,
    ) ||
    !isPositiveFinite(
      holding.valuation.marketPriceAud,
    )
  );
}

function quoteForHolding(
  snapshot: PortfolioSnapshot,
  holding: PortfolioHolding,
): QuoteSnapshot | null {
  return (
    snapshot.quotes[
      holding.security.securityId
    ] ??
    null
  );
}

function validateUnavailableHolding(
  holding: PortfolioHolding,
  quote: QuoteSnapshot | null,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (
    holding.valuation.marketValueAud !== 0
  ) {
    issues.push(
      reconciliationIssue({
        message:
          `${holding.security.ticker} is unavailable but has a non-zero market value.`,

        field:
          "holding.valuation.marketValueAud",

        suppliedValue: {
          securityId:
            holding.security.securityId,

          marketValueAud:
            holding.valuation.marketValueAud,

          quoteSource:
            holding.valuation.quoteSource,
        },
      }),
    );
  }

  if (
    quote &&
    quote.source !== "UNAVAILABLE" &&
    quote.price > 0
  ) {
    issues.push(
      reconciliationIssue({
        message:
          `${holding.security.ticker} has a valid quote record but is marked unavailable in holding valuation.`,

        field:
          "holding.valuation.quoteSource",

        suppliedValue: {
          quote,
          valuation:
            holding.valuation,
        },
      }),
    );
  }

  return issues;
}

function validatePricedHolding(
  holding: PortfolioHolding,
  quote: QuoteSnapshot | null,
  tolerance: number,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const expectedLocalMarketValue =
    multiplyMoney(
      holding.quantity,
      holding.valuation.marketPriceLocal,
    );

  const expectedAudPrice =
    multiplyMoney(
      holding.valuation.marketPriceLocal,
      holding.valuation.fxRateToAud,
    );

  const expectedAudMarketValue =
    multiplyMoney(
      holding.quantity,
      expectedAudPrice,
    );

  if (
    !approximatelyEqual(
      holding.valuation.marketValueLocal,
      expectedLocalMarketValue,
      tolerance,
    )
  ) {
    issues.push(
      reconciliationIssue({
        message:
          `${holding.security.ticker} local market value does not equal quantity multiplied by local market price.`,

        field:
          "holding.valuation.marketValueLocal",

        suppliedValue: {
          quantity:
            holding.quantity,

          marketPriceLocal:
            holding.valuation.marketPriceLocal,

          expected:
            expectedLocalMarketValue,

          actual:
            holding.valuation.marketValueLocal,
        },
      }),
    );
  }

  if (
    !approximatelyEqual(
      holding.valuation.marketPriceAud,
      expectedAudPrice,
      tolerance,
    )
  ) {
    issues.push(
      reconciliationIssue({
        message:
          `${holding.security.ticker} AUD market price does not equal local price multiplied by FX rate.`,

        field:
          "holding.valuation.marketPriceAud",

        suppliedValue: {
          marketPriceLocal:
            holding.valuation.marketPriceLocal,

          fxRateToAud:
            holding.valuation.fxRateToAud,

          expected:
            expectedAudPrice,

          actual:
            holding.valuation.marketPriceAud,
        },
      }),
    );
  }

  if (
    !approximatelyEqual(
      holding.valuation.marketValueAud,
      expectedAudMarketValue,
      tolerance,
    )
  ) {
    issues.push(
      reconciliationIssue({
        message:
          `${holding.security.ticker} AUD market value does not equal quantity multiplied by AUD market price.`,

        field:
          "holding.valuation.marketValueAud",

        suppliedValue: {
          quantity:
            holding.quantity,

          marketPriceAud:
            holding.valuation.marketPriceAud,

          expected:
            expectedAudMarketValue,

          actual:
            holding.valuation.marketValueAud,
        },
      }),
    );
  }

  if (!quote) {
    if (
      holding.valuation.quoteSource !==
      "TRANSACTION_FALLBACK"
    ) {
      issues.push(
        reconciliationIssue({
          message:
            `${holding.security.ticker} has priced valuation metadata but no matching canonical quote record.`,

          field:
            "snapshot.quotes",

          suppliedValue: {
            securityId:
              holding.security.securityId,

            quoteSource:
              holding.valuation.quoteSource,
          },
        }),
      );
    }

    return issues;
  }

  if (
    quote.source !==
    holding.valuation.quoteSource
  ) {
    issues.push(
      reconciliationIssue({
        message:
          `${holding.security.ticker} quote source differs between the quote record and holding valuation.`,

        field:
          "holding.valuation.quoteSource",

        suppliedValue: {
          quoteSource:
            quote.source,

          holdingSource:
            holding.valuation.quoteSource,
        },
      }),
    );
  }

  if (
    quote.quality !==
    holding.valuation.quoteQuality
  ) {
    issues.push(
      reconciliationIssue({
        severity:
          "warning",

        message:
          `${holding.security.ticker} quote quality differs between the quote record and holding valuation.`,

        field:
          "holding.valuation.quoteQuality",

        suppliedValue: {
          quoteQuality:
            quote.quality,

          holdingQuality:
            holding.valuation.quoteQuality,
        },
      }),
    );
  }

  if (
    !approximatelyEqual(
      quote.price,
      holding.valuation.marketPriceLocal,
      tolerance,
    )
  ) {
    issues.push(
      reconciliationIssue({
        message:
          `${holding.security.ticker} canonical quote price differs from holding local market price.`,

        field:
          "holding.valuation.marketPriceLocal",

        suppliedValue: {
          quotePrice:
            quote.price,

          holdingPrice:
            holding.valuation.marketPriceLocal,
        },
      }),
    );
  }

  if (
    quote.price <= 0 ||
    !Number.isFinite(quote.price)
  ) {
    issues.push(
      reconciliationIssue({
        message:
          `${holding.security.ticker} contains an invalid canonical quote price.`,

        field:
          "snapshot.quotes.price",

        suppliedValue:
          quote.price,
      }),
    );
  }

  return issues;
}

export function reconcilePortfolioMarketData(
  snapshot: PortfolioSnapshot,
  tolerance = 0.02,
): MarketDataReconciliationResult {
  const issues: ValidationIssue[] = [];

  let pricedHoldingCount = 0;
  let unavailableHoldingCount = 0;

  let liveHoldingCount = 0;
  let cachedHoldingCount = 0;
  let previousCloseHoldingCount = 0;
  let transactionFallbackHoldingCount = 0;
  let retainedHoldingCount = 0;

  for (const holding of snapshot.openHoldings) {
    const quote =
      quoteForHolding(
        snapshot,
        holding,
      );

    if (isUnavailable(holding)) {
      unavailableHoldingCount += 1;

      issues.push(
        ...validateUnavailableHolding(
          holding,
          quote,
        ),
      );

      continue;
    }

    pricedHoldingCount += 1;

    switch (
      holding.valuation.quoteSource
    ) {
      case "LIVE":
        liveHoldingCount += 1;
        break;

      case "CACHE":
        cachedHoldingCount += 1;

        if (
          holding.valuation.quoteProvider.includes(
            "LAST_KNOWN_VALID",
          )
        ) {
          retainedHoldingCount += 1;
        }

        break;

      case "PREVIOUS_CLOSE":
        previousCloseHoldingCount += 1;
        break;

      case "TRANSACTION_FALLBACK":
        transactionFallbackHoldingCount += 1;
        break;

      case "UNAVAILABLE":
        unavailableHoldingCount += 1;
        break;
    }

    issues.push(
      ...validatePricedHolding(
        holding,
        quote,
        tolerance,
      ),
    );
  }

  const holdingMarketValueAud =
    sumFinite(
      snapshot.openHoldings.map(
        (holding) =>
          holding.valuation.marketValueAud,
      ),
    );

  if (
    !approximatelyEqual(
      holdingMarketValueAud,
      snapshot.totals.securitiesMarketValueAud,
      tolerance,
    )
  ) {
    issues.push(
      reconciliationIssue({
        message:
          "Open holding market values do not reconcile with total securities market value.",

        field:
          "totals.securitiesMarketValueAud",

        suppliedValue: {
          holdings:
            holdingMarketValueAud,

          totals:
            snapshot.totals.securitiesMarketValueAud,
        },
      }),
    );
  }

  const holdingWeightPercent =
    roundMoney(
      snapshot.openHoldings.reduce(
        (sum, holding) =>
          sum +
          holding.portfolioWeightPercent,
        0,
      ),
      4,
    );

  if (
    snapshot.openHoldings.length > 0 &&
    snapshot.totals.securitiesMarketValueAud > 0 &&
    !approximatelyEqual(
      holdingWeightPercent,
      100,
      0.02,
    )
  ) {
    issues.push(
      reconciliationIssue({
        message:
          "Open holding weights do not reconcile to 100%.",

        field:
          "holding.portfolioWeightPercent",

        suppliedValue:
          holdingWeightPercent,
      }),
    );
  }

  const pricingCoveragePercent =
    snapshot.openHoldings.length > 0
      ? (
          pricedHoldingCount /
          snapshot.openHoldings.length
        ) * 100
      : 100;

  const expectedFallbackCount =
    snapshot.openHoldings.filter(
      (holding) =>
        holding.valuation.quoteSource ===
        "TRANSACTION_FALLBACK",
    ).length;

  if (
    snapshot.dataQuality
      .fallbackQuoteCount !==
    expectedFallbackCount
  ) {
    issues.push(
      reconciliationIssue({
        message:
          "Portfolio data-quality fallback quote count does not match holding quote sources.",

        field:
          "dataQuality.fallbackQuoteCount",

        suppliedValue: {
          dataQuality:
            snapshot.dataQuality
              .fallbackQuoteCount,

          holdings:
            expectedFallbackCount,
        },
      }),
    );
  }

  const expectedUnavailableCount =
    snapshot.openHoldings.filter(
      (holding) =>
        holding.valuation.quoteSource ===
        "UNAVAILABLE",
    ).length;

  if (
    snapshot.dataQuality
      .missingQuoteCount !==
    expectedUnavailableCount
  ) {
    issues.push(
      reconciliationIssue({
        message:
          "Portfolio data-quality missing quote count does not match unavailable holdings.",

        field:
          "dataQuality.missingQuoteCount",

        suppliedValue: {
          dataQuality:
            snapshot.dataQuality
              .missingQuoteCount,

          holdings:
            expectedUnavailableCount,
        },
      }),
    );
  }

  return {
    valid:
      !issues.some(
        (entry) =>
          entry.severity ===
          "error",
      ),

    issues,

    openHoldingCount:
      snapshot.openHoldings.length,

    pricedHoldingCount,

    unavailableHoldingCount,

    liveHoldingCount,

    cachedHoldingCount,

    previousCloseHoldingCount,

    transactionFallbackHoldingCount,

    retainedHoldingCount,

    holdingMarketValueAud,

    portfolioMarketValueAud:
      snapshot.totals.securitiesMarketValueAud,

    holdingWeightPercent,

    pricingCoveragePercent,
  };
}

export function assertPortfolioMarketDataReconciles(
  snapshot: PortfolioSnapshot,
  tolerance = 0.02,
): void {
  const reconciliation =
    reconcilePortfolioMarketData(
      snapshot,
      tolerance,
    );

  if (reconciliation.valid) {
    return;
  }

  const messages =
    reconciliation.issues
      .filter(
        (issue) =>
          issue.severity ===
          "error",
      )
      .map(
        (issue) =>
          `- ${issue.message}`,
      )
      .join("\n");

  throw new Error(
    `Portfolio market-data reconciliation failed:\n${messages}`,
  );
}
