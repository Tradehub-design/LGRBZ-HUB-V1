import type {
  AllocationDimension,
  PortfolioSnapshot,
  ValidationIssue,
} from "./contracts";

import {
  approximatelyEqual,
  roundMoney,
  sumFinite,
} from "./money";

export type PortfolioReconciliationResult = {
  valid: boolean;
  issues: ValidationIssue[];

  holdingMarketValueAud: number;
  snapshotMarketValueAud: number;

  holdingCostBaseAud: number;
  snapshotCostBaseAud: number;

  holdingRealisedGainAud: number;
  snapshotRealisedGainAud: number;

  holdingUnrealisedGainAud: number;
  snapshotUnrealisedGainAud: number;

  holdingWeightPercent: number;
};

function reconciliationIssue(
  message: string,
  field: string,
  suppliedValue: unknown,
): ValidationIssue {
  return {
    code: "INCONSISTENT_AMOUNT",
    severity: "error",
    message,
    field,
    suppliedValue,
  };
}

export function reconcilePortfolioSnapshot(
  snapshot: PortfolioSnapshot,
  tolerance = 0.02,
): PortfolioReconciliationResult {
  const issues: ValidationIssue[] = [];

  const holdingMarketValueAud =
    sumFinite(
      snapshot.openHoldings.map(
        (holding) =>
          holding.valuation.marketValueAud,
      ),
    );

  const holdingCostBaseAud =
    sumFinite(
      snapshot.openHoldings.map(
        (holding) =>
          holding.costBaseAud,
      ),
    );

  const holdingRealisedGainAud =
    sumFinite(
      snapshot.holdings.map(
        (holding) =>
          holding.realisedGainAud,
      ),
    );

  const holdingUnrealisedGainAud =
    sumFinite(
      snapshot.openHoldings.map(
        (holding) =>
          holding.valuation.unrealisedGainAud,
      ),
    );

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
    !approximatelyEqual(
      holdingMarketValueAud,
      snapshot.totals.securitiesMarketValueAud,
      tolerance,
    )
  ) {
    issues.push(
      reconciliationIssue(
        "Holdings market value does not reconcile with portfolio totals.",
        "totals.securitiesMarketValueAud",
        {
          holdings:
            holdingMarketValueAud,
          totals:
            snapshot.totals.securitiesMarketValueAud,
        },
      ),
    );
  }

  if (
    !approximatelyEqual(
      holdingCostBaseAud,
      snapshot.totals.openCostBaseAud,
      tolerance,
    )
  ) {
    issues.push(
      reconciliationIssue(
        "Holdings cost base does not reconcile with portfolio totals.",
        "totals.openCostBaseAud",
        {
          holdings:
            holdingCostBaseAud,
          totals:
            snapshot.totals.openCostBaseAud,
        },
      ),
    );
  }

  if (
    !approximatelyEqual(
      holdingRealisedGainAud,
      snapshot.totals.realisedGainAud,
      tolerance,
    )
  ) {
    issues.push(
      reconciliationIssue(
        "Holdings realised gain does not reconcile with portfolio totals.",
        "totals.realisedGainAud",
        {
          holdings:
            holdingRealisedGainAud,
          totals:
            snapshot.totals.realisedGainAud,
        },
      ),
    );
  }

  if (
    !approximatelyEqual(
      holdingUnrealisedGainAud,
      snapshot.totals.unrealisedGainAud,
      tolerance,
    )
  ) {
    issues.push(
      reconciliationIssue(
        "Holdings unrealised gain does not reconcile with portfolio totals.",
        "totals.unrealisedGainAud",
        {
          holdings:
            holdingUnrealisedGainAud,
          totals:
            snapshot.totals.unrealisedGainAud,
        },
      ),
    );
  }

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
      reconciliationIssue(
        "Open holding weights do not total 100%.",
        "holdings.portfolioWeightPercent",
        holdingWeightPercent,
      ),
    );
  }

  const allocationDimensions:
    AllocationDimension[] = [
      "security",
      "assetClass",
      "sector",
      "industry",
      "country",
      "currency",
      "platform",
      "account",
      "strategy",
    ];

  for (const dimension of allocationDimensions) {
    const allocationValue =
      sumFinite(
        snapshot.allocation[
          dimension
        ].map(
          (slice) =>
            slice.marketValueAud,
        ),
      );

    if (
      !approximatelyEqual(
        allocationValue,
        snapshot.totals.securitiesMarketValueAud,
        tolerance,
      )
    ) {
      issues.push(
        reconciliationIssue(
          `${dimension} allocation does not reconcile with securities market value.`,
          `allocation.${dimension}`,
          {
            allocation:
              allocationValue,
            securitiesMarketValue:
              snapshot.totals.securitiesMarketValueAud,
          },
        ),
      );
    }
  }

  const expectedPortfolioValue =
    roundMoney(
      snapshot.totals.securitiesMarketValueAud +
      snapshot.totals.cashAud,
    );

  if (
    !approximatelyEqual(
      expectedPortfolioValue,
      snapshot.totals.portfolioValueAud,
      tolerance,
    )
  ) {
    issues.push(
      reconciliationIssue(
        "Portfolio value does not equal securities market value plus cash.",
        "totals.portfolioValueAud",
        {
          expected:
            expectedPortfolioValue,
          actual:
            snapshot.totals.portfolioValueAud,
        },
      ),
    );
  }

  return {
    valid:
      issues.length === 0,

    issues,

    holdingMarketValueAud,

    snapshotMarketValueAud:
      snapshot.totals.securitiesMarketValueAud,

    holdingCostBaseAud,

    snapshotCostBaseAud:
      snapshot.totals.openCostBaseAud,

    holdingRealisedGainAud,

    snapshotRealisedGainAud:
      snapshot.totals.realisedGainAud,

    holdingUnrealisedGainAud,

    snapshotUnrealisedGainAud:
      snapshot.totals.unrealisedGainAud,

    holdingWeightPercent,
  };
}

export function assertPortfolioSnapshotReconciles(
  snapshot: PortfolioSnapshot,
  tolerance = 0.02,
): void {
  const result =
    reconcilePortfolioSnapshot(
      snapshot,
      tolerance,
    );

  if (result.valid) {
    return;
  }

  const messages =
    result.issues
      .map(
        (issue) =>
          `- ${issue.message}`,
      )
      .join("\n");

  throw new Error(
    `Portfolio snapshot reconciliation failed:\n${messages}`,
  );
}
