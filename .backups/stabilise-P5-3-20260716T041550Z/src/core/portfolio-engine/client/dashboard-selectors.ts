import type {
  AllocationDimension,
} from "../contracts";

import type {
  DashboardAllocationRow,
  DashboardHoldingRow,
  PortfolioDashboardSnapshot,
} from "../dashboard/contracts";

import {
  reconcilePortfolioDashboard,
} from "../dashboard/reconcile";

import {
  buildPortfolioHealth,
} from "../dashboard/health";

import {
  buildPerformanceAttribution,
} from "../dashboard/attribution";

export function selectDashboardSnapshot(
  dashboard: PortfolioDashboardSnapshot,
): PortfolioDashboardSnapshot {
  return dashboard;
}

export function selectDashboardHoldings(
  dashboard: PortfolioDashboardSnapshot,
): DashboardHoldingRow[] {
  return dashboard.holdings;
}

export function selectDashboardTopHoldings(
  dashboard: PortfolioDashboardSnapshot,
): DashboardHoldingRow[] {
  return dashboard.topHoldings;
}

export function selectDashboardAllocation(
  dashboard: PortfolioDashboardSnapshot,
  dimension: AllocationDimension,
): DashboardAllocationRow[] {
  return dashboard.allocation[
    dimension
  ];
}

export function selectDashboardMarketValueAud(
  dashboard: PortfolioDashboardSnapshot,
): number {
  return dashboard.totals
    .securitiesMarketValueAud;
}

export function selectDashboardPortfolioValueAud(
  dashboard: PortfolioDashboardSnapshot,
): number {
  return dashboard.totals
    .portfolioValueAud;
}

export function selectDashboardCostBaseAud(
  dashboard: PortfolioDashboardSnapshot,
): number {
  return dashboard.totals
    .openCostBaseAud;
}

export function selectDashboardRealisedGainAud(
  dashboard: PortfolioDashboardSnapshot,
): number {
  return dashboard.totals
    .realisedGainAud;
}

export function selectDashboardUnrealisedGainAud(
  dashboard: PortfolioDashboardSnapshot,
): number {
  return dashboard.totals
    .unrealisedGainAud;
}

export function selectDashboardTotalReturnAud(
  dashboard: PortfolioDashboardSnapshot,
): number {
  return dashboard.totals
    .totalReturnAud;
}

export function selectDashboardTotalReturnPercent(
  dashboard: PortfolioDashboardSnapshot,
): number | null {
  return dashboard.totals
    .totalReturnPercent;
}

export function selectDashboardForwardDividendIncomeAud(
  dashboard: PortfolioDashboardSnapshot,
): number {
  return dashboard.dividendsSummary
    .forwardTwelveMonthIncomeAud;
}

export function selectDashboardMonthlyDividendIncomeAud(
  dashboard: PortfolioDashboardSnapshot,
): number {
  return dashboard.dividendsSummary
    .monthlyForwardIncomeAud;
}

export function selectDashboardDividendYieldPercent(
  dashboard: PortfolioDashboardSnapshot,
): number | null {
  return dashboard.dividendsSummary
    .portfolioDividendYieldPercent;
}

export function selectDashboardYieldOnCostPercent(
  dashboard: PortfolioDashboardSnapshot,
): number | null {
  return dashboard.dividendsSummary
    .portfolioYieldOnCostPercent;
}

export function selectDashboardPricingCoveragePercent(
  dashboard: PortfolioDashboardSnapshot,
): number {
  return dashboard.pricing
    .pricingCoveragePercent;
}

export function selectDashboardReconciliation(
  dashboard: PortfolioDashboardSnapshot,
) {
  return reconcilePortfolioDashboard(
    dashboard,
  );
}

export function selectPortfolioHealth(
  dashboard: PortfolioDashboardSnapshot,
) {
  return buildPortfolioHealth(
    dashboard,
  );
}

export function selectPerformanceAttribution(
  dashboard: PortfolioDashboardSnapshot,
) {
  return buildPerformanceAttribution(
    dashboard,
  );
}

export function selectDashboardHasErrors(
  dashboard: PortfolioDashboardSnapshot,
): boolean {
  return (
    dashboard.dataQuality.status ===
      "ERROR" ||
    dashboard.dataQuality
      .reconciliationErrorCount >
      0
  );
}

export function selectDashboardIsDegraded(
  dashboard: PortfolioDashboardSnapshot,
): boolean {
  return (
    dashboard.dataQuality.status ===
    "DEGRADED"
  );
}
