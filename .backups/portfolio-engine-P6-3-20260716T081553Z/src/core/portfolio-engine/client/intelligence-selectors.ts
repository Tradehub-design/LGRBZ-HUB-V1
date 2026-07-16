import type {
  PortfolioAnalyticsSnapshot,
} from "../analytics/contracts";

import type {
  PortfolioReportSnapshot,
} from "../reports/contracts";

import type {
  PortfolioTaxSnapshot,
} from "../tax/contracts";

import {
  reconcilePortfolioAnalytics,
} from "../analytics/reconcile";

export function selectPortfolioAnalytics(
  analytics:
    PortfolioAnalyticsSnapshot,
): PortfolioAnalyticsSnapshot {
  return analytics;
}

export function selectAnalyticsWinners(
  analytics:
    PortfolioAnalyticsSnapshot,
) {
  return analytics.winners;
}

export function selectAnalyticsLosers(
  analytics:
    PortfolioAnalyticsSnapshot,
) {
  return analytics.losers;
}

export function selectAnalyticsSectorPerformance(
  analytics:
    PortfolioAnalyticsSnapshot,
) {
  return analytics.performanceBySector;
}

export function selectAnalyticsCountryPerformance(
  analytics:
    PortfolioAnalyticsSnapshot,
) {
  return analytics.performanceByCountry;
}

export function selectAnalyticsStrategyPerformance(
  analytics:
    PortfolioAnalyticsSnapshot,
) {
  return analytics.performanceByStrategy;
}

export function selectAnalyticsReconciliation(
  analytics:
    PortfolioAnalyticsSnapshot,
) {
  return reconcilePortfolioAnalytics(
    analytics,
  );
}

export function selectPortfolioTax(
  tax:
    PortfolioTaxSnapshot,
): PortfolioTaxSnapshot {
  return tax;
}

export function selectPortfolioReports(
  reports:
    PortfolioReportSnapshot,
): PortfolioReportSnapshot {
  return reports;
}
