import type {
  AllocationDimension,
  PortfolioAllocation,
  PortfolioHolding,
  PortfolioSnapshot,
  PortfolioTotals,
  ValidationIssue,
} from "../contracts";

import {
  snapshotToClosedStoreHoldings,
  snapshotToOpenStoreHoldings,
  snapshotToStoreHoldings,
} from "../adapters/holding-compatibility";

export function selectPortfolioSnapshot(
  snapshot: PortfolioSnapshot,
): PortfolioSnapshot {
  return snapshot;
}

export function selectCanonicalHoldings(
  snapshot: PortfolioSnapshot,
): PortfolioHolding[] {
  return snapshot.holdings;
}

export function selectCanonicalOpenHoldings(
  snapshot: PortfolioSnapshot,
): PortfolioHolding[] {
  return snapshot.openHoldings;
}

export function selectCanonicalClosedHoldings(
  snapshot: PortfolioSnapshot,
): PortfolioHolding[] {
  return snapshot.closedHoldings;
}

export function selectApplicationHoldings(
  snapshot: PortfolioSnapshot,
) {
  return snapshotToStoreHoldings(
    snapshot,
  );
}

export function selectApplicationOpenHoldings(
  snapshot: PortfolioSnapshot,
) {
  return snapshotToOpenStoreHoldings(
    snapshot,
  );
}

export function selectApplicationClosedHoldings(
  snapshot: PortfolioSnapshot,
) {
  return snapshotToClosedStoreHoldings(
    snapshot,
  );
}

export function selectPortfolioTotals(
  snapshot: PortfolioSnapshot,
): PortfolioTotals {
  return snapshot.totals;
}

export function selectPortfolioAllocation(
  snapshot: PortfolioSnapshot,
): PortfolioAllocation {
  return snapshot.allocation;
}

export function selectAllocationDimension(
  snapshot: PortfolioSnapshot,
  dimension: AllocationDimension,
) {
  return snapshot.allocation[
    dimension
  ];
}

export function selectPortfolioIssues(
  snapshot: PortfolioSnapshot,
): ValidationIssue[] {
  return snapshot.dataQuality.issues;
}

export function selectPortfolioHasErrors(
  snapshot: PortfolioSnapshot,
): boolean {
  return (
    snapshot.dataQuality.errorCount >
    0
  );
}

export function selectPortfolioHasFallbackQuotes(
  snapshot: PortfolioSnapshot,
): boolean {
  return (
    snapshot.dataQuality
      .fallbackQuoteCount >
    0
  );
}

export function selectPortfolioMarketValueAud(
  snapshot: PortfolioSnapshot,
): number {
  return snapshot.totals
    .securitiesMarketValueAud;
}

export function selectPortfolioValueAud(
  snapshot: PortfolioSnapshot,
): number {
  return snapshot.totals
    .portfolioValueAud;
}

export function selectOpenCostBaseAud(
  snapshot: PortfolioSnapshot,
): number {
  return snapshot.totals
    .openCostBaseAud;
}

export function selectRealisedGainAud(
  snapshot: PortfolioSnapshot,
): number {
  return snapshot.totals
    .realisedGainAud;
}

export function selectUnrealisedGainAud(
  snapshot: PortfolioSnapshot,
): number {
  return snapshot.totals
    .unrealisedGainAud;
}

export function selectTotalReturnAud(
  snapshot: PortfolioSnapshot,
): number {
  return snapshot.totals
    .totalReturnAud;
}

export function selectTotalReturnPercent(
  snapshot: PortfolioSnapshot,
): number {
  return snapshot.totals
    .totalReturnPercent;
}
