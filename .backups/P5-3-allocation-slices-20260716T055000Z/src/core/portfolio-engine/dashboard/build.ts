import type {
  AllocationDimension,
  PortfolioAllocation,
  PortfolioSnapshot,
  PortfolioHolding,
  QuoteSource,
  ValidationIssue,
} from "../contracts";


type PortfolioAllocationSlice =
  PortfolioAllocation[
    keyof PortfolioAllocation
  ][number];


import type {
  DashboardAllocationRow,
  DashboardConcentrationSummary,
  DashboardDataQuality,
  DashboardHoldingRow,
  DashboardPerformanceSummary,
  DashboardPricingSummary,
  PortfolioDashboardBuildInput,
  PortfolioDashboardSnapshot,
} from "./contracts";

import {
  PORTFOLIO_DASHBOARD_SCHEMA_VERSION,
} from "./contracts";

import {
  approximatelyEqual,
  percentage,
  roundMoney,
  sumFinite,
} from "../money";

import {
  reconcilePortfolioMarketData,
} from "../client/market-data-reconciliation";

import {
  reconcileApplicationHoldings,
} from "../client/holdings-reconciliation";

import {
  reconcilePortfolioDividends,
} from "../dividends/reconcile";


type NumericRecord =
  Record<string, unknown>;

function finiteNumber(
  value: unknown,
): number | null {
  const parsed =
    typeof value === "number"
      ? value
      : Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function recordValue(
  value: unknown,
  key: string,
): unknown {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return undefined;
  }

  return (
    value as NumericRecord
  )[key];
}

function firstFiniteRecordValue(
  value: unknown,
  keys: readonly string[],
): number | null {
  for (const key of keys) {
    const parsed =
      finiteNumber(
        recordValue(
          value,
          key,
        ),
      );

    if (parsed !== null) {
      return parsed;
    }
  }

  return null;
}

/**
 * Older PortfolioTotals contracts do not expose disposed cost base directly.
 * The canonical holdings still retain the disposed cost base for every closed
 * or partially disposed position, so the dashboard derives it from holdings.
 */
function portfolioDisposedCostBaseAud(
  portfolio: PortfolioSnapshot,
): number {
  const direct =
    firstFiniteRecordValue(
      portfolio.totals,
      [
        "disposedCostBaseAud",
      ],
    );

  if (direct !== null) {
    return roundMoney(direct);
  }

  return sumFinite(
    portfolio.holdings.map(
      (holding) =>
        firstFiniteRecordValue(
          holding,
          [
            "disposedCostBaseAud",
          ],
        ) ?? 0,
    ),
  );
}

/**
 * Sale proceeds are derived from canonical holding replay output when the
 * installed PortfolioTotals version does not expose a portfolio-level field.
 */
function portfolioRealisedProceedsAud(
  portfolio: PortfolioSnapshot,
): number {
  const direct =
    firstFiniteRecordValue(
      portfolio.totals,
      [
        "realisedProceedsAud",
        "realizedProceedsAud",
      ],
    );

  if (direct !== null) {
    return roundMoney(direct);
  }

  return sumFinite(
    portfolio.holdings.map(
      (holding) =>
        firstFiniteRecordValue(
          holding,
          [
            "realisedProceedsAud",
            "realizedProceedsAud",
          ],
        ) ?? 0,
    ),
  );
}

/**
 * Support both current and earlier Portfolio Snapshot cash contracts.
 *
 * No synthetic cash value is introduced. The function checks canonical totals,
 * the canonical cash summary, and canonical cash-balance rows.
 */
function portfolioCashBalanceAud(
  portfolio: PortfolioSnapshot,
): number {
  const totalsValue =
    firstFiniteRecordValue(
      portfolio.totals,
      [
        "cashBalanceAud",
        "cashAud",
        "cashValueAud",
      ],
    );

  if (totalsValue !== null) {
    return roundMoney(
      totalsValue,
    );
  }

  const portfolioRecord =
    portfolio as unknown as
      NumericRecord;

  const cash =
    portfolioRecord.cash;

  const cashSummaryValue =
    firstFiniteRecordValue(
      cash,
      [
        "totalAud",
        "balanceAud",
        "cashBalanceAud",
        "valueAud",
      ],
    );

  if (cashSummaryValue !== null) {
    return roundMoney(
      cashSummaryValue,
    );
  }

  const possibleBalanceRows = [
    portfolioRecord.cashBalances,
    recordValue(
      cash,
      "balances",
    ),
    recordValue(
      cash,
      "accounts",
    ),
  ];

  for (
    const candidate of
    possibleBalanceRows
  ) {
    if (!Array.isArray(candidate)) {
      continue;
    }

    return sumFinite(
      candidate.map(
        (row) =>
          firstFiniteRecordValue(
            row,
            [
              "balanceAud",
              "cashBalanceAud",
              "marketValueAud",
              "valueAud",
              "amountAud",
            ],
          ) ?? 0,
      ),
    );
  }

  return 0;
}

function transactionCashAmountAud(
  transaction:
    PortfolioSnapshot["transactions"][number],
): number {
  const amountRecord =
    transaction.amounts as unknown as
      NumericRecord;

  const value =
    firstFiniteRecordValue(
      amountRecord,
      [
        "netAmountAud",
        "grossAmountAud",
        "netAmount",
        "grossAmount",
      ],
    );

  if (value === null) {
    return 0;
  }

  const fxRate =
    firstFiniteRecordValue(
      amountRecord,
      [
        "fxRateToAud",
      ],
    ) ??
    firstFiniteRecordValue(
      transaction,
      [
        "fxRateToAud",
      ],
    ) ??
    1;

  return roundMoney(
    value *
    fxRate,
  );
}

/**
 * Net contributions are deposits and inbound transfers less withdrawals and
 * outbound transfers. Only posted canonical transactions are included.
 */
function portfolioNetContributionsAud(
  portfolio: PortfolioSnapshot,
): number {
  const direct =
    firstFiniteRecordValue(
      portfolio.totals,
      [
        "netContributionsAud",
        "netContributionAud",
      ],
    );

  if (direct !== null) {
    return roundMoney(
      direct,
    );
  }

  return roundMoney(
    portfolio.transactions
      .filter(
        (transaction) =>
          transaction.status ===
          "posted",
      )
      .reduce(
        (
          total,
          transaction,
        ) => {
          const amount =
            transactionCashAmountAud(
              transaction,
            );

          switch (
            transaction.action
          ) {
            case "DEPOSIT":
            case "TRANSFER_IN":
              return total +
                amount;

            case "WITHDRAWAL":
            case "TRANSFER_OUT":
              return total -
                amount;

            default:
              return total;
          }
        },
        0,
      ),
  );
}

function stableDashboardSnapshotId(
  portfolioSnapshotId: string,
  dividendSnapshotId: string,
  generatedAt: string,
): string {
  const value = [
    portfolioSnapshotId,
    dividendSnapshotId,
    generatedAt,
  ].join("|");

  let hash =
    0x811c9dc5;

  for (
    let index = 0;
    index < value.length;
    index += 1
  ) {
    hash ^=
      value.charCodeAt(index);

    hash =
      Math.imul(
        hash,
        0x01000193,
      ) >>> 0;
  }

  return `DASHBOARD-${hash
    .toString(16)
    .padStart(8, "0")
    .toUpperCase()}`;
}

function holdingRow(
  holding: PortfolioHolding,
): DashboardHoldingRow {
  return {
    holdingId:
      holding.holdingId,

    securityId:
      holding.security.securityId,

    ticker:
      holding.security.ticker,

    name:
      holding.security.name,

    market:
      holding.security.market,

    sector:
      holding.classification.sector,

    industry:
      holding.classification.industry,

    country:
      holding.classification.country,

    strategy:
      holding.classification.strategy,

    quantity:
      holding.quantity,

    averageCostAud:
      holding.averageCostAud,

    costBaseAud:
      holding.costBaseAud,

    marketPriceAud:
      holding.valuation.marketPriceAud,

    marketValueAud:
      holding.valuation.marketValueAud,

    realisedGainAud:
      holding.realisedGainAud,

    unrealisedGainAud:
      holding.valuation.unrealisedGainAud,

    unrealisedGainPercent:
      holding.valuation.unrealisedGainPercent,

    totalIncomeAud:
      holding.totalIncomeAud,

    totalReturnAud:
      holding.totalReturnAud,

    totalReturnPercent:
      holding.totalReturnPercent,

    portfolioWeightPercent:
      holding.portfolioWeightPercent,

    quoteSource:
      holding.valuation.quoteSource,

    quoteProvider:
      holding.valuation.quoteProvider,

    quotedAt:
      holding.valuation.quotedAt,
  };
}

function allocationRows(
  dimension: AllocationDimension,
  slices: readonly PortfolioAllocationSlice[],
): DashboardAllocationRow[] {
  return slices.map(
    (slice) => ({
      dimension,

      key:
        slice.key,

      label:
        slice.label,

      marketValueAud:
        slice.marketValueAud,

      costBaseAud:
        slice.costBaseAud,

      unrealisedGainAud:
        slice.unrealisedGainAud,

      realisedGainAud:
        slice.realisedGainAud,

      weightPercent:
        slice.weightPercent,

      holdingCount:
        slice.holdingCount,
    }),
  );
}

function quoteSourceCount(
  holdings: readonly PortfolioHolding[],
  source: QuoteSource,
): number {
  return holdings.filter(
    (holding) =>
      holding.valuation.quoteSource ===
      source,
  ).length;
}

function buildPricingSummary(
  input: PortfolioDashboardBuildInput,
): DashboardPricingSummary {
  const openHoldings =
    input.portfolio.openHoldings;

  const pricedHoldingCount =
    openHoldings.filter(
      (holding) =>
        holding.valuation.marketPriceAud > 0 &&
        holding.valuation.quoteSource !==
          "UNAVAILABLE",
    ).length;

  const retainedCount =
    openHoldings.filter(
      (holding) =>
        holding.valuation.quoteSource ===
          "CACHE" &&
        holding.valuation.quoteProvider.includes(
          "LAST_KNOWN_VALID",
        ),
    ).length;

  return {
    openHoldingCount:
      openHoldings.length,

    pricedHoldingCount,

    liveCount:
      quoteSourceCount(
        openHoldings,
        "LIVE",
      ),

    cachedCount:
      quoteSourceCount(
        openHoldings,
        "CACHE",
      ),

    previousCloseCount:
      quoteSourceCount(
        openHoldings,
        "PREVIOUS_CLOSE",
      ),

    transactionFallbackCount:
      quoteSourceCount(
        openHoldings,
        "TRANSACTION_FALLBACK",
      ),

    unavailableCount:
      quoteSourceCount(
        openHoldings,
        "UNAVAILABLE",
      ),

    retainedCount,

    pricingCoveragePercent:
      openHoldings.length > 0
        ? (
            pricedHoldingCount /
            openHoldings.length
          ) *
          100
        : 100,
  };
}

function bestAndWorstHoldings(
  holdings: readonly DashboardHoldingRow[],
): {
  best: DashboardHoldingRow | null;
  worst: DashboardHoldingRow | null;
} {
  const eligible =
    holdings.filter(
      (holding) =>
        holding.totalReturnPercent !== null &&
        Number.isFinite(
          holding.totalReturnPercent,
        ),
    );

  const sorted =
    [...eligible].sort(
      (left, right) =>
        (
          right.totalReturnPercent ??
          0
        ) -
        (
          left.totalReturnPercent ??
          0
        ),
    );

  return {
    best:
      sorted[0] ??
      null,

    worst:
      sorted.length > 0
        ? sorted[
            sorted.length - 1
          ]
        : null,
  };
}

function buildPerformanceSummary(
  input: PortfolioDashboardBuildInput,
  holdings: readonly DashboardHoldingRow[],
): DashboardPerformanceSummary {
  const bestWorst =
    bestAndWorstHoldings(
      holdings,
    );

  return {
    realisedGainAud:
      input.portfolio.totals.realisedGainAud,

    unrealisedGainAud:
      input.portfolio.totals.unrealisedGainAud,

    totalIncomeAud:
      input.portfolio.totals.totalIncomeAud,

    totalReturnAud:
      input.portfolio.totals.totalReturnAud,

    totalReturnPercent:
      input.portfolio.totals.totalReturnPercent,

    openCostBaseAud:
      input.portfolio.totals.openCostBaseAud,

    disposedCostBaseAud:
      portfolioDisposedCostBaseAud(
      input.portfolio,
    ),

    realisedProceedsAud:
      portfolioRealisedProceedsAud(
      input.portfolio,
    ),

    profitableHoldingCount:
      holdings.filter(
        (holding) =>
          holding.totalReturnAud > 0,
      ).length,

    losingHoldingCount:
      holdings.filter(
        (holding) =>
          holding.totalReturnAud < 0,
      ).length,

    flatHoldingCount:
      holdings.filter(
        (holding) =>
          holding.totalReturnAud === 0,
      ).length,

    bestHolding:
      bestWorst.best,

    worstHolding:
      bestWorst.worst,
  };
}

function maximumWeight(
  rows: readonly DashboardAllocationRow[],
): number {
  return (
    [...rows]
      .sort(
        (left, right) =>
          right.weightPercent -
          left.weightPercent,
      )[0]
      ?.weightPercent ??
    0
  );
}

function buildConcentrationSummary(
  holdings: readonly DashboardHoldingRow[],
  sector:
    readonly DashboardAllocationRow[],
  country:
    readonly DashboardAllocationRow[],
  platform:
    readonly DashboardAllocationRow[],
): DashboardConcentrationSummary {
  const sortedHoldings =
    [...holdings].sort(
      (left, right) =>
        right.portfolioWeightPercent -
        left.portfolioWeightPercent,
    );

  return {
    largestHoldingWeightPercent:
      sortedHoldings[0]
        ?.portfolioWeightPercent ??
      0,

    topFiveWeightPercent:
      roundMoney(
        sortedHoldings
          .slice(0, 5)
          .reduce(
            (sum, holding) =>
              sum +
              holding.portfolioWeightPercent,
            0,
          ),
        4,
      ),

    largestSectorWeightPercent:
      maximumWeight(sector),

    largestCountryWeightPercent:
      maximumWeight(country),

    largestPlatformWeightPercent:
      maximumWeight(platform),

    holdingCount:
      holdings.length,

    sectorCount:
      sector.length,

    countryCount:
      country.length,

    platformCount:
      platform.length,
  };
}

function crossEngineIssues(
  input: PortfolioDashboardBuildInput,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (
    input.dividends.portfolioSnapshotId !==
    input.portfolio.snapshotId
  ) {
    issues.push({
      code:
        "INCONSISTENT_AMOUNT",

      severity:
        "error",

      message:
        "Dashboard dividend data does not reference the active Portfolio Snapshot.",

      field:
        "dividends.portfolioSnapshotId",

      suppliedValue: {
        portfolio:
          input.portfolio.snapshotId,

        dividends:
          input.dividends.portfolioSnapshotId,
      },
    });
  }

  if (
    !approximatelyEqual(
      input.dividends.totals
        .securitiesMarketValueAud,
      input.portfolio.totals
        .securitiesMarketValueAud,
      0.02,
    )
  ) {
    issues.push({
      code:
        "INCONSISTENT_AMOUNT",

      severity:
        "error",

      message:
        "Dividend market value does not match the Portfolio Engine market value.",

      field:
        "dividends.totals.securitiesMarketValueAud",

      suppliedValue: {
        portfolio:
          input.portfolio.totals
            .securitiesMarketValueAud,

        dividends:
          input.dividends.totals
            .securitiesMarketValueAud,
      },
    });
  }

  if (
    !approximatelyEqual(
      input.dividends.totals
        .openCostBaseAud,
      input.portfolio.totals
        .openCostBaseAud,
      0.02,
    )
  ) {
    issues.push({
      code:
        "INCONSISTENT_AMOUNT",

      severity:
        "error",

      message:
        "Dividend cost base does not match the Portfolio Engine open cost base.",

      field:
        "dividends.totals.openCostBaseAud",

      suppliedValue: {
        portfolio:
          input.portfolio.totals
            .openCostBaseAud,

        dividends:
          input.dividends.totals
            .openCostBaseAud,
      },
    });
  }

  return issues;
}

function buildDataQuality(
  input: PortfolioDashboardBuildInput,
  additionalIssues: readonly ValidationIssue[],
): DashboardDataQuality {
  const marketReconciliation =
    reconcilePortfolioMarketData(
      input.portfolio,
    );

  const holdingsReconciliation =
    reconcileApplicationHoldings(
      input.portfolio,
    );

  const dividendReconciliation =
    reconcilePortfolioDividends(
      input.dividends,
    );

  const issues = [
    ...input.portfolio.dataQuality.issues,

    ...marketReconciliation.issues,

    ...holdingsReconciliation.issues,

    ...dividendReconciliation.issues,

    ...additionalIssues,

    ...(input.additionalIssues ?? []),
  ];

  const uniqueIssues =
    Array.from(
      new Map(
        issues.map(
          (issue) => [
            [
              issue.code,
              issue.severity,
              issue.field,
              issue.message,
            ].join("::"),

            issue,
          ],
        ),
      ).values(),
    );

  const reconciliationErrorCount =
    uniqueIssues.filter(
      (issue) =>
        issue.severity === "error",
    ).length;

  let status:
    DashboardDataQuality["status"];

  if (
    input.portfolio.openHoldings.length ===
    0
  ) {
    status =
      "EMPTY";
  } else if (
    reconciliationErrorCount > 0 ||
    input.portfolio.dataQuality.errorCount >
      0 ||
    input.dividends.dataQuality.errors.length >
      0
  ) {
    status =
      "ERROR";
  } else if (
    input.portfolio.dataQuality.warningCount >
      0 ||
    input.dividends.dataQuality.warnings.length >
      0 ||
    input.dividends.dataQuality
      .retainedResponseUsed ||
    input.portfolio.dataQuality
      .fallbackQuoteCount >
      0
  ) {
    status =
      "DEGRADED";
  } else {
    status =
      "READY";
  }

  return {
    status,

    portfolioErrorCount:
      input.portfolio.dataQuality.errorCount,

    portfolioWarningCount:
      input.portfolio.dataQuality.warningCount,

    dividendErrorCount:
      input.dividends.dataQuality.errors.length,

    dividendWarningCount:
      input.dividends.dataQuality.warnings.length,

    reconciliationErrorCount,

    issues:
      uniqueIssues,

    retainedMarketQuotesUsed:
      input.portfolio.openHoldings.some(
        (holding) =>
          holding.valuation.quoteProvider.includes(
            "LAST_KNOWN_VALID",
          ),
      ),

    retainedDividendResponseUsed:
      input.dividends.dataQuality
        .retainedResponseUsed,

    unresolvedDividendSymbols:
      [...input.dividends.unresolvedSymbols],
  };
}

export function buildPortfolioDashboardSnapshot(
  input: PortfolioDashboardBuildInput,
): PortfolioDashboardSnapshot {
  const generatedAt =
    input.generatedAt ??
    new Date().toISOString();

  const holdings =
    input.portfolio.openHoldings
      .map(holdingRow)
      .sort(
        (left, right) =>
          right.marketValueAud -
          left.marketValueAud,
      );

  const security =
    allocationRows(
      "security",
      input.portfolio.allocation.security,
    );

  const assetClass =
    allocationRows(
      "assetClass",
      input.portfolio.allocation.assetClass,
    );

  const sector =
    allocationRows(
      "sector",
      input.portfolio.allocation.sector,
    );

  const industry =
    allocationRows(
      "industry",
      input.portfolio.allocation.industry,
    );

  const country =
    allocationRows(
      "country",
      input.portfolio.allocation.country,
    );

  const currency =
    allocationRows(
      "currency",
      input.portfolio.allocation.currency,
    );

  const platform =
    allocationRows(
      "platform",
      input.portfolio.allocation.platform,
    );

  const account =
    allocationRows(
      "account",
      input.portfolio.allocation.account,
    );

  const strategy =
    allocationRows(
      "strategy",
      input.portfolio.allocation.strategy,
    );

  const performance =
    buildPerformanceSummary(
      input,
      holdings,
    );

  const pricing =
    buildPricingSummary(
      input,
    );

  const concentration =
    buildConcentrationSummary(
      holdings,
      sector,
      country,
      platform,
    );

  const additionalIssues =
    crossEngineIssues(
      input,
    );

  const dataQuality =
    buildDataQuality(
      input,
      additionalIssues,
    );

  return {
    schemaVersion:
      PORTFOLIO_DASHBOARD_SCHEMA_VERSION,

    dashboardSnapshotId:
      stableDashboardSnapshotId(
        input.portfolio.snapshotId,
        input.dividends.snapshotId,
        generatedAt,
      ),

    generatedAt,

    portfolioSnapshotId:
      input.portfolio.snapshotId,

    dividendSnapshotId:
      input.dividends.snapshotId,

    portfolio:
      input.portfolio,

    dividends:
      input.dividends,

    totals: {
      securitiesMarketValueAud:
        input.portfolio.totals
          .securitiesMarketValueAud,

      cashBalanceAud:
        portfolioCashBalanceAud(
          input.portfolio,
        ),

      portfolioValueAud:
        input.portfolio.totals
          .portfolioValueAud,

      openCostBaseAud:
        input.portfolio.totals
          .openCostBaseAud,

      realisedGainAud:
        input.portfolio.totals
          .realisedGainAud,

      unrealisedGainAud:
        input.portfolio.totals
          .unrealisedGainAud,

      totalIncomeAud:
        input.portfolio.totals
          .totalIncomeAud,

      totalReturnAud:
        input.portfolio.totals
          .totalReturnAud,

      totalReturnPercent:
        input.portfolio.totals
          .totalReturnPercent,

      netContributionsAud:
        portfolioNetContributionsAud(
          input.portfolio,
        ),
    },

    holdings,

    topHoldings:
      holdings.slice(0, 10),

    allocation: {
      security,
      assetClass,
      sector,
      industry,
      country,
      currency,
      platform,
      account,
      strategy,
    },

    performance,

    dividendsSummary: {
      trailingTwelveMonthIncomeAud:
        input.dividends.totals
          .trailingTwelveMonthIncomeAud,

      forwardTwelveMonthIncomeAud:
        input.dividends.totals
          .forwardTwelveMonthIncomeAud,

      announcedForwardIncomeAud:
        input.dividends.totals
          .announcedForwardIncomeAud,

      forecastForwardIncomeAud:
        input.dividends.totals
          .forecastForwardIncomeAud,

      receivedCurrentFinancialYearAud:
        input.dividends.totals
          .receivedCurrentFinancialYearAud,

      monthlyForwardIncomeAud:
        input.dividends.totals
          .monthlyForwardIncomeAud,

      portfolioDividendYieldPercent:
        input.dividends.totals
          .portfolioDividendYieldPercent,

      portfolioYieldOnCostPercent:
        input.dividends.totals
          .portfolioYieldOnCostPercent,

      projectedFrankingCreditsAud:
        input.dividends.totals
          .projectedFrankingCreditsAud,

      estimatedWithholdingTaxAud:
        input.dividends.totals
          .estimatedWithholdingTaxAud,

      estimatedTaxAud:
        input.dividends.totals
          .estimatedTaxAud,

      nextDividendEvent:
        input.dividends.nextEvent,

      upcomingEventCount:
        input.dividends.totals
          .upcomingEventCount,

      receivedEventCount:
        input.dividends.totals
          .receivedEventCount,

      incomeHoldingCount:
        input.dividends.totals
          .incomeHoldingCount,
    },

    pricing,

    concentration,

    dataQuality,
  };
}
