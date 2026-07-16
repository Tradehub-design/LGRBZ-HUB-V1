import type {
  ValidationIssue,
} from "../contracts";

import type {
  PortfolioDashboardSnapshot,
} from "./contracts";

import {
  approximatelyEqual,
  sumFinite,
} from "../money";

export type PortfolioDashboardReconciliation = {
  valid: boolean;

  issues: ValidationIssue[];

  holdingsMarketValueAud: number;
  dashboardMarketValueAud: number;

  holdingsCostBaseAud: number;
  dashboardCostBaseAud: number;

  holdingsUnrealisedGainAud: number;
  dashboardUnrealisedGainAud: number;

  holdingsRealisedGainAud: number;
  dashboardRealisedGainAud: number;

  securityAllocationMarketValueAud: number;
  sectorAllocationMarketValueAud: number;
  countryAllocationMarketValueAud: number;
  platformAllocationMarketValueAud: number;

  securityWeightPercent: number;
  sectorWeightPercent: number;

  dividendMarketValueAud: number;
  dividendCostBaseAud: number;
};

function issue(
  message: string,
  field: string,
  suppliedValue: unknown,
): ValidationIssue {
  return {
    code:
      "INCONSISTENT_AMOUNT",

    severity:
      "error",

    message,

    field,

    suppliedValue,
  };
}

export function reconcilePortfolioDashboard(
  dashboard: PortfolioDashboardSnapshot,
  tolerance = 0.02,
): PortfolioDashboardReconciliation {
  const issues: ValidationIssue[] = [];

  const holdingsMarketValueAud =
    sumFinite(
      dashboard.holdings.map(
        (holding) =>
          holding.marketValueAud,
      ),
    );

  const holdingsCostBaseAud =
    sumFinite(
      dashboard.holdings.map(
        (holding) =>
          holding.costBaseAud,
      ),
    );

  const holdingsUnrealisedGainAud =
    sumFinite(
      dashboard.holdings.map(
        (holding) =>
          holding.unrealisedGainAud,
      ),
    );

  const holdingsRealisedGainAud =
    sumFinite(
      dashboard.portfolio.holdings.map(
        (holding) =>
          holding.realisedGainAud,
      ),
    );

  const securityAllocationMarketValueAud =
    sumFinite(
      dashboard.allocation.security.map(
        (row) =>
          row.marketValueAud,
      ),
    );

  const sectorAllocationMarketValueAud =
    sumFinite(
      dashboard.allocation.sector.map(
        (row) =>
          row.marketValueAud,
      ),
    );

  const countryAllocationMarketValueAud =
    sumFinite(
      dashboard.allocation.country.map(
        (row) =>
          row.marketValueAud,
      ),
    );

  const platformAllocationMarketValueAud =
    sumFinite(
      dashboard.allocation.platform.map(
        (row) =>
          row.marketValueAud,
      ),
    );

  const securityWeightPercent =
    sumFinite(
      dashboard.allocation.security.map(
        (row) =>
          row.weightPercent,
      ),
    );

  const sectorWeightPercent =
    sumFinite(
      dashboard.allocation.sector.map(
        (row) =>
          row.weightPercent,
      ),
    );

  if (
    !approximatelyEqual(
      holdingsMarketValueAud,
      dashboard.totals
        .securitiesMarketValueAud,
      tolerance,
    )
  ) {
    issues.push(
      issue(
        "Dashboard holding market value does not match dashboard portfolio market value.",
        "totals.securitiesMarketValueAud",
        {
          holdings:
            holdingsMarketValueAud,

          dashboard:
            dashboard.totals
              .securitiesMarketValueAud,
        },
      ),
    );
  }

  if (
    !approximatelyEqual(
      holdingsCostBaseAud,
      dashboard.totals
        .openCostBaseAud,
      tolerance,
    )
  ) {
    issues.push(
      issue(
        "Dashboard holding cost base does not match dashboard open cost base.",
        "totals.openCostBaseAud",
        {
          holdings:
            holdingsCostBaseAud,

          dashboard:
            dashboard.totals
              .openCostBaseAud,
        },
      ),
    );
  }

  if (
    !approximatelyEqual(
      holdingsUnrealisedGainAud,
      dashboard.totals
        .unrealisedGainAud,
      tolerance,
    )
  ) {
    issues.push(
      issue(
        "Dashboard holding unrealised gain does not match dashboard unrealised gain.",
        "totals.unrealisedGainAud",
        {
          holdings:
            holdingsUnrealisedGainAud,

          dashboard:
            dashboard.totals
              .unrealisedGainAud,
        },
      ),
    );
  }

  if (
    !approximatelyEqual(
      holdingsRealisedGainAud,
      dashboard.totals
        .realisedGainAud,
      tolerance,
    )
  ) {
    issues.push(
      issue(
        "Dashboard realised gain does not match canonical holding realised gain.",
        "totals.realisedGainAud",
        {
          holdings:
            holdingsRealisedGainAud,

          dashboard:
            dashboard.totals
              .realisedGainAud,
        },
      ),
    );
  }

  for (
    const [
      dimension,
      value,
    ] of [
      [
        "security",
        securityAllocationMarketValueAud,
      ],
      [
        "sector",
        sectorAllocationMarketValueAud,
      ],
      [
        "country",
        countryAllocationMarketValueAud,
      ],
      [
        "platform",
        platformAllocationMarketValueAud,
      ],
    ] as const
  ) {
    if (
      !approximatelyEqual(
        value,
        dashboard.totals
          .securitiesMarketValueAud,
        tolerance,
      )
    ) {
      issues.push(
        issue(
          `${dimension} allocation does not match dashboard securities market value.`,
          `allocation.${dimension}`,
          {
            allocation:
              value,

            dashboard:
              dashboard.totals
                .securitiesMarketValueAud,
          },
        ),
      );
    }
  }

  if (
    dashboard.holdings.length > 0 &&
    dashboard.totals
      .securitiesMarketValueAud >
      0 &&
    !approximatelyEqual(
      securityWeightPercent,
      100,
      0.02,
    )
  ) {
    issues.push(
      issue(
        "Dashboard security allocation weights do not total 100%.",
        "allocation.security.weightPercent",
        securityWeightPercent,
      ),
    );
  }

  if (
    dashboard.allocation.sector.length >
      0 &&
    dashboard.totals
      .securitiesMarketValueAud >
      0 &&
    !approximatelyEqual(
      sectorWeightPercent,
      100,
      0.02,
    )
  ) {
    issues.push(
      issue(
        "Dashboard sector allocation weights do not total 100%.",
        "allocation.sector.weightPercent",
        sectorWeightPercent,
      ),
    );
  }

  if (
    !approximatelyEqual(
      dashboard.dividendsSummary
        .forwardTwelveMonthIncomeAud,
      dashboard.dividends.totals
        .forwardTwelveMonthIncomeAud,
      tolerance,
    )
  ) {
    issues.push(
      issue(
        "Dashboard dividend income does not match the canonical Dividend Snapshot.",
        "dividendsSummary.forwardTwelveMonthIncomeAud",
        {
          dashboard:
            dashboard.dividendsSummary
              .forwardTwelveMonthIncomeAud,

          dividends:
            dashboard.dividends.totals
              .forwardTwelveMonthIncomeAud,
        },
      ),
    );
  }

  if (
    !approximatelyEqual(
      dashboard.dividends.totals
        .securitiesMarketValueAud,
      dashboard.totals
        .securitiesMarketValueAud,
      tolerance,
    )
  ) {
    issues.push(
      issue(
        "Dashboard and Dividend Snapshot market values do not match.",
        "dividends.totals.securitiesMarketValueAud",
        {
          dashboard:
            dashboard.totals
              .securitiesMarketValueAud,

          dividends:
            dashboard.dividends.totals
              .securitiesMarketValueAud,
        },
      ),
    );
  }

  if (
    !approximatelyEqual(
      dashboard.dividends.totals
        .openCostBaseAud,
      dashboard.totals
        .openCostBaseAud,
      tolerance,
    )
  ) {
    issues.push(
      issue(
        "Dashboard and Dividend Snapshot cost bases do not match.",
        "dividends.totals.openCostBaseAud",
        {
          dashboard:
            dashboard.totals
              .openCostBaseAud,

          dividends:
            dashboard.dividends.totals
              .openCostBaseAud,
        },
      ),
    );
  }

  return {
    valid:
      issues.length === 0,

    issues,

    holdingsMarketValueAud,

    dashboardMarketValueAud:
      dashboard.totals
        .securitiesMarketValueAud,

    holdingsCostBaseAud,

    dashboardCostBaseAud:
      dashboard.totals
        .openCostBaseAud,

    holdingsUnrealisedGainAud,

    dashboardUnrealisedGainAud:
      dashboard.totals
        .unrealisedGainAud,

    holdingsRealisedGainAud,

    dashboardRealisedGainAud:
      dashboard.totals
        .realisedGainAud,

    securityAllocationMarketValueAud,

    sectorAllocationMarketValueAud,

    countryAllocationMarketValueAud,

    platformAllocationMarketValueAud,

    securityWeightPercent,

    sectorWeightPercent,

    dividendMarketValueAud:
      dashboard.dividends.totals
        .securitiesMarketValueAud,

    dividendCostBaseAud:
      dashboard.dividends.totals
        .openCostBaseAud,
  };
}

export function assertPortfolioDashboardReconciles(
  dashboard: PortfolioDashboardSnapshot,
  tolerance = 0.02,
): void {
  const reconciliation =
    reconcilePortfolioDashboard(
      dashboard,
      tolerance,
    );

  if (reconciliation.valid) {
    return;
  }

  throw new Error(
    [
      "Portfolio dashboard reconciliation failed:",
      ...reconciliation.issues.map(
        (entry) =>
          `- ${entry.message}`,
      ),
    ].join("\n"),
  );
}
