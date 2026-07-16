import type {
  DashboardHoldingRow,
} from "../dashboard/contracts";

import {
  buildPerformanceAttribution,
} from "../dashboard/attribution";

import type {
  AnalyticsHoldingRank,
  AnalyticsPerformanceBucket,
  PortfolioAnalyticsBuildInput,
  PortfolioAnalyticsSnapshot,
} from "./contracts";

import {
  PORTFOLIO_ANALYTICS_SCHEMA_VERSION,
} from "./contracts";

import {
  percentage,
  roundMoney,
  sumFinite,
} from "../money";

function stableAnalyticsSnapshotId(
  dashboardSnapshotId:
    string,
  generatedAt:
    string,
): string {
  const value =
    `${dashboardSnapshotId}|${generatedAt}`;

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

  return `ANALYTICS-${hash
    .toString(16)
    .padStart(8, "0")
    .toUpperCase()}`;
}

function holdingRanks(
  holdings:
    readonly DashboardHoldingRow[],
): AnalyticsHoldingRank[] {
  return [...holdings]
    .sort(
      (left, right) =>
        right.totalReturnAud -
        left.totalReturnAud,
    )
    .map(
      (
        holding,
        index,
      ): AnalyticsHoldingRank => ({
        rank:
          index + 1,

        holdingId:
          holding.holdingId,

        ticker:
          holding.ticker,

        name:
          holding.name,

        sector:
          holding.sector,

        industry:
          holding.industry,

        country:
          holding.country,

        strategy:
          holding.strategy,

        marketValueAud:
          holding.marketValueAud,

        portfolioWeightPercent:
          holding.portfolioWeightPercent,

        realisedGainAud:
          holding.realisedGainAud,

        unrealisedGainAud:
          holding.unrealisedGainAud,

        incomeAud:
          holding.totalIncomeAud,

        totalReturnAud:
          holding.totalReturnAud,

        totalReturnPercent:
          holding.totalReturnPercent,
      }),
    );
}

function performanceBuckets(
  holdings:
    readonly DashboardHoldingRow[],
  field:
    | "sector"
    | "industry"
    | "country"
    | "strategy"
    | "platform",
): AnalyticsPerformanceBucket[] {
  const groups =
    new Map<
      string,
      DashboardHoldingRow[]
    >();

  for (const holding of holdings) {
    const value =
      field === "platform"
        ? holding.quoteProvider ||
          "Unclassified"
        : holding[field] ||
          "Unclassified";

    const existing =
      groups.get(value) ??
      [];

    existing.push(
      holding,
    );

    groups.set(
      value,
      existing,
    );
  }

  return Array.from(
    groups.entries(),
  )
    .map(
      (
        [
          key,
          group,
        ],
      ): AnalyticsPerformanceBucket => {
        const marketValueAud =
          sumFinite(
            group.map(
              (holding) =>
                holding.marketValueAud,
            ),
          );

        const costBaseAud =
          sumFinite(
            group.map(
              (holding) =>
                holding.costBaseAud,
            ),
          );

        const realisedGainAud =
          sumFinite(
            group.map(
              (holding) =>
                holding.realisedGainAud,
            ),
          );

        const unrealisedGainAud =
          sumFinite(
            group.map(
              (holding) =>
                holding.unrealisedGainAud,
            ),
          );

        const incomeAud =
          sumFinite(
            group.map(
              (holding) =>
                holding.totalIncomeAud,
            ),
          );

        const totalReturnAud =
          roundMoney(
            realisedGainAud +
            unrealisedGainAud +
            incomeAud,
          );

        return {
          key,

          label:
            key,

          marketValueAud,

          costBaseAud,

          realisedGainAud,

          unrealisedGainAud,

          incomeAud,

          totalReturnAud,

          totalReturnPercent:
            costBaseAud > 0
              ? percentage(
                  totalReturnAud,
                  costBaseAud,
                  0,
                )
              : null,

          portfolioWeightPercent:
            sumFinite(
              group.map(
                (holding) =>
                  holding.portfolioWeightPercent,
              ),
            ),

          holdingCount:
            group.length,
        };
      },
    )
    .sort(
      (left, right) =>
        right.totalReturnAud -
        left.totalReturnAud,
    );
}

export function buildPortfolioAnalyticsSnapshot(
  input:
    PortfolioAnalyticsBuildInput,
): PortfolioAnalyticsSnapshot {
  const generatedAt =
    input.generatedAt ??
    input.dashboard.generatedAt;

  const attribution =
    buildPerformanceAttribution(
      input.dashboard,
    );

  const holdings =
    holdingRanks(
      input.dashboard.holdings,
    );

  const winners =
    holdings.filter(
      (holding) =>
        holding.totalReturnAud >
        0,
    );

  const losers =
    [...holdings]
      .filter(
        (holding) =>
          holding.totalReturnAud <
          0,
      )
      .sort(
        (left, right) =>
          left.totalReturnAud -
          right.totalReturnAud,
      );

  const positiveContributionAud =
    sumFinite(
      winners.map(
        (holding) =>
          holding.totalReturnAud,
      ),
    );

  const negativeContributionAud =
    sumFinite(
      losers.map(
        (holding) =>
          holding.totalReturnAud,
      ),
    );

  return {
    schemaVersion:
      PORTFOLIO_ANALYTICS_SCHEMA_VERSION,

    analyticsSnapshotId:
      stableAnalyticsSnapshotId(
        input.dashboard
          .dashboardSnapshotId,
        generatedAt,
      ),

    generatedAt,

    dashboardSnapshotId:
      input.dashboard
        .dashboardSnapshotId,

    portfolioSnapshotId:
      input.dashboard
        .portfolioSnapshotId,

    dividendSnapshotId:
      input.dashboard
        .dividendSnapshotId,

    dashboard:
      input.dashboard,

    attribution,

    holdings,

    winners,

    losers,

    contribution: {
      positiveContributionAud,

      negativeContributionAud,

      netContributionAud:
        roundMoney(
          positiveContributionAud +
          negativeContributionAud,
        ),

      positiveHoldingCount:
        winners.length,

      negativeHoldingCount:
        losers.length,

      flatHoldingCount:
        holdings.filter(
          (holding) =>
            holding.totalReturnAud ===
            0,
        ).length,

      topContributor:
        winners[0] ??
        null,

      largestDetractor:
        losers[0] ??
        null,
    },

    allocation: {
      security:
        input.dashboard
          .allocation.security,

      sector:
        input.dashboard
          .allocation.sector,

      industry:
        input.dashboard
          .allocation.industry,

      country:
        input.dashboard
          .allocation.country,

      currency:
        input.dashboard
          .allocation.currency,

      platform:
        input.dashboard
          .allocation.platform,

      strategy:
        input.dashboard
          .allocation.strategy,

      assetClass:
        input.dashboard
          .allocation.assetClass,
    },

    performanceBySector:
      performanceBuckets(
        input.dashboard.holdings,
        "sector",
      ),

    performanceByIndustry:
      performanceBuckets(
        input.dashboard.holdings,
        "industry",
      ),

    performanceByCountry:
      performanceBuckets(
        input.dashboard.holdings,
        "country",
      ),

    performanceByStrategy:
      performanceBuckets(
        input.dashboard.holdings,
        "strategy",
      ),

    performanceByPlatform:
      performanceBuckets(
        input.dashboard.holdings,
        "platform",
      ),

    income: {
      receivedIncomeAud:
        input.dashboard
          .dividendsSummary
          .receivedCurrentFinancialYearAud,

      trailingTwelveMonthIncomeAud:
        input.dashboard
          .dividendsSummary
          .trailingTwelveMonthIncomeAud,

      forwardTwelveMonthIncomeAud:
        input.dashboard
          .dividendsSummary
          .forwardTwelveMonthIncomeAud,

      monthlyForwardIncomeAud:
        input.dashboard
          .dividendsSummary
          .monthlyForwardIncomeAud,

      announcedIncomeAud:
        input.dashboard
          .dividendsSummary
          .announcedForwardIncomeAud,

      forecastIncomeAud:
        input.dashboard
          .dividendsSummary
          .forecastForwardIncomeAud,

      dividendYieldPercent:
        input.dashboard
          .dividendsSummary
          .portfolioDividendYieldPercent,

      yieldOnCostPercent:
        input.dashboard
          .dividendsSummary
          .portfolioYieldOnCostPercent,

      projectedFrankingCreditsAud:
        input.dashboard
          .dividendsSummary
          .projectedFrankingCreditsAud,

      estimatedWithholdingTaxAud:
        input.dashboard
          .dividendsSummary
          .estimatedWithholdingTaxAud,
    },

    totals: {
      portfolioValueAud:
        input.dashboard.totals
          .portfolioValueAud,

      securitiesMarketValueAud:
        input.dashboard.totals
          .securitiesMarketValueAud,

      cashBalanceAud:
        input.dashboard.totals
          .cashBalanceAud,

      openCostBaseAud:
        input.dashboard.totals
          .openCostBaseAud,

      realisedGainAud:
        input.dashboard.totals
          .realisedGainAud,

      unrealisedGainAud:
        input.dashboard.totals
          .unrealisedGainAud,

      totalIncomeAud:
        input.dashboard.totals
          .totalIncomeAud,

      totalReturnAud:
        input.dashboard.totals
          .totalReturnAud,

      totalReturnPercent:
        input.dashboard.totals
          .totalReturnPercent,

      transactionCount:
        input.dashboard.portfolio
          .transactions.length,

      openHoldingCount:
        input.dashboard.holdings
          .length,
    },
  };
}
