import type {
  PortfolioDashboardSnapshot,
} from "./contracts";

import {
  roundMoney,
} from "../money";

export type PortfolioHealthRating =
  | "Excellent"
  | "Good"
  | "Moderate"
  | "Weak"
  | "Critical";

export type PortfolioHealthCheck = {
  id: string;
  label: string;
  score: number;
  weight: number;
  weightedScore: number;
  status:
    | "PASS"
    | "WATCH"
    | "RISK";
  detail: string;
};

export type PortfolioHealthRecommendation = {
  id: string;
  title: string;
  detail: string;
  category:
    | "Diversification"
    | "Concentration"
    | "Liquidity"
    | "Pricing"
    | "Data Quality";
  severity:
    | "info"
    | "warning"
    | "critical";
};

export type PortfolioHealthSnapshot = {
  score: number;
  rating: PortfolioHealthRating;

  diversificationScore: number;
  concentrationScore: number;
  liquidityScore: number;
  pricingScore: number;
  dataQualityScore: number;

  riskScore: number;

  largestHoldingPercent: number;
  largestSectorPercent: number;
  largestCountryPercent: number;
  largestPlatformPercent: number;
  topFivePercent: number;
  cashPercent: number;

  holdingCount: number;
  sectorCount: number;
  countryCount: number;

  checks: PortfolioHealthCheck[];
  recommendations: PortfolioHealthRecommendation[];
};

function clamp(
  value: number,
  minimum = 0,
  maximum = 100,
): number {
  if (!Number.isFinite(value)) {
    return minimum;
  }

  return Math.min(
    maximum,
    Math.max(
      minimum,
      value,
    ),
  );
}

function rating(
  score: number,
): PortfolioHealthRating {
  if (score >= 85) {
    return "Excellent";
  }

  if (score >= 70) {
    return "Good";
  }

  if (score >= 55) {
    return "Moderate";
  }

  if (score >= 35) {
    return "Weak";
  }

  return "Critical";
}

function concentrationComponent(
  exposurePercent: number,
  safeLimit: number,
  criticalLimit: number,
): number {
  if (exposurePercent <= safeLimit) {
    return 100;
  }

  if (exposurePercent >= criticalLimit) {
    return 0;
  }

  return clamp(
    100 -
      (
        (
          exposurePercent -
          safeLimit
        ) /
        (
          criticalLimit -
          safeLimit
        )
      ) *
        100,
  );
}

function diversificationScore(
  holdingCount: number,
  sectorCount: number,
  countryCount: number,
): number {
  const holdingScore =
    clamp(
      (
        holdingCount /
        15
      ) *
        100,
    );

  const sectorScore =
    clamp(
      (
        sectorCount /
        8
      ) *
        100,
    );

  const countryScore =
    clamp(
      (
        countryCount /
        3
      ) *
        100,
    );

  return roundMoney(
    holdingScore *
      0.5 +
      sectorScore *
        0.35 +
      countryScore *
        0.15,
    2,
  );
}

function liquidityScore(
  cashPercent: number,
): number {
  if (
    cashPercent >= 2 &&
    cashPercent <= 20
  ) {
    return 100;
  }

  if (cashPercent < 2) {
    return clamp(
      (
        cashPercent /
        2
      ) *
        100,
    );
  }

  return concentrationComponent(
    cashPercent,
    20,
    60,
  );
}

function checkStatus(
  score: number,
): PortfolioHealthCheck["status"] {
  if (score >= 70) {
    return "PASS";
  }

  if (score >= 40) {
    return "WATCH";
  }

  return "RISK";
}

export function buildPortfolioHealth(
  dashboard:
    PortfolioDashboardSnapshot,
): PortfolioHealthSnapshot {
  const totalPortfolioValue =
    dashboard.totals
      .portfolioValueAud;

  const cashPercent =
    totalPortfolioValue > 0
      ? (
          dashboard.totals
            .cashBalanceAud /
          totalPortfolioValue
        ) *
        100
      : 0;

  const diversification =
    diversificationScore(
      dashboard.concentration
        .holdingCount,
      dashboard.concentration
        .sectorCount,
      dashboard.concentration
        .countryCount,
    );

  const holdingConcentration =
    concentrationComponent(
      dashboard.concentration
        .largestHoldingWeightPercent,
      10,
      40,
    );

  const sectorConcentration =
    concentrationComponent(
      dashboard.concentration
        .largestSectorWeightPercent,
      25,
      70,
    );

  const countryConcentration =
    concentrationComponent(
      dashboard.concentration
        .largestCountryWeightPercent,
      70,
      100,
    );

  const platformConcentration =
    concentrationComponent(
      dashboard.concentration
        .largestPlatformWeightPercent,
      60,
      100,
    );

  const topFiveConcentration =
    concentrationComponent(
      dashboard.concentration
        .topFiveWeightPercent,
      50,
      95,
    );

  const concentration =
    roundMoney(
      holdingConcentration *
        0.35 +
      sectorConcentration *
        0.25 +
      topFiveConcentration *
        0.2 +
      countryConcentration *
        0.1 +
      platformConcentration *
        0.1,
      2,
    );

  const liquidity =
    roundMoney(
      liquidityScore(
        cashPercent,
      ),
      2,
    );

  const pricing =
    roundMoney(
      dashboard.pricing
        .pricingCoveragePercent *
        0.75 +
      (
        dashboard.pricing
          .openHoldingCount > 0
          ? (
              (
                dashboard.pricing
                  .liveCount +
                dashboard.pricing
                  .cachedCount +
                dashboard.pricing
                  .previousCloseCount
              ) /
              dashboard.pricing
                .openHoldingCount
            ) *
            100
          : 100
      ) *
        0.25,
      2,
    );

  const reconciliationPenalty =
    Math.min(
      100,
      dashboard.dataQuality
        .reconciliationErrorCount *
        25,
    );

  const warningPenalty =
    Math.min(
      30,
      (
        dashboard.dataQuality
          .portfolioWarningCount +
        dashboard.dataQuality
          .dividendWarningCount
      ) *
        5,
    );

  const dataQuality =
    roundMoney(
      clamp(
        100 -
          reconciliationPenalty -
          warningPenalty,
      ),
      2,
    );

  const checks:
    PortfolioHealthCheck[] = [
      {
        id:
          "diversification",

        label:
          "Diversification",

        score:
          diversification,

        weight:
          25,

        weightedScore:
          diversification *
          0.25,

        status:
          checkStatus(
            diversification,
          ),

        detail:
          `${dashboard.concentration.holdingCount} holdings across ${dashboard.concentration.sectorCount} sectors and ${dashboard.concentration.countryCount} countries.`,
      },

      {
        id:
          "concentration",

        label:
          "Concentration Control",

        score:
          concentration,

        weight:
          30,

        weightedScore:
          concentration *
          0.3,

        status:
          checkStatus(
            concentration,
          ),

        detail:
          `Largest holding ${dashboard.concentration.largestHoldingWeightPercent.toFixed(
            2,
          )}%; top five ${dashboard.concentration.topFiveWeightPercent.toFixed(
            2,
          )}%.`,
      },

      {
        id:
          "liquidity",

        label:
          "Liquidity",

        score:
          liquidity,

        weight:
          15,

        weightedScore:
          liquidity *
          0.15,

        status:
          checkStatus(
            liquidity,
          ),

        detail:
          `Cash represents ${cashPercent.toFixed(
            2,
          )}% of total portfolio value.`,
      },

      {
        id:
          "pricing",

        label:
          "Pricing Reliability",

        score:
          pricing,

        weight:
          20,

        weightedScore:
          pricing *
          0.2,

        status:
          checkStatus(
            pricing,
          ),

        detail:
          `${dashboard.pricing.pricedHoldingCount}/${dashboard.pricing.openHoldingCount} holdings have a resolved valuation price.`,
      },

      {
        id:
          "data-quality",

        label:
          "Data Quality",

        score:
          dataQuality,

        weight:
          10,

        weightedScore:
          dataQuality *
          0.1,

        status:
          checkStatus(
            dataQuality,
          ),

        detail:
          `${dashboard.dataQuality.reconciliationErrorCount} reconciliation errors and ${
            dashboard.dataQuality
              .portfolioWarningCount +
            dashboard.dataQuality
              .dividendWarningCount
          } warnings.`,
      },
    ];

  const score =
    roundMoney(
      checks.reduce(
        (sum, check) =>
          sum +
          check.weightedScore,
        0,
      ),
      2,
    );

  const recommendations:
    PortfolioHealthRecommendation[] = [];

  if (
    dashboard.concentration
      .largestHoldingWeightPercent >
    20
  ) {
    recommendations.push({
      id:
        "largest-holding",

      title:
        "Review single-holding concentration",

      detail:
        `The largest holding represents ${dashboard.concentration.largestHoldingWeightPercent.toFixed(
          2,
        )}% of securities market value.`,

      category:
        "Concentration",

      severity:
        dashboard.concentration
          .largestHoldingWeightPercent >
        35
          ? "critical"
          : "warning",
    });
  }

  if (
    dashboard.concentration
      .largestSectorWeightPercent >
    40
  ) {
    recommendations.push({
      id:
        "largest-sector",

      title:
        "Review sector concentration",

      detail:
        `The largest sector represents ${dashboard.concentration.largestSectorWeightPercent.toFixed(
          2,
        )}% of securities market value.`,

      category:
        "Concentration",

      severity:
        dashboard.concentration
          .largestSectorWeightPercent >
        60
          ? "critical"
          : "warning",
    });
  }

  if (
    dashboard.concentration
      .holdingCount <
    8
  ) {
    recommendations.push({
      id:
        "holding-count",

      title:
        "Portfolio has limited position diversification",

      detail:
        `The Portfolio Engine currently contains ${dashboard.concentration.holdingCount} open holdings.`,

      category:
        "Diversification",

      severity:
        "warning",
    });
  }

  if (
    dashboard.pricing
      .pricingCoveragePercent <
    100
  ) {
    recommendations.push({
      id:
        "pricing-coverage",

      title:
        "Resolve incomplete pricing coverage",

      detail:
        `${dashboard.pricing.unavailableCount} holdings remain unavailable and ${dashboard.pricing.transactionFallbackCount} use transaction fallback pricing.`,

      category:
        "Pricing",

      severity:
        dashboard.pricing
          .pricingCoveragePercent <
        80
          ? "critical"
          : "warning",
    });
  }

  if (
    cashPercent <
    1
  ) {
    recommendations.push({
      id:
        "low-cash",

      title:
        "Portfolio has minimal recorded cash",

      detail:
        `Cash represents ${cashPercent.toFixed(
          2,
        )}% of total portfolio value.`,

      category:
        "Liquidity",

      severity:
        "info",
    });
  }

  if (
    dashboard.dataQuality
      .reconciliationErrorCount >
    0
  ) {
    recommendations.push({
      id:
        "reconciliation",

      title:
        "Correct reconciliation errors",

      detail:
        `${dashboard.dataQuality.reconciliationErrorCount} canonical reconciliation error${
          dashboard.dataQuality
            .reconciliationErrorCount ===
          1
            ? ""
            : "s"
        } remain.`,

      category:
        "Data Quality",

      severity:
        "critical",
    });
  }

  if (
    recommendations.length ===
    0
  ) {
    recommendations.push({
      id:
        "healthy",

      title:
        "No material structural issue detected",

      detail:
        "Current holdings, pricing, concentration and reconciliation measures are within the configured descriptive ranges.",

      category:
        "Data Quality",

      severity:
        "info",
    });
  }

  return {
    score,

    rating:
      rating(score),

    diversificationScore:
      diversification,

    concentrationScore:
      concentration,

    liquidityScore:
      liquidity,

    pricingScore:
      pricing,

    dataQualityScore:
      dataQuality,

    riskScore:
      roundMoney(
        100 -
        score,
        2,
      ),

    largestHoldingPercent:
      dashboard.concentration
        .largestHoldingWeightPercent,

    largestSectorPercent:
      dashboard.concentration
        .largestSectorWeightPercent,

    largestCountryPercent:
      dashboard.concentration
        .largestCountryWeightPercent,

    largestPlatformPercent:
      dashboard.concentration
        .largestPlatformWeightPercent,

    topFivePercent:
      dashboard.concentration
        .topFiveWeightPercent,

    cashPercent:
      roundMoney(
        cashPercent,
        2,
      ),

    holdingCount:
      dashboard.concentration
        .holdingCount,

    sectorCount:
      dashboard.concentration
        .sectorCount,

    countryCount:
      dashboard.concentration
        .countryCount,

    checks,

    recommendations,
  };
}
