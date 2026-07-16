import type {
  PortfolioDividendEvent,
  PortfolioDividendHoldingSummary,
  PortfolioDividendSnapshot,
} from "../dividends/contracts";

import {
  reconcilePortfolioDividends,
} from "../dividends/reconcile";

export function selectPortfolioDividendSnapshot(
  snapshot:
    PortfolioDividendSnapshot,
): PortfolioDividendSnapshot {
  return snapshot;
}

export function selectHistoricalDividendEvents(
  snapshot:
    PortfolioDividendSnapshot,
): PortfolioDividendEvent[] {
  return snapshot.historicalEvents;
}

export function selectUpcomingDividendEvents(
  snapshot:
    PortfolioDividendSnapshot,
): PortfolioDividendEvent[] {
  return snapshot.upcomingEvents;
}

export function selectAnnouncedDividendEvents(
  snapshot:
    PortfolioDividendSnapshot,
): PortfolioDividendEvent[] {
  return snapshot.announcedEvents;
}

export function selectForecastDividendEvents(
  snapshot:
    PortfolioDividendSnapshot,
): PortfolioDividendEvent[] {
  return snapshot.forecastEvents;
}

export function selectReceivedDividendEvents(
  snapshot:
    PortfolioDividendSnapshot,
): PortfolioDividendEvent[] {
  return snapshot.receivedEvents;
}

export function selectDividendHoldingSummaries(
  snapshot:
    PortfolioDividendSnapshot,
): PortfolioDividendHoldingSummary[] {
  return snapshot.holdingSummaries;
}

export function selectForwardDividendIncomeAud(
  snapshot:
    PortfolioDividendSnapshot,
): number {
  return snapshot.totals
    .forwardTwelveMonthIncomeAud;
}

export function selectMonthlyDividendIncomeAud(
  snapshot:
    PortfolioDividendSnapshot,
): number {
  return snapshot.totals
    .monthlyForwardIncomeAud;
}

export function selectTrailingDividendIncomeAud(
  snapshot:
    PortfolioDividendSnapshot,
): number {
  return snapshot.totals
    .trailingTwelveMonthIncomeAud;
}

export function selectReceivedFinancialYearIncomeAud(
  snapshot:
    PortfolioDividendSnapshot,
): number {
  return snapshot.totals
    .receivedCurrentFinancialYearAud;
}

export function selectPortfolioDividendYieldPercent(
  snapshot:
    PortfolioDividendSnapshot,
): number | null {
  return snapshot.totals
    .portfolioDividendYieldPercent;
}

export function selectPortfolioYieldOnCostPercent(
  snapshot:
    PortfolioDividendSnapshot,
): number | null {
  return snapshot.totals
    .portfolioYieldOnCostPercent;
}

export function selectProjectedFrankingCreditsAud(
  snapshot:
    PortfolioDividendSnapshot,
): number {
  return snapshot.totals
    .projectedFrankingCreditsAud;
}

export function selectEstimatedDividendTaxAud(
  snapshot:
    PortfolioDividendSnapshot,
): number {
  return snapshot.totals
    .estimatedTaxAud;
}

export function selectEstimatedWithholdingTaxAud(
  snapshot:
    PortfolioDividendSnapshot,
): number {
  return snapshot.totals
    .estimatedWithholdingTaxAud;
}

export function selectNextDividendEvent(
  snapshot:
    PortfolioDividendSnapshot,
): PortfolioDividendEvent | null {
  return snapshot.nextEvent;
}

export function selectDividendDataHasErrors(
  snapshot:
    PortfolioDividendSnapshot,
): boolean {
  return (
    snapshot.dataQuality
      .errors.length >
    0
  );
}

export function selectDividendDataIsDegraded(
  snapshot:
    PortfolioDividendSnapshot,
): boolean {
  return (
    snapshot.dataQuality
      .status ===
      "DEGRADED"
  );
}

export function selectDividendReconciliation(
  snapshot:
    PortfolioDividendSnapshot,
) {
  return reconcilePortfolioDividends(
    snapshot,
  );
}
