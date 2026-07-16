import {
  PORTFOLIO_ENGINE_SCHEMA_VERSION,
  type CurrencyCode,
  type PortfolioDataQuality,
  type PortfolioEngineBuildInput,
  type PortfolioHolding,
  type PortfolioSnapshot,
  type PortfolioTotals,
  type QuoteSnapshot,
  type ValidationIssue,
} from "./contracts";

import {
  createSnapshotId,
} from "./identity";

import {
  addMoney,
  percentage,
  roundMoney,
  sumFinite,
} from "./money";

import {
  replayPortfolioTransactions,
} from "./replay";

import {
  buildPortfolioAllocation,
} from "./allocation";

import {
  resolveHoldingQuote,
} from "./quote-resolution";

import type {
  PortfolioReplayResult,
  ReplayPositionResult,
} from "./replay-contracts";

function lastKnownFxRate(
  currency: CurrencyCode,
  transactions:
    PortfolioEngineBuildInput["transactions"],
  suppliedFxRates:
    PortfolioEngineBuildInput["fxRatesToAud"],
): number {
  if (currency === "AUD") {
    return 1;
  }

  const supplied =
    suppliedFxRates?.[currency];

  if (
    typeof supplied === "number" &&
    Number.isFinite(supplied) &&
    supplied > 0
  ) {
    return supplied;
  }

  const latestTransaction =
    [...transactions]
      .filter(
        (transaction) =>
          transaction.currency === currency &&
          transaction.amounts.fxRateToAud > 0,
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

  return (
    latestTransaction?.amounts.fxRateToAud ??
    0
  );
}

function suppliedQuoteForSecurity(
  quotes:
    PortfolioEngineBuildInput["quotes"],
  securityId: string,
): QuoteSnapshot | undefined {
  if (!quotes) {
    return undefined;
  }

  return quotes[securityId];
}

function positionToHolding(
  position: ReplayPositionResult,
  replay: PortfolioReplayResult,
  input: PortfolioEngineBuildInput,
  generatedAt: string,
): PortfolioHolding {
  const fxRateToAud =
    lastKnownFxRate(
      position.currency,
      input.transactions,
      input.fxRatesToAud,
    );

  const quote =
    resolveHoldingQuote({
      security:
        position.security,

      currency:
        position.currency,

      transactions:
        input.transactions,

      suppliedQuote:
        suppliedQuoteForSecurity(
          input.quotes,
          position.security.securityId,
        ),

      fxRateToAud,

      generatedAt,
    });

  const marketPriceLocal =
    quote.price;

  const resolvedFxRate =
    quote.fxRateToAud;

  const marketPriceAud =
    roundMoney(
      marketPriceLocal *
      resolvedFxRate,
    );

  const marketValueLocal =
    roundMoney(
      position.quantity *
      marketPriceLocal,
    );

  const marketValueAud =
    roundMoney(
      marketValueLocal *
      resolvedFxRate,
    );

  const unrealisedGainAud =
    roundMoney(
      marketValueAud -
      position.costBaseAud,
    );

  const unrealisedGainPercent =
    percentage(
      unrealisedGainAud,
      position.costBaseAud,
      0,
    );

  const totalReturnAud =
    sumFinite([
      position.realisedGainAud,
      unrealisedGainAud,
      position.totalIncomeAud,
    ]);

  const totalInvestedAud =
    roundMoney(
      position.costBaseAud +
      position.disposedCostBaseAud,
    );

  const totalReturnPercent =
    percentage(
      totalReturnAud,
      totalInvestedAud,
      0,
    );

  return {
    holdingId:
      position.holdingId,

    security:
      position.security,

    account:
      position.account,

    classification:
      position.classification,

    currency:
      position.currency,

    status:
      position.quantity > 0
        ? "OPEN"
        : "CLOSED",

    quantity:
      position.quantity,

    averageCostAud:
      position.averageCostAud,

    costBaseAud:
      position.costBaseAud,

    realisedGainAud:
      position.realisedGainAud,

    realisedProceedsAud:
      position.realisedProceedsAud,

    disposedCostBaseAud:
      position.disposedCostBaseAud,

    valuation: {
      marketPriceLocal,

      marketPriceAud,

      marketValueLocal,

      marketValueAud,

      fxRateToAud:
        resolvedFxRate,

      unrealisedGainAud,

      unrealisedGainPercent,

      quoteSource:
        quote.source,

      quoteQuality:
        quote.quality,

      quoteProvider:
        quote.provider,

      quotedAt:
        quote.quotedAt,
    },

    totalIncomeAud:
      position.totalIncomeAud,

    totalReturnAud,

    totalReturnPercent,

    portfolioWeightPercent: 0,

    firstTransactionAt:
      position.firstTransactionAt,

    lastTransactionAt:
      position.lastTransactionAt,

    lots:
      position.lots,
  };
}

function buildTotals(
  holdings: readonly PortfolioHolding[],
  replay: PortfolioReplayResult,
  transactionCount: number,
): PortfolioTotals {
  const openHoldings =
    holdings.filter(
      (holding) =>
        holding.status === "OPEN",
    );

  const closedHoldings =
    holdings.filter(
      (holding) =>
        holding.status === "CLOSED",
    );

  const securitiesMarketValueAud =
    sumFinite(
      openHoldings.map(
        (holding) =>
          holding.valuation.marketValueAud,
      ),
    );

  const openCostBaseAud =
    sumFinite(
      openHoldings.map(
        (holding) =>
          holding.costBaseAud,
      ),
    );

  const realisedGainAud =
    sumFinite(
      holdings.map(
        (holding) =>
          holding.realisedGainAud,
      ),
    );

  const unrealisedGainAud =
    sumFinite(
      openHoldings.map(
        (holding) =>
          holding.valuation.unrealisedGainAud,
      ),
    );

  const totalIncomeAud =
    sumFinite([
      replay.cash.dividendsReceivedAud,
      replay.cash.interestReceivedAud,
    ]);

  const totalReturnAud =
    sumFinite([
      realisedGainAud,
      unrealisedGainAud,
      totalIncomeAud,
    ]);

  const investedCapitalAud =
    sumFinite(
      holdings.map(
        (holding) =>
          holding.costBaseAud +
          holding.disposedCostBaseAud,
      ),
    );

  return {
    securitiesMarketValueAud,

    cashAud:
      replay.cash.cashAud,

    portfolioValueAud:
      addMoney(
        securitiesMarketValueAud,
        replay.cash.cashAud,
      ),

    openCostBaseAud,

    realisedGainAud,

    unrealisedGainAud,

    dividendsReceivedAud:
      replay.cash.dividendsReceivedAud,

    interestReceivedAud:
      replay.cash.interestReceivedAud,

    feesPaidAud:
      replay.cash.feesPaidAud,

    taxPaidAud:
      replay.cash.taxPaidAud,

    totalIncomeAud,

    totalReturnAud,

    totalReturnPercent:
      percentage(
        totalReturnAud,
        investedCapitalAud,
        0,
      ),

    openPositionCount:
      openHoldings.length,

    closedPositionCount:
      closedHoldings.length,

    transactionCount,
  };
}

function applyPortfolioWeights(
  holdings: readonly PortfolioHolding[],
  securitiesMarketValueAud: number,
): PortfolioHolding[] {
  return holdings.map(
    (holding): PortfolioHolding => ({
      ...holding,

      portfolioWeightPercent:
        holding.status === "OPEN"
          ? percentage(
              holding.valuation.marketValueAud,
              securitiesMarketValueAud,
              0,
            )
          : 0,
    }),
  );
}

function buildQuoteRecord(
  holdings: readonly PortfolioHolding[],
  inputQuotes:
    PortfolioEngineBuildInput["quotes"],
  transactions:
    PortfolioEngineBuildInput["transactions"],
  fxRates:
    PortfolioEngineBuildInput["fxRatesToAud"],
  generatedAt: string,
): Record<string, QuoteSnapshot> {
  const result:
    Record<string, QuoteSnapshot> = {};

  for (const holding of holdings) {
    const resolved =
      resolveHoldingQuote({
        security:
          holding.security,

        currency:
          holding.currency,

        transactions,

        suppliedQuote:
          inputQuotes?.[
            holding.security.securityId
          ],

        fxRateToAud:
          lastKnownFxRate(
            holding.currency,
            transactions,
            fxRates,
          ),

        generatedAt,
      });

    const {
      fxRateToAud: _fxRateToAud,
      ...quote
    } = resolved;

    result[
      holding.security.securityId
    ] = quote;
  }

  return result;
}

function buildDataQuality(
  replay: PortfolioReplayResult,
  holdings: readonly PortfolioHolding[],
  acceptedTransactionCount: number,
): PortfolioDataQuality {
  const quoteIssues: ValidationIssue[] = [];

  for (const holding of holdings) {
    if (
      holding.status !== "OPEN"
    ) {
      continue;
    }

    if (
      holding.valuation.quoteSource ===
      "UNAVAILABLE"
    ) {
      quoteIssues.push({
        code: "INVALID_PRICE",
        severity: "error",
        message:
          `No valid valuation price is available for ${holding.security.ticker}.`,
        field: "valuation.marketPriceLocal",
        suppliedValue:
          holding.valuation.marketPriceLocal,
      });
    }

    if (
      holding.valuation.quoteSource ===
      "TRANSACTION_FALLBACK"
    ) {
      quoteIssues.push({
        code: "INVALID_PRICE",
        severity: "warning",
        message:
          `${holding.security.ticker} is using its latest transaction price until market data is available.`,
        field: "valuation.quoteSource",
        suppliedValue:
          holding.valuation.quoteSource,
      });
    }
  }

  const issues = [
    ...replay.issues,
    ...quoteIssues,
  ];

  const errorCount =
    issues.filter(
      (issue) =>
        issue.severity === "error",
    ).length;

  const warningCount =
    issues.filter(
      (issue) =>
        issue.severity === "warning",
    ).length;

  return {
    isValid:
      errorCount === 0,

    errorCount,

    warningCount,

    missingQuoteCount:
      holdings.filter(
        (holding) =>
          holding.status === "OPEN" &&
          holding.valuation.quoteSource ===
            "UNAVAILABLE",
      ).length,

    fallbackQuoteCount:
      holdings.filter(
        (holding) =>
          holding.status === "OPEN" &&
          holding.valuation.quoteSource ===
            "TRANSACTION_FALLBACK",
      ).length,

    staleQuoteCount:
      holdings.filter(
        (holding) =>
          holding.status === "OPEN" &&
          holding.valuation.quoteQuality ===
            "STALE",
      ).length,

    rejectedTransactionCount:
      replay.rejectedCount,

    acceptedTransactionCount,

    issues,
  };
}

export function buildPortfolioSnapshot(
  input: PortfolioEngineBuildInput,
): PortfolioSnapshot {
  const generatedAt =
    input.generatedAt ??
    new Date().toISOString();

  const costBasisMethod =
    input.costBasisMethod ??
    "AVERAGE";

  const replay =
    replayPortfolioTransactions(
      input.transactions,
      {
        costBasisMethod,
      },
    );

  const initialHoldings =
    replay.positions.map(
      (position) =>
        positionToHolding(
          position,
          replay,
          input,
          generatedAt,
        ),
    );

  const initialTotals =
    buildTotals(
      initialHoldings,
      replay,
      replay.processedCount,
    );

  const holdings =
    applyPortfolioWeights(
      initialHoldings,
      initialTotals.securitiesMarketValueAud,
    );

  const totals =
    buildTotals(
      holdings,
      replay,
      replay.processedCount,
    );

  const openHoldings =
    holdings.filter(
      (holding) =>
        holding.status === "OPEN",
    );

  const closedHoldings =
    holdings.filter(
      (holding) =>
        holding.status === "CLOSED",
    );

  const allocation =
    buildPortfolioAllocation(
      openHoldings,
      totals.securitiesMarketValueAud,
    );

  const quotes =
    buildQuoteRecord(
      holdings,
      input.quotes,
      input.transactions,
      input.fxRatesToAud,
      generatedAt,
    );

  const snapshotId =
    createSnapshotId(
      generatedAt,
      replay.processedTransactions.map(
        (transaction) =>
          transaction.id,
      ),
    );

  return {
    schemaVersion:
      PORTFOLIO_ENGINE_SCHEMA_VERSION,

    snapshotId,

    generatedAt,

    ledgerGeneratedAt:
      generatedAt,

    baseCurrency:
      "AUD",

    costBasisMethod,

    transactions:
      replay.processedTransactions,

    holdings,

    openHoldings,

    closedHoldings,

    disposals:
      replay.disposals,

    cash:
      replay.cash,

    totals,

    allocation,

    quotes,

    dataQuality:
      buildDataQuality(
        replay,
        holdings,
        replay.processedCount,
      ),
  };
}
