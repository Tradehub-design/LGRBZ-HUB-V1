import {
  calculateAllocations,
} from "./allocations";

import {
  calculateCashAccounts,
} from "./cash";

import {
  calculateDividends,
} from "./dividends";

import {
  calculateHoldings,
} from "./holdings";

import {
  calculateMemberContributions,
} from "./contributions";

import {
  parseMasterLedger,
} from "./parser";

import {
  buildSummary,
} from "./summary";

import type {
  PortfolioEngineResult,
} from "./types";

export function buildPortfolio(
  csv: string,
): PortfolioEngineResult {
  const parsed =
    parseMasterLedger(csv);

  const holdings =
    calculateHoldings(parsed.rows);

  const cash =
    calculateCashAccounts(parsed.rows);

  const dividends =
    calculateDividends(parsed.rows);

  const contributions =
    calculateMemberContributions(
      parsed.rows,
    );

  const allocation =
    calculateAllocations(holdings);

  const summary =
    buildSummary(
      parsed.rows,
      holdings,
      cash,
      dividends,
    );

  return {
    generatedAt:
      new Date().toISOString(),

    sourceRows: parsed.rows.length,

    validRows: parsed.rows.length,

    invalidRows: parsed.issues,

    transactions: parsed.rows,

    holdings,

    cashAccounts: cash,

    dividends,

    memberContributions:
      contributions,

    allocation,

    summary,
  };
}
