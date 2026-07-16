import type {
  PortfolioDashboardSnapshot,
} from "./contracts";

import {
  approximatelyEqual,
  roundMoney,
  sumFinite,
} from "../money";

export type AttributionComponent = {
  id: string;
  label: string;
  amountAud: number;
  contributionPercent: number | null;
};

export type HoldingAttribution = {
  holdingId: string;
  ticker: string;
  sector: string;
  strategy: string;

  marketValueAud: number;
  costBaseAud: number;
  weightPercent: number;

  realisedGainAud: number;
  unrealisedGainAud: number;
  incomeAud: number;

  totalContributionAud: number;
  contributionPercent: number | null;
};

export type CategoryAttribution = {
  key: string;
  label: string;

  marketValueAud: number;
  portfolioWeightPercent: number;

  realisedGainAud: number;
  unrealisedGainAud: number;
  incomeAud: number;

  totalContributionAud: number;
  contributionPercent: number | null;

  holdingCount: number;
};

export type PerformanceAttributionSnapshot = {
  totalReturnAud: number;
  totalReturnPercent: number | null;

  realisedGainAud: number;
  unrealisedGainAud: number;
  incomeAud: number;
  feesAud: number;

  grossContributionAud: number;
  reconciledContributionAud: number;
  reconciliationDifferenceAud: number;
  reconciled: boolean;

  components: AttributionComponent[];

  holdings: HoldingAttribution[];
  topContributors: HoldingAttribution[];
  negativeContributors: HoldingAttribution[];

  sectors: CategoryAttribution[];
  strategies: CategoryAttribution[];
};

function contributionPercent(
  amountAud: number,
  totalReturnAud: number,
): number | null {
  if (
    !Number.isFinite(
      totalReturnAud,
    ) ||
    Math.abs(
      totalReturnAud,
    ) <
      0.000001
  ) {
    return null;
  }

  return roundMoney(
    (
      amountAud /
      Math.abs(
        totalReturnAud,
      )
    ) *
      100,
    4,
  );
}

function postedFeesAud(
  dashboard:
    PortfolioDashboardSnapshot,
): number {
  return roundMoney(
    sumFinite(
      dashboard.portfolio
        .transactions
        .filter(
          (transaction) =>
            transaction.status ===
              "posted",
        )
        .map(
          (transaction) =>
            transaction.amounts.fees,
        ),
    ),
  );
}

function holdingAttribution(
  dashboard:
    PortfolioDashboardSnapshot,
): HoldingAttribution[] {
  return dashboard.holdings
    .map(
      (
        holding,
      ): HoldingAttribution => {
        const totalContributionAud =
          roundMoney(
            holding.realisedGainAud +
            holding.unrealisedGainAud +
            holding.totalIncomeAud,
          );

        return {
          holdingId:
            holding.holdingId,

          ticker:
            holding.ticker,

          sector:
            holding.sector,

          strategy:
            holding.strategy,

          marketValueAud:
            holding.marketValueAud,

          costBaseAud:
            holding.costBaseAud,

          weightPercent:
            holding.portfolioWeightPercent,

          realisedGainAud:
            holding.realisedGainAud,

          unrealisedGainAud:
            holding.unrealisedGainAud,

          incomeAud:
            holding.totalIncomeAud,

          totalContributionAud,

          contributionPercent:
            contributionPercent(
              totalContributionAud,
              dashboard.totals
                .totalReturnAud,
            ),
        };
      },
    )
    .sort(
      (left, right) =>
        right.totalContributionAud -
        left.totalContributionAud,
    );
}

function categoryAttribution(
  holdings:
    readonly HoldingAttribution[],
  field:
    "sector" | "strategy",
  totalReturnAud:
    number,
): CategoryAttribution[] {
  const groups =
    new Map<
      string,
      HoldingAttribution[]
    >();

  for (const holding of holdings) {
    const label =
      holding[field] ||
      "Unclassified";

    const existing =
      groups.get(label) ??
      [];

    existing.push(
      holding,
    );

    groups.set(
      label,
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
      ): CategoryAttribution => {
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
                holding.incomeAud,
            ),
          );

        const totalContributionAud =
          roundMoney(
            realisedGainAud +
            unrealisedGainAud +
            incomeAud,
          );

        return {
          key,

          label:
            key,

          marketValueAud:
            sumFinite(
              group.map(
                (holding) =>
                  holding.marketValueAud,
              ),
            ),

          portfolioWeightPercent:
            sumFinite(
              group.map(
                (holding) =>
                  holding.weightPercent,
              ),
            ),

          realisedGainAud,

          unrealisedGainAud,

          incomeAud,

          totalContributionAud,

          contributionPercent:
            contributionPercent(
              totalContributionAud,
              totalReturnAud,
            ),

          holdingCount:
            group.length,
        };
      },
    )
    .sort(
      (left, right) =>
        right.totalContributionAud -
        left.totalContributionAud,
    );
}

export function buildPerformanceAttribution(
  dashboard:
    PortfolioDashboardSnapshot,
): PerformanceAttributionSnapshot {
  const realisedGainAud =
    dashboard.totals
      .realisedGainAud;

  const unrealisedGainAud =
    dashboard.totals
      .unrealisedGainAud;

  const incomeAud =
    dashboard.totals
      .totalIncomeAud;

  const feesAud =
    postedFeesAud(
      dashboard,
    );

  /**
   * Canonical total return already includes transaction fees in the realised
   * and open cost-base calculations. Fees are displayed as an informational
   * cost component and are not subtracted a second time.
   */
  const grossContributionAud =
    roundMoney(
      realisedGainAud +
      unrealisedGainAud +
      incomeAud,
    );

  const reconciledContributionAud =
    grossContributionAud;

  const reconciliationDifferenceAud =
    roundMoney(
      reconciledContributionAud -
      dashboard.totals
        .totalReturnAud,
    );

  const components:
    AttributionComponent[] = [
      {
        id:
          "unrealised",

        label:
          "Unrealised P/L",

        amountAud:
          unrealisedGainAud,

        contributionPercent:
          contributionPercent(
            unrealisedGainAud,
            dashboard.totals
              .totalReturnAud,
          ),
      },

      {
        id:
          "realised",

        label:
          "Realised P/L",

        amountAud:
          realisedGainAud,

        contributionPercent:
          contributionPercent(
            realisedGainAud,
            dashboard.totals
              .totalReturnAud,
          ),
      },

      {
        id:
          "income",

        label:
          "Received Income",

        amountAud:
          incomeAud,

        contributionPercent:
          contributionPercent(
            incomeAud,
            dashboard.totals
              .totalReturnAud,
          ),
      },

      {
        id:
          "fees",

        label:
          "Recorded Fees",

        amountAud:
          -feesAud,

        contributionPercent:
          contributionPercent(
            -feesAud,
            dashboard.totals
              .totalReturnAud,
          ),
      },
    ];

  const holdings =
    holdingAttribution(
      dashboard,
    );

  return {
    totalReturnAud:
      dashboard.totals
        .totalReturnAud,

    totalReturnPercent:
      dashboard.totals
        .totalReturnPercent,

    realisedGainAud,

    unrealisedGainAud,

    incomeAud,

    feesAud,

    grossContributionAud,

    reconciledContributionAud,

    reconciliationDifferenceAud,

    reconciled:
      approximatelyEqual(
        reconciledContributionAud,
        dashboard.totals
          .totalReturnAud,
        0.02,
      ),

    components,

    holdings,

    topContributors:
      holdings
        .filter(
          (holding) =>
            holding.totalContributionAud >
            0,
        )
        .slice(0, 10),

    negativeContributors:
      [...holdings]
        .filter(
          (holding) =>
            holding.totalContributionAud <
            0,
        )
        .sort(
          (left, right) =>
            left.totalContributionAud -
            right.totalContributionAud,
        )
        .slice(0, 10),

    sectors:
      categoryAttribution(
        holdings,
        "sector",
        dashboard.totals
          .totalReturnAud,
      ),

    strategies:
      categoryAttribution(
        holdings,
        "strategy",
        dashboard.totals
          .totalReturnAud,
      ),
  };
}
