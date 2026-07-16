import type {
  PortfolioHolding as StoreHolding,
} from "@/store/portfolioStore";

import type {
  AllocationDimension,
  PortfolioSnapshot,
  ValidationIssue,
} from "../contracts";

import {
  approximatelyEqual,
  roundMoney,
  sumFinite,
} from "../money";

import {
  snapshotToClosedStoreHoldings,
  snapshotToOpenStoreHoldings,
  snapshotToStoreHoldings,
} from "../adapters/holding-compatibility";

export type HoldingsReconciliationResult = {
  valid: boolean;
  issues: ValidationIssue[];

  canonicalHoldingCount: number;
  applicationHoldingCount: number;

  canonicalOpenCount: number;
  applicationOpenCount: number;

  canonicalClosedCount: number;
  applicationClosedCount: number;

  canonicalMarketValueAud: number;
  applicationMarketValueAud: number;

  canonicalCostBaseAud: number;
  applicationCostBaseAud: number;

  canonicalRealisedGainAud: number;
  applicationRealisedGainAud: number;

  canonicalUnrealisedGainAud: number;
  applicationUnrealisedGainAud: number;

  applicationWeightPercent: number;
};

function issue(
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

function openStoreHoldings(
  holdings: readonly StoreHolding[],
): StoreHolding[] {
  return holdings.filter(
    (holding) =>
      String(
        holding.status,
      ).toLowerCase() !==
      "closed",
  );
}

function closedStoreHoldings(
  holdings: readonly StoreHolding[],
): StoreHolding[] {
  return holdings.filter(
    (holding) =>
      String(
        holding.status,
      ).toLowerCase() ===
      "closed",
  );
}

export function reconcileApplicationHoldings(
  snapshot: PortfolioSnapshot,
  tolerance = 0.02,
): HoldingsReconciliationResult {
  const applicationHoldings =
    snapshotToStoreHoldings(
      snapshot,
    );

  const applicationOpen =
    openStoreHoldings(
      applicationHoldings,
    );

  const applicationClosed =
    closedStoreHoldings(
      applicationHoldings,
    );

  const explicitlyMappedOpen =
    snapshotToOpenStoreHoldings(
      snapshot,
    );

  const explicitlyMappedClosed =
    snapshotToClosedStoreHoldings(
      snapshot,
    );

  const issues: ValidationIssue[] = [];

  const applicationMarketValueAud =
    sumFinite(
      applicationOpen.map(
        (holding) =>
          holding.marketValueAud,
      ),
    );

  const applicationCostBaseAud =
    sumFinite(
      applicationOpen.map(
        (holding) =>
          holding.costBaseAud,
      ),
    );

  const applicationRealisedGainAud =
    sumFinite(
      applicationHoldings.map(
        (holding) =>
          holding.realisedPlAud,
      ),
    );

  const applicationUnrealisedGainAud =
    sumFinite(
      applicationOpen.map(
        (holding) =>
          holding.unrealisedPlAud,
      ),
    );

  const applicationWeightPercent =
    roundMoney(
      applicationOpen.reduce(
        (sum, holding) =>
          sum +
          holding.portfolioWeightPercent,
        0,
      ),
      4,
    );

  if (
    applicationHoldings.length !==
    snapshot.holdings.length
  ) {
    issues.push(
      issue(
        "Application holding count does not match the canonical snapshot.",
        "holdings.length",
        {
          application:
            applicationHoldings.length,
          canonical:
            snapshot.holdings.length,
        },
      ),
    );
  }

  if (
    applicationOpen.length !==
    snapshot.openHoldings.length
  ) {
    issues.push(
      issue(
        "Application open holding count does not match the canonical snapshot.",
        "openHoldings.length",
        {
          application:
            applicationOpen.length,
          canonical:
            snapshot.openHoldings.length,
        },
      ),
    );
  }

  if (
    applicationClosed.length !==
    snapshot.closedHoldings.length
  ) {
    issues.push(
      issue(
        "Application closed holding count does not match the canonical snapshot.",
        "closedHoldings.length",
        {
          application:
            applicationClosed.length,
          canonical:
            snapshot.closedHoldings.length,
        },
      ),
    );
  }

  if (
    explicitlyMappedOpen.length !==
    snapshot.openHoldings.length
  ) {
    issues.push(
      issue(
        "Explicit open-holdings adapter lost canonical positions.",
        "snapshotToOpenStoreHoldings",
        {
          mapped:
            explicitlyMappedOpen.length,
          canonical:
            snapshot.openHoldings.length,
        },
      ),
    );
  }

  if (
    explicitlyMappedClosed.length !==
    snapshot.closedHoldings.length
  ) {
    issues.push(
      issue(
        "Explicit closed-holdings adapter lost canonical positions.",
        "snapshotToClosedStoreHoldings",
        {
          mapped:
            explicitlyMappedClosed.length,
          canonical:
            snapshot.closedHoldings.length,
        },
      ),
    );
  }

  if (
    !approximatelyEqual(
      applicationMarketValueAud,
      snapshot.totals.securitiesMarketValueAud,
      tolerance,
    )
  ) {
    issues.push(
      issue(
        "Application holdings market value does not match canonical totals.",
        "totals.securitiesMarketValueAud",
        {
          application:
            applicationMarketValueAud,
          canonical:
            snapshot.totals.securitiesMarketValueAud,
        },
      ),
    );
  }

  if (
    !approximatelyEqual(
      applicationCostBaseAud,
      snapshot.totals.openCostBaseAud,
      tolerance,
    )
  ) {
    issues.push(
      issue(
        "Application holdings cost base does not match canonical totals.",
        "totals.openCostBaseAud",
        {
          application:
            applicationCostBaseAud,
          canonical:
            snapshot.totals.openCostBaseAud,
        },
      ),
    );
  }

  if (
    !approximatelyEqual(
      applicationRealisedGainAud,
      snapshot.totals.realisedGainAud,
      tolerance,
    )
  ) {
    issues.push(
      issue(
        "Application realised P/L does not match canonical totals.",
        "totals.realisedGainAud",
        {
          application:
            applicationRealisedGainAud,
          canonical:
            snapshot.totals.realisedGainAud,
        },
      ),
    );
  }

  if (
    !approximatelyEqual(
      applicationUnrealisedGainAud,
      snapshot.totals.unrealisedGainAud,
      tolerance,
    )
  ) {
    issues.push(
      issue(
        "Application unrealised P/L does not match canonical totals.",
        "totals.unrealisedGainAud",
        {
          application:
            applicationUnrealisedGainAud,
          canonical:
            snapshot.totals.unrealisedGainAud,
        },
      ),
    );
  }

  if (
    snapshot.openHoldings.length > 0 &&
    snapshot.totals.securitiesMarketValueAud > 0 &&
    !approximatelyEqual(
      applicationWeightPercent,
      100,
      0.02,
    )
  ) {
    issues.push(
      issue(
        "Application open holding weights do not total 100%.",
        "portfolioWeightPercent",
        applicationWeightPercent,
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
        applicationMarketValueAud,
        tolerance,
      )
    ) {
      issues.push(
        issue(
          `${dimension} allocation does not match application holdings market value.`,
          `allocation.${dimension}`,
          {
            allocation:
              allocationValue,
            applicationHoldings:
              applicationMarketValueAud,
          },
        ),
      );
    }
  }

  return {
    valid:
      issues.length === 0,

    issues,

    canonicalHoldingCount:
      snapshot.holdings.length,

    applicationHoldingCount:
      applicationHoldings.length,

    canonicalOpenCount:
      snapshot.openHoldings.length,

    applicationOpenCount:
      applicationOpen.length,

    canonicalClosedCount:
      snapshot.closedHoldings.length,

    applicationClosedCount:
      applicationClosed.length,

    canonicalMarketValueAud:
      snapshot.totals.securitiesMarketValueAud,

    applicationMarketValueAud,

    canonicalCostBaseAud:
      snapshot.totals.openCostBaseAud,

    applicationCostBaseAud,

    canonicalRealisedGainAud:
      snapshot.totals.realisedGainAud,

    applicationRealisedGainAud,

    canonicalUnrealisedGainAud:
      snapshot.totals.unrealisedGainAud,

    applicationUnrealisedGainAud,

    applicationWeightPercent,
  };
}

export function assertApplicationHoldingsReconcile(
  snapshot: PortfolioSnapshot,
  tolerance = 0.02,
): void {
  const reconciliation =
    reconcileApplicationHoldings(
      snapshot,
      tolerance,
    );

  if (reconciliation.valid) {
    return;
  }

  throw new Error(
    [
      "Application holdings reconciliation failed:",
      ...reconciliation.issues.map(
        (entry) =>
          `- ${entry.message}`,
      ),
    ].join("\n"),
  );
}
