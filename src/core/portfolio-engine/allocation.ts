import type {
  AllocationDimension,
  AllocationSlice,
  PortfolioAllocation,
  PortfolioHolding,
} from "./contracts";

import {
  addMoney,
  percentage,
  roundMoney,
} from "./money";

const ALLOCATION_DIMENSIONS: readonly AllocationDimension[] = [
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

function allocationIdentity(
  holding: PortfolioHolding,
  dimension: AllocationDimension,
): {
  key: string;
  label: string;
} {
  switch (dimension) {
    case "security":
      return {
        key:
          holding.security.securityId,

        label:
          holding.security.ticker,
      };

    case "assetClass":
      return {
        key:
          holding.classification.assetClass ||
          "Unclassified",

        label:
          holding.classification.assetClass ||
          "Unclassified",
      };

    case "sector":
      return {
        key:
          holding.classification.sector ||
          "Unclassified",

        label:
          holding.classification.sector ||
          "Unclassified",
      };

    case "industry":
      return {
        key:
          holding.classification.industry ||
          "Unclassified",

        label:
          holding.classification.industry ||
          "Unclassified",
      };

    case "country":
      return {
        key:
          holding.classification.country ||
          "Unclassified",

        label:
          holding.classification.country ||
          "Unclassified",
      };

    case "currency":
      return {
        key:
          holding.currency,

        label:
          holding.currency,
      };

    case "platform":
      return {
        key:
          holding.account.platform ||
          "Unassigned",

        label:
          holding.account.platform ||
          "Unassigned",
      };

    case "account":
      return {
        key:
          holding.account.accountId,

        label:
          holding.account.accountName ||
          holding.account.accountId,
      };

    case "strategy":
      return {
        key:
          holding.classification.strategy ||
          "Unclassified",

        label:
          holding.classification.strategy ||
          "Unclassified",
      };
  }
}

function buildDimension(
  holdings: readonly PortfolioHolding[],
  dimension: AllocationDimension,
  securitiesMarketValueAud: number,
): AllocationSlice[] {
  const groups = new Map<
    string,
    {
      label: string;
      marketValueAud: number;
      holdingIds: Set<string>;
    }
  >();

  for (const holding of holdings) {
    if (
      holding.status !== "OPEN" ||
      holding.quantity <= 0
    ) {
      continue;
    }

    const identity =
      allocationIdentity(
        holding,
        dimension,
      );

    const existing =
      groups.get(identity.key);

    if (existing) {
      existing.marketValueAud =
        addMoney(
          existing.marketValueAud,
          holding.valuation.marketValueAud,
        );

      existing.holdingIds.add(
        holding.holdingId,
      );

      continue;
    }

    groups.set(
      identity.key,
      {
        label:
          identity.label,

        marketValueAud:
          roundMoney(
            holding.valuation.marketValueAud,
          ),

        holdingIds:
          new Set([holding.holdingId]),
      },
    );
  }

  return Array.from(
    groups.entries(),
  )
    .map(
      ([key, group]): AllocationSlice => ({
        key,

        label:
          group.label,

        marketValueAud:
          group.marketValueAud,

        percent:
          percentage(
            group.marketValueAud,
            securitiesMarketValueAud,
            0,
          ),

        holdingCount:
          group.holdingIds.size,
      }),
    )
    .sort((left, right) => {
      const valueDifference =
        right.marketValueAud -
        left.marketValueAud;

      if (valueDifference !== 0) {
        return valueDifference;
      }

      return left.label.localeCompare(
        right.label,
      );
    });
}

export function createEmptyAllocation(): PortfolioAllocation {
  return {
    security: [],
    assetClass: [],
    sector: [],
    industry: [],
    country: [],
    currency: [],
    platform: [],
    account: [],
    strategy: [],
  };
}

export function buildPortfolioAllocation(
  holdings: readonly PortfolioHolding[],
  securitiesMarketValueAud: number,
): PortfolioAllocation {
  const allocation =
    createEmptyAllocation();

  for (const dimension of ALLOCATION_DIMENSIONS) {
    allocation[dimension] =
      buildDimension(
        holdings,
        dimension,
        securitiesMarketValueAud,
      );
  }

  return allocation;
}

export function allocationPercentTotal(
  slices: readonly AllocationSlice[],
): number {
  return roundMoney(
    slices.reduce(
      (sum, slice) =>
        sum + slice.percent,
      0,
    ),
    4,
  );
}
